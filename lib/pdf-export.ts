"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  RESUME_DOCUMENT_STYLES,
  RESUME_DOCUMENT_WIDTH_PX,
} from "@/lib/export/resume-document-styles";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

function buildExportHtml(element: HTMLElement): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>${RESUME_DOCUMENT_STYLES}</style>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;">
    ${element.outerHTML}
  </body>
</html>`;
}

async function renderInIsolatedIframe(
  element: HTMLElement,
): Promise<{ iframe: HTMLIFrameElement; target: HTMLElement }> {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = `${RESUME_DOCUMENT_WIDTH_PX}px`;
  iframe.style.height = "auto";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument;
  if (!doc) {
    document.body.removeChild(iframe);
    throw new Error("Could not create export frame.");
  }

  doc.open();
  doc.write(buildExportHtml(element));
  doc.close();

  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
    setTimeout(resolve, 150);
  });

  const target = doc.querySelector(".resume-document") as HTMLElement | null;
  if (!target) {
    document.body.removeChild(iframe);
    throw new Error("Resume document not found for export.");
  }

  return { iframe, target };
}

export async function downloadResumePdf(
  element: HTMLElement,
  filename = "resume.pdf",
): Promise<void> {
  const { iframe, target } = await renderInIsolatedIframe(element);

  try {
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: RESUME_DOCUMENT_WIDTH_PX,
      windowWidth: RESUME_DOCUMENT_WIDTH_PX,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = A4_WIDTH_MM;
    const pageHeight = A4_HEIGHT_MM;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  } finally {
    document.body.removeChild(iframe);
  }
}

export function printResume(): void {
  window.print();
}
