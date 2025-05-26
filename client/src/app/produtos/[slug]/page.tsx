"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";
import { slugify } from "@/utils/slugify";

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
  service: "PAC" | "SEDEX";
  price: number;
  deadline: number;
}

interface FreteResult {
  Codigo: string;
  Valor: string;
  PrazoEntrega: string;
  MsgErro?: string;
}

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const { addToCart } = useCart();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [zip, setZip] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null);

  useEffect(() => {
    fetch("/api/produtos")
      .then((res) => res.json())
      .then((data: Product[]) => setAllProducts(data))
      .catch(() => setAllProducts([]));
  }, []);

  useEffect(() => {
    if (!allProducts.length) return;
    const found = allProducts.find((p) => slugify(p.name) === slug) || null;
    setProduct(found);
  }, [allProducts, slug]);

  const calculateShipping = async () => {
    if (zip.length !== 8 || !product) {
      setShippingError("Informe um CEP válido de 8 dígitos.");
      return;
    }
    setIsCalculating(true);
    setShippingError(null);

    try {
      const peso = quantity.toString();
      const valor = (product.price * quantity).toFixed(2);

      const res = await fetch(
        `/api/frete?cepDestino=${zip}&peso=${peso}&valor=${valor}`
      );
      const payload = (await res.json()) as FreteResult[] | { error: string };
      if (!res.ok) {
        const msg =
          Array.isArray(payload)
            ? payload[0]?.MsgErro || `Status ${res.status}`
            : payload.error;
        throw new Error(msg);
      }

      const options: ShippingOption[] = (payload as FreteResult[]).map(
        (r): ShippingOption => ({
          code: r.Codigo,
          service: r.Codigo === "04014" ? "PAC" : "SEDEX",
          price: parseFloat(r.Valor.replace(",", ".")),
          deadline: parseInt(r.PrazoEntrega, 10),
        })
      );

      setShippingOptions(options);
      setSelectedShippingOption(options[0] || null);
    } catch (err: unknown) {
      setShippingError(
        err instanceof Error
          ? err.message
          : "Não foi possível calcular frete."
      );
      setShippingOptions([]);
      setSelectedShippingOption(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p._id !== product._id && p.category === product.category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [allProducts, product]);

  if (!product) {
    return <p className="pt-[50px] text-center">Produto não encontrado.</p>;
  }

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || "",
      quantity,
      shipping: selectedShippingOption || undefined,
    });
  };

  return (
    <div className="pt-[50px] pb-16 px-6 md:px-0">
      <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2">
          <div className="relative overflow-hidden rounded-xl shadow-lg h-[550px]">
            <Image
              src={product.images[0] || ""}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-2xl text-[#0d1b2b] font-semibold">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>

          <div className="bg-white p-4 rounded-xl shadow flex flex-wrap gap-4">
            <div className="flex-1 min-w-[120px]">
              <strong>Volume:</strong> {product.volume}
            </div>
            <div className="flex-1 min-w-[120px]">
              <strong>Qtd. por Caixa:</strong> {product.unidadesPorCaixa}
            </div>
            <div className="flex-1 min-w-[120px]">
              <strong>Peso Unitário:</strong> {product.pesoUnitario}
            </div>
            <div className="flex-1 min-w-[120px]">
              <strong>Peso Caixa:</strong> {product.pesoCaixa}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-medium">Quantidade:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, +e.target.value))
                }
                className="w-full sm:w-24 border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 font-medium">
                CEP (somente números):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={8}
                  value={zip}
                  onChange={(e) =>
                    setZip(e.target.value.replace(/\D/g, ""))
                  }
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                />
                <button
                  onClick={calculateShipping}
                  disabled={isCalculating}
                  className="bg-[#0d1b2b] text-white px-4 py-2 rounded-xl hover:bg-[#CDAF70] disabled:opacity-50"
                >
                  {isCalculating ? "Calculando..." : "Calcular Frete"}
                </button>
              </div>
              {shippingError && (
                <p className="mt-2 text-red-600">{shippingError}</p>
              )}
              {shippingOptions.length > 0 && (
                <select
                  value={selectedShippingOption?.code}
                  onChange={(e) =>
                    setSelectedShippingOption(
                      shippingOptions.find((o) => o.code === e.target.value) || null
                    )
                  }
                  className="mt-2 w-full border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
                >
                  {shippingOptions.map((opt) => (
                    <option key={opt.code} value={opt.code}>
                      {opt.service} – R$ {opt.price.toFixed(2).replace(".", ",")} (
                      {opt.deadline} dias)
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-[#0d1b2b] text-white px-6 py-3 rounded-xl transition-colors hover:bg-[#CDAF70]"
          >
            <FiShoppingCart size={20} /> Adicionar ao Carrinho
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 max-w-screen-xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Você também pode gostar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p._id}
                product={{
                  id: p._id,
                  name: p.name,
                  price: p.price,
                  image: p.images[0] || "",
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
