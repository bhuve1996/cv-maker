import { v4 as uuidv4 } from "uuid";
import { categorizeSkill } from "@/lib/resume/skill-categories";
import type { ParseResult, Resume } from "@/types/resume";
import { parseExperienceDetails } from "./experience-details";
import {
  parseInterests,
  parseKeyAchievements,
  parseSpokenLanguages,
} from "./extended-sections";
import {
  preprocessResumeText,
  splitEducationEntries,
  splitExperienceEntries,
  tokenizeSkills,
} from "./normalize-text";
import { extractPersonalInfo } from "./personal-info";
import { identifySections } from "./sections";
import { parseProfessionalSummary } from "./summary-details";

const DATE_PATTERN =
  /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\.?\s+\d{4}|\d{2}\/\d{4}|\d{4}|\bPresent\b|\bCurrent\b/gi;

const EXPERIENCE_HEADER_PATTERN =
  /^((?:Senior |Lead |Staff |Principal |Web |Software |Associate |Junior )?(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,5})\s+(?:Engineer|Developer|Manager|Designer|Architect|Consultant|Analyst|Intern|Specialist))\s+([A-Z][A-Za-z0-9 &.()-]+?)\s+(\d{2}\/\d{4}(?:\s*-\s*(?:\d{2}\/\d{4}|Present|Current))?|\d{2}\/\d{4})/;

