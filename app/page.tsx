import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Welcome to your painting workspace</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/paintings/generate"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎨</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Generate Painting
            </h2>
            <p className="text-gray-600">
              Create beautiful watercolor paintings from your images
            </p>
          </Link>

          <Link
            href="/paintings/table"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Paintings Table
            </h2>
            <p className="text-gray-600">
              View all generated paintings in a table format
            </p>
          </Link>

          <Link
            href="/call-logs"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📞</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Call Logs
            </h2>
            <p className="text-gray-600">
              View and manage call logs from agents
            </p>
          </Link>

          <Link
            href="/state-data"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-yellow-300 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🗺️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              State Data
            </h2>
            <p className="text-gray-600">
              Browse property data by state
            </p>
          </Link>

          <Link
            href="/settings"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Settings
            </h2>
            <p className="text-gray-600">
              Configure prompts and user profile
            </p>
          </Link>

          <Link
            href="/generated-paintings"
            className="bg-white p-6 rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🖼️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Gallery
            </h2>
            <p className="text-gray-600">
              Browse all generated paintings
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
