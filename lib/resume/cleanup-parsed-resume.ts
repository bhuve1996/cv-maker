import { coerceString, coerceStringArray } from "@/lib/resume/coerce-string";
import type { PersonalInfo, Resume } from "@/types/resume";
import { enrichExperienceFromRawText } from "@/lib/resume/enrich-from-raw-text";
import {
  enrichSkillsFromExperience,
  filterAndDedupeSkills,
  mergeSummaryText,
  normalizeInterestItems,
  postProcessExperience,
  promoteJobCertifications,
} from "@/lib/resume/post-process-parsed-resume";

function toTitleCaseWord(word: string): string {
  if (!word) return "";
  if (word.length <= 2 && /^[A-Z]+$/.test(word)) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function normalizePersonName(name: string): string {
  const trimmed = coerceString(name).trim();
  if (!trimmed) return "";

  const isAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed);
  if (!isAllCaps) return trimmed;

  return trimmed
    .split(/\s+/)
    .map((part) =>
      part
        .split("-")
        .map((piece) => toTitleCaseWord(piece))
        .join("-"),
    )
    .join(" ");
}

export function splitTitleAndSpecialization(
  currentTitle: string,
  specialization: string[],
): Pick<PersonalInfo, "currentTitle" | "specialization"> {
  const title = coerceString(currentTitle).trim();
  if (!title.includes("|")) {
    return {
      currentTitle: title,
      specialization: dedupeStrings(specialization),
    };
  }

  const parts = title.split("|").map((part) => part.trim()).filter(Boolean);
  return {
    currentTitle: parts[0] ?? "",
    specialization: dedupeStrings([...specialization, ...parts.slice(1)]),
  };
}

function dedupeStrings(items: string[]): string[] {
  const seen = new Set<string>();
  return items
    .map((item) => coerceString(item).trim())
    .filter((item) => {
      const key = item.toLowerCase();
      if (!item || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function cleanupParsedResume(resume: Resume, rawText?: string): Resume {
  const { currentTitle, specialization } = splitTitleAndSpecialization(
    resume.personalInfo.currentTitle,
    resume.personalInfo.specialization,
  );

  const withSummary = mergeSummaryText({
    ...resume.professionalSummary,
    designation: coerceString(resume.professionalSummary.designation).trim() || currentTitle,
  });

  const experience = rawText?.trim()
    ? enrichExperienceFromRawText(resume.experience, rawText)
    : resume.experience;

  const skillNames = resume.skills.map((skill) => skill.name);
  const processedExperience = postProcessExperience(experience, skillNames);
  const skills = filterAndDedupeSkills(
    enrichSkillsFromExperience(resume.skills, processedExperience),
  );

  const processed: Resume = {
    ...resume,
    personalInfo: {
      ...resume.personalInfo,
      fullName: normalizePersonName(resume.personalInfo.fullName),
      currentTitle,
      specialization: coerceStringArray(specialization),
      email: coerceString(resume.personalInfo.email).trim().toLowerCase(),
      phone: coerceString(resume.personalInfo.phone).trim(),
      linkedIn: coerceString(resume.personalInfo.linkedIn).trim(),
      website: coerceString(resume.personalInfo.website).trim(),
      github: coerceString(resume.personalInfo.github).trim(),
    },
    professionalSummary: withSummary,
    experience: processedExperience,
    skills,
    interests: dedupeStrings(normalizeInterestItems(resume.interests)),
  };

  return promoteJobCertifications(processed);
}
