import type { NextConfig } from "next";

/**
 * 纯静态导出，产物在 `out/`，用于 Cloudflare Pages 静态托管。
 *
 * 部署到 Cloudflare 时请勿在控制台填写「部署命令」`npx wrangler deploy`：
 * 那会走 OpenNext/Workers，期望 `.next/standalone`，与 `output: "export"` 冲突。
 * Pages 正确设置：Build command = `npm run build`，Output directory = `out`，Deploy command = 留空；
 * Framework preset 选 None（不要选会自动注入 wrangler 的 Next.js Workers 模板）。
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
