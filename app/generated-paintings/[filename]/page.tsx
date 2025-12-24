import { readdir } from "fs/promises";
import { join } from "path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getPaintings() {
  try {
    const paintingsDir = join(process.cwd(), "public", "generated-paintings");
    const files = await readdir(paintingsDir);
    
    // Filter for image files
    const imageFiles = files.filter(
      (file) =>
        file.endsWith(".jpg") ||
        file.endsWith(".jpeg") ||
        file.endsWith(".png") ||
        file.endsWith(".webp") ||
        file.endsWith(".gif")
    );

    return imageFiles.sort().reverse();
  } catch (error) {
    console.error("Error reading paintings directory:", error);
    return [];
  }
}

export default async function PaintingPage({
  params,
}: {
  params: { filename: string };
}) {
  const paintings = await getPaintings();
  const filename = decodeURIComponent(params.filename);
  
  // Check if the painting exists
  if (!paintings.includes(filename)) {
    notFound();
  }

  // Get current index and navigation
  const currentIndex = paintings.indexOf(filename);
  const prevPainting = currentIndex < paintings.length - 1 ? paintings[currentIndex + 1] : null;
  const nextPainting = currentIndex > 0 ? paintings[currentIndex - 1] : null;

  const imageUrl = `/generated-paintings/${filename}`;
  const timestamp = filename.match(/painting-(\d+)-/)?.[1];
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
        <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
          <div className="relative w-full" style={{ minHeight: "600px" }}>
            <Image
              src={imageUrl}
              alt={`Generated painting ${filename}`}
              fill
              className="object-contain rounded-lg"
              sizes="100vw"
              priority
            />
          </div>
        </div>

        {/* Painting Info */}
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Painting Information</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-700">Filename: </span>
              <span className="text-gray-600">{filename}</span>
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

