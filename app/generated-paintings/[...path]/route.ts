import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathSegments = path || [];
    
    if (pathSegments.length === 0) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    // Reconstruct the file path
    // Path format: /generated-paintings/folder-name/filename.ext
    // So pathSegments will be: ["folder-name", "filename.ext"]
    const fullPath = pathSegments.join("/");
    
    // Build the full file path
    const filePath = join(
      process.cwd(),
      "public",
      "generated-paintings",
      fullPath
    );

    // Security check: ensure the path is within the generated-paintings directory
    const resolvedPath = join(process.cwd(), "public", "generated-paintings");
    const normalizedFilePath = filePath.replace(/\\/g, "/");
    const normalizedResolvedPath = resolvedPath.replace(/\\/g, "/");
    
    if (!normalizedFilePath.startsWith(normalizedResolvedPath)) {
      console.error(`Security check failed: ${normalizedFilePath} not in ${normalizedResolvedPath}`);
      return NextResponse.json({ error: "Invalid path" }, { status: 403 });
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return NextResponse.json(
        { error: "File not found", path: filePath },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Determine content type based on file extension
    const ext = pathSegments[pathSegments.length - 1].split(".").pop()?.toLowerCase();
    let contentType = "image/jpeg";
    
    if (ext === "png") contentType = "image/png";
    else if (ext === "gif") contentType = "image/gif";
    else if (ext === "webp") contentType = "image/webp";
    else if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";

    // Return the image with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { error: "Failed to serve image", message: error.message },
      { status: 500 }
    );
  }
}

