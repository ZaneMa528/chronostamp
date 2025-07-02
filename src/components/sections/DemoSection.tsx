'use client';

import Link from "next/link";
import { Card, CardContent } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";

const demoEvents = [
  {
    id: "1",
    name: "DevConf 2024",
    code: "DEVCONF2024",
    description: "Developer Conference",
    icon: "👨‍💻",
    bgColor: "bg-purple-500",
    borderColor: "border-purple-200 hover:border-purple-300",
    codeColor: "bg-purple-100 text-purple-700"
  },
  {
    id: "2",
    name: "Web3 Summit",
    code: "WEB3SUMMIT", 
    description: "Blockchain Conference",
    icon: "🌐",
    bgColor: "bg-indigo-500",
    borderColor: "border-indigo-200 hover:border-indigo-300",
    codeColor: "bg-indigo-100 text-indigo-700"
  },
  {
    id: "3",
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
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-r from-purple-100 to-indigo-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
          Try It Now!
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
          Test the claiming experience with these special demo codes
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {demoEvents.map((event) => (
            <Card key={event.code} className={`${event.borderColor} transition-colors hover:shadow-lg`}>
              <CardContent className="p-4 sm:p-6 text-center">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${event.bgColor} rounded-full mx-auto mb-3 flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg sm:text-xl">{event.icon}</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg mb-2">{event.name}</h3>
                <code className={`${event.codeColor} px-2 sm:px-3 py-1 rounded font-mono text-xs sm:text-sm`}>
                  {event.code}
                </code>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 mb-3 sm:mb-4">{event.description}</p>
                <Link href={`/event/${event.id}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <p className="text-xs sm:text-sm text-gray-500 mt-6 sm:mt-8 px-4 leading-relaxed">
          Copy any demo code above and paste it in the claim form to test the experience.
          <br className="hidden sm:block"/>
          <span className="block sm:inline mt-1 sm:mt-0">
            <strong>Note:</strong> When creating real events, you set your own secret codes that are only revealed to attendees at the venue.
          </span>
        </p>
      </div>
    </section>
  );
}