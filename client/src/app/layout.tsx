// client/src/app/layout.tsx
import "../styles/globals.css";
import { ReactNode } from "react";
import ClientProviders from "@/components/ClientProviders";

export const metadata = {
  title: "Pinga Etc e Tal",
  description: "E-commerce de cachaças",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head />
      <body
        suppressHydrationWarning
        className="bg-gray-50 relative"
      >
        <ClientProviders>
          <main className="max-w-screen-xl mx-auto md:px-6">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
