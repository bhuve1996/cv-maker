"use client";

import type { PdfStructureAnalysis } from "@/types/ats-audit";

const DECORATIVE_FONT_HINTS = [
  "poppins",
  "montserrat",
  "futura",
  "bebas",
  "playfair",
  "script",
  "handwriting",
  "comic",
  "lobster",
  "pacifico",
];

const SYMBOL_FONT_HINTS = ["zapfdingbats", "wingdings", "symbol", "icon"];

interface TextItemWithMeta {
  str: string;
  transform?: number[];
  fontName?: string;
}

export async function analyzePdfStructure(file: File): Promise<PdfStructureAnalysis> {
  const pdfjs = await import("pdfjs-dist");

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const fileSizeBytes = arrayBuffer.byteLength;
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const fonts = new Set<string>();
  let extractedTextLength = 0;
  let textItemCount = 0;
  let multiColumnPages = 0;

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const items = content.items as TextItemWithMeta[];

    const xPositions: number[] = [];

    for (const item of items) {
      const text = item.str?.trim() ?? "";
      if (!text) continue;

      extractedTextLength += text.length;
      textItemCount += 1;

      if (item.fontName) {
        fonts.add(item.fontName.replace(/^[^+]*\+/, ""));
      }

      const x = item.transform?.[4];
      if (typeof x === "number") {
        xPositions.push(x);
      }
    }

    if (xPositions.length >= 8) {
      const sorted = [...xPositions].sort((a, b) => a - b);
      const gaps: number[] = [];
      for (let i = 1; i < sorted.length; i += 1) {
        gaps.push(sorted[i]! - sorted[i - 1]!);
      }
      const largeGaps = gaps.filter((gap) => gap > 120);
      if (largeGaps.length >= 2) {
        multiColumnPages += 1;
      }
    }
  }

  const fontList = [...fonts];
  const lowerFonts = fontList.map((font) => font.toLowerCase());
  const textToFileSizeRatio =
    fileSizeBytes > 0 ? extractedTextLength / fileSizeBytes : 0;

  const isLikelyScanned =
    extractedTextLength < 200 && fileSizeBytes > 100_000 && textToFileSizeRatio < 0.002;

  const hasDecorativeFonts = lowerFonts.some((font) =>
    DECORATIVE_FONT_HINTS.some((hint) => font.includes(hint)),
  );

  const hasSymbolFonts = lowerFonts.some((font) =>
    SYMBOL_FONT_HINTS.some((hint) => font.includes(hint)),
  );

  return {
    fileSizeBytes,
    pageCount: pdf.numPages,
    extractedTextLength,
    textItemCount,
    fonts: fontList,
    isLikelyScanned,
    hasMultiColumnSignal: multiColumnPages > 0,
    hasDecorativeFonts,
    hasSymbolFonts,
    textToFileSizeRatio,
  };
}

export async function extractTextFromPdfFile(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(pageText);
  }

  return pages
    .join("\n\n")
    .replace(/\u0000/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
