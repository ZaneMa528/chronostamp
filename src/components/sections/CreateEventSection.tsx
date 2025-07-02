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
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Create Your 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              {" "}ChronoStamp Event
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your event into a memorable digital experience. 
            Create unique NFT stamps for your attendees to collect and treasure forever.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Event Details
            </h2>
            <CreateEventForm onPreviewUpdate={setPreviewData} />
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              NFT Preview
            </h2>
            <div className="sticky top-6">
              <NFTPreview data={previewData} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}