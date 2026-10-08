import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  compress: true,
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "mixpanel-browser",
      "@tanstack/react-query",
      "recharts",
    ],
  },
  // Standalone server output for Docker/CapRover hosting with ISR / on-demand generation support
  ...(isProd && {
    output: "standalone",
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
  async redirects() {
    return [
      {
        source: "/locations/:city(mahabubnagar|siddipet)/service/:service",
        destination: "/:service-in-:city",
        permanent: true,
      },
    ];
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
  webpack: (config, { dev, isServer, webpack }) => {
    if (!isServer) {
      const emptyPolyfill = path.join(
        process.cwd(),
        "scripts/empty-next-polyfill.js"
      );
      config.resolve.alias = {
        ...(config.resolve.alias as Record<string, string | false>),
        "next/dist/build/polyfills/polyfill-module": emptyPolyfill,
        "next/dist/build/polyfills/polyfill-module.js": emptyPolyfill,
        "next/dist/esm/build/polyfills/polyfill-module": emptyPolyfill,
        "next/dist/esm/build/polyfills/polyfill-module.js": emptyPolyfill,
      };
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /[\\/]next[\\/]dist[\\/](?:esm[\\/])?build[\\/]polyfills[\\/]polyfill-module/,
          emptyPolyfill
        )
      );
    }
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
