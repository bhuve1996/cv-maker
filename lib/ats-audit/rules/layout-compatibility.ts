import type { AtsAuditInput, AtsIssue } from "@/types/ats-audit";

const MULTI_COLUMN_PATTERNS = [
  /\b(sidebar|two.?column|multi.?column)\b/i,
];

export function auditLayoutCompatibility(input: AtsAuditInput): {
  score: number;
  issues: AtsIssue[];
} {
  const issues: AtsIssue[] = [];
  let score = 0;

  if (input.source === "builder") {
    if (input.sectionOrderMatchesPreferred) {
      score += 4;
    } else {
      score += 2;
      issues.push({
        id: "layout-section-order",
        category: "layoutCompatibility",
        severity: "minor",
        title: "Section order differs from ATS-preferred order",
        why: "ATS systems read top-to-bottom; non-standard order can misplace skills or summary.",
        fix: "Use order: Summary → Skills → Experience → Education → Certifications → Projects.",
      });
    }

    score += 8;
    score += 4;
    score += 4;
    return { score: Math.min(20, score), issues };
  }

  const text = input.resumeText;
  const pdf = input.pdfAnalysis;

  if (pdf?.hasMultiColumnSignal) {
    issues.push({
      id: "layout-multi-column",
      category: "layoutCompatibility",
      severity: "critical",
      title: "Multi-column layout detected",
      why: "ATS may read columns out of order, mixing skills with experience text.",
      fix: "Convert to a single-column layout with sections stacked vertically.",
    });
    score += 4;
  } else {
    score += 8;
  }

  const hasHierarchy =
    /professional summary|summary|work experience|experience|education|skills/i.test(
      text,
    );
  if (hasHierarchy) {
    score += 4;
  } else {
    issues.push({
      id: "layout-hierarchy",
      category: "layoutCompatibility",
      severity: "major",
      title: "Unclear section hierarchy",
      why: "Without clear headings, ATS cannot segment the resume into parseable blocks.",
      fix: "Add standard section headings: Professional Summary, Work Experience, Education, Skills.",
    });
  }

  score += 4;

  if (MULTI_COLUMN_PATTERNS.some((pattern) => pattern.test(text))) {
    score = Math.max(0, score - 2);
  }

  score += 4;

  return { score: Math.min(20, score), issues };
}
