import { Header } from "~/components/layout/Header";
import { HeroSection } from "~/components/sections/HeroSection";
import { DemoSection } from "~/components/sections/DemoSection";
import { FeaturesSection } from "~/components/sections/FeaturesSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />
      <HeroSection />
      <DemoSection />
      <FeaturesSection />
    </main>
  );
}
