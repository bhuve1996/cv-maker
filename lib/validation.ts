import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string(),
  currentTitle: z.string(),
  specialization: z.array(z.string()),
  email: z.string().email().or(z.literal("")),
  phone: z.string(),
  linkedIn: z.string().url().or(z.literal("")),
  website: z.string().url().or(z.literal("")),
  github: z.string().url().or(z.literal("")),
  location: z.object({
    city: z.string(),
    country: z.string(),
    postalCode: z.string(),
  }),
});

export const professionalSummarySchema = z.object({
  text: z.string(),
  yearsOfExperience: z.string(),
  designation: z.string(),
  coreExpertise: z.array(z.string()),
  achievements: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      impact: z.string(),
    }),
  ),
  careerObjective: z.string(),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  companyDescription: z.string(),
  description: z.string(),
  projects: z.array(
    z.object({
      id: z.string(),
      client: z.string(),
      industry: z.string(),
      responsibilities: z.array(z.string()),
      technologies: z.array(z.string()),
    }),
  ),
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      status: z.string(),
    }),
  ),
  achievements: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      impact: z.string(),
    }),
  ),
  technologies: z.array(z.string()),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  board: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
});

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  professionalSummary: professionalSummarySchema,
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  spokenLanguages: z.array(
    z.object({
      id: z.string(),
      language: z.string(),
      proficiency: z.string(),
    }),
  ),
  keyAchievements: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  ),
  interests: z.array(z.string()),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      technologies: z.string(),
    }),
  ),
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      issuer: z.string(),
    }),
  ),
});
