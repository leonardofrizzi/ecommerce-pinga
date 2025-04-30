// client/src/app/page.tsx
"use client";

import BannerSlider from "@/components/BannerSlider";
import ProductsSection from "@/components/ProductsSection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <BannerSlider />

      <main className="space-y-16 py-8 px-6">
        <ProductsSection />
        <FeaturesSection />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  );
}
