import { formatYearsOfExperienceLine } from "@/lib/resume/format-years";
import { stripHtml } from "@/lib/export/text-utils";
import type {
  Experience,
  JobCertification,
  ProfessionalSummary,
  Resume,
  SummaryAchievement,
} from "@/types/resume";
import type { ExperienceLayout } from "@/types/resume-style";

export { formatYearsOfExperienceLine };

export function getVisibleSummaryAchievements(
  summary: ProfessionalSummary,
): SummaryAchievement[] {
  const text = stripHtml(summary.text).toLowerCase();
  if (!text) return summary.achievements;

  return summary.achievements.filter((achievement) => {
    const description = achievement.description.trim();
    if (description.length < 8) return true;

    const normalized = description.toLowerCase();
    const snippet = normalized.slice(0, Math.min(40, normalized.length));
    return !text.includes(snippet);
  });
}

export function getTopLevelCertificationNames(resume: Resume): Set<string> {
  return new Set(
    resume.certifications
      .map((cert) => cert.name.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function getVisibleJobCertifications(
  jobCerts: JobCertification[],
  topLevelNames: Set<string>,
): JobCertification[] {
  return jobCerts.filter((cert) => {
    const name = cert.name.trim().toLowerCase();
    return name.length > 0 && !topLevelNames.has(name);
  });
}

export interface ExperienceHeaderLines {
  primaryLine: string;
  secondaryLine: string | null;
  datesLine: string | null;
  useSideDates: boolean;
}

function formatExperienceDates(item: Experience): string | null {
  const dates = [item.startDate, item.endDate].filter(Boolean).join(" — ");
  return dates || null;
}

export function formatExperienceHeader(
  item: Experience,
  layout: ExperienceLayout,
): ExperienceHeaderLines {
  const dates = formatExperienceDates(item);

  if (layout === "recruiter") {
    const primaryParts = [item.company, item.role].filter(Boolean);
    const secondaryParts = [item.location, dates].filter(Boolean);

    return {
      primaryLine: primaryParts.join(" | "),
      secondaryLine: secondaryParts.length > 0 ? secondaryParts.join(" | ") : null,
      datesLine: null,
      useSideDates: false,
    };
  }

  return {
    primaryLine: item.role,
    secondaryLine: [item.company, item.location].filter(Boolean).join(" · ") || null,
    datesLine: dates,
    useSideDates: true,
  };
}
