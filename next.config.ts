import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["ui-avatars.com", "img.clerk.com"], // Add ui-avatars.com to allowed image domains
  },
};

export default nextConfig;