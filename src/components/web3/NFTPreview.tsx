'use client';

import { Card, CardContent } from "~/components/ui/Card";

interface NFTPreviewProps {
  data: {
    name: string;
    description: string;
    imageUrl: string;
  };
}

export function NFTPreview({ data }: NFTPreviewProps) {
  const hasData = data.name || data.description || data.imageUrl;

  return (
    <Card className="w-full max-w-sm mx-auto bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Live Preview
          </h3>
          <p className="text-sm text-gray-600">
            This is how your ChronoStamp will look
          </p>
        </div>

        {hasData ? (
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            {/* NFT Image */}
            <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
              {data.imageUrl ? (
                <img
                  src={data.imageUrl}
                  alt={data.name || 'Event preview'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-sm">Upload an image</p>
                  </div>
                </div>
              )}
            </div>

            {/* NFT Details */}
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 text-lg">
                  {data.name || 'Event Name'}
                </h4>
                <p className="text-xs text-purple-600 font-medium">
                  ChronoStamp NFT
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {data.description || 'Event description will appear here...'}
                </p>
              </div>

              {/* Mock NFT Properties */}
              <div className="border-t pt-3 mt-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-500">Token ID</p>
                    <p className="font-mono">#1234</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-gray-500">Blockchain</p>
                    <p className="font-medium">Polygon</p>
                  </div>
                </div>
              </div>

              {/* Mock Rarity Badge */}
              <div className="flex justify-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  ✨ Attendance Proof
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 shadow-sm border text-center">
            <div className="text-gray-400 mb-4">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-sm">
                Fill in the form to see your ChronoStamp preview
              </p>
            </div>
          </div>
        )}

        {/* Preview Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Preview updates as you type ✨
          </p>
        </div>
      </CardContent>
    </Card>
  );
}