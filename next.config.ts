import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "cdn.sanity.io" },
      { hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
