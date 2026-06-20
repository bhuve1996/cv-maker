import { NextRequest, NextResponse } from "next/server";
import { auditResumeStylingWithGemini } from "@/lib/ai/audit-with-gemini";
import { isGeminiConfigured } from "@/lib/ai/parse-with-gemini";
import {
  mergeAtsAuditResults,
  runDeterministicAtsAudit,
} from "@/lib/ats-audit";
import type { AtsAuditInput, PdfStructureAnalysis } from "@/types/ats-audit";

export const runtime = "nodejs";

interface AtsAuditRequestBody {
  input: AtsAuditInput;
  pdfAnalysis?: PdfStructureAnalysis;
  fileMeta?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AtsAuditRequestBody;
    const input = body.input;

    if (!input?.resumeText?.trim()) {
      return NextResponse.json(
        { error: "Resume text is required for ATS audit." },
        { status: 400 },
      );
    }

    if (input.resumeText.length > 25000) {
      return NextResponse.json(
        { error: "Resume text is too long for ATS audit." },
        { status: 413 },
      );
    }

    if (input.source === "upload" && body.pdfAnalysis) {
      input.pdfAnalysis = body.pdfAnalysis;
    }

    const deterministic = runDeterministicAtsAudit(input);

    if (!isGeminiConfigured()) {
      return NextResponse.json({
        ...deterministic,
        warning:
          "GEMINI_API_KEY is not set. Showing deterministic ATS formatting score only.",
      });
    }

    try {
      const aiPartial = await auditResumeStylingWithGemini({
        resumeText: input.resumeText,
        source: input.source,
        deterministic,
        fileMeta: body.fileMeta,
      });

      const merged = mergeAtsAuditResults(deterministic, aiPartial);
      return NextResponse.json(merged);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gemini ATS audit failed.";
      return NextResponse.json({
        ...deterministic,
        warning: `AI audit failed (${message}). Showing deterministic score only.`,
      });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "ATS audit request failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
