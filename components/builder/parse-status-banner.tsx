"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { ParseSourceBadge } from "@/components/builder/parse-source-badge";
import { useResumeStore } from "@/hooks/use-resume-store";
import { cn } from "@/lib/utils";

export function ParseStatusBanner() {
  const { rawText, parseParser, parseWarning } = useResumeStore();

  if (!rawText) return null;

  return (
    <div className="space-y-2">
      <div
        className="flex flex-wrap items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3 text-sm"
        role="status"
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-emerald-900 dark:text-emerald-100">
              Import complete
            </p>
            <ParseSourceBadge parser={parseParser} size="sm" />
          </div>
          <p className="mt-0.5 text-muted-foreground">
            {parseParser === "gemini"
              ? "Start with Personal Info and Experience — the preview on the right updates instantly."
              : "Review each section below — your preview updates as you edit."}
          </p>
        </div>
      </div>
      {parseWarning && (
        <div
          className={cn(
            "flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/8 px-4 py-3 text-sm",
          )}
          role="alert"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
          <p className="text-muted-foreground">{parseWarning}</p>
        </div>
      )}
    </div>
  );
}
