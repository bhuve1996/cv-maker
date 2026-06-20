import type { AtsAuditInput, AtsIssue } from "@/types/ats-audit";

export function auditSectionStructure(input: AtsAuditInput): {
  score: number;
  issues: AtsIssue[];
} {
  const issues: AtsIssue[] = [];
  let score = 0;

  if (input.source === "builder") {
    if (input.hasExperience) score += 2;
    else {
      issues.push({
        id: "section-experience",
        category: "sectionStructure",
        severity: "major",
        title: "Work Experience section missing",
        why: "ATS expects a clearly labeled experience section.",
        fix: "Add a Work Experience section with employer, role, and dates.",
      });
    }

    if (input.hasEducation) score += 2;
    else {
      issues.push({
        id: "section-education",
        category: "sectionStructure",
        severity: "minor",
        title: "Education section missing",
        why: "Many ATS forms map education to required fields.",
        fix: "Add an Education section with degree and institution.",
      });
    }

    if (input.hasSkills) score += 2;
    else {
      issues.push({
        id: "section-skills",
        category: "sectionStructure",
        severity: "major",
        title: "Skills section missing",
        why: "ATS keyword extraction relies heavily on a dedicated skills section.",
        fix: "Add a Skills section with comma-separated tools and technologies.",
      });
    }

    if (input.hasSummary) score += 2;
    else {
      issues.push({
        id: "section-summary",
        category: "sectionStructure",
        severity: "minor",
        title: "Professional Summary missing",
        why: "A summary helps ATS identify role level and focus area.",
        fix: "Add a Professional Summary at the top of the resume.",
      });
    }

    score += 2;
    return { score: Math.min(10, score), issues };
  }

  const text = input.resumeText.toLowerCase();

  if (/work experience|professional experience|experience/i.test(text)) score += 2;
  else {
    issues.push({
      id: "section-experience",
      category: "sectionStructure",
      severity: "major",
      title: "Experience section not clearly labeled",
      why: "ATS may fail to identify employment history.",
      fix: 'Label the section "Work Experience" or "Professional Experience".',
    });
  }

  if (/education/i.test(text)) score += 2;
  else {
    issues.push({
      id: "section-education",
      category: "sectionStructure",
      severity: "minor",
      title: "Education section not found",
      why: "Education fields may remain empty in ATS profiles.",
      fix: 'Add a clearly labeled "Education" section.',
    });
  }

  if (/skills|technical skills|core competencies/i.test(text)) score += 2;
  else {
    issues.push({
      id: "section-skills",
      category: "sectionStructure",
      severity: "major",
      title: "Skills section not found",
      why: "Without a skills section, ATS skill matching is unreliable.",
      fix: 'Add a "Skills" section listing tools and technologies.',
    });
  }

  if (/summary|profile|objective/i.test(text)) score += 2;
  else {
    issues.push({
      id: "section-summary",
      category: "sectionStructure",
      severity: "minor",
      title: "Summary/Profile section not found",
      why: "ATS and recruiters use the summary for role context.",
      fix: 'Add a "Professional Summary" section near the top.',
    });
  }

  const labels = [
    /work experience|professional experience/i.test(text),
    /education/i.test(text),
    /skills/i.test(text),
  ].filter(Boolean).length;

  if (labels >= 3) score += 2;
  else {
    issues.push({
      id: "section-naming",
      category: "sectionStructure",
      severity: "minor",
      title: "Inconsistent section naming",
      why: "Non-standard labels reduce ATS field mapping accuracy.",
      fix: "Use standard labels: Professional Summary, Work Experience, Education, Skills, Certifications.",
    });
  }

  return { score: Math.min(10, score), issues };
}
