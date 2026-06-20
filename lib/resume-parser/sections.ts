export type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications";

const SECTION_PATTERNS: Record<SectionKey, RegExp[]> = {
  summary: [
    /^(professional\s+)?summary$/i,
    /^profile$/i,
    /^about(\s+me)?$/i,
    /^objective$/i,
  ],
  experience: [
    /^work\s+experience$/i,
    /^professional\s+experience$/i,
    /^experience$/i,
    /^employment(\s+history)?$/i,
  ],
  education: [/^education$/i, /^academic(\s+background)?$/i],
  skills: [
    /^skills?$/i,
    /^technical\s+skills?$/i,
    /^core\s+competencies$/i,
    /^expertise$/i,
  ],
  projects: [/^projects?$/i, /^personal\s+projects?$/i],
  certifications: [
    /^certifications?$/i,
    /^licenses?(\s+(&|and)\s+certifications?)?$/i,
    /^credentials?$/i,
  ],
};

export function identifySections(text: string): Record<SectionKey, string> {
  const lines = text.split("\n").map((line) => line.trim());
  const sections: Record<SectionKey, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };

  let currentSection: SectionKey | null = null;

  for (const line of lines) {
    if (!line) {
      if (currentSection) sections[currentSection].push("");
      continue;
    }

    const matchedSection = matchSectionHeader(line);
    if (matchedSection) {
      currentSection = matchedSection;
      continue;
    }

    if (currentSection) {
      sections[currentSection].push(line);
    }
  }

  return Object.fromEntries(
    Object.entries(sections).map(([key, value]) => [key, value.join("\n").trim()]),
  ) as Record<SectionKey, string>;
}

function matchSectionHeader(line: string): SectionKey | null {
  const normalized = line.replace(/[:\-–—|•*#]+$/g, "").trim();

  for (const [section, patterns] of Object.entries(SECTION_PATTERNS) as [
    SectionKey,
    RegExp[],
  ][]) {
    if (patterns.some((pattern) => pattern.test(normalized))) {
      return section;
    }
  }

  return null;
}

export function extractContactInfo(text: string) {
  const emailMatch = text.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  );
  const phoneMatch = text.match(
    /(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3}[\s.-]?\d{3,4}[\s.-]?\d{3,4}/,
  );
  const linkedInMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i,
  );
  const websiteMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?(?!linkedin\.com)[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[\w\-./?%&=]*)?/i,
  );

  return {
    email: emailMatch?.[0] ?? "",
    phone: phoneMatch?.[0]?.trim() ?? "",
    linkedIn: linkedInMatch?.[0] ?? "",
    website: websiteMatch?.[0] ?? "",
  };
}

export function extractFullName(text: string): string {
  const firstLine = text.split("\n").find((line) => line.trim())?.trim() ?? "";

  if (!firstLine || firstLine.length > 60) return "";
  if (/@|https?:\/\//i.test(firstLine)) return "";

  const words = firstLine.split(/\s+/);
  if (words.length < 2 || words.length > 5) return "";

  return firstLine;
}

export function extractLocation(text: string): string {
  const locationMatch = text.match(
    /(?:^|\n)([A-Za-z\s]+,\s*[A-Za-z\s]+(?:,\s*[A-Za-z\s]+)?)(?:\n|$)/,
  );
  return locationMatch?.[1]?.trim() ?? "";
}
