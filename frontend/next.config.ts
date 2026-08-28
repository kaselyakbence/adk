import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Outputs a self-contained Node.js server build
  distDir: "build", // Changes the build output directory to `build`
};

export default nextConfig;
