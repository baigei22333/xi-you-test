import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultClient } from "@/app/result/result-client";

export const metadata: Metadata = {
  title: "测评结果",
};

function ResultFallback() {
  return (
    <p className="text-center text-[color:var(--muted)]" role="status">
      加载结果…
    </p>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultFallback />}>
      <ResultClient />
    </Suspense>
  );
}
