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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S.N.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original Painting
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated Painting
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Download
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paintings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No paintings generated yet.
                  </td>
                </tr>
              ) : (
                paintings.map((painting, index) => (
                  <PaintingTableRow
                    key={painting.folderName}
                    index={index}
                    folderName={painting.folderName}
                    originalImageUrl={painting.originalImageUrl}
                    generatedImageUrl={painting.generatedImageUrl}
                    createdAt={painting.createdAt}
                    onImageClick={handleImageClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
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

