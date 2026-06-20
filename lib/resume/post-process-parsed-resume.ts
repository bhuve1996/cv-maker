import { v4 as uuidv4 } from "uuid";
import { categorizeSkill } from "@/lib/resume/skill-categories";
import type { ClientProject, Experience, Resume, Skill } from "@/types/resume";

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
    const trimmed = item.trim();
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
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function normalizeInterestItems(interests: string[]): string[] {
  if (interests.length === 0) return [];

  const found = new Set<string>();

  for (const interest of interests) {
    const lower = interest.toLowerCase();
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
      const key = skill.name.trim().toLowerCase();
      if (!key || SKILL_BLOCKLIST.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function promoteJobCertifications(resume: Resume): Resume {
  const certifications = [...resume.certifications];
  const seen = new Set(certifications.map((cert) => cert.name.toLowerCase()));

  for (const job of resume.experience) {
    for (const cert of job.certifications) {
      const name = cert.name.trim();
      if (!name) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      certifications.push({
        id: cert.id || uuidv4(),
        name,
        issuer: job.company,
      });
    }
  }

  return { ...resume, certifications };
}

export function postProcessExperience(experience: Experience[]): Experience[] {
  return experience.map((job) => ({
    ...job,
    projects: job.projects.map((project) => ({
      ...project,
      responsibilities: joinResponsibilityFragments(project.responsibilities),
    })),
  }));
}

export function mergeSummaryText(summary: Resume["professionalSummary"]): Resume["professionalSummary"] {
  let text = summary.text.trim();
  const objective = summary.careerObjective.trim();

  if (objective && !text.toLowerCase().includes(objective.slice(0, 40).toLowerCase())) {
    text = text ? `${text} ${objective}` : objective;
  }

  return { ...summary, text: text.trim() };
}

export function postProcessProjects(projects: ClientProject[]): ClientProject[] {
  return projects.map((project) => ({
    ...project,
    responsibilities: joinResponsibilityFragments(project.responsibilities),
  }));
}
