import { readdir } from "fs/promises";
import { join } from "path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getPaintings() {
  try {
    const paintingsDir = join(process.cwd(), "public", "generated-paintings");
    const items = await readdir(paintingsDir, { withFileTypes: true });
    
    // Filter for directories only (each painting has its own folder)
    const paintingFolders = items
      .filter((item) => item.isDirectory())
      .map((item) => item.name)
      .sort()
      .reverse();

    return paintingFolders;
  } catch (error) {
    console.error("Error reading paintings directory:", error);
    return [];
  }
}

async function getPaintingFiles(folderName: string) {
  try {
    const folderPath = join(process.cwd(), "public", "generated-paintings", folderName);
    const files = await readdir(folderPath);
    
    const originalFile = files.find((file) => file.startsWith("original."));
    const generatedFile = files.find((file) => file.startsWith("generated."));
    
    return {
      original: originalFile ? `/generated-paintings/${folderName}/${originalFile}` : null,
      generated: generatedFile ? `/generated-paintings/${folderName}/${generatedFile}` : null,
    };
  } catch (error) {
    console.error("Error reading painting files:", error);
    return { original: null, generated: null };
  }
}

export default async function PaintingPage({
  params,
}: {
  params: { filename: string };
}) {
  const paintings = await getPaintings();
  const folderName = decodeURIComponent(params.filename);
  
  // Check if the painting folder exists
  if (!paintings.includes(folderName)) {
    notFound();
  }

  // Get current index and navigation
  const currentIndex = paintings.indexOf(folderName);
  const prevPainting = currentIndex < paintings.length - 1 ? paintings[currentIndex + 1] : null;
  const nextPainting = currentIndex > 0 ? paintings[currentIndex - 1] : null;

  const paintingFiles = await getPaintingFiles(folderName);
  const timestamp = folderName.match(/painting-(\d+)-/)?.[1];
  const date = timestamp
    ? new Date(parseInt(timestamp)).toLocaleString()
    : "Unknown date";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/generated-paintings"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Gallery
          </Link>
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painting Details</h1>
              <p className="text-gray-600 mt-1">{date}</p>
            </div>
            <div className="flex gap-2">
              {prevPainting && (
                <Link
                  href={`/generated-paintings/${encodeURIComponent(prevPainting)}`}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  ← Previous
                </Link>
              )}
              {nextPainting && (
                <Link
                  href={`/generated-paintings/${encodeURIComponent(nextPainting)}`}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Painting Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Original Image</h2>
            <div className="relative w-full" style={{ minHeight: "400px" }}>
              {paintingFiles.original ? (
                <Image
                  src={paintingFiles.original}
                  alt={`Original image ${folderName}`}
                  fill
                  className="object-contain rounded-lg"
                  sizes="50vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Original image not available
                </div>
              )}
            </div>
          </div>

          {/* Generated Painting */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Painting</h2>
            <div className="relative w-full" style={{ minHeight: "400px" }}>
              {paintingFiles.generated ? (
                <Image
                  src={paintingFiles.generated}
                  alt={`Generated painting ${folderName}`}
                  fill
                  className="object-contain rounded-lg"
                  sizes="50vw"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Generated painting not available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Painting Info */}
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Painting Information</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-700">Folder Name: </span>
              <span className="text-gray-600">{folderName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Generated: </span>
              <span className="text-gray-600">{date}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Gallery Position: </span>
              <span className="text-gray-600">
                {currentIndex + 1} of {paintings.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
