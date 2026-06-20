import { migrateResume } from "@/lib/resume/migrate-resume";
import type { ParseResult, Resume } from "@/types/resume";

const MAX_JSON_FILE_SIZE = 2 * 1024 * 1024;

export class ResumeJsonImportError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResumeJsonImportError";
  }
}

export function isJsonResumeFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".json") || file.type === "application/json";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasResumeShape(value: unknown): value is Partial<Resume> {
  if (!isRecord(value)) return false;
  return (
    "personalInfo" in value ||
    "experience" in value ||
    "professionalSummary" in value ||
    "skills" in value
  );
}

function extractResumePayload(parsed: unknown): Partial<Resume> {
  if (!isRecord(parsed)) {
    throw new ResumeJsonImportError(
      "JSON must be an object. See the import format guide for the expected structure.",
    );
  }

  if ("resume" in parsed && hasResumeShape(parsed.resume)) {
    return parsed.resume;
  }

  if (hasResumeShape(parsed)) {
    return parsed;
  }

  throw new ResumeJsonImportError(
    'JSON must include a "resume" object or resume fields such as personalInfo and experience.',
  );
}

export function parseResumeJsonText(text: string): ParseResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ResumeJsonImportError("File is not valid JSON.");
  }

  const resume = migrateResume(extractResumePayload(parsed));
  const rawText =
    isRecord(parsed) && typeof parsed.rawText === "string" ? parsed.rawText : "";
  const confidence =
    isRecord(parsed) &&
    (parsed.confidence === "low" ||
      parsed.confidence === "medium" ||
      parsed.confidence === "high")
      ? parsed.confidence
      : "high";

  return {
    resume,
    rawText,
    confidence,
    parser: "heuristic",
    warning: "Imported from JSON. Review all sections before exporting.",
  };
}

export async function parseResumeJsonFile(file: File): Promise<ParseResult> {
  if (!isJsonResumeFile(file)) {
    throw new ResumeJsonImportError("Please upload a .json file.");
  }

  if (file.size > MAX_JSON_FILE_SIZE) {
    throw new ResumeJsonImportError("JSON file must be smaller than 2 MB.");
  }

  const text = await file.text();
  if (!text.trim()) {
    throw new ResumeJsonImportError("JSON file is empty.");
  }

  return parseResumeJsonText(text);
}
