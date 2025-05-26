"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useCart } from "@/contexts/CartContext";
import { slugify } from "@/utils/slugify";

interface RawProduct {
  _id: string;
  name: string;
}

export default function Navbar() {
  const router = useRouter();
  const { totalItems, toggleDrawer } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<RawProduct[]>([]);
  const [suggestions, setSuggestions] = useState<RawProduct[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/produtos")
      .then((res) => res.json())
      .then((data: RawProduct[]) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setSuggestions(
      products.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 5)
    );
  }, [query, products]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowDropdown(false);
      if (query.trim()) {
        router.push(`/produtos?search=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  const goTo = (p: RawProduct) => {
    setShowDropdown(false);
    const slug = slugify(p.name);
    router.push(`/produtos/${slug}`);
  };

  return (
    <nav className="bg-[#0d1b2b] shadow-lg">
      <div className="flex items-center justify-between px-6 md:px-0 py-4 max-w-screen-xl mx-auto">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logoPingaEtcETal.webp"
            alt="Pinga Etc e Tal"
            width={100}
            height={40}
            priority
          />
        </Link>
        <div
          className="hidden md:flex flex-1 items-center mx-6 space-x-6 relative"
          ref={inputRef}
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onKeyDown={onKey}
              placeholder="Pesquisar produto..."
              className="w-full bg-white rounded-full py-2 pl-4 pr-12 focus:outline-none"
            />
            <button className="absolute inset-y-0 right-4 flex items-center">
              <FiSearch size={20} className="text-gray-600" />
            </button>
            {showDropdown && suggestions.length > 0 && (
              <ul className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((p) => (
                  <li
                    key={p._id}
                    onClick={() => goTo(p)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {p.name}
                  </li>
                ))}
                <li
                  onClick={() => {
                    setShowDropdown(false);
                    router.push(
                      `/produtos?search=${encodeURIComponent(query.trim())}`
                    );
                  }}
                  className="px-4 py-2 text-center text-sm text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  Ver todos os resultados
                </li>
              </ul>
            )}
          </div>
          <Link
            href="/account"
            className="flex items-center text-white hover:text-gray-300"
          >
            <FiUser size={20} className="mr-1" /> Minha Conta
          </Link>
          <button
            type="button"
            onClick={toggleDrawer}
            className="relative text-white hover:text-gray-300"
          >
            <FiShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
      <div
        className={`md:hidden bg-[#0d1b2b] overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-80 py-4" : "max-h-0 py-0"
        }`}
      >
        <div className="px-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onKeyDown={onKey}
              placeholder="Pesquisar..."
              className="w-full bg-white rounded-full py-2 pl-4 pr-10 focus:outline-none"
            />
            <button className="absolute inset-y-0 right-3 flex items-center">
              <FiSearch size={18} className="text-gray-600" />
            </button>
          </div>
          {showDropdown && suggestions.length > 0 && (
            <ul className="relative z-10 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((p) => (
                <li
                  key={p._id}
                  onClick={() => {
                    goTo(p);
                    setMobileOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {p.name}
                </li>
              ))}
              <li
                onClick={() => {
                  setShowDropdown(false);
                  setMobileOpen(false);
                  router.push(
                    `/produtos?search=${encodeURIComponent(query.trim())}`
                  );
                }}
                className="px-4 py-2 text-center text-sm text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                Ver todos os resultados
              </li>
            </ul>
          )}
          <Link
            href="/account"
            className="block text-white hover:text-gray-300"
          >
            <FiUser size={20} className="inline mr-2" /> Minha Conta
          </Link>
          <button
            type="button"
            onClick={() => {
              toggleDrawer();
              setMobileOpen(false);
            }}
            className="flex items-center text-white hover:text-gray-300 relative"
          >
            <FiShoppingCart size={20} className="mr-2" /> Carrinho
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
