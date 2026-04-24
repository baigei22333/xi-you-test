import { describe, expect, it } from "vitest";
import { QUESTIONS } from "@/lib/data";
import {
  computeResult,
  computeScoreBreakdown,
  TIE_BREAK_ORDER,
  winnerFromTotals,
  type Answers,
} from "@/lib/scoring";

function answersAllFirstOption(): Answers {
  return Object.fromEntries(QUESTIONS.map((q) => [q.id, q.options[0].id]));
}

function answersFavorCharacter(
  char: (typeof TIE_BREAK_ORDER)[number],
  weight = 3,
): Answers {
  const ans: Answers = {};
  for (const q of QUESTIONS) {
    let bestOpt = q.options[0];
    let best = -1;
    for (const o of q.options) {
      const s = o.scores[char] ?? 0;
      if (s > best) {
        best = s;
        bestOpt = o;
      }
    }
    if (best < weight) {
      bestOpt = q.options.reduce((a, b) =>
        (b.scores[char] ?? 0) > (a.scores[char] ?? 0) ? b : a,
      );
    }
    ans[q.id] = bestOpt.id;
  }
  return ans;
}

describe("computeResult", () => {
  it("returns a character id from tie-break order", () => {
    const r = computeResult({});
    expect(TIE_BREAK_ORDER).toContain(r);
  });

  it("returns wukong when every choice maximizes wukong score", () => {
    const a = answersFavorCharacter("wukong");
    expect(computeResult(a)).toBe("wukong");
  });

  it("returns guanyin when every choice maximizes guanyin score", () => {
    const a = answersFavorCharacter("guanyin");
    expect(computeResult(a)).toBe("guanyin");
  });

  it("tie-break prefers earlier id in TIE_BREAK_ORDER", () => {
    const totals = Object.fromEntries(
      TIE_BREAK_ORDER.map((id) => [id, 10]),
    ) as Record<(typeof TIE_BREAK_ORDER)[number], number>;
    expect(winnerFromTotals(totals)).toBe(TIE_BREAK_ORDER[0]);
  });
});

describe("computeScoreBreakdown", () => {
  it("sums all answered options", () => {
    const a = answersAllFirstOption();
    const b = computeScoreBreakdown(a);
    let manual = 0;
    for (const q of QUESTIONS) {
      const o = q.options[0];
      manual += o.scores.wukong ?? 0;
    }
    expect(b.wukong).toBe(manual);
  });
});
