// client/src/components/ClientProviders.tsx
"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <Footer />
      <a
        href="https://api.whatsapp.com/send/?phone=%2B5521997782021&text&type=phone_number&app_absent=0"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 bg-[#25D366] hover:bg-[#1ebe5d] text-white p-3 rounded-full shadow-lg transition-colors"
      >
        <FaWhatsapp size={32} />
      </a>
    </CartProvider>
  );
}
