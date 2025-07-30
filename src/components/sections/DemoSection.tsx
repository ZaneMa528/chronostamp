"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "~/components/ui/Button";

const demoEvents = [
  {
    id: "1",
    name: "DevConf 2025",
    code: "DEVCONF2025",
    description: "Developer Conference",
    icon: "👨‍💻",
    primary: "#7c3aed",
    secondary: "#a855f7",
    accent: "#c084fc",
    background: "#faf5ff",
  },
  {
    id: "2",
    name: "Birthday Party",
    code: "BDAY2025",
    description: "Private Celebration",
    icon: "🎂",
    primary: "#be185d",
    secondary: "#ec4899",
    accent: "#f9a8d4",
    background: "#fdf2f8",
  },
  {
    id: "3",
    name: "Graduation",
    code: "MILESTONE2025",
    description: "Life Achievement",
    icon: "🎓",
    primary: "#166534",
    secondary: "#22c55e",
    accent: "#86efac",
    background: "#f0fdf4",
  },
];

export function DemoSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden py-8 sm:py-12 md:py-16">
      {/* Artistic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50">
        {/* Decorative Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="mb-8 sm:mb-12">
          <h2
            className="mb-3 font-serif text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl"
            style={{
              textShadow: "2px 2px 4px rgba(99, 102, 241, 0.2)",
            }}
          >
            Try It Now!
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-base text-gray-600 sm:mb-8 sm:text-lg">
            Test the claiming experience with these special demo codes
          </p>
        </div>

        <div className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
          {demoEvents.map((event) => (
            <div key={event.code}>
              {/* Desktop Version with animations */}
              <div
                className="group perspective-1000 hidden sm:block"
                onMouseEnter={() => setHoveredCard(event.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`transform-style-preserve-3d relative h-80 w-full cursor-pointer transition-all duration-700 ${hoveredCard === event.id ? "scale-105 rotate-y-12" : "hover:rotate-y-6"} `}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Card Shadow */}
                  <div
                    className="absolute inset-0 translate-y-4 scale-95 transform rounded-lg bg-black opacity-20 blur-xl"
                    style={{
                      transform:
                        hoveredCard === event.id
                          ? "translateY(8px) scale(1.02)"
                          : "translateY(4px) scale(0.95)",
                    }}
                  />

                  {/* Main Stamp Card */}
                  <div className="stamp-perforations relative h-full w-full rounded-lg bg-white p-3 shadow-2xl">
                    <div
                      className="relative flex h-full w-full flex-col overflow-hidden rounded-sm border-4 border-double p-4"
                      style={{
                        borderColor: `${event.primary}CC`,
                        background: `linear-gradient(135deg, ${event.background} 0%, ${event.accent}20 100%)`,
                      }}
                    >
                      {/* Decorative Corner Flourishes */}
                      <div
                        className="absolute top-1 left-1 h-4 w-4 rounded-tl-lg border-t-2 border-l-2"
                        style={{ borderColor: `${event.primary}99` }}
                      />
                      <div
                        className="absolute top-1 right-1 h-4 w-4 rounded-tr-lg border-t-2 border-r-2"
                        style={{ borderColor: `${event.primary}99` }}
                      />
                      <div
                        className="absolute bottom-1 left-1 h-4 w-4 rounded-bl-lg border-b-2 border-l-2"
                        style={{ borderColor: `${event.primary}99` }}
                      />
                      <div
                        className="absolute right-1 bottom-1 h-4 w-4 rounded-br-lg border-r-2 border-b-2"
                        style={{ borderColor: `${event.primary}99` }}
                      />

                      {/* Main Icon Area */}
                      <div className="mb-4 flex flex-1 items-center justify-center">
                        <div
                          className="flex h-16 w-16 transform items-center justify-center rounded-full text-3xl transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${event.primary} 0%, ${event.secondary} 100%)`,
                            boxShadow: `0 8px 24px ${event.primary}40`,
                          }}
                        >
                          <span className="text-white drop-shadow-lg">
                            {event.icon}
                          </span>
                        </div>
                      </div>

                      {/* Event Title */}
                      <h3
                        className="mb-2 text-center font-serif text-lg font-bold"
                        style={{ color: event.primary }}
                      >
                        {event.name.toUpperCase()}
                      </h3>

                      {/* Demo Code Badge */}
                      <div className="mb-3 text-center">
                        <code
                          className="rounded px-3 py-1 font-mono text-sm font-bold tracking-wider"
                          style={{
                            backgroundColor: event.accent,
                            color: event.primary,
                            boxShadow: `inset 0 2px 4px ${event.primary}20`,
                          }}
                        >
                          {event.code}
                        </code>
                      </div>

                      {/* Description */}
                      <p
                        className="mb-4 text-center text-sm"
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
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              event.primary;
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.color = event.primary;
                          }}
                        >
                          View Details
                        </Button>
                      </Link>

                      {/* Watermark Pattern */}
                      <div className="pointer-events-none absolute inset-0 opacity-5">
                        <div
                          className="h-full w-full bg-repeat"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(event.primary)}' fill-opacity='1'%3E%3Cpath d='M20 20c0-7.732-6.268-14-14-14s-14 6.268-14 14 6.268 14 14 14 14-6.268 14-14z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: "20px 20px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Version - No animations */}
              <div className="sm:hidden">
                <div className="relative h-80 w-full">
                  <div className="stamp-perforations relative h-full w-full rounded-lg bg-white p-3 shadow-lg">
                    <div
                      className="relative flex h-full w-full flex-col overflow-hidden rounded-sm border-4 border-double p-4"
                      style={{
                        borderColor: `${event.primary}CC`,
                        background: `linear-gradient(135deg, ${event.background} 0%, ${event.accent}20 100%)`,
                      }}
                    >
                      {/* Decorative Corner Flourishes */}
                      <div
                        className="absolute top-1 left-1 h-4 w-4 rounded-tl-lg border-t-2 border-l-2"
                        style={{ borderColor: `${event.primary}99` }}
                      />
                      <div
                        className="absolute top-1 right-1 h-4 w-4 rounded-tr-lg border-t-2 border-r-2"
                        style={{ borderColor: `${event.primary}99` }}
                      />
                      <div
                        className="absolute bottom-1 left-1 h-4 w-4 rounded-bl-lg border-b-2 border-l-2"
                        style={{ borderColor: `${event.primary}99` }}
                      />
                      <div
                        className="absolute right-1 bottom-1 h-4 w-4 rounded-br-lg border-r-2 border-b-2"
                        style={{ borderColor: `${event.primary}99` }}
                      />

                      {/* Main Icon Area */}
                      <div className="mb-4 flex flex-1 items-center justify-center">
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
                          style={{
                            background: `linear-gradient(135deg, ${event.primary} 0%, ${event.secondary} 100%)`,
                            boxShadow: `0 8px 24px ${event.primary}40`,
                          }}
                        >
                          <span className="text-white drop-shadow-lg">
                            {event.icon}
                          </span>
                        </div>
                      </div>

                      {/* Event Title */}
                      <h3
                        className="mb-2 text-center font-serif text-lg font-bold"
                        style={{ color: event.primary }}
                      >
                        {event.name.toUpperCase()}
                      </h3>

                      {/* Demo Code Badge */}
                      <div className="mb-3 text-center">
                        <code
                          className="rounded px-3 py-1 font-mono text-sm font-bold tracking-wider"
                          style={{
                            backgroundColor: event.accent,
                            color: event.primary,
                            boxShadow: `inset 0 2px 4px ${event.primary}20`,
                          }}
                        >
                          {event.code}
                        </code>
                      </div>

                      {/* Description */}
                      <p
                        className="mb-4 text-center text-sm"
                        style={{ color: event.secondary }}
                      >
                        {event.description}
                      </p>

                      {/* Action Button */}
                      <Link href={`/event/${event.id}`} className="block">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-sm font-medium"
                          style={{
                            borderColor: event.primary,
                            color: event.primary,
                            backgroundColor: "transparent",
                          }}
                        >
                          View Details
                        </Button>
                      </Link>

                      {/* Watermark Pattern */}
                      <div className="pointer-events-none absolute inset-0 opacity-5">
                        <div
                          className="h-full w-full bg-repeat"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(event.primary)}' fill-opacity='1'%3E%3Cpath d='M20 20c0-7.732-6.268-14-14-14s-14 6.268-14 14 6.268 14 14 14 14-6.268 14-14z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            backgroundSize: "20px 20px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mx-auto max-w-3xl rounded-lg border border-purple-200 p-6 text-center backdrop-blur-sm"
          style={{
            background: "rgba(250, 245, 255, 0.8)",
            color: "#4c1d95",
            boxShadow: "0 8px 32px rgba(139, 92, 246, 0.1)",
          }}
        >
          <p className="text-sm leading-relaxed">
            Copy any demo code above and paste it in the claim form to test the
            experience.
            <br className="hidden sm:block" />
            <span className="mt-2 block sm:mt-0 sm:inline">
              <strong>Note:</strong> When creating real events, you set your own
              secret codes that are only revealed to attendees at the venue.
            </span>
          </p>
        </div>
      </div>

      <style jsx>{`
        .stamp-perforations {
          position: relative;
        }

        .stamp-perforations::before {
          content: "";
          position: absolute;
          inset: -2px;
          background:
            radial-gradient(
              circle at 6px 6px,
              transparent 1px,
              currentColor 1px,
              currentColor 3px,
              transparent 3px
            ),
            radial-gradient(
              circle at 6px 6px,
              transparent 1px,
              currentColor 1px,
              currentColor 3px,
              transparent 3px
            );
          background-size: 12px 12px;
          background-position:
            0 0,
            6px 6px;
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
