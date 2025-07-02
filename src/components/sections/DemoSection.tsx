'use client';

import { Card, CardContent } from "~/components/ui/Card";

const demoEvents = [
  {
    name: "DevConf 2024",
    code: "DEVCONF2024",
    description: "Developer Conference",
    icon: "👨‍💻",
    bgColor: "bg-purple-500",
    borderColor: "border-purple-200 hover:border-purple-300",
    codeColor: "bg-purple-100 text-purple-700"
  },
  {
    name: "Web3 Summit",
    code: "WEB3SUMMIT", 
    description: "Blockchain Conference",
    icon: "🌐",
    bgColor: "bg-indigo-500",
    borderColor: "border-indigo-200 hover:border-indigo-300",
    codeColor: "bg-indigo-100 text-indigo-700"
  },
  {
    name: "AI Workshop",
    code: "AIWORKSHOP",
    description: "Machine Learning Lab", 
    icon: "🤖",
    bgColor: "bg-green-500",
    borderColor: "border-green-200 hover:border-green-300",
    codeColor: "bg-green-100 text-green-700"
  }
];

export function DemoSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-100 to-indigo-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Try It Now!
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Test the claiming experience with these demo event codes
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {demoEvents.map((event) => (
            <Card key={event.code} className={`${event.borderColor} transition-colors`}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${event.bgColor} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                  <span className="text-white font-bold">{event.icon}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{event.name}</h3>
                <code className={`${event.codeColor} px-3 py-1 rounded font-mono`}>
                  {event.code}
                </code>
                <p className="text-sm text-gray-600 mt-2">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <p className="text-sm text-gray-500 mt-8">
          Copy any code above and paste it in the claim form to test the experience
        </p>
      </div>
    </section>
  );
}