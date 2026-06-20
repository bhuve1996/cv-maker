"use client";

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createEmptyResume } from "@/lib/resume/default-resume";
import { mergeResume, migrateResume } from "@/lib/resume/migrate-resume";
import { RESUME_STORAGE_KEY } from "@/lib/resume/storage";
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
} from "@/types/resume";

interface ResumeStore {
  resume: Resume;
  rawText: string;
  hasUploaded: boolean;
  isParsing: boolean;
  setResume: (resume: Resume) => void;
  mergeParsedResume: (partial: Partial<Resume>, rawText: string) => void;
  setPersonalInfo: (info: Partial<PersonalInfo>) => void;
  setLocation: (location: Partial<StructuredLocation>) => void;
  setProfessionalSummary: (summary: Partial<ProfessionalSummary>) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (category?: SkillCategory) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
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
  setIsParsing: (value: boolean) => void;
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
      rawText: "",
      hasUploaded: false,
      isParsing: false,

      setResume: (resume) => set({ resume: migrateResume(resume), hasUploaded: true }),

      mergeParsedResume: (partial, rawText) =>
        set({
          resume: mergeResume(partial),
          rawText,
          hasUploaded: true,
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

      setIsParsing: (isParsing) => set({ isParsing }),

      reset: () =>
        set({
          resume: createEmptyResume(),
          rawText: "",
          hasUploaded: false,
          isParsing: false,
        }),
    }),
    {
      name: RESUME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        resume: state.resume,
        rawText: state.rawText,
        hasUploaded: state.hasUploaded,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.resume = migrateResume(state.resume);
        }
      },
    },
  ),
);
