"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/produtos")
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: Product[]) => {
        const shuffled = data.sort(() => Math.random() - 0.5);
        setProducts(shuffled.slice(0, 6));
      })
      .catch((err) => {
        console.error(err);
        setError("Não foi possível carregar os produtos.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="pt-[50px] pb-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto text-center">
          <p>Carregando produtos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pt-[50px] pb-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto text-center text-red-600">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="produtos" className="pt-[50px] pb-16 bg-gray-50 px-6 md:px-0">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Nossos Produtos
        </h2>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Descubra nossa seleção de cachaças premium e promoções exclusivas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
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

        <div className="mt-12 text-center">
          <Link
            href="/produtos"
            className="inline-block px-6 py-3 bg-[#0d1b2b] text-white font-medium rounded transition-colors hover:bg-[#CDAF70]"
          >
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </section>
  );
}
