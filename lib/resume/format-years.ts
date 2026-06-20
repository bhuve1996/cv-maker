/** Normalize stored years value to a numeric token (e.g. "7", "7+"). */
export function normalizeYearsOfExperience(value: string): string {
  const trimmed = (typeof value === "string" ? value : value == null ? "" : String(value)).trim();
  if (!trimmed) return "";

  const match = trimmed.match(/^(\d+\+?)\s*(?:years?|yrs?\.?)?$/i);
  if (match?.[1]) return match[1];

  return trimmed.replace(/\s*(?:years?|yrs?\.?)\s*$/i, "").trim();
}

/** Render a consistent "X years of experience · designation" line. */
export function formatYearsOfExperienceLine(
  years: string,
  designation?: string,
): string {
  const normalized = normalizeYearsOfExperience(years);
  if (!normalized) {
    return designation?.trim() ?? "";
  }

  const line = `${normalized} years of experience`;
  const role = designation?.trim();
  return role ? `${line} · ${role}` : line;
}