const EDUCATION_ENTRY_PATTERN =
  /^(.+?)\s+((?:[A-Z][A-Za-z0-9 .'-]*(?:University|School|College|Institute|Academy|Vidyalaya)[A-Za-z0-9 .'-]*)|(?:St\.?\s+[A-Za-z0-9 .'-]+(?:School|College)?)|(?:Kendriya\s+Vidyalaya[^.]*?))\s+(\d{2}\/\d{4})\s*-\s*(\d{2}\/\d{4})/;

export function parseResumeText(rawText: string): ParseResult {
  const text = preprocessResumeText(rawText);
  const sections = identifySections(text);
  const summaryText = sections.summary || extractFallbackSummary(text);

  const resume: Partial<Resume> = {
    personalInfo: extractPersonalInfo(text),
    professionalSummary: parseProfessionalSummary(summaryText),
    experience: parseExperience(sections.experience),
    education: parseEducation(sections.education),
    skills: parseSkills(sections.skills),
    spokenLanguages: parseSpokenLanguages(sections.languages),
    keyAchievements: parseKeyAchievements(sections.keyAchievements),
    interests: parseInterests(sections.interests),
    projects: parseProjects(sections.projects),
    certifications: parseCertifications(sections.certifications, text),
  };

  const filledFields = countFilledFields(resume);
  const confidence =
    filledFields >= 12 ? "high" : filledFields >= 6 ? "medium" : "low";

  return { resume, rawText, confidence };
}

function extractFallbackSummary(text: string): string {
  const lines = text.split("\n").map((line) => line.trim());
  const startIndex = lines.findIndex((line) =>
    /^(professional\s+)?summary$|^profile$|^about(\s+me)?$|^objective$/i.test(
      line,
    ),
  );

  if (startIndex === -1) return "";

  const summaryLines: string[] = [];
  for (let i = startIndex + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line) break;
    if (isLikelySectionHeader(line)) break;
    summaryLines.push(line);
  }

  return summaryLines.join(" ").slice(0, 800);
}

function parseExperience(sectionText: string) {
  if (!sectionText) return [];

  const entries = splitExperienceEntries(sectionText);

  return entries
    .map((block) => {
      const normalized = block.replace(/\n+/g, " ").trim();
      const headerMatch = normalized.match(EXPERIENCE_HEADER_PATTERN);

      if (headerMatch) {
        const [, role, company, dateRange] = headerMatch;
        const dates = extractDates(dateRange);
        const body = normalized.slice(headerMatch[0].length).trim();
        const details = parseExperienceDetails(body);

        return {
          id: uuidv4(),
          role: role.trim(),
          company: company.trim(),
          startDate: dates.start,
          endDate: dates.end || "Present",
          location: details.location,
          companyDescription: details.companyDescription,
          description: details.description,
          projects: details.projects,
          certifications: details.certifications,
          achievements: details.achievements,
          technologies: details.technologies,
        };
      }

      return parseExperienceFallback(block);
    })
    .filter(
      (item): item is NonNullable<typeof item> =>
        Boolean(item && (item.role || item.company)),
    );
}

function parseExperienceFallback(block: string) {
  const lines = block.split("\n").filter(Boolean);
  if (lines.length === 0) return null;

  const dateLine = lines.find((line) => DATE_PATTERN.test(line)) ?? "";
  const dates = extractDates(dateLine);
  const titleLine =
    lines.find((line) => line !== dateLine && line.length < 80) ?? lines[0];
  const companyLine =
    lines.find((line) => line !== titleLine && line !== dateLine) ?? "";
  const description = lines
    .filter(
      (line) => line !== titleLine && line !== companyLine && line !== dateLine,
    )
    .join("\n");

  return {
    id: uuidv4(),
    role: titleLine,
    company: companyLine,
    startDate: dates.start,
    endDate: dates.end,
    location: "",
    companyDescription: "",
    description,
    projects: [],
    certifications: [],
    achievements: [],
    technologies: [],
  };
}

function parseEducation(sectionText: string) {
  if (!sectionText) return [];

  return splitEducationEntries(sectionText)
    .map((block) => {
      const normalized = block.replace(/\n+/g, " ").trim();
      const match = normalized.match(EDUCATION_ENTRY_PATTERN);

      if (match) {
        const [, degree, institution, startDate, endDate] = match;
        const boardMatch = degree.match(/CBSE|ICSE|State Board/i);
        const locationMatch = normalized.match(
          /\d{2}\/\d{4}\s*-\s*\d{2}\/\d{4}\s+([A-Za-z .,-]+)$/,
        );

        return {
          id: uuidv4(),
          degree: degree.trim(),
          institution: institution.trim(),
          board: boardMatch?.[0] ?? "",
          location: locationMatch?.[1]?.trim() ?? "",
          startDate,
          endDate,
        };
      }

      const lines = block.split("\n").filter(Boolean);
      const dateLine = lines.find((line) => DATE_PATTERN.test(line)) ?? "";
      const dates = extractDates(dateLine);

      return {
        id: uuidv4(),
        degree: lines[0] ?? "",
        institution:
          lines.find((line) => line !== lines[0] && line !== dateLine) ?? "",
        board: "",
        location: "",
        startDate: dates.start,
        endDate: dates.end,
      };
    })
    .filter((item) => item.degree.length > 3 && (item.institution || item.degree));
}

function parseSkills(sectionText: string) {
  if (!sectionText) return [];

  const items = tokenizeSkills(sectionText);

  return items.map((name) => ({
    id: uuidv4(),
    name,
    category: categorizeSkill(name),
  }));
}

function parseProjects(sectionText: string) {
  if (!sectionText) return [];

  return sectionText
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
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

function parseCertifications(sectionText: string, fullText: string) {
  const entries = sectionText
    ? sectionText
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
        })
    : [];

  const inlineCertMatch = fullText.match(
    /((?:Shopify Plus|AWS|Azure|Google Cloud|PMP|Scrum Master)[^.\n]*Certification[^.\n]*)/i,
  );

  if (inlineCertMatch) {
    entries.push({
      id: uuidv4(),
      name: inlineCertMatch[1].trim(),
      issuer: "",
    });
  }

  return entries;
}

function extractDates(text: string) {
  const matches = [...text.matchAll(DATE_PATTERN)].map((match) => match[0]);
  const rangeParts = text.split(/\s*-\s*/);

  if (rangeParts.length >= 2) {
    const startMatch = rangeParts[0].match(DATE_PATTERN);
    const endMatch = rangeParts.slice(1).join("-").match(DATE_PATTERN);
    return {
      start: startMatch?.[0] ?? matches[0] ?? "",
      end: endMatch?.[0] ?? matches[1] ?? "",
    };
  }

  return {
    start: matches[0] ?? "",
    end: matches[1] ?? "",
  };
}

function isLikelySectionHeader(line: string): boolean {
  return /^(experience|education|skills|projects|certifications|work|employment|key achievements|languages|interests)$/i.test(
    line.replace(/[:\-–—|•*#]+$/g, "").trim(),
  );
}

function countFilledFields(resume: Partial<Resume>): number {
  let count = 0;

  if (resume.personalInfo?.fullName) count += 1;
  if (resume.personalInfo?.email) count += 1;
  if (resume.personalInfo?.phone) count += 1;
  if (resume.personalInfo?.currentTitle) count += 1;
  if (resume.professionalSummary?.text) count += 1;
  count += resume.experience?.length ?? 0;
  count += resume.experience?.flatMap((item) => item.projects).length ?? 0;
  count += resume.education?.length ?? 0;
  count += resume.skills?.length ?? 0;
  count += resume.spokenLanguages?.length ?? 0;
  count += resume.keyAchievements?.length ?? 0;
  count += resume.interests?.length ?? 0;
  count += resume.projects?.length ?? 0;
  count += resume.certifications?.length ?? 0;

  return count;
}
