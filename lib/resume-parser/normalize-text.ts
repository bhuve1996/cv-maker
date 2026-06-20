const INLINE_SECTION_HEADERS = [
  "PROFESSIONAL SUMMARY",
  "WORK EXPERIENCE",
  "PROFESSIONAL EXPERIENCE",
  "TECHNICAL SKILLS",
  "KEY ACHIEVEMENTS",
  "KEY SKILLS",
  "SUMMARY",
  "EXPERIENCE",
  "EDUCATION",
  "SKILLS",
  "PROJECTS",
  "CERTIFICATIONS",
  "LANGUAGES",
  "INTERESTS",
  "HOBBIES",
];

const JOB_TITLE_PREFIX =
  /(?:Senior|Lead|Staff|Principal|Junior|Associate|Web|Software|Full[\s-]Stack|Frontend|Backend|Mobile|DevOps|Data|Machine Learning|ML|UI\/UX|Product|Project|Technical|Sr\.?|Jr\.?)\s+/i;

const JOB_TITLE_SUFFIX =
  /(?:Engineer|Developer|Manager|Designer|Architect|Consultant|Analyst|Intern|Specialist|Programmer|Administrator|Coordinator|Director|Lead)/i;

export function preprocessResumeText(text: string): string {
  let result = text
    .replace(/\u0000/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  for (const header of INLINE_SECTION_HEADERS) {
    const pattern = new RegExp(
      `\\s+(${header.replace(/\s+/g, "\\s+")})\\s+`,
      "g",
    );
    result = result.replace(pattern, "\n\n$1\n");
  }

  result = result.replace(
    /^([A-Z][A-Z\s.'-]{2,48}?)\s+(?=(?:Senior|Lead|Staff|Principal|Software|Web|Full[\s-]?Stack|Frontend|Backend|[A-Z][a-z]))/m,
    "$1\n",
  );

  result = result.replace(
    /(\d{2}\/\d{4}(?:\s*-\s*(?:\d{2}\/\d{4}|Present|Current))?)\s+([A-Z][a-z])/g,
    "$1\n$2",
  );

  return result.replace(/\n{3,}/g, "\n\n").trim();
}

export function splitExperienceEntries(sectionText: string): string[] {
  if (!sectionText.trim()) return [];

  const headerPattern =
    /(?:Senior |Lead |Staff |Principal |Web |Software |Associate |Junior )?(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Engineer|Developer|Manager|Designer|Architect|Consultant|Analyst|Intern|Specialist))\s+[A-Z][A-Za-z0-9 &.()-]+?\s+\d{2}\/\d{4}(?:\s*-\s*(?:\d{2}\/\d{4}|Present|Current))?/g;

  const headers = [...sectionText.matchAll(headerPattern)];
  if (!headers.length) {
    return sectionText.trim() ? [sectionText.trim()] : [];
  }

  return headers.map((match, index) => {
    const start = match.index ?? 0;
    const end =
      index + 1 < headers.length ? headers[index + 1].index! : sectionText.length;
    return sectionText.slice(start, end).trim();
  });
}

export function splitEducationEntries(sectionText: string): string[] {
  if (!sectionText.trim()) return [];

  const markers = [
    "Bachelor",
    "Master",
    "Higher Secondary",
    "Secondary (Class 10",
    "Secondary (Class 12",
    "Associate",
    "Diploma",
    "PhD",
    "Ph.D",
    "MBA",
  ];

  const indices: number[] = [];

  for (const marker of markers) {
    let searchFrom = 0;

    while (searchFrom < sectionText.length) {
      const index = sectionText.indexOf(marker, searchFrom);
      if (index === -1) break;

      const isNestedSecondary =
        marker.startsWith("Secondary") &&
        sectionText.slice(Math.max(0, index - 7), index).endsWith("Higher ");

      if (!isNestedSecondary) {
        indices.push(index);
      }

      searchFrom = index + marker.length;
    }
  }

  const uniqueIndices = [...new Set(indices)].sort((a, b) => a - b);

  return uniqueIndices
    .map((start, index) =>
      sectionText.slice(start, uniqueIndices[index + 1] ?? sectionText.length).trim(),
    )
    .filter(Boolean);
}

export function isJobTitle(text: string): boolean {
  return JOB_TITLE_SUFFIX.test(text) || JOB_TITLE_PREFIX.test(text);
}

export const KNOWN_MULTI_WORD_SKILLS = [
  "React Native",
  "Material UI",
  "Node JS",
  "Next.js",
  "React.js",
  "Angular.js",
  "Vue.js",
  "REST APIs",
  "Shopify Plus",
  "Machine Learning",
  "React Bootstrap",
];

export function tokenizeSkills(sectionText: string): string[] {
  const cleaned = sectionText
    .replace(/\s+(INTERESTS|LANGUAGES|KEY ACHIEVEMENTS|HOBBIES)[\s\S]*$/i, "")
    .replace(/[•·]/g, " ")
    .trim();

  if (!cleaned) return [];

  let normalized = cleaned;
  const placeholders = new Map<string, string>();

  KNOWN_MULTI_WORD_SKILLS.sort((a, b) => b.length - a.length).forEach(
    (skill, index) => {
      const token = `__SKILL_${index}__`;
      placeholders.set(token, skill);
      normalized = normalized.replace(
        new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"),
        token,
      );
    },
  );

  return normalized
    .split(/\s+/)
    .map((item) => placeholders.get(item) ?? item)
    .filter(
      (item) =>
        item.length > 1 &&
        item.length < 40 &&
        !/^(interests|languages|key|achievements|hobbies|and|will|support|your|mission|of|delivering|scalable|accessible|web|interfaces)$/i.test(
          item,
        ),
    );
}
