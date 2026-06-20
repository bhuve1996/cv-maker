"use client";

import { ShieldCheck } from "lucide-react";
import { AtsRiskBadge, AtsScoreBadge } from "@/components/builder/ats-score-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AtsAuditResult, AtsCategoryScores, AtsIssueSeverity } from "@/types/ats-audit";
import { ATS_CATEGORY_MAX } from "@/types/ats-audit";
import { cn } from "@/lib/utils";

interface AtsAuditPanelProps {
  result: AtsAuditResult;
  className?: string;
}

const CATEGORY_LABELS: Record<keyof AtsCategoryScores, string> = {
  fileFormat: "File Format",
  fontCompatibility: "Font Compatibility",
  layoutCompatibility: "Layout Structure",
  parsingCompatibility: "Parsing Compatibility",
  visualSimplicity: "Visual Simplicity",
  sectionStructure: "Section Structure",
  contactReadability: "Contact Readability",
  consistency: "Consistency",
};

function severityClass(severity: AtsIssueSeverity): string {
  switch (severity) {
    case "critical":
      return "border-destructive/30 bg-destructive/5";
    case "major":
      return "border-amber-500/30 bg-amber-500/5";
    default:
      return "border-border/60 bg-muted/30";
  }
}

export function AtsAuditPanel({ result, className }: AtsAuditPanelProps) {
  const sortedIssues = [...result.issues].sort((a, b) => {
    const order = { critical: 0, major: 1, minor: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <Card className={cn("border-border/60 bg-card/80 shadow-sm", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-4" />
            </span>
            ATS Formatting Review
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <AtsScoreBadge score={result.overallScore} size="md" />
            <AtsRiskBadge result={result} />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {result.rating} — formatting and parseability only (not keyword matching).
        </p>
        {result.warning && (
          <p className="text-sm text-amber-700" role="status">
            {result.warning}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-2">
          <Metric label="Est. ATS parse success" value={`${result.estimatedParseSuccessPct}%`} />
          <Metric
            label="Est. recruiter readability"
            value={`${result.estimatedRecruiterReadabilityPct}%`}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Category scores
          </p>
          <div className="grid gap-2">
            {(Object.keys(result.categoryScores) as Array<keyof AtsCategoryScores>).map(
              (key) => {
                const score = result.categoryScores[key];
                const max = ATS_CATEGORY_MAX[key];
                const pct = max > 0 ? Math.round((score / max) * 100) : 0;
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>{CATEGORY_LABELS[key]}</span>
                      <span className="font-medium text-foreground">
                        {score}/{max}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>

        {sortedIssues.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Issues & fixes ({sortedIssues.length})
            </p>
            {sortedIssues.map((issue) => (
              <div
                key={issue.id}
                className={cn(
                  "rounded-lg border p-3 text-sm",
                  severityClass(issue.severity),
                )}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{issue.title}</span>
                  <span className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {issue.severity}
                  </span>
                </div>
                <p className="mt-2 text-muted-foreground">
                  <span className="font-medium text-foreground">Why: </span>
                  {issue.why}
                </p>
                <p className="mt-1 text-muted-foreground">
                  <span className="font-medium text-foreground">Fix: </span>
                  {issue.fix}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-800">
            No formatting issues detected. Your resume layout looks ATS-friendly.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
