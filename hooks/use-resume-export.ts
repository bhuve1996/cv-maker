"use client";

import { useCallback, useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { downloadResumePdfFromData } from "@/lib/pdf-export";
import { toastExportError, toastExportSuccess } from "@/lib/toast-messages";

export function useResumeExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const resume = useResumeStore((state) => state.resume);
  const style = useResumeStore((state) => state.style);
  const fullName = resume.personalInfo.fullName.trim() || "resume";

  const downloadPdf = useCallback(async () => {
    setExportError(null);
    setIsExporting(true);

    const filename = `${fullName.replace(/\s+/g, "-").toLowerCase()}.pdf`;

    try {
      await downloadResumePdfFromData(resume, filename, style);
      toastExportSuccess(filename);
    } catch {
      const message = "PDF export failed. Try Print and save as PDF instead.";
      setExportError(message);
      toastExportError(message);
    } finally {
      setIsExporting(false);
    }
  }, [fullName, resume, style]);

  const scrollToPreview = useCallback(() => {
    document
      .getElementById("resume-preview-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return { downloadPdf, scrollToPreview, isExporting, exportError };
}
