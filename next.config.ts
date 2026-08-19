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
  // trailingSlash: false ensures Next.js does NOT append "/" to canonical URLs
  // set in metadata alternates. With trailingSlash:true, Next.js 16 forcibly
  // appends "/" even to full absolute URLs (https://…), making it impossible
  // to generate no-slash canonicals for /jobs/, /services/, /task/ routes.
  // Canonical trailing-slash behaviour is now controlled per-route in code via
  // full absolute URLs in alternates.canonical.
  trailingSlash: false,
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
