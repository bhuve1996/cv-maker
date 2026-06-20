import {
  Document,
  Font,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  getContactLineGroups,
  getFilledOptionalFields,
  stripHtml,
  type LabeledContactItem,
} from "@/lib/export/resume-content";
import {
  formatYearsOfExperienceLine,
  getTopLevelCertificationNames,
  getVisibleJobCertifications,
  getVisibleSummaryAchievements,
} from "@/lib/export/resume-display";
import { pdfStyles } from "@/lib/export/resume-pdf-styles";
import { OPTIONAL_FIELD_LABELS } from "@/lib/resume/optional-fields";
import {
  groupSkillsByCategory,
  SKILL_CATEGORY_LABELS,
} from "@/lib/resume/skill-categories";
import type { Resume, SkillCategory } from "@/types/resume";

Font.registerHyphenationCallback((word) => [word]);

interface ResumePdfDocumentProps {
  resume: Resume;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <View>
      <Text style={pdfStyles.sectionTitle}>{children}</Text>
      <View style={pdfStyles.sectionRule} />
    </View>
  );
}

function ContactLine({ items }: { items: LabeledContactItem[] }) {
  if (items.length === 0) return null;

  return (
    <Text style={pdfStyles.contactItem}>
      {items.map(({ label, value }) => `${label}: ${value}`).join(" · ")}
    </Text>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={{ marginTop: 3 }}>
      {items.map((item, index) => (
        <View key={`bullet-${index}`} style={pdfStyles.bulletItem}>
          <Text style={pdfStyles.bulletDot}>•</Text>
          <Text style={pdfStyles.bulletText} hyphenationCallback={(word) => [word]}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

const PDF_SKILL_CATEGORY_LABELS = SKILL_CATEGORY_LABELS;

function SkillsSection({ resume }: { resume: Resume }) {
  const skillGroups = groupSkillsByCategory(resume.skills);
  const entries = Object.entries(skillGroups);
  if (entries.length === 0) return null;

  return (
    <View style={pdfStyles.section}>
      <SectionTitle>Skills</SectionTitle>
      {entries.map(([category, items]) => (
        <View key={category} style={pdfStyles.skillRow}>
          <Text style={pdfStyles.skillCategory} wrap={false}>
            {PDF_SKILL_CATEGORY_LABELS[category as SkillCategory]}:
          </Text>
          <Text style={pdfStyles.skillItems} hyphenationCallback={(word) => [word]}>
            {items?.map((skill) => skill.name).join(", ")}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function ResumePdfDocument({ resume }: ResumePdfDocumentProps) {
  const { personalInfo, professionalSummary } = resume;
  const contactGroups = getContactLineGroups(resume);
  const filledOptionalFields = getFilledOptionalFields(resume.optionalFields);
  const experienceCount = resume.experience.length;
  const summaryAchievements = getVisibleSummaryAchievements(professionalSummary);
  const topLevelCertNames = getTopLevelCertificationNames(resume);
  const experienceLine = formatYearsOfExperienceLine(
    professionalSummary.yearsOfExperience,
    professionalSummary.designation,
  );

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <View style={pdfStyles.headerIdentity}>
            <Text style={pdfStyles.name}>
              {personalInfo.fullName || "Your Name"}
            </Text>
            {personalInfo.currentTitle ? (
              <Text style={pdfStyles.title}>{personalInfo.currentTitle}</Text>
            ) : null}
            {personalInfo.specialization.length > 0 ? (
              <Text style={pdfStyles.specialization}>
                {personalInfo.specialization.join(" · ")}
              </Text>
            ) : null}
          </View>
          <ContactLine items={contactGroups.primary} />
          {contactGroups.secondary.length > 0 ? (
            <View style={pdfStyles.contactRow}>
              <ContactLine items={contactGroups.secondary} />
            </View>
          ) : null}
        </View>

        {professionalSummary.text ? (
          <View style={pdfStyles.section}>
            <SectionTitle>Professional Summary</SectionTitle>
            {experienceLine ? (
              <Text style={[pdfStyles.body, pdfStyles.muted, { marginBottom: 3 }]}>
                {experienceLine}
              </Text>
            ) : null}
            <Text style={pdfStyles.body} hyphenationCallback={(word) => [word]}>
              {stripHtml(professionalSummary.text)}
            </Text>
            {summaryAchievements.length > 0 ? (
              <BulletList
                items={summaryAchievements.map(
                  (item) =>
                    `${item.description}${item.impact ? ` — ${item.impact}` : ""}`,
                )}
              />
            ) : null}
            {professionalSummary.coreExpertise.length > 0 ? (
              <Text style={[pdfStyles.body, { marginTop: 3 }]}>
                {professionalSummary.coreExpertise.join(", ")}
              </Text>
            ) : null}
          </View>
        ) : null}

        {resume.experience.length > 0 ? (
          <View style={pdfStyles.section}>
            <SectionTitle>Work Experience</SectionTitle>
            {resume.experience.map((item, index) => {
              const visibleJobCerts = getVisibleJobCertifications(
                item.certifications,
                topLevelCertNames,
              );

              return (
                <View
                  key={item.id}
                  style={[
                    pdfStyles.companyItem,
                    index === experienceCount - 1 ? pdfStyles.companyItemLast : {},
                  ]}
                >
                  <View style={pdfStyles.row}>
                    <View style={pdfStyles.rowMain}>
                      <Text style={pdfStyles.entryTitle}>{item.role}</Text>
                      <Text style={pdfStyles.muted}>
                        {item.company}
                        {item.location ? ` · ${item.location}` : ""}
                      </Text>
                      {item.companyDescription ? (
                        <Text style={pdfStyles.faint}>{item.companyDescription}</Text>
                      ) : null}
                    </View>
                    {item.startDate || item.endDate ? (
                      <Text style={pdfStyles.subtle}>
                        {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                      </Text>
                    ) : null}
                  </View>
                  {item.projects.length > 0 ? (
                    <View style={pdfStyles.projectsList}>
                      {item.projects.map((project, projectIndex) => (
                        <View
                          key={project.id || `${item.id}-project-${projectIndex}`}
                          style={{ marginBottom: 4 }}
                        >
                          <Text style={pdfStyles.body}>
                            {project.client}
                            {project.industry ? ` (${project.industry})` : ""}
                          </Text>
                          {project.responsibilities.length > 0 ? (
                            <BulletList
                              items={project.responsibilities.slice(0, 3)}
                            />
                          ) : null}
                          {project.technologies.length > 0 ? (
                            <Text style={pdfStyles.faint}>
                              {project.technologies.join(", ")}
                            </Text>
                          ) : null}
                        </View>
                      ))}
                    </View>
                  ) : null}
                  {visibleJobCerts.length > 0 ? (
                    <BulletList
                      items={visibleJobCerts.map(
                        (cert) =>
                          `${cert.name}${cert.status ? ` — ${cert.status}` : ""}`,
                      )}
                    />
                  ) : null}
                  {item.achievements.length > 0 ? (
                    <BulletList
                      items={item.achievements.map(
                        (achievement) =>
                          `${achievement.description}${
                            achievement.impact ? ` — ${achievement.impact}` : ""
                          }`,
                      )}
                    />
                  ) : null}
                  {item.description && item.projects.length === 0 ? (
                    <View style={[pdfStyles.projectsList, { marginTop: 3 }]}>
                      <Text style={pdfStyles.body}>{stripHtml(item.description)}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        <SkillsSection resume={resume} />

        {resume.education.length > 0 ? (
          <View style={pdfStyles.sectionCompact}>
            <SectionTitle>Education</SectionTitle>
            {resume.education.map((item) => (
              <View key={item.id} style={[pdfStyles.row, { marginBottom: 4 }]}>
                <View style={pdfStyles.rowMain}>
                  <Text style={pdfStyles.entryTitle}>{item.degree}</Text>
                  <Text style={pdfStyles.muted}>
                    {item.institution}
                    {item.board ? ` · ${item.board}` : ""}
                    {item.location ? ` · ${item.location}` : ""}
                  </Text>
                </View>
                {item.startDate || item.endDate ? (
                  <Text style={pdfStyles.subtle}>
                    {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {resume.certifications.length > 0 ? (
          <View style={pdfStyles.sectionCompact}>
            <SectionTitle>Certifications</SectionTitle>
            <BulletList
              items={resume.certifications.map(
                (item) =>
                  `${item.name}${item.issuer ? ` — ${item.issuer}` : ""}`,
              )}
            />
          </View>
        ) : null}

        {resume.projects.length > 0 ? (
          <View style={pdfStyles.sectionCompact}>
            <SectionTitle>Projects</SectionTitle>
            {resume.projects.map((item, index) => (
              <View key={item.id ?? `project-${index}`} style={{ marginBottom: 4 }}>
                <Text style={pdfStyles.entryTitle}>{item.name}</Text>
                {item.description ? (
                  <Text style={pdfStyles.body}>{stripHtml(item.description)}</Text>
                ) : null}
                {item.technologies ? (
                  <Text style={pdfStyles.faint}>{item.technologies}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {resume.spokenLanguages.length > 0 ? (
          <View style={pdfStyles.sectionCompact}>
            <SectionTitle>Languages</SectionTitle>
            <Text style={pdfStyles.body}>
              {resume.spokenLanguages
                .map((item) =>
                  item.proficiency
                    ? `${item.language} (${item.proficiency})`
                    : item.language,
                )
                .join(" · ")}
            </Text>
          </View>
        ) : null}

        {resume.keyAchievements.length > 0 ? (
          <View style={pdfStyles.sectionCompact}>
            <SectionTitle>Key Achievements</SectionTitle>
            <BulletList
              items={resume.keyAchievements.map(
                (item) =>
                  `${item.title}${item.description ? ` — ${item.description}` : ""}`,
              )}
            />
          </View>
        ) : null}

        {resume.interests.length > 0 ? (
          <View style={pdfStyles.sectionCompact}>
            <SectionTitle>Interests</SectionTitle>
            <Text style={pdfStyles.body}>{resume.interests.join(", ")}</Text>
          </View>
        ) : null}

        {filledOptionalFields.length > 0 ? (
          <View style={pdfStyles.sectionCompact}>
            <SectionTitle>Additional Information</SectionTitle>
            {filledOptionalFields.map(([key, value]) => (
              <Text key={key} style={[pdfStyles.body, pdfStyles.optionalRow]}>
                {OPTIONAL_FIELD_LABELS[key]}: {value}
              </Text>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
