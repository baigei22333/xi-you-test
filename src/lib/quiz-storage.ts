import type { Answers } from "@/lib/scoring";
import { QUESTIONS } from "@/lib/data";

export const QUIZ_STORAGE_KEY = "xi-you-quiz-v1";

/** 当结果页 URL 丢失 `?c=`（如 CDN 重定向）时，用最后一次算出的角色 id 兜底。 */
export const RESULT_FALLBACK_KEY = "xi-you-result-v1";

export function saveResultFallbackId(id: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(RESULT_FALLBACK_KEY, id);
}

export function readResultFallbackId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(RESULT_FALLBACK_KEY);
}

export function clearResultFallbackId() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RESULT_FALLBACK_KEY);
}

export type PersistedQuiz = {
  answers: Answers;
  step: number;
};

export function loadQuiz(): PersistedQuiz | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PersistedQuiz;
    if (
      typeof data.step !== "number" ||
      typeof data.answers !== "object" ||
      data.step < 0 ||
      data.step > QUESTIONS.length
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function saveQuiz(data: PersistedQuiz) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
}

export function clearQuiz() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(QUIZ_STORAGE_KEY);
}
