import { v4 as uuidv4 } from "uuid";
import {
  createEmptyResume,
} from "@/lib/resume/default-resume";
import { EMPTY_OPTIONAL_FIELDS } from "@/lib/resume/optional-fields";
import type {
  Experience,
  OptionalFields,
  PersonalInfo,
  ProfessionalSummary,
  Resume,
  StructuredLocation,
} from "@/types/resume";

type LegacyResume = Partial<Resume> & {
  summary?: string;
  personalInfo?: Partial<PersonalInfo> & { location?: string | StructuredLocation };
  unavailableFields?: Record<string, string | null>;
};

function parseLegacyLocation(
  location: string | StructuredLocation | undefined,
): StructuredLocation {
  if (!location) {
    return { city: "", country: "", postalCode: "" };
  }

  if (typeof location !== "string") {
    return location;
  }

  const postalMatch = location.match(/(\d{4,6})$/);
  const postalCode = postalMatch?.[1] ?? "";
  const withoutPostal = location.replace(/\s+\d{4,6}$/, "").trim();
  const [city = "", country = ""] = withoutPostal.split(",").map((part) => part.trim());

  return { city, country, postalCode };
}

function migrateExperience(entry: Partial<Experience>): Experience {
  return {
    id: entry.id ?? uuidv4(),
    company: entry.company ?? "",
    role: entry.role ?? "",
    location: entry.location ?? "",
    startDate: entry.startDate ?? "",
    endDate: entry.endDate ?? "",
    companyDescription: entry.companyDescription ?? "",
    description: entry.description ?? "",
    projects: (entry.projects ?? []).map((project) => ({
      id: project.id ?? uuidv4(),
      client: project.client ?? "",
      industry: project.industry ?? "",
      responsibilities: project.responsibilities ?? [],
      technologies: project.technologies ?? [],
    })),
    certifications: (entry.certifications ?? []).map((cert) => ({
      id: cert.id ?? uuidv4(),
      name: cert.name ?? "",
      status: cert.status ?? "",
    })),
    achievements: (entry.achievements ?? []).map((item) => ({
      id: item.id ?? uuidv4(),
      description: item.description ?? "",
      impact: item.impact ?? "",
    })),
    technologies: entry.technologies ?? [],
  };
}

function migrateProfessionalSummary(
  partial: Partial<ProfessionalSummary> | undefined,
  legacySummary?: string,
): ProfessionalSummary {
  const base = createEmptyResume().professionalSummary;

  return {
    text: partial?.text ?? legacySummary ?? base.text,
    yearsOfExperience: partial?.yearsOfExperience ?? base.yearsOfExperience,
    designation: partial?.designation ?? base.designation,
    coreExpertise: partial?.coreExpertise ?? base.coreExpertise,
    achievements: partial?.achievements ?? base.achievements,
    careerObjective: partial?.careerObjective ?? base.careerObjective,
  };
}

function migrateOptionalFields(partial: LegacyResume): OptionalFields {
  const source = partial.optionalFields ?? partial.unavailableFields ?? {};

  return {
    ...EMPTY_OPTIONAL_FIELDS,
    ...Object.fromEntries(
      Object.keys(EMPTY_OPTIONAL_FIELDS).map((key) => {
        const value = source[key as keyof OptionalFields];
        return [key, value == null ? "" : String(value)];
      }),
    ),
  };
}

export function migrateResume(partial: LegacyResume): Resume {
  const base = createEmptyResume();
  const legacyLocation = parseLegacyLocation(partial.personalInfo?.location);

  return {
    personalInfo: {
      ...base.personalInfo,
      ...partial.personalInfo,
      location: legacyLocation,
      specialization: partial.personalInfo?.specialization ?? base.personalInfo.specialization,
      currentTitle: partial.personalInfo?.currentTitle ?? base.personalInfo.currentTitle,
      github: partial.personalInfo?.github ?? base.personalInfo.github,
    },
    professionalSummary: migrateProfessionalSummary(
      partial.professionalSummary,
      partial.summary,
    ),
    experience: (partial.experience ?? []).map(migrateExperience),
    education: (partial.education ?? []).map((entry) => ({
      id: entry.id ?? uuidv4(),
      institution: entry.institution ?? "",
      degree: entry.degree ?? "",
      board: entry.board ?? "",
      location: entry.location ?? "",
      startDate: entry.startDate ?? "",
      endDate: entry.endDate ?? "",
    })),
    skills: (partial.skills ?? []).map((skill) => {
      const legacyCategory = skill.category as string;
      let category = skill.category ?? "other";

      if (legacyCategory === "technical") category = "frontend";
      if (legacyCategory === "soft") category = "soft";

      return {
        id: skill.id ?? uuidv4(),
        name: skill.name ?? "",
        category,
      };
    }),
    spokenLanguages: partial.spokenLanguages ?? base.spokenLanguages,
    keyAchievements: partial.keyAchievements ?? base.keyAchievements,
    interests: partial.interests ?? base.interests,
    projects: partial.projects ?? base.projects,
    certifications: partial.certifications ?? base.certifications,
    optionalFields: migrateOptionalFields(partial),
  };
}

export function mergeResume(partial: LegacyResume): Resume {
  const migrated = migrateResume(partial);
  const base = createEmptyResume();

  return {
    personalInfo: { ...base.personalInfo, ...migrated.personalInfo },
    professionalSummary: {
      ...base.professionalSummary,
      ...migrated.professionalSummary,
    },
    experience: migrated.experience.length ? migrated.experience : base.experience,
    education: migrated.education.length ? migrated.education : base.education,
    skills: migrated.skills.length ? migrated.skills : base.skills,
    spokenLanguages: migrated.spokenLanguages.length
      ? migrated.spokenLanguages
      : base.spokenLanguages,
    keyAchievements: migrated.keyAchievements.length
      ? migrated.keyAchievements
      : base.keyAchievements,
    interests: migrated.interests.length ? migrated.interests : base.interests,
    projects: migrated.projects.length ? migrated.projects : base.projects,
    certifications: migrated.certifications.length
      ? migrated.certifications
      : base.certifications,
    optionalFields: {
      ...base.optionalFields,
      ...migrated.optionalFields,
    },
  };
}
