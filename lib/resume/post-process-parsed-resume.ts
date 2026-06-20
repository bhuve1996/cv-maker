import { v4 as uuidv4 } from "uuid";
import { coerceString } from "@/lib/resume/coerce-string";
import {
  buildTechnologyPool,
  dedupeClientProjects,
  enrichProjectTechnologies,
} from "@/lib/resume/dedupe-projects";
import {
  dedupeJobCertifications,
  dedupeTopLevelCertifications,
  extractCanonicalCertificationName,
  normalizeCertificationKey,
} from "@/lib/resume/dedupe-certifications";
import {
  isPromotableSkillName,
  normalizeTechnologyList,
} from "@/lib/resume/normalize-technologies";
import { stripHtml } from "@/lib/export/text-utils";
import { normalizeYearsOfExperience } from "@/lib/resume/format-years";
import { categorizeSkill } from "@/lib/resume/skill-categories";
import type {
  ClientProject,
  Experience,
  JobAchievement,
  JobCertification,
  Resume,
  Skill,
} from "@/types/resume";

const SKILL_BLOCKLIST = new Set([
  "modular",
  "seo",
  "e-commerce",
  "ecommerce",
  "serverless",
]);

const INTEREST_KEYWORDS = [
  "cricket",
  "badminton",
  "swimming",
  "reading",
  "travel",
  "traveling",
  "music",
  "photography",
  "coding",
  "hiking",
  "football",
  "tennis",
];

