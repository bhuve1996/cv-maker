import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string(),
  email: z.string().email().or(z.literal("")),
  phone: z.string(),
  location: z.string(),
  linkedIn: z.string().url().or(z.literal("")),
  website: z.string().url().or(z.literal("")),
});

export const experienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["technical", "soft"]),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  technologies: z.string(),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
});

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
});
