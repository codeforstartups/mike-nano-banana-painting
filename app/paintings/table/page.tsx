import { readdir, stat } from "fs/promises";
import { join } from "path";
import PaintingsTable from "../../components/PaintingsTable";

export const dynamic = "force-dynamic";

async function getPaintings() {
  try {
    const paintingsDir = join(process.cwd(), "public", "generated-paintings");
    const items = await readdir(paintingsDir, { withFileTypes: true });

    // Filter for directories only (each painting has its own folder)
    const paintingFolders = items.filter((item) => item.isDirectory());

    // Get painting data from each folder
    const paintingsWithStats = await Promise.all(
      paintingFolders.map(async (folder) => {
        const folderPath = join(paintingsDir, folder.name);
        const folderFiles = await readdir(folderPath);

        // Find original and generated images
        const originalFile = folderFiles.find((file) =>
          file.startsWith("original.")
        );
        const generatedFile = folderFiles.find((file) =>
          file.startsWith("generated.")
        );

        // Get folder creation date
        const stats = await stat(folderPath);
        const timestamp = folder.name.match(/painting-(\d+)-/)?.[1];
        const createdAt = timestamp
          ? new Date(parseInt(timestamp))
          : stats.birthtime;

        return {
          folderName: folder.name,
          createdAt, // Keep as Date for sorting
          originalImageUrl: originalFile
            ? `/generated-paintings/${folder.name}/${originalFile}`
            : null,
          generatedImageUrl: generatedFile
            ? `/generated-paintings/${folder.name}/${generatedFile}`
            : null,
        };
      })
    );

    // Sort by date first
    const sortedPaintings = paintingsWithStats.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );

    // Format dates after sorting
    return sortedPaintings.map((painting) => ({
      ...painting,
      createdAt: painting.createdAt.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }),
    }));
  } catch (error) {
    console.error("Error reading paintings:", error);
    return [];
  }
}

export default async function PaintingsTablePage() {
  const paintings = await getPaintings();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Painting Comparison Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Compare original photographs with their watercolor painting transformations
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{paintings.length}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {paintings.length === 1 ? "Painting" : "Paintings"}
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="px-6 py-6">
          <PaintingsTable paintings={paintings} />
        </div>
      </div>
    </div>
  );
}
