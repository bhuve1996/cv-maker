import { v4 as uuidv4 } from "uuid";
import { categorizeSkill, SKILL_CATEGORY_ORDER } from "@/lib/resume/skill-categories";
import { coerceString, coerceStringArray } from "@/lib/resume/coerce-string";
import { cleanupParsedResume } from "@/lib/resume/cleanup-parsed-resume";
import { migrateResume } from "@/lib/resume/migrate-resume";
import type { Resume, SkillCategory } from "@/types/resume";

const VALID_SKILL_CATEGORIES = new Set<string>(SKILL_CATEGORY_ORDER);

function normalizeSkillCategory(value: unknown, skillName: string): SkillCategory {
  const fromRules = categorizeSkill(skillName);
  if (fromRules !== "other") {
    return fromRules;
  }

  const category = coerceString(value);
  if (VALID_SKILL_CATEGORIES.has(category)) {
    return category as SkillCategory;
  }

  return fromRules;
}

export function normalizeAiResumePayload(
  raw: unknown,
  rawText?: string,
): Partial<Resume> {
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const payload = raw as Record<string, unknown>;

  const skills = Array.isArray(payload.skills)
    ? payload.skills
        .filter((item) => item && typeof item === "object")
        .map((item) => {
          const skill = item as Record<string, unknown>;
          const name = coerceString(skill.name);
          if (!name) return null;
          return {
            name,
            category: normalizeSkillCategory(skill.category, name),
          };
        })
        .filter((item): item is { name: string; category: SkillCategory } => item !== null)
    : [];

  const normalized = {
    ...(payload as Partial<Resume>),
    skills,
    interests: coerceStringArray(payload.interests),
  } as Partial<Resume>;

  const migrated = migrateResume(normalized);

  return cleanupParsedResume({
    ...migrated,
    experience: migrated.experience.map((job) => ({
      ...job,
      projects: job.projects.map((project) => ({
        ...project,
        id: project.id || uuidv4(),
      })),
      certifications: job.certifications.map((cert) => ({
        ...cert,
        id: cert.id || uuidv4(),
      })),
      achievements: job.achievements.map((item) => ({
        ...item,
        id: item.id || uuidv4(),
      })),
    })),
    professionalSummary: {
      ...migrated.professionalSummary,
      achievements: migrated.professionalSummary.achievements.map((item) => ({
        ...item,
        id: item.id || uuidv4(),
      })),
    },
  }, rawText);
}
