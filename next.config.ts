import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages via @cloudflare/next-on-pages
  // We don't use "output: standalone" because next-on-pages handles the build
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Required for @cloudflare/next-on-pages to detect this is a Pages project
  experimental: {
    // Add any experimental features needed
  },
  // Image optimization needs to be disabled on Pages, use plain img tags
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
