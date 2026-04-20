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
        protocol: 'https',  
        hostname: 'd2jlzos2a8il9t.cloudfront.net',
        port: '', 
        pathname: '/media/**', 
      },
   
      {
        protocol: 'https',
        hostname: 'd2jlzos2a8il9t.cloudfront.net',
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