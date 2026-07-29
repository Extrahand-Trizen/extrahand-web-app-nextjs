import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Static HTML/CSS/JS for MinIO / CDN hosting (upload the `out/` folder)
  // Only apply in production builds — dev mode uses the normal Next.js server
  // which supports middleware, API routes, etc.
  ...(isProd && {
    output: "export",
    // Relative asset URLs for MinIO subfolder (…/build-001/index.html → ./_next/…)
    assetPrefix: "./",
  }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Disable filesystem pack cache in dev to prevent
      // "RangeError: Array buffer allocation failed" crash on low-memory systems
      config.cache = {
        type: "memory",
      };
    }
    return config;
  },
};

export default nextConfig;
