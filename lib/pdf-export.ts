"use client";

import type { Resume } from "@/types/resume";

export function printResume(): void {
  window.print();
}

export async function downloadResumePdfFromData(
  resume: Resume,
  filename = "resume.pdf",
): Promise<void> {
  const { generateResumePdfBlob } = await import("@/lib/export/generate-resume-pdf");
  const blob = await generateResumePdfBlob(resume);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
