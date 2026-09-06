import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Static export - matches the "serve ./build" deploy plan; no Node server needed at runtime
  distDir: "build", // Changes the build output directory to `build`
};

export default nextConfig;
