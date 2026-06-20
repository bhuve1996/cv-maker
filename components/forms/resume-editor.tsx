"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CertificationsForm,
  EducationForm,
  ExperienceForm,
  PersonalInfoForm,
  ProjectsForm,
  SkillsForm,
  SummaryForm,
} from "@/components/forms/resume-forms";

const SECTIONS = [
  { id: "personal", title: "Personal Information", content: <PersonalInfoForm /> },
  { id: "summary", title: "Summary", content: <SummaryForm /> },
  { id: "experience", title: "Experience", content: <ExperienceForm /> },
  { id: "education", title: "Education", content: <EducationForm /> },
  { id: "skills", title: "Skills", content: <SkillsForm /> },
  { id: "projects", title: "Projects", content: <ProjectsForm /> },
  { id: "certifications", title: "Certifications", content: <CertificationsForm /> },
] as const;

export function ResumeEditor() {
  return (
    <Accordion
      multiple
      defaultValue={["personal", "summary", "experience"]}
      className="w-full space-y-2"
    >
      {SECTIONS.map((section) => (
        <AccordionItem key={section.id} value={section.id} className="rounded-lg border px-4">
          <AccordionTrigger className="py-4 text-base font-medium hover:no-underline">
            {section.title}
          </AccordionTrigger>
          <AccordionContent className="pb-4">{section.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
