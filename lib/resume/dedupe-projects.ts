import { coerceString } from "@/lib/resume/coerce-string";
import {
  extractInlineTechnologyList,
  inferTechnologiesFromText,
  isValidTechnology,
  normalizeTechnologyList,
} from "@/lib/resume/normalize-technologies";
import type { ClientProject } from "@/types/resume";

const INVALID_CLIENT_PATTERNS = [
  /^(digital agency|software development|educational technology|technology service)/i,
  /^(a software|mock test solutions|solutions?\)?)$/i,
  /delivering exceptional/i,
  /service provider/i,
  /company specializing/i,
  /^(experiences|exceptional|provider|specializing|delivering)\b/i,
];

export function normalizeClientKey(client: string): string {
  return coerceString(client)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isValidProjectClient(
  client: string,
  companyDescription = "",
): boolean {
  const trimmed = coerceString(client).trim();
  if (!trimmed || trimmed.length < 2 || trimmed.length > 80) return false;
  if (/[)\]$]/.test(trimmed)) return false;
  if (INVALID_CLIENT_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return false;
  }

  const clientKey = normalizeClientKey(trimmed);
  const companyKey = normalizeClientKey(companyDescription);

  if (companyKey.length > 12 && clientKey.length > 12) {
    if (companyKey.includes(clientKey) || clientKey.includes(companyKey)) {
      return false;
    }
  }

  return true;
}

export function clientsOverlap(a: string, b: string): boolean {
  const keyA = normalizeClientKey(a);
  const keyB = normalizeClientKey(b);
  if (!keyA || !keyB) return false;
  if (keyA === keyB) return true;

  const shorter = keyA.length <= keyB.length ? keyA : keyB;
  const longer = keyA.length <= keyB.length ? keyB : keyA;
  if (shorter.length >= 4 && longer.includes(shorter)) return true;

  const firstA = keyA.split(" ")[0] ?? "";
  const firstB = keyB.split(" ")[0] ?? "";
  if (firstA.length >= 4 && firstA === firstB) return true;

  return false;
}

function normalizeResponsibility(text: string): string {
  return coerceString(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function responsibilitiesSimilar(a: string, b: string): boolean {
  const normA = normalizeResponsibility(a);
  const normB = normalizeResponsibility(b);
  if (!normA || !normB) return false;

  const minLen = Math.min(normA.length, normB.length);
  if (minLen < 24) return false;

  const snippetLen = Math.min(72, minLen);
  const snippetA = normA.slice(0, snippetLen);
  const snippetB = normB.slice(0, snippetLen);
  return normA.includes(snippetB) || normB.includes(snippetA);
}

export function isValidProjectTechnology(tech: string): boolean {
  return isValidTechnology(tech);
}

export function enrichProjectTechnologies(
  project: ClientProject,
  pool: string[],
): ClientProject {
  const text = project.responsibilities.join(" ");
  const validPool = normalizeTechnologyList(pool);

  const technologies = normalizeTechnologyList([
    ...project.technologies,
    ...inferTechnologiesFromText(text, validPool),
    ...extractInlineTechnologyList(text),
  ]);

  return {
    ...project,
    technologies,
  };
}

function stripCertificationFromResponsibility(text: string): string {
  return coerceString(text)
    .replace(
      /\s*successfully completed and actively participated[^.]*(?:certification\b[^.]*)?\.?\s*$/i,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function scoreProject(project: ClientProject): number {
  let score = 0;
  if (project.technologies.length > 0) score += 4;
  const primary = project.responsibilities[0] ?? "";
  if (primary.length > 40) score += 3;
  if (project.client.length <= 36) score += 2;
  if (project.industry && !project.industry.includes(project.client)) score += 1;
  if (isValidProjectClient(project.client)) score += 2;
  return score;
}

function projectsMatch(a: ClientProject, b: ClientProject): boolean {
  if (clientsOverlap(a.client, b.client)) return true;

  const respA = a.responsibilities[0] ?? "";
  const respB = b.responsibilities[0] ?? "";
  return respA.length > 0 && respB.length > 0 && responsibilitiesSimilar(respA, respB);
}

function mergeProjects(a: ClientProject, b: ClientProject): ClientProject {
  const preferred = scoreProject(a) >= scoreProject(b) ? a : b;
  const other = preferred === a ? b : a;

  const technologies = normalizeTechnologyList([
    ...a.technologies,
    ...b.technologies,
  ]);

  const preferredResp = preferred.responsibilities[0] ?? "";
  const otherResp = other.responsibilities[0] ?? "";
  const responsibilities =
    preferredResp.length >= otherResp.length
      ? preferred.responsibilities
      : other.responsibilities;

  return {
    ...preferred,
    technologies,
    responsibilities,
    industry: preferred.industry || other.industry,
  };
}

function cleanProject(project: ClientProject): ClientProject {
  return {
    ...project,
    client: coerceString(project.client).trim(),
    industry: coerceString(project.industry).trim(),
    technologies: normalizeTechnologyList(project.technologies),
    responsibilities: project.responsibilities
      .map((item) => stripCertificationFromResponsibility(coerceString(item)))
      .filter(Boolean),
  };
}

export function dedupeClientProjects(
  projects: ClientProject[],
  companyDescription = "",
): ClientProject[] {
  const candidates = projects
    .map(cleanProject)
    .filter(
      (project) =>
        isValidProjectClient(project.client, companyDescription) &&
        project.responsibilities.length > 0,
    );

  const result: ClientProject[] = [];

  for (const project of candidates) {
    const duplicateIndex = result.findIndex((existing) =>
      projectsMatch(existing, project),
    );

    if (duplicateIndex === -1) {
      result.push(project);
      continue;
    }

    result[duplicateIndex] = mergeProjects(result[duplicateIndex], project);
  }

  return result;
}

export function buildTechnologyPool(
  projects: ClientProject[],
  jobTechnologies: string[],
  skillNames: string[] = [],
): string[] {
  return normalizeTechnologyList([
    ...jobTechnologies,
    ...projects.flatMap((project) => project.technologies),
    ...skillNames,
  ]);
}
