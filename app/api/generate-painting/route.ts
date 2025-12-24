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
            aspectRatio: "1:1", // Match original or adjust as needed
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
              aspectRatio: "1:1",
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

        // Generate unique filename with timestamp
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 9);
        const fileExtension = generatedImageMimeType.split("/")[1] || "png";
        const filename = `painting-${timestamp}-${randomSuffix}.${fileExtension}`;
        const filePath = join(storageDir, filename);

        // Convert base64 to buffer and save
        const imageBuffer = Buffer.from(generatedImageData, "base64");
        await writeFile(filePath, imageBuffer);

        // Create URL path for the saved image
        const imageUrl = `/generated-paintings/${filename}`;

        console.log(`✅ Image saved to: ${filePath}`);
        console.log(`📁 Accessible at: ${imageUrl}`);

        return NextResponse.json({
          success: true,
          description:
            description ||
            "Painting generated successfully with artistic transformation!",
          imageUrl: imageUrl,
          localPath: filePath,
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
