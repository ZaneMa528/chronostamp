'use client';

import { ClaimForm } from "~/components/forms/ClaimForm";

export function HeroSection() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
          Transform Moments Into 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 block sm:inline">
            {" "}Permanent Memories
          </span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-sm sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed">
          ChronoStamp creates permanent, verifiable digital artifacts of your life experiences. 
          Each stamp is a unique, blockchain-secured memory that you truly own.
        </p>

        <ClaimForm />
      </div>
    </section>
  );
}