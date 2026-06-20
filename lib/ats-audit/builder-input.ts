import { resumeToPlainText } from "@/lib/export/resume-content";
import { RESUME_TEMPLATE_METADATA } from "@/lib/export/template-metadata";
import type { Resume } from "@/types/resume";
import type { BuilderAuditInput } from "@/types/ats-audit";

export function buildBuilderAuditInput(resume: Resume): BuilderAuditInput {
  const { personalInfo, professionalSummary } = resume;

  return {
    source: "builder",
    resumeText: resumeToPlainText(resume),
    hasSummary: Boolean(professionalSummary.text.trim()),
    hasSkills: resume.skills.length > 0,
    hasExperience: resume.experience.length > 0,
    hasEducation: resume.education.length > 0,
    hasCertifications: resume.certifications.length > 0,
    hasProjects: resume.projects.length > 0,
    contactFieldsPresent: {
      name: Boolean(personalInfo.fullName.trim()),
      email: Boolean(personalInfo.email.trim()),
      phone: Boolean(personalInfo.phone.trim()),
      linkedIn: Boolean(personalInfo.linkedIn.trim()),
      location: Boolean(
        personalInfo.location.city.trim() ||
          personalInfo.location.country.trim(),
      ),
    },
    contactUsesLabels: RESUME_TEMPLATE_METADATA.contactUsesLabels,
    sectionOrderMatchesPreferred: true,
    usesTextBasedExport: RESUME_TEMPLATE_METADATA.exportFormat === "text-based-pdf",
  };
}
