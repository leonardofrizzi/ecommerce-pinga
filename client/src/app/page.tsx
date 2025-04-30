// client/src/app/page.tsx
"use client";

import BannerSlider from "@/components/BannerSlider";
// import ProductsSection from "@/components/ProductsSection";
// import AboutSection from "@/components/AboutSection";
// import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <BannerSlider />

      <main className="space-y-16 py-8 px-6">
        {/* Aqui entram suas seções, ex: */}
        {/* <ProductsSection /> */}
        {/* <AboutSection /> */}
        {/* <ContactSection /> */}
      </main>
    </>
  );
}
