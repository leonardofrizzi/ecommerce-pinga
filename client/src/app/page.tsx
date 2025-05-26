import BannerSlider from "@/components/BannerSlider";
import ProductsSection from "@/components/ProductsSection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export default function HomePage() {
  return (
    <>
      <BannerSlider />

      <main className="space-y-16 py-8">
        <ProductsSection />
        <FeaturesSection />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  );
}
