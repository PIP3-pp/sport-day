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
    // Admin forms can carry one image of up to 2 MB.
    serverActions: { bodySizeLimit: "3mb" },
  },
};

export default nextConfig;
