import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "首页",
};

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-12 pb-8">
      <header className="text-center sm:pt-4">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--card-border)] bg-[color:var(--card)] px-4 py-1.5 text-xs text-[color:var(--muted)] backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent)]" aria-hidden />
          娱乐向 · 24 题情境小测
        </p>
        <h1 className="font-display text-4xl leading-tight text-[color:var(--accent)] sm:text-5xl md:text-6xl">
          西游人物匹配
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[color:var(--muted)]">
          取经路上，有人执善念、有人破困局、有人守后方。回答 24
          道题，从 24 位西游经典形象中匹配气质：师徒一行、观音普贤文殊、天庭与妖界角色等。
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            icon: Compass,
            title: "情境选择题",
            body: "每题四个选项，没有标准答案，按直觉选最贴近你的做法。",
          },
          {
            icon: BookOpen,
            title: "积极视角",
            body: "结果聚焦角色的正向气质，并附简短释义，方便自我对照。",
          },
          {
            icon: Sparkles,
            title: "国风视觉",
            body: "深色天幕、云纹与金色点缀，为西游意象做了一点点气氛。",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-5 backdrop-blur-md"
          >
            <item.icon
              className="mb-3 h-8 w-8 text-[color:var(--accent)]"
              aria-hidden
            />
            <h2 className="mb-2 font-semibold text-[color:var(--foreground)]">
              {item.title}
            </h2>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <Link
          href="/quiz"
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c45c48] via-[#f4d58d] to-[#7fd9c8] px-10 py-4 text-base font-semibold text-[#1a1206] shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition hover:brightness-110"
        >
          开始测评
          <ArrowRight
            className="h-5 w-5 transition group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
        <p className="max-w-md text-center text-xs text-[color:var(--muted)]">
          预计用时约 5–8 分钟。答题进度会暂存在本机浏览器会话中，关闭标签页后可能丢失。
        </p>
      </div>
    </div>
  );
}
