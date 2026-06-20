export type SectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "interests"
  | "keyAchievements";

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
    /^key\s+skills?$/i,
  ],
  projects: [/^projects?$/i, /^personal\s+projects?$/i],
  certifications: [
    /^certifications?$/i,
    /^licenses?(\s+(&|and)\s+certifications?)?$/i,
    /^credentials?$/i,
  ],
  languages: [/^languages?$/i],
  interests: [/^interests?$/i, /^hobbies(\s+and\s+interests)?$/i],
  keyAchievements: [/^key\s+achievements?$/i],
};

const STOP_SECTION_PATTERN = /^(references)$/i;

export function identifySections(text: string): Record<SectionKey, string> {
  const lines = text.split("\n").map((line) => line.trim());
  const sections = Object.fromEntries(
    Object.keys(SECTION_PATTERNS).map((key) => [key, [] as string[]]),
  ) as Record<SectionKey, string[]>;

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

    if (STOP_SECTION_PATTERN.test(line.replace(/[:\-–—|•*#]+$/g, "").trim())) {
      currentSection = null;
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

const INVALID_WEBSITE_PATTERN =
  /^(next\.js|react\.js|node\.js|vue\.js|angular\.js|express\.js|nuxt\.js)$/i;

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
  const githubMatch = text.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i,
  );

  const websiteCandidates = [
    ...text.matchAll(
      /https?:\/\/(?:www\.)?(?!linkedin\.com|github\.com)[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[\w\-./?%&=]*)?/gi,
    ),
    ...text.matchAll(
      /(?:^|\s)(?!linkedin\.com|github\.com)([a-z0-9-]+\.(?:com|dev|io|me|co|org|net|app)(?:\/[\w\-./?%&=]*)?)/gi,
    ),
  ];

  let website = "";
  for (const match of websiteCandidates) {
    const candidate = (match[1] ?? match[0]).trim();
    if (
      !INVALID_WEBSITE_PATTERN.test(candidate) &&
      !/linkedin\.com/i.test(candidate) &&
      !/github\.com/i.test(candidate) &&
      !candidate.includes("@") &&
      !/^\d/.test(candidate)
    ) {
      website = candidate;
      break;
    }
  }

  return {
    email: emailMatch?.[0] ?? "",
    phone: phoneMatch?.[0]?.trim() ?? "",
    linkedIn: linkedInMatch?.[0] ?? "",
    github: githubMatch?.[0] ?? "",
    website,
  };
}

export function extractFullName(text: string): string {
  const headerLine = text.split("\n").find((line) => line.trim())?.trim() ?? "";

  const capsNameMatch = text.match(
    /^([A-Z][A-Z\s.'-]{2,48}?)(?=\s*\n|\s+(?:Senior|Lead|Staff|Principal|Software|Web|Frontend|Backend|Full[\s-]?Stack|[A-Z][a-z].*(?:Engineer|Developer|Manager|Designer)))/m,
  );
  if (capsNameMatch) {
    return toTitleCase(capsNameMatch[1].trim());
  }

  if (headerLine && !/@|https?:\/\//i.test(headerLine)) {
    const titleBoundary = headerLine.search(
      /\s+(?:Senior|Lead|Staff|Principal|Software|Web|Frontend|Backend|Full[\s-]?Stack|[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Engineer|Developer|Manager|Designer|Architect|Consultant|Analyst))/,
    );

    if (titleBoundary > 0) {
      return headerLine.slice(0, titleBoundary).trim();
    }

    if (headerLine.length <= 60) {
      const words = headerLine.split(/\s+/);
      if (words.length >= 2 && words.length <= 5) {
        return headerLine;
      }
      if (words.length > 2) {
        return words.slice(0, 2).join(" ");
      }
    }
  }

  return "";
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function extractLocation(text: string): string {
  const patterns = [
    /([A-Za-z][A-Za-z\s.-]{1,35},\s*(?:India|USA|UK|United States|Canada|Australia|UAE|Germany|Singapore|[A-Za-z][A-Za-z\s.-]{1,30})(?:\s+\d{4,6})?)(?=\s+(?:SUMMARY|EXPERIENCE|EDUCATION|SKILLS|$))/i,
    /(?:^|\n|\s)([A-Za-z][A-Za-z\s.-]{1,35},\s*(?:India|USA|UK|United States|Canada|Australia|UAE|[A-Za-z][A-Za-z\s.-]{1,30})(?:\s+\d{4,6})?)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return (match[1] ?? match[0]).trim();
    }
  }

  return "";
}
