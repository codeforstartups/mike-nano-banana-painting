const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

// Get project root (handle running from app/api directory)
function getProjectRoot() {
  const cwd = process.cwd();
  // If we're in app/api, go up two levels
  if (cwd.endsWith("app\\api") || cwd.endsWith("app/api")) {
    return path.join(cwd, "..", "..");
  }
  return cwd;
}

// Load environment variables from .env.local or .env
function loadEnv() {
  const projectRoot = getProjectRoot();

  // Try .env.local first (Next.js convention)
  const envLocalPath = path.join(projectRoot, ".env.local");
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").replace(/^["']|["']$/g, "");
          process.env[key.trim()] = value.trim();
        }
      }
    });
    console.log("✅ Loaded environment from .env.local");
    return;
  }

  // Fallback to .env
  const envPath = path.join(projectRoot, ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) {
        const [key, ...valueParts] = trimmed.split("=");
        if (key && valueParts.length > 0) {
          const value = valueParts.join("=").replace(/^["']|["']$/g, "");
          process.env[key.trim()] = value.trim();
        }
      }
    });
    console.log("✅ Loaded environment from .env");
    return;
  }

  console.log("⚠️  No .env.local or .env file found");
}

// Load environment variables
loadEnv();

async function main() {
  // Get API key from environment
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.error("❌ GOOGLE_AI_API_KEY not found in environment variables");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  // Get project root for file paths
  const projectRoot = getProjectRoot();

  // Paths to images (relative to project root)
  const originalImagePath = path.join(
    projectRoot,
    "public",
    "generated-paintings",
    "painting-1766759676936-fblblbj",
    "original.jpg"
  );
  const frameImagePath = path.join(
    projectRoot,
    "public",
    "frames",
    "Natural-oak-frame.jpeg"
  );

  console.log("📂 Reading images...");
  console.log(`   Original: ${originalImagePath}`);
  console.log(`   Frame: ${frameImagePath}`);

  // Read and convert images to base64
  const originalImageData = fs.readFileSync(originalImagePath);
  const frameImageData = fs.readFileSync(frameImagePath);

  const originalBase64 = originalImageData.toString("base64");
  const frameBase64 = frameImageData.toString("base64");

  console.log(`✅ Original image: ${originalImageData.length} bytes`);
  console.log(`✅ Frame image: ${frameImageData.length} bytes`);

  // Build the prompt for image editing
  const prompt = [
    {
      text: `You are a master watercolor artist. Transform the first image (a house photograph) into a beautiful watercolor painting and place it inside the empty frame shown in the second image.

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

Generate the complete framed watercolor painting now.`,
    },
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: originalBase64,
      },
    },
    {
      inlineData: {
        mimeType: "image/jpeg", // Frames are .jpeg format
        data: frameBase64,
      },
    },
  ];

  console.log("\n🚀 Calling Gemini 3 Pro Image Preview...");
  console.log("   Model: gemini-3-pro-image-preview");
  console.log("   Input: Original photo + Frame template");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          imageSize: "2K", // High quality, no aspect ratio constraint to match frame
        },
      },
    });

    console.log("\n✅ Response received!");

    // Extract and save the generated image
    let imageSaved = false;
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log("\n📄 AI Description:");
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        // Save to public folder so it's accessible via web route
        const outputPath = path.join(
          getProjectRoot(),
          "public",
          "test-output.png"
        );
        fs.writeFileSync(outputPath, buffer);
        console.log(`\n✅ Generated image saved as: ${outputPath}`);
        console.log(`   Size: ${buffer.length} bytes`);
        console.log(
          `\n🌐 View the image at: http://localhost:3000/test-output`
        );
        imageSaved = true;
      }
    }

    if (!imageSaved) {
      console.error("❌ No image was generated in the response");
    }
  } catch (error) {
    console.error("❌ Error generating image:", error);
    if (error.message) {
      console.error("   Error message:", error.message);
    }
    process.exit(1);
  }
}

main().catch(console.error);
