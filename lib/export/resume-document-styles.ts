/** Export/print-safe resume styles — hex/rgb only (no lab/oklch) for html2canvas compatibility */
export const RESUME_DOCUMENT_STYLES = `
  .resume-document {
    box-sizing: border-box;
    width: 794px;
    min-height: 1123px;
    margin: 0 auto;
    padding: 40px;
    background: #ffffff;
    color: #0f172a;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 11px;
    line-height: 1.5;
  }

  .resume-document * {
    box-sizing: border-box;
  }

  .resume-document h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #0f172a;
  }

  .resume-document h2 {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #1e293b;
  }

  .resume-document h3 {
    margin: 0;
    font-size: 13px;
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
    padding-left: 16px;
  }

  .resume-document li {
    margin: 0;
  }

  .resume-document .rd-header {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 20px;
  }

  .resume-document .rd-title {
    margin-top: 4px;
    font-size: 13px;
    font-weight: 500;
    color: #334155;
  }

  .resume-document .rd-specialization {
    margin-top: 4px;
    font-size: 11px;
    color: #64748b;
  }

  .resume-document .rd-contact {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
    margin-top: 12px;
    font-size: 11px;
    color: #475569;
  }

  .resume-document .rd-section {
    margin-top: 24px;
  }

  .resume-document .rd-section-title {
    margin-bottom: 12px;
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
  }

  .resume-document .rd-faint {
    color: #94a3b8;
  }

  .resume-document .rd-small {
    font-size: 10px;
  }

  .resume-document .rd-body {
    font-size: 11px;
    color: #334155;
    line-height: 1.6;
  }

  .resume-document .rd-row {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
  }

  .resume-document .rd-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .resume-document .rd-stack-sm {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .resume-document .rd-badge {
    display: inline-flex;
    align-items: center;
    border-radius: 6px;
    background: #f1f5f9;
    color: #334155;
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 400;
    margin: 0 4px 4px 0;
  }

  .resume-document .rd-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 8px;
  }

  .resume-document .rd-category-label {
    margin-bottom: 8px;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
  }

  .resume-document .rd-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
  }

  .resume-document .rd-html ul {
    list-style: disc;
    padding-left: 16px;
  }
`;

export const RESUME_DOCUMENT_WIDTH_PX = 794;
export const RESUME_DOCUMENT_HEIGHT_PX = 1123;
