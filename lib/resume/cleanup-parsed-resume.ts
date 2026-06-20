import type { PersonalInfo, Resume } from "@/types/resume";

function toTitleCaseWord(word: string): string {
  if (!word) return "";
  if (word.length <= 2 && /^[A-Z]+$/.test(word)) return word;
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function normalizePersonName(name: string): string {
  const trimmed = name.trim();
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
  const title = currentTitle.trim();
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
    .map((item) => item.trim())
    .filter((item) => {
      const key = item.toLowerCase();
      if (!item || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function cleanupParsedResume(resume: Resume): Resume {
  const { currentTitle, specialization } = splitTitleAndSpecialization(
    resume.personalInfo.currentTitle,
    resume.personalInfo.specialization,
  );

  return {
    ...resume,
    personalInfo: {
      ...resume.personalInfo,
      fullName: normalizePersonName(resume.personalInfo.fullName),
      currentTitle,
      specialization,
      email: resume.personalInfo.email.trim().toLowerCase(),
      phone: resume.personalInfo.phone.trim(),
      linkedIn: resume.personalInfo.linkedIn.trim(),
      website: resume.personalInfo.website.trim(),
      github: resume.personalInfo.github.trim(),
    },
    professionalSummary: {
      ...resume.professionalSummary,
      text: resume.professionalSummary.text.trim(),
      designation:
        resume.professionalSummary.designation.trim() || currentTitle,
    },
    interests: dedupeStrings(resume.interests),
  };
}
