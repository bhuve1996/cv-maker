import type { AtsIssue, UploadAuditInput } from "@/types/ats-audit";

const MAX_BYTES = 2 * 1024 * 1024;

export function auditFileFormat(input: UploadAuditInput): {
  score: number;
  issues: AtsIssue[];
} {
  const issues: AtsIssue[] = [];
  let score = 0;
  const pdf = input.pdfAnalysis;

  if (input.fileType === "pdf" && pdf) {
    if (!pdf.isLikelyScanned && pdf.extractedTextLength > 100) {
      score += 5;
    } else {
      issues.push({
        id: "file-scanned",
        category: "fileFormat",
        severity: "critical",
        title: "PDF appears image-based or scanned",
        why: "ATS systems cannot extract text from scanned or rasterized PDFs.",
        fix: "Export a text-based PDF with selectable text, or rebuild the resume in cv-maker and download the ATS-safe PDF.",
      });
    }

    if (pdf.pageCount > 0 && pdf.extractedTextLength > 50) {
      score += 3;
    } else {
      issues.push({
        id: "file-parse-fail",
        category: "fileFormat",
        severity: "major",
        title: "PDF may not open reliably across ATS systems",
        why: "Very little extractable text suggests parsing failures in some ATS parsers.",
        fix: "Re-save the PDF using a text-based export tool and verify text is selectable.",
      });
    }
  } else if (input.fileType === "docx") {
    score += 5;
    score += 3;
    if (input.resumeText.length < 100) {
      issues.push({
        id: "docx-empty",
        category: "fileFormat",
        severity: "major",
        title: "DOCX contains very little extractable text",
        why: "Some DOCX files use text boxes or embedded objects that ATS cannot read.",
        fix: "Use plain paragraphs and avoid text boxes; export as text-based PDF if issues persist.",
      });
    }
  }

  if (input.fileSizeBytes <= MAX_BYTES) {
    score += 2;
  } else {
    issues.push({
      id: "file-size",
      category: "fileFormat",
      severity: "minor",
      title: "File size exceeds 2MB",
      why: "Large files may fail upload limits or slow ATS processing.",
      fix: "Compress images, remove embedded graphics, and keep the file under 2MB.",
    });
  }

  return { score: Math.min(10, score), issues };
}
