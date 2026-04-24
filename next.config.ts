import type { NextConfig } from "next";

/** 纯静态导出，适配 Cloudflare Pages 免费静态托管（输出目录 `out/`）。 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
