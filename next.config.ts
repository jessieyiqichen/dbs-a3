import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Both experimental flags are off on purpose: with them on, a client-side navigation away from Today left the old
  // page mounted under the new one (two <main> elements). Verified 2026-10-18 by toggling each and counting <main>.
  cacheComponents: false,
  partialPrefetching: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
