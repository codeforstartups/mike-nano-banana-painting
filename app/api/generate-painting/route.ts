import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const {
      imageBase64,
      userPrompt,
      removeObstacles = false,
      address = "",
      name = "",
      withFrame = false,
      aspectRatio = "1:1",
    } = await request.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;

    // Debug: Log if API key is missing (remove in production)
    if (!apiKey) {
      console.error(
        "GOOGLE_AI_API_KEY is not set. Available env vars:",
        Object.keys(process.env).filter(
          (k) => k.includes("GOOGLE") || k.includes("API")
        )
      );
      return NextResponse.json(
        {
          error: "API key not configured",
          hint: "Please ensure GOOGLE_AI_API_KEY is set in .env.local and restart the dev server",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Remove data URL prefix if present
    const base64Image = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;

    // Determine image MIME type
    let mimeType = "image/jpeg";
    if (imageBase64.startsWith("data:image/png")) {
      mimeType = "image/png";
    } else if (imageBase64.startsWith("data:image/webp")) {
      mimeType = "image/webp";
    } else if (imageBase64.startsWith("data:image/gif")) {
      mimeType = "image/gif";
    }

    // Build system prompt - STRICTLY WATERCOLOR STYLE
    let systemPrompt = `Transform this photograph into a beautiful watercolor painting. 

REQUIRED WATERCOLOR PAINTING STYLE (STRICTLY ENFORCED):
- The painting MUST be in watercolor style - this is mandatory and non-negotiable
- Use soft, flowing watercolor techniques with translucent layers and gentle color blending
- Apply characteristic watercolor effects: color bleeding, soft edges, paper texture showing through
- Use watercolor-specific techniques: wet-on-wet blending, color washes, and transparent glazes
- Maintain the exact core composition, subject matter, and scene from the original image
- Create depth through watercolor layering techniques (light to dark, transparent to opaque)
- Use vibrant but soft watercolor palettes that enhance the mood and atmosphere
- The painting should clearly show watercolor paper texture and the fluid, organic nature of watercolor paint
- Ensure the painting has a professional, gallery-quality watercolor appearance
- The output MUST look like a hand-painted watercolor artwork, not a photograph or any other painting medium`;

    // Add aspect ratio instruction
    const aspectRatioInstruction = 
      aspectRatio === "1:1" 
        ? "ASPECT RATIO REQUIREMENT (1:1 SQUARE):\n- The output image must be square (1:1 aspect ratio). Fill the entire square canvas completely with the painting.\n- Ensure the composition works well in a square format. If the original image is not square, intelligently crop or extend the scene to fill the square space naturally.\n- Adjust the framing as needed - you may need to zoom in/out, extend backgrounds, or add elements to fill the square canvas without leaving empty spaces.\n- The painting must completely fill the square frame from edge to edge."
        : aspectRatio === "16:9"
        ? "ASPECT RATIO REQUIREMENT (16:9 LANDSCAPE):\n- The output image must be landscape/widescreen (16:9 aspect ratio). Fill the entire wide canvas completely with the painting.\n- Ensure the composition works well in a landscape format. If the original image is not landscape, intelligently extend the scene horizontally or adjust the framing to fill the wide space naturally.\n- You may need to extend backgrounds, add elements to the sides, or adjust the framing to fill the wide canvas without leaving empty spaces.\n- The painting must completely fill the landscape frame from edge to edge."
        : aspectRatio === "9:16"
        ? "ASPECT RATIO REQUIREMENT (9:16 PORTRAIT):\n- The output image must be portrait/vertical (9:16 aspect ratio). Fill the entire tall canvas completely with the painting.\n- Ensure the composition works well in a portrait format. If the original image is not portrait, intelligently extend the scene vertically or adjust the framing to fill the tall space naturally.\n- You may need to extend backgrounds, add elements above or below, or adjust the framing to fill the tall canvas without leaving empty spaces.\n- The painting must completely fill the portrait frame from edge to edge."
        : "";

    if (aspectRatioInstruction) {
      systemPrompt += `\n\n${aspectRatioInstruction}`;
    }

    // Add remove obstacles instruction
    if (removeObstacles) {
      systemPrompt += `\n\nIMPORTANT: Remove all unwanted objects, obstacles, and distractions from the image. Clean up the scene to focus on the main subject.`;
    }

    // Add name and address as text in bottom right corner if provided
    let textToAdd = "";
    if (name.trim() && address.trim()) {
      textToAdd = `${name.trim()}\n${address.trim()}`;
    } else if (name.trim()) {
      textToAdd = name.trim();
    } else if (address.trim()) {
      textToAdd = address.trim();
    }

    if (textToAdd) {
      systemPrompt += `\n\nTEXT REQUIREMENT: Add the following text in the bottom right corner of the painting: "${textToAdd}". The text should be:
- Clearly legible and readable
- Positioned in the bottom right corner
- Styled appropriately for a watercolor painting (can be handwritten style, elegant script, or clean sans-serif)
- Subtle enough not to overpower the painting but visible enough to be read
- Use a color that contrasts well with the background (dark text on light areas, light text on dark areas)
- Size should be proportional to the painting (not too large, not too small)`;
    } else {
      // If address was provided but no name, still use it for context
      if (address.trim()) {
        systemPrompt += `\n\nLOCATION CONTEXT: The painting should reflect or incorporate the location/address: "${address}". This can influence the background, setting, or overall atmosphere.`;
      }
    }

    // Add frame instruction
    if (withFrame) {
      systemPrompt += `\n\nFRAME: Include a minimal, simple frame around the painting. The frame should be clean and understated - a thin, subtle border that does not distract from the watercolor painting itself. Keep it minimal and elegant, not decorative or ornate.`;
    } else {
      systemPrompt += `\n\nNO FRAME: Do not include any frame around the painting. The image should be the painting itself without any border or frame.`;
    }

    // User prompt - OPTIONAL: Additional style preferences
    const userStylePreferences = userPrompt?.trim()
      ? `\n\nADDITIONAL USER STYLE PREFERENCES:\n${userPrompt}\n\nPlease incorporate these additional style preferences while maintaining the core painting transformation requirements above.`
      : "";

    const fullPrompt = systemPrompt + userStylePreferences;

    // Try Nano Banana Pro first, then Nano Banana
    let response;
    let modelUsed = "";

    // Try gemini-3-pro-image-preview (Nano Banana Pro) first
    try {
      console.log("Trying gemini-3-pro-image-preview (Nano Banana Pro)...");
      response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: [
          {
            text: fullPrompt,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
        ],
        config: {
          responseModalities: ["TEXT", "IMAGE"],
          imageConfig: {
            aspectRatio: aspectRatio as "1:1" | "16:9" | "9:16" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "21:9",
            imageSize: "2K", // High quality
          },
        },
      });
      modelUsed = "gemini-3-pro-image-preview (Nano Banana Pro)";
      console.log("✅ Using Nano Banana Pro");
    } catch (e: any) {
      console.log(
        "Nano Banana Pro not available, trying Nano Banana...",
        e?.message
      );

      // Fallback to gemini-2.5-flash-image (Nano Banana)
      try {
        console.log("Trying gemini-2.5-flash-image (Nano Banana)...");
        response = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [
            {
              text: fullPrompt,
            },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Image,
              },
            },
          ],
          config: {
            responseModalities: ["TEXT", "IMAGE"],
            imageConfig: {
              aspectRatio: aspectRatio as "1:1" | "16:9" | "9:16" | "2:3" | "3:2" | "3:4" | "4:3" | "4:5" | "5:4" | "21:9",
            },
          },
        });
        modelUsed = "gemini-2.5-flash-image (Nano Banana)";
        console.log("✅ Using Nano Banana");
      } catch (e2: any) {
        console.error("Both image generation models failed:", e2?.message);
        return NextResponse.json(
          {
            error: "Image generation models not available",
            details: e2?.message || "Unknown error",
            hint: "Please check if your API key has access to image generation models (gemini-2.5-flash-image or gemini-3-pro-image-preview)",
          },
          { status: 500 }
        );
      }
    }

    // Extract image and text from response
    let generatedImageData = null;
    let generatedImageMimeType = "image/png";
    let description = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          // Image was generated!
          generatedImageData = part.inlineData.data;
          generatedImageMimeType = part.inlineData.mimeType || "image/png";
          console.log("✅ Image generated successfully!");
        } else if (part.text) {
          description = part.text;
        }
      }
    }

    // If image was generated, save it locally
    if (generatedImageData) {
      try {
        // Create storage directory if it doesn't exist
        const storageDir = join(process.cwd(), "public", "generated-paintings");
        await mkdir(storageDir, { recursive: true });

        // Generate unique folder name with timestamp
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 9);
        const folderName = `painting-${timestamp}-${randomSuffix}`;
        const paintingFolder = join(storageDir, folderName);
        
        // Create folder for this painting
        await mkdir(paintingFolder, { recursive: true });

        // Determine file extensions and normalize them
        const getNormalizedExt = (mime: string): string => {
          const ext = mime.split("/")[1] || "jpg";
          // Normalize jpeg to jpg for better compatibility
          if (ext === "jpeg") return "jpg";
          return ext;
        };
        
        const originalExt = getNormalizedExt(mimeType);
        const generatedExt = getNormalizedExt(generatedImageMimeType);

        // Save original uploaded image
        const originalImageBuffer = Buffer.from(base64Image, "base64");
        const originalFilePath = join(paintingFolder, `original.${originalExt}`);
        await writeFile(originalFilePath, originalImageBuffer);

        // Save generated painting image
        const generatedImageBuffer = Buffer.from(generatedImageData, "base64");
        const generatedFilePath = join(paintingFolder, `generated.${generatedExt}`);
        await writeFile(generatedFilePath, generatedImageBuffer);

        // Create URL paths for the saved images
        const originalImageUrl = `/generated-paintings/${folderName}/original.${originalExt}`;
        const generatedImageUrl = `/generated-paintings/${folderName}/generated.${generatedExt}`;

        console.log(`✅ Original image saved to: ${originalFilePath}`);
        console.log(`✅ Generated image saved to: ${generatedFilePath}`);
        console.log(`📁 Folder: ${paintingFolder}`);

        return NextResponse.json({
          success: true,
          description:
            description ||
            "Painting generated successfully with artistic transformation!",
          imageUrl: generatedImageUrl,
          originalImageUrl: originalImageUrl,
          folderName: folderName,
          localPath: paintingFolder,
          message: `Painting generated successfully using ${modelUsed}!`,
          model: modelUsed,
        });
      } catch (saveError: any) {
        console.error("Error saving image:", saveError);
        // Fallback to base64 if file save fails
        const fallbackUrl = `data:${generatedImageMimeType};base64,${generatedImageData}`;
        return NextResponse.json({
          success: true,
          description:
            description ||
            "Painting generated successfully with artistic transformation!",
          imageUrl: fallbackUrl,
          warning:
            "Image generated but could not be saved to disk. Using base64.",
          message: `Painting generated successfully using ${modelUsed}!`,
          model: modelUsed,
        });
      }
    }

    // If no image was generated, return error
    console.log("⚠️ No image generated in response");
    return NextResponse.json(
      {
        error: "No image was generated",
        description: description,
        hint: "The model returned text but no image. Please try again or check the model availability.",
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("Error generating painting:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate painting" },
      { status: 500 }
    );
  }
}
