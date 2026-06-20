"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OPTIONAL_FIELD_LABELS } from "@/lib/resume/optional-fields";
import { SKILL_CATEGORY_LABELS } from "@/lib/resume/skill-categories";
import type { OptionalFields, Resume, SkillCategory } from "@/types/resume";
import { formatLocation } from "@/types/resume";
import { cn } from "@/lib/utils";

interface ResumeTemplateProps {
  resume: Resume;
  className?: string;
  id?: string;
}

function formatContactValue(value: string) {
  return value.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
}

function HtmlContent({ html }: { html: string }) {
  if (!html) return null;
  return (
    <div
      className="prose-resume text-[11px] leading-relaxed text-slate-700 [&_li]:ml-4 [&_ul]:list-disc"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function ResumeTemplate({ resume, className, id }: ResumeTemplateProps) {
  const { personalInfo, professionalSummary } = resume;
  const locationText = formatLocation(personalInfo.location);

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    locationText,
    personalInfo.linkedIn,
    personalInfo.github,
    personalInfo.website,
  ].filter(Boolean);

  const skillGroups = Object.keys(SKILL_CATEGORY_LABELS).reduce(
    (groups, category) => {
      const items = resume.skills.filter((skill) => skill.category === category);
      if (items.length > 0) groups[category as SkillCategory] = items;
      return groups;
    },
    {} as Partial<Record<SkillCategory, typeof resume.skills>>,
  );

  const filledOptionalFields = (
    Object.entries(resume.optionalFields) as Array<[keyof OptionalFields, string]>
  ).filter(([, value]) => value.trim());

  return (
    <article
      id={id}
      className={cn(
        "mx-auto min-h-[1123px] w-full max-w-[794px] bg-white px-10 py-10 text-slate-900 shadow-sm print:shadow-none",
        className,
      )}
    >
      <header className="border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.currentTitle && (
          <p className="mt-1 text-sm font-medium text-slate-700">
            {personalInfo.currentTitle}
          </p>
        )}
        {personalInfo.specialization.length > 0 && (
          <p className="mt-1 text-xs text-slate-500">
            {personalInfo.specialization.join(" · ")}
          </p>
        )}
        {contactItems.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
            {contactItems.map((item) => (
              <span key={item}>{formatContactValue(item)}</span>
            ))}
          </div>
        )}
      </header>

      {professionalSummary.text && (
        <section className="mt-6">
          <SectionTitle>Summary</SectionTitle>
          {professionalSummary.yearsOfExperience && (
            <p className="mb-2 text-xs text-slate-600">
              {professionalSummary.yearsOfExperience} years of experience
              {professionalSummary.designation
                ? ` · ${professionalSummary.designation}`
                : ""}
            </p>
          )}
          <HtmlContent html={professionalSummary.text} />
          {professionalSummary.coreExpertise.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {professionalSummary.coreExpertise.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="rounded-md bg-slate-100 text-[10px] font-normal text-slate-700"
                >
                  {item}
                </Badge>
              ))}
            </div>
          )}
        </section>
      )}

      {resume.experience.length > 0 && (
        <section className="mt-6">
          <SectionTitle>Experience</SectionTitle>
          <div className="space-y-4">
            {resume.experience.map((item) => (
              <div key={item.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{item.role}</h3>
                    <p className="text-xs text-slate-600">
                      {item.company}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                    {item.companyDescription && (
                      <p className="text-[10px] text-slate-500">{item.companyDescription}</p>
                    )}
                  </div>
                  {(item.startDate || item.endDate) && (
                    <p className="text-xs text-slate-500">
                      {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                    </p>
                  )}
                </div>
                {item.projects.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {item.projects.map((project) => (
                      <div key={project.id} className="text-[11px] text-slate-700">
                        <p className="font-medium text-slate-900">
                          {project.client}
                          {project.industry ? ` (${project.industry})` : ""}
                        </p>
                        {project.responsibilities.length > 0 && (
                          <ul className="mt-1 list-disc pl-4">
                            {project.responsibilities.slice(0, 4).map((task) => (
                              <li key={task}>{task}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {item.description && !item.projects.length && (
                  <div className="mt-1">
                    <HtmlContent html={item.description} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mt-6">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-3">
            {resume.education.map((item) => (
              <div key={item.id} className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{item.degree}</h3>
                  <p className="text-xs text-slate-600">
                    {item.institution}
                    {item.board ? ` · ${item.board}` : ""}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                </div>
                {(item.startDate || item.endDate) && (
                  <p className="text-xs text-slate-500">
                    {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {Object.keys(skillGroups).length > 0 && (
        <section className="mt-6">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-3">
            {Object.entries(skillGroups).map(([category, items]) => (
              <div key={category}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {SKILL_CATEGORY_LABELS[category as SkillCategory]}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {items?.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant="secondary"
                      className="rounded-md bg-slate-100 text-[10px] font-normal text-slate-700"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.spokenLanguages.length > 0 && (
        <section className="mt-6">
          <SectionTitle>Languages</SectionTitle>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700">
            {resume.spokenLanguages.map((item) => (
              <span key={item.id}>
                {item.language}
                {item.proficiency ? ` (${item.proficiency})` : ""}
              </span>
            ))}
          </div>
        </section>
      )}

      {resume.keyAchievements.length > 0 && (
        <section className="mt-6">
          <SectionTitle>Key Achievements</SectionTitle>
          <ul className="space-y-2 text-xs text-slate-700">
            {resume.keyAchievements.map((item) => (
              <li key={item.id}>
                <span className="font-medium text-slate-900">{item.title}</span>
                {item.description && (
                  <span className="text-slate-600"> — {item.description}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {resume.interests.length > 0 && (
        <section className="mt-6">
          <SectionTitle>Interests</SectionTitle>
          <p className="text-xs text-slate-700">{resume.interests.join(", ")}</p>
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section className="mt-6">
          <SectionTitle>Certifications</SectionTitle>
          <ul className="space-y-2">
            {resume.certifications.map((item) => (
              <li key={item.id} className="text-xs text-slate-700">
                <span className="font-medium text-slate-900">{item.name}</span>
                {item.issuer && <span className="text-slate-500"> — {item.issuer}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}
      {filledOptionalFields.length > 0 && (
        <section className="mt-6">
          <SectionTitle>Additional Information</SectionTitle>
          <div className="grid gap-1 text-xs text-slate-700 sm:grid-cols-2">
            {filledOptionalFields.map(([key, value]) => (
              <p key={key}>
                <span className="font-medium text-slate-900">
                  {OPTIONAL_FIELD_LABELS[key]}:
                </span>{" "}
                {value}
              </p>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-800">
        {children}
      </h2>
      <Separator className="mt-1 bg-slate-300" />
    </div>
  );
}
