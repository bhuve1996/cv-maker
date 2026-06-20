"use client";

import { Plus, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/forms/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumeStore } from "@/hooks/use-resume-store";

export function PersonalInfoForm() {
  const { resume, setPersonalInfo } = useResumeStore();
  const { personalInfo } = resume;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={personalInfo.fullName}
          onChange={(e) => setPersonalInfo({ fullName: e.target.value })}
          placeholder="Jane Doe"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={personalInfo.email}
          onChange={(e) => setPersonalInfo({ email: e.target.value })}
          placeholder="jane@email.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={personalInfo.phone}
          onChange={(e) => setPersonalInfo({ phone: e.target.value })}
          placeholder="+1 555 000 0000"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={personalInfo.location}
          onChange={(e) => setPersonalInfo({ location: e.target.value })}
          placeholder="San Francisco, CA"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="linkedIn">LinkedIn</Label>
        <Input
          id="linkedIn"
          value={personalInfo.linkedIn}
          onChange={(e) => setPersonalInfo({ linkedIn: e.target.value })}
          placeholder="linkedin.com/in/janedoe"
        />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="website">Portfolio Website</Label>
        <Input
          id="website"
          value={personalInfo.website}
          onChange={(e) => setPersonalInfo({ website: e.target.value })}
          placeholder="janedoe.dev"
        />
      </div>
    </div>
  );
}

export function SummaryForm() {
  const { resume, setSummary } = useResumeStore();

  return (
    <RichTextEditor
      value={resume.summary}
      onChange={setSummary}
      placeholder="Write a brief professional summary..."
    />
  );
}

export function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience } =
    useResumeStore();

  return (
    <div className="space-y-4">
      {resume.experience.map((item, index) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Experience {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeExperience(item.id)}
              aria-label="Remove experience"
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
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={item.company}
                onChange={(e) =>
                  updateExperience(item.id, { company: e.target.value })
                }
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                value={item.startDate}
                onChange={(e) =>
                  updateExperience(item.id, { startDate: e.target.value })
                }
                placeholder="Jan 2022"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                value={item.endDate}
                onChange={(e) =>
                  updateExperience(item.id, { endDate: e.target.value })
                }
                placeholder="Present"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <RichTextEditor
                value={item.description}
                onChange={(description) =>
                  updateExperience(item.id, { description })
                }
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addExperience}>
        <Plus className="size-4" />
        Add experience
      </Button>
    </div>
  );
}

export function EducationForm() {
  const { resume, addEducation, updateEducation, removeEducation } =
    useResumeStore();

  return (
    <div className="space-y-4">
      {resume.education.map((item, index) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Education {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeEducation(item.id)}
              aria-label="Remove education"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Institution</Label>
              <Input
                value={item.institution}
                onChange={(e) =>
                  updateEducation(item.id, { institution: e.target.value })
                }
                placeholder="University of Example"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Degree</Label>
              <Input
                value={item.degree}
                onChange={(e) =>
                  updateEducation(item.id, { degree: e.target.value })
                }
                placeholder="B.S. Computer Science"
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                value={item.startDate}
                onChange={(e) =>
                  updateEducation(item.id, { startDate: e.target.value })
                }
                placeholder="2018"
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                value={item.endDate}
                onChange={(e) =>
                  updateEducation(item.id, { endDate: e.target.value })
                }
                placeholder="2022"
              />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addEducation}>
        <Plus className="size-4" />
        Add education
      </Button>
    </div>
  );
}

export function SkillsForm() {
  const { resume, addSkill, updateSkill, removeSkill } = useResumeStore();

  const technicalSkills = resume.skills.filter((s) => s.category === "technical");
  const softSkills = resume.skills.filter((s) => s.category === "soft");

  const renderSkillGroup = (
    title: string,
    category: "technical" | "soft",
    items: typeof resume.skills,
  ) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
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
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">No skills added yet.</p>
      )}
      {items.map((item) => (
        <div key={item.id} className="flex gap-2">
          <Input
            value={item.name}
            onChange={(e) => updateSkill(item.id, { name: e.target.value })}
            placeholder="Skill name"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeSkill(item.id)}
            aria-label="Remove skill"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {renderSkillGroup("Technical Skills", "technical", technicalSkills)}
      {renderSkillGroup("Soft Skills", "soft", softSkills)}
    </div>
  );
}

export function ProjectsForm() {
  const { resume, addProject, updateProject, removeProject } = useResumeStore();

  return (
    <div className="space-y-4">
      {resume.projects.map((item, index) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Project {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeProject(item.id)}
              aria-label="Remove project"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                value={item.name}
                onChange={(e) => updateProject(item.id, { name: e.target.value })}
                placeholder="Portfolio Website"
              />
            </div>
            <div className="space-y-2">
              <Label>Technologies</Label>
              <Input
                value={item.technologies}
                onChange={(e) =>
                  updateProject(item.id, { technologies: e.target.value })
                }
                placeholder="React, TypeScript, Tailwind"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <RichTextEditor
                value={item.description}
                onChange={(description) =>
                  updateProject(item.id, { description })
                }
                placeholder="Describe the project..."
              />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addProject}>
        <Plus className="size-4" />
        Add project
      </Button>
    </div>
  );
}

export function CertificationsForm() {
  const { resume, addCertification, updateCertification, removeCertification } =
    useResumeStore();

  return (
    <div className="space-y-4">
      {resume.certifications.map((item, index) => (
        <div key={item.id} className="rounded-lg border p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Certification {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeCertification(item.id)}
              aria-label="Remove certification"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={item.name}
                onChange={(e) =>
                  updateCertification(item.id, { name: e.target.value })
                }
                placeholder="AWS Certified Developer"
              />
            </div>
            <div className="space-y-2">
              <Label>Issuer</Label>
              <Input
                value={item.issuer}
                onChange={(e) =>
                  updateCertification(item.id, { issuer: e.target.value })
                }
                placeholder="Amazon Web Services"
              />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addCertification}>
        <Plus className="size-4" />
        Add certification
      </Button>
    </div>
  );
}
