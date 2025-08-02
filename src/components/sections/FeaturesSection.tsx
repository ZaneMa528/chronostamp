'use client';

import { useState, useEffect } from 'react';

const features = [
  {
    icon: '🔐',
    title: 'Permanent & Secure',
    description: 'Secured on the blockchain forever. No platform can delete or modify your memories.',
    primary: '#7c3aed',
    secondary: '#a855f7',
    accent: '#c084fc',
    delay: 0,
  },
  {
    icon: '✅',
    title: 'Verifiable Proof',
    description: "Cryptographically verifiable attendance that can't be forged or duplicated.",
    primary: '#3730a3',
    secondary: '#4f46e5',
    accent: '#6366f1',
    delay: 200,
  },
  {
    icon: '🌐',
    title: 'Truly Yours',
    description: 'You own your digital memories completely. Transfer, display, or treasure them forever.',
    primary: '#059669',
    secondary: '#10b981',
    accent: '#34d399',
    delay: 400,
  },
];

export function FeaturesSection() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.2 },
    );

    const section = document.getElementById('features-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features-section" className="relative overflow-hidden py-12 sm:py-16 md:py-20">
      {/* Artistic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Timeline Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.4'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-12 text-center sm:mb-16 md:mb-20">
          <h2
            className="mb-4 font-serif text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl md:text-4xl"
            style={{
              textShadow: '2px 2px 4px rgba(99, 102, 241, 0.2)',
            }}
          >
            Why ChronoStamp?
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
            More than digital souvenirs - permanent proof of your journey
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative mx-auto max-w-6xl">
          {/* Central Timeline Line */}
          <div className="absolute left-1/2 hidden h-full w-1 -translate-x-1/2 transform rounded-full bg-gradient-to-b from-purple-200 via-indigo-300 to-green-200 md:block" />

          <div className="space-y-12 md:space-y-20">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`relative flex items-center justify-center md:justify-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} ${inView ? 'animate-feature-slide-in' : 'opacity-0'} `}
                style={{
                  animationDelay: `${feature.delay}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                {/* Timeline Node */}
                <div className="absolute left-1/2 z-20 hidden -translate-x-1/2 transform md:block">
                  <div
                    className="h-6 w-6 rounded-full border-4 border-white shadow-lg"
                    style={{
                      backgroundColor: feature.primary,
                      boxShadow: `0 0 20px ${feature.primary}40`,
                    }}
                  />
                </div>

                {/* Feature Card */}
                <div
                  className={`mx-4 w-full md:mx-8 md:w-80 lg:w-96 ${index % 2 === 0 ? 'md:mr-auto md:ml-0' : 'md:mr-0 md:ml-auto'} `}
                >
                  <div
                    className="relative overflow-hidden rounded-2xl p-6 shadow-xl sm:p-8"
                    style={{
                      background: `linear-gradient(135deg, white 0%, ${feature.accent}15 100%)`,
                      border: `2px solid ${feature.accent}40`,
                    }}
                  >
                    {/* Icon */}
                    <div className="relative mb-6 flex items-center justify-center">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-full text-3xl sm:h-20 sm:w-20 sm:text-4xl"
                        style={{
                          background: `linear-gradient(135deg, ${feature.primary} 0%, ${feature.secondary} 100%)`,
                          boxShadow: `0 10px 30px ${feature.primary}40`,
                        }}
                      >
                        <span className="text-white drop-shadow-lg">{feature.icon}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3
                        className="mb-4 text-center font-serif text-xl font-bold sm:text-2xl"
                        style={{ color: feature.primary }}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-center text-sm leading-relaxed text-gray-600 sm:text-base">
                        {feature.description}
                      </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 h-8 w-8 opacity-10">
                      <div className="h-full w-full rounded-full" style={{ backgroundColor: feature.primary }} />
                    </div>
                    <div className="absolute bottom-4 left-4 h-6 w-6 opacity-10">
                      <div className="h-full w-full rounded-full" style={{ backgroundColor: feature.secondary }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes feature-slide-in {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-feature-slide-in {
          animation: feature-slide-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}
