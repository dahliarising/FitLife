import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/FitLife",
  images: { unoptimized: true },
};

export default nextConfig;
