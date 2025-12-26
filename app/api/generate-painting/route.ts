import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import { join } from "path";

/**
 * Load the frame template image - NO TEXT MODIFICATION
 * Text will be added by AI inside the painting
 */
async function loadFrameTemplate(frameType: string): Promise<Buffer | null> {
  console.log("🖼️ Loading frame template...");
  console.log(`   Frame type: ${frameType}`);

  // Map frame types to file names - all frames are .jpeg format
  const frameFileMap: Record<string, string> = {
    "natural-oak": "Natural-oak-frame.jpeg",
    "dark-oak": "Dark-oak-frame.jpeg",
    "black-oak": "Black-oak-frame.jpeg",
    "white-oak": "White-oak-frame.jpeg",
  };

  const fileName = frameFileMap[frameType];
  if (!fileName) {
    console.error(`❌ Unknown frame type: ${frameType}`);
    return null;
  }

  try {
    const framePath = join(process.cwd(), "public", "frames", fileName);
    console.log(`📂 Looking for frame at: ${framePath}`);

    // Check if file exists before reading
    const fs = await import("fs/promises");
    try {
      await fs.access(framePath);
      console.log(`✅ Frame file exists`);
    } catch (accessError: any) {
      console.error(`❌ Frame file does not exist: ${framePath}`);
      console.error(`   Error: ${accessError.message}`);
      return null;
    }

    const frameBuffer = await readFile(framePath);
    console.log(`✅ Frame template loaded: ${frameBuffer.length} bytes`);

    // Validate buffer is not empty
    if (frameBuffer.length === 0) {
      console.error(`❌ Frame file is empty: ${fileName}`);
      return null;
    }

    // Check if it's a valid image by checking first bytes
    const firstBytes = frameBuffer.slice(0, 4);
    const isValidJPEG = firstBytes[0] === 0xff && firstBytes[1] === 0xd8;
    if (!isValidJPEG) {
      console.warn(
        `⚠️  Frame file may not be a valid JPEG (first bytes: ${Array.from(
          firstBytes
        )
          .map((b) => "0x" + b.toString(16))
          .join(", ")})`
      );
      // Continue anyway, might still work
    } else {
      console.log(`✅ Frame file is a valid JPEG`);
    }

    // Return the template as-is, AI will handle everything
    return frameBuffer;
  } catch (error: any) {
    console.error(`❌ Error loading frame template: ${error.message}`);
    console.error(`   Stack: ${error.stack}`);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📥 Received request to generate painting");

    const {
      imageBase64,
      userPrompt,
      removeObstacles = false,
      address = "",
      name = "",
      frameType = "none",
    } = await request.json();

    console.log("📋 Request parameters:");
    console.log(`   - Frame type: ${frameType}`);
    console.log(`   - Remove obstacles: ${removeObstacles}`);
    console.log(`   - Address: ${address ? "provided" : "not provided"}`);
    console.log(`   - Name: ${name ? "provided" : "not provided"}`);
    console.log(
      `   - Image base64 length: ${imageBase64 ? imageBase64.length : 0} chars`
    );

    // Use the actual frame type from request (no longer forcing natural-oak)
    const actualFrameType = frameType;

    if (!imageBase64) {
      console.error("❌ No image provided in request");
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    console.log("🔑 Checking API key...");
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      console.error("❌ API key not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }
    console.log("✅ API key found");

    const ai = new GoogleGenAI({ apiKey });

    // Remove data URL prefix if present
    console.log("🖼️ Processing original image...");
    console.log(
      `   - Original imageBase64 length: ${imageBase64.length} chars`
    );
    console.log(`   - Has data URL prefix: ${imageBase64.includes(",")}`);

    const base64Image = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;

    console.log(
      `✅ Original image base64 extracted: ${base64Image.length} chars`
    );
    console.log(`   - First 50 chars: ${base64Image.substring(0, 50)}...`);

    // Determine image MIME type automatically from data URL
    // Supports: JPEG, PNG, WebP, GIF, BMP, and more
    let mimeType = "image/jpeg"; // Default fallback

    if (imageBase64.startsWith("data:image/")) {
      // Extract MIME type from data URL: data:image/[type];base64,...
      const mimeMatch = imageBase64.match(/^data:image\/([^;]+);/);
      if (mimeMatch && mimeMatch[1]) {
        const detectedType = mimeMatch[1].toLowerCase();

        // Map common variations to standard MIME types
        if (detectedType === "jpeg" || detectedType === "jpg") {
          mimeType = "image/jpeg";
        } else if (detectedType === "png") {
          mimeType = "image/png";
        } else if (detectedType === "webp") {
          mimeType = "image/webp";
        } else if (detectedType === "gif") {
          mimeType = "image/gif";
        } else if (detectedType === "bmp") {
          mimeType = "image/bmp";
        } else {
          // For other types, use the detected type as-is
          mimeType = `image/${detectedType}`;
        }
      }
    }

    console.log(`   - Detected MIME type: ${mimeType}`);

    // Build the text to add (name and/or address)
    let textToAdd = "";
    if (name.trim() && address.trim()) {
      textToAdd = `${name.trim()}\n${address.trim()}`;
    } else if (name.trim()) {
      textToAdd = name.trim();
    } else if (address.trim()) {
      textToAdd = address.trim();
    }

    // Handle frame template approach
    let templateImageBase64: string | null = null;

    // Build the AI prompt - EXACTLY like test.js
    let systemPrompt = "";

    if (actualFrameType !== "none") {
      console.log("🖼️ Loading frame template...");
      console.log(`   - Frame type requested: ${actualFrameType}`);
      const templateBuffer = await loadFrameTemplate(actualFrameType);

      if (!templateBuffer) {
        console.error(
          `❌ Failed to load frame template for: ${actualFrameType}`
        );
        return NextResponse.json(
          {
            error: `Failed to load frame template: ${actualFrameType}. Please check server logs for details.`,
          },
          { status: 500 }
        );
      }

      console.log(`✅ Frame buffer loaded: ${templateBuffer.length} bytes`);
      templateImageBase64 = templateBuffer.toString("base64");
      console.log(
        `✅ Frame converted to base64: ${templateImageBase64.length} chars`
      );
      console.log(
        `   - First 50 chars of frame base64: ${templateImageBase64.substring(
          0,
          50
        )}...`
      );

      // Build prompt EXACTLY like test.js - NO CHANGES
      systemPrompt = `You are a master watercolor artist. Transform the first image (a house photograph) into a beautiful watercolor painting and place it inside the empty frame shown in the second image.

CRITICAL REQUIREMENTS:

1. WATERCOLOR TRANSFORMATION:
   - Transform the house photograph into a professional watercolor painting
   - Use soft, flowing brushstrokes with translucent watercolor layers
   - Apply gentle color bleeding at edges
   - Show visible watercolor paper texture
   - Use wet-on-wet blending techniques
   - Maintain the exact composition and subject matter from the photograph
   - The painting MUST look hand-painted in watercolor style

2. FRAME PLACEMENT:
   - The second image shows an empty picture frame with white matting
   - Place your watercolor painting INSIDE the empty white center area of the frame
   - The painting should fit perfectly within the frame's opening
   - Preserve the exact frame, matting, and all borders from the second image
   - Do NOT modify the frame dimensions or appearance

3. OUTPUT REQUIREMENTS:
   - Your output must be the COMPLETE final image: frame + matting + watercolor painting
   - The output image dimensions must match the frame image dimensions EXACTLY
   - Do NOT resize or crop the frame - preserve it exactly as shown
   - The watercolor painting should fill the empty white center area of the frame

4. TEXT (if needed):
   - If address/name text is needed, add it INSIDE the painting area using Ocean Trace elegant script font
   - Place text in bottom-right corner of the painting area, not on the white matting

Generate the complete framed watercolor painting now.`;

      // Add text instructions if text is provided - EXACTLY like test.js
      if (textToAdd) {
        systemPrompt += `\n\nAdd this text INSIDE the painting area (bottom-right corner): "${textToAdd}"`;
      }
    } else {
      // No frame - generate painting only (EXACTLY like test.js would handle it)
      systemPrompt = `You are a master watercolor artist. Transform the provided photograph into a beautiful watercolor painting.

CRITICAL WATERCOLOR STYLE REQUIREMENTS:
- Create a professional watercolor painting with soft, flowing brushstrokes
- Use translucent watercolor layers with gentle color bleeding at edges
- Show visible watercolor paper texture
- Use wet-on-wet blending techniques
- Maintain the exact composition and subject matter from the photograph
- The painting MUST look hand-painted in watercolor style`;

      if (textToAdd) {
        systemPrompt += `\n\nAdd this text in the bottom-right corner: "${textToAdd}"`;
      }
    }

    // Add remove obstacles instruction if requested
    if (removeObstacles) {
      systemPrompt += `\n\n🧹 CLEANUP INSTRUCTION:
Remove all unwanted objects, obstacles, power lines, trash, or distractions from the scene. Clean up the composition to focus on the main subject (the house and its natural surroundings).`;
    }

    // Add user's additional style preferences if provided
    if (userPrompt?.trim()) {
      systemPrompt += `\n\n💭 ADDITIONAL STYLE PREFERENCES:
${userPrompt}

Incorporate these preferences while maintaining all the requirements above.`;
    }

    // Build contents array
    console.log("\n📦 Building contents array for AI...");
    const contents: any[] = [
      {
        text: systemPrompt,
      },
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Image,
        },
      },
    ];
    console.log(`✅ Added text prompt (${systemPrompt.length} chars)`);
    console.log(
      `✅ Added original image (${base64Image.length} chars base64, ${mimeType})`
    );

    // Add template image as second image if frame is selected - EXACTLY like test.js
    if (templateImageBase64) {
      console.log("📎 Adding template as second image...");
      contents.push({
        inlineData: {
          mimeType: "image/jpeg", // Frames are .jpeg format
          data: templateImageBase64,
        },
      });
    }

    // Generate the image using Gemini
    let response;
    let modelUsed = "";

    try {
      console.log("🚀 Calling Gemini 3 Pro Image Preview...");
      console.log("   Model: gemini-3-pro-image-preview");
      if (templateImageBase64) {
        console.log("   Input: Original photo + Frame template");
      } else {
        console.log("   Input: Original photo (no frame)");
      }

      const imageConfig: any = {
        responseModalities: ["TEXT", "IMAGE"],
      };

      // If template provided, match test.js exactly - no aspect ratio constraint
      if (templateImageBase64) {
        imageConfig.imageConfig = {
          imageSize: "2K", // High quality, no aspect ratio constraint to match frame
        };
      } else {
        // No frame - use aspect ratio like before
        imageConfig.imageConfig = {
          aspectRatio: "3:4",
          imageSize: "2K",
        };
      }

      response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: contents,
        config: imageConfig,
      });
      modelUsed = "gemini-3-pro-image-preview";
      console.log("✅ Generated using Nano Banana Pro");
    } catch (e: any) {
      console.log("Falling back to Nano Banana...");

      const imageConfig: any = {
        responseModalities: ["TEXT", "IMAGE"],
      };

      if (!templateImageBase64) {
        imageConfig.imageConfig = {
          aspectRatio: "3:4",
        };
      }

      response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: contents,
        config: imageConfig,
      });
      modelUsed = "gemini-2.5-flash-image";
      console.log("✅ Generated using Nano Banana");
    }

    // Extract generated image
    let generatedImageData = null;
    let generatedImageMimeType = "image/png";
    let description = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImageData = part.inlineData.data;
          generatedImageMimeType = part.inlineData.mimeType || "image/png";
        } else if (part.text) {
          description = part.text;
        }
      }
    }

    if (!generatedImageData) {
      return NextResponse.json(
        { error: "No image was generated", description },
        { status: 500 }
      );
    }

    // Save the generated image
    try {
      const storageDir = join(process.cwd(), "public", "generated-paintings");
      await mkdir(storageDir, { recursive: true });

      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 9);
      const folderName = `painting-${timestamp}-${randomSuffix}`;
      const paintingFolder = join(storageDir, folderName);
      await mkdir(paintingFolder, { recursive: true });

      // Save original image
      const originalExt = mimeType.split("/")[1].replace("jpeg", "jpg");
      const originalImageBuffer = Buffer.from(base64Image, "base64");
      const originalFilePath = join(paintingFolder, `original.${originalExt}`);
      await writeFile(originalFilePath, originalImageBuffer);

      // Save generated image (already has frame/matting if template was used)
      const generatedExt = generatedImageMimeType
        .split("/")[1]
        .replace("jpeg", "jpg");
      const generatedImageBuffer = Buffer.from(generatedImageData, "base64");
      const finalFilePath = join(paintingFolder, `generated.${generatedExt}`);
      await writeFile(finalFilePath, generatedImageBuffer);

      const finalImageUrl = `/generated-paintings/${folderName}/generated.${generatedExt}`;

      return NextResponse.json({
        success: true,
        description:
          description || "Watercolor painting generated successfully!",
        imageUrl: finalImageUrl,
        originalImageUrl: `/generated-paintings/${folderName}/original.${originalExt}`,
        folderName: folderName,
        message: `Painting generated successfully using ${modelUsed}!`,
        model: modelUsed,
      });
    } catch (saveError: any) {
      console.error("Error saving:", saveError);

      // Fallback: return base64
      const generatedImageBuffer = Buffer.from(generatedImageData, "base64");
      const fallbackUrl = `data:image/png;base64,${generatedImageBuffer.toString(
        "base64"
      )}`;

      return NextResponse.json({
        success: true,
        description: description || "Painting generated successfully!",
        imageUrl: fallbackUrl,
        warning: "Could not save to disk, using base64",
        model: modelUsed,
      });
    }
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate painting" },
      { status: 500 }
    );
  }
}
