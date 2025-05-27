"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const whatsappNumber = "5521997782021";
  const message = `Olá, comprei pelo site e gostaria de acompanhar meu pedido. Código: ${sessionId}`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 h-[70vh]">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Pedido Confirmado!
      </h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Obrigado pela sua compra. Seu pedido foi processado com sucesso.
      </p>
      {sessionId && (
        <p className="text-gray-800 mb-6 break-words text-center max-w-full">
          <span className="font-medium">Código do Pedido:&nbsp;</span>
          {sessionId}
        </p>
      )}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#0d1b2b] text-white px-6 py-3 rounded-xl hover:bg-[#CDAF70] transition-colors"
      >
        Entrar em contato via WhatsApp
      </a>
    </div>
  );
}
