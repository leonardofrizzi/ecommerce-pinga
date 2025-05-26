"use client";

import Link from "next/link";
import Image from "next/image";
import { FiFacebook, FiInstagram } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#0d1b2b] text-white pt-[50px] pb-8 px-6 md:px-0">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/">
            <Image
              src="/logoPingaEtcETal.webp"
              alt="Pinga Etc e Tal"
              width={100}
              height={40}
              priority
            />
          </Link>
          <nav className="flex space-x-4">
            <Link href="/" className="hover:text-[#CDAF70]">Home</Link>
            <Link href="/#produtos" className="hover:text-[#CDAF70]">Produtos</Link>
            <Link href="/#sobre" className="hover:text-[#CDAF70]">Sobre</Link>
            <Link href="/#contato" className="hover:text-[#CDAF70]">Contato</Link>
          </nav>
          <div className="flex space-x-4">
            <Link href="https://www.tiktok.com/@pingaetcetal" target="_blank" className="hover:text-[#CDAF70]">
              <SiTiktok size={20} />
            </Link>
            <Link href="https://www.instagram.com/pingaetcetal/" target="_blank" className="hover:text-[#CDAF70]">
              <FiInstagram size={20} />
            </Link>
            <Link href="https://www.facebook.com/pingaetcetal/" target="_blank" className="hover:text-[#CDAF70]">
              <FiFacebook size={20} />
            </Link>
            <Link
              href="https://api.whatsapp.com/send/?phone=%2B5521997782021&text&type=phone_number&app_absent=0"
              target="_blank"
              className="hover:text-[#CDAF70]"
            >
              <FaWhatsapp size={20} />
            </Link>
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm mt-6">
          &copy; {new Date().getFullYear()} Pinga Etc e Tal. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
