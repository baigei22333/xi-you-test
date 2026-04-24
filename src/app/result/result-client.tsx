"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RotateCcw, Sparkles } from "lucide-react";
import { getCharacterById } from "@/lib/data";
import { characterIdSchema } from "@/lib/schema";

export function ResultClient() {
  const params = useSearchParams();
  const raw = params.get("c");
  const parsed = raw ? characterIdSchema.safeParse(raw) : null;
  const id = parsed?.success ? parsed.data : null;
  const character = id ? getCharacterById(id) : undefined;
  const [openTrait, setOpenTrait] = useState<string | null>(null);

  const toggleTrait = (word: string) => {
    setOpenTrait((w) => (w === word ? null : word));
  };

  const heroAlt = useMemo(
    () => (character ? `${character.name}主题插画` : ""),
    [character],
  );

  if (!character || !id) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="font-display text-2xl text-[color:var(--accent)] sm:text-3xl">
          未找到结果
        </h1>
        <p className="max-w-md text-[color:var(--muted)]">
          链接可能不完整或已过期。请重新完成测评以生成角色匹配结果。
        </p>
        <Link
          href="/quiz"
          className="rounded-full bg-[#f4d58d] px-6 py-3 text-sm font-semibold text-[#1a1206] transition hover:brightness-110"
        >
          开始测评
        </Link>
        <Link
          href="/"
          className="text-sm text-[color:var(--muted)] hover:text-[color:var(--accent)]"
        >
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="text-sm text-[color:var(--muted)] transition hover:text-[color:var(--accent)]"
        >
          ← 返回首页
        </Link>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/45 bg-[#f4d58d]/10 px-4 py-2 text-sm text-[color:var(--accent)] transition hover:bg-[#f4d58d]/18"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          再测一次
        </Link>
      </header>

      <article className="overflow-hidden rounded-3xl border border-[color:var(--card-border)] bg-[color:var(--card)] shadow-[0_28px_100px_rgba(0,0,0,0.45)] backdrop-blur-md">
        <div className="relative aspect-[4/5] w-full max-h-[min(70vh,520px)] bg-black/30 sm:aspect-[16/10] sm:max-h-[420px]">
          <Image
            src={character.heroImage}
            alt={heroAlt}
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 768px) 100vw, 42rem"
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0e1a] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <p className="mb-1 flex items-center gap-2 text-sm text-[color:var(--accent)]">
              <Sparkles className="h-4 w-4" aria-hidden />
              你的西游气质更接近
            </p>
            <h1 className="font-display text-4xl text-white drop-shadow sm:text-5xl">
              {character.name}
            </h1>
            <p className="mt-2 text-base text-white/85">{character.subtitle}</p>
          </div>
        </div>

        <div className="space-y-8 p-6 sm:p-10">
          <p className="text-lg leading-relaxed text-[color:var(--foreground)]">
            {character.summary}
          </p>

          <section aria-labelledby="traits-heading">
            <h2
              id="traits-heading"
              className="mb-4 font-display text-xl text-[color:var(--accent)]"
            >
              与你呼应的品质
            </h2>
            <ul className="flex flex-col gap-3">
              {character.traits.map((t) => {
                const expanded = openTrait === t.word;
                return (
                  <li key={t.word}>
                    <button
                      type="button"
                      onClick={() => toggleTrait(t.word)}
                      aria-expanded={expanded}
                      className="flex w-full flex-col rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-[color:var(--accent)]/35"
                    >
                      <span className="flex w-full items-center justify-between gap-3">
                        <span className="text-base font-semibold text-[color:var(--accent)]">
                          {t.word}
                        </span>
                        <span className="text-xs text-[color:var(--muted)]">
                          {expanded ? "收起" : "展开释义"}
                        </span>
                      </span>
                      {expanded ? (
                        <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
                          {t.explanation}
                        </p>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>

          <p className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3 text-center text-xs leading-relaxed text-[color:var(--muted)]">
            本测试仅供娱乐与自我探索，结果不代表任何专业心理测评。人物气质取材于大众文化印象，愿你在故事里照见自己的光。
          </p>
        </div>
      </article>
    </div>
  );
}
