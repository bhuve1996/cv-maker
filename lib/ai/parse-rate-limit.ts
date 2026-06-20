export const PARSE_RATE_STORAGE_KEY = "cv-maker-parse-rate-limit";

/** Conservative default for Gemini free tier (~10–15 RPM). Override via env on server if needed. */
export const MAX_PARSE_REQUESTS_PER_MINUTE = 10;
export const PARSE_RATE_WINDOW_MS = 60_000;

export interface ParseRateLimitState {
  used: number;
  remaining: number;
  limit: number;
  resetsInMs: number;
  canRequest: boolean;
}

function readTimestamps(): number[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(PARSE_RATE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is number => typeof item === "number");
  } catch {
    return [];
  }
}

function writeTimestamps(timestamps: number[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PARSE_RATE_STORAGE_KEY, JSON.stringify(timestamps));
}

function pruneTimestamps(timestamps: number[], now: number): number[] {
  return timestamps.filter((timestamp) => now - timestamp < PARSE_RATE_WINDOW_MS);
}

export function getParseRateLimitState(now = Date.now()): ParseRateLimitState {
  const timestamps = pruneTimestamps(readTimestamps(), now);
  writeTimestamps(timestamps);

  const used = timestamps.length;
  const remaining = Math.max(0, MAX_PARSE_REQUESTS_PER_MINUTE - used);
  const oldest = timestamps[0];
  const resetsInMs =
    used >= MAX_PARSE_REQUESTS_PER_MINUTE && oldest != null
      ? Math.max(0, PARSE_RATE_WINDOW_MS - (now - oldest))
      : 0;

  return {
    used,
    remaining,
    limit: MAX_PARSE_REQUESTS_PER_MINUTE,
    resetsInMs,
    canRequest: remaining > 0,
  };
}

export function recordParseRequest(now = Date.now()): ParseRateLimitState {
  const timestamps = pruneTimestamps(readTimestamps(), now);
  timestamps.push(now);
  writeTimestamps(timestamps);
  return getParseRateLimitState(now);
}

export function formatRateLimitCountdown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
