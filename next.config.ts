import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
