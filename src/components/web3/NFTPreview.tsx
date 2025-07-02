"use client";

import { Card, CardContent } from "~/components/ui/Card";
import Image from "next/image";

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
    <Card className="mx-auto w-full max-w-sm border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="mb-4 text-center">
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Live Preview
          </h3>
          <p className="text-sm text-gray-600">
            This is how your ChronoStamp will look
          </p>
        </div>

        {hasData ? (
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            {/* NFT Image */}
            <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
              {data.imageUrl ? (
                <Image
                  src={data.imageUrl}
                  alt={data.name || "Event preview"}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="mb-2 text-4xl">🖼️</div>
                    <p className="text-sm">Upload an image</p>
                  </div>
                </div>
              )}
            </div>

            {/* NFT Details */}
            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {data.name || "Event Name"}
                </h4>
                <p className="text-xs font-medium text-purple-600">
                  ChronoStamp NFT
                </p>
              </div>

              <div>
                <p className="text-sm leading-relaxed text-gray-600">
                  {data.description || "Event description will appear here..."}
                </p>
              </div>

              {/* Mock NFT Properties */}
              <div className="mt-3 border-t pt-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded bg-gray-50 p-2">
                    <p className="text-gray-500">Token ID</p>
                    <p className="font-mono">#1234</p>
                  </div>
                  <div className="rounded bg-gray-50 p-2">
                    <p className="text-gray-500">Blockchain</p>
                    <p className="font-medium">Polygon</p>
                  </div>
                </div>
              </div>

              {/* Mock Rarity Badge */}
              <div className="flex justify-center">
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                  ✨ Attendance Proof
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-gray-400">
              <div className="mb-4 text-6xl">📝</div>
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
