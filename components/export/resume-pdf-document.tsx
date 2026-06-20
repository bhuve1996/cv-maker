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
  formatExperienceHeader,
  formatYearsOfExperienceLine,
  getTopLevelCertificationNames,
  getVisibleJobCertifications,
  getVisibleSummaryAchievements,
} from "@/lib/export/resume-display";
import { buildPdfStyles } from "@/lib/export/resume-pdf-styles";
import { resolveResumeTheme } from "@/lib/export/resume-theme";
import { OPTIONAL_FIELD_LABELS } from "@/lib/resume/optional-fields";
import {
  groupSkillsByCategory,
  SKILL_CATEGORY_LABELS,
} from "@/lib/resume/skill-categories";
import type { Resume, SkillCategory } from "@/types/resume";
import { DEFAULT_RESUME_STYLE } from "@/types/resume-style";
import type { ResumeStyle } from "@/types/resume-style";

Font.registerHyphenationCallback((word) => [word]);

interface ResumePdfDocumentProps {
  resume: Resume;
  style?: ResumeStyle;
}

function createSectionTitle(
  pdfStyles: ReturnType<typeof buildPdfStyles>,
  filled: boolean,
) {
  return function SectionTitle({ children }: { children: string }) {
    if (filled) {
      return (
        <View style={pdfStyles.sectionTitleWrap} minPresenceAhead={72} wrap={false}>
          <Text style={pdfStyles.sectionTitle}>{children}</Text>
        </View>
      );
    }

    return (
      <View minPresenceAhead={72} wrap={false}>
        <Text style={pdfStyles.sectionTitle}>{children}</Text>
        <View style={pdfStyles.sectionRule} />
      </View>
    );
  };
}

function ContactLine({
  items,
  style,
}: {
  items: LabeledContactItem[];
  style: ReturnType<typeof buildPdfStyles>;
}) {
  if (items.length === 0) return null;

  return (
    <Text style={style.contactItem}>
      {items.map(({ label, value }) => `${label}: ${value}`).join(" · ")}
    </Text>
  );
}

