"use client";

import { Logo } from "~/components/ui/Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-purple-100 bg-gradient-to-br from-purple-50/90 via-indigo-50/90 to-violet-50/90 backdrop-blur-sm">
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          {/* Left Side - Brand */}
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Logo size={32} className="transform opacity-90" />
              <h3 className="font-serif text-xl font-bold text-gray-900">
                ChronoStamp
              </h3>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-gray-600">
              Transform moments into permanent, verifiable digital memories
            </p>
          </div>

          {/* Right Side - Copyright */}
          <div className="text-xs text-gray-500 sm:text-right">
            <div className="mb-1">
              © {new Date().getFullYear()} ChronoStamp Protocol
            </div>
            <div>All rights reserved.</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stamp-perforations {
          position: relative;
        }

        .stamp-perforations::before {
          content: "";
          position: absolute;
          inset: -1px;
          background:
            radial-gradient(
              circle at 3px 3px,
              transparent 1px,
              currentColor 1px,
              currentColor 2px,
              transparent 2px
            ),
            radial-gradient(
              circle at 3px 3px,
              transparent 1px,
              currentColor 1px,
              currentColor 2px,
              transparent 2px
            );
          background-size: 6px 6px;
          background-position:
            0 0,
            3px 3px;
          opacity: 0.4;
          border-radius: inherit;
          color: #6366f1;
        }
      `}</style>
    </footer>
  );
}
