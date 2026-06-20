"use client";

import {
  RESUME_DOCUMENT_HEIGHT_PX,
  RESUME_DOCUMENT_STYLES,
  RESUME_DOCUMENT_WIDTH_PX,
} from "@/lib/export/resume-document-styles";
import { OPTIONAL_FIELD_LABELS } from "@/lib/resume/optional-fields";
import { SKILL_CATEGORY_LABELS } from "@/lib/resume/skill-categories";
import type { OptionalFields, Resume, SkillCategory } from "@/types/resume";
import { formatLocation } from "@/types/resume";

interface ResumeDocumentProps {
  resume: Resume;
  id?: string;
}

function formatContactValue(value: string) {
  return value.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
}

function HtmlContent({ html }: { html: string }) {
  if (!html) return null;
  return (
    <div className="rd-body rd-html" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="rd-section-title">
      <h2>{children}</h2>
      <div className="rd-separator" />
    </div>
  );
}

export function ResumeDocument({ resume, id = "resume-preview" }: ResumeDocumentProps) {
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
    <>
      <style dangerouslySetInnerHTML={{ __html: RESUME_DOCUMENT_STYLES }} />
      <article
        id={id}
        className="resume-document"
        style={{
          width: RESUME_DOCUMENT_WIDTH_PX,
          minHeight: RESUME_DOCUMENT_HEIGHT_PX,
        }}
      >
        <header className="rd-header">
          <h1>{personalInfo.fullName || "Your Name"}</h1>
          {personalInfo.currentTitle && (
            <p className="rd-title">{personalInfo.currentTitle}</p>
          )}
          {personalInfo.specialization.length > 0 && (
            <p className="rd-specialization">
              {personalInfo.specialization.join(" · ")}
            </p>
          )}
          {contactItems.length > 0 && (
            <div className="rd-contact">
              {contactItems.map((item) => (
                <span key={item}>{formatContactValue(item)}</span>
              ))}
            </div>
          )}
        </header>

        {professionalSummary.text && (
          <section className="rd-section">
            <SectionTitle>Summary</SectionTitle>
            {professionalSummary.yearsOfExperience && (
              <p className="rd-muted" style={{ marginBottom: 8 }}>
                {professionalSummary.yearsOfExperience} years of experience
                {professionalSummary.designation
                  ? ` · ${professionalSummary.designation}`
                  : ""}
              </p>
            )}
            <HtmlContent html={professionalSummary.text} />
            {professionalSummary.coreExpertise.length > 0 && (
              <div className="rd-badges">
                {professionalSummary.coreExpertise.map((item) => (
                  <span key={item} className="rd-badge">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {resume.experience.length > 0 && (
          <section className="rd-section">
            <SectionTitle>Experience</SectionTitle>
            <div className="rd-stack">
              {resume.experience.map((item) => (
                <div key={item.id}>
                  <div className="rd-row">
                    <div>
                      <h3>{item.role}</h3>
                      <p className="rd-muted">
                        {item.company}
                        {item.location ? ` · ${item.location}` : ""}
                      </p>
                      {item.companyDescription && (
                        <p className="rd-faint rd-small">{item.companyDescription}</p>
                      )}
                    </div>
                    {(item.startDate || item.endDate) && (
                      <p className="rd-subtle">
                        {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                      </p>
                    )}
                  </div>
                  {item.projects.length > 0 && (
                    <div className="rd-stack-sm" style={{ marginTop: 8 }}>
                      {item.projects.map((project) => (
                        <div key={project.id} className="rd-body">
                          <p>
                            <strong>{project.client}</strong>
                            {project.industry ? ` (${project.industry})` : ""}
                          </p>
                          {project.responsibilities.length > 0 && (
                            <ul>
                              {project.responsibilities.slice(0, 4).map((task) => (
                                <li key={task}>{task}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {item.description && item.projects.length === 0 && (
                    <div style={{ marginTop: 4 }}>
                      <HtmlContent html={item.description} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.education.length > 0 && (
          <section className="rd-section">
            <SectionTitle>Education</SectionTitle>
            <div className="rd-stack-sm">
              {resume.education.map((item) => (
                <div key={item.id} className="rd-row">
                  <div>
                    <h3>{item.degree}</h3>
                    <p className="rd-muted">
                      {item.institution}
                      {item.board ? ` · ${item.board}` : ""}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                  </div>
                  {(item.startDate || item.endDate) && (
                    <p className="rd-subtle">
                      {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {Object.keys(skillGroups).length > 0 && (
          <section className="rd-section">
            <SectionTitle>Skills</SectionTitle>
            <div className="rd-stack-sm">
              {Object.entries(skillGroups).map(([category, items]) => (
                <div key={category}>
                  <p className="rd-category-label">
                    {SKILL_CATEGORY_LABELS[category as SkillCategory]}
                  </p>
                  <div className="rd-badges">
                    {items?.map((skill) => (
                      <span key={skill.id} className="rd-badge">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.spokenLanguages.length > 0 && (
          <section className="rd-section">
            <SectionTitle>Languages</SectionTitle>
            <div className="rd-contact">
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
          <section className="rd-section">
            <SectionTitle>Key Achievements</SectionTitle>
            <ul className="rd-body">
              {resume.keyAchievements.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  {item.description && (
                    <span className="rd-muted"> — {item.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {resume.interests.length > 0 && (
          <section className="rd-section">
            <SectionTitle>Interests</SectionTitle>
            <p className="rd-body">{resume.interests.join(", ")}</p>
          </section>
        )}

        {resume.certifications.length > 0 && (
          <section className="rd-section">
            <SectionTitle>Certifications</SectionTitle>
            <ul className="rd-body">
              {resume.certifications.map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong>
                  {item.issuer && <span className="rd-muted"> — {item.issuer}</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {filledOptionalFields.length > 0 && (
          <section className="rd-section">
            <SectionTitle>Additional Information</SectionTitle>
            <div className="rd-grid-2 rd-body">
              {filledOptionalFields.map(([key, value]) => (
                <p key={key}>
                  <strong>{OPTIONAL_FIELD_LABELS[key]}:</strong> {value}
                </p>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
