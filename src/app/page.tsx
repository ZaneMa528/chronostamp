'use client';

import { useEffect, useState } from 'react';
import { Header } from "~/components/layout/Header";
import { HeroSection } from "~/components/sections/HeroSection";
import { DemoSection } from "~/components/sections/DemoSection";
import { FeaturesSection } from "~/components/sections/FeaturesSection";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Global Artistic Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />
        
        {/* Parallax Background Elements */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Cpath d='M100 100c0-55.228-44.772-100-100-100s-100 44.772-100 100 44.772 100 100 100 100-44.772 100-100z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '400px 400px',
              backgroundPosition: '0 0'
            }}
          />
        </div>

        {/* Moving Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-20 transition-all duration-1000"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 40%, transparent 70%)`,
          }}
        />

        {/* Floating Elements */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * -0.2}px)`,
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute opacity-10"
              style={{
                left: `${(i % 4) * 25 + 5}%`,
                top: `${Math.floor(i / 4) * 30 + 10}%`,
                transform: `rotate(${(i % 3 - 1) * 20}deg)`,
                animationName: 'float-slow',
                animationDuration: `${4 + (i % 3)}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${i * 0.3}s`
              }}
            >
              <div className="w-6 h-8 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-sm opacity-50" />
            </div>
          ))}
        </div>
      </div>

      {/* Mouse Trail Effect */}
      <div 
        className="fixed pointer-events-none -z-5 w-4 h-4 rounded-full opacity-20 transition-all duration-300"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)',
          transform: 'scale(1)',
          animationName: 'pulse',
          animationDuration: '2s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <DemoSection />
        <FeaturesSection />
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(var(--rotation, 0deg)); 
            opacity: 0.1; 
          }
          50% { 
            transform: translateY(-15px) rotate(calc(var(--rotation, 0deg) + 10deg)); 
            opacity: 0.2; 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.2;
          }
          50% { 
            transform: scale(1.5);
            opacity: 0.1;
          }
        }
      `}</style>
    </main>
  );
}
