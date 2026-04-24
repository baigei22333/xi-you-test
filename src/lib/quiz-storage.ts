import type { Answers } from "@/lib/scoring";
import { QUESTIONS } from "@/lib/data";

export const QUIZ_STORAGE_KEY = "xi-you-quiz-v1";

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
