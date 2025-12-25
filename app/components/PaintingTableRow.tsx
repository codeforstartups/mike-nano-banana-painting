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
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div
          className="w-20 h-20 relative bg-gray-100 rounded-md cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all duration-200 overflow-hidden group"
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
              className="object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              N/A
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {generatedImageUrl ? (
          <div
            className="w-20 h-20 relative bg-gray-100 rounded-md cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all duration-200 overflow-hidden group"
            onClick={() =>
              onImageClick(generatedImageUrl, "Generated painting")
            }
          >
            <Image
              src={generatedImageUrl}
              alt="Generated"
              fill
              className="object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        ) : (
          <div className="w-20 h-20 relative bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
            N/A
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {createdAt}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {generatedImageUrl ? (
          <a
            href={generatedImageUrl}
            download={`generated-${folderName}`}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-150"
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
