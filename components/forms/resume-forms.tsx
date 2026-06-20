"use client";

import {
  Award,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Languages,
  Plus,
  Trash2,
  Trophy,
} from "lucide-react";
import { DateRangeFields } from "@/components/forms/date-range-fields";
import { SectionEmptyState } from "@/components/forms/section-empty-state";
import { RichTextEditor } from "@/components/forms/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  categorizeSkill,
  groupSkillsByCategory,
  SKILL_CATEGORY_LABELS,
  SKILL_CATEGORY_ORDER,
} from "@/lib/resume/skill-categories";
import {
  DATE_EDUCATION_END_PLACEHOLDER,
  DATE_END_PLACEHOLDER,
} from "@/lib/resume/field-hints";
import { OPTIONAL_FIELD_LABELS } from "@/lib/resume/optional-fields";
import { useResumeStore } from "@/hooks/use-resume-store";
import type { OptionalFields, SkillCategory } from "@/types/resume";
import { RESUME_SECTIONS } from "@/types/resume";

function confirmRemove(label: string) {
  return window.confirm(`Remove ${label}? This cannot be undone.`);
}

function parseCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinCommaList(items: string[]) {
  return items.join(", ");
}

export function PersonalInfoForm() {
  const { resume, setPersonalInfo, setLocation } = useResumeStore();
  const { personalInfo } = resume;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={personalInfo.fullName}
          onChange={(e) => setPersonalInfo({ fullName: e.target.value })}
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="currentTitle">Current Title</Label>
        <Input
          id="currentTitle"
          value={personalInfo.currentTitle}
          onChange={(e) => setPersonalInfo({ currentTitle: e.target.value })}
          placeholder="Senior Web Frontend Engineer"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="specialization">Specialization (comma-separated)</Label>
        <Input
          id="specialization"
          value={joinCommaList(personalInfo.specialization)}
          onChange={(e) =>
            setPersonalInfo({ specialization: parseCommaList(e.target.value) })
          }
          placeholder="React.js, Next.js, UI Performance"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={personalInfo.email}
          onChange={(e) => setPersonalInfo({ email: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={personalInfo.phone}
          onChange={(e) => setPersonalInfo({ phone: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={personalInfo.location.city}
          onChange={(e) => setLocation({ city: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={personalInfo.location.country}
          onChange={(e) => setLocation({ country: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input
          id="postalCode"
          value={personalInfo.location.postalCode}
          onChange={(e) => setLocation({ postalCode: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="linkedIn">LinkedIn</Label>
        <Input
          id="linkedIn"
          value={personalInfo.linkedIn}
          onChange={(e) => setPersonalInfo({ linkedIn: e.target.value })}
          placeholder="linkedin.com/in/yourname"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="github">GitHub</Label>
        <Input
          id="github"
          value={personalInfo.github}
          onChange={(e) => setPersonalInfo({ github: e.target.value })}
          placeholder="github.com/yourname"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="website">Portfolio Website</Label>
        <Input
          id="website"
          value={personalInfo.website}
          onChange={(e) => setPersonalInfo({ website: e.target.value })}
          placeholder="https://yourportfolio.com"
        />
      </div>
    </div>
  );
}

export function ProfessionalSummaryForm() {
  const { resume, setProfessionalSummary } = useResumeStore();
  const { professionalSummary } = resume;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Years of Experience</Label>
          <Input
            value={professionalSummary.yearsOfExperience}
            onChange={(e) =>
              setProfessionalSummary({ yearsOfExperience: e.target.value })
            }
            placeholder="7+"
          />
        </div>
        <div className="space-y-2">
          <Label>Designation</Label>
          <Input
            value={professionalSummary.designation}
            onChange={(e) =>
              setProfessionalSummary({ designation: e.target.value })
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Summary</Label>
        <RichTextEditor
          value={professionalSummary.text}
          onChange={(text) => setProfessionalSummary({ text })}
          placeholder="Professional summary..."
        />
      </div>
      <div className="space-y-2">
        <Label>Core Expertise (comma-separated)</Label>
        <Input
          value={joinCommaList(professionalSummary.coreExpertise)}
          onChange={(e) =>
            setProfessionalSummary({
              coreExpertise: parseCommaList(e.target.value),
            })
          }
        />
      </div>
      <div className="space-y-2">
        <Label>Career Objective</Label>
        <Textarea
          value={professionalSummary.careerObjective}
          onChange={(e) =>
            setProfessionalSummary({ careerObjective: e.target.value })
          }
          rows={3}
        />
      </div>
    </div>
  );
}

export function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience } =
    useResumeStore();

  return (
    <div className="space-y-4">
      {resume.experience.length === 0 && (
        <SectionEmptyState
          icon={Briefcase}
          title="No work experience yet"
          description="Add your roles, companies, and key projects. Start with your most recent position."
          actionLabel="Add first role"
          onAction={addExperience}
        />
      )}
      {resume.experience.map((item, index) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Role {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove role ${index + 1}`}
              onClick={() => {
                if (confirmRemove(`role ${index + 1}`)) removeExperience(item.id);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={item.role}
                onChange={(e) => updateExperience(item.id, { role: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={item.company}
                onChange={(e) =>
                  updateExperience(item.id, { company: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={item.location}
                onChange={(e) =>
                  updateExperience(item.id, { location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Company Description</Label>
              <Input
                value={item.companyDescription}
                onChange={(e) =>
                  updateExperience(item.id, {
                    companyDescription: e.target.value,
                  })
                }
              />
            </div>
            <DateRangeFields
              hintId={`experience-dates-${item.id}`}
              startDate={item.startDate}
              endDate={item.endDate}
              endPlaceholder={DATE_END_PLACEHOLDER}
              onStartChange={(startDate) =>
                updateExperience(item.id, { startDate })
              }
              onEndChange={(endDate) => updateExperience(item.id, { endDate })}
            />
            <div className="space-y-2 sm:col-span-2">
              <Label>Technologies (comma-separated)</Label>
              <Input
                value={joinCommaList(item.technologies)}
                onChange={(e) =>
                  updateExperience(item.id, {
                    technologies: parseCommaList(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description / Client Work</Label>
              <RichTextEditor
                value={item.description}
                onChange={(description) =>
                  updateExperience(item.id, { description })
                }
              />
            </div>
            {item.projects.length > 0 && (
              <div className="space-y-2 sm:col-span-2">
                <Label>Parsed Client Projects ({item.projects.length})</Label>
                <div className="space-y-2 rounded-md border bg-muted/20 p-3 text-xs">
                  {item.projects.map((project) => (
                    <div key={project.id}>
                      <p className="font-medium">
                        {project.client}
                        {project.industry ? ` — ${project.industry}` : ""}
                      </p>
                      {project.responsibilities.length > 0 && (
                        <ul className="mt-1 list-disc pl-4 text-muted-foreground">
                          {project.responsibilities.slice(0, 3).map((task) => (
                            <li key={task}>{task}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      {resume.experience.length > 0 && (
        <Button type="button" variant="outline" onClick={addExperience}>
          <Plus className="size-4" />
          Add experience
        </Button>
      )}
    </div>
  );
}

export function EducationForm() {
  const { resume, addEducation, updateEducation, removeEducation } =
    useResumeStore();

  return (
    <div className="space-y-4">
      {resume.education.length === 0 && (
        <SectionEmptyState
          icon={GraduationCap}
          title="No education entries yet"
          description="Add your degrees, institutions, and graduation dates."
          actionLabel="Add first education"
          onAction={addEducation}
        />
      )}
      {resume.education.map((item, index) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Education {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove education ${index + 1}`}
              onClick={() => {
                if (confirmRemove(`education ${index + 1}`)) removeEducation(item.id);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Degree</Label>
              <Input
                value={item.degree}
                onChange={(e) =>
                  updateEducation(item.id, { degree: e.target.value })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Institution</Label>
              <Input
                value={item.institution}
                onChange={(e) =>
                  updateEducation(item.id, { institution: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Board</Label>
              <Input
                value={item.board}
                onChange={(e) =>
                  updateEducation(item.id, { board: e.target.value })
                }
                placeholder="CBSE"
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={item.location}
                onChange={(e) =>
                  updateEducation(item.id, { location: e.target.value })
                }
              />
            </div>
            <DateRangeFields
              hintId={`education-dates-${item.id}`}
              startDate={item.startDate}
              endDate={item.endDate}
              endPlaceholder={DATE_EDUCATION_END_PLACEHOLDER}
              onStartChange={(startDate) =>
                updateEducation(item.id, { startDate })
              }
              onEndChange={(endDate) => updateEducation(item.id, { endDate })}
            />
          </div>
        </div>
      ))}
      {resume.education.length > 0 && (
        <Button type="button" variant="outline" onClick={addEducation}>
          <Plus className="size-4" />
          Add education
        </Button>
      )}
    </div>
  );
}

export function SkillsForm() {
  const { resume, addSkill, updateSkill, removeSkill } = useResumeStore();
  const grouped = groupSkillsByCategory(resume.skills);
  const filledCategories = SKILL_CATEGORY_ORDER.filter(
    (category) => (grouped[category]?.length ?? 0) > 0,
  );
  const emptyCategories = SKILL_CATEGORY_ORDER.filter(
    (category) => !grouped[category]?.length,
  );

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Skills are grouped by category and shown as labeled single-column rows in
        the preview and PDF. Change category per skill or add to any group below.
      </p>

      {filledCategories.map((category) => {
        const items = grouped[category] ?? [];

        return (
          <div key={category} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">
                  {SKILL_CATEGORY_LABELS[category]}
                </p>
                <Badge variant="secondary">{items.length}</Badge>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill(category)}
              >
                <Plus className="size-4" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-md border bg-muted/30 p-2 sm:flex-row sm:items-center"
                >
                  <Input
                    value={item.name}
                    onChange={(e) =>
                      updateSkill(item.id, { name: e.target.value })
                    }
                    onBlur={(e) => {
                      const name = e.target.value.trim();
                      if (name && item.category === "other") {
                        updateSkill(item.id, {
                          name,
                          category: categorizeSkill(name),
                        });
                      }
                    }}
                    placeholder="Skill name"
                    className="bg-background"
                  />
                  <div className="flex shrink-0 items-center gap-2">
                    <select
                      value={item.category}
                      onChange={(e) =>
                        updateSkill(item.id, {
                          category: e.target.value as SkillCategory,
                        })
                      }
                      className="h-9 rounded-md border border-input bg-background px-2 text-xs"
                      aria-label="Skill category"
                    >
                      {SKILL_CATEGORY_ORDER.map((option) => (
                        <option key={option} value={option}>
                          {SKILL_CATEGORY_LABELS[option]}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove skill ${item.name || "entry"}`}
                      onClick={() => {
                        if (confirmRemove(`skill "${item.name || "entry"}"`)) {
                          removeSkill(item.id);
                        }
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {emptyCategories.length > 0 && (
        <div className="rounded-lg border border-dashed p-4">
          <p className="mb-3 text-sm font-medium">Add skills to a category</p>
          <div className="flex flex-wrap gap-2">
            {emptyCategories.map((category) => (
              <Button
                key={category}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addSkill(category)}
              >
                <Plus className="size-4" />
                {SKILL_CATEGORY_LABELS[category]}
              </Button>
            ))}
          </div>
        </div>
      )}

      {resume.skills.length === 0 && (
        <Button type="button" variant="outline" onClick={() => addSkill("frontend")}>
          <Plus className="size-4" />
          Add your first skill
        </Button>
      )}
    </div>
  );
}

export function SpokenLanguagesForm() {
  const { resume, addSpokenLanguage, updateSpokenLanguage, removeSpokenLanguage } =
    useResumeStore();

  return (
    <div className="space-y-4">
      {resume.spokenLanguages.length === 0 && (
        <SectionEmptyState
          icon={Languages}
          title="No languages added"
          description="List languages you speak and your proficiency level."
          actionLabel="Add first language"
          onAction={addSpokenLanguage}
        />
      )}
      {resume.spokenLanguages.map((item, index) => (
        <div key={item.id} className="flex gap-2">
          <Input
            value={item.language}
            onChange={(e) =>
              updateSpokenLanguage(item.id, { language: e.target.value })
            }
            placeholder={`Language ${index + 1}`}
          />
          <Input
            value={item.proficiency}
            onChange={(e) =>
              updateSpokenLanguage(item.id, { proficiency: e.target.value })
            }
            placeholder="Proficient / Native"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Remove language ${index + 1}`}
            onClick={() => {
              if (confirmRemove(`language ${index + 1}`)) removeSpokenLanguage(item.id);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      {resume.spokenLanguages.length > 0 && (
        <Button type="button" variant="outline" onClick={addSpokenLanguage}>
          <Plus className="size-4" />
          Add language
        </Button>
      )}
    </div>
  );
}

export function KeyAchievementsForm() {
  const { resume, addKeyAchievement, updateKeyAchievement, removeKeyAchievement } =
    useResumeStore();

  return (
    <div className="space-y-4">
      {resume.keyAchievements.length === 0 && (
        <SectionEmptyState
          icon={Trophy}
          title="No achievements yet"
          description="Highlight standout academic or professional accomplishments."
          actionLabel="Add first achievement"
          onAction={addKeyAchievement}
        />
      )}
      {resume.keyAchievements.map((item, index) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Achievement {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove achievement ${index + 1}`}
              onClick={() => {
                if (confirmRemove(`achievement ${index + 1}`)) {
                  removeKeyAchievement(item.id);
                }
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <Input
              value={item.title}
              onChange={(e) =>
                updateKeyAchievement(item.id, { title: e.target.value })
              }
              placeholder="Title"
            />
            <Textarea
              value={item.description}
              onChange={(e) =>
                updateKeyAchievement(item.id, { description: e.target.value })
              }
              placeholder="Description"
              rows={3}
            />
          </div>
        </div>
      ))}
      {resume.keyAchievements.length > 0 && (
        <Button type="button" variant="outline" onClick={addKeyAchievement}>
          <Plus className="size-4" />
          Add achievement
        </Button>
      )}
    </div>
  );
}

export function InterestsForm() {
  const { resume, setInterests } = useResumeStore();

  return (
    <div className="space-y-2">
      <Label>Interests (comma-separated)</Label>
      <Input
        value={joinCommaList(resume.interests)}
        onChange={(e) => setInterests(parseCommaList(e.target.value))}
        placeholder="Cricket, Badminton, Swimming"
      />
    </div>
  );
}

export function ProjectsForm() {
  const { resume, addProject, updateProject, removeProject } = useResumeStore();

  return (
    <div className="space-y-4">
      {resume.projects.length === 0 && (
        <SectionEmptyState
          icon={FolderKanban}
          title="No personal projects yet"
          description="Showcase side projects, open-source work, or portfolio pieces."
          actionLabel="Add first project"
          onAction={addProject}
        />
      )}
      {resume.projects.map((item, index) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Project {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove project ${index + 1}`}
              onClick={() => {
                if (confirmRemove(`project ${index + 1}`)) removeProject(item.id);
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <Input
              value={item.name}
              onChange={(e) => updateProject(item.id, { name: e.target.value })}
              placeholder="Project name"
            />
            <Input
              value={item.technologies}
              onChange={(e) =>
                updateProject(item.id, { technologies: e.target.value })
              }
              placeholder="Technologies"
            />
            <RichTextEditor
              value={item.description}
              onChange={(description) =>
                updateProject(item.id, { description })
              }
            />
          </div>
        </div>
      ))}
      {resume.projects.length > 0 && (
        <Button type="button" variant="outline" onClick={addProject}>
          <Plus className="size-4" />
          Add project
        </Button>
      )}
    </div>
  );
}

export function CertificationsForm() {
  const { resume, addCertification, updateCertification, removeCertification } =
    useResumeStore();

  return (
    <div className="space-y-4">
      {resume.certifications.length === 0 && (
        <SectionEmptyState
          icon={Award}
          title="No certifications yet"
          description="Add professional credentials, licenses, or course certificates."
          actionLabel="Add first certification"
          onAction={addCertification}
        />
      )}
      {resume.certifications.map((item, index) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Certification {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Remove certification ${index + 1}`}
              onClick={() => {
                if (confirmRemove(`certification ${index + 1}`)) {
                  removeCertification(item.id);
                }
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={item.name}
              onChange={(e) =>
                updateCertification(item.id, { name: e.target.value })
              }
              placeholder="Name"
            />
            <Input
              value={item.issuer}
              onChange={(e) =>
                updateCertification(item.id, { issuer: e.target.value })
              }
              placeholder="Issuer"
            />
          </div>
        </div>
      ))}
      {resume.certifications.length > 0 && (
        <Button type="button" variant="outline" onClick={addCertification}>
          <Plus className="size-4" />
          Add certification
        </Button>
      )}
    </div>
  );
}

export function OptionalFieldsForm() {
  const { resume, setOptionalFields } = useResumeStore();
  const { optionalFields } = resume;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {(Object.keys(OPTIONAL_FIELD_LABELS) as Array<keyof OptionalFields>).map(
        (field) => (
          <div key={field} className="space-y-2">
            <Label htmlFor={field}>{OPTIONAL_FIELD_LABELS[field]}</Label>
            <Input
              id={field}
              value={optionalFields[field]}
              onChange={(e) =>
                setOptionalFields({ [field]: e.target.value } as Partial<OptionalFields>)
              }
              placeholder={`Enter ${OPTIONAL_FIELD_LABELS[field].toLowerCase()}`}
            />
          </div>
        ),
      )}
    </div>
  );
}

export const FORM_BY_SECTION = {
  personalInfo: <PersonalInfoForm />,
  professionalSummary: <ProfessionalSummaryForm />,
  experience: <ExperienceForm />,
  education: <EducationForm />,
  skills: <SkillsForm />,
  spokenLanguages: <SpokenLanguagesForm />,
  keyAchievements: <KeyAchievementsForm />,
  interests: <InterestsForm />,
  projects: <ProjectsForm />,
  certifications: <CertificationsForm />,
  optionalFields: <OptionalFieldsForm />,
} as const;

export { RESUME_SECTIONS };
