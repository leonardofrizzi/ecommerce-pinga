"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section id="about" className="md:pt-[50px] pb-16 bg-gray-50 px-6 md:px-0">
      <div className="max-w-screen-xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row md:items-center">
          <div className="p-6 md:p-12 flex-1 self-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Sobre Nós</h2>
            <p className="text-gray-600 leading-relaxed">
              Fundada com a paixão pela tradição e qualidade, a Pinga Etc e Tal é
              uma distribuidora especializada em cachaças artesanais.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Nosso compromisso é oferecer a melhor experiência ao cliente,
              unindo diversidade de sabores, atendimento personalizado e entrega
              rápida. Aqui, cada garrafa conta uma história – venha descobrir a
              sua!
            </p>
            <Link
              href="/produtos"
              className="inline-block mt-4 px-6 py-2 bg-[#0d1b2b] text-white font-medium rounded transition-colors hover:bg-[#CDAF70]"
            >
              Ver Produtos
            </Link>
          </div>

          <div className="w-full md:w-1/2">
            <Image
              src="/kit.webp"
              alt="Sobre nós"
              width={600}
              height={400}
              className="object-cover w-full h-auto rounded-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
