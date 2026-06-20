"use client";

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createEmptyResume } from "@/lib/resume/default-resume";
import { cleanupParsedResume } from "@/lib/resume/cleanup-parsed-resume";
import { syncJobTechnologiesFromProjects } from "@/lib/resume/post-process-parsed-resume";
import { mergeResume, migrateResume } from "@/lib/resume/migrate-resume";
import { RESUME_STORAGE_KEY } from "@/lib/resume/storage";
import { categorizeSkill } from "@/lib/resume/skill-categories";
import type {
  Certification,
  Education,
  Experience,
  KeyAchievement,
  OptionalFields,
  PersonalInfo,
  ProfessionalSummary,
  Project,
  Skill,
  SkillCategory,
  SpokenLanguage,
  Resume,
  StructuredLocation,
  ClientProject,
} from "@/types/resume";
import {
  DEFAULT_RESUME_STYLE,
  mergeResumeStyle,
  RESUME_STYLE_PRESETS,
  type ResumeStyle,
  type ResumeStylePreset,
} from "@/types/resume-style";

interface ResumeStore {
  resume: Resume;
  style: ResumeStyle;
  rawText: string;
  hasUploaded: boolean;
  isParsing: boolean;
  parseParser: "gemini" | "heuristic" | null;
  parseWarning: string;
  setResume: (resume: Resume) => void;
  mergeParsedResume: (
    partial: Partial<Resume>,
    rawText: string,
    options?: { parser?: "gemini" | "heuristic"; warning?: string },
  ) => void;
  setPersonalInfo: (info: Partial<PersonalInfo>) => void;
  setLocation: (location: Partial<StructuredLocation>) => void;
  setProfessionalSummary: (summary: Partial<ProfessionalSummary>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addClientProject: (experienceId: string) => void;
  updateClientProject: (
    experienceId: string,
    projectId: string,
    data: Partial<ClientProject>,
  ) => void;
  removeClientProject: (experienceId: string, projectId: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (category?: SkillCategory) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  replaceSkillsInCategory: (category: SkillCategory, names: string[]) => void;
  addSpokenLanguage: () => void;
  updateSpokenLanguage: (id: string, data: Partial<SpokenLanguage>) => void;
  removeSpokenLanguage: (id: string) => void;
  addKeyAchievement: () => void;
  updateKeyAchievement: (id: string, data: Partial<KeyAchievement>) => void;
  removeKeyAchievement: (id: string) => void;
  setInterests: (interests: string[]) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  setOptionalFields: (fields: Partial<OptionalFields>) => void;
  setStyle: (style: Partial<ResumeStyle>) => void;
  applyStylePreset: (preset: ResumeStylePreset) => void;
  setIsParsing: (value: boolean) => void;
  startFromScratch: () => void;
  reset: () => void;
}

const emptyExperience = (): Experience => ({
  id: uuidv4(),
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  companyDescription: "",
  description: "",
  projects: [],
  certifications: [],
  achievements: [],
  technologies: [],
});

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: createEmptyResume(),
      style: { ...DEFAULT_RESUME_STYLE },
      rawText: "",
      hasUploaded: false,
      isParsing: false,
      parseParser: null,
      parseWarning: "",

      setResume: (resume) => set({ resume: migrateResume(resume), hasUploaded: true }),

      mergeParsedResume: (partial, rawText, options) =>
        set({
          resume: cleanupParsedResume(mergeResume(partial), rawText),
          rawText,
          hasUploaded: true,
          parseParser: options?.parser ?? null,
          parseWarning: options?.warning ?? "",
        }),

      setPersonalInfo: (info) =>
        set((state) => ({
          resume: {
            ...state.resume,
            personalInfo: { ...state.resume.personalInfo, ...info },
          },
        })),

      setLocation: (location) =>
        set((state) => ({
          resume: {
            ...state.resume,
            personalInfo: {
              ...state.resume.personalInfo,
              location: { ...state.resume.personalInfo.location, ...location },
            },
          },
        })),

      setProfessionalSummary: (summary) =>
        set((state) => ({
          resume: {
            ...state.resume,
            professionalSummary: {
              ...state.resume.professionalSummary,
              ...summary,
            },
          },
        })),

      addExperience: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: [...state.resume.experience, emptyExperience()],
          },
        })),

      updateExperience: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((item) =>
              item.id === id ? { ...item, ...data } : item,
            ),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.filter((item) => item.id !== id),
          },
        })),

      addClientProject: (experienceId) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((job) =>
              job.id === experienceId
                ? {
                    ...job,
                    projects: [
                      ...job.projects,
                      {
                        id: uuidv4(),
                        client: "",
                        industry: "",
                        responsibilities: [],
                        technologies: [],
                      },
                    ],
                  }
                : job,
            ),
          },
        })),

      updateClientProject: (experienceId, projectId, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((job) => {
              if (job.id !== experienceId) return job;
              const updatedJob = {
                ...job,
                projects: job.projects.map((project) =>
                  project.id === projectId ? { ...project, ...data } : project,
                ),
              };
              return syncJobTechnologiesFromProjects(updatedJob);
            }),
          },
        })),

      removeClientProject: (experienceId, projectId) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.map((job) => {
              if (job.id !== experienceId) return job;
              const updatedJob = {
                ...job,
                projects: job.projects.filter((project) => project.id !== projectId),
              };
              return syncJobTechnologiesFromProjects(updatedJob);
            }),
          },
        })),

      addEducation: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: [
              ...state.resume.education,
              {
                id: uuidv4(),
                institution: "",
                degree: "",
                board: "",
                location: "",
                startDate: "",
                endDate: "",
              },
            ],
          },
        })),

      updateEducation: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.map((item) =>
              item.id === id ? { ...item, ...data } : item,
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.filter((item) => item.id !== id),
          },
        })),

      addSkill: (category = "other") =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: [...state.resume.skills, { id: uuidv4(), name: "", category }],
          },
        })),

      updateSkill: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.map((item) =>
              item.id === id ? { ...item, ...data } : item,
            ),
          },
        })),

      removeSkill: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.filter((item) => item.id !== id),
          },
        })),

      replaceSkillsInCategory: (category, names) =>
        set((state) => {
          const trimmed = names.map((name) => name.trim()).filter(Boolean);
          const kept = state.resume.skills.filter((skill) => skill.category !== category);
          const added = trimmed.map((name) => {
            const inferred = categorizeSkill(name);
            return {
              id: uuidv4(),
              name,
              category: inferred !== "other" ? inferred : category,
            };
          });
          return {
            resume: {
              ...state.resume,
              skills: [...kept, ...added],
            },
          };
        }),

      addSpokenLanguage: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            spokenLanguages: [
              ...state.resume.spokenLanguages,
              { id: uuidv4(), language: "", proficiency: "" },
            ],
          },
        })),

      updateSpokenLanguage: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            spokenLanguages: state.resume.spokenLanguages.map((item) =>
              item.id === id ? { ...item, ...data } : item,
            ),
          },
        })),

      removeSpokenLanguage: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            spokenLanguages: state.resume.spokenLanguages.filter(
              (item) => item.id !== id,
            ),
          },
        })),

      addKeyAchievement: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            keyAchievements: [
              ...state.resume.keyAchievements,
              { id: uuidv4(), title: "", description: "" },
            ],
          },
        })),

      updateKeyAchievement: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            keyAchievements: state.resume.keyAchievements.map((item) =>
              item.id === id ? { ...item, ...data } : item,
            ),
          },
        })),

      removeKeyAchievement: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            keyAchievements: state.resume.keyAchievements.filter(
              (item) => item.id !== id,
            ),
          },
        })),

      setInterests: (interests) =>
        set((state) => ({
          resume: { ...state.resume, interests },
        })),

      addProject: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: [
              ...state.resume.projects,
              { id: uuidv4(), name: "", description: "", technologies: "" },
            ],
          },
        })),

      updateProject: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.map((item) =>
              item.id === id ? { ...item, ...data } : item,
            ),
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.filter((item) => item.id !== id),
          },
        })),

      addCertification: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: [
              ...state.resume.certifications,
              { id: uuidv4(), name: "", issuer: "" },
            ],
          },
        })),

      updateCertification: (id, data) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.map((item) =>
              item.id === id ? { ...item, ...data } : item,
            ),
          },
        })),

      removeCertification: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.filter(
              (item) => item.id !== id,
            ),
          },
        })),

      setOptionalFields: (fields) =>
        set((state) => ({
          resume: {
            ...state.resume,
            optionalFields: { ...state.resume.optionalFields, ...fields },
          },
        })),

      setStyle: (partial) =>
        set((state) => ({
          style: mergeResumeStyle({ ...state.style, ...partial }),
        })),

      applyStylePreset: (preset) =>
        set({ style: { ...RESUME_STYLE_PRESETS[preset].style } }),

      setIsParsing: (isParsing) => set({ isParsing }),

      startFromScratch: () => set({ hasUploaded: true }),

      reset: () =>
        set({
          resume: createEmptyResume(),
          style: { ...DEFAULT_RESUME_STYLE },
          rawText: "",
          hasUploaded: false,
          isParsing: false,
          parseParser: null,
          parseWarning: "",
        }),
    }),
    {
      name: RESUME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        resume: state.resume,
        style: state.style,
        rawText: state.rawText,
        hasUploaded: state.hasUploaded,
        parseParser: state.parseParser,
        parseWarning: state.parseWarning,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.resume = migrateResume(state.resume);
          state.style = mergeResumeStyle(state.style);
        }
      },
    },
  ),
);
