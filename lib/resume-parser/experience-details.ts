import { isValidProjectClient } from "@/lib/resume/dedupe-projects";
import { v4 as uuidv4 } from "uuid";
import type {
  ClientProject,
  JobCertification,
  JobAchievement,
} from "@/types/resume";

const VERB_CLIENT_NAMES =
  /^(Developed|Architected|Integrated|Optimized|Translated|Rebuilt|Implemented|Designed|Built|Created|Led|Managed|Maintained|Ensuring)$/i;

const PAREN_PROJECT_RE =
  /([A-Z][A-Za-z0-9&'/-]+(?:\s+[A-Za-z][^).]{0,80}){0,8})\s*\)\s*-\s*/g;

const DASH_PROJECT_RE =
  /([A-Z][A-Za-z0-9&'./-]+(?:\s+[A-Za-z][^,-.]{0,80}){0,8})\s+-\s+/g;

const COLON_PROJECT_RE =
  /([A-Z][A-Za-z0-9&'./-]+(?:\s+[A-Z][a-z]+){0,5})\s*:\s+/g;

const COLON_BODY_START =
  /^(?:Translated|Developed|Architected|Integrated|Implemented|Designed|Built|Rebuilt|Optimized|Led|Managed|Ensuring|Delivered|Created|Maintained|Improved|Customized|Streamlined|Collaborated|Supported|Enhanced|Automated|Deployed)/;

const NON_CLIENT_HEADERS =
  /^(Note|See|Ref|Source|Role|Company|Client|Project|Technologies|Stack|Tools)$/i;

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

  const projectStart = findFirstProjectIndex(remaining);
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

function findFirstProjectIndex(text: string): number {
  const parenMatch = text.match(
    /([A-Z][A-Za-z0-9&'/-]+(?:\s+[A-Za-z][^).]{0,80}){0,8})\s*\)\s*-\s*/,
  );
  if (parenMatch?.index != null && parenMatch.index >= 0) {
    return parenMatch.index;
  }

  const dashMatch = text.match(
    /([A-Z][A-Za-z0-9&'./-]+(?:\s+[A-Za-z][^,-.]{0,80}){0,8})\s+-\s+/,
  );
  if (dashMatch?.index != null && dashMatch.index >= 0) {
    const header = dashMatch[1]?.trim() ?? "";
    if (isValidClientHeader(header)) {
      return dashMatch.index;
    }
  }

  const colonMatch = text.match(COLON_PROJECT_RE);
  if (colonMatch?.index != null && colonMatch.index >= 0) {
    const header = colonMatch[1]?.trim() ?? "";
    const bodyStart = colonMatch.index + colonMatch[0].length;
    const body = text.slice(bodyStart).trim();
    if (isValidClientHeader(header) && COLON_BODY_START.test(body)) {
      return colonMatch.index;
    }
  }

  return -1;
}

function parseClientProjects(text: string): ClientProject[] {
  if (!text.trim()) return [];

  const normalized = text.replace(/\)(?=-)/g, ") ").trim();
  type ProjectMatch = { index: number; header: string; bodyStart: number };
  const matches: ProjectMatch[] = [];

  for (const match of normalized.matchAll(
    /([A-Z][A-Za-z0-9&'/-]+(?:\s+[A-Za-z][^).]{0,80}){0,8})\s*\)\s*-\s*/g,
  )) {
    if (match.index == null) continue;
    const header = match[1]?.trim() ?? "";
    if (!isValidClientHeader(header)) continue;

    matches.push({
      index: match.index,
      header,
      bodyStart: match.index + match[0].length,
    });
  }

  for (const match of normalized.matchAll(DASH_PROJECT_RE)) {
    const matchIndex = match.index;
    if (matchIndex == null) continue;
    const header = match[1]?.trim() ?? "";
    if (!isValidClientHeader(header)) continue;

    const overlaps = matches.some(
      (item) => Math.abs(item.index - matchIndex) < 5,
    );
    if (!overlaps) {
      matches.push({
        index: matchIndex,
        header,
        bodyStart: matchIndex + match[0].length,
      });
    }
  }

  for (const match of normalized.matchAll(COLON_PROJECT_RE)) {
    const matchIndex = match.index;
    if (matchIndex == null) continue;
    const header = match[1]?.trim() ?? "";
    if (!isValidClientHeader(header)) continue;

    const bodyStart = matchIndex + match[0].length;
    const body = normalized.slice(bodyStart).trim();
    if (!COLON_BODY_START.test(body)) continue;

    const overlaps = matches.some(
      (item) => Math.abs(item.index - matchIndex) < 5,
    );
    if (!overlaps) {
      matches.push({
        index: matchIndex,
        header,
        bodyStart,
      });
    }
  }

  matches.sort((a, b) => a.index - b.index);

  return matches.map((item, index) => {
    const bodyEnd =
      index + 1 < matches.length ? matches[index + 1].index : normalized.length;
    const body = normalized.slice(item.bodyStart, bodyEnd).trim();
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
  if (!header || header.length > 120) return false;
  if (header.includes(".")) return false;
  if (NON_CLIENT_HEADERS.test(header.trim())) return false;
  if (VERB_CLIENT_NAMES.test(header.split(/\s+/)[0] ?? "")) return false;
  return isValidProjectClient(header);
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

  const commaSplit = trimmed.match(/^([^,]{2,60}),\s*(.+)$/);
  if (commaSplit) {
    return {
      client: commaSplit[1]?.trim() ?? trimmed,
      industry: commaSplit[2]?.trim() ?? "",
    };
  }

  const words = trimmed.split(/\s+/);
  if (words.length <= 3) {
    return { client: trimmed, industry: "" };
  }

  const clientWordCount = Math.min(4, Math.ceil(words.length / 2));
  return {
    client: words.slice(0, clientWordCount).join(" "),
    industry: words.slice(clientWordCount).join(" "),
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
    /([A-Z][A-Za-z0-9+ .-]{2,80}\bCertification\b)/gi,
  );

  return [...matches].map((match) => {
    const name = match[1]?.trim() ?? "";
    const context = text.slice(match.index ?? 0, (match.index ?? 0) + 180);
    const statusMatch = context.match(
      /(?:successfully completed|completed|certified|in progress)[^..\n]*/i,
    );

    return {
      id: uuidv4(),
      name,
      status: statusMatch?.[0]?.trim() ?? "",
    };
  });
}

function parseJobAchievements(text: string): JobAchievement[] {
  const matches = text.matchAll(
    /([A-Z][^.!?]{10,200}?)\sby\s(\d+%|\$[\d,]+|[\d,.]+x)[^.!?]*[.!?]/gi,
  );

  return [...matches].map((match) => ({
    id: uuidv4(),
    description: match[1]?.trim() ?? "",
    impact: match[2]?.trim() ?? "",
  }));
}
