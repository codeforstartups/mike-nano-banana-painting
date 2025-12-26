"use client";

import { useRef, useState } from "react";

interface PaintingOptions {
  removeObstacles: boolean;
  address: string;
  name: string;
  frameType: "none" | "natural-oak" | "black-oak" | "dark-oak" | "white-oak";
}

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  userPrompt: string;
  onPromptChange: (prompt: string) => void;
  paintingOptions: PaintingOptions;
  onOptionsChange: (options: PaintingOptions) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasImage: boolean;
}

export default function ImageUpload({
  onImageUpload,
  userPrompt,
  onPromptChange,
  paintingOptions,
  onOptionsChange,
  onGenerate,
  isGenerating,
  hasImage,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Create Your Painting
        </h1>
        <p className="text-sm text-gray-500">
          Upload an image and customize your painting
        </p>
      </div>

      {/* Image Upload Area */}
      <div className="flex-1 min-h-0 mb-6">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50/50 transition-all duration-200 bg-white h-full flex items-center justify-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {preview ? (
            <div className="relative w-full h-full max-h-full rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Uploaded image"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="py-6 sm:py-8">
              <svg
                className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4">
                <p className="text-base sm:text-lg font-medium text-gray-900">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Painting Options */}
      <div className="mb-4 space-y-4 flex-shrink-0 overflow-y-auto">
        {/* Remove Obstacles */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="removeObstacles"
            checked={paintingOptions.removeObstacles}
            onChange={(e) =>
              onOptionsChange({
                ...paintingOptions,
                removeObstacles: e.target.checked,
              })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
          />
          <label
            htmlFor="removeObstacles"
            className="ml-2 block text-sm text-gray-700 cursor-pointer"
          >
            Remove all obstacles from the image
          </label>
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            value={paintingOptions.address}
            onChange={(e) =>
              onOptionsChange({ ...paintingOptions, address: e.target.value })
            }
            placeholder="Enter address or location"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
          />
        </div>

        {/* Frame Option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Pick Your Frame
          </label>
          <div className="flex gap-2 flex-wrap">
            {/* Natural Oak */}
            <button
              type="button"
              onClick={() =>
                onOptionsChange({
                  ...paintingOptions,
                  frameType: "natural-oak",
                })
              }
              className={`flex flex-col items-center p-1.5 w-20 rounded-md bg-white border transition-all ${
                paintingOptions.frameType === "natural-oak"
                  ? "border-blue-600 shadow-sm ring-1 ring-blue-600"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="w-10 h-10 rounded mb-1 relative overflow-hidden bg-white">
                {/* Outer frame - Natural Oak (mitered corner in top-left) */}
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    background: `linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)`,
                    clipPath: "polygon(0 0, 0 35%, 35% 0)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(180, 83, 9, 0.15) 1px, rgba(180, 83, 9, 0.15) 2px)`,
                      clipPath: "polygon(0 0, 0 35%, 35% 0)",
                      backgroundSize: "4px 4px",
                    }}
                  ></div>
                </div>
                {/* White matting with beveled edge (inner border) */}
                <div className="absolute inset-1.5 bg-white rounded-sm"></div>
                {/* Inner opening showing the painting area */}
                <div className="absolute inset-3 bg-gray-50 rounded-sm"></div>
              </div>
              <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                Natural Oak
              </span>
            </button>

            {/* Black Oak */}
            <button
              type="button"
              onClick={() =>
                onOptionsChange({ ...paintingOptions, frameType: "black-oak" })
              }
              className={`flex flex-col items-center p-1.5 w-20 rounded-md bg-white border transition-all ${
                paintingOptions.frameType === "black-oak"
                  ? "border-blue-600 shadow-sm ring-1 ring-blue-600"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="w-10 h-10 rounded mb-1 relative overflow-hidden bg-white">
                {/* Outer frame - Black Oak (mitered corner in top-left) */}
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    background: `linear-gradient(135deg, #1f2937 0%, #111827 50%, #000000 100%)`,
                    clipPath: "polygon(0 0, 0 35%, 35% 0)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(0, 0, 0, 0.3) 1px, rgba(0, 0, 0, 0.3) 2px)`,
                      clipPath: "polygon(0 0, 0 35%, 35% 0)",
                      backgroundSize: "3px 3px",
                    }}
                  ></div>
                </div>
                {/* White matting with beveled edge (inner border) */}
                <div className="absolute inset-1.5 bg-white rounded-sm"></div>
                {/* Inner opening showing the painting area */}
                <div className="absolute inset-3 bg-gray-50 rounded-sm"></div>
              </div>
              <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                Black Oak
              </span>
            </button>

            {/* Dark Oak */}
            <button
              type="button"
              onClick={() =>
                onOptionsChange({ ...paintingOptions, frameType: "dark-oak" })
              }
              className={`flex flex-col items-center p-1.5 w-20 rounded-md bg-white border transition-all ${
                paintingOptions.frameType === "dark-oak"
                  ? "border-blue-600 shadow-sm ring-1 ring-blue-600"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="w-10 h-10 rounded mb-1 relative overflow-hidden bg-white">
                {/* Outer frame - Dark Oak (mitered corner in top-left) */}
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    background: `linear-gradient(135deg, #78350f 0%, #92400e 50%, #7c2d12 100%)`,
                    clipPath: "polygon(0 0, 0 35%, 35% 0)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(120, 53, 15, 0.25) 1px, rgba(120, 53, 15, 0.25) 2px)`,
                      clipPath: "polygon(0 0, 0 35%, 35% 0)",
                      backgroundSize: "4px 4px",
                    }}
                  ></div>
                </div>
                {/* White matting with beveled edge (inner border) */}
                <div className="absolute inset-1.5 bg-white rounded-sm"></div>
                {/* Inner opening showing the painting area */}
                <div className="absolute inset-3 bg-gray-50 rounded-sm"></div>
              </div>
              <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                Dark Oak
              </span>
            </button>

            {/* White Oak */}
            <button
              type="button"
              onClick={() =>
                onOptionsChange({ ...paintingOptions, frameType: "white-oak" })
              }
              className={`flex flex-col items-center p-1.5 w-20 rounded-md bg-white border transition-all ${
                paintingOptions.frameType === "white-oak"
                  ? "border-blue-600 shadow-sm ring-1 ring-blue-600"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div className="w-10 h-10 rounded mb-1 relative overflow-hidden bg-white">
                {/* Outer frame - White Oak (mitered corner in top-left) */}
                <div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    background: `linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #e5e7eb 100%)`,
                    clipPath: "polygon(0 0, 0 35%, 35% 0)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(156, 163, 175, 0.2) 1px, rgba(156, 163, 175, 0.2) 2px)`,
                      clipPath: "polygon(0 0, 0 35%, 35% 0)",
                      backgroundSize: "4px 4px",
                    }}
                  ></div>
                </div>
                {/* White matting with beveled edge (inner border) */}
                <div className="absolute inset-1.5 bg-white rounded-sm"></div>
                {/* Inner opening showing the painting area */}
                <div className="absolute inset-3 bg-gray-50 rounded-sm"></div>
              </div>
              <span className="text-xs text-gray-700 font-medium whitespace-nowrap">
                White Oak
              </span>
            </button>
          </div>
        </div>

        {/* User Prompt Input */}
        {/* <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Optional: Additional Style Preferences
          </label>
          <textarea
            id="prompt"
            rows={3}
            value={userPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Additional style preferences (e.g., 'vibrant colors, warm tones')"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div> */}
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={!hasImage || isGenerating}
        className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex-shrink-0 shadow-sm hover:shadow-md disabled:shadow-none"
      >
        {isGenerating ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating...
          </span>
        ) : (
          "Generate Painting"
        )}
      </button>
    </div>
  );
}
