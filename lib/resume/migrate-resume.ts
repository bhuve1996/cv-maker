import { v4 as uuidv4 } from "uuid";
import {
  createEmptyResume,
} from "@/lib/resume/default-resume";
import { coerceString, coerceStringArray } from "@/lib/resume/coerce-string";
import { EMPTY_OPTIONAL_FIELDS } from "@/lib/resume/optional-fields";
import type {
  Experience,
  OptionalFields,
  PersonalInfo,
  ProfessionalSummary,
  Resume,
  SkillCategory,
  StructuredLocation,
  SummaryAchievement,
} from "@/types/resume";

type LegacyResume = Partial<Resume> & {
  summary?: string;
  personalInfo?: Partial<PersonalInfo> & { location?: string | StructuredLocation };
  unavailableFields?: Record<string, string | null>;
};

function parseLegacyLocation(
  location: string | StructuredLocation | undefined | null,
): StructuredLocation {
  if (!location) {
    return { city: "", country: "", postalCode: "" };
  }

  if (typeof location !== "string") {
    return {
      city: coerceString(location.city),
      country: coerceString(location.country),
      postalCode: coerceString(location.postalCode),
    };
  }

  const postalMatch = location.match(/(\d{4,6})$/);
  const postalCode = postalMatch?.[1] ?? "";
  const withoutPostal = location.replace(/\s+\d{4,6}$/, "").trim();
  const [city = "", country = ""] = withoutPostal.split(",").map((part) => part.trim());

  return { city, country, postalCode };
}

function migrateAchievements(
  items: Partial<SummaryAchievement>[] | undefined,
): SummaryAchievement[] {
  return (items ?? []).map((item) => ({
    id: item.id ?? uuidv4(),
    description: coerceString(item.description),
    impact: coerceString(item.impact),
  }));
}

function migrateExperience(entry: Partial<Experience>): Experience {
  return {
    id: entry.id ?? uuidv4(),
    company: coerceString(entry.company),
    role: coerceString(entry.role),
    location: coerceString(entry.location),
    startDate: coerceString(entry.startDate),
    endDate: coerceString(entry.endDate),
    companyDescription: coerceString(entry.companyDescription),
    description: coerceString(entry.description),
    projects: (entry.projects ?? []).map((project) => ({
      id: project.id ?? uuidv4(),
      client: coerceString(project.client),
      industry: coerceString(project.industry),
      responsibilities: coerceStringArray(project.responsibilities),
      technologies: coerceStringArray(project.technologies),
    })),
    certifications: (entry.certifications ?? []).map((cert) => ({
      id: cert.id ?? uuidv4(),
      name: coerceString(cert.name),
      status: coerceString(cert.status),
    })),
    achievements: migrateAchievements(entry.achievements),
    technologies: coerceStringArray(entry.technologies),
  };
}

function migrateProfessionalSummary(
  partial: Partial<ProfessionalSummary> | undefined,
  legacySummary?: string,
): ProfessionalSummary {
  const base = createEmptyResume().professionalSummary;

  return {
    text: coerceString(partial?.text) || coerceString(legacySummary) || base.text,
    yearsOfExperience: coerceString(partial?.yearsOfExperience) || base.yearsOfExperience,
    designation: coerceString(partial?.designation) || base.designation,
    coreExpertise: coerceStringArray(partial?.coreExpertise),
    achievements: migrateAchievements(partial?.achievements),
    careerObjective: coerceString(partial?.careerObjective) || base.careerObjective,
  };
}

function migrateOptionalFields(partial: LegacyResume): OptionalFields {
  const source = partial.optionalFields ?? partial.unavailableFields ?? {};

  return {
    ...EMPTY_OPTIONAL_FIELDS,
    ...Object.fromEntries(
      Object.keys(EMPTY_OPTIONAL_FIELDS).map((key) => {
        const value = source[key as keyof OptionalFields];
        return [key, coerceString(value)];
      }),
    ),
  };
}

function migratePersonalInfo(
  partial: LegacyResume["personalInfo"],
  base: PersonalInfo,
): PersonalInfo {
  const legacyLocation = parseLegacyLocation(partial?.location);

  return {
    fullName: coerceString(partial?.fullName) || base.fullName,
    currentTitle: coerceString(partial?.currentTitle) || base.currentTitle,
    specialization: coerceStringArray(partial?.specialization),
    phone: coerceString(partial?.phone) || base.phone,
    email: coerceString(partial?.email) || base.email,
    linkedIn: coerceString(partial?.linkedIn) || base.linkedIn,
    website: coerceString(partial?.website) || base.website,
    github: coerceString(partial?.github) || base.github,
    location: legacyLocation,
  };
}

export function migrateResume(partial: LegacyResume): Resume {
  const base = createEmptyResume();

  return {
    personalInfo: migratePersonalInfo(partial.personalInfo, base.personalInfo),
    professionalSummary: migrateProfessionalSummary(
      partial.professionalSummary,
      partial.summary,
    ),
    experience: (partial.experience ?? []).map(migrateExperience),
    education: (partial.education ?? []).map((entry) => ({
      id: entry.id ?? uuidv4(),
      institution: coerceString(entry.institution),
      degree: coerceString(entry.degree),
      board: coerceString(entry.board),
      location: coerceString(entry.location),
      startDate: coerceString(entry.startDate),
      endDate: coerceString(entry.endDate),
    })),
    skills: (partial.skills ?? []).map((skill) => {
      const legacyCategory = coerceString(skill.category);
      let category: SkillCategory = "other";

      if (legacyCategory === "technical") category = "frontend";
      else if (legacyCategory === "soft") category = "soft";
      else if (legacyCategory) category = legacyCategory as SkillCategory;

      return {
        id: skill.id ?? uuidv4(),
        name: coerceString(skill.name),
        category,
      };
    }),
    spokenLanguages: (partial.spokenLanguages ?? []).map((item) => ({
      id: item.id ?? uuidv4(),
      language: coerceString(item.language),
      proficiency: coerceString(item.proficiency),
    })),
    keyAchievements: (partial.keyAchievements ?? []).map((item) => ({
      id: item.id ?? uuidv4(),
      title: coerceString(item.title),
      description: coerceString(item.description),
    })),
    interests: coerceStringArray(partial?.interests),
    projects: (partial.projects ?? []).map((item) => ({
      id: item.id ?? uuidv4(),
      name: coerceString(item.name),
      description: coerceString(item.description),
      technologies: coerceString(item.technologies),
    })),
    certifications: (partial.certifications ?? []).map((item) => ({
      id: item.id ?? uuidv4(),
      name: coerceString(item.name),
      issuer: coerceString(item.issuer),
    })),
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
