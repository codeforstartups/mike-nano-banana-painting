import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  
  console.log("API Key check:", {
    exists: !!apiKey,
    length: apiKey?.length || 0,
    startsWith: apiKey?.substring(0, 10) || "N/A",
  });

  return NextResponse.json({
    configured: !!apiKey,
    message: apiKey 
      ? "API key is configured" 
      : "API key is NOT configured",
  });
}

