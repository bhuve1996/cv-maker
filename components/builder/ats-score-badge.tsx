import { cn } from "@/lib/utils";
import type { AtsAuditResult } from "@/types/ats-audit";

interface AtsScoreBadgeProps {
  score: number;
  size?: "sm" | "md";
  className?: string;
}

function scoreTone(score: number): string {
  if (score >= 95) {
    return "bg-emerald-500/15 text-emerald-700 ring-emerald-500/20 dark:text-emerald-400";
  }
  if (score >= 80) return "bg-primary/10 text-primary ring-primary/20";
  if (score >= 70) {
    return "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-400";
  }
  return "bg-destructive/10 text-destructive ring-destructive/20";
}

export function AtsScoreBadge({
  score,
  size = "sm",
  className,
}: AtsScoreBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-semibold ring-1 ring-inset",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        scoreTone(score),
        className,
      )}
    >
      ATS {score}/100
    </span>
  );
}

export function AtsRiskBadge({
  result,
  className,
}: {
  result: AtsAuditResult;
  className?: string;
}) {
  const tone =
    result.riskLevel === "low"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : result.riskLevel === "medium"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : "bg-destructive/10 text-destructive";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize",
        tone,
        className,
      )}
    >
      {result.riskLevel} risk
    </span>
  );
}
