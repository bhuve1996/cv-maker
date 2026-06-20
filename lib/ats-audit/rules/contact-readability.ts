import type { AtsAuditInput, AtsIssue } from "@/types/ats-audit";

export function auditContactReadability(input: AtsAuditInput): {
  score: number;
  issues: AtsIssue[];
} {
  const issues: AtsIssue[] = [];
  let score = 0;

  if (input.source === "builder") {
    const { contactFieldsPresent, contactUsesLabels } = input;
    if (contactFieldsPresent.name) score += 1;
    else {
      issues.push({
        id: "contact-name",
        category: "contactReadability",
        severity: "critical",
        title: "Name not present",
        why: "ATS requires a parseable candidate name in the header.",
        fix: "Add your full name at the top of the resume.",
      });
    }

    if (contactFieldsPresent.phone) score += 1;
    else {
      issues.push({
        id: "contact-phone",
        category: "contactReadability",
        severity: "major",
        title: "Phone number missing",
        why: "Recruiters and ATS contact fields expect a phone number.",
        fix: "Add a labeled phone number in the header.",
      });
    }

    if (contactFieldsPresent.email) score += 1;
    else {
      issues.push({
        id: "contact-email",
        category: "contactReadability",
        severity: "critical",
        title: "Email missing",
        why: "Email is the primary ATS contact identifier.",
        fix: "Add Email: your@email.com in the header.",
      });
    }

    if (contactFieldsPresent.linkedIn) score += 1;
    if (contactFieldsPresent.location) score += 1;

    if (!contactUsesLabels) {
      issues.push({
        id: "contact-labels",
        category: "contactReadability",
        severity: "minor",
        title: "Contact fields lack text labels",
        why: "Unlabeled contact strings can be misparsed as body text.",
        fix: "Use Email:, Phone:, LinkedIn:, Location: labels.",
      });
    }

    return { score: Math.min(5, score), issues };
  }

  const text = input.resumeText;

  if (/[A-Z][a-z]+ [A-Z][a-z]+/.test(text.slice(0, 200))) score += 1;
  if (/(\+?\d[\d\s().-]{7,}\d)/.test(text)) score += 1;
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text)) score += 1;
  else {
    issues.push({
      id: "contact-email",
      category: "contactReadability",
      severity: "critical",
      title: "Email not detected in extractable text",
      why: "If email is inside an icon or image, ATS cannot read it.",
      fix: "Place Email: address as plain selectable text in the header.",
    });
  }

  if (/linkedin\.com/i.test(text)) score += 1;
  if (/\b(location|city|address)\b/i.test(text) || /,\s*[A-Z]{2}\b/.test(text)) {
    score += 1;
  }

  if (input.pdfAnalysis?.isLikelyScanned) {
    score = Math.min(score, 1);
    issues.push({
      id: "contact-not-selectable",
      category: "contactReadability",
      severity: "critical",
      title: "Contact information may not be text-selectable",
      why: "Image-based PDFs prevent ATS from extracting name, email, and phone.",
      fix: "Use a text-based PDF with selectable contact details.",
    });
  }

  return { score: Math.min(5, score), issues };
}
