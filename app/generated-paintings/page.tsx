import { readdir } from "fs/promises";
import { join } from "path";
import Image from "next/image";
import Link from "next/link";

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

    // Sort by filename (which includes timestamp, so newest first)
    return imageFiles.sort().reverse();
  } catch (error) {
    console.error("Error reading paintings directory:", error);
    return [];
  }
}

export default async function GeneratedPaintingsPage() {
  const paintings = await getPaintings();

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Create Painting
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">
            Generated Paintings Gallery
          </h1>
          <p className="text-gray-600 mt-2">
            {paintings.length} {paintings.length === 1 ? "painting" : "paintings"} generated
          </p>
        </div>

        {paintings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No paintings generated yet. Create your first painting!
            </p>
            <Link
              href="/"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Painting
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paintings.map((filename) => {
              const imageUrl = `/generated-paintings/${filename}`;
              const timestamp = filename.match(/painting-(\d+)-/)?.[1];
              const date = timestamp
                ? new Date(parseInt(timestamp)).toLocaleString()
                : "Unknown date";

              return (
                <Link
                  key={filename}
                  href={`/generated-paintings/${encodeURIComponent(filename)}`}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow block"
                >
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={`Generated painting ${filename}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 truncate" title={filename}>
                      {filename}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{date}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

