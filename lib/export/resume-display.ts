import { formatYearsOfExperienceLine } from "@/lib/resume/format-years";
import { stripHtml } from "@/lib/export/text-utils";
import type {
  JobCertification,
  ProfessionalSummary,
  Resume,
  SummaryAchievement,
} from "@/types/resume";

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
