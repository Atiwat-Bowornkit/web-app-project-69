import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Move it here (Root Level)
  allowedDevOrigins: ["my-app.gitpod.io", "localhost:3000"],
  
  experimental: {
    // Keep other experimental options here if you have them
  },
};

export default nextConfig;