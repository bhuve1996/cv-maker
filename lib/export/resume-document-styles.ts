/** Export/print-safe resume styles — hex/rgb only (no lab/oklch) for html2canvas compatibility */
export const RESUME_DOCUMENT_FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap";

export const RESUME_DOCUMENT_STYLES = `
  .resume-document {
    box-sizing: border-box;
    width: 794px;
    min-height: auto;
    margin: 0 auto;
    padding: 28px 32px;
    background: #ffffff;
    color: #0f172a;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 10.5px;
    line-height: 1.45;
  }

  .resume-document * {
    box-sizing: border-box;
  }

  .resume-document h1 {
    margin: 0;
    font-family: "Playfair Display", Georgia, "Times New Roman", serif;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: #0f172a;
  }

  .resume-document h2 {
    margin: 0;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #1e293b;
  }

  .resume-document h3 {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    color: #0f172a;
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
    line-height: 1.45;
  }

  .resume-document .rd-header {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 12px;
  }

  .resume-document .rd-title {
    margin-top: 2px;
    font-size: 12px;
    font-weight: 500;
    color: #334155;
  }

  .resume-document .rd-specialization {
    margin-top: 2px;
    font-size: 10.5px;
    color: #64748b;
  }

  .resume-document .rd-contact {
    margin-top: 8px;
    font-size: 10.5px;
    color: #475569;
    line-height: 1.5;
  }

  .resume-document .rd-section {
    margin-top: 14px;
  }

  .resume-document .rd-section-title {
    margin-bottom: 8px;
  }

  .resume-document .rd-separator {
    height: 1px;
    margin-top: 3px;
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

  .resume-document .rd-body {
    font-size: 10.5px;
    color: #334155;
    line-height: 1.5;
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
    padding-bottom: 12px;
  }

  .resume-document .rd-company-item:not(:last-child) {
    margin-bottom: 12px;
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

  .resume-document .rd-category-label {
    margin-bottom: 2px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #64748b;
  }

  .resume-document .rd-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
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

  .resume-document .rd-skills-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 20px;
  }

  .resume-document .rd-skill-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
  }

  .resume-document .rd-skill-category {
    flex: 0 0 38%;
    font-size: 10px;
    font-weight: 600;
    color: #475569;
    line-height: 1.4;
  }

  .resume-document .rd-skill-items {
    flex: 1;
    font-size: 10.5px;
    color: #334155;
    line-height: 1.45;
  }

  @media print {
    .resume-document {
      padding: 24px 28px;
    }
  }
`;

export const RESUME_DOCUMENT_WIDTH_PX = 794;
export const RESUME_DOCUMENT_HEIGHT_PX = 1123;
