import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Removed output: "export" as it's incompatible with API routes
  // output: "export",
  images: {
    unoptimized: true,
  },

  // Disable hydration warnings in development for browser extension compatibility
  webpack: (config, { dev }) => {
    if (dev) {
      // Set development mode to suppress React hydration warnings
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      };
    }
    return config;
  },
};

export default nextConfig;
