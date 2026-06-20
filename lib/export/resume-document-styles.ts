/** Export/print-safe resume styles — hex/rgb only (no lab/oklch) for html2canvas compatibility */
export const RESUME_DOCUMENT_STYLES = `
  .resume-document {
    box-sizing: border-box;
    width: 794px;
    min-height: auto;
    margin: 0 auto;
    padding: 22px 28px;
    background: #ffffff;
    color: #0f172a;
    font-family: Helvetica, Arial, Calibri, Verdana, Tahoma, ui-sans-serif, sans-serif;
    font-size: 10px;
    line-height: 1.38;
  }

  .resume-document * {
    box-sizing: border-box;
  }

  .resume-document .rd-header {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 10px;
  }

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
    color: #0f172a;
  }

  .resume-document .rd-title {
    margin: 0 0 4px;
    font-size: 12px;
    font-weight: 600;
    color: #334155;
    line-height: 1.35;
  }

  .resume-document .rd-specialization {
    margin: 0;
    font-size: 10px;
    color: #64748b;
    line-height: 1.4;
  }

  .resume-document .rd-contact-block {
    margin-top: 8px;
  }

  .resume-document h2 {
    margin: 0;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: #1e293b;
  }

  .resume-document h3 {
    margin: 0 0 2px;
    font-size: 12px;
    font-weight: 600;
    color: #0f172a;
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
    color: #334155;
    line-height: 1.42;
    hyphens: none;
    overflow-wrap: normal;
    word-break: normal;
  }

  .resume-document .rd-contact {
    margin: 0;
    font-size: 10px;
    color: #475569;
    line-height: 1.4;
  }

  .resume-document .rd-contact + .rd-contact {
    margin-top: 2px;
  }

  .resume-document .rd-section {
    margin-top: 9px;
  }

  .resume-document .rd-section-title {
    margin-bottom: 6px;
  }

  .resume-document .rd-separator {
    height: 1px;
    margin-top: 4px;
    background: #cbd5e1;
  }

  .resume-document .rd-muted {
    color: #475569;
  }

  .resume-document .rd-subtle {
    color: #64748b;
    font-size: 10px;
    white-space: nowrap;
  }

  .resume-document .rd-faint {
    color: #94a3b8;
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
    border-bottom: 1px solid #cbd5e1;
  }

  .resume-document .rd-company-header {
    margin-bottom: 2px;
  }

  .resume-document .rd-projects-list {
    margin-top: 8px;
    padding-left: 12px;
    border-left: 2px solid #e2e8f0;
  }

  .resume-document .rd-stack-sm {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .resume-document .rd-inline-list {
    font-size: 10.5px;
    color: #334155;
    line-height: 1.5;
  }

  .resume-document .rd-html ul {
    list-style: disc;
    padding-left: 14px;
  }

  .resume-document .rd-project-label {
    font-size: 10.5px;
    color: #334155;
    margin-bottom: 2px;
  }

  .resume-document .rd-project-item {
    padding-bottom: 8px;
  }

  .resume-document .rd-project-item:not(:last-child) {
    margin-bottom: 8px;
    border-bottom: 1px solid #e2e8f0;
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
    color: #475569;
    line-height: 1.4;
    white-space: nowrap;
  }

  .resume-document .rd-skill-items {
    font-size: 10.5px;
    color: #334155;
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
  }
`;

export const RESUME_DOCUMENT_WIDTH_PX = 794;
export const RESUME_DOCUMENT_HEIGHT_PX = 1123;

/** @deprecated Google Fonts removed for ATS-safe typography */
export const RESUME_DOCUMENT_FONT_LINK = "";
