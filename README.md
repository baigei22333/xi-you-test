This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Fonts are loaded with [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) (Noto Serif SC + Ma Shan Zheng for display).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Cloudflare Pages（静态站点）

本项目使用 `next.config.ts` 中的 `output: "export"`，构建结果在 **`out/`**，按**静态网站**方式托管即可。

在 Cloudflare Dashboard 中：

1. 使用 **Workers & Pages → Pages → Create a project → Connect to Git**（静态 Pages，不要选用 Git 构建并默认执行 `wrangler deploy` 的 **Next.js Workers** 一条龙模板）。
2. **Build command：** `npm run build`
3. **Build output directory：** `out`
4. **Deploy command：** **留空**（删除 `npx wrangler deploy`）。Pages 会直接把 `out` 里的文件发布出去；若填写 `wrangler deploy`，会误走 OpenNext，报缺少 `.next/standalone/.../pages-manifest.json` 等错误。
5. （可选）环境变量 **`NEXT_PUBLIC_SITE_URL`** = 你的 `https://<项目>.pages.dev` 或自定义域名（不要末尾 `/`），用于生成正确的 `metadataBase` / 分享链接。

本地预览静态包：`npm run preview:static`

## Deploy on Vercel

You can also deploy to [Vercel](https://vercel.com/new). For this repo’s static export, configure the platform to serve the `out` directory if you are not using Vercel’s default Next.js server mode.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
