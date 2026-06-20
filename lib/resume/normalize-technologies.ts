import { coerceString } from "@/lib/resume/coerce-string";
import { categorizeSkill } from "@/lib/resume/skill-categories";

const TECH_BLOCKLIST = new Set([
  "ui",
  "uis",
  "apis",
  "api",
  "seo",
  "code",
  "tested",
  "vue",
  "js",
  "and",
  "build tools",
  "automated testing",
  "modern build tools",
  "third-party calendar",
  "load performance",
  "cross-browser compatibility",
  "student experience",
  "digital banking services",
]);

const INVALID_TECH_PATTERNS = [
  /^compatibility\./i,
  /^[a-z]+\.\s+[a-z]/i,
  /\b(increased|engagement|building|tested code|jest tested)\b/i,
  /\bjs\s+and\b/i,
  /\band\s+(scss|graphql|react|vue|angular)\b/i,
  /^(ui|uis|apis|seo|code|tested|vue|js)$/i,
];

const KNOWN_FRAMEWORKS = new Set([
  "next.js",
  "vue.js",
  "react.js",
  "angular.js",
  "node.js",
]);

const COMPOUND_REPLACEMENTS: Array<{ pattern: RegExp; values: string[] }> = [
  { pattern: /^js\s+and\s+graphql$/i, values: ["Next.js", "GraphQL"] },
  { pattern: /^js\s+and\s+scss$/i, values: ["Vue.js", "SCSS"] },
  { pattern: /^react\.js$/i, values: ["React"] },
  { pattern: /^angular\.js$/i, values: ["Angular"] },
  { pattern: /^vue\.js$/i, values: ["Vue.js"] },
  { pattern: /^node\.js$/i, values: ["Node JS"] },
  { pattern: /^jest\s+tested\s+code$/i, values: ["Jest"] },
];

function normalizeToken(token: string): string {
  return coerceString(token).trim().replace(/\s+/g, " ");
}

export function expandTechnologyToken(token: string): string[] {
  const normalized = normalizeToken(token);
  if (!normalized) return [];

  for (const rule of COMPOUND_REPLACEMENTS) {
    if (rule.pattern.test(normalized)) {
      return rule.values;
    }
  }

  return [normalized];
}

export function isValidTechnology(name: string): boolean {
  const trimmed = normalizeToken(name);
  if (!trimmed || trimmed.length > 28) return false;

  const key = trimmed.toLowerCase();
  if (KNOWN_FRAMEWORKS.has(key)) return true;
  if (TECH_BLOCKLIST.has(key)) return false;
  if (INVALID_TECH_PATTERNS.some((pattern) => pattern.test(trimmed))) return false;

  if (/^(build tools|automated testing|load performance)$/i.test(trimmed)) {
    return false;
  }

  return true;
}

export function isPromotableSkillName(name: string): boolean {
  const trimmed = normalizeToken(name);
  if (!isValidTechnology(trimmed)) return false;

  const category = categorizeSkill(trimmed);
  if (category !== "other") return true;

  return /^(figma|sanity|es6|jest|storybook|mapbox|gsap|graphql|vercel|netlify|postman)$/i.test(
    trimmed,
  );
}

export function normalizeTechnologyList(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    for (const expanded of expandTechnologyToken(value)) {
      const trimmed = normalizeToken(expanded);
      if (!isValidTechnology(trimmed)) continue;

      const key = trimmed.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(trimmed);
    }
  }

  return result;
}

export function inferTechnologiesFromText(text: string, pool: string[]): string[] {
  const inferred: string[] = [];

  for (const tech of pool) {
    const token = normalizeToken(tech);
    if (!token || !isValidTechnology(token)) continue;

    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\./g, "\\.?");
    if (new RegExp(`\\b${escaped}\\b`, "i").test(text)) {
      inferred.push(token);
    }
  }

  const frameworkPatterns = [
    /\bNext\.js\b/gi,
    /\bVue\.js\b/gi,
    /\bReact\.js\b/gi,
    /\bAngular\.js\b/gi,
    /\bFigma\b/gi,
  ];

  for (const pattern of frameworkPatterns) {
    for (const match of text.matchAll(pattern)) {
      const value = match[0]?.trim();
      if (value) inferred.push(value);
    }
  }

  return normalizeTechnologyList(inferred);
}

export function extractInlineTechnologyList(text: string): string[] {
  const trailingParen = text.match(/\(([A-Za-z0-9+ .,/]+)\)\s*$/);
  if (trailingParen?.[1]) {
    return normalizeTechnologyList(trailingParen[1].split(/,\s*/));
  }

  const dotList = text.match(/\.\s*([A-Za-z0-9+ .,/]+)\.?\s*$/);
  if (dotList?.[1]) {
    return normalizeTechnologyList(dotList[1].split(/,\s*/));
  }

  return [];
}
