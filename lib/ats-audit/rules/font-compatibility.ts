import { RESUME_TEMPLATE_METADATA } from "@/lib/export/template-metadata";
import type { AtsAuditInput, AtsIssue } from "@/types/ats-audit";

const ATS_SAFE_FONTS = [
  "calibri",
  "arial",
  "helvetica",
  "verdana",
  "tahoma",
  "georgia",
  "cambria",
  "times",
  "segoe",
];

const DECORATIVE_FONTS = [
  "poppins",
  "montserrat",
  "futura",
  "bebas",
  "playfair",
  "script",
  "handwriting",
  "comic",
  "impact",
  "lobster",
];

export function auditFontCompatibility(input: AtsAuditInput): {
  score: number;
  issues: AtsIssue[];
} {
  const issues: AtsIssue[] = [];
  let score = 0;

  if (input.source === "builder") {
    score += 5;
    score += 3;
    score += 3;
    score += 2;
    score += 2;
    return { score: 15, issues };
  }

  const fonts = input.pdfAnalysis?.fonts ?? [];
  const lowerFonts = fonts.map((font) => font.toLowerCase());

  const hasSafeFont = lowerFonts.some((font) =>
    ATS_SAFE_FONTS.some((safe) => font.includes(safe)),
  );
  const hasDecorative = lowerFonts.some((font) =>
    DECORATIVE_FONTS.some((bad) => font.includes(bad)),
  );

  if (hasSafeFont || lowerFonts.length === 0) {
    score += 5;
  } else {
    issues.push({
      id: "font-unsafe",
      category: "fontCompatibility",
      severity: "major",
      title: "Non-standard fonts detected",
      why: "ATS parsers may substitute or drop text when fonts are unrecognized.",
      fix: `Switch to ATS-safe fonts: ${RESUME_TEMPLATE_METADATA.primaryFont}.`,
    });
  }

  if (lowerFonts.length <= 3) {
    score += 3;
  } else {
    issues.push({
      id: "font-inconsistent",
      category: "fontCompatibility",
      severity: "minor",
      title: "Many different fonts used",
      why: "Inconsistent font families can cause parsing order issues.",
      fix: "Use one font family for body text and one for headings at most.",
    });
  }

  score += 3;
  score += 2;

  if (hasDecorative || input.pdfAnalysis?.hasDecorativeFonts) {
    issues.push({
      id: "font-decorative",
      category: "fontCompatibility",
      severity: "major",
      title: "Decorative fonts detected",
      why: "Display and script fonts often fail ATS text extraction.",
      fix: "Replace decorative fonts with Calibri, Arial, Helvetica, or Georgia.",
    });
  } else {
    score += 2;
  }

  return { score: Math.min(15, score), issues };
}
