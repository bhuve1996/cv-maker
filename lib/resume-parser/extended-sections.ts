import { v4 as uuidv4 } from "uuid";
import type { KeyAchievement, SpokenLanguage } from "@/types/resume";

export function parseSpokenLanguages(sectionText: string): SpokenLanguage[] {
  if (!sectionText.trim()) return [];

  const pattern =
    /([A-Za-z]+)\s+(Proficient|Native|Fluent|Basic|Intermediate|Advanced|Conversational|Professional)/gi;
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

  const blocks = sectionText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (blocks.length === 0) return [];

  return blocks.map((block) => {
    const sentenceSplit = block.match(/^(.{3,100}?)[.:]\s+(.+)$/);
    if (sentenceSplit) {
      return {
        id: uuidv4(),
        title: sentenceSplit[1]?.trim() ?? "",
        description: sentenceSplit[2]?.trim() ?? "",
      };
    }

    return {
      id: uuidv4(),
      title: block,
      description: "",
    };
  });
}

export function parseInterests(sectionText: string): string[] {
  if (!sectionText.trim()) return [];

  const cleaned = sectionText
    .replace(/^(hobbies and interests|interests)\s*[:.-]?\s*/i, "")
    .trim();

  const splitItems = cleaned
    .split(/,|\band\b|;/)
    .map((item) =>
      item
        .replace(/^(engaged in|enjoys|like|including|such as)\s+/i, "")
        .replace(/\.$/, "")
        .trim(),
    )
    .filter((item) => item.length > 2 && item.length < 50);

  if (splitItems.length > 0) {
    return splitItems;
  }

  return cleaned ? [cleaned.slice(0, 120)] : [];
}
