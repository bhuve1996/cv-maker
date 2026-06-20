import { StyleSheet } from "@react-pdf/renderer";
import { resolveResumeTheme } from "@/lib/export/resume-theme";
import { DEFAULT_RESUME_STYLE } from "@/types/resume-style";
import type { ResumeStyle } from "@/types/resume-style";

/** ATS-safe typography — Helvetica only (built-in, universally parseable) */
export const PDF_FONT_FAMILY = "Helvetica";

const PAGE_PADDING_HORIZONTAL = 28;
const PAGE_PADDING_TOP = 22;

export function buildPdfStyles(style: ResumeStyle = DEFAULT_RESUME_STYLE) {
  const theme = resolveResumeTheme(style);
  const c = theme.colors;

  const sectionTitleBase = {
    fontSize: 11.5,
    fontWeight: 700 as const,
    letterSpacing: 0.3,
  };

  const sectionTitleWrap = theme.sectionTitleBackground
    ? {
        backgroundColor: theme.sectionTitleBackground,
        paddingVertical: theme.sectionTitlePadding.vertical,
        marginBottom: 6,
        marginHorizontal: -PAGE_PADDING_HORIZONTAL,
        paddingHorizontal: PAGE_PADDING_HORIZONTAL,
      }
    : {
        marginBottom: 3,
      };

  const sectionTitleStyle = theme.sectionTitleBackground
    ? {
        ...sectionTitleBase,
        color: theme.sectionTitleColor,
      }
    : {
        ...sectionTitleBase,
        color: c.textPrimary,
        marginBottom: 3,
      };

  const headerStyle = theme.headerBackground
    ? {
        backgroundColor: theme.headerBackground,
        paddingTop: 18,
        paddingBottom: 12,
        paddingHorizontal: 0,
        marginTop: -PAGE_PADDING_TOP,
        marginBottom: 2,
        marginHorizontal: -PAGE_PADDING_HORIZONTAL,
        paddingLeft: PAGE_PADDING_HORIZONTAL,
        paddingRight: PAGE_PADDING_HORIZONTAL,
      }
    : {
        borderBottomWidth: 1,
        borderBottomColor: theme.headerBorderColor,
        paddingBottom: 10,
        marginBottom: 2,
      };

  return StyleSheet.create({
    page: {
      fontFamily: PDF_FONT_FAMILY,
      fontSize: 10,
      lineHeight: 1.38,
      color: c.textPrimary,
      paddingTop: PAGE_PADDING_TOP,
      paddingBottom: PAGE_PADDING_TOP,
      paddingHorizontal: PAGE_PADDING_HORIZONTAL,
    },
    header: headerStyle,
    headerIdentity: {
      marginBottom: 2,
    },
    name: {
      fontSize: 18,
      fontFamily: PDF_FONT_FAMILY,
      fontWeight: 700,
      color: theme.headerTextPrimary,
      letterSpacing: -0.2,
      marginBottom: 6,
    },
    title: {
      fontSize: 12,
      fontWeight: 600,
      color: theme.headerTextSecondary,
      marginBottom: 4,
    },
    specialization: {
      fontSize: 10,
      color: theme.headerTextMuted,
      lineHeight: 1.4,
    },
    contactRow: {
      marginTop: 8,
    },
    contactItem: {
      fontSize: 10,
      color: theme.headerBanner ? theme.headerTextMuted : c.textMuted,
      lineHeight: 1.4,
    },
    section: {
      marginTop: theme.sectionMarginTop,
    },
    sectionCompact: {
      marginTop: theme.sectionCompactMarginTop,
    },
    sectionTitleWrap,
    sectionTitle: sectionTitleStyle,
    sectionRule: theme.showSectionRule
      ? {
          height: 1,
          backgroundColor: c.divider,
          marginBottom: 6,
        }
      : {
          height: 0,
          marginBottom: 0,
        },
    body: {
      fontSize: 10,
      color: c.textBody,
      lineHeight: 1.42,
    },
    muted: {
      color: c.textMuted,
    },
    subtle: {
      color: c.textSubtle,
      fontSize: 9.5,
    },
    faint: {
      color: c.textFaint,
      fontSize: 9,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 10,
    },
    rowMain: {
      flex: 1,
      flexDirection: "column",
    },
    experienceHeader: {
      flexDirection: "column",
      marginBottom: 4,
    },
    experiencePrimary: {
      fontSize: 11,
      fontWeight: 600,
      color: c.textPrimary,
      lineHeight: 1.45,
      marginBottom: 4,
    },
    experienceSecondary: {
      fontSize: 10,
      color: c.textMuted,
      lineHeight: 1.45,
      marginBottom: 3,
    },
    experienceMeta: {
      fontSize: 9,
      color: c.textFaint,
      lineHeight: 1.4,
      marginBottom: 4,
    },
    entryTitle: {
      fontSize: 11,
      fontWeight: 600,
      color: c.textPrimary,
      lineHeight: 1.45,
      marginBottom: 4,
    },
    companyItem: {
      flexDirection: "column",
      paddingBottom: 8,
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    companyItemLast: {
      paddingBottom: 0,
      marginBottom: 0,
      borderBottomWidth: 0,
    },
    projectsList: {
      marginTop: 6,
      paddingLeft: 10,
      borderLeftWidth: 2,
      borderLeftColor: c.projectAccent,
    },
    projectItem: {
      marginBottom: 6,
    },
    projectLabel: {
      fontSize: 10,
      color: c.textBody,
      lineHeight: 1.42,
      marginBottom: 3,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 1,
    },
    bulletDot: {
      width: 9,
      fontSize: 10,
      color: c.textBody,
    },
    bulletText: {
      flex: 1,
      fontSize: 10,
      color: c.textBody,
      lineHeight: 1.42,
    },
    skillRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 2,
      gap: 8,
    },
    skillCategory: {
      width: 132,
      fontSize: 9.5,
      fontWeight: 600,
      color: c.textMuted,
      lineHeight: 1.35,
    },
    skillItems: {
      flex: 1,
      fontSize: 10,
      color: c.textBody,
      lineHeight: 1.35,
    },
    optionalRow: {
      marginBottom: 3,
    },
    compactBlock: {
      marginBottom: 4,
    },
  });
}

/** @deprecated Use buildPdfStyles(style) — kept for backward compatibility */
export const pdfStyles = buildPdfStyles();
