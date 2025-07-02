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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why ChronoStamp?
          </h2>
          <p className="text-xl text-gray-600">
            More than digital souvenirs - permanent proof of your journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {feature.icon} {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
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