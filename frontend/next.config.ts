import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Outputs a Single-Page Application (SPA)
  distDir: "build", // Changes the build output directory to `build`
};

export default nextConfig;
