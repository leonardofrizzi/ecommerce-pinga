// client/src/app/layout.tsx
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import { FaWhatsapp } from "react-icons/fa";

export const metadata = {
  title: "Pinga Etc e Tal",
  description: "E-commerce de cachaças",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head />
      <body className="bg-gray-50 relative">
        <Navbar />

        <main className="max-w-screen-xl mx-auto md:px-6">
          {children}
        </main>

        <Footer />

        <a
          href="https://api.whatsapp.com/send/?phone=%2B5521997782021&text&type=phone_number&app_absent=0"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-50 bg-[#25D366] hover:bg-[#1ebe5d] text-white p-3 rounded-full shadow-lg transition-colors"
        >
          <FaWhatsapp size={32} />
        </a>
      </body>
    </html>
  );
}
