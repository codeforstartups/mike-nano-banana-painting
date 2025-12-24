import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: false,
    // Allow local images from public folder and deployed domain
    domains: ['34.27.89.136', 'localhost'],
  },
  // Ensure static files from public folder are served correctly
  // Files in public/ are automatically served at the root path
};

export default nextConfig;
