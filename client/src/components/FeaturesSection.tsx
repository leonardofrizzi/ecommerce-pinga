"use client";

import { FiShield, FiTruck, FiHeadphones, FiGift } from "react-icons/fi";
import Link from "next/link";

export default function FeaturesSection() {
  const features = [
    {
      icon: FiShield,
      title: "Compra Segura",
      desc: "Transações protegidas e criptografadas para sua tranquilidade.",
    },
    {
      icon: FiTruck,
      title: "Entrega Rápida",
      desc: "Logística ágil com prazos reduzidos para todo o Brasil.",
    },
    {
      icon: FiHeadphones,
      title: "Suporte 24/7",
      desc: "Atendimento contínuo para tirar todas as suas dúvidas.",
    },
    {
      icon: FiGift,
      title: "Grande Variedade",
      desc: "Seleção diversificada de cachaças artesanais e importadas.",
    },
  ];

  return (
    <section id="features" className="md:pt-[50px] pb-16 bg-gray-50 px-6 md:px-0">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Por que escolher a Pinga Etc e Tal?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center"
            >
              <Icon size={40} className="text-[#CDAF70] mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {title}
              </h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/produtos"
            className="inline-block px-6 py-3 bg-[#0d1b2b] text-white font-medium rounded transition-colors hover:bg-[#CDAF70]"
          >
            Ver Produtos
          </Link>
        </div>
      </div>
    </section>
  );
}
