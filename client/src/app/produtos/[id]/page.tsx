// client/src/app/produtos/[id]/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import ProductCard from "@/components/ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  category: string;
}

interface FreteOption {
  code: string;
  service: string;
  price: number;
  deadline: number;
}

const allProducts: Product[] = [
  {
    id: "1",
    name: "Cachaça Ouro 500ml",
    price: 79.9,
    images: [
      "https://images.unsplash.com/photo-1572761429407-9a078c8fabd7?auto=format&w=800&h=800",
      "https://images.unsplash.com/photo-1566512290118-5b9e9682edbd?auto=format&w=800&h=800",
      "https://images.unsplash.com/photo-1580910051077-7e2d3d1f9c7d?auto=format&w=800&h=800",
    ],
    description: "Clássica cachaça envelhecida em barril de carvalho.",
    category: "ouro",
  },
  {
    id: "2",
    name: "Cachaça Prata 700ml",
    price: 89.9,
    images: [
      "https://images.unsplash.com/photo-1580132926325-e5e64f3b0e2b?auto=format&w=800&h=800",
      "https://images.unsplash.com/photo-1559628235-7b8df683ad37?auto=format&w=800&h=800",
    ],
    description: "Sabor suave e aroma fresco, perfeita para caipirinhas.",
    category: "prata",
  },
  // … outros produtos …
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [cep, setCep] = useState("");
  const [freteOptions, setFreteOptions] = useState<FreteOption[]>([]);
  const [selectedFrete, setSelectedFrete] = useState<FreteOption | null>(null);

  useEffect(() => {
    setProduct(allProducts.find((p) => p.id === params.id) || null);
  }, [params.id]);

  useEffect(() => {
    if (cep.length === 8 && product) {
      fetch(`/api/frete?cep=${cep}&peso=1&valor=${product.price}`)
        .then((r) => r.json())
        .then((data: FreteOption[]) => {
          setFreteOptions(data);
          setSelectedFrete(data[0] || null);
        })
        .catch(() => {
          setFreteOptions([]);
          setSelectedFrete(null);
        });
    }
  }, [cep, product]);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return <p className="pt-[50px] text-center">Produto não encontrado.</p>;
  }

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      shipping: selectedFrete || undefined,
    });
    router.push("/produtos");
  };

  return (
    <div className="pt-[50px] pb-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto md:px-6 flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="relative rounded-xl overflow-hidden shadow-lg h-[400px]">
            <Image
              src={product.images[activeImg]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex space-x-2">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 ${
                  i === activeImg ? "border-[#CDAF70]" : "border-gray-200"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-2xl text-[#0d1b2b] font-semibold">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </p>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4">
            <label className="font-medium">Quantidade:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, +e.target.value))}
              className="w-20 border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="text"
              maxLength={8}
              value={cep}
              onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
              placeholder="CEP (somente números)"
              className="border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none w-40"
            />
            {freteOptions.length > 0 && (
              <select
                value={selectedFrete?.code}
                onChange={(e) =>
                  setSelectedFrete(
                    freteOptions.find((f) => f.code === e.target.value) || null
                  )
                }
                className="border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
              >
                {freteOptions.map((f) => (
                  <option key={f.code} value={f.code}>
                    {f.service} – R$ {f.price.toFixed(2).replace(".", ",")} (
                    {f.deadline} dias)
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 bg-[#0d1b2b] text-white px-6 py-3 rounded-xl transition-colors hover:bg-[#CDAF70]"
          >
            <FiShoppingCart size={20} /> Adicionar ao Carrinho
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 max-w-screen-xl mx-auto md:px-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Você também pode gostar
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  price: p.price,
                  image: p.images[0],
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
