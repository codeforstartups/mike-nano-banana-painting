"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../../components/ImageUpload";
import PaintingDisplay from "../../components/PaintingDisplay";

export default function GeneratePaintingPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState<string>("");
  const [paintingOptions, setPaintingOptions] = useState({
    removeObstacles: false,
    address: "",
    name: "",
    withFrame: false,
    aspectRatio: "1:1" as "1:1" | "16:9" | "9:16",
  });
  const [generatedPainting, setGeneratedPainting] = useState<string | null>(
    null
  );
  const [paintingDescription, setPaintingDescription] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Check if API key is configured on mount
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch("/api/test-api-key");
        const data = await response.json();
        console.log("API Key Status:", data);
      } catch (error) {
        console.error("Error checking API key:", error);
      }
    };

    checkApiKey();
  }, []);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
  };

  const handleGenerate = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setGeneratedPainting(null);
    setPaintingDescription("");

    try {
      const response = await fetch("/api/generate-painting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: uploadedImage,
          userPrompt: userPrompt,
          removeObstacles: paintingOptions.removeObstacles,
          address: paintingOptions.address,
          name: paintingOptions.name,
          withFrame: paintingOptions.withFrame,
          aspectRatio: paintingOptions.aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate painting");
      }

      setGeneratedPainting(data.imageUrl || uploadedImage);
      setPaintingDescription(
        data.description || "Painting generated successfully."
      );
    } catch (error: any) {
      console.error("Error generating painting:", error);
      setPaintingDescription(`Error: ${error.message}. Please try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full bg-gray-50 overflow-hidden">
      <div className="flex h-full">
        {/* Left Side - Image Upload and Prompt */}
        <div className="w-1/2 border-r border-gray-200 p-6 overflow-hidden flex flex-col">
          <ImageUpload
            onImageUpload={handleImageUpload}
            userPrompt={userPrompt}
            onPromptChange={setUserPrompt}
            paintingOptions={paintingOptions}
            onOptionsChange={setPaintingOptions}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            hasImage={!!uploadedImage}
          />
        </div>

        {/* Right Side - Generated Painting Display */}
        <div className="w-1/2 p-6 overflow-hidden flex flex-col">
          <PaintingDisplay
            paintingUrl={generatedPainting}
            description={paintingDescription}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
}
