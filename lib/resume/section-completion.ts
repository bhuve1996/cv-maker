import type { Resume, ResumeSection } from "@/types/resume";

export interface SectionStatus {
  complete: boolean;
  detail?: string;
}

function hasText(value: string | undefined) {
  return Boolean(value?.trim());
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export function getSectionStatus(
  section: ResumeSection,
  resume: Resume,
): SectionStatus {
  switch (section) {
    case "personalInfo": {
      const { fullName, email, phone } = resume.personalInfo;
      const complete = hasText(fullName) && (hasText(email) || hasText(phone));
      return { complete, detail: complete ? "Contact added" : undefined };
    }
    case "professionalSummary": {
      const complete = hasText(stripHtml(resume.professionalSummary.text));
      return { complete };
    }
    case "experience": {
      const count = resume.experience.length;
      const filled = resume.experience.filter(
        (item) => hasText(item.role) || hasText(item.company),
      ).length;
      return {
        complete: filled > 0,
        detail: count > 0 ? `${count} role${count === 1 ? "" : "s"}` : undefined,
      };
    }
    case "education": {
      const count = resume.education.length;
      const filled = resume.education.filter(
        (item) => hasText(item.degree) || hasText(item.institution),
      ).length;
      return {
        complete: filled > 0,
        detail: count > 0 ? `${count} entr${count === 1 ? "y" : "ies"}` : undefined,
      };
    }
    case "skills": {
      const count = resume.skills.filter((item) => hasText(item.name)).length;
      return {
        complete: count > 0,
        detail: count > 0 ? `${count} skill${count === 1 ? "" : "s"}` : undefined,
      };
    }
    case "spokenLanguages": {
      const count = resume.spokenLanguages.filter((item) =>
        hasText(item.language),
      ).length;
      return {
        complete: count > 0,
        detail: count > 0 ? `${count} language${count === 1 ? "" : "s"}` : undefined,
      };
    }
    case "keyAchievements": {
      const count = resume.keyAchievements.filter((item) =>
        hasText(item.title),
      ).length;
      return {
        complete: count > 0,
        detail: count > 0 ? `${count} item${count === 1 ? "" : "s"}` : undefined,
      };
    }
    case "interests": {
      const count = resume.interests.length;
      return {
        complete: count > 0,
        detail: count > 0 ? `${count} listed` : undefined,
      };
    }
    case "projects": {
      const count = resume.projects.filter((item) => hasText(item.name)).length;
      return {
        complete: count > 0,
        detail: count > 0 ? `${count} project${count === 1 ? "" : "s"}` : undefined,
      };
    }
    case "certifications": {
      const count = resume.certifications.filter((item) =>
        hasText(item.name),
      ).length;
      return {
        complete: count > 0,
        detail: count > 0 ? `${count} cert${count === 1 ? "" : "s"}` : undefined,
      };
    }
    case "optionalFields": {
      const filled = Object.values(resume.optionalFields).filter(hasText).length;
      return {
        complete: filled > 0,
        detail: filled > 0 ? `${filled} filled` : undefined,
      };
    }
    default:
      return { complete: false };
  }
}

export function getResumeProgress(resume: Resume) {
  const sections = (
    [
      "personalInfo",
      "professionalSummary",
      "experience",
      "education",
      "skills",
      "spokenLanguages",
      "keyAchievements",
      "interests",
      "projects",
      "certifications",
      "optionalFields",
    ] as ResumeSection[]
  ).map((id) => ({ id, ...getSectionStatus(id, resume) }));

  const completed = sections.filter((section) => section.complete).length;

  return { completed, total: sections.length, sections };
}
