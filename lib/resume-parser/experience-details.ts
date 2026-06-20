import { v4 as uuidv4 } from "uuid";
import type {
  ClientProject,
  JobCertification,
  JobAchievement,
} from "@/types/resume";

const CLIENT_MARKERS = [
  "The Kusnacht Practice",
  "Nexeon",
  "Melbourne Convention Bureau",
  "Visit Victoria",
  "Bunnings",
  "SBER Bank",
  "ADIB Bank",
  "GreatMocks",
];

const INVALID_CLIENT_NAMES =
  /^(Developed|Architected|Integrated|Optimized|Translated|Rebuilt|Mock|Sanity|Contentful|Vue|Fetched|Ensuring)$/i;

export function parseExperienceDetails(description: string) {
  let remaining = description.trim();

  const locationMatch = remaining.match(
    /^([A-Za-z][A-Za-z\s.-]{1,35}),\s*([A-Z][a-z]+)(?:\s+(\d{4,6}))?\s+/,
  );
  let location = "";
  if (locationMatch) {
    location = [locationMatch[1], locationMatch[2]].filter(Boolean).join(", ").trim();
    remaining = remaining.slice(locationMatch[0].length).trim();
  }

  const projectStart = findProjectStartIndex(remaining);
  let companyDescription = "";
  let projectText = remaining;

  if (projectStart > 0) {
    companyDescription = remaining.slice(0, projectStart).trim();
    projectText = remaining.slice(projectStart).trim();
  }

  const projects = parseClientProjects(projectText);
  const certifications = parseInlineCertifications(description);
  const achievements = parseJobAchievements(description);

  return {
    location,
    companyDescription,
    projects,
    certifications,
    achievements,
    technologies: [],
    description: projects.length > 0 ? "" : remaining,
  };
}

function findProjectStartIndex(text: string): number {
  const indices = CLIENT_MARKERS.map((marker) => text.indexOf(marker)).filter(
    (index) => index >= 0,
  );

  return indices.length > 0 ? Math.min(...indices) : -1;
}

function parseClientProjects(text: string): ClientProject[] {
  if (!text.trim()) return [];

  const normalized = text.replace(/\)(?=-)/g, ") ").trim();
  type ProjectMatch = { index: number; header: string; bodyStart: number };
  const matches: ProjectMatch[] = [];

  const parenPattern =
    /([A-Z][A-Za-z0-9&'/-]+(?:\s+[A-Za-z][^).]{0,60}){0,6})\s*\)\s*-\s*/g;

  for (const match of normalized.matchAll(parenPattern)) {
    if (match.index == null) continue;
    const header = match[1]?.trim() ?? "";
    if (!isValidClientHeader(header)) continue;

    matches.push({
      index: match.index,
      header,
      bodyStart: match.index + match[0].length,
    });
  }

  const bankPattern =
    /([A-Z][A-Za-z0-9&'./-]+(?:\s+[A-Za-z][^,-.]{0,60}){0,6}(?:,\s*[A-Z]{2,3})?)\s+-\s+/g;

  for (const match of normalized.matchAll(bankPattern)) {
    if (match.index == null) continue;
    const header = match[1]?.trim() ?? "";
    if (!isValidClientHeader(header)) continue;

    const overlaps = matches.some(
      (item) => Math.abs(item.index - match.index) < 5,
    );
    if (!overlaps) {
      matches.push({
        index: match.index,
        header,
        bodyStart: match.index + match[0].length,
      });
    }
  }

  matches.sort((a, b) => a.index - b.index);

  return matches.map((item, index) => {
    const bodyEnd =
      index + 1 < matches.length ? matches[index + 1].index : normalized.length;
    let body = normalized.slice(item.bodyStart, bodyEnd).trim();
    const { body: cleanBody, technologies } = stripTrailingTechStack(body);
    const { client, industry } = splitClientHeader(item.header);

    return {
      id: uuidv4(),
      client,
      industry,
      responsibilities: cleanBody
        ? [cleanBody.replace(/\s+/g, " ").trim()]
        : [],
      technologies,
    };
  });
}

function isValidClientHeader(header: string): boolean {
  if (!header || header.length > 90) return false;
  if (header.includes(".")) return false;
  if (INVALID_CLIENT_NAMES.test(header.split(/\s+/)[0] ?? "")) return false;
  return true;
}

function splitClientHeader(header: string): { client: string; industry: string } {
  const trimmed = header.trim();
  const doubleSpace = trimmed.split(/\s{2,}/);

  if (doubleSpace.length >= 2) {
    return {
      client: doubleSpace[0]?.trim() ?? trimmed,
      industry: doubleSpace.slice(1).join(" ").trim(),
    };
  }

  for (const prefix of CLIENT_MARKERS) {
    if (trimmed.startsWith(prefix)) {
      return {
        client: prefix,
        industry: trimmed.slice(prefix.length).trim(),
      };
    }
  }

  const words = trimmed.split(/\s+/);
  if (words.length <= 2) {
    return { client: trimmed, industry: "" };
  }

  return {
    client: words[0] ?? trimmed,
    industry: words.slice(1).join(" "),
  };
}

function stripTrailingTechStack(text: string): {
  body: string;
  technologies: string[];
} {
  const match = text.match(/\s([A-Za-z0-9 .,/]+)\)\s*$/);
  if (!match?.index) {
    return { body: text.trim(), technologies: [] };
  }

  const technologies = match[1]
    .split(/,\s*/)
    .map((item) => item.trim())
    .filter((item) => item.length > 1 && item.length < 30);

  return {
    body: text.slice(0, match.index).trim(),
    technologies,
  };
}

function parseInlineCertifications(text: string): JobCertification[] {
  const matches = text.matchAll(
    /((?:Shopify Plus|AWS|Azure|Google Cloud|PMP|Scrum Master)[^.\n]*Certification[^.\n]*)/gi,
  );

  return [...matches].map((match) => ({
    id: uuidv4(),
    name: match[1]?.trim() ?? "",
    status: /successfully completed|completed|certified/i.test(match[0])
      ? "Successfully completed"
      : "",
  }));
}

function parseJobAchievements(text: string): JobAchievement[] {
  const match = text.match(/Increased[^.]+\sby\s(\d+%)[^.]*\./i);

  if (!match) return [];

  return [
    {
      id: uuidv4(),
      description: match[0].replace(/\sby\s\d+%[^.]*\./, "").trim(),
      impact: match[1] ?? "",
    },
  ];
}