export function joinResponsibilityFragments(items: string[]): string[] {
  if (items.length <= 1) return items.map(formatSentence);

  const merged: string[] = [];
  let buffer = "";

  for (const item of items) {
    const trimmed = coerceString(item).trim();
    if (!trimmed) continue;

    const isContinuation =
      buffer.length > 0 && /^[a-z("(]/.test(trimmed) && !/^[a-z]+\s+[A-Z]/.test(trimmed);

    if (isContinuation) {
      const separator = /[.!?]$/.test(buffer) ? " " : ", ";
      buffer = `${buffer}${separator}${trimmed}`;
    } else {
      if (buffer) merged.push(formatSentence(buffer));
      buffer = trimmed;
    }
  }

  if (buffer) merged.push(formatSentence(buffer));
  return merged.length > 0 ? merged : items.map(formatSentence);
}

function formatSentence(text: string): string {
  const trimmed = repairResponsibilitySentence(text.trim().replace(/\s+/g, " "));
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/** Fix common PDF extraction artifacts without inventing missing content. */
export function repairResponsibilitySentence(text: string): string {
  return text
    .replace(/\band\s+(through|with|by|for)\b/gi, "$1")
    .replace(/,?\s*and Jest Tested Code\.?/gi, ".")
    .replace(/\bJest Tested Code\b/gi, "Jest")
    .replace(/\bstudent experience\b/gi, "student\u00A0experience")
    .replace(/\.\s*\./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Remove bracket placeholders and broken boilerplate from summary prose. */
export function cleanSummaryText(text: string): string {
  return text
    .replace(/\s*Seeking[^.]*\[[^\]]+\][^.]*\.\s*/gi, " ")
    .replace(/\[[^\]]+\]/g, "")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isRedundantAchievementImpact(description: string, impact: string): boolean {
  const descLower = description.toLowerCase().replace(/\.$/, "").trim();
  const impactLower = impact.toLowerCase().replace(/\.$/, "").trim();
  if (!descLower || !impactLower) return false;

  if (descLower.includes(impactLower) || impactLower.includes(descLower)) {
    return true;
  }

  const snippetLen = Math.min(40, descLower.length, impactLower.length);
  if (snippetLen >= 20 && descLower.slice(0, snippetLen) === impactLower.slice(0, snippetLen)) {
    return true;
  }

  return false;
}

export function normalizeJobAchievement(achievement: JobAchievement): JobAchievement {
  const description = coerceString(achievement.description).trim();
  let impact = coerceString(achievement.impact).trim();

  if (/^\d+%$/.test(impact)) {
    impact = `by ${impact}`;
  } else {
    impact = impact.replace(/^by\s+(\d+%)\s+by\s+/i, "$1 by ");
  }

  if (isRedundantAchievementImpact(description, impact)) {
    impact = "";
  }

  return {
    ...achievement,
    description,
    impact,
  };
}

export function normalizeJobCertification(cert: JobCertification): JobCertification {
  const rawName = coerceString(cert.name).trim();
  let name = extractCanonicalCertificationName(rawName) || rawName;
  let status = coerceString(cert.status).trim();

  if (/^successfully completed/i.test(rawName) && !status) {
    const shortStatus = rawName.match(
      /^(Successfully completed(?: and actively participated)?)/i,
    );
    status = shortStatus?.[0] ?? "Successfully completed";
  }

  if (status.length > 80) {
    const shortStatus = status.match(
      /^(Successfully completed|Completed|Certified|In progress|Active)/i,
    );
    status = shortStatus?.[0] ?? status.slice(0, 60).trim();
  }

  return { ...cert, name, status };
}

export function dedupeSummaryAchievements(
  summary: Resume["professionalSummary"],
): Resume["professionalSummary"] {
  const text = stripHtml(summary.text).toLowerCase();
  if (!text) return summary;

  const achievements = summary.achievements.filter((achievement) => {
    const description = coerceString(achievement.description).trim().toLowerCase();
    if (description.length < 8) return true;

    const snippet = description.slice(0, Math.min(40, description.length));
    return !text.includes(snippet);
  });

  return { ...summary, achievements };
}

export function syncJobTechnologiesFromProjects(job: Experience): Experience {
  const fromProjects = job.projects.flatMap((project) => project.technologies);
  const technologies = normalizeTechnologyList(fromProjects);

  return { ...job, technologies };
}

export function normalizeInterestItems(interests: string[]): string[] {
  if (interests.length === 0) return [];

  const found = new Set<string>();

  for (const interest of interests) {
    const lower = coerceString(interest).toLowerCase();
    for (const keyword of INTEREST_KEYWORDS) {
      if (lower.includes(keyword)) {
        found.add(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    }
  }

  if (found.size > 0) {
    return [...found];
  }

  return interests
    .flatMap((item) =>
      item
        .replace(/^(hobbies and interests|interests)\s*[:.-]?\s*/i, "")
        .split(/,|\band\b|;/)
        .map((part) =>
          part
            .replace(/^(engaged in|enjoys|like|including|such as|sports like)\s+/i, "")
            .replace(/\.$/, "")
            .trim(),
        ),
    )
    .filter((item) => item.length > 2 && item.length < 40);
}

export function filterAndDedupeSkills(skills: Skill[]): Skill[] {
  const seen = new Set<string>();

  return skills
    .map((skill) => {
      const category = categorizeSkill(skill.name);
      return {
        ...skill,
        category: category !== "other" ? category : skill.category,
      };
    })
    .filter((skill) => {
      const key = coerceString(skill.name).trim().toLowerCase();
      if (!key || SKILL_BLOCKLIST.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function promoteJobCertifications(resume: Resume): Resume {
  const experience = resume.experience.map((job) => ({
    ...job,
    certifications: dedupeJobCertifications(
      job.certifications.map(normalizeJobCertification),
    ),
  }));

  const certifications = dedupeTopLevelCertifications(resume.certifications);
  const seen = new Set(
    certifications.map((cert) =>
      normalizeCertificationKey(cert.name),
    ),
  );

  for (const job of experience) {
    for (const cert of job.certifications) {
      const name = coerceString(cert.name).trim();
      if (!name) continue;
      const key = normalizeCertificationKey(name);
      if (seen.has(key)) continue;
      seen.add(key);
      certifications.push({
        id: cert.id || uuidv4(),
        name: extractCanonicalCertificationName(name) || name,
        issuer: job.company,
      });
    }
  }

  return {
    ...resume,
    experience,
    certifications: dedupeTopLevelCertifications(certifications),
  };
}

export function enrichSkillsFromExperience(
  skills: Skill[],
  experience: Experience[],
): Skill[] {
  const existing = new Set(
    skills.map((skill) => coerceString(skill.name).trim().toLowerCase()).filter(Boolean),
  );
  const additions: Skill[] = [];

  for (const job of experience) {
    for (const tech of normalizeTechnologyList(job.technologies)) {
      const name = coerceString(tech).trim();
      const key = name.toLowerCase();
      if (!name || !isPromotableSkillName(name) || existing.has(key)) continue;
      existing.add(key);
      additions.push({
        id: uuidv4(),
        name,
        category: categorizeSkill(name),
      });
    }
  }

  return additions.length > 0 ? [...skills, ...additions] : skills;
}

export function postProcessExperience(
  experience: Experience[],
  skillNames: string[] = [],
): Experience[] {
  return experience.map((job) => {
    const preparedProjects = job.projects.map((project) => ({
      ...project,
      responsibilities: joinResponsibilityFragments(project.responsibilities).map(
        repairResponsibilitySentence,
      ),
    }));

    const dedupedProjects = dedupeClientProjects(
      preparedProjects,
      job.companyDescription,
    );

    const technologyPool = buildTechnologyPool(
      preparedProjects,
      job.technologies,
      skillNames,
    );

    const projects = dedupedProjects.map((project) =>
      enrichProjectTechnologies(project, technologyPool),
    );

    const processed: Experience = {
      ...job,
      certifications: dedupeJobCertifications(
        job.certifications.map(normalizeJobCertification),
      ),
      achievements: job.achievements.map(normalizeJobAchievement),
      projects,
      description: projects.length > 0 ? "" : coerceString(job.description).trim(),
    };

    return syncJobTechnologiesFromProjects(processed);
  });
}

export function mergeSummaryText(summary: Resume["professionalSummary"]): Resume["professionalSummary"] {
  let text = coerceString(summary.text).trim();
  const objective = coerceString(summary.careerObjective).trim();

  if (objective && !text.toLowerCase().includes(objective.slice(0, 40).toLowerCase())) {
    text = text ? `${text} ${objective}` : objective;
  }

  const withYears = {
    ...summary,
    text: cleanSummaryText(text.trim()),
    yearsOfExperience: normalizeYearsOfExperience(summary.yearsOfExperience),
  };

  return dedupeSummaryAchievements(withYears);
}

export function postProcessProjects(projects: ClientProject[]): ClientProject[] {
  return projects.map((project) => ({
    ...project,
    responsibilities: joinResponsibilityFragments(project.responsibilities),
  }));
}
