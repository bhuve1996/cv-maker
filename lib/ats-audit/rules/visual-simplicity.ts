import type { AtsAuditInput, AtsIssue } from "@/types/ats-audit";

export function auditVisualSimplicity(input: AtsAuditInput): {
  score: number;
  issues: AtsIssue[];
} {
  if (input.source === "builder") {
    return { score: 10, issues: [] };
  }

  const issues: AtsIssue[] = [];
  let score = 10;
  const text = input.resumeText;

  if (/\b(progress|rating|infographic|chart|graph)\b/i.test(text)) {
    score -= 3;
    issues.push({
      id: "visual-progress",
      category: "visualSimplicity",
      severity: "major",
      title: "Visual rating elements may be present",
      why: "Progress bars and rating circles add no parseable skill data.",
      fix: "Remove all visual skill indicators and use plain text skill lists.",
    });
  }

  if (input.pdfAnalysis?.hasSymbolFonts) {
    score -= 2;
  }

  return { score: Math.max(0, score), issues };
}
