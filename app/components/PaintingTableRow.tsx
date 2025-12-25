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
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div
          className="w-24 h-24 relative bg-gray-100 rounded cursor-pointer hover:opacity-80 transition-opacity"
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
              className="object-cover rounded"
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
            className="w-24 h-24 relative bg-gray-100 rounded cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() =>
              onImageClick(generatedImageUrl, "Generated painting")
            }
          >
            <Image
              src={generatedImageUrl}
              alt="Generated"
              fill
              className="object-cover rounded"
            />
          </div>
        ) : (
          <div className="w-24 h-24 relative bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
            N/A
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {createdAt}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {generatedImageUrl ? (
          <a
            href={generatedImageUrl}
            download={`generated-${folderName}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Download
          </a>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
    </tr>
  );
}
