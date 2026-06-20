import {
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import {
  getFilledOptionalFields,
  getLabeledContactItems,
  stripHtml,
} from "@/lib/export/resume-content";
import { pdfStyles } from "@/lib/export/resume-pdf-styles";
import { OPTIONAL_FIELD_LABELS } from "@/lib/resume/optional-fields";
import {
  groupSkillsByCategory,
  SKILL_CATEGORY_LABELS,
} from "@/lib/resume/skill-categories";
import type { Resume, SkillCategory } from "@/types/resume";

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

function BulletList({ items }: { items: string[] }) {
  return (
    <View style={{ marginTop: 4 }}>
      {items.map((item, index) => (
        <View key={`bullet-${index}`} style={pdfStyles.bulletItem}>
          <Text style={pdfStyles.bulletDot}>•</Text>
          <Text style={pdfStyles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function ResumePdfDocument({ resume }: ResumePdfDocumentProps) {
  const { personalInfo, professionalSummary } = resume;
  const contactItems = getLabeledContactItems(resume);
  const skillGroups = groupSkillsByCategory(resume.skills);
  const filledOptionalFields = getFilledOptionalFields(resume.optionalFields);
  const experienceCount = resume.experience.length;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
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
          {contactItems.length > 0 ? (
            <Text style={pdfStyles.contact}>
              {contactItems
                .map(({ label, value }) => `${label}: ${value}`)
                .join(" · ")}
            </Text>
          ) : null}
        </View>

        {professionalSummary.text ? (
          <View style={pdfStyles.section}>
            <SectionTitle>Professional Summary</SectionTitle>
            {professionalSummary.yearsOfExperience ? (
              <Text style={[pdfStyles.body, pdfStyles.muted, { marginBottom: 4 }]}>
                {professionalSummary.yearsOfExperience} years of experience
                {professionalSummary.designation
                  ? ` · ${professionalSummary.designation}`
                  : ""}
              </Text>
            ) : null}
            <Text style={pdfStyles.body}>{stripHtml(professionalSummary.text)}</Text>
            {professionalSummary.achievements.length > 0 ? (
              <BulletList
                items={professionalSummary.achievements.map(
                  (item) =>
                    `${item.description}${item.impact ? ` — ${item.impact}` : ""}`,
                )}
              />
            ) : null}
            {professionalSummary.coreExpertise.length > 0 ? (
              <Text style={[pdfStyles.body, { marginTop: 4 }]}>
                {professionalSummary.coreExpertise.join(", ")}
              </Text>
            ) : null}
          </View>
        ) : null}

        {Object.keys(skillGroups).length > 0 ? (
          <View style={pdfStyles.section}>
            <SectionTitle>Skills</SectionTitle>
            {Object.entries(skillGroups).map(([category, items]) => (
              <View key={category} style={pdfStyles.skillRow}>
                <Text style={pdfStyles.skillCategory}>
                  {SKILL_CATEGORY_LABELS[category as SkillCategory]}:
                </Text>
                <Text style={pdfStyles.skillItems}>
                  {items?.map((skill) => skill.name).join(", ")}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {resume.experience.length > 0 ? (
          <View style={pdfStyles.section}>
            <SectionTitle>Work Experience</SectionTitle>
            {resume.experience.map((item, index) => (
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
                        style={{ marginBottom: 6 }}
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
                {item.certifications.length > 0 ? (
                  <BulletList
                    items={item.certifications.map(
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
                  <View style={[pdfStyles.projectsList, { marginTop: 4 }]}>
                    <Text style={pdfStyles.body}>{stripHtml(item.description)}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {resume.education.length > 0 ? (
          <View style={pdfStyles.section}>
            <SectionTitle>Education</SectionTitle>
            {resume.education.map((item) => (
              <View key={item.id} style={[pdfStyles.row, { marginBottom: 6 }]}>
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
          <View style={pdfStyles.section}>
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
          <View style={pdfStyles.section}>
            <SectionTitle>Projects</SectionTitle>
            {resume.projects.map((item, index) => (
              <View key={item.id ?? `project-${index}`} style={{ marginBottom: 6 }}>
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
          <View style={pdfStyles.section}>
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
          <View style={pdfStyles.section}>
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
          <View style={pdfStyles.section}>
            <SectionTitle>Interests</SectionTitle>
            <Text style={pdfStyles.body}>{resume.interests.join(", ")}</Text>
          </View>
        ) : null}

        {filledOptionalFields.length > 0 ? (
          <View style={pdfStyles.section}>
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
