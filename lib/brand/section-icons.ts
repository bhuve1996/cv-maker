import type { LucideIcon } from "lucide-react";
import {
  AlignLeft,
  Award,
  Briefcase,
  Code2,
  FolderKanban,
  GraduationCap,
  Heart,
  Languages,
  SlidersHorizontal,
  Trophy,
  User,
} from "lucide-react";
import type { ResumeSection } from "@/types/resume";

export const SECTION_ICONS: Record<ResumeSection, LucideIcon> = {
  personalInfo: User,
  professionalSummary: AlignLeft,
  experience: Briefcase,
  education: GraduationCap,
  skills: Code2,
  spokenLanguages: Languages,
  keyAchievements: Trophy,
  interests: Heart,
  projects: FolderKanban,
  certifications: Award,
  optionalFields: SlidersHorizontal,
};

export const SECTION_ICON_COLORS: Record<ResumeSection, string> = {
  personalInfo: "bg-sky-500/10 text-sky-600",
  professionalSummary: "bg-violet-500/10 text-violet-600",
  experience: "bg-indigo-500/10 text-indigo-600",
  education: "bg-emerald-500/10 text-emerald-600",
  skills: "bg-blue-500/10 text-blue-600",
  spokenLanguages: "bg-cyan-500/10 text-cyan-600",
  keyAchievements: "bg-amber-500/10 text-amber-600",
  interests: "bg-rose-500/10 text-rose-600",
  projects: "bg-purple-500/10 text-purple-600",
  certifications: "bg-orange-500/10 text-orange-600",
  optionalFields: "bg-slate-500/10 text-slate-600",
};
