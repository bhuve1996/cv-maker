import { v4 as uuidv4 } from "uuid";
import type {
  ClientProject,
  JobAchievement,
  JobCertification,
} from "@/types/resume";

const CLIENT_PROJECT_PATTERN =
  /([A-Z][A-Za-z0-9 '&:/.-]+?)(?:\s+([^(-]+?))?\)\s*-\s*/g;

export function parseExperienceDetails(description: string) {
  const companyDescriptionMatch = description.match(
    /^([A-Za-z ,]+?)\s+(Digital agency|Software development|Educational technology[^.]*?)\./i,
  );

  let remaining = description;
  let companyDescription = "";

  if (companyDescriptionMatch) {
    companyDescription = `${companyDescriptionMatch[2]?.trim() ?? ""}`.trim();
    remaining = description.slice(companyDescriptionMatch[0].length).trim();
  }

  const locationMatch = description.match(
    /^([A-Za-z]+(?:,\s*[A-Za-z ]+)?)\s+/,
  );
  const location = locationMatch?.[1]?.trim() ?? "";

  if (location && remaining.startsWith(location)) {
    remaining = remaining.slice(location.length).trim();
  }

  const projects = parseClientProjects(remaining);
  const certifications = parseInlineCertifications(description);
  const achievements = parseJobAchievements(description);
  const technologies = extractTechnologiesFromText(description);

  return {
    location,
    companyDescription,
    projects,
    certifications,
    achievements,
    technologies,
    description: remaining,
  };
}

function parseClientProjects(text: string): ClientProject[] {
  const projects: ClientProject[] = [];
  const chunks = text.split(
    /(?=[A-Z][A-Za-z0-9 '&:/.-]{2,40}(?:\s+[A-Za-z][^(-]+?)?\)\s*-)/,
  );

  for (const chunk of chunks) {
    const match = chunk.match(
      /^([A-Z][A-Za-z0-9 '&:/.-]+?)(?:\s+([^(-]+?))?\)\s*-\s*(.+)$/,
    );

    if (!match) continue;

    const [, client, industry, body] = match;
    const techMatch = body.match(/\(([^)]+)\)\s*$/);
    const responsibilities = body
      .replace(/\([^)]+\)\s*$/, "")
      .split(/,\s+(?=[A-Z])|;\s+/)
      .map((item) => item.trim())
      .filter(Boolean);

    projects.push({
      id: uuidv4(),
      client: client.trim(),
      industry: industry?.trim() ?? "",
      responsibilities,
      technologies: techMatch?.[1]
        ?.split(/,|\s{2,}/)
        .map((item) => item.trim())
        .filter(Boolean) ?? extractTechnologiesFromText(body),
    });
  }

  return projects;
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
  const match = text.match(/Increased[^.]+\s+by\s+(\d+%)[^.]*\./i);

  if (!match) return [];

  return [
    {
      id: uuidv4(),
      description: match[0].replace(/\s+by\s+\d+%[^.]*\./, "").trim(),
      impact: match[1] ?? "",
    },
  ];
}

function extractTechnologiesFromText(text: string): string[] {
  const parenMatches = [...text.matchAll(/\(([^)]+)\)/g)].flatMap((match) =>
    match[1]
      .split(",")
      .map((item) => item.trim())
      .filter((item) => /[A-Za-z]/.test(item) && item.length < 30),
  );

  return [...new Set(parenMatches)];
}
