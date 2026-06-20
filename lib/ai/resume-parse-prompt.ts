import { SKILL_CATEGORY_ORDER } from "@/lib/resume/skill-categories";

export const RESUME_PARSE_SYSTEM_PROMPT = `You are a resume parsing assistant. Extract structured data from raw resume text.

Rules:
- Return ONLY valid JSON matching the schema below. No markdown, no commentary.
- Use empty strings, empty arrays, or omit optional fields when information is missing.
- Do not invent employers, projects, skills, dates, or credentials not supported by the text.
- Preserve factual wording from the resume; lightly normalize formatting only.
- Split employment into separate jobs by employer/role changes.
- Nest client or project work under the correct employer in experience[].projects when the resume groups them that way.
- For each project, use 1-2 complete-sentence bullets in responsibilities[] — do NOT split a single sentence into multiple lowercase fragments.
- Put measurable summary wins in professionalSummary.achievements[] only when they are NOT already written inside professionalSummary.text. Put job-level wins in experience[].achievements[].
- Copy certifications mentioned anywhere to top-level certifications[] with issuer when known. Use concise certification names and short status values in experience[].certifications.
- professionalSummary.yearsOfExperience must be a number token only (e.g. "7" or "7+"), never include the word "years".
- Capture every client/project under the correct employer, including entries with malformed parentheses (e.g. "Client Name Industry Label) -") or colon separators (e.g. "Client Name: Delivered ...").
- interests[] must be short individual hobby names, not a full prose sentence.
- skills[] must be concrete tools/frameworks/languages only — exclude generic words like Modular, SEO, E-commerce unless they appear as explicit standalone skills in a skills section.
- Do not duplicate the same skill twice. Use correct categories (React/Next.js = frontend, not ui_frameworks).
- Include the full summary paragraph in professionalSummary.text, including career objective if present.
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
    text: "string — full summary paragraph including objective if present",
    yearsOfExperience: "string — number only, e.g. 7 or 7+ (no 'years' suffix)",
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
          responsibilities: ["string — complete sentences, 1-2 per project"],
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
  interests: ["string — individual hobbies, not prose"],
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
