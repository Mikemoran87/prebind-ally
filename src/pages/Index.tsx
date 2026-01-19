import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Stats } from "@/components/landing/Stats";
import { UseCases } from "@/components/landing/UseCases";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <UseCases />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
