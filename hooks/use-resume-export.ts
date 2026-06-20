"use client";

import { useCallback, useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";
import { downloadResumePdf } from "@/lib/pdf-export";
import { toastExportError, toastExportSuccess } from "@/lib/toast-messages";

export function useResumeExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const fullName = useResumeStore(
    (state) => state.resume.personalInfo.fullName.trim() || "resume",
  );

  const downloadPdf = useCallback(async () => {
    const element = document.getElementById("resume-preview");

    if (!element) {
      const message = "Resume preview not ready. Try again in a moment.";
      setExportError(message);
      toastExportError(message);
      return;
    }

    setExportError(null);
    setIsExporting(true);

    const filename = `${fullName.replace(/\s+/g, "-").toLowerCase()}.pdf`;

    try {
      await downloadResumePdf(element, filename);
      toastExportSuccess(filename);
    } catch {
      const message = "PDF export failed. Try Print and save as PDF instead.";
      setExportError(message);
      toastExportError(message);
    } finally {
      setIsExporting(false);
    }
  }, [fullName]);

  const scrollToPreview = useCallback(() => {
    document
      .getElementById("resume-preview-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return { downloadPdf, scrollToPreview, isExporting, exportError };
}
