import { readdir, stat } from "fs/promises";
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
          createdAt,
          originalImageUrl: originalFile
            ? `/generated-paintings/${folder.name}/${originalFile}`
            : null,
          generatedImageUrl: generatedFile
            ? `/generated-paintings/${folder.name}/${generatedFile}`
            : null,
        };
      })
    );

    return paintingsWithStats.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  } catch (error) {
    console.error("Error reading paintings:", error);
    return [];
  }
}

export default async function PaintingsTablePage() {
  const paintings = await getPaintings();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Paintings Table
          </h1>
          <p className="text-gray-600">
            View and manage all generated paintings
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.N.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original Painting
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated Painting
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paintings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No paintings generated yet.
                    </td>
                  </tr>
                ) : (
                  paintings.map((painting, index) => (
                    <tr key={painting.folderName} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-24 h-24 relative bg-gray-100 rounded">
                          {painting.originalImageUrl ? (
                            <Image
                              src={painting.originalImageUrl}
                              alt="Original"
                              fill
                              className="object-cover rounded"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {painting.generatedImageUrl ? (
                          <Link
                            href={`/generated-paintings/${encodeURIComponent(
                              painting.folderName
                            )}/generated`}
                            className="w-24 h-24 relative bg-gray-100 rounded block hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src={painting.generatedImageUrl}
                              alt="Generated"
                              fill
                              className="object-cover rounded"
                            />
                          </Link>
                        ) : (
                          <div className="w-24 h-24 relative bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {painting.createdAt.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {painting.generatedImageUrl ? (
                          <a
                            href={painting.generatedImageUrl}
                            download={`generated-${painting.folderName}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Download
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
