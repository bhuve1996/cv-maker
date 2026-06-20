import type {
  ResumeStyle,
  SectionHeaderStyle,
  SectionSpacing,
} from "@/types/resume-style";

export const RESUME_THEME_COLORS = {
  primary: "#1E3A5F",
  secondary: "#EAF2FF",
  textPrimary: "#0f172a",
  textBody: "#334155",
  textMuted: "#475569",
  textSubtle: "#64748b",
  textFaint: "#94a3b8",
  divider: "#cbd5e1",
  headerBorder: "#e2e8f0",
  projectAccent: "#e2e8f0",
  white: "#ffffff",
} as const;

const SECTION_SPACING_PX: Record<SectionSpacing, number> = {
  compact: 9,
  normal: 14,
  relaxed: 18,
};

export interface ResolvedResumeTheme {
  colors: typeof RESUME_THEME_COLORS;
  sectionMarginTop: number;
  sectionCompactMarginTop: number;
  headerBanner: boolean;
  sectionHeaderStyle: SectionHeaderStyle;
  showSectionRule: boolean;
  sectionTitleBackground: string | null;
  sectionTitleColor: string;
  sectionTitlePadding: { vertical: number; horizontal: number };
  headerBackground: string | null;
  headerTextPrimary: string;
  headerTextSecondary: string;
  headerTextMuted: string;
  headerBorderColor: string;
}

export function resolveResumeTheme(style: ResumeStyle): ResolvedResumeTheme {
  const sectionMarginTop = SECTION_SPACING_PX[style.sectionSpacing];
  const sectionCompactMarginTop = Math.max(sectionMarginTop - 2, 7);

  const sectionTitleBackground =
    style.sectionHeaderStyle === "lightFill"
      ? RESUME_THEME_COLORS.secondary
      : style.sectionHeaderStyle === "darkFill"
        ? RESUME_THEME_COLORS.primary
        : null;

  const sectionTitleColor =
    style.sectionHeaderStyle === "darkFill"
      ? RESUME_THEME_COLORS.white
      : RESUME_THEME_COLORS.textPrimary;

  const showSectionRule = style.sectionHeaderStyle === "rule";

  return {
    colors: RESUME_THEME_COLORS,
    sectionMarginTop,
    sectionCompactMarginTop,
    headerBanner: style.headerBanner,
    sectionHeaderStyle: style.sectionHeaderStyle,
    showSectionRule,
    sectionTitleBackground,
    sectionTitleColor,
    sectionTitlePadding: { vertical: 4, horizontal: 0 },
    headerBackground: style.headerBanner ? RESUME_THEME_COLORS.primary : null,
    headerTextPrimary: style.headerBanner
      ? RESUME_THEME_COLORS.white
      : RESUME_THEME_COLORS.textPrimary,
    headerTextSecondary: style.headerBanner
      ? RESUME_THEME_COLORS.secondary
      : RESUME_THEME_COLORS.textBody,
    headerTextMuted: style.headerBanner ? "#cbd5e1" : RESUME_THEME_COLORS.textSubtle,
    headerBorderColor: style.headerBanner
      ? RESUME_THEME_COLORS.primary
      : RESUME_THEME_COLORS.headerBorder,
  };
}
