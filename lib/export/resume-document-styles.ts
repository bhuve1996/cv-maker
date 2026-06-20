import { DEFAULT_RESUME_STYLE } from "@/types/resume-style";
import { resolveResumeTheme } from "@/lib/export/resume-theme";
import type { ResumeStyle } from "@/types/resume-style";
import type { ResolvedResumeTheme } from "@/lib/export/resume-theme";

function buildSectionTitleCss(theme: ResolvedResumeTheme): string {
  const { sectionTitleBackground, sectionTitleColor, showSectionRule } = theme;
  const padding = theme.sectionTitlePadding;

  let css = `
  .resume-document h2 {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: ${sectionTitleColor};
  }`;

  if (sectionTitleBackground) {
    css += `
  .resume-document .rd-section-title-filled {
    background: ${sectionTitleBackground};
    margin-left: -28px;
    margin-right: -28px;
    padding: ${padding.vertical}px 28px;
    margin-bottom: 6px;
  }
  .resume-document .rd-section-title-filled h2 {
    color: ${sectionTitleColor};
  }`;
  } else {
    css += `
  .resume-document .rd-section-title {
    margin-bottom: 6px;
  }`;
  }

  if (showSectionRule) {
    css += `
  .resume-document .rd-separator {
    height: 1px;
    margin-top: 4px;
    background: ${theme.colors.divider};
  }`;
  } else {
    css += `
  .resume-document .rd-separator {
    display: none;
  }`;
  }

  return css;
}

function buildHeaderCss(theme: ResolvedResumeTheme): string {
  const { headerBackground, headerBorderColor } = theme;

  if (headerBackground) {
    return `
  .resume-document .rd-header {
    background: ${headerBackground};
    border-bottom: none;
    margin: -22px -28px 2px;
    padding: 18px 28px 12px;
  }
  .resume-document .rd-header h1 {
    color: ${theme.headerTextPrimary};
  }
  .resume-document .rd-header .rd-title {
    color: ${theme.headerTextSecondary};
  }
  .resume-document .rd-header .rd-specialization {
    color: ${theme.headerTextMuted};
  }
  .resume-document .rd-header .rd-contact {
    color: ${theme.headerTextMuted};
  }`;
  }

  return `
  .resume-document .rd-header {
    border-bottom: 1px solid ${headerBorderColor};
    padding-bottom: 10px;
  }
  .resume-document .rd-header h1 {
    color: ${theme.colors.textPrimary};
  }`;
}

