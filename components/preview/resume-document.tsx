"use client";

import {
  buildResumeDocumentStyles,
  RESUME_DOCUMENT_WIDTH_PX,
} from "@/lib/export/resume-document-styles";
import {
  getContactLineGroups,
  getFilledOptionalFields,
  stripHtml,
} from "@/lib/export/resume-content";
import {
  formatExperienceHeader,
  formatYearsOfExperienceLine,
  getTopLevelCertificationNames,
  getVisibleJobCertifications,
  getVisibleSummaryAchievements,
} from "@/lib/export/resume-display";
import { resolveResumeTheme } from "@/lib/export/resume-theme";
import {
  groupSkillsByCategory,
  SKILL_CATEGORY_LABELS,
} from "@/lib/resume/skill-categories";
import type { Resume, SkillCategory } from "@/types/resume";
import { DEFAULT_RESUME_STYLE } from "@/types/resume-style";
import type { ResumeStyle } from "@/types/resume-style";
import { OPTIONAL_FIELD_LABELS } from "@/lib/resume/optional-fields";

interface ResumeDocumentProps {
  resume: Resume;
  style?: ResumeStyle;
  id?: string;
}

function HtmlContent({ html }: { html: string }) {
  if (!html) return null;
  return (
    <div className="rd-body rd-html" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

function SectionTitle({
  children,
  filled,
}: {
  children: React.ReactNode;
  filled: boolean;
}) {
  return (
    <div className={filled ? "rd-section-title-filled" : "rd-section-title"}>
      <h2>{children}</h2>
      <div className="rd-separator" />
    </div>
  );
}

export function ResumeDocument({
  resume,
  style = DEFAULT_RESUME_STYLE,
  id = "resume-preview",
}: ResumeDocumentProps) {
  const theme = resolveResumeTheme(style);
  const documentStyles = buildResumeDocumentStyles(style);
  const sectionTitleFilled = theme.sectionHeaderStyle !== "rule";
  const { personalInfo, professionalSummary } = resume;
  const contactGroups = getContactLineGroups(resume);
  const skillGroups = groupSkillsByCategory(resume.skills);
  const filledOptionalFields = getFilledOptionalFields(resume.optionalFields);
  const experienceCount = resume.experience.length;
  const summaryAchievements = getVisibleSummaryAchievements(professionalSummary);
  const topLevelCertNames = getTopLevelCertificationNames(resume);
  const experienceLine = formatYearsOfExperienceLine(
    professionalSummary.yearsOfExperience,
    professionalSummary.designation,
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: documentStyles }} />
      <article
        id={id}
        className="resume-document"
        style={{ width: RESUME_DOCUMENT_WIDTH_PX }}
      >
        <header className="rd-header">
          <div className="rd-identity">
            <h1>{personalInfo.fullName || "Your Name"}</h1>
            {personalInfo.currentTitle && (
              <p className="rd-title">{personalInfo.currentTitle}</p>
            )}
            {personalInfo.specialization.length > 0 && (
              <p className="rd-specialization">
                {personalInfo.specialization.join(" · ")}
              </p>
            )}
          </div>
          {(contactGroups.primary.length > 0 || contactGroups.secondary.length > 0) && (
            <div className="rd-contact-block">
              {contactGroups.primary.length > 0 && (
                <p className="rd-contact">
                  {contactGroups.primary
                    .map(({ label, value }) => `${label}: ${value}`)
                    .join(" · ")}
                </p>
              )}
              {contactGroups.secondary.length > 0 && (
                <p className="rd-contact">
                  {contactGroups.secondary
                    .map(({ label, value }) => `${label}: ${value}`)
                    .join(" · ")}
                </p>
              )}
            </div>
          )}
        </header>

        {professionalSummary.text && (
          <section className="rd-section">
            <SectionTitle filled={sectionTitleFilled}>Professional Summary</SectionTitle>
            {experienceLine && (
              <p className="rd-muted" style={{ marginBottom: 4 }}>
                {experienceLine}
              </p>
            )}
            <HtmlContent html={professionalSummary.text} />
            {summaryAchievements.length > 0 && (
              <ul className="rd-body" style={{ marginTop: 4 }}>
                {summaryAchievements.map((item, index) => (
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
            <SectionTitle filled={sectionTitleFilled}>Work Experience</SectionTitle>
            <div className="rd-stack">
              {resume.experience.map((item, index) => {
                const visibleJobCerts = getVisibleJobCertifications(
                  item.certifications,
                  topLevelCertNames,
                );
                const header = formatExperienceHeader(item, style.experienceLayout);

                return (
                <div
                  key={item.id}
                  className={`rd-company-item${
                    index === experienceCount - 1 ? " rd-company-item-last" : ""
                  }`}
                >
                  <div className="rd-company-header">
                    <div className={header.useSideDates ? "rd-row" : "rd-stack"}>
                      <div>
                        <h3>{header.primaryLine}</h3>
                        {header.secondaryLine && (
                          <p className="rd-muted">
                            {style.experienceLayout === "standard" && item.company ? (
                              <>
                                <strong>{item.company}</strong>
                                {item.location ? ` · ${item.location}` : ""}
                              </>
                            ) : (
                              header.secondaryLine
                            )}
                          </p>
                        )}
                        {item.companyDescription && (
                          <p className="rd-faint rd-small">{item.companyDescription}</p>
                        )}
                      </div>
                      {header.useSideDates && header.datesLine && (
                        <p className="rd-subtle">{header.datesLine}</p>
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
                              {project.responsibilities.slice(0, 3).map((task, idx) => (
                                <li key={`${project.id}-resp-${idx}`}>{task}</li>
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
                  {visibleJobCerts.length > 0 && (
                    <ul className="rd-body rd-small" style={{ marginTop: 4 }}>
                      {visibleJobCerts.map((cert, certIndex) => (
                        <li key={cert.id ?? `${item.id}-cert-${certIndex}`}>
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
                      {item.achievements.map((achievement, achIndex) => (
                        <li key={achievement.id ?? `${item.id}-ach-${achIndex}`}>
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
                );
              })}
            </div>
          </section>
        )}

        {Object.keys(skillGroups).length > 0 && (
          <section className="rd-section">
            <SectionTitle filled={sectionTitleFilled}>Skills</SectionTitle>
            <div className="rd-skills-list">
              {Object.entries(skillGroups).map(([category, items]) => (
                <div key={category} className="rd-skill-row">
                  <span className="rd-skill-category">
                    {SKILL_CATEGORY_LABELS[category as SkillCategory]}:
                  </span>
                  <span className="rd-skill-items">
                    {items?.map((skill) => skill.name).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.education.length > 0 && (
          <section className="rd-section">
            <SectionTitle filled={sectionTitleFilled}>Education</SectionTitle>
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

        {resume.certifications.length > 0 && (
          <section className="rd-section">
            <SectionTitle filled={sectionTitleFilled}>Certifications</SectionTitle>
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

        {resume.projects.length > 0 && (
          <section className="rd-section">
            <SectionTitle filled={sectionTitleFilled}>Projects</SectionTitle>
            <div className="rd-stack-sm">
              {resume.projects.map((item, index) => (
                <div key={item.id ?? `project-${index}`}>
                  <h3>{item.name}</h3>
                  {item.description && (
                    <p className="rd-body">{stripHtml(item.description)}</p>
                  )}
                  {item.technologies && (
                    <p className="rd-faint rd-small">{item.technologies}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {resume.spokenLanguages.length > 0 && (
          <section className="rd-section">
            <SectionTitle filled={sectionTitleFilled}>Languages</SectionTitle>
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
            <SectionTitle filled={sectionTitleFilled}>Key Achievements</SectionTitle>
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
            <SectionTitle filled={sectionTitleFilled}>Interests</SectionTitle>
            <p className="rd-body">{resume.interests.join(", ")}</p>
          </section>
        )}

        {filledOptionalFields.length > 0 && (
          <section className="rd-section">
            <SectionTitle filled={sectionTitleFilled}>Additional Information</SectionTitle>
            <div className="rd-body rd-optional-list">
              {filledOptionalFields.map(([key, value]) => (
                <p key={key} className="rd-optional-row">
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
