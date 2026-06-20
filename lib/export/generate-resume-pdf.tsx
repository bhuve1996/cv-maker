"use client";

import { pdf } from "@react-pdf/renderer";
import { ResumePdfDocument } from "@/components/export/resume-pdf-document";
import type { Resume } from "@/types/resume";

export async function generateResumePdfBlob(resume: Resume): Promise<Blob> {
  return pdf(<ResumePdfDocument resume={resume} />).toBlob();
}
