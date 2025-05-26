import "../styles/globals.css";
import { ReactNode } from "react";
import ClientProviders from "@/components/ClientProviders";
import CartDrawer from "@/components/CartDrawer";

export const metadata = {
  title: "Loja | Pinga Etc e Tal",
  description: "E-commerce de cachaças",
  icons: {
    icon: "/pinga.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head />
      <body suppressHydrationWarning className="bg-gray-50 relative">
        <ClientProviders>
          <CartDrawer />
          <main className="max-w-screen-xl mx-auto">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
