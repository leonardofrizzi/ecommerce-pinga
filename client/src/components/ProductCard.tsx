// client/src/components/ProductCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full h-64 cursor-pointer">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
        <p className="text-lg text-green-600 font-bold mb-4">
          R$ {product.price.toFixed(2).replace(".", ",")}
        </p>
        <button className="mt-auto flex items-center justify-center w-full bg-[#0d1b2b] text-white py-2 rounded-xl transition-colors hover:bg-[#CDAF70]">
          <FiShoppingCart className="mr-2" /> Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}
