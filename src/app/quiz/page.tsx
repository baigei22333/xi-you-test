import type { Metadata } from "next";
import { QuizClient } from "@/app/quiz/quiz-client";

export const metadata: Metadata = {
  title: "开始测评",
};

export default function QuizPage() {
  return <QuizClient />;
}
