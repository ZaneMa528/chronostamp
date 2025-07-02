import { Header } from "~/components/layout/Header";
import { HeroSection } from "~/components/sections/HeroSection";
import { DemoSection } from "~/components/sections/DemoSection";
import { FeaturesSection } from "~/components/sections/FeaturesSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      <div className="pb-8 sm:pb-12 md:pb-16">
        <HeroSection />
        <DemoSection />
        <FeaturesSection />
      </div>
    </main>
  );
}
