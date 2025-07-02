"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/Tabs";
import { useAppStore } from "~/stores/useAppStore";
import { CreatedEventsTab } from "./CreatedEventsTab";
import { MyStampsTab } from "./MyStampsTab";

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
}

export function ProfileSection() {
  const { user } = useAppStore();
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Initialize floating particles for profile page
    const initialParticles: FloatingParticle[] = [];
    for (let i = 0; i < 25; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * (window.innerWidth || 1200),
        y: Math.random() * (window.innerHeight || 800),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        life: Math.random() * 150 + 100
      });
    }
    setParticles(initialParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1,
        opacity: particle.life > 30 ? particle.opacity : particle.opacity * 0.96
      })).filter(p => p.life > 0).concat(
        Array.from({ length: Math.random() > 0.8 ? 1 : 0 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * (window.innerWidth || 1200),
          y: (window.innerHeight || 800) + 10,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 1.5 - 0.3,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.3 + 0.1,
          life: Math.random() * 150 + 100
        }))
      ));
    }, 120);

    return () => clearInterval(interval);
  }, []);

  if (!user.isConnected) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 relative">
        {/* Floating Particles for Not Connected State */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-gradient-to-br from-purple-400 to-indigo-500"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.opacity * 0.5,
                animationName: 'gentle-float',
                animationDuration: '8s',
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite'
              }}
            />
          ))}
        </div>

        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Your Memory Collection
          </h1>
          
          <p className="mb-6 sm:mb-8 text-base sm:text-lg text-gray-600">
            Connect your wallet to view your ChronoStamp journey
          </p>
          
          <div className="mx-auto max-w-sm sm:max-w-md rounded-lg border bg-white p-6 sm:p-8 shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p className="text-sm sm:text-base text-gray-500">
              Please connect your wallet to access your memory collection
            </p>
          </div>
        </div>

        <style jsx>{`
          @keyframes gentle-float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(180deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 relative">
      {/* Floating Particles for Connected State */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-br from-purple-400 to-indigo-500"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity * 0.4,
              animationName: 'gentle-float',
              animationDuration: '10s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite'
            }}
          />
        ))}
      </div>


      {/* Main Content - Focus on Collections */}
      <Tabs defaultValue="stamps" className="w-full relative z-10">
        <div className="mb-6 sm:mb-8 flex justify-center">
          <TabsList className="bg-white shadow-sm w-full sm:w-auto">
            <TabsTrigger value="stamps" className="px-3 sm:px-6 py-2 sm:py-3 flex-1 sm:flex-none">
              <svg
                className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="text-xs sm:text-sm">My Memories</span>
            </TabsTrigger>
            <TabsTrigger value="created" className="px-3 sm:px-6 py-2 sm:py-3 flex-1 sm:flex-none">
              <svg
                className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="text-xs sm:text-sm">Created Events</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="stamps">
          <MyStampsTab userAddress={user.address!} />
        </TabsContent>

        <TabsContent value="created">
          <CreatedEventsTab userAddress={user.address!} />
        </TabsContent>
      </Tabs>

      <style jsx>{`
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
