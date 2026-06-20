import type { AtsCategoryScores, AtsIssue } from "@/types/ats-audit";

export const ATS_STYLING_SYSTEM_PROMPT = `You are an ATS Resume Formatting Auditor.

Analyze the resume ONLY for formatting, structure, readability, parsing compatibility, fonts, spacing, layout, and ATS machine readability.

DO NOT evaluate:
- Job description matching
- Keywords
- Skills relevance
- Experience quality
- Content strength

Evaluate only:
1. File format compatibility
2. Font family and font size consistency
3. ATS-safe typography
4. Section hierarchy
5. Header formatting
6. Single-column vs multi-column layout
7. Tables, text boxes, icons, graphics, shapes
8. White-space balance
9. Alignment consistency
10. Bullet point consistency
11. Date formatting consistency
12. Contact information readability
13. Parsing compatibility
14. PDF extraction reliability
15. Visual complexity

Return ONLY valid JSON matching the schema below. No markdown, no commentary.`;

export const ATS_STYLING_JSON_SCHEMA = {
  overallScore: "number 0-100",
  categoryScores: {
    fileFormat: "number 0-10",
    fontCompatibility: "number 0-15",
    layoutCompatibility: "number 0-20",
    parsingCompatibility: "number 0-20",
    visualSimplicity: "number 0-10",
    sectionStructure: "number 0-10",
    contactReadability: "number 0-5",
    consistency: "number 0-10",
  },
  issues: [
    {
      id: "string unique id",
      category:
        "fileFormat | fontCompatibility | layoutCompatibility | parsingCompatibility | visualSimplicity | sectionStructure | contactReadability | consistency",
      severity: "critical | major | minor",
      title: "string",
      why: "why ATS may struggle",
      fix: "exact fix recommendation",
    },
  ],
  estimatedParseSuccessPct: "number 0-100",
  estimatedRecruiterReadabilityPct: "number 0-100",
  riskLevel: "low | medium | high",
};

export function buildAtsStylingPrompt(options: {
  resumeText: string;
  source: "builder" | "upload";
  deterministicSummary?: string;
  fileMeta?: string;
}): string {
  const trimmed = options.resumeText.trim().slice(0, 18000);

  return `${ATS_STYLING_SYSTEM_PROMPT}

JSON schema (shape only):
${JSON.stringify(ATS_STYLING_JSON_SCHEMA, null, 2)}

Audit source: ${options.source}
${options.fileMeta ? `\nFile metadata:\n${options.fileMeta}\n` : ""}
${options.deterministicSummary ? `\nDeterministic pre-check findings (use as hints, verify independently):\n${options.deterministicSummary}\n` : ""}

Resume text:
"""
${trimmed}
"""`;
}

export function formatDeterministicSummary(
  categoryScores: AtsCategoryScores,
  issues: AtsIssue[],
): string {
  const scoreLine = Object.entries(categoryScores)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  const issueLines = issues
    .slice(0, 8)
    .map((issue) => `- [${issue.severity}] ${issue.title}: ${issue.why}`)
    .join("\n");

  return `Scores: ${scoreLine}\nKnown issues:\n${issueLines || "None"}`;
}
