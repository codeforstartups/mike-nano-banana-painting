"use client";

import Image from "next/image";

interface PaintingDisplayProps {
  paintingUrl: string | null;
  description: string;
  isGenerating: boolean;
}

export default function PaintingDisplay({
  paintingUrl,
  description,
  isGenerating,
}: PaintingDisplayProps) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">
        Your Generated Painting
      </h2>

      <div className="flex-1 flex flex-col">
        {/* Painting Display Area */}
        <div className="flex-1 mb-6 border-2 border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center min-h-[400px]">
          {isGenerating ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Creating your masterpiece...</p>
            </div>
          ) : paintingUrl ? (
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              {paintingUrl.startsWith('data:') ? (
                <img
                  src={paintingUrl}
                  alt="Generated painting"
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src={paintingUrl}
                  alt="Generated painting"
                  fill
                  className="object-contain"
                />
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <svg
                className="mx-auto h-24 w-24 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-lg">Your painting will appear here</p>
              <p className="text-sm mt-2">Upload an image and generate to see the result</p>
            </div>
          )}
        </div>

        {/* Description Section */}
        {/* {description && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Painting Details
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}

