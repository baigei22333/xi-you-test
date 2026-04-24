"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { QUESTIONS } from "@/lib/data";
import {
  clearQuiz,
  clearResultFallbackId,
  loadQuiz,
  saveQuiz,
  saveResultFallbackId,
  type PersistedQuiz,
} from "@/lib/quiz-storage";
import { flushQuizAnalytics } from "@/lib/quiz-analytics";
import {
  computeResult,
  computeScoreBreakdown,
  type Answers,
} from "@/lib/scoring";

function allAnswered(a: Answers) {
  return QUESTIONS.every((q) => Boolean(a[q.id]));
}

export function QuizClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [hydrated, setHydrated] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    const saved = loadQuiz();
    if (saved && allAnswered(saved.answers)) {
      const id = computeResult(saved.answers);
      flushSync(() => {
        setIsFinishing(true);
        setHydrated(true);
      });
      void (async () => {
        await flushQuizAnalytics({
          characterId: id,
          answers: saved.answers,
          scores: computeScoreBreakdown(saved.answers),
        });
        clearQuiz();
        saveResultFallbackId(id);
        requestAnimationFrame(() => {
          window.location.replace(
            `${window.location.origin}/result?c=${encodeURIComponent(id)}`,
          );
        });
      })();
      return;
    }
    startTransition(() => {
      if (saved) {
        setAnswers(saved.answers);
        const firstOpen = QUESTIONS.findIndex((q) => !saved.answers[q.id]);
        setStep(Math.min(firstOpen, QUESTIONS.length - 1));
      }
      setHydrated(true);
    });
  }, [router]);

  useEffect(() => {
    if (!hydrated) return;
    if (allAnswered(answers)) return;
    const payload: PersistedQuiz = { answers, step };
    saveQuiz(payload);
  }, [answers, hydrated, step]);

  const total = QUESTIONS.length;
  const question = QUESTIONS[step];
  const progress = ((step + 1) / total) * 100;

  const selected = question ? answers[question.id] : undefined;

  const goResult = useCallback((finalAnswers: Answers) => {
    const id = computeResult(finalAnswers);
    const path = `/result?c=${encodeURIComponent(id)}`;
    flushSync(() => setIsFinishing(true));
    void (async () => {
      await flushQuizAnalytics({
        characterId: id,
        answers: finalAnswers,
        scores: computeScoreBreakdown(finalAnswers),
      });
      clearQuiz();
      saveResultFallbackId(id);
      requestAnimationFrame(() => {
        if (typeof window !== "undefined") {
          window.location.assign(path);
        } else {
          router.push(path);
        }
      });
    })();
  }, [router]);

  const onPick = (optionId: string) => {
    if (!question) return;
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      goResult(nextAnswers);
    }
  };

  const onPrev = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const onRestart = () => {
    clearQuiz();
    clearResultFallbackId();
    setIsFinishing(false);
    setAnswers({});
    setStep(0);
  };

  const optionLetters = useMemo(() => ["A", "B", "C", "D"], []);

  if (isFinishing) {
    return (
      <div
        className="flex min-h-[50vh] flex-col items-center justify-center gap-5 px-4"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2
          className="h-12 w-12 animate-spin text-[color:var(--accent)]"
          aria-hidden
        />
        <div className="text-center">
          <p className="font-display text-lg text-[color:var(--accent)]">
            正在生成结果
          </p>
          <p className="mt-2 text-sm text-[color:var(--muted)]">
            请稍候，正在为你匹配西游角色…
          </p>
        </div>
      </div>
    );
  }

  if (!hydrated || !question) {
    return (
      <p className="text-center text-[color:var(--muted)]" role="status">
        加载中…
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="text-sm text-[color:var(--muted)] transition hover:text-[color:var(--accent)]"
        >
          ← 返回首页
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="text-sm text-[color:var(--muted)] underline-offset-4 transition hover:text-[color:var(--accent)] hover:underline"
        >
          重新开始
        </button>
      </header>

      <div
        className="rounded-2xl border border-[color:var(--card-border)] bg-[color:var(--card)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8"
        role="region"
        aria-labelledby="quiz-progress-label"
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <p
            id="quiz-progress-label"
            className="font-display text-lg text-[color:var(--accent)] sm:text-xl"
          >
            <Sparkles className="mr-2 inline-block h-5 w-5 align-text-bottom opacity-90" aria-hidden />
            第 {step + 1} / {total} 题
          </p>
          <span className="text-sm text-[color:var(--muted)]">
            {Math.round(progress)}%
          </span>
        </div>
        <div
          className="mb-8 h-2 overflow-hidden rounded-full bg-white/5"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step + 1}
          aria-valuetext={`第 ${step + 1} 题，共 ${total} 题`}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#c45c48] via-[#f4d58d] to-[#7fd9c8] transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h1 className="mb-8 text-xl font-semibold leading-relaxed text-[color:var(--foreground)] sm:text-2xl">
          {question.prompt}
        </h1>

        <ul className="flex flex-col gap-3" role="list">
          {question.options.map((opt, i) => {
            const letter = optionLetters[i] ?? String(i + 1);
            const isSelected = selected === opt.id;
            return (
              <li key={opt.id} role="listitem">
                <button
                  type="button"
                  onClick={() => onPick(opt.id)}
                  className={`flex w-full gap-4 rounded-xl border px-4 py-4 text-left transition sm:px-5 sm:py-4 ${
                    isSelected
                      ? "border-[color:var(--accent)] bg-[#f4d58d]/10 shadow-[0_0_0_1px_rgba(244,213,141,0.35)]"
                      : "border-white/10 bg-white/[0.03] hover:border-[color:var(--accent)]/40 hover:bg-white/[0.06]"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 font-semibold text-[color:var(--accent)]"
                    aria-hidden
                  >
                    {letter}
                  </span>
                  <span className="text-base leading-relaxed text-[color:var(--foreground)]">
                    {opt.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-[color:var(--foreground)] transition enabled:hover:border-[color:var(--accent)]/50 enabled:hover:text-[color:var(--accent)] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            上一题
          </button>
          <p className="text-sm text-[color:var(--muted)]">
            点选选项后自动进入下一题；最后一题将跳转结果。
          </p>
          <button
            type="button"
            onClick={() => {
              if (step < total - 1 && selected) {
                setStep((s) => s + 1);
              } else if (step === total - 1 && selected) {
                goResult(answers);
              }
            }}
            disabled={!selected || step >= total - 1}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/50 bg-[#f4d58d]/10 px-4 py-2 text-sm text-[color:var(--accent)] transition enabled:hover:bg-[#f4d58d]/20 disabled:cursor-not-allowed disabled:opacity-35"
          >
            下一题
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
