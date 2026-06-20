import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildResumeParsePrompt } from "@/lib/ai/resume-parse-prompt";
import { normalizeAiResumePayload } from "@/lib/ai/normalize-ai-resume";
import type { ParseResult, Resume } from "@/types/resume";

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

function countFilledFields(resume: Partial<Resume>): number {
  let count = 0;
  if (resume.personalInfo?.fullName) count += 1;
  if (resume.personalInfo?.email) count += 1;
  if (resume.personalInfo?.phone) count += 1;
  if (resume.professionalSummary?.text) count += 1;
  count += resume.experience?.length ?? 0;
  count += resume.education?.length ?? 0;
  count += resume.skills?.length ?? 0;
  return count;
}

export async function parseResumeWithGemini(rawText: string): Promise<ParseResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: DEFAULT_MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.1,
    },
  });

  const result = await model.generateContent(buildResumeParsePrompt(rawText));
  const responseText = result.response.text();

  if (!responseText.trim()) {
    throw new Error("Gemini returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error("Gemini returned invalid JSON.");
  }

  const resume = normalizeAiResumePayload(parsed);
  const filledFields = countFilledFields(resume);
  const confidence =
    filledFields >= 10 ? "high" : filledFields >= 5 ? "medium" : "low";

  return {
    resume,
    rawText,
    confidence,
    parser: "gemini",
  };
}
