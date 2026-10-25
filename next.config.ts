import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Without this, Next may pick up a stray lockfile in a parent folder as the project root.
  turbopack: { root: process.cwd() },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    // Admin forms can carry one announcement attachment of up to 5 MB.
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
