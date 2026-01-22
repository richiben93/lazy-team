import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
