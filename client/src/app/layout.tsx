// client/src/app/layout.tsx
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export const metadata = {
  title: "Pinga Etc e Tal",
  description: "E-commerce de cachaças",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head />
      <body className="bg-gray-50">
        {/* Navbar em full width */}
        <Navbar />

        {/* Conteúdo do site limitado a 1280px */}
        <main className="max-w-screen-xl mx-auto px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
