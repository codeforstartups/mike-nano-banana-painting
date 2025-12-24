import { readdir } from "fs/promises";
import { join } from "path";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getPaintings() {
  try {
    const paintingsDir = join(process.cwd(), "public", "generated-paintings");
    const items = await readdir(paintingsDir, { withFileTypes: true });
    
    // Filter for directories only (each painting has its own folder)
    const paintingFolders = items.filter((item) => item.isDirectory());

    // Get painting data with generated image URLs
    const paintingsWithImages = await Promise.all(
      paintingFolders.map(async (folder) => {
        const folderPath = join(paintingsDir, folder.name);
        const files = await readdir(folderPath);
        
        // Find generated image file
        const generatedFile = files.find((file) => file.startsWith("generated."));
        
        return {
          folderName: folder.name,
          generatedImageUrl: generatedFile
            ? `/generated-paintings/${folder.name}/${generatedFile}`
            : null,
        };
      })
    );

    return paintingsWithImages.sort((a, b) => 
      b.folderName.localeCompare(a.folderName)
    );
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
            {paintings.map((painting) => {
              const timestamp = painting.folderName.match(/painting-(\d+)-/)?.[1];
              const date = timestamp
                ? new Date(parseInt(timestamp)).toLocaleString()
                : "Unknown date";

              return (
                <Link
                  key={painting.folderName}
                  href={`/generated-paintings/${encodeURIComponent(painting.folderName)}`}
                  className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow block"
                >
                  <div className="aspect-square relative bg-gray-100">
                    {painting.generatedImageUrl ? (
                      <Image
                        src={painting.generatedImageUrl}
                        alt={`Generated painting ${painting.folderName}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 truncate" title={painting.folderName}>
                      {painting.folderName}
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

