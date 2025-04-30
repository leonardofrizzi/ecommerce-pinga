// client/src/components/ProductsSection.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Cachaça Ouro 500ml",
    price: 79.9,
    image: "/products/c1.webp",
  },
  {
    id: "2",
    name: "Cachaça Prata 700ml",
    price: 89.9,
    image: "/products/c2.webp",
  },
  {
    id: "3",
    name: "Kit Degustação 3x200ml",
    price: 49.9,
    image: "/products/c3.webp",
  },
  {
    id: "4",
    name: "Cachaça Premium 1L",
    price: 129.9,
    image: "/products/c4.webp",
  },
  {
    id: "5",
    name: "Cachaça Artesanal 750ml",
    price: 99.9,
    image: "/products/c5.webp",
  },
  {
    id: "6",
    name: "Miniatura 50ml (Sortidas)",
    price: 19.9,
    image: "/products/c6.webp",
  },
];

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(sampleProducts);
  }, []);

  return (
    <section id="produtos" className="pt-[50px] pb-16 bg-gray-50">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Nossos Produtos
        </h2>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Descubra nossa seleção de cachaças premium e promoções exclusivas.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-64">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {p.name}
                </h3>
                <p className="text-lg text-green-600 font-bold mb-4">
                  R$ {p.price.toFixed(2).replace(".", ",")}
                </p>
                <button className="mt-auto flex items-center justify-center w-full bg-[#0d1b2b] text-white py-2 rounded transition-colors hover:bg-[#CDAF70]">
                  <FiShoppingCart className="mr-2" />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Ver todos os produtos */}
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
