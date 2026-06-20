import type { StructuredLocation } from "@/types/resume";
import { extractContactInfo, extractFullName } from "./sections";

function cleanHeaderLine(line: string): string {
  return line
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "")
    .replace(
      /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g,
      "",
    )
    .replace(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/gi, "")
    .replace(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/gi, "")
    .replace(
      /[A-Za-z][A-Za-z\s.-]{1,35},\s*[A-Za-z][A-Za-z\s.-]{1,35}(?:\s+\d{4,6})?/g,
      "",
    )
    .replace(/\s+\d{5,6}\s*$/g, "")
    .replace(/\s*\/\s*\d{5,6}\s*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractHeaderLine(text: string): string {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const headerLine =
    lines.find((line) => /engineer|developer|manager|designer/i.test(line)) ??
    lines[1] ??
    "";

  return cleanHeaderLine(headerLine);
}

export function extractTitleAndSpecialization(text: string) {
  const headerLine = extractHeaderLine(text);
  const parts = headerLine
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return {
      currentTitle: "",
      specialization: [] as string[],
      postalFromSpec: "",
    };
  }

  const currentTitle = parts[0].replace(/\s+\d.*$/, "").trim();
  let specialization = parts.slice(1);
  let postalFromSpec = "";

  if (specialization.length > 0) {
    const lastIndex = specialization.length - 1;
    const lastPart = specialization[lastIndex] ?? "";
    const postalMatch = lastPart.match(/(?:\/\s*|\s+)(\d{5,6})\s*$/);

    if (postalMatch?.[1]) {
      postalFromSpec = postalMatch[1];
      specialization[lastIndex] = lastPart
        .replace(/\s*\/\s*\d{5,6}\s*$/, "")
        .replace(/\s+\d{5,6}\s*$/, "")
        .trim();
    }
  }

  specialization = specialization
    .map((part) =>
      part
        .replace(/\s*\/\s*\d{5,6}\s*$/, "")
        .replace(/\s+\d{5,6}\s*$/, "")
        .replace(/\s*\/\s*$/, "")
        .trim(),
    )
    .filter(Boolean);

  return { currentTitle, specialization, postalFromSpec };
}

export function extractStructuredLocation(text: string): StructuredLocation {
  const match = text.match(
    /([A-Za-z][A-Za-z\s.-]{1,35}),\s*([A-Z][a-z]+)(?:\s+(\d{4,6}))?/,
  );

  if (!match) {
    return { city: "", country: "", postalCode: "" };
  }

  return {
    city: match[1]?.trim() ?? "",
    country: match[2]?.trim() ?? "",
    postalCode: match[3]?.trim() ?? "",
  };
}

export function extractPersonalInfo(text: string) {
  const contact = extractContactInfo(text);
  const { currentTitle, specialization, postalFromSpec } =
    extractTitleAndSpecialization(text);
  const location = extractStructuredLocation(text);

  if (!location.postalCode && postalFromSpec) {
    location.postalCode = postalFromSpec;
  }

  return {
    fullName: extractFullName(text),
    currentTitle,
    specialization,
    email: contact.email,
    phone: contact.phone,
    linkedIn: contact.linkedIn,
    website: contact.website,
    github: contact.github,
    location,
  };
}
