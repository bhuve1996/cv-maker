export interface StructuredLocation {
  city: string;
  country: string;
  postalCode: string;
}

export interface PersonalInfo {
  fullName: string;
  currentTitle: string;
  specialization: string[];
  phone: string;
  email: string;
  linkedIn: string;
  website: string;
  github: string;
  location: StructuredLocation;
}

export interface SummaryAchievement {
  id: string;
  description: string;
  impact: string;
}

export interface ProfessionalSummary {
  text: string;
  yearsOfExperience: string;
  designation: string;
  coreExpertise: string[];
  achievements: SummaryAchievement[];
  careerObjective: string;
}

export interface ClientProject {
  id: string;
  client: string;
  industry: string;
  responsibilities: string[];
  technologies: string[];
}

export interface JobCertification {
  id: string;
  name: string;
  status: string;
}

export interface JobAchievement {
  id: string;
  description: string;
  impact: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  companyDescription: string;
  description: string;
  projects: ClientProject[];
  certifications: JobCertification[];
  achievements: JobAchievement[];
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  board: string;
  location: string;
  startDate: string;
  endDate: string;
}

export type SkillCategory =
  | "frontend"
  | "languages"
  | "ui_frameworks"
  | "cms"
  | "build_tools"
  | "version_control"
  | "project_management"
  | "api_technologies"
  | "animations"
  | "mapping"
  | "backend"
  | "hosting_deployment"
  | "mobile"
  | "other"
  | "soft";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export interface SpokenLanguage {
  id: string;
  language: string;
  proficiency: string;
}

export interface KeyAchievement {
  id: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
}

/** Optional fields often requested by job applications but rarely on resumes */
export interface OptionalFields {
  dateOfBirth: string;
  age: string;
  gender: string;
  currentCtc: string;
  expectedCtc: string;
  noticePeriod: string;
  maritalStatus: string;
  nationality: string;
  addressLine: string;
  certificationIds: string;
  cgpa: string;
  percentage10th: string;
  percentage12th: string;
  beCgpa: string;
}

export interface Resume {
  personalInfo: PersonalInfo;
  professionalSummary: ProfessionalSummary;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  spokenLanguages: SpokenLanguage[];
  keyAchievements: KeyAchievement[];
  interests: string[];
  projects: Project[];
  certifications: Certification[];
  optionalFields: OptionalFields;
}

export type ResumeSection =
  | "personalInfo"
  | "professionalSummary"
  | "experience"
  | "education"
  | "skills"
  | "spokenLanguages"
  | "keyAchievements"
  | "interests"
  | "projects"
  | "certifications"
  | "optionalFields";

export interface ResumeSectionDefinition {
  id: ResumeSection;
  title: string;
  description: string;
}

export const RESUME_SECTIONS: ResumeSectionDefinition[] = [
  {
    id: "personalInfo",
    title: "Personal Information",
    description: "Name, title, contact details, and location",
  },
  {
    id: "professionalSummary",
    title: "Professional Summary",
    description: "Overview, expertise, achievements, and career objective",
  },
  {
    id: "experience",
    title: "Employment History",
    description: "Companies, roles, client projects, and job certifications",
  },
  {
    id: "education",
    title: "Education",
    description: "Degrees, institutions, boards, and dates",
  },
  {
    id: "skills",
    title: "Technical Skills",
    description: "Skills grouped by category (frontend, CMS, APIs, etc.)",
  },
  {
    id: "spokenLanguages",
    title: "Languages",
    description: "Spoken languages and proficiency levels",
  },
  {
    id: "keyAchievements",
    title: "Key Achievements",
    description: "Standout academic or professional accomplishments",
  },
  {
    id: "interests",
    title: "Interests",
    description: "Hobbies and personal interests",
  },
  {
    id: "projects",
    title: "Personal Projects",
    description: "Standalone projects outside employment history",
  },
  {
    id: "certifications",
    title: "Certifications",
    description: "Global certifications and credentials",
  },
  {
    id: "optionalFields",
    title: "Optional Fields",
    description:
      "Date of birth, CTC, notice period, grades, and other application-only details",
  },
];

export interface ParseResult {
  resume: Partial<Resume>;
  rawText: string;
  confidence: "low" | "medium" | "high";
}

export function formatLocation(location: StructuredLocation): string {
  const parts = [location.city, location.country, location.postalCode].filter(
    Boolean,
  );
  return parts.join(", ");
}
