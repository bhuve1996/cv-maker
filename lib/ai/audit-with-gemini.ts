import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  buildAtsStylingPrompt,
  formatDeterministicSummary,
} from "@/lib/ai/ats-styling-prompt";
import type { AtsAuditResult, AtsIssue } from "@/types/ats-audit";
import { getAtsRating, getAtsRiskLevel } from "@/types/ats-audit";

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-2.5-flash-lite";

interface AiAuditPayload {
  overallScore?: number;
  categoryScores?: Partial<AtsAuditResult["categoryScores"]>;
  issues?: AtsIssue[];
  estimatedParseSuccessPct?: number;
  estimatedRecruiterReadabilityPct?: number;
  riskLevel?: AtsAuditResult["riskLevel"];
}

export async function auditResumeStylingWithGemini(options: {
  resumeText: string;
  source: "builder" | "upload";
  deterministic: AtsAuditResult;
  fileMeta?: string;
}): Promise<Partial<AtsAuditResult>> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const modelsToTry = [...new Set([DEFAULT_MODEL, FALLBACK_MODEL].filter(Boolean))];
  let lastError: Error | null = null;

  for (const modelName of modelsToTry) {
    try {
      return await auditWithModel(apiKey, modelName, options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const retryable =
        /429|404|503|quota|not found|unavailable/i.test(lastError.message);
      if (!retryable || modelName === modelsToTry[modelsToTry.length - 1]) {
        throw lastError;
      }
    }
  }

  throw lastError ?? new Error("Gemini ATS audit failed.");
}

async function auditWithModel(
  apiKey: string,
  modelName: string,
  options: {
    resumeText: string;
    source: "builder" | "upload";
    deterministic: AtsAuditResult;
    fileMeta?: string;
  },
): Promise<Partial<AtsAuditResult>> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const prompt = buildAtsStylingPrompt({
    resumeText: options.resumeText,
    source: options.source,
    deterministicSummary: formatDeterministicSummary(
      options.deterministic.categoryScores,
      options.deterministic.issues,
    ),
    fileMeta: options.fileMeta,
  });

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  if (!responseText.trim()) {
    throw new Error(`Gemini (${modelName}) returned an empty ATS audit response.`);
  }

  let parsed: AiAuditPayload;
  try {
    parsed = JSON.parse(responseText) as AiAuditPayload;
  } catch {
    throw new Error(`Gemini (${modelName}) returned invalid JSON for ATS audit.`);
  }

  const overallScore =
    typeof parsed.overallScore === "number"
      ? Math.max(0, Math.min(100, parsed.overallScore))
      : undefined;

  const resolvedScore = overallScore ?? undefined;

  return {
    overallScore: resolvedScore,
    categoryScores: parsed.categoryScores as AtsAuditResult["categoryScores"],
    issues: Array.isArray(parsed.issues) ? parsed.issues : [],
    estimatedParseSuccessPct:
      typeof parsed.estimatedParseSuccessPct === "number"
        ? parsed.estimatedParseSuccessPct
        : undefined,
    estimatedRecruiterReadabilityPct:
      typeof parsed.estimatedRecruiterReadabilityPct === "number"
        ? parsed.estimatedRecruiterReadabilityPct
        : undefined,
    riskLevel:
      resolvedScore != null
        ? getAtsRiskLevel(resolvedScore)
        : parsed.riskLevel,
    rating:
      resolvedScore != null ? getAtsRating(resolvedScore) : undefined,
    parser: "gemini",
  };
}
