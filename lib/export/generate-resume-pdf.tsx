"use client";

import { pdf } from "@react-pdf/renderer";
import { ResumePdfDocument } from "@/components/export/resume-pdf-document";
import type { Resume } from "@/types/resume";
import { DEFAULT_RESUME_STYLE } from "@/types/resume-style";
import type { ResumeStyle } from "@/types/resume-style";

export async function generateResumePdfBlob(
  resume: Resume,
  style: ResumeStyle = DEFAULT_RESUME_STYLE,
): Promise<Blob> {
  return pdf(<ResumePdfDocument resume={resume} style={style} />).toBlob();
}
