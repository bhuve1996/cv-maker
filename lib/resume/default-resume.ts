import type { Resume, OptionalFields } from "@/types/resume";
import { EMPTY_OPTIONAL_FIELDS } from "@/lib/resume/optional-fields";

export { EMPTY_OPTIONAL_FIELDS };

export function createEmptyResume(): Resume {
  return {
    personalInfo: {
      fullName: "",
      currentTitle: "",
      specialization: [],
      phone: "",
      email: "",
      linkedIn: "",
      website: "",
      github: "",
      location: {
        city: "",
        country: "",
        postalCode: "",
      },
    },
    professionalSummary: {
      text: "",
      yearsOfExperience: "",
      designation: "",
      coreExpertise: [],
      achievements: [],
      careerObjective: "",
    },
    experience: [],
    education: [],
    skills: [],
    spokenLanguages: [],
    keyAchievements: [],
    interests: [],
    projects: [],
    certifications: [],
    optionalFields: { ...EMPTY_OPTIONAL_FIELDS },
  };
}
