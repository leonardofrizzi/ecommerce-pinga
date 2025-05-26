"use client";

import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import { slugify } from "@/utils/slugify";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const productSlug = slugify(product.name);

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition-shadow flex flex-col">
      <Link href={`/produtos/${productSlug}`} className="block flex-1">
        {product.image ? (
          <div className="relative w-full h-64">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority={false}
            />
          </div>
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500">Sem imagem</span>
          </div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {product.name}
          </h3>
          <p className="text-xl text-[#0d1b2b] font-medium mb-4">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </p>
        </div>
      </Link>

      <div className="p-4 pt-0">
        <Link
          href={`/produtos/${productSlug}`}
          className="inline-flex items-center text-[#0d1b2b] hover:text-[#CDAF70] font-medium"
        >
          Ver mais <FiArrowRight className="ml-1" />
        </Link>
      </div>
    </div>
  );
}
