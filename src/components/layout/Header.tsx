'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ConnectWallet } from "~/components/web3/ConnectWallet";
import { cn } from "~/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Claim" },
    { href: "/create", label: "Create" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full"></div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">ChronoStamp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-purple-600",
                  pathname === item.href
                    ? "text-purple-600 border-b-2 border-purple-600 pb-1"
                    : "text-gray-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Connect Wallet */}
          <div className="hidden md:block">
            <ConnectWallet />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2 mt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "p-3 rounded-lg text-base font-medium transition-colors",
                    pathname === item.href
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <ConnectWallet />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}