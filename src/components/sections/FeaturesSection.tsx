'use client';

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/Card";

const features = [
  {
    icon: "🔐",
    title: "Permanent & Secure",
    description: "Secured on the blockchain forever. No platform can delete or modify your memories."
  },
  {
    icon: "✅", 
    title: "Verifiable Proof",
    description: "Cryptographically verifiable attendance that can't be forged or duplicated."
  },
  {
    icon: "🌐",
    title: "Truly Yours", 
    description: "You own your digital memories completely. Transfer, display, or treasure them forever."
  }
];

export function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why ChronoStamp?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            More than digital souvenirs - permanent proof of your journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl">
                  <span className="text-xl sm:text-2xl">{feature.icon}</span> 
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}