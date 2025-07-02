'use client';

import { useState, useEffect } from 'react';
import { ClaimForm } from "~/components/forms/ClaimForm";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
}

export function HeroSection() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        life: Math.random() * 100 + 50
      });
    }
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1,
        opacity: particle.life > 20 ? particle.opacity : particle.opacity * 0.95
      })).filter(p => p.life > 0).concat(
        Array.from({ length: Math.random() > 0.7 ? 1 : 0 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 2 - 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          life: Math.random() * 100 + 50
        }))
      ));
    }, 100);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Dynamic Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br opacity-30 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)`
          }}
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-br from-purple-400 to-indigo-500"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity,
                animationName: 'float',
                animationDuration: '6s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite'
              }}
            />
          ))}
        </div>

        {/* Floating Decorative Stamps */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute opacity-10 stamp-float"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${20 + Math.floor(i / 4) * 60}%`,
                animationDelay: `${i * 0.5}s`,
                transform: `rotate(${(i % 3 - 1) * 15}deg)`
              }}
            >
              <div className="w-16 h-20 bg-gradient-to-br from-purple-200 to-indigo-300 rounded-sm stamp-perforations border-2 border-dashed border-purple-400" />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Decorative Stamp Border Around Title */}
        <div className="relative max-w-4xl mx-auto mb-8">
          <div className="absolute -inset-8 stamp-perforations bg-gradient-to-br from-purple-100 to-indigo-100 border-4 border-double border-purple-300 rounded-lg opacity-20" />
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span 
                className="inline-block transform transition-all duration-500 hover:scale-105 text-gray-900"
                style={{
                  textShadow: '3px 3px 6px rgba(99, 102, 241, 0.3), 0 0 20px rgba(139, 92, 246, 0.4)',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                }}
              >
                Transform Moments Into
              </span>
              <br />
              <span 
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 transform transition-all duration-500 hover:scale-105"
                style={{
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))',
                  animationName: 'glow',
                  animationDuration: '3s',
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                  animationDirection: 'alternate'
                }}
              >
                Permanent Memories
              </span>
            </h1>
          </div>
        </div>

        <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 max-w-sm sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed relative">
          <span 
            className="inline-block p-6 rounded-lg backdrop-blur-sm border border-purple-200 text-gray-600"
            style={{
              background: 'rgba(250, 245, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)'
            }}
          >
            ChronoStamp creates permanent, verifiable digital artifacts of your life experiences. 
            Each stamp is a unique, blockchain-secured memory that you truly own.
          </span>
        </p>

        <div className="relative z-20">
          <ClaimForm />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes glow {
          from { filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2)) drop-shadow(0 0 10px rgba(139, 92, 246, 0.4)); }
          to { filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2)) drop-shadow(0 0 20px rgba(139, 92, 246, 0.6)); }
        }
        
        @keyframes stamp-float {
          0%, 100% { transform: translateY(0px) rotate(var(--rotation, 0deg)); opacity: 0.1; }
          50% { transform: translateY(-20px) rotate(calc(var(--rotation, 0deg) + 5deg)); opacity: 0.2; }
        }
        
        .stamp-float {
          animation: stamp-float 8s ease-in-out infinite;
        }
        
        .stamp-perforations {
          position: relative;
        }
        
        .stamp-perforations::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: 
            radial-gradient(circle at 8px 8px, transparent 2px, currentColor 2px, currentColor 4px, transparent 4px),
            radial-gradient(circle at 8px 8px, transparent 2px, currentColor 2px, currentColor 4px, transparent 4px);
          background-size: 16px 16px;
          background-position: 0 0, 8px 8px;
          opacity: 0.3;
          border-radius: inherit;
        }
      `}</style>
    </section>
  );
}