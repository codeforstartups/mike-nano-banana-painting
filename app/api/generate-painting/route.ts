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
      frameType = "none",
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
        ? "ASPECT RATIO REQUIREMENT (4:3 LANDSCAPE):\n- The output image must be landscape with a 4:3 aspect ratio (equivalent to 12:9 inches frame dimensions). This is a traditional landscape frame ratio.\n- The image should have a classic landscape frame proportion (12 inches wide by 9 inches tall).\n- Fill the entire canvas completely with the painting. Ensure the composition works well in this landscape format.\n- If the original image is not in this ratio, intelligently extend the scene horizontally or adjust the framing to fill the space naturally.\n- You may need to extend backgrounds, add elements to the sides, or adjust the framing to fill the canvas without leaving empty spaces.\n- The painting must completely fill the landscape frame from edge to edge."
        : aspectRatio === "9:16"
        ? "ASPECT RATIO REQUIREMENT (3:4 PORTRAIT):\n- The output image must be portrait/vertical with a 3:4 aspect ratio (equivalent to 9:12 inches frame dimensions). This is a traditional portrait frame ratio.\n- The image should have a classic portrait frame proportion (9 inches wide by 12 inches tall).\n- Fill the entire canvas completely with the painting. Ensure the composition works well in this portrait format.\n- If the original image is not in this ratio, intelligently extend the scene vertically or adjust the framing to fill the space naturally.\n- You may need to extend backgrounds, add elements above or below, or adjust the framing to fill the canvas without leaving empty spaces.\n- The painting must completely fill the portrait frame from edge to edge."
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
      systemPrompt += `\n\nTEXT REQUIREMENT: Add the following text in the bottom right corner of the painting (on the white matting): "${textToAdd}". The text should be:
- Clearly legible and readable
- Positioned in the bottom right corner of the white matting area
- Styled in an elegant, flowing script font similar to "Ocean Trace" - a monoline script with fluid, cursive letterforms, delicate strokes, and graceful curves that mimic elegant handwriting
- The font should have a sophisticated, refined appearance with smooth, flowing lines that complement the watercolor painting style
- Subtle enough not to overpower the painting but visible enough to be read clearly
- Use a color that contrasts well with the white matting (typically dark gray or black text for good readability on white)
- Size should be proportional to the painting and matting (not too large, not too small - elegant and refined)
- The text should appear as if it was elegantly handwritten or printed in a high-quality script font`;
    } else {
      // If address was provided but no name, still use it for context
      if (address.trim()) {
        systemPrompt += `\n\nLOCATION CONTEXT: The painting should reflect or incorporate the location/address: "${address}". This can influence the background, setting, or overall atmosphere.`;
      }
    }

    // Calculate frame dimensions based on aspect ratio
    // Reference: 12"x16" outer, 8"x10" inner, 56mm (2.2") left/right borders, 81mm (3.2") top/bottom borders
    let frameDimensions = "";
    if (aspectRatio === "9:16") {
      // Portrait: 9"x12" outer frame
      // Proportional calculation: borders ~18.4% of width, ~20% of height
      // Inner: ~6"x7.5" (66.7% of width, 62.5% of height)
      frameDimensions = `OUTER FRAME DIMENSIONS: 9" wide x 12" tall (portrait orientation). INNER MATTING OPENING: Approximately 6" wide x 7.5" tall. MATTING BORDERS: Left/right borders approximately 1.5" (38mm) each, top/bottom borders approximately 2.25" (57mm) each. The matting borders should be wider at the top and bottom than on the sides.`;
    } else if (aspectRatio === "16:9") {
      // Landscape: 12"x9" outer frame (4:3 ratio)
      // Proportional calculation: borders similar to portrait but adjusted for landscape
      // Inner: ~8"x6" (66.7% of width, 66.7% of height)
      frameDimensions = `OUTER FRAME DIMENSIONS: 12" wide x 9" tall (landscape orientation, 4:3 ratio). INNER MATTING OPENING: Approximately 8" wide x 6" tall. MATTING BORDERS: Left/right borders approximately 2" (51mm) each, top/bottom borders approximately 1.5" (38mm) each. The matting borders should be wider on the left and right sides than at the top and bottom.`;
    } else {
      // Square: 12"x12" outer frame (proportional)
      frameDimensions = `OUTER FRAME DIMENSIONS: 12" wide x 12" tall (square orientation). INNER MATTING OPENING: Approximately 8" wide x 8" tall. MATTING BORDERS: All borders approximately 2" (51mm) each, creating equal spacing around the painting.`;
    }

    // Add frame instruction based on frame type
    // All frames should include white matting with beveled edges (like a picture frame mat board)
    // CRITICAL: Only ONE outer frame should be generated. Do not add multiple frames or borders.
    // CRITICAL: The frame must fill the ENTIRE image canvas - no extra space, padding, or background outside the frame.
    const frameInstructions: Record<string, string> = {
      none: "NO FRAME: Do not include any frame around the painting. The image should be the painting itself without any border or frame. Do not add any frames, borders, or decorative edges.",
      "natural-oak": `FRAME WITH MATTING - CRITICAL INSTRUCTIONS FOR CONSISTENCY:
- FRAME FILLS ENTIRE CANVAS: The frame MUST extend to the very edges of the image. There should be NO extra space, padding, background, or margins outside the frame. The frame should touch all four edges of the image (top, bottom, left, right). The entire generated image should be the framed painting with zero space outside the frame.
- ONLY ONE OUTER FRAME: Create exactly ONE thin Natural Oak wood frame as the outermost border. Do NOT add multiple frames, double frames, or additional borders.

- NATURAL OAK FRAME - DETAILED SPECIFICATIONS FOR CONSISTENCY:
  * COLOR: Warm, honey-toned natural oak color. The base color should be a light to medium golden-brown (similar to #D4A574 or #C9A961). It should NOT be dark brown, black, or gray. The color should be warm and inviting, like natural oak wood that has been lightly finished.
  * WOOD GRAIN: Visible, prominent oak wood grain patterns. The grain should show characteristic oak features: long, flowing lines with occasional medullary rays (small perpendicular lines that create a distinctive oak pattern). The grain should be clearly visible but not overly dramatic.
  * TEXTURE: Natural wood texture with subtle variations. The surface should show the organic nature of real oak wood with slight color variations, natural knots or grain patterns, and a matte to semi-gloss finish typical of natural oak.
  * THICKNESS: THIN and NARROW frame width (approximately 0.2 inches). The frame should be elegant and refined, not chunky or heavy.
  * APPEARANCE: Classic, traditional look with warm, natural tones. The frame should complement watercolor paintings with its warm, organic appearance.
  * MITERED CORNERS: The frame should have clean, precise mitered corners (45-degree angle joints) where the frame pieces meet, creating a professional, finished appearance.
  * CONSISTENCY: Every time "Natural Oak" is selected, the frame must have these exact characteristics: warm golden-brown color, visible oak grain patterns, thin profile, mitered corners, and natural wood texture.

- ${frameDimensions}
- WHITE MATTING: Inside the SINGLE outer frame, include a wide white mat board (matting) that surrounds the watercolor painting. The matting should be pure white (#FFFFFF or very close), approximately 1.5mm thick, with beveled (slanted) edges on the inner opening. The beveled edge should create a subtle shadow effect. The matting borders must follow the exact dimensions specified above. The matting is NOT a frame - it is a mat board inside the frame.
- FINAL STRUCTURE (from outside to inside): ONE thin Natural Oak wood frame (with exact specifications above) that fills the entire canvas edge-to-edge → White matting with beveled edges → Watercolor painting in the center.
- DO NOT add any additional frames, borders, decorative elements, or empty space outside the frame. The frame is the complete image boundary.`,
      "black-oak": `FRAME WITH MATTING - CRITICAL INSTRUCTIONS FOR CONSISTENCY:
- FRAME FILLS ENTIRE CANVAS: The frame MUST extend to the very edges of the image. There should be NO extra space, padding, background, or margins outside the frame. The frame should touch all four edges of the image (top, bottom, left, right). The entire generated image should be the framed painting with zero space outside the frame.
- ONLY ONE OUTER FRAME: Create exactly ONE thin Black Oak wood frame as the outermost border. Do NOT add multiple frames, double frames, or additional borders.

- BLACK OAK FRAME - DETAILED SPECIFICATIONS FOR CONSISTENCY:
  * COLOR: Deep, rich black color (similar to #1A1A1A or #2C2C2C). The frame should be predominantly black, but NOT pure black (#000000). It should have a very dark charcoal or ebony appearance with subtle brown undertones that hint at its oak wood origin. The color should be dark enough to provide strong contrast but still show that it's wood, not painted metal.
  * WOOD GRAIN: Subtle but visible wood grain texture. Even though the frame is black, the oak wood grain should still be faintly visible through the dark finish. The grain should appear as slightly lighter or darker variations within the black, creating texture and depth. The grain pattern should be subtle - visible upon close inspection but not overpowering.
  * TEXTURE: Smooth wood texture with a matte or satin finish. The surface should feel like stained oak wood, not painted or lacquered. There should be a slight sheen but not glossy. The texture should show the wood's natural character even through the dark stain.
  * THICKNESS: THIN and NARROW frame width (approximately 0.3-0.5 inches or 8-12mm visible width). The frame should be sleek and modern, not bulky or heavy.
  * APPEARANCE: Modern, sophisticated look with strong contrast. The black frame should provide elegant contrast against the white matting and complement the watercolor painting with its bold, contemporary aesthetic.
  * MITERED CORNERS: The frame should have clean, precise mitered corners (45-degree angle joints) where the frame pieces meet, creating a professional, finished appearance.
  * CONSISTENCY: Every time "Black Oak" is selected, the frame must have these exact characteristics: deep black color with subtle brown undertones, faintly visible oak grain, thin profile, mitered corners, and matte/satin wood texture.

- ${frameDimensions}
- WHITE MATTING: Inside the SINGLE outer frame, include a wide white mat board (matting) that surrounds the watercolor painting. The matting should be pure white (#FFFFFF or very close), approximately 1.5mm thick, with beveled (slanted) edges on the inner opening. The beveled edge should create a subtle shadow effect. The matting borders must follow the exact dimensions specified above. The matting is NOT a frame - it is a mat board inside the frame.
- FINAL STRUCTURE (from outside to inside): ONE thin Black Oak wood frame (with exact specifications above) that fills the entire canvas edge-to-edge → White matting with beveled edges → Watercolor painting in the center.
- DO NOT add any additional frames, borders, decorative elements, or empty space outside the frame. The frame is the complete image boundary.`,
      "dark-oak": `FRAME WITH MATTING - CRITICAL INSTRUCTIONS FOR CONSISTENCY:
- FRAME FILLS ENTIRE CANVAS: The frame MUST extend to the very edges of the image. There should be NO extra space, padding, background, or margins outside the frame. The frame should touch all four edges of the image (top, bottom, left, right). The entire generated image should be the framed painting with zero space outside the frame.
- ONLY ONE OUTER FRAME: Create exactly ONE thin Dark Oak wood frame as the outermost border. Do NOT add multiple frames, double frames, or additional borders.

- DARK OAK FRAME - DETAILED SPECIFICATIONS FOR CONSISTENCY:
  * COLOR: Rich, dark brown color (similar to #5C4033 or #6B4423). The frame should be a deep, warm brown - darker than natural oak but lighter than black oak. It should have a classic, traditional dark wood appearance, like dark oak or walnut. The color should be distinctly brown, not black or gray.
  * WOOD GRAIN: Prominent, clearly visible oak wood grain patterns. The grain should be more visible than in Black Oak but similar to Natural Oak. The grain should show characteristic oak features: long, flowing lines with medullary rays. The grain should be dark brown to almost black lines against the dark brown base, creating clear contrast and texture.
  * TEXTURE: Rich wood texture with natural variations. The surface should show the organic nature of dark oak wood with visible grain patterns, natural color variations, and a matte to semi-gloss finish. The texture should be more pronounced than Black Oak but similar in character to Natural Oak.
  * THICKNESS: THIN and NARROW frame width (approximately 0.3-0.5 inches or 8-12mm visible width). The frame should be elegant and refined, not chunky or heavy.
  * APPEARANCE: Classic, traditional look with rich, dark brown tones. The frame should have a timeless, elegant appearance that complements watercolor paintings with its sophisticated dark wood aesthetic.
  * MITERED CORNERS: The frame should have clean, precise mitered corners (45-degree angle joints) where the frame pieces meet, creating a professional, finished appearance.
  * CONSISTENCY: Every time "Dark Oak" is selected, the frame must have these exact characteristics: rich dark brown color (not black), prominent oak grain patterns, thin profile, mitered corners, and natural wood texture with visible grain.

- ${frameDimensions}
- WHITE MATTING: Inside the SINGLE outer frame, include a wide white mat board (matting) that surrounds the watercolor painting. The matting should be pure white (#FFFFFF or very close), approximately 1.5mm thick, with beveled (slanted) edges on the inner opening. The beveled edge should create a subtle shadow effect. The matting borders must follow the exact dimensions specified above. The matting is NOT a frame - it is a mat board inside the frame.
- FINAL STRUCTURE (from outside to inside): ONE thin Dark Oak wood frame (with exact specifications above) that fills the entire canvas edge-to-edge → White matting with beveled edges → Watercolor painting in the center.
- DO NOT add any additional frames, borders, decorative elements, or empty space outside the frame. The frame is the complete image boundary.`,
      "white-oak": `FRAME WITH MATTING - CRITICAL INSTRUCTIONS FOR CONSISTENCY:
- FRAME FILLS ENTIRE CANVAS: The frame MUST extend to the very edges of the image. There should be NO extra space, padding, background, or margins outside the frame. The frame should touch all four edges of the image (top, bottom, left, right). The entire generated image should be the framed painting with zero space outside the frame.
- ONLY ONE OUTER FRAME: Create exactly ONE thin White Oak wood frame as the outermost border. Do NOT add multiple frames, double frames, or additional borders.

- WHITE OAK FRAME - DETAILED SPECIFICATIONS FOR CONSISTENCY:
  * COLOR: Light, pale color ranging from off-white to very light beige (similar to #F5F5DC or #FAF0E6). The frame should be white or cream-colored, but NOT pure white (#FFFFFF) - it should have a subtle warm tone that indicates it's natural wood, not painted white. The color should be lighter than Natural Oak but still show wood character.
  * WOOD GRAIN: Subtle, gentle oak wood grain patterns. The grain should be visible but delicate - lighter in color than the base wood, creating a soft, refined texture. The grain should be less prominent than Natural Oak or Dark Oak, but still clearly identifiable as oak wood. The grain lines should be pale beige or light gray against the light background.
  * TEXTURE: Smooth, refined wood texture with minimal variation. The surface should be clean and bright with a subtle matte to satin finish. The texture should be more uniform than darker oak varieties, but still show the natural character of white oak wood.
  * THICKNESS: THIN and NARROW frame width (approximately 0.3-0.5 inches or 8-12mm visible width). The frame should be light and airy, not chunky or heavy.
  * APPEARANCE: Clean, bright, modern look with light, airy tones. The frame should have a fresh, contemporary appearance that complements watercolor paintings with its light, elegant aesthetic. It should feel bright and open, not heavy or dark.
  * MITERED CORNERS: The frame should have clean, precise mitered corners (45-degree angle joints) where the frame pieces meet, creating a professional, finished appearance.
  * CONSISTENCY: Every time "White Oak" is selected, the frame must have these exact characteristics: light off-white/cream color (not pure white), subtle oak grain patterns, thin profile, mitered corners, and smooth, refined wood texture.

- ${frameDimensions}
- WHITE MATTING: Inside the SINGLE outer frame, include a wide white mat board (matting) that surrounds the watercolor painting. The matting should be pure white (#FFFFFF or very close), approximately 1.5mm thick, with beveled (slanted) edges on the inner opening. The beveled edge should create a subtle shadow effect. The matting borders must follow the exact dimensions specified above. The matting is NOT a frame - it is a mat board inside the frame.
- FINAL STRUCTURE (from outside to inside): ONE thin White Oak wood frame (with exact specifications above) that fills the entire canvas edge-to-edge → White matting with beveled edges → Watercolor painting in the center.
- DO NOT add any additional frames, borders, decorative elements, or empty space outside the frame. The frame is the complete image boundary.`,
    };

    if (frameInstructions[frameType]) {
      systemPrompt += `\n\n${frameInstructions[frameType]}`;
    } else {
      systemPrompt += `\n\nNO FRAME: Do not include any frame around the painting. The image should be the painting itself without any border or frame.`;
    }

    // User prompt - OPTIONAL: Additional style preferences
    const userStylePreferences = userPrompt?.trim()
      ? `\n\nADDITIONAL USER STYLE PREFERENCES:\n${userPrompt}\n\nPlease incorporate these additional style preferences while maintaining the core painting transformation requirements above.`
      : "";

    const fullPrompt = systemPrompt + userStylePreferences;

    // Convert aspect ratios to actual frame ratios
    // 9:16 → 3:4 for portrait (9:12 ratio)
    // 16:9 → 4:3 for landscape (12:9 ratio)
    const actualAspectRatio =
      aspectRatio === "9:16"
        ? "3:4"
        : aspectRatio === "16:9"
        ? "4:3"
        : aspectRatio;

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
            aspectRatio: actualAspectRatio as
              | "1:1"
              | "16:9"
              | "9:16"
              | "2:3"
              | "3:2"
              | "3:4"
              | "4:3"
              | "4:5"
              | "5:4"
              | "21:9",
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
              aspectRatio: actualAspectRatio as
                | "1:1"
                | "16:9"
                | "9:16"
                | "2:3"
                | "3:2"
                | "3:4"
                | "4:3"
                | "4:5"
                | "5:4"
                | "21:9",
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
        const originalFilePath = join(
          paintingFolder,
          `original.${originalExt}`
        );
        await writeFile(originalFilePath, originalImageBuffer);

        // Save generated painting image
        const generatedImageBuffer = Buffer.from(generatedImageData, "base64");
        const generatedFilePath = join(
          paintingFolder,
          `generated.${generatedExt}`
        );
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
