"use client";

import { useState } from "react";
import PaintingTableRow from "./PaintingTableRow";
import ImageModal from "./ImageModal";

interface Painting {
  folderName: string;
  createdAt: string;
  originalImageUrl: string | null;
  generatedImageUrl: string | null;
}

interface PaintingsTableProps {
  paintings: Painting[];
}

export default function PaintingsTable({ paintings }: PaintingsTableProps) {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalAlt, setModalAlt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (imageUrl: string, alt: string) => {
    setModalImage(imageUrl);
    setModalAlt(alt);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
    setModalAlt("");
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {paintings.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Paintings Yet
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Start generating watercolor paintings to see them appear here.
              </p>
              <a
                href="/paintings/generate"
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Generate Your First Painting
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-900">
                  All Paintings
                </h2>
                <span className="text-xs text-gray-500">
                  {paintings.length}{" "}
                  {paintings.length === 1 ? "painting" : "paintings"}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Original Photo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Watercolor Painting
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paintings.map((painting, index) => (
                    <PaintingTableRow
                      key={painting.folderName}
                      index={index}
                      folderName={painting.folderName}
                      originalImageUrl={painting.originalImageUrl}
                      generatedImageUrl={painting.generatedImageUrl}
                      createdAt={painting.createdAt}
                      onImageClick={handleImageClick}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={modalImage}
        alt={modalAlt}
        onClose={closeModal}
      />
    </>
  );
}
