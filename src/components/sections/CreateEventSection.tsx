'use client';

import { CreateEventForm } from '~/components/forms/CreateEventForm';
import { NFTPreview } from '~/components/web3/NFTPreview';
import { useState } from 'react';

export function CreateEventSection() {
  const [previewData, setPreviewData] = useState({
    name: '',
    description: '',
    imageUrl: '',
  });

  return (
    <section className="py-6 sm:py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          <h1 className="mb-3 text-2xl leading-tight font-bold text-gray-900 sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            Create Your
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent sm:inline">
              {' '}
              ChronoStamp Event
            </span>
          </h1>
          <p className="mx-auto max-w-sm text-base leading-relaxed text-gray-600 sm:max-w-lg sm:text-lg md:max-w-2xl md:text-xl">
            Transform your event into a memorable digital experience. Create unique NFT stamps for your attendees to
            collect and treasure forever.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:gap-8 md:gap-12 lg:grid-cols-2">
          {/* Form Section */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:mb-6 sm:text-2xl">Event Details</h2>
            <CreateEventForm onPreviewUpdate={setPreviewData} />
          </div>

          {/* Preview Section */}
          <div className="order-first space-y-4 sm:space-y-6 lg:order-last">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 sm:mb-6 sm:text-2xl">NFT Preview</h2>
            <div className="lg:sticky lg:top-6">
              <NFTPreview data={previewData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
