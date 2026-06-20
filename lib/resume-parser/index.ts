import { v4 as uuidv4 } from "uuid";
import type { ParseResult, Resume } from "@/types/resume";
import {
  extractContactInfo,
  extractFullName,
  extractLocation,
  identifySections,
} from "./sections";

const DATE_PATTERN =
  /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4}|\d{4}|\bPresent\b|\bCurrent\b/gi;

export function parseResumeText(text: string): ParseResult {
  const contact = extractContactInfo(text);
  const sections = identifySections(text);

  const resume: Partial<Resume> = {
    personalInfo: {
      fullName: extractFullName(text),
      email: contact.email,
      phone: contact.phone,
      location: extractLocation(text),
      linkedIn: contact.linkedIn,
      website: contact.website,
    },
    summary: sections.summary || extractFallbackSummary(text, sections),
    experience: parseExperience(sections.experience),
    education: parseEducation(sections.education),
    skills: parseSkills(sections.skills),
    projects: parseProjects(sections.projects),
    certifications: parseCertifications(sections.certifications),
  };

  const filledFields = countFilledFields(resume);
  const confidence =
    filledFields >= 8 ? "high" : filledFields >= 4 ? "medium" : "low";

  return { resume, rawText: text, confidence };
}

function extractFallbackSummary(
  text: string,
  sections: ReturnType<typeof identifySections>,
): string {
  if (sections.summary) return sections.summary;

  const lines = text.split("\n").map((line) => line.trim());
  const startIndex = lines.findIndex((line) =>
    /summary|profile|about|objective/i.test(line),
  );

  if (startIndex === -1) return "";

  const summaryLines: string[] = [];
  for (let i = startIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line) break;
    if (isLikelySectionHeader(line)) break;
    summaryLines.push(line);
  }

  return summaryLines.join(" ").slice(0, 600);
}

function parseExperience(sectionText: string) {
  if (!sectionText) return [];

  const blocks = splitIntoBlocks(sectionText);

  return blocks
    .map((block) => {
      const lines = block.split("\n").filter(Boolean);
      if (lines.length === 0) return null;

      const dateLine = lines.find((line) => DATE_PATTERN.test(line)) ?? "";
      const dates = extractDates(dateLine);
      const titleLine =
        lines.find((line) => line !== dateLine && line.length < 80) ?? lines[0];
      const companyLine =
        lines.find((line) => line !== titleLine && line !== dateLine) ?? "";
      const description = lines
        .filter((line) => line !== titleLine && line !== companyLine && line !== dateLine)
        .join("\n");

      return {
        id: uuidv4(),
        role: titleLine,
        company: companyLine,
        startDate: dates.start,
        endDate: dates.end,
        description,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function parseEducation(sectionText: string) {
  if (!sectionText) return [];

  return splitIntoBlocks(sectionText).map((block) => {
    const lines = block.split("\n").filter(Boolean);
    const dateLine = lines.find((line) => DATE_PATTERN.test(line)) ?? "";
    const dates = extractDates(dateLine);

    return {
      id: uuidv4(),
      degree: lines[0] ?? "",
      institution: lines.find((line) => line !== lines[0] && line !== dateLine) ?? "",
      startDate: dates.start,
      endDate: dates.end,
    };
  });
}

function parseSkills(sectionText: string) {
  if (!sectionText) return [];

  const technicalKeywords =
    /javascript|typescript|python|java|react|node|sql|aws|docker|kubernetes|git|html|css|api|cloud|data|machine learning|ml|ai|figma|design|agile|scrum/i;

  const items = sectionText
    .split(/[,•|\n|·|-]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 1 && item.length < 40);

  return items.map((name) => ({
    id: uuidv4(),
    name,
    category: technicalKeywords.test(name)
      ? ("technical" as const)
      : ("soft" as const),
  }));
}

function parseProjects(sectionText: string) {
  if (!sectionText) return [];

  return splitIntoBlocks(sectionText).map((block) => {
    const lines = block.split("\n").filter(Boolean);
    const techLine =
      lines.find((line) => /technologies|stack|tools|built with/i.test(line)) ??
      "";

    return {
      id: uuidv4(),
      name: lines[0] ?? "",
      description: lines.slice(1).filter((line) => line !== techLine).join("\n"),
      technologies: techLine.replace(/technologies:|stack:|tools:/i, "").trim(),
    };
  });
}

function parseCertifications(sectionText: string) {
  if (!sectionText) return [];

  return sectionText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, issuer] = line.split(/[-–—|]/).map((part) => part.trim());
      return {
        id: uuidv4(),
        name: name ?? line,
        issuer: issuer ?? "",
      };
    });
}

function splitIntoBlocks(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function extractDates(text: string) {
  const matches = [...text.matchAll(DATE_PATTERN)].map((match) => match[0]);
  return {
    start: matches[0] ?? "",
    end: matches[1] ?? "",
  };
}

function isLikelySectionHeader(line: string): boolean {
  return /^(experience|education|skills|projects|certifications|work|employment)/i.test(
    line,
  );
}

function countFilledFields(resume: Partial<Resume>): number {
  let count = 0;

  if (resume.personalInfo?.fullName) count += 1;
  if (resume.personalInfo?.email) count += 1;
  if (resume.personalInfo?.phone) count += 1;
  if (resume.summary) count += 1;
  count += resume.experience?.length ?? 0;
  count += resume.education?.length ?? 0;
  count += resume.skills?.length ?? 0;
  count += resume.projects?.length ?? 0;
  count += resume.certifications?.length ?? 0;

  return count;
}
