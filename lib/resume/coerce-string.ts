/** Coerce AI/parser output to a safe string (null/undefined → ""). */
export function coerceString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

/** Coerce an array of unknown values to trimmed non-empty strings. */
export function coerceStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(coerceString).map((item) => item.trim()).filter(Boolean);
}
