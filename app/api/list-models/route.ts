import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Return list of models we use in the application
    return NextResponse.json({
      success: true,
      availableModels: [
        "gemini-3-pro-image-preview",
        "gemini-2.5-flash-image",
      ],
      note: "These are the image generation models used in this application.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to list models" },
      { status: 500 }
    );
  }
}
