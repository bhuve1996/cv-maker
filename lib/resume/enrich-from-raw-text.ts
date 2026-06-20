import { v4 as uuidv4 } from "uuid";
import {
  clientsOverlap,
  dedupeClientProjects,
} from "@/lib/resume/dedupe-projects";
import { dedupeJobCertifications } from "@/lib/resume/dedupe-certifications";
import { parseExperienceDetails } from "@/lib/resume-parser/experience-details";
import {
  preprocessResumeText,
  splitExperienceEntries,
} from "@/lib/resume-parser/normalize-text";
import { identifySections } from "@/lib/resume-parser/sections";
import type { ClientProject, Experience, JobCertification } from "@/types/resume";

const EXPERIENCE_HEADER_PATTERN =
  /^((?:Senior |Lead |Staff |Principal |Web |Software |Associate |Junior )?(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,5})\s+(?:Engineer|Developer|Manager|Designer|Architect|Consultant|Analyst|Intern|Specialist))\s+([A-Z][A-Za-z0-9 &.()-]+?)\s+(\d{2}\/\d{4}(?:\s*-\s*(?:\d{2}\/\d{4}|Present|Current))?|\d{2}\/\d{4})/;

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function extractExperienceBody(block: string): string {
  const normalized = block.replace(/\n+/g, " ").trim();
  const headerMatch = normalized.match(EXPERIENCE_HEADER_PATTERN);
  if (headerMatch) {
    return normalized.slice(headerMatch[0].length).trim();
  }
  return normalized;
}

function extractCompanyFromBlock(block: string): string {
  const normalized = block.replace(/\n+/g, " ").trim();
  const headerMatch = normalized.match(EXPERIENCE_HEADER_PATTERN);
  return headerMatch?.[2]?.trim() ?? "";
}

function findMatchingExperienceBlock(
  job: Experience,
  blocks: string[],
): string | undefined {
  const companyKey = normalizeKey(job.company);
  const roleKey = normalizeKey(job.role);

  if (!companyKey) return undefined;

  return blocks.find((block) => {
    const blockCompany = normalizeKey(extractCompanyFromBlock(block));
    if (!blockCompany) return false;
    if (blockCompany.includes(companyKey) || companyKey.includes(blockCompany)) {
      return true;
    }

    const blockText = normalizeKey(block);
    return roleKey.length > 0 && blockText.includes(roleKey) && blockText.includes(companyKey);
  });
}

function isMissingFromExisting(
  existing: ClientProject[],
  candidate: ClientProject,
): boolean {
  return !existing.some((project) => clientsOverlap(project.client, candidate.client));
}

function mergeProjectsByClient(
  existing: ClientProject[],
  recovered: ClientProject[],
  companyDescription: string,
): ClientProject[] {
  const additions = recovered.filter((project) =>
    isMissingFromExisting(existing, project),
  );

  if (additions.length === 0) {
    return dedupeClientProjects(existing, companyDescription);
  }

  return dedupeClientProjects([...existing, ...additions], companyDescription);
}

function mergeCertifications(
  existing: JobCertification[],
  recovered: JobCertification[],
): JobCertification[] {
  return dedupeJobCertifications([...existing, ...recovered]);
}

export function enrichExperienceFromRawText(
  experience: Experience[],
  rawText: string,
): Experience[] {
  const text = preprocessResumeText(rawText);
  const sections = identifySections(text);
  const blocks = splitExperienceEntries(sections.experience);

  if (blocks.length === 0) return experience;

  return experience.map((job) => {
    const block = findMatchingExperienceBlock(job, blocks);
    if (!block) return job;

    const details = parseExperienceDetails(extractExperienceBody(block));

    return {
      ...job,
      location: job.location || details.location,
      companyDescription: job.companyDescription || details.companyDescription,
      projects: mergeProjectsByClient(
        job.projects,
        details.projects,
        job.companyDescription,
      ),
      certifications: mergeCertifications(job.certifications, details.certifications),
      achievements:
        job.achievements.length > 0 ? job.achievements : details.achievements,
      description:
        job.projects.length === 0 && details.projects.length > 0
          ? ""
          : job.description || details.description,
    };
  });
}
