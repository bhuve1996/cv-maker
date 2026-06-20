import { NextRequest, NextResponse } from "next/server";
import {
  isGeminiConfigured,
  parseResumeWithGemini,
} from "@/lib/ai/parse-with-gemini";
import { parseResumeText } from "@/lib/resume-parser";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  let text = "";

  try {
    const body = (await request.json()) as { text?: string };
    text = body.text?.trim() ?? "";

    if (!text) {
      return NextResponse.json({ error: "Resume text is required." }, { status: 400 });
    }

    if (text.length > 25000) {
      return NextResponse.json(
        { error: "Resume text is too long. Try a shorter document." },
        { status: 413 },
      );
    }

    if (!isGeminiConfigured()) {
      const fallback = parseResumeText(text);
      return NextResponse.json({
        ...fallback,
        parser: "heuristic",
        warning:
          "GEMINI_API_KEY is not set. Using basic local parsing — add your API key for better results.",
      });
    }

    const result = await parseResumeWithGemini(text);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse resume with Gemini.";

    if (text) {
      const fallback = parseResumeText(text);
      return NextResponse.json({
        ...fallback,
        parser: "heuristic",
        warning: `AI parsing failed (${message}). Used basic local parsing instead.`,
      });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
