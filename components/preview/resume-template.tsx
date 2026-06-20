"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Resume } from "@/types/resume";
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
  const { personalInfo } = resume;
  const technicalSkills = resume.skills.filter((s) => s.category === "technical");
  const softSkills = resume.skills.filter((s) => s.category === "soft");

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedIn,
    personalInfo.website,
  ].filter(Boolean);

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
        {contactItems.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
            {contactItems.map((item) => (
              <span key={item}>{formatContactValue(item)}</span>
            ))}
          </div>
        )}
      </header>

      {resume.summary && (
        <section className="mt-6">
          <SectionTitle>Summary</SectionTitle>
          <HtmlContent html={resume.summary} />
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
                    <p className="text-xs text-slate-600">{item.company}</p>
                  </div>
                  {(item.startDate || item.endDate) && (
                    <p className="text-xs text-slate-500">
                      {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                    </p>
                  )}
                </div>
                {item.description && (
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
                  <p className="text-xs text-slate-600">{item.institution}</p>
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

      {(technicalSkills.length > 0 || softSkills.length > 0) && (
        <section className="mt-6">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-3">
            {technicalSkills.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Technical
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {technicalSkills.map((skill) => (
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
            )}
            {softSkills.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                  Soft Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {softSkills.map((skill) => (
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
            )}
          </div>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mt-6">
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-4">
            {resume.projects.map((item) => (
              <div key={item.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
                  {item.technologies && (
                    <p className="text-xs text-slate-500">{item.technologies}</p>
                  )}
                </div>
                {item.description && (
                  <div className="mt-1">
                    <HtmlContent html={item.description} />
                  </div>
                )}
              </div>
            ))}
          </div>
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
