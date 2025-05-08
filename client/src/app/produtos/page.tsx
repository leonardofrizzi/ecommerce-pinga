// client/src/app/produtos/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard, { Product } from "@/components/ProductCard";

interface FetchedProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 6;

  useEffect(() => {
    fetch("http://localhost:4000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((data: FetchedProduct[]) => {
        const prods: Product[] = data.map((p) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          image: p.images[0] || "",
        }));
        setProducts(prods);
      })
      .catch((err) => {
        console.error(err);
        setError("Não foi possível carregar os produtos.");
      })
      .finally(() => setLoading(false));
  }, []);

  const parseBRL = (value: string): number | null => {
    const cleaned = value.replace(/[^\d,\.]/g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const min = parseBRL(minPrice);
      const max = parseBRL(maxPrice);
      if (min !== null && p.price < min) return false;
      if (max !== null && p.price > max) return false;
      return true;
    });
  }, [products, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  if (loading) {
    return <p className="pt-[50px] text-center">Carregando produtos...</p>;
  }

  if (error) {
    return <p className="pt-[50px] text-center text-red-500">{error}</p>;
  }

  return (
    <div className="pt-[50px] pb-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Todos os Produtos
        </h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-8">
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Preço mínimo (R$)</label>
            <input
              type="text"
              inputMode="decimal"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setPage(1);
              }}
              placeholder="0,00"
              className="border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700">Preço máximo (R$)</label>
            <input
              type="text"
              inputMode="decimal"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
              placeholder="0,00"
              className="border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#CDAF70] outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginated.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setPage((v) => Math.max(1, v - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border rounded-xl hover:bg-gray-100 disabled:opacity-50"
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setPage(num)}
              className={`px-4 py-2 border rounded-xl ${
                page === num
                  ? "bg-[#0d1b2b] text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-white border rounded-xl hover:bg-gray-100 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
}