/** Export/print-safe resume styles — hex/rgb only (no lab/oklch) for html2canvas compatibility */
export function buildResumeDocumentStyles(style: ResumeStyle = DEFAULT_RESUME_STYLE): string {
  const theme = resolveResumeTheme(style);
  const c = theme.colors;

  return `
  .resume-document {
    box-sizing: border-box;
    width: 794px;
    min-height: auto;
    margin: 0 auto;
    padding: 22px 28px;
    background: ${c.white};
    color: ${c.textPrimary};
    font-family: Helvetica, Arial, Calibri, Verdana, Tahoma, ui-sans-serif, sans-serif;
    font-size: 10px;
    line-height: 1.38;
  }

  .resume-document * {
    box-sizing: border-box;
  }

  ${buildHeaderCss(theme)}

  .resume-document .rd-identity {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-bottom: 2px;
  }

  .resume-document h1 {
    margin: 0 0 6px;
    font-family: Helvetica, Arial, Georgia, Calibri, sans-serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  .resume-document .rd-title {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 600;
    color: ${c.textBody};
    line-height: 1.35;
  }

  .resume-document .rd-specialization {
    margin: 0;
    font-size: 10px;
    color: ${c.textSubtle};
    line-height: 1.4;
  }

  .resume-document .rd-contact-block {
    margin-top: 8px;
  }

  ${buildSectionTitleCss(theme)}

  .resume-document h3 {
    margin: 0 0 2px;
    font-size: 12px;
    font-weight: 600;
    color: ${c.textPrimary};
    line-height: 1.35;
  }

  .resume-document p {
    margin: 0;
  }

  .resume-document ul {
    margin: 0;
    padding: 0;
    list-style: disc;
    padding-left: 14px;
  }

  .resume-document li {
    margin: 0;
    line-height: 1.42;
    hyphens: none;
    overflow-wrap: normal;
    word-break: normal;
  }

  .resume-document .rd-body {
    font-size: 10px;
    color: ${c.textBody};
    line-height: 1.42;
    hyphens: none;
    overflow-wrap: normal;
    word-break: normal;
  }

  .resume-document .rd-contact {
    margin: 0;
    font-size: 10px;
    color: ${c.textMuted};
    line-height: 1.4;
  }

  .resume-document .rd-contact + .rd-contact {
    margin-top: 2px;
  }

  .resume-document .rd-section {
    margin-top: ${theme.sectionMarginTop}px;
  }

  .resume-document .rd-muted {
    color: ${c.textMuted};
  }

  .resume-document .rd-subtle {
    color: ${c.textSubtle};
    font-size: 10px;
    white-space: nowrap;
  }

  .resume-document .rd-faint {
    color: ${c.textFaint};
  }

  .resume-document .rd-small {
    font-size: 9.5px;
  }

  .resume-document .rd-row {
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  .resume-document .rd-row > div:first-child {
    flex: 1;
    min-width: 0;
  }

  .resume-document .rd-stack {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .resume-document .rd-company-item {
    padding-bottom: 8px;
  }

  .resume-document .rd-company-item:not(.rd-company-item-last) {
    margin-bottom: 8px;
    border-bottom: 1px solid ${c.divider};
  }

  .resume-document .rd-company-header {
    margin-bottom: 4px;
  }

  .resume-document .rd-company-header h3 {
    margin-bottom: 4px;
    line-height: 1.45;
  }

  .resume-document .rd-company-header .rd-muted {
    margin-bottom: 3px;
    line-height: 1.45;
  }

  .resume-document .rd-company-header .rd-faint {
    margin-bottom: 4px;
    line-height: 1.4;
  }

  .resume-document .rd-projects-list {
    margin-top: 8px;
    padding-left: 12px;
    border-left: 2px solid ${c.projectAccent};
  }

  .resume-document .rd-stack-sm {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .resume-document .rd-inline-list {
    font-size: 10.5px;
    color: ${c.textBody};
    line-height: 1.5;
  }

  .resume-document .rd-html ul {
    list-style: disc;
    padding-left: 14px;
  }

  .resume-document .rd-project-label {
    font-size: 10.5px;
    color: ${c.textBody};
    margin-bottom: 2px;
  }

  .resume-document .rd-project-item {
    padding-bottom: 8px;
  }

  .resume-document .rd-project-item:not(:last-child) {
    margin-bottom: 8px;
    border-bottom: 1px solid ${c.headerBorder};
  }

  .resume-document .rd-skills-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .resume-document .rd-skill-row {
    display: grid;
    grid-template-columns: 152px minmax(0, 1fr);
    column-gap: 10px;
    align-items: start;
    min-width: 0;
  }

  .resume-document .rd-skill-category {
    font-size: 10px;
    font-weight: 600;
    color: ${c.textMuted};
    line-height: 1.4;
    white-space: nowrap;
  }

  .resume-document .rd-skill-items {
    font-size: 10.5px;
    color: ${c.textBody};
    line-height: 1.45;
    min-width: 0;
  }

  .resume-document .rd-optional-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .resume-document .rd-optional-row {
    margin: 0;
  }

  @media print {
    .resume-document {
      padding: 24px 28px;
    }
    .resume-document .rd-header {
      margin-left: -28px;
      margin-right: -28px;
      ${theme.headerBackground ? "margin-top: -24px;" : ""}
    }
  }
`;
}

/** @deprecated Use buildResumeDocumentStyles(style) — kept for backward compatibility */
export const RESUME_DOCUMENT_STYLES = buildResumeDocumentStyles();

export const RESUME_DOCUMENT_WIDTH_PX = 794;
export const RESUME_DOCUMENT_HEIGHT_PX = 1123;

/** @deprecated Google Fonts removed for ATS-safe typography */
export const RESUME_DOCUMENT_FONT_LINK = "";
