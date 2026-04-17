import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local Server (Localhost)
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      // AWS S3 (Production)
      {
        protocol: 'https',  // Change to https
        hostname: 'shopplus-media.s3.eu-north-1.amazonaws.com', // Added region based on your screenshot
        port: '', // Remove the IP address completely
        pathname: '/media/**', 
      },
      // Fallback for standard S3 URL (Optional, keep if unsure)
      {
        protocol: 'https',
        hostname: 'shopplus-media.s3.amazonaws.com',
        port: '',
        pathname: '/media/**',
      },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;