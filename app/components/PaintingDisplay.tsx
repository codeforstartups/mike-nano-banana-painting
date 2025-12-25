"use client";

// Using regular img tag for local images to avoid Next.js Image optimization issues

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
    <div className="h-full flex flex-col overflow-hidden">
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
          Generated Painting
        </h2>
        <p className="text-sm text-gray-500">
          Your AI-generated masterpiece
        </p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {/* Painting Display Area */}
        <div className="flex-1 min-h-0 border border-gray-200 rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-sm">
          {isGenerating ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-gray-300 border-t-gray-900 mb-4"></div>
              <p className="text-gray-600 font-medium text-sm sm:text-base">Creating your masterpiece...</p>
              <p className="text-gray-400 text-xs mt-2">This may take a moment</p>
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
                <img
                  src={paintingUrl}
                  alt="Generated painting"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    console.error("Image load error:", paintingUrl);
                    // Fallback to a placeholder or retry
                  }}
                />
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 px-4">
              <svg
                className="mx-auto h-16 w-16 sm:h-20 sm:w-20 mb-4"
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
              <p className="text-base sm:text-lg font-medium">Your painting will appear here</p>
              <p className="text-xs sm:text-sm mt-2 text-gray-500">Upload an image and generate to see the result</p>
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

