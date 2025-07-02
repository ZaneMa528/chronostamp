'use client';

import { ClaimForm } from "~/components/forms/ClaimForm";

export function HeroSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Transform Moments Into 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
            {" "}Permanent Memories
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          ChronoStamp creates permanent, verifiable digital artifacts of your life experiences. 
          Each stamp is a unique, blockchain-secured memory that you truly own.
        </p>

        <ClaimForm />
      </div>
    </section>
  );
}