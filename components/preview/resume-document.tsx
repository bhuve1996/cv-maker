"use client";

import {
  RESUME_DOCUMENT_FONT_LINK,
  RESUME_DOCUMENT_STYLES,
  RESUME_DOCUMENT_WIDTH_PX,
} from "@/lib/export/resume-document-styles";
import { OPTIONAL_FIELD_LABELS } from "@/lib/resume/optional-fields";
import {
  groupSkillsByCategory,
  SKILL_CATEGORY_LABELS,
} from "@/lib/resume/skill-categories";
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
  ]
    .filter(Boolean)
    .map(formatContactValue);

  const skillGroups = groupSkillsByCategory(resume.skills);

  const filledOptionalFields = (
    Object.entries(resume.optionalFields) as Array<[keyof OptionalFields, string]>
  ).filter(([, value]) => value.trim());

  return (
    <>
      <link rel="stylesheet" href={RESUME_DOCUMENT_FONT_LINK} />
      <style dangerouslySetInnerHTML={{ __html: RESUME_DOCUMENT_STYLES }} />
      <article
        id={id}
        className="resume-document"
        style={{ width: RESUME_DOCUMENT_WIDTH_PX }}
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
            <p className="rd-contact">{contactItems.join(" · ")}</p>
          )}
        </header>

        {professionalSummary.text && (
          <section className="rd-section">
            <SectionTitle>Summary</SectionTitle>
            {professionalSummary.yearsOfExperience && (
              <p className="rd-muted" style={{ marginBottom: 4 }}>
                {professionalSummary.yearsOfExperience} years of experience
                {professionalSummary.designation
                  ? ` · ${professionalSummary.designation}`
                  : ""}
              </p>
            )}
            <HtmlContent html={professionalSummary.text} />
            {professionalSummary.achievements.length > 0 && (
              <ul className="rd-body" style={{ marginTop: 4 }}>
                {professionalSummary.achievements.map((item, index) => (
                  <li key={item.id ?? `summary-achievement-${index}`}>
                    {item.description}
                    {item.impact ? (
                      <span className="rd-muted"> — {item.impact}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            {professionalSummary.coreExpertise.length > 0 && (
              <p className="rd-inline-list" style={{ marginTop: 4 }}>
                {professionalSummary.coreExpertise.join(", ")}
              </p>
            )}
          </section>
        )}

        {resume.experience.length > 0 && (
          <section className="rd-section">
            <SectionTitle>Experience</SectionTitle>
            <div className="rd-stack">
              {resume.experience.map((item) => (
                <div key={item.id} className="rd-company-item">
                  <div className="rd-company-header">
                    <div className="rd-row">
                      <div>
                        <h3>{item.role}</h3>
                        <p className="rd-muted">
                          <strong>{item.company}</strong>
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
                  </div>
                  {item.projects.length > 0 && (
                    <div className="rd-projects-list rd-stack-sm">
                      {item.projects.map((project, projectIndex) => (
                        <div
                          key={project.id || `${item.id}-project-${projectIndex}`}
                          className="rd-body rd-project-item"
                        >
                          <p className="rd-project-label">
                            <strong>{project.client}</strong>
                            {project.industry ? ` (${project.industry})` : ""}
                          </p>
                          {project.responsibilities.length > 0 && (
                            <ul>
                              {project.responsibilities.slice(0, 3).map((task, index) => (
                                <li key={`${project.id}-resp-${index}`}>{task}</li>
                              ))}
                            </ul>
                          )}
                          {project.technologies.length > 0 && (
                            <p className="rd-faint rd-small" style={{ marginTop: 2 }}>
                              {project.technologies.join(", ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {item.certifications.length > 0 && (
                    <ul className="rd-body rd-small" style={{ marginTop: 4 }}>
                      {item.certifications.map((cert, index) => (
                        <li key={cert.id ?? `${item.id}-cert-${index}`}>
                          <strong>{cert.name}</strong>
                          {cert.status ? (
                            <span className="rd-muted"> — {cert.status}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.achievements.length > 0 && (
                    <ul className="rd-body rd-small" style={{ marginTop: 4 }}>
                      {item.achievements.map((achievement, index) => (
                        <li key={achievement.id ?? `${item.id}-ach-${index}`}>
                          {achievement.description}
                          {achievement.impact ? (
                            <span className="rd-muted"> — {achievement.impact}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.description && item.projects.length === 0 && (
                    <div className="rd-projects-list" style={{ marginTop: 4 }}>
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
            <div className="rd-skills-grid">
              {Object.entries(skillGroups).map(([category, items]) => (
                <div key={category} className="rd-skill-row">
                  <span className="rd-skill-category">
                    {SKILL_CATEGORY_LABELS[category as SkillCategory]}
                  </span>
                  <span className="rd-skill-items">
                    {items?.map((skill) => skill.name).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.spokenLanguages.length > 0 && (
          <section className="rd-section">
            <SectionTitle>Languages</SectionTitle>
            <p className="rd-inline-list">
              {resume.spokenLanguages
                .map((item) =>
                  item.proficiency
                    ? `${item.language} (${item.proficiency})`
                    : item.language,
                )
                .join(" · ")}
            </p>
          </section>
        )}

        {resume.keyAchievements.length > 0 && (
          <section className="rd-section">
            <SectionTitle>Key Achievements</SectionTitle>
            <ul className="rd-body">
              {resume.keyAchievements.map((item, index) => (
                <li key={item.id ?? `achievement-${index}`}>
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
              {resume.certifications.map((item, index) => (
                <li key={item.id ?? `cert-${index}`}>
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
