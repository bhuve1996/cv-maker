"use client";

import { getResumeProgress } from "@/lib/resume/section-completion";
import { useResumeStore } from "@/hooks/use-resume-store";
import { cn } from "@/lib/utils";

export function ResumeProgress() {
  const resume = useResumeStore((state) => state.resume);
  const { completed, total } = getResumeProgress(resume);
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">Resume progress</span>
        <span className="text-muted-foreground">
          {completed} of {total} sections
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
