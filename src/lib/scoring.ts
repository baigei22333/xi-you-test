import type { CharacterId } from "@/lib/schema";
import { CHARACTER_IDS, QUESTIONS } from "@/lib/data";

export type Answers = Record<string, string>;

/** When scores tie, earlier id in this list wins. */
export const TIE_BREAK_ORDER: CharacterId[] = [...CHARACTER_IDS];

function emptyScores(): Record<CharacterId, number> {
  return Object.fromEntries(CHARACTER_IDS.map((id) => [id, 0])) as Record<
    CharacterId,
    number
  >;
}

export function winnerFromTotals(
  totals: Record<CharacterId, number>,
): CharacterId {
  let best: CharacterId = TIE_BREAK_ORDER[0];
  let bestScore = -1;

  for (const id of TIE_BREAK_ORDER) {
    const s = totals[id];
    if (s > bestScore) {
      bestScore = s;
      best = id;
    }
  }

  return best;
}

export function computeResult(answers: Answers): CharacterId {
  return winnerFromTotals(computeScoreBreakdown(answers));
}

export function computeScoreBreakdown(answers: Answers): Record<
  CharacterId,
  number
> {
  const totals = emptyScores();
  for (const q of QUESTIONS) {
    const optionId = answers[q.id];
    if (!optionId) continue;
    const option = q.options.find((o) => o.id === optionId);
    if (!option) continue;
    for (const id of CHARACTER_IDS) {
      totals[id] += option.scores[id] ?? 0;
    }
  }
  return totals;
}
