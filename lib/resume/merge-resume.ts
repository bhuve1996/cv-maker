import { createEmptyResume } from "@/lib/resume/default-resume";
import type { Resume } from "@/types/resume";

export function mergeResume(partial: Partial<Resume>): Resume {
  const base = createEmptyResume();

  return {
    personalInfo: { ...base.personalInfo, ...partial.personalInfo },
    summary: partial.summary ?? base.summary,
    experience: partial.experience ?? base.experience,
    education: partial.education ?? base.education,
    skills: partial.skills ?? base.skills,
    projects: partial.projects ?? base.projects,
    certifications: partial.certifications ?? base.certifications,
  };
}
