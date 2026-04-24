import type { CharacterId } from "@/lib/schema";
import type { Answers } from "@/lib/scoring";

export type QuizAnalyticsPayload = {
  v: 1;
  characterId: CharacterId;
  answers: Answers;
  scores: Record<CharacterId, number>;
  completedAt: string;
};

function analyticsEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_QUIZ_ANALYTICS === "1";
}

/** 静态导出（Cloudflare Pages）无 /api，需指向 Worker；本地 next dev 可用相对路径回退。 */
function ingestUrl(): string {
  const u = process.env.NEXT_PUBLIC_QUIZ_ANALYTICS_INGEST_URL?.trim();
  if (u) return u.replace(/\/$/, "");
  return "/api/analytics/quiz";
}

function isAbsoluteHttpUrl(url: string): boolean {
  return url.startsWith("https://") || url.startsWith("http://");
}

/**
 * Fire-and-forget: 答题完成时上报（选项、各角色总分、匹配角色）。
 * 需设置 NEXT_PUBLIC_ENABLE_QUIZ_ANALYTICS=1；服务端可配置转发到 CF Worker，见 /api/analytics/quiz。
 * 若站点已启用 Cloudflare Zaraz，会额外调用 zaraz.track("quiz_complete", …)。
 */
export function trackQuizComplete(
  data: Omit<QuizAnalyticsPayload, "v" | "completedAt">,
): void {
  if (typeof window === "undefined" || !analyticsEnabled()) return;

  const payload: QuizAnalyticsPayload = {
    v: 1,
    ...data,
    completedAt: new Date().toISOString(),
  };

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

  const body = JSON.stringify(payload);
  const url = ingestUrl();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = process.env.NEXT_PUBLIC_QUIZ_ANALYTICS_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;

  if (isAbsoluteHttpUrl(url)) {
    void fetch(url, { method: "POST", headers, body, keepalive: true, mode: "cors" }).catch(
      () => {},
    );
    return;
  }

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return;
    }
  } catch {
    /* fallback below */
  }

  void fetch(url, {
    method: "POST",
    headers,
    body,
    keepalive: true,
  }).catch(() => {});
}
