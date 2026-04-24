import type { CharacterId } from "@/lib/schema";
import type { Answers } from "@/lib/scoring";

export type QuizAnalyticsPayload = {
  v: 1;
  characterId: CharacterId;
  answers: Answers;
  scores: Record<CharacterId, number>;
  completedAt: string;
};

const FLUSH_TIMEOUT_MS = 5000;

function analyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_QUIZ_ANALYTICS === "1";
}

/** 静态导出（Cloudflare Pages）无 /api，需指向 Worker；本地 next dev 可用相对路径回退。 */
function ingestUrl(): string {
  const u =
    process.env.NEXT_PUBLIC_QUIZ_ANALYTICS_INGEST_URL?.trim() ||
    process.env.NEXT_PUBLIC_QUIZ_ANALYTICS_URL?.trim();
  if (u) return u.replace(/\/$/, "");
  return "/api/analytics/quiz";
}

function isAbsoluteHttpUrl(url: string): boolean {
  return url.startsWith("https://") || url.startsWith("http://");
}

function fireZaraz(payload: QuizAnalyticsPayload): void {
  try {
    const zaraz = (
      window as unknown as {
        zaraz?: {
          track: (
            name: string,
            props?: Record<string, string | number | boolean>,
          ) => void;
        };
      }
    ).zaraz;
    zaraz?.track("quiz_complete", {
      character_id: payload.characterId,
      answers_json: JSON.stringify(payload.answers),
      scores_json: JSON.stringify(payload.scores),
    });
  } catch {
    /* Zaraz 不可用时忽略 */
  }
}

/**
 * 等待上报结束（或超时）后再跳转，避免 `location.assign` 立刻取消未完成的 fetch。
 * 答题页完成时应使用此函数；需设置 NEXT_PUBLIC_ENABLE_QUIZ_ANALYTICS=1 与 Worker 地址。
 */
export async function flushQuizAnalytics(
  data: Omit<QuizAnalyticsPayload, "v" | "completedAt">,
): Promise<void> {
  if (typeof window === "undefined" || !analyticsEnabled()) return;

  const payload: QuizAnalyticsPayload = {
    v: 1,
    ...data,
    completedAt: new Date().toISOString(),
  };

  fireZaraz(payload);

  const body = JSON.stringify(payload);
  const url = ingestUrl();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = process.env.NEXT_PUBLIC_QUIZ_ANALYTICS_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  if (isAbsoluteHttpUrl(url)) {
    const ctrl = new AbortController();
    const t = window.setTimeout(() => ctrl.abort(), FLUSH_TIMEOUT_MS);
    try {
      await fetch(url, {
        method: "POST",
        headers,
        body,
        mode: "cors",
        signal: ctrl.signal,
        keepalive: true,
      });
    } catch {
      /* 网络/超时/离线：不阻塞去结果页 */
    } finally {
      window.clearTimeout(t);
    }
    return;
  }

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(url, blob)) return;
    }
  } catch {
    /* fallback below */
  }

  try {
    await fetch(url, {
      method: "POST",
      headers,
      body,
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}

/**
 * 兼容旧调用：不等待完成（不推荐在即将跳转前使用）。
 */
export function trackQuizComplete(
  data: Omit<QuizAnalyticsPayload, "v" | "completedAt">,
): void {
  void flushQuizAnalytics(data);
}
