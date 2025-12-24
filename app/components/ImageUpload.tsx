"use client";

import { useRef, useState } from "react";

interface PaintingOptions {
  removeObstacles: boolean;
  address: string;
  name: string;
  withFrame: boolean;
  aspectRatio: "1:1" | "16:9" | "9:16";
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6 flex-shrink-0">
        Create Your Painting
      </h1>

      {/* Image Upload Area */}
      <div className="flex-1 min-h-0 mb-6">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 h-full flex items-center justify-center"
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
            <div className="py-8">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
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
                <p className="text-lg font-medium text-gray-900">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Painting Options */}
      <div className="mb-4 space-y-3 flex-shrink-0 overflow-y-auto">
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
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="removeObstacles"
            className="ml-2 block text-sm text-gray-700"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Aspect Ratio Option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aspect Ratio
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="aspectRatio"
                checked={paintingOptions.aspectRatio === "1:1"}
                onChange={() =>
                  onOptionsChange({ ...paintingOptions, aspectRatio: "1:1" })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Square (1:1)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="aspectRatio"
                checked={paintingOptions.aspectRatio === "16:9"}
                onChange={() =>
                  onOptionsChange({ ...paintingOptions, aspectRatio: "16:9" })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                Landscape (16:9)
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="aspectRatio"
                checked={paintingOptions.aspectRatio === "9:16"}
                onChange={() =>
                  onOptionsChange({ ...paintingOptions, aspectRatio: "9:16" })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">
                Portrait (9:16)
              </span>
            </label>
          </div>
        </div>

        {/* Frame Option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frame
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="frame"
                checked={paintingOptions.withFrame}
                onChange={() =>
                  onOptionsChange({ ...paintingOptions, withFrame: true })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">With Frame</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="frame"
                checked={!paintingOptions.withFrame}
                onChange={() =>
                  onOptionsChange({ ...paintingOptions, withFrame: false })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Without Frame</span>
            </label>
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
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
      >
        {isGenerating ? "Generating..." : "Generate Painting"}
      </button>
    </div>
  );
}
