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
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="text-sm font-semibold text-gray-900">{index + 1}</div>
      </td>
      <td className="px-6 py-5">
        <div
          className="w-24 h-24 relative bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-gray-400 hover:shadow-md transition-all duration-200 overflow-hidden group border border-gray-200"
          onClick={() => {
            if (originalImageUrl) {
              onImageClick(originalImageUrl, "Original photograph");
            }
          }}
        >
          {originalImageUrl ? (
            <>
              <Image
                src={originalImageUrl}
                alt="Original photograph"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
              Not available
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-5">
        {generatedImageUrl ? (
          <div
            className="w-24 h-24 relative bg-gray-100 rounded-lg cursor-pointer hover:ring-2 hover:ring-gray-400 hover:shadow-md transition-all duration-200 overflow-hidden group border border-gray-200"
            onClick={() =>
              onImageClick(generatedImageUrl, "Watercolor painting")
            }
          >
            <Image
              src={generatedImageUrl}
              alt="Watercolor painting"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
          </div>
        ) : (
          <div className="w-24 h-24 relative bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs border border-gray-200">
            Not available
          </div>
        )}
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        <div className="text-sm text-gray-600">{createdAt}</div>
      </td>
      <td className="px-6 py-5 whitespace-nowrap">
        {generatedImageUrl ? (
          <a
            href={generatedImageUrl}
            download={`painting-${folderName}.png`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-150 shadow-sm hover:shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </a>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )}
      </td>
    </tr>
  );
}
