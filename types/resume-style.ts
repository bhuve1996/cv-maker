export type ResumeStylePreset = "classic" | "modernLight" | "modernBanner";
export type SectionHeaderStyle = "rule" | "lightFill" | "darkFill";
export type SectionSpacing = "compact" | "normal" | "relaxed";
export type ExperienceLayout = "standard" | "recruiter";

export interface ResumeStyle {
  preset: ResumeStylePreset;
  headerBanner: boolean;
  sectionHeaderStyle: SectionHeaderStyle;
  sectionSpacing: SectionSpacing;
  experienceLayout: ExperienceLayout;
}

export const DEFAULT_RESUME_STYLE: ResumeStyle = {
  preset: "classic",
  headerBanner: false,
  sectionHeaderStyle: "rule",
  sectionSpacing: "compact",
  experienceLayout: "standard",
};

export const RESUME_STYLE_PRESETS: Record<
  ResumeStylePreset,
  { label: string; description: string; style: ResumeStyle }
> = {
  classic: {
    label: "Classic",
    description: "Plain black-and-white, rule-only section headers",
    style: {
      preset: "classic",
      headerBanner: false,
      sectionHeaderStyle: "rule",
      sectionSpacing: "compact",
      experienceLayout: "standard",
    },
  },
  modernLight: {
    label: "Modern Light",
    description: "Light blue section strips, relaxed spacing, recruiter layout",
    style: {
      preset: "modernLight",
      headerBanner: false,
      sectionHeaderStyle: "lightFill",
      sectionSpacing: "relaxed",
      experienceLayout: "recruiter",
    },
  },
  modernBanner: {
    label: "Modern Banner",
    description: "Navy header banner, light section strips, recruiter layout",
    style: {
      preset: "modernBanner",
      headerBanner: true,
      sectionHeaderStyle: "lightFill",
      sectionSpacing: "relaxed",
      experienceLayout: "recruiter",
    },
  },
};

export function mergeResumeStyle(partial?: Partial<ResumeStyle> | null): ResumeStyle {
  return {
    ...DEFAULT_RESUME_STYLE,
    ...partial,
  };
}
