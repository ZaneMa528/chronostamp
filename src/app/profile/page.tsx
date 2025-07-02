'use client';

import { useEffect, useState } from 'react';
import { Header } from '~/components/layout/Header';
import { ProfileSection } from '~/components/sections/ProfileSection';

export default function ProfilePage() {
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
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        >
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.08'%3E%3Cpath d='M60 60c0-33.137-26.863-60-60-60s-60 26.863-60 60 26.863 60 60 60 60-26.863 60-60z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '300px 300px',
              backgroundPosition: '0 0'
            }}
          />
        </div>

        {/* Moving Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-15 transition-all duration-1000"
          style={{
            background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 40%, transparent 70%)`,
          }}
        />

        {/* Floating Memory Elements */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * -0.15}px)`,
          }}
        >
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className="absolute opacity-15"
              style={{
                left: `${(i % 5) * 20 + 5}%`,
                top: `${Math.floor(i / 5) * 25 + 10}%`,
                transform: `rotate(${(i % 4 - 1.5) * 15}deg)`,
                animationName: 'memory-float',
                animationDuration: `${5 + (i % 4)}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDelay: `${i * 0.4}s`
              }}
            >
              <div className="w-8 h-10 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-sm border border-purple-400 opacity-60 stamp-perforations" />
            </div>
          ))}
        </div>
      </div>

      {/* Mouse Trail Effect */}
      <div 
        className="fixed pointer-events-none -z-5 w-6 h-6 rounded-full opacity-25 transition-all duration-300"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
          transform: 'scale(1)',
          animationName: 'profile-pulse',
          animationDuration: '2.5s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <Header />
        <ProfileSection />
      </div>

      <style jsx>{`
        @keyframes memory-float {
          0%, 100% { 
            transform: translateY(0px) rotate(var(--rotation, 0deg)); 
            opacity: 0.15; 
          }
          50% { 
            transform: translateY(-20px) rotate(calc(var(--rotation, 0deg) + 8deg)); 
            opacity: 0.25; 
          }
        }
        
        @keyframes profile-pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.25;
          }
          50% { 
            transform: scale(1.8);
            opacity: 0.1;
          }
        }

        .stamp-perforations {
          position: relative;
        }
        
        .stamp-perforations::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: 
            radial-gradient(circle at 4px 4px, transparent 1px, currentColor 1px, currentColor 2px, transparent 2px),
            radial-gradient(circle at 4px 4px, transparent 1px, currentColor 1px, currentColor 2px, transparent 2px);
          background-size: 8px 8px;
          background-position: 0 0, 4px 4px;
          opacity: 0.4;
          border-radius: inherit;
          color: #6366f1;
        }
      `}</style>
    </main>
  );
}