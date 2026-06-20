import { SKILL_CATEGORY_ORDER } from "@/lib/resume/skill-categories";

export const RESUME_PARSE_SYSTEM_PROMPT = `You are a resume parsing assistant. Extract structured data from raw resume text.

Rules:
- Return ONLY valid JSON matching the schema below. No markdown, no commentary.
- Use empty strings, empty arrays, or omit optional fields when information is missing.
- Do not invent employers, projects, skills, dates, or credentials not supported by the text.
- Preserve factual wording from the resume; lightly normalize formatting only.
- Split employment into separate jobs by employer/role changes.
- Nest client or project work under the correct employer in experience[].projects when the resume groups them that way.
- For skills, assign each skill to exactly one category from the allowed list.
- Dates: keep original format when possible (e.g. MM/YYYY, Month YYYY, or Present).
- If a field cannot be determined, leave it empty rather than guessing.

Allowed skill categories: ${SKILL_CATEGORY_ORDER.join(", ")}`;

export const RESUME_PARSE_JSON_SCHEMA = {
  personalInfo: {
    fullName: "string",
    currentTitle: "string",
    specialization: ["string"],
    phone: "string",
    email: "string",
    linkedIn: "string",
    website: "string",
    github: "string",
    location: { city: "string", country: "string", postalCode: "string" },
  },
  professionalSummary: {
    text: "string",
    yearsOfExperience: "string",
    designation: "string",
    coreExpertise: ["string"],
    achievements: [{ description: "string", impact: "string" }],
    careerObjective: "string",
  },
  experience: [
    {
      company: "string",
      role: "string",
      location: "string",
      startDate: "string",
      endDate: "string",
      companyDescription: "string",
      description: "string",
      projects: [
        {
          client: "string",
          industry: "string",
          responsibilities: ["string"],
          technologies: ["string"],
        },
      ],
      certifications: [{ name: "string", status: "string" }],
      achievements: [{ description: "string", impact: "string" }],
      technologies: ["string"],
    },
  ],
  education: [
    {
      institution: "string",
      degree: "string",
      board: "string",
      location: "string",
      startDate: "string",
      endDate: "string",
    },
  ],
  skills: [{ name: "string", category: "SkillCategory" }],
  spokenLanguages: [{ language: "string", proficiency: "string" }],
  keyAchievements: [{ title: "string", description: "string" }],
  interests: ["string"],
  projects: [{ name: "string", description: "string", technologies: "string" }],
  certifications: [{ name: "string", issuer: "string" }],
};

export function buildResumeParsePrompt(rawText: string): string {
  const trimmed = rawText.trim().slice(0, 20000);

  return `${RESUME_PARSE_SYSTEM_PROMPT}

JSON schema (shape only):
${JSON.stringify(RESUME_PARSE_JSON_SCHEMA, null, 2)}

Resume text:
"""
${trimmed}
"""`;
}
