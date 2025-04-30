// client/src/components/BannerSlider.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const desktopBanners = [
  { src: "/banners/bd1.webp", alt: "Conheça a Pinga Etc e Tal" },
  { src: "/banners/bd2.webp", alt: "Frete Grátis a partir de R$200" },
  { src: "/banners/bd3.webp", alt: "Cupom 10% OFF PINGA10" },
];

const mobileBanners = [
  { src: "/banners/bm1.webp", alt: "Conheça a Pinga Etc e Tal" },
  { src: "/banners/bm2.webp", alt: "Frete Grátis a partir de R$200" },
  { src: "/banners/bm3.webp", alt: "Cupom 10% OFF PINGA10" },
];

export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Responsividade
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const banners = isMobile ? mobileBanners : desktopBanners;

  // Auto-advance
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [index, banners.length]);

  const goToSlide = (i: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIndex(i);
  };

  const scrollToProducts = () => {
    const el = document.getElementById("produtos");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-hidden w-full px-0 md:max-w-screen-xl md:mx-auto md:px-6 md:pt-[50px]">
      <div className="relative overflow-hidden">
        {banners.map((b, i) => {
          const isActive = i === index;
          return (
            <div
              key={b.src}
              onClick={scrollToProducts}
              className={`cursor-pointer transition-opacity duration-700 ${
                isActive
                  ? "opacity-100 relative"
                  : "opacity-0 absolute inset-0"
              } ${!isMobile ? "rounded-xl overflow-hidden" : ""}`}
            >
              <Image
                src={b.src}
                alt={b.alt}
                width={1280}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          );
        })}
      </div>

      {/* Dots inside image */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              goToSlide(i);
              scrollToProducts();
            }}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === index ? "bg-white" : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
