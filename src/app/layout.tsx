import type { Metadata, Viewport } from "next";
import { Ma_Shan_Zheng, Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";

const notoSerif = Noto_Serif_SC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const maShan = Ma_Shan_Zheng({
  variable: "--font-ma-shan",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  process.env.CF_PAGES_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "西游人物匹配 · 性格小测",
    template: "%s · 西游人物匹配",
  },
  description:
    "24 道情境题，匹配《西游记》中最贴近你的角色气质；结果含积极特质与释义，娱乐向性格探索。",
  openGraph: {
    title: "西游人物匹配 · 性格小测",
    description:
      "24 道情境题，匹配西游宇宙 24 位经典形象：师徒、菩萨、妖王与天庭神祇等。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hans"
      className={`${notoSerif.variable} ${maShan.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
