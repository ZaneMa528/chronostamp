'use client';

import { useState } from 'react';
import Link from "next/link";
import { Button } from "~/components/ui/Button";

const demoEvents = [
  {
    id: "1",
    name: "DevConf 2024",
    code: "DEVCONF2024",
    description: "Developer Conference",
    icon: "👨‍💻",
    primary: "#7c3aed",
    secondary: "#a855f7", 
    accent: "#c084fc",
    background: "#faf5ff"
  },
  {
    id: "2",
    name: "Web3 Summit",
    code: "WEB3SUMMIT", 
    description: "Blockchain Conference",
    icon: "🌐",
    primary: "#3730a3",
    secondary: "#4f46e5",
    accent: "#6366f1",
    background: "#f8faff"
  },
  {
    id: "3",
    name: "AI Workshop",
    code: "AIWORKSHOP",
    description: "Machine Learning Lab", 
    icon: "🤖",
    primary: "#166534",
    secondary: "#22c55e",
    accent: "#4ade80",
    background: "#f0fdf4"
  }
];

export function DemoSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="py-8 sm:py-12 md:py-16 relative overflow-hidden">
      {/* Artistic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50">
        {/* Decorative Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="mb-8 sm:mb-12">
          <h2 
            className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 font-serif text-gray-900"
            style={{ 
              textShadow: '2px 2px 4px rgba(99, 102, 241, 0.2)'
            }}
          >
            Try It Now!
          </h2>
          <p 
            className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto text-gray-600"
          >
            Test the claiming experience with these special demo codes
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-8">
          {demoEvents.map((event) => (
            <div
              key={event.code}
              className="group perspective-1000"
              onMouseEnter={() => setHoveredCard(event.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Stamp Card */}
              <div 
                className={`
                  relative w-full h-80 transform-style-preserve-3d transition-all duration-700 cursor-pointer
                  ${hoveredCard === event.id ? 'rotate-y-12 scale-105' : 'hover:rotate-y-6'}
                `}
                style={{
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Card Shadow */}
                <div 
                  className="absolute inset-0 bg-black rounded-lg opacity-20 blur-xl transform translate-y-4 scale-95"
                  style={{
                    transform: hoveredCard === event.id ? 'translateY(8px) scale(1.02)' : 'translateY(4px) scale(0.95)'
                  }}
                />
                
                {/* Main Stamp Card */}
                <div className="relative w-full h-full p-3 bg-white rounded-lg shadow-2xl stamp-perforations">
                  <div 
                    className="w-full h-full border-4 border-double rounded-sm p-4 flex flex-col relative overflow-hidden"
                    style={{
                      borderColor: `${event.primary}CC`,
                      background: `linear-gradient(135deg, ${event.background} 0%, ${event.accent}20 100%)`
                    }}
                  >
                    
                    {/* Decorative Corner Flourishes */}
                    <div 
                      className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2 rounded-tl-lg"
                      style={{ borderColor: `${event.primary}99` }}
                    />
                    <div 
                      className="absolute top-1 right-1 w-4 h-4 border-r-2 border-t-2 rounded-tr-lg"
                      style={{ borderColor: `${event.primary}99` }}
                    />
                    <div 
                      className="absolute bottom-1 left-1 w-4 h-4 border-l-2 border-b-2 rounded-bl-lg"
                      style={{ borderColor: `${event.primary}99` }}
                    />
                    <div 
                      className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 rounded-br-lg"
                      style={{ borderColor: `${event.primary}99` }}
                    />

                    {/* Main Icon Area */}
                    <div className="flex-1 flex items-center justify-center mb-4">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl transform transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${event.primary} 0%, ${event.secondary} 100%)`,
                          boxShadow: `0 8px 24px ${event.primary}40`
                        }}
                      >
                        <span className="text-white drop-shadow-lg">{event.icon}</span>
                      </div>
                    </div>

                    {/* Event Title */}
                    <h3 
                      className="font-serif text-lg font-bold mb-2 text-center"
                      style={{ color: event.primary }}
                    >
                      {event.name.toUpperCase()}
                    </h3>
                    
                    {/* Demo Code Badge */}
                    <div className="text-center mb-3">
                      <code 
                        className="px-3 py-1 rounded font-mono text-sm font-bold tracking-wider"
                        style={{
                          backgroundColor: event.accent,
                          color: event.primary,
                          boxShadow: `inset 0 2px 4px ${event.primary}20`
                        }}
                      >
                        {event.code}
                      </code>
                    </div>

                    {/* Description */}
                    <p 
                      className="text-center text-sm mb-4"
                      style={{ color: event.secondary }}
                    >
                      {event.description}
                    </p>

                    {/* Action Button */}
                    <Link href={`/event/${event.id}`} className="block">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-sm font-medium transition-all duration-300 hover:shadow-lg"
                        style={{
                          borderColor: event.primary,
                          color: event.primary,
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = event.primary;
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = event.primary;
                        }}
                      >
                        View Details
                      </Button>
                    </Link>

                    {/* Watermark Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                      <div 
                        className="w-full h-full bg-repeat" 
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(event.primary)}' fill-opacity='1'%3E%3Cpath d='M20 20c0-7.732-6.268-14-14-14s-14 6.268-14 14 6.268 14 14 14 14-6.268 14-14z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                          backgroundSize: '20px 20px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div 
          className="text-center max-w-3xl mx-auto p-6 rounded-lg backdrop-blur-sm border border-purple-200"
          style={{
            background: 'rgba(250, 245, 255, 0.8)',
            color: '#4c1d95',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)'
          }}
        >
          <p className="text-sm leading-relaxed">
            Copy any demo code above and paste it in the claim form to test the experience.
            <br className="hidden sm:block"/>
            <span className="block sm:inline mt-2 sm:mt-0">
              <strong>Note:</strong> When creating real events, you set your own secret codes that are only revealed to attendees at the venue.
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        .stamp-perforations {
          position: relative;
        }
        
        .stamp-perforations::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: 
            radial-gradient(circle at 6px 6px, transparent 1px, currentColor 1px, currentColor 3px, transparent 3px),
            radial-gradient(circle at 6px 6px, transparent 1px, currentColor 1px, currentColor 3px, transparent 3px);
          background-size: 12px 12px;
          background-position: 0 0, 6px 6px;
          opacity: 0.4;
          border-radius: inherit;
          color: #6366f1;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        .rotate-y-6 {
          transform: rotateY(6deg);
        }
        
        .rotate-y-12 {
          transform: rotateY(12deg) scale(1.05);
        }
      `}</style>
    </section>
  );
}