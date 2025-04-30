// client/src/components/Navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#0d1b2b] shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 max-w-screen-xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logoPingaEtcETal.webp"
            alt="Pinga Etc e Tal"
            width={100}
            height={40}
            priority
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex flex-1 items-center mx-6 space-x-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Pesquisar produto..."
              className="w-full bg-white rounded-full py-2 pl-4 pr-12 focus:outline-none"
            />
            <button className="absolute inset-y-0 right-4 flex items-center">
              <FiSearch size={20} className="text-gray-600" />
            </button>
          </div>
          <Link
            href="/account"
            className="flex items-center text-white hover:text-[#FFD700] transition-colors"
          >
            <FiUser size={20} className="mr-1" /> Conta
          </Link>
          <Link
            href="/cart"
            className="flex items-center text-white hover:text-[#FFD700] transition-colors"
          >
            <FiShoppingCart size={20} className="mr-1" /> 0
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          md:hidden bg-[#0d1b2b] overflow-hidden transition-all duration-300
          ${open ? "max-h-64 py-4" : "max-h-0 py-0"}
        `}
      >
        <div className="px-6 space-y-4">
          {/* Busca reduzida */}
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full bg-white rounded-full py-2 pl-4 pr-10 focus:outline-none"
            />
            <button className="absolute inset-y-0 right-3 flex items-center">
              <FiSearch size={18} className="text-gray-600" />
            </button>
          </div>
          {/* Conta */}
          <Link
            href="/account"
            className="flex items-center text-white hover:text-[#FFD700] transition-colors"
          >
            <FiUser size={20} className="mr-2" /> Conta
          </Link>
          {/* Carrinho */}
          <Link
            href="/cart"
            className="flex items-center text-white hover:text-[#FFD700] transition-colors"
          >
            <FiShoppingCart size={20} className="mr-2" /> Carrinho (0)
          </Link>
        </div>
      </div>
    </nav>
  );
}
