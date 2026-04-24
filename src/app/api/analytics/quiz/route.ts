import { NextResponse } from "next/server";
import { z } from "zod";
import { CHARACTER_IDS, QUESTIONS } from "@/lib/data";
import { characterIdSchema } from "@/lib/schema";

const questionIds = new Set(QUESTIONS.map((q) => q.id));

const answersSchema = z
  .record(z.string(), z.string())
  .refine(
    (a) =>
      Object.keys(a).length === QUESTIONS.length &&
      Object.keys(a).every((k) => questionIds.has(k)),
    { message: "answers must include every question id" },
  );

const scoresSchema = z
  .record(characterIdSchema, z.number())
  .refine(
    (scores) => CHARACTER_IDS.every((id) => typeof scores[id] === "number"),
    { message: "scores must include every character id" },
  );

const bodySchema = z.object({
  v: z.literal(1),
  characterId: characterIdSchema,
  answers: answersSchema,
  scores: scoresSchema,
  completedAt: z.string(),
});

/** 本地 next dev 可将埋点镜像到 Worker，便于联调（静态部署不会执行本路由）。 */
function forwardUrl(): string | undefined {
  const u = process.env.QUIZ_ANALYTICS_DEV_FORWARD_URL?.trim();
  return u || undefined;
}

function forwardSecret(): string | undefined {
  const s = process.env.QUIZ_ANALYTICS_DEV_FORWARD_SECRET?.trim();
  return s || undefined;
}

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const target = forwardUrl();

  if (target) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const secret = forwardSecret();
    if (secret) headers.Authorization = `Bearer ${secret}`;

    try {
      const r = await fetch(target, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        console.warn(
          "[quiz-analytics] ingest returned",
          r.status,
          await r.text().catch(() => ""),
        );
      }
    } catch (e) {
      console.warn("[quiz-analytics] ingest failed", e);
    }
  }

  return new NextResponse(null, { status: 204 });
}
