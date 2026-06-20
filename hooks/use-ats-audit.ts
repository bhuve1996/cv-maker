"use client";

import { useCallback, useState } from "react";
import { buildBuilderAuditInput } from "@/lib/ats-audit/builder-input";
import {
  analyzePdfStructure,
  extractTextFromPdfFile,
} from "@/lib/pdf-parser/analyze-pdf";
import { extractTextFromDocx, isDocxFile } from "@/lib/docx-parser";
import { isPdfFile } from "@/lib/pdf-parser";
import type { AtsAuditResult, UploadAuditInput } from "@/types/ats-audit";
import type { Resume } from "@/types/resume";

async function postAtsAudit(body: unknown): Promise<AtsAuditResult> {
  const response = await fetch("/api/ats-audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as AtsAuditResult & { error?: string };

  if (!response.ok) {
    throw new Error(data.error ?? "ATS audit failed.");
  }

  return data;
}

export function useAtsAudit() {
  const [result, setResult] = useState<AtsAuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auditBuilderResume = useCallback(async (resume: Resume) => {
    setIsAuditing(true);
    setError(null);

    try {
      const input = buildBuilderAuditInput(resume);
      const auditResult = await postAtsAudit({ input });
      setResult(auditResult);
      return auditResult;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not run ATS formatting check.";
      setError(message);
      throw err;
    } finally {
      setIsAuditing(false);
    }
  }, []);

  const auditUploadedFile = useCallback(async (file: File) => {
    setIsAuditing(true);
    setError(null);

    try {
      let resumeText = "";
      let pdfAnalysis;
      let fileType: UploadAuditInput["fileType"] = "pdf";

      if (isPdfFile(file)) {
        [resumeText, pdfAnalysis] = await Promise.all([
          extractTextFromPdfFile(file),
          analyzePdfStructure(file),
        ]);
        fileType = "pdf";
      } else if (isDocxFile(file)) {
        resumeText = await extractTextFromDocx(file);
        fileType = "docx";
      } else {
        throw new Error("Only PDF and DOCX files are supported for ATS audit.");
      }

      const input: UploadAuditInput = {
        source: "upload",
        resumeText,
        fileSizeBytes: file.size,
        fileType,
        pdfAnalysis,
      };

      const fileMeta = pdfAnalysis
        ? [
            `File size: ${(file.size / 1024).toFixed(1)} KB`,
            `Pages: ${pdfAnalysis.pageCount}`,
            `Extracted text length: ${pdfAnalysis.extractedTextLength}`,
            `Fonts: ${pdfAnalysis.fonts.join(", ") || "unknown"}`,
            `Likely scanned: ${pdfAnalysis.isLikelyScanned}`,
            `Multi-column signal: ${pdfAnalysis.hasMultiColumnSignal}`,
          ].join("\n")
        : `File size: ${(file.size / 1024).toFixed(1)} KB\nType: DOCX`;

      const auditResult = await postAtsAudit({
        input,
        pdfAnalysis,
        fileMeta,
      });

      setResult(auditResult);
      return auditResult;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not audit uploaded file.";
      setError(message);
      throw err;
    } finally {
      setIsAuditing(false);
    }
  }, []);

  const clearAudit = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    isAuditing,
    error,
    auditBuilderResume,
    auditUploadedFile,
    clearAudit,
  };
}
