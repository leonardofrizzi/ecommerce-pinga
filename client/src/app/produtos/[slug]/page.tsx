"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi"; // Certifique-se que react-icons está no package.json
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { slugify } from "@/utils/slugify";
import { API_BASE_URL } from "@/utils/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  volume: string;
  unidadesPorCaixa: number;
  pesoUnitario: string;
  pesoCaixa: string;
}

interface ShippingOption {
  code: string;
  service: "PAC" | "SEDEX" | "Desconhecido";
  price: number;
  deadline: number;
}

// Removida a interface ProductPageProps

// MUDANÇA AQUI: Tipagem inline para os props
export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params; // slug é extraído de params
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [zip, setZip] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [
    selectedShippingOption,
    setSelectedShippingOption,
  ] = useState<ShippingOption | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/produtos`)
      .then((res) => {
        if (!res.ok) throw new Error(`Falha ao buscar produtos: ${res.status}`);
        return res.json();
      })
      .then((data: Product[]) => {
        setAllProducts(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar produtos:", err);
        setAllProducts([]);
      });
  }, []);

  useEffect(() => {
    if (allProducts.length > 0 && slug) {
      const found = allProducts.find((p) => slugify(p.name) === slug) || null;
      setProduct(found);
      if (found) {
        setQuantity(1);
        setZip("");
        setShippingError(null);
        setShippingOptions([]);
        setSelectedShippingOption(null);
      }
    } else if (slug) {
      setProduct(null);
    }
  }, [allProducts, slug]);

  const calculateShipping = async () => {
    if (!product) {
      setShippingError("Produto não carregado. Por favor, recarregue a página.");
      return;
    }
    console.log("FRONTEND: Produto sendo usado para cálculo:", JSON.stringify(product, null, 2));

    if (zip.replace(/\D/g, "").length !== 8) {
      setShippingError("Informe um CEP válido com 8 dígitos.");
      return;
    }
    if (!product.pesoUnitario) {
      setShippingError("Peso unitário do produto não cadastrado.");
      return;
    }
    const pesoUnitarioParsed = parseFloat(product.pesoUnitario.replace(",", "."));
    console.log("FRONTEND: Peso unitário parseado (antes da conversão KG/G):", pesoUnitarioParsed);

    if (isNaN(pesoUnitarioParsed)) {
      setShippingError("Peso unitário do produto é inválido (não é um número).");
      return;
    }

    setIsCalculating(true);
    setShippingError(null);
    setShippingOptions([]);
    setSelectedShippingOption(null);

    try {
      const pesoUnitarioKgResult = pesoUnitarioParsed;
      console.log("FRONTEND: Peso unitário em KG:", pesoUnitarioKgResult);

      if (isNaN(pesoUnitarioKgResult) || pesoUnitarioKgResult <= 0) {
        setShippingError("Peso unitário (em KG) do produto é inválido ou zero.");
        setIsCalculating(false);
        return;
      }

      const pesoTotalCalculado = (quantity * pesoUnitarioKgResult).toFixed(3);
      const valorTotalDeclarado = (product.price * quantity).toFixed(2);

      console.log("FRONTEND: Dados para URL de frete:", {
        cepDestino: zip,
        peso: pesoTotalCalculado,
        valor: valorTotalDeclarado,
      });

      if (pesoTotalCalculado === "NaN" || parseFloat(pesoTotalCalculado) <= 0) {
        setShippingError("Peso total calculado é NaN ou zero/negativo no frontend.");
        setIsCalculating(false);
        return;
      }
      if (valorTotalDeclarado === "NaN" || parseFloat(valorTotalDeclarado) < 0) {
        setShippingError("Valor total declarado é NaN ou negativo no frontend.");
        setIsCalculating(false);
        return;
      }

      const url = `${API_BASE_URL}/api/frete?cepDestino=${zip}&peso=${pesoTotalCalculado}&valor=${valorTotalDeclarado}`;
      console.log("FRONTEND: URL da requisição de frete:", url);

      const res = await fetch(url);
      const payload = await res.json();
      console.log("FRONTEND: Resposta de /api/frete:", payload);

      if (!res.ok) {
        const errorMessage = payload?.error || `Erro ${res.status} ao calcular frete. Tente novamente.`;
        throw new Error(errorMessage);
      }

      if (!Array.isArray(payload)) {
        console.error("Formato de resposta inesperado da API de frete:", payload);
        throw new Error("Resposta inválida do servidor de frete.");
      }

      const validOptions = payload as ShippingOption[];

      if (validOptions.length === 0) {
        setShippingError("Nenhuma opção de frete disponível para este CEP e produto. Verifique os dados ou tente mais tarde.");
      } else {
        setShippingOptions(validOptions);
        setSelectedShippingOption(validOptions[0]);
        setShippingError(null);
      }

    } catch (err: unknown) {
      console.error("FRONTEND CATCH: Erro ao calcular frete:", err);
      let message = "Não foi possível calcular o frete. Verifique sua conexão e tente novamente.";
      if (err instanceof Error) {
          message = err.message;
      }
      setShippingError(message);
      setShippingOptions([]);
      setSelectedShippingOption(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const related = useMemo(() => {
    if (!product || !allProducts.length) return [];
    return allProducts
      .filter((p) => p._id !== product._id && p.category === product.category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [allProducts, product]);

  if (!product) {
    if (slug && allProducts.length > 0) {
      return <p className="pt-[50px] text-center text-red-500">{`Produto com identificador '${slug}' não encontrado.`}</p>;
    }
    return <p className="pt-[50px] text-center">Carregando dados do produto...</p>;
  }

  const handleAddToCart = () => {
    if (!product) return;
    if (shippingOptions.length > 0 && !selectedShippingOption && !shippingError) {
      alert("Por favor, selecione uma opção de frete.");
      return;
    }
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: (product.images && product.images.length > 0) ? product.images[0] : "/default-product-placeholder.png",
      quantity,
      shipping: selectedShippingOption || undefined,
    });
    alert(`${quantity}x "${product.name}" adicionado(s) ao carrinho!`);
  };

  return (
    <div className="pt-[50px] pb-16 px-6 md:px-0">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2">
          <div className="relative overflow-hidden rounded-xl shadow-lg h-[450px] sm:h-[550px]">
            <Image
              src={(product.images && product.images.length > 0) ? product.images[0] : "/default-product-placeholder.png"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            />
          </div>
        </div>
        <div className="w-full lg:w-1/2 space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-2xl sm:text-3xl text-[#0d1b2b] font-semibold">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            {product.description}
          </p>
          <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-wrap gap-x-6 gap-y-3">
            <div className="flex-1 min-w-[140px] text-sm"><strong>Volume:</strong> {product.volume}</div>
            <div className="flex-1 min-w-[140px] text-sm"><strong>Qtd. por Caixa:</strong> {product.unidadesPorCaixa}</div>
            <div className="flex-1 min-w-[140px] text-sm"><strong>Peso Unitário:</strong> {product.pesoUnitario} kg</div>
            <div className="flex-1 min-w-[140px] text-sm"><strong>Peso Caixa:</strong> {product.pesoCaixa} kg</div>
          </div>
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="sm:flex-shrink-0">
                <label htmlFor="product-quantity" className="block mb-1 font-medium text-sm text-gray-700">Quantidade:</label>
                <input id="product-quantity" type="number" min={1} value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full sm:w-24 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#CDAF70] focus:border-[#CDAF70] outline-none shadow-sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <label htmlFor="zipcode-input" className="block mb-1 font-medium text-sm text-gray-700">CEP (somente números):</label>
                <div className="flex gap-2">
                  <input id="zipcode-input" type="tel" maxLength={8} value={zip}
                    onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                    placeholder="00000000"
                    className="flex-grow border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] focus:border-[#CDAF70] outline-none shadow-sm"
                  />
                  <button onClick={calculateShipping} disabled={isCalculating || zip.replace(/\D/g, "").length !== 8}
                    className="bg-[#0d1b2b] text-white px-5 py-2 rounded-xl hover:bg-[#CDAF70] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out shadow-sm font-medium"
                  >
                    {isCalculating ? "Calculando..." : "Calcular Frete"}
                  </button>
                </div>
              </div>
            </div>
            {shippingError && (
              <div role="alert" className="mt-2 text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-300">
                <p><span className="font-semibold">Atenção:</span> {shippingError}</p>
              </div>
            )}
            {shippingOptions.length > 0 && !shippingError && (
              <div className="mt-3">
                <label htmlFor="shipping-options-select" className="block mb-1 font-medium text-sm text-gray-700">Opções de entrega:</label>
                <select id="shipping-options-select" value={selectedShippingOption?.code || ""}
                  onChange={(e) => {
                    const newSelection = shippingOptions.find((o) => o.code === e.target.value) || null;
                    setSelectedShippingOption(newSelection);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-[#CDAF70] focus:border-[#CDAF70] sm:text-sm rounded-xl shadow-sm bg-white"
                >
                  {shippingOptions.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.service} – R$ {opt.price.toFixed(2).replace(".", ",")} ({opt.deadline} dia{opt.deadline !== 1 ? 's úteis' : ' útil'})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button onClick={handleAddToCart}
            disabled={!product || product.price <= 0 || isCalculating || (shippingOptions.length > 0 && !selectedShippingOption && !shippingError) }
            className="w-full flex items-center justify-center gap-2 bg-[#0d1b2b] text-white px-6 py-3.5 rounded-xl transition-colors hover:bg-[#CDAF70] font-semibold text-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FiShoppingCart size={22} /> Adicionar ao Carrinho
          </button>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16 max-w-screen-xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Você também pode gostar</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id}
                product={{
                  id: p._id, name: p.name, price: p.price,
                  image: (p.images && p.images.length > 0) ? p.images[0] : "/default-product-placeholder.png",
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}