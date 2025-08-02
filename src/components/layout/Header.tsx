'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ConnectWallet } from '~/components/web3/ConnectWallet';
import { Logo } from '~/components/ui/Logo';
import { cn } from '~/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Claim' },
    { href: '/create', label: 'Create' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-shrink-0 items-center gap-2">
            <Logo size={32} className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-lg font-bold text-gray-900 sm:text-xl">ChronoStamp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-purple-600',
                  pathname === item.href ? 'border-b-2 border-purple-600 pb-1 text-purple-600' : 'text-gray-600',
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
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="mt-4 border-t border-gray-200 pb-4 md:hidden">
            <nav className="mt-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'rounded-lg p-3 text-base font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600',
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-gray-200 pt-4">
              <ConnectWallet />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
