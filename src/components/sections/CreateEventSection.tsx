'use client';

import { CreateEventForm } from "~/components/forms/CreateEventForm";
import { NFTPreview } from "~/components/web3/NFTPreview";
import { useState } from "react";

export function CreateEventSection() {
  const [previewData, setPreviewData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  return (
    <section className="py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Create Your 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 block sm:inline">
              {" "}ChronoStamp Event
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-sm sm:max-w-lg md:max-w-2xl mx-auto leading-relaxed">
            Transform your event into a memorable digital experience. 
            Create unique NFT stamps for your attendees to collect and treasure forever.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Form Section */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Event Details
            </h2>
            <CreateEventForm onPreviewUpdate={setPreviewData} />
          </div>

          {/* Preview Section */}
          <div className="space-y-4 sm:space-y-6 order-first lg:order-last">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              NFT Preview
            </h2>
            <div className="lg:sticky lg:top-6">
              <NFTPreview data={previewData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}