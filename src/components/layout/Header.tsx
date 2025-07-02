'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWallet } from "~/components/web3/ConnectWallet";
import { cn } from "~/lib/utils";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Claim" },
    { href: "/create", label: "Create" },
  ];

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full"></div>
            <span className="text-xl font-bold text-gray-900">ChronoStamp</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
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
        </div>

        <ConnectWallet />
      </div>
    </header>
  );
}