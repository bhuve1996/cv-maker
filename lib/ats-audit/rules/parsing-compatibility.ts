import type { AtsAuditInput, AtsIssue } from "@/types/ats-audit";

const ICON_PATTERNS = /[\u{1F300}-\u{1FAFF}\u2600-\u27BF]/u;
const RATING_PATTERNS =
  /\b\d{1,3}\s*%|\b(expert|advanced|intermediate|beginner)\s*[●◉○◯⭐★]/i;

export function auditParsingCompatibility(input: AtsAuditInput): {
  score: number;
  issues: AtsIssue[];
} {
  const issues: AtsIssue[] = [];
  let score = 0;
  const text = input.resumeText;

  if (input.source === "builder") {
    return { score: 20, issues };
  }

  const tableLike = /\|.{3,}\|/.test(text);
  if (!tableLike) {
    score += 5;
  } else {
    issues.push({
      id: "parse-tables",
      category: "parsingCompatibility",
      severity: "critical",
      title: "Table-like structure detected",
      why: "Tables break reading order in most ATS parsers.",
      fix: "Replace tables with plain paragraphs, bullets, and labeled lines.",
    });
  }

  score += 5;
  score += 3;

  if (input.pdfAnalysis?.hasSymbolFonts) {
    issues.push({
      id: "parse-shapes",
      category: "parsingCompatibility",
      severity: "major",
      title: "Symbol or icon fonts detected",
      why: "Dingbats and icon fonts replace readable text with symbols ATS cannot interpret.",
      fix: "Replace icons with text labels (e.g., Email: user@example.com).",
    });
    score += 1;
  } else {
    score += 3;
  }

  if (ICON_PATTERNS.test(text)) {
    issues.push({
      id: "parse-icons",
      category: "parsingCompatibility",
      severity: "major",
      title: "Icons used instead of text",
      why: "Emoji and icon characters are often stripped or misread by ATS.",
      fix: "Use text labels: Email:, Phone:, LinkedIn: instead of icons.",
    });
    score += 2;
  } else {
    score += 4;
  }

  if (RATING_PATTERNS.test(text)) {
    issues.push({
      id: "parse-ratings",
      category: "parsingCompatibility",
      severity: "major",
      title: "Skill rating circles or bars detected",
      why: "Visual proficiency indicators are not parsed as skill keywords.",
      fix: "List skills as comma-separated text without ratings or progress bars.",
    });
  }

  return { score: Math.min(20, score), issues };
}
