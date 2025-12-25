import Link from "next/link";
import {
  Palette,
  Table2,
  Phone,
  MapPin,
  Settings,
  Image as ImageIcon,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      href: "/paintings/generate",
      icon: Palette,
      title: "Generate Painting",
      description: "Create beautiful watercolor paintings from your images",
      gradient: "from-blue-500/10 to-purple-500/10",
      iconColor: "text-blue-600",
      hoverBorder: "hover:border-blue-300",
    },
    {
      href: "/paintings/table",
      icon: Table2,
      title: "Painting Comparison",
      description: "View and compare all generated paintings",
      gradient: "from-green-500/10 to-emerald-500/10",
      iconColor: "text-green-600",
      hoverBorder: "hover:border-green-300",
    },
    {
      href: "/call-logs",
      icon: Phone,
      title: "Call Logs",
      description: "Manage and track agent call logs",
      gradient: "from-purple-500/10 to-pink-500/10",
      iconColor: "text-purple-600",
      hoverBorder: "hover:border-purple-300",
    },
    {
      href: "/state-data",
      icon: MapPin,
      title: "State Data",
      description: "Browse property data by state",
      gradient: "from-orange-500/10 to-amber-500/10",
      iconColor: "text-orange-600",
      hoverBorder: "hover:border-orange-300",
    },
    {
      href: "/settings",
      icon: Settings,
      title: "Settings",
      description: "Configure prompts and user profile",
      gradient: "from-gray-500/10 to-slate-500/10",
      iconColor: "text-gray-600",
      hoverBorder: "hover:border-gray-400",
    },
    {
      href: "/generated-paintings",
      icon: ImageIcon,
      title: "Gallery",
      description: "Browse all generated paintings",
      gradient: "from-pink-500/10 to-rose-500/10",
      iconColor: "text-pink-600",
      hoverBorder: "hover:border-pink-300",
    },
  ];

  return (
    <div className="bg-[#fafafa]">
      <div className="w-full">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200/80 px-4 sm:px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Dashboard
              </h1>
            </div>
            <p className="text-lg text-gray-600 ml-16">
              Welcome to your painting workspace
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-4 sm:px-6 py-8">
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Link
                    key={feature.href}
                    href={feature.href}
                    className="group relative bg-white rounded-lg border border-gray-200/80 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 overflow-hidden"
                  >
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`p-3 rounded-lg bg-gray-50 group-hover:bg-white transition-colors duration-200 ${feature.iconColor}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <TrendingUp className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-900 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Hover Effect Border */}
                    <div
                      className={`absolute inset-0 rounded-lg border-2 ${feature.hoverBorder} opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
