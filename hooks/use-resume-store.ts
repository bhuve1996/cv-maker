"use client";

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createEmptyResume } from "@/lib/resume/default-resume";
import { mergeResume } from "@/lib/resume/merge-resume";
import { RESUME_STORAGE_KEY } from "@/lib/resume/storage";
import type {
  Certification,
  Education,
  Experience,
  PersonalInfo,
  Project,
  Resume,
  Skill,
} from "@/types/resume";

interface ResumeStore {
  resume: Resume;
  rawText: string;
  hasUploaded: boolean;
  isParsing: boolean;
  setResume: (resume: Resume) => void;
  mergeParsedResume: (partial: Partial<Resume>, rawText: string) => void;
  setPersonalInfo: (info: Partial<PersonalInfo>) => void;
  setSummary: (summary: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (category: Skill["category"]) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  setIsParsing: (value: boolean) => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: createEmptyResume(),
      rawText: "",
      hasUploaded: false,
      isParsing: false,

      setResume: (resume) => set({ resume, hasUploaded: true }),

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

      setSummary: (summary) =>
        set((state) => ({
          resume: { ...state.resume, summary },
        })),

      addExperience: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: [
              ...state.resume.experience,
              {
                id: uuidv4(),
                company: "",
                role: "",
                startDate: "",
                endDate: "",
                description: "",
              },
            ],
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

      addSkill: (category) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: [
              ...state.resume.skills,
              { id: uuidv4(), name: "", category },
            ],
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

      addProject: () =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: [
              ...state.resume.projects,
              {
                id: uuidv4(),
                name: "",
                description: "",
                technologies: "",
              },
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
    },
  ),
);
