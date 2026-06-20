import { v4 as uuidv4 } from "uuid";
import type { KeyAchievement, SpokenLanguage } from "@/types/resume";

export function parseSpokenLanguages(sectionText: string): SpokenLanguage[] {
  if (!sectionText.trim()) return [];

  const pattern = /([A-Za-z]+)\s+(Proficient|Native|Fluent|Basic|Intermediate|Advanced)/gi;
  const languages: SpokenLanguage[] = [];

  for (const match of sectionText.matchAll(pattern)) {
    languages.push({
      id: uuidv4(),
      language: match[1]?.trim() ?? "",
      proficiency: match[2]?.trim() ?? "",
    });
  }

  return languages;
}

export function parseKeyAchievements(sectionText: string): KeyAchievement[] {
  if (!sectionText.trim()) return [];

  const lines = sectionText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  return [
    {
      id: uuidv4(),
      title: lines[0] ?? "",
      description: lines.slice(1).join(" "),
    },
  ];
}

export function parseInterests(sectionText: string): string[] {
  if (!sectionText.trim()) return [];

  const known = ["cricket", "badminton", "swimming", "reading", "travel", "music"];
  const lower = sectionText.toLowerCase();
  const found = known.filter((item) => lower.includes(item));

  if (found.length > 0) {
    return found.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
  }

  return sectionText
    .split(/,|\band\b/)
    .map((item) => item.replace(/^(engaged in|enjoys|like|sports like)\s+/i, "").trim())
    .filter((item) => item.length > 2 && item.length < 40);
}
