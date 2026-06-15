import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained server bundle (server.js + only required node_modules).
  // This reduces the Docker image size by ~95 % and eliminates the I/O burst that
  // causes CPU spikes at container startup when the full node_modules is present.
  output: "standalone",
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow images from external domains
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4002',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS hosts for production
      },
    ],
  },
};

export default nextConfig;
