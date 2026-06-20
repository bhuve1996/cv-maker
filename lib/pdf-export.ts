"use client";

import type { Resume } from "@/types/resume";
import { DEFAULT_RESUME_STYLE } from "@/types/resume-style";
import type { ResumeStyle } from "@/types/resume-style";

export function printResume(): void {
  window.print();
}

export async function downloadResumePdfFromData(
  resume: Resume,
  filename = "resume.pdf",
  style: ResumeStyle = DEFAULT_RESUME_STYLE,
): Promise<void> {
  const { generateResumePdfBlob } = await import("@/lib/export/generate-resume-pdf");
  const blob = await generateResumePdfBlob(resume, style);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
