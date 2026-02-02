import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

module.exports = {
  experimental: {
    allowedDevOrigins: ["localhost:3000", "192.168.36.1:3000"],
  },
}
export default nextConfig;
