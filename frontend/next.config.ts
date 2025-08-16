import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  // Keep your existing settings
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // NEW: Proxy /api/* to your backend (no CORS needed)
  async rewrites() {
    // Optional: override with BACKEND_URL, else default to localhost:8080
    // If running in Docker, BACKEND_URL can be set to the Docker backend service (e.g., http://backend:8080)
    const target = process.env.BACKEND_URL ?? 'http://localhost:8080';
    return [
      {
        source: '/api/:path*',
        destination: `${target}/:path*`,
      },
    ];
  },
};

export default nextConfig;
