import type { AtsAuditInput, AtsIssue } from "@/types/ats-audit";

const DATE_FORMATS = [
  /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\b/i,
  /\b\d{1,2}\/\d{4}\b/,
  /\b\d{4}\s*[—–-]\s*(present|\d{4})/i,
  /\b\d{4}\b/,
];

export function auditConsistency(input: AtsAuditInput): {
  score: number;
  issues: AtsIssue[];
} {
  if (input.source === "builder") {
    return { score: 10, issues: [] };
  }

  const issues: AtsIssue[] = [];
  let score = 10;
  const text = input.resumeText;

  const dateMatches = text.match(/\b\d{4}\b/g) ?? [];
  const hasDates = dateMatches.length >= 2;
  const formatHits = DATE_FORMATS.filter((pattern) => pattern.test(text)).length;

  if (!hasDates) {
    score -= 2;
    issues.push({
      id: "consistency-dates",
      category: "consistency",
      severity: "minor",
      title: "Few or no dates detected",
      why: "ATS timeline fields require consistent date formatting.",
      fix: "Use a consistent format like Jan 2020 — Present throughout.",
    });
  } else if (formatHits > 2) {
    score -= 2;
    issues.push({
      id: "consistency-date-formats",
      category: "consistency",
      severity: "minor",
      title: "Mixed date formats detected",
      why: "Inconsistent dates can misorder experience chronologically.",
      fix: "Pick one date format and use it for all roles and education.",
    });
  }

  if (input.pdfAnalysis?.hasMultiColumnSignal) {
    score -= 2;
    issues.push({
      id: "consistency-overlap",
      category: "consistency",
      severity: "major",
      title: "Layout may cause overlapping or out-of-order content",
      why: "Multi-column layouts often produce jumbled text in ATS output.",
      fix: "Switch to single-column layout with uniform margins.",
    });
  }

  return { score: Math.max(0, score), issues };
}
