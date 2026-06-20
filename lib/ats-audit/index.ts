import { auditContactReadability } from "@/lib/ats-audit/rules/contact-readability";
import { auditConsistency } from "@/lib/ats-audit/rules/consistency";
import { auditFileFormat } from "@/lib/ats-audit/rules/file-format";
import { auditFontCompatibility } from "@/lib/ats-audit/rules/font-compatibility";
import { auditLayoutCompatibility } from "@/lib/ats-audit/rules/layout-compatibility";
import { auditParsingCompatibility } from "@/lib/ats-audit/rules/parsing-compatibility";
import { auditSectionStructure } from "@/lib/ats-audit/rules/section-structure";
import { auditVisualSimplicity } from "@/lib/ats-audit/rules/visual-simplicity";
import type {
  AtsAuditInput,
  AtsAuditResult,
  AtsCategoryScores,
  AtsIssue,
} from "@/types/ats-audit";
import { getAtsRating, getAtsRiskLevel } from "@/types/ats-audit";

function dedupeIssues(issues: AtsIssue[]): AtsIssue[] {
  const seen = new Set<string>();
  return issues.filter((issue) => {
    if (seen.has(issue.id)) return false;
    seen.add(issue.id);
    return true;
  });
}

export function runDeterministicAtsAudit(input: AtsAuditInput): AtsAuditResult {
  const fileFormat =
    input.source === "builder"
      ? {
          score: input.usesTextBasedExport ? 10 : 6,
          issues: input.usesTextBasedExport
            ? ([] as AtsIssue[])
            : ([
                {
                  id: "builder-export-image",
                  category: "fileFormat" as const,
                  severity: "critical" as const,
                  title: "PDF export is not text-based",
                  why: "Image-based PDFs cannot be parsed by ATS systems.",
                  fix: "Use the ATS-safe text-based PDF download.",
                },
              ] as AtsIssue[]),
        }
      : auditFileFormat(input);

  const results = {
    fileFormat,
    fontCompatibility: auditFontCompatibility(input),
    layoutCompatibility: auditLayoutCompatibility(input),
    parsingCompatibility: auditParsingCompatibility(input),
    visualSimplicity: auditVisualSimplicity(input),
    sectionStructure: auditSectionStructure(input),
    contactReadability: auditContactReadability(input),
    consistency: auditConsistency(input),
  };

  const categoryScores: AtsCategoryScores = {
    fileFormat: results.fileFormat.score,
    fontCompatibility: results.fontCompatibility.score,
    layoutCompatibility: results.layoutCompatibility.score,
    parsingCompatibility: results.parsingCompatibility.score,
    visualSimplicity: results.visualSimplicity.score,
    sectionStructure: results.sectionStructure.score,
    contactReadability: results.contactReadability.score,
    consistency: results.consistency.score,
  };

  const overallScore = Object.values(categoryScores).reduce(
    (sum, value) => sum + value,
    0,
  );

  const issues = dedupeIssues(
    Object.values(results).flatMap((result) => result.issues),
  );

  const criticalCount = issues.filter((issue) => issue.severity === "critical").length;
  const estimatedParseSuccessPct = Math.max(
    40,
    Math.min(99, overallScore - criticalCount * 8),
  );
  const estimatedRecruiterReadabilityPct = Math.max(
    50,
    Math.min(99, overallScore + 2 - criticalCount * 5),
  );

  return {
    overallScore,
    categoryScores,
    issues,
    estimatedParseSuccessPct,
    estimatedRecruiterReadabilityPct,
    riskLevel: getAtsRiskLevel(overallScore),
    rating: getAtsRating(overallScore),
    source: input.source,
    parser: "deterministic",
  };
}

export function mergeAtsAuditResults(
  deterministic: AtsAuditResult,
  ai: Partial<AtsAuditResult>,
): AtsAuditResult {
  if (!ai.categoryScores && !ai.issues?.length) {
    return deterministic;
  }

  const mergedScores = { ...deterministic.categoryScores };
  if (ai.categoryScores) {
    for (const key of Object.keys(mergedScores) as Array<
      keyof AtsCategoryScores
    >) {
      const aiScore = ai.categoryScores[key];
      if (typeof aiScore === "number") {
        const delta = aiScore - mergedScores[key];
        mergedScores[key] = Math.max(
          0,
          Math.min(
            key === "fileFormat"
              ? 10
              : key === "fontCompatibility"
                ? 15
                : key === "layoutCompatibility" || key === "parsingCompatibility"
                  ? 20
                  : key === "contactReadability"
                    ? 5
                    : 10,
            mergedScores[key] + Math.sign(delta) * Math.min(Math.abs(delta), 5),
          ),
        );
      }
    }
  }

  const overallScore = Object.values(mergedScores).reduce(
    (sum, value) => sum + value,
    0,
  );

  const issues = dedupeIssues([
    ...deterministic.issues,
    ...(ai.issues ?? []),
  ]);

  return {
    ...deterministic,
    ...ai,
    overallScore: ai.overallScore ?? overallScore,
    categoryScores: mergedScores,
    issues,
    estimatedParseSuccessPct:
      ai.estimatedParseSuccessPct ?? deterministic.estimatedParseSuccessPct,
    estimatedRecruiterReadabilityPct:
      ai.estimatedRecruiterReadabilityPct ??
      deterministic.estimatedRecruiterReadabilityPct,
    riskLevel: getAtsRiskLevel(ai.overallScore ?? overallScore),
    rating: getAtsRating(ai.overallScore ?? overallScore),
    parser: "gemini",
  };
}