function BulletList({
  items,
  pdfStyles,
}: {
  items: string[];
  pdfStyles: ReturnType<typeof buildPdfStyles>;
}) {
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

function SkillsSection({
  resume,
  pdfStyles,
  SectionTitle,
}: {
  resume: Resume;
  pdfStyles: ReturnType<typeof buildPdfStyles>;
  SectionTitle: ReturnType<typeof createSectionTitle>;
}) {
  const skillGroups = groupSkillsByCategory(resume.skills);
  const entries = Object.entries(skillGroups);
  if (entries.length === 0) return null;

  const [firstEntry, ...restEntries] = entries;

  return (
    <View style={pdfStyles.section}>
      <View wrap={false}>
        <SectionTitle>Skills</SectionTitle>
        <View style={pdfStyles.skillRow}>
          <Text style={pdfStyles.skillCategory} wrap={false}>
            {PDF_SKILL_CATEGORY_LABELS[firstEntry[0] as SkillCategory]}:
          </Text>
          <Text style={pdfStyles.skillItems} hyphenationCallback={(word) => [word]}>
            {firstEntry[1]?.map((skill) => skill.name).join(", ")}
          </Text>
        </View>
      </View>
      {restEntries.map(([category, items]) => (
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

function ExperienceHeaderBlock({
  header,
  companyDescription,
  pdfStyles,
}: {
  header: ReturnType<typeof formatExperienceHeader>;
  companyDescription?: string;
  pdfStyles: ReturnType<typeof buildPdfStyles>;
}) {
  if (header.useSideDates) {
    return (
      <View style={pdfStyles.row} wrap={false}>
        <View style={pdfStyles.rowMain}>
          <Text style={pdfStyles.entryTitle}>{header.primaryLine}</Text>
          {header.secondaryLine ? (
            <Text style={pdfStyles.experienceSecondary}>{header.secondaryLine}</Text>
          ) : null}
          {companyDescription ? (
            <Text style={pdfStyles.experienceMeta}>{companyDescription}</Text>
          ) : null}
        </View>
        {header.datesLine ? (
          <Text style={pdfStyles.subtle}>{header.datesLine}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={pdfStyles.experienceHeader} wrap={false}>
      <Text>
        <Text style={pdfStyles.experiencePrimary}>{header.primaryLine}</Text>
        {header.secondaryLine ? (
          <>
            {"\n"}
            <Text style={pdfStyles.experienceSecondary}>{header.secondaryLine}</Text>
          </>
        ) : null}
        {companyDescription ? (
          <>
            {"\n"}
            <Text style={pdfStyles.experienceMeta}>{companyDescription}</Text>
          </>
        ) : null}
      </Text>
    </View>
  );
}

export function ResumePdfDocument({
  resume,
  style = DEFAULT_RESUME_STYLE,
}: ResumePdfDocumentProps) {
  const theme = resolveResumeTheme(style);
  const pdfStyles = buildPdfStyles(style);
  const sectionTitleFilled = theme.sectionHeaderStyle !== "rule";
  const SectionTitle = createSectionTitle(pdfStyles, sectionTitleFilled);
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
          <ContactLine items={contactGroups.primary} style={pdfStyles} />
          {contactGroups.secondary.length > 0 ? (
            <View style={pdfStyles.contactRow}>
              <ContactLine items={contactGroups.secondary} style={pdfStyles} />
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
                pdfStyles={pdfStyles}
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
              const header = formatExperienceHeader(item, style.experienceLayout);

              return (
                <View
                  key={item.id}
                  style={[
                    pdfStyles.companyItem,
                    index === experienceCount - 1 ? pdfStyles.companyItemLast : {},
                  ]}
                >
                  <ExperienceHeaderBlock
                    header={header}
                    companyDescription={item.companyDescription}
                    pdfStyles={pdfStyles}
                  />
                  {item.projects.length > 0 ? (
                    <View style={pdfStyles.projectsList}>
                      {item.projects.map((project, projectIndex) => (
                        <View
                          key={project.id || `${item.id}-project-${projectIndex}`}
                          wrap={false}
                          style={pdfStyles.projectItem}
                        >
                          <Text style={pdfStyles.projectLabel}>
                            {project.client}
                            {project.industry ? ` (${project.industry})` : ""}
                          </Text>
                          {project.responsibilities.length > 0 ? (
                            <BulletList
                              items={project.responsibilities.slice(0, 3)}
                              pdfStyles={pdfStyles}
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
                      pdfStyles={pdfStyles}
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
                      pdfStyles={pdfStyles}
                    />
                  ) : null}
                  {item.description && item.projects.length === 0 ? (
                    <View wrap={false} style={[pdfStyles.projectsList, { marginTop: 3 }]}>
                      <Text style={pdfStyles.body}>{stripHtml(item.description)}</Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        <SkillsSection resume={resume} pdfStyles={pdfStyles} SectionTitle={SectionTitle} />

        {resume.education.length > 0 ? (
          <View style={pdfStyles.sectionCompact}>
            <SectionTitle>Education</SectionTitle>
            {resume.education.map((item) => (
              <View key={item.id} wrap={false} style={[pdfStyles.row, { marginBottom: 4 }]}>
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
          <View style={pdfStyles.sectionCompact} wrap={false}>
            <SectionTitle>Certifications</SectionTitle>
            <BulletList
              items={resume.certifications.map(
                (item) =>
                  `${item.name}${item.issuer ? ` — ${item.issuer}` : ""}`,
              )}
              pdfStyles={pdfStyles}
            />
          </View>
        ) : null}

        {resume.projects.length > 0 ? (
          <View style={pdfStyles.sectionCompact} wrap={false}>
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
          <View style={pdfStyles.sectionCompact} wrap={false}>
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
          <View style={pdfStyles.sectionCompact} wrap={false}>
            <SectionTitle>Key Achievements</SectionTitle>
            <BulletList
              items={resume.keyAchievements.map(
                (item) =>
                  `${item.title}${item.description ? ` — ${item.description}` : ""}`,
              )}
              pdfStyles={pdfStyles}
            />
          </View>
        ) : null}

        {resume.interests.length > 0 ? (
          <View style={pdfStyles.sectionCompact} wrap={false}>
            <SectionTitle>Interests</SectionTitle>
            <Text style={pdfStyles.body}>{resume.interests.join(", ")}</Text>
          </View>
        ) : null}

        {filledOptionalFields.length > 0 ? (
          <View style={pdfStyles.sectionCompact} wrap={false}>
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
