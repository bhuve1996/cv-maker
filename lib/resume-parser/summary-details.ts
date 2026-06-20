import { v4 as uuidv4 } from "uuid";
import type { ProfessionalSummary, SummaryAchievement } from "@/types/resume";

export function parseProfessionalSummary(sectionText: string): ProfessionalSummary {
  const text = sectionText.trim();

  const yearsMatch = text.match(/(\d+\+?)\s*years?/i);
  const designationMatch = text.match(
    /(Senior|Lead|Staff|Principal|Junior|Associate)?\s*[A-Za-z /-]*(?:Engineer|Developer|Designer|Architect|Manager)/i,
  );

  const achievements = parseSummaryAchievements(text);
  const objectiveMatch = text.match(/Seeking[^.]+\./i);

  return {
    text,
    yearsOfExperience: yearsMatch?.[1] ? `${yearsMatch[1]}+` : "",
    designation: designationMatch?.[0]?.trim() ?? "",
    coreExpertise: extractCoreExpertise(text),
    achievements,
    careerObjective: objectiveMatch?.[0]?.trim() ?? "",
  };
}

function parseSummaryAchievements(text: string): SummaryAchievement[] {
  const achievements: SummaryAchievement[] = [];
  const impactPattern =
    /([^.]+?)\s+by\s+(\d+%)[^.]*\./gi;

  for (const match of text.matchAll(impactPattern)) {
    achievements.push({
      id: uuidv4(),
      description: match[1]?.trim() ?? "",
      impact: match[2]?.trim() ?? "",
    });
  }

  return achievements;
}

function extractCoreExpertise(text: string): string[] {
  const expertMatch = text.match(/expert in ([^.]+)\./i);
  if (expertMatch?.[1]) {
    return expertMatch[1]
      .split(/,|\band\b/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const skilledMatch = text.match(/skilled in ([^.]+)\./i);
  if (skilledMatch?.[1]) {
    return skilledMatch[1]
      .split(/,|\band\b/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}
