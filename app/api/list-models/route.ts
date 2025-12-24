import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to fetch available models
    // Note: The SDK might not have a direct listModels method, so we'll test common models
    const modelsToTest = [
      "gemini-2.5-flash-image-exp",
      "gemini-2.5-flash-image",
      "gemini-2.0-flash-exp",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
    ];

    const availableModels: string[] = [];
    const unavailableModels: string[] = [];

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        // Try a simple test to see if model is accessible
        availableModels.push(modelName);
      } catch (e: any) {
        unavailableModels.push(`${modelName}: ${e?.message || "Not available"}`);
      }
    }

    return NextResponse.json({
      available: availableModels,
      unavailable: unavailableModels,
      note: "These are the models we tested. Image generation models may require special access.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to list models" },
      { status: 500 }
    );
  }
}

