import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    // BACKEND_URL is server-side only (never exposed to the browser).
    // In dev: http://localhost:3001  (default)
    // In Docker/prod: set BACKEND_URL=http://backend:3001 in the compose env.
    const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3001';
    return [
      {
        // /api/start  →  http://localhost:3001/start
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
