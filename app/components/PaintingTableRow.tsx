"use client";

import Image from "next/image";

interface PaintingTableRowProps {
  index: number;
  folderName: string;
  originalImageUrl: string | null;
  generatedImageUrl: string | null;
  createdAt: string;
  onImageClick: (imageUrl: string, alt: string) => void;
}

export default function PaintingTableRow({
  index,
  folderName,
  originalImageUrl,
  generatedImageUrl,
  createdAt,
  onImageClick,
}: PaintingTableRowProps) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors duration-150">
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 align-middle">
        {index + 1}
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap align-middle">
        <div
          className="w-20 h-20 relative bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden group"
          onClick={() => {
            if (originalImageUrl) {
              onImageClick(originalImageUrl, "Original image");
            }
          }}
        >
          {originalImageUrl ? (
            <Image
              src={originalImageUrl}
              alt="Original"
              fill
              className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              N/A
            </div>
          )}
        </div>
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap align-middle">
        {generatedImageUrl ? (
          <div
            className="w-20 h-20 relative bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-gray-300 hover:shadow-sm transition-all duration-200 overflow-hidden group"
            onClick={() =>
              onImageClick(generatedImageUrl, "Generated painting")
            }
          >
            <Image
              src={generatedImageUrl}
              alt="Generated"
              fill
              className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        ) : (
          <div className="w-20 h-20 relative bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
            N/A
          </div>
        )}
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 align-middle">
        {createdAt}
      </td>
      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm align-middle">
        {generatedImageUrl ? (
          <a
            href={generatedImageUrl}
            download={`generated-${folderName}`}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            Download
          </a>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )}
      </td>
    </tr>
  );
}
