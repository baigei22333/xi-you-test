import type { ReactNode } from "react";
import { CloudBackdrop } from "@/components/CloudBackdrop";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <CloudBackdrop />
      <div className="relative mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        {children}
      </div>
    </>
  );
}
