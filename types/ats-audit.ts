export type AtsIssueSeverity = "critical" | "major" | "minor";

export type AtsAuditSource = "builder" | "upload";

export type AtsRiskLevel = "low" | "medium" | "high";

export interface AtsIssue {
  id: string;
  category: keyof AtsCategoryScores;
  severity: AtsIssueSeverity;
  title: string;
  why: string;
  fix: string;
}

export interface AtsCategoryScores {
  fileFormat: number;
  fontCompatibility: number;
  layoutCompatibility: number;
  parsingCompatibility: number;
  visualSimplicity: number;
  sectionStructure: number;
  contactReadability: number;
  consistency: number;
}

export interface AtsAuditResult {
  overallScore: number;
  categoryScores: AtsCategoryScores;
  issues: AtsIssue[];
  estimatedParseSuccessPct: number;
  estimatedRecruiterReadabilityPct: number;
  riskLevel: AtsRiskLevel;
  rating: string;
  source: AtsAuditSource;
  parser?: "gemini" | "deterministic";
  warning?: string;
}

export interface PdfStructureAnalysis {
  fileSizeBytes: number;
  pageCount: number;
  extractedTextLength: number;
  textItemCount: number;
  fonts: string[];
  isLikelyScanned: boolean;
  hasMultiColumnSignal: boolean;
  hasDecorativeFonts: boolean;
  hasSymbolFonts: boolean;
  textToFileSizeRatio: number;
}

export interface BuilderAuditInput {
  source: "builder";
  resumeText: string;
  hasSummary: boolean;
  hasSkills: boolean;
  hasExperience: boolean;
  hasEducation: boolean;
  hasCertifications: boolean;
  hasProjects: boolean;
  contactFieldsPresent: {
    name: boolean;
    email: boolean;
    phone: boolean;
    linkedIn: boolean;
    location: boolean;
  };
  contactUsesLabels: boolean;
  sectionOrderMatchesPreferred: boolean;
  usesTextBasedExport: boolean;
}

export interface UploadAuditInput {
  source: "upload";
  resumeText: string;
  pdfAnalysis?: PdfStructureAnalysis;
  fileSizeBytes: number;
  fileType: "pdf" | "docx";
}

export type AtsAuditInput = BuilderAuditInput | UploadAuditInput;

export const ATS_CATEGORY_MAX: Record<keyof AtsCategoryScores, number> = {
  fileFormat: 10,
  fontCompatibility: 15,
  layoutCompatibility: 20,
  parsingCompatibility: 20,
  visualSimplicity: 10,
  sectionStructure: 10,
  contactReadability: 5,
  consistency: 10,
};

export function getAtsRating(score: number): string {
  if (score >= 95) return "Excellent";
  if (score >= 90) return "Very Good";
  if (score >= 80) return "Good";
  if (score >= 70) return "Needs Improvement";
  return "High ATS Risk";
}

export function getAtsRiskLevel(score: number): AtsRiskLevel {
  if (score >= 80) return "low";
  if (score >= 70) return "medium";
  return "high";
}
