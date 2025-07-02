'use client';

import { ConnectWallet } from "~/components/web3/ConnectWallet";

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full"></div>
          <span className="text-xl font-bold text-gray-900">ChronoStamp</span>
        </div>
        <ConnectWallet />
      </div>
    </header>
  );
}