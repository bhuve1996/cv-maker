"use client";

import { extractTextFromDocx, isDocxFile } from "@/lib/docx-parser";
import { extractTextFromPdf, isPdfFile } from "@/lib/pdf-parser";
import { parseResumeText } from "@/lib/resume-parser";
import type { ParseResult } from "@/types/resume";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export class ResumeParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResumeParseError";
  }
}

export function validateResumeFile(file: File): void {
  if (!isPdfFile(file) && !isDocxFile(file)) {
    throw new ResumeParseError("Please upload a PDF or DOCX file.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ResumeParseError("File must be smaller than 10MB.");
  }
}

async function parseResumeViaApi(text: string): Promise<ParseResult | null> {
  try {
    const response = await fetch("/api/parse-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      throw new ResumeParseError(payload?.error ?? "Resume parsing failed.");
    }

    return (await response.json()) as ParseResult;
  } catch (error) {
    if (error instanceof ResumeParseError) {
      throw error;
    }
    return null;
  }
}

export async function parseResumeFile(file: File): Promise<ParseResult> {
  validateResumeFile(file);

  const text = isPdfFile(file)
    ? await extractTextFromPdf(file)
    : await extractTextFromDocx(file);

  if (!text.trim()) {
    throw new ResumeParseError(
      "Could not extract text from this file. Try another resume or fill in the form manually.",
    );
  }

  const apiResult = await parseResumeViaApi(text);
  if (apiResult) {
    return apiResult;
  }

  return {
    ...parseResumeText(text),
    parser: "heuristic",
    warning: "Could not reach the parsing service. Used basic local parsing instead.",
  };
}

export async function extractResumeText(file: File): Promise<string> {
  validateResumeFile(file);

  return isPdfFile(file)
    ? await extractTextFromPdf(file)
    : await extractTextFromDocx(file);
}
