import { stripHtml } from "@/lib/export/text-utils";
import { OPTIONAL_FIELD_LABELS } from "@/lib/resume/optional-fields";
import {
  formatYearsOfExperienceLine,
  getTopLevelCertificationNames,
  getVisibleJobCertifications,
  getVisibleSummaryAchievements,
} from "@/lib/export/resume-display";
import {
  groupSkillsByCategory,
  SKILL_CATEGORY_LABELS,
} from "@/lib/resume/skill-categories";
import type { OptionalFields, Resume, SkillCategory } from "@/types/resume";
import { formatLocation } from "@/types/resume";

export { stripHtml } from "@/lib/export/text-utils";

export function formatContactValue(value: string): string {
  return value.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
}

export interface LabeledContactItem {
  label: string;
  value: string;
}

const PRIMARY_CONTACT_LABELS = new Set(["Email", "Phone", "Location"]);

export function getContactLineGroups(resume: Resume): {
  primary: LabeledContactItem[];
  secondary: LabeledContactItem[];
} {
  const items = getLabeledContactItems(resume);
  return {
    primary: items.filter((item) => PRIMARY_CONTACT_LABELS.has(item.label)),
    secondary: items.filter((item) => !PRIMARY_CONTACT_LABELS.has(item.label)),
  };
}

export function getLabeledContactItems(resume: Resume): LabeledContactItem[] {
  const { personalInfo } = resume;
  const locationText = formatLocation(personalInfo.location);
  const items: LabeledContactItem[] = [];

  if (personalInfo.email.trim()) {
    items.push({ label: "Email", value: personalInfo.email.trim() });
  }
  if (personalInfo.phone.trim()) {
    items.push({ label: "Phone", value: personalInfo.phone.trim() });
  }
  if (locationText) {
    items.push({ label: "Location", value: locationText });
  }
  if (personalInfo.linkedIn.trim()) {
    items.push({
      label: "LinkedIn",
      value: formatContactValue(personalInfo.linkedIn.trim()),
    });
  }
  if (personalInfo.github.trim()) {
    items.push({
      label: "GitHub",
      value: formatContactValue(personalInfo.github.trim()),
    });
  }
  if (personalInfo.website.trim()) {
    items.push({
      label: "Website",
      value: formatContactValue(personalInfo.website.trim()),
    });
  }

  return items;
}

export function formatContactLine(resume: Resume): string {
  return getLabeledContactItems(resume)
    .map(({ label, value }) => `${label}: ${value}`)
    .join(" · ");
}

export function getFilledOptionalFields(
  optionalFields: OptionalFields,
): Array<[keyof OptionalFields, string]> {
  return (
    Object.entries(optionalFields) as Array<[keyof OptionalFields, string]>
  ).filter(([, value]) => value.trim());
}

export function resumeToPlainText(resume: Resume): string {
  const lines: string[] = [];
  const { personalInfo, professionalSummary } = resume;

  if (personalInfo.fullName) lines.push(personalInfo.fullName);
  if (personalInfo.currentTitle) lines.push(personalInfo.currentTitle);
  if (personalInfo.specialization.length > 0) {
    lines.push(personalInfo.specialization.join(" · "));
  }

  const contactLine = formatContactLine(resume);
  if (contactLine) lines.push(contactLine);
  lines.push("");

  if (professionalSummary.text) {
    lines.push("PROFESSIONAL SUMMARY");
    const experienceLine = formatYearsOfExperienceLine(
      professionalSummary.yearsOfExperience,
      professionalSummary.designation,
    );
    if (experienceLine) {
      lines.push(experienceLine);
    }
    lines.push(stripHtml(professionalSummary.text));
    getVisibleSummaryAchievements(professionalSummary).forEach((item) => {
      lines.push(
        `- ${item.description}${item.impact ? ` — ${item.impact}` : ""}`,
      );
    });
    if (professionalSummary.coreExpertise.length > 0) {
      lines.push(professionalSummary.coreExpertise.join(", "));
    }
    lines.push("");
  }

  const topLevelCertNames = getTopLevelCertificationNames(resume);

  if (resume.experience.length > 0) {
    lines.push("WORK EXPERIENCE");
    resume.experience.forEach((item) => {
      lines.push(`${item.role} — ${item.company}`);
      if (item.location) lines.push(item.location);
      if (item.startDate || item.endDate) {
        lines.push(
          [item.startDate, item.endDate].filter(Boolean).join(" — "),
        );
      }
      item.projects.forEach((project) => {
        lines.push(
          `${project.client}${project.industry ? ` (${project.industry})` : ""}`,
        );
        project.responsibilities.forEach((task) => lines.push(`- ${task}`));
      });
      getVisibleJobCertifications(item.certifications, topLevelCertNames).forEach(
        (cert) => {
          lines.push(
            `- ${cert.name}${cert.status ? ` — ${cert.status}` : ""}`,
          );
        },
      );
      if (item.description && item.projects.length === 0) {
        lines.push(stripHtml(item.description));
      }
    });
    lines.push("");
  }

  const skillGroups = groupSkillsByCategory(resume.skills);
  if (Object.keys(skillGroups).length > 0) {
    lines.push("SKILLS");
    Object.entries(skillGroups).forEach(([category, items]) => {
      const label = SKILL_CATEGORY_LABELS[category as SkillCategory];
      lines.push(
        `${label}: ${items?.map((skill) => skill.name).join(", ") ?? ""}`,
      );
    });
    lines.push("");
  }

  if (resume.education.length > 0) {
    lines.push("EDUCATION");
    resume.education.forEach((item) => {
      lines.push(`${item.degree} — ${item.institution}`);
    });
    lines.push("");
  }

  if (resume.certifications.length > 0) {
    lines.push("CERTIFICATIONS");
    resume.certifications.forEach((item) => {
      lines.push(`${item.name}${item.issuer ? ` — ${item.issuer}` : ""}`);
    });
    lines.push("");
  }

  if (resume.projects.length > 0) {
    lines.push("PROJECTS");
    resume.projects.forEach((item) => {
      lines.push(`${item.name}: ${stripHtml(item.description)}`);
      if (item.technologies) lines.push(item.technologies);
    });
    lines.push("");
  }

  if (resume.spokenLanguages.length > 0) {
    lines.push("LANGUAGES");
    lines.push(
      resume.spokenLanguages
        .map((item) =>
          item.proficiency
            ? `${item.language} (${item.proficiency})`
            : item.language,
        )
        .join(" · "),
    );
    lines.push("");
  }

  if (resume.keyAchievements.length > 0) {
    lines.push("KEY ACHIEVEMENTS");
    resume.keyAchievements.forEach((item) => {
      lines.push(`${item.title}${item.description ? ` — ${item.description}` : ""}`);
    });
    lines.push("");
  }

  if (resume.interests.length > 0) {
    lines.push("INTERESTS");
    lines.push(resume.interests.join(", "));
    lines.push("");
  }

  const optional = getFilledOptionalFields(resume.optionalFields);
  if (optional.length > 0) {
    lines.push("ADDITIONAL INFORMATION");
    optional.forEach(([key, value]) => {
      lines.push(`${OPTIONAL_FIELD_LABELS[key]}: ${value}`);
    });
  }

  return lines.join("\n").trim();
}
