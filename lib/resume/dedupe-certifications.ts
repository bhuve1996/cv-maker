import { coerceString } from "@/lib/resume/coerce-string";
import type { Certification, JobCertification } from "@/types/resume";

/** Extract the canonical certification title from prose-heavy cert strings. */
export function extractCanonicalCertificationName(name: string): string {
  const trimmed = coerceString(name).trim();
  if (!trimmed) return "";
  if (!/\bCertification\b/i.test(trimmed)) return trimmed;

  const certPattern =
    /\b([A-Z][A-Za-z0-9+.]+(?:\s+[A-Z][A-Za-z0-9+.]+)*\sCertification)\b/g;
  const matches = [...trimmed.matchAll(certPattern)].map((match) => match[1]?.trim() ?? "");
  const candidates = matches.filter(Boolean);

  if (candidates.length > 0) {
    return candidates.reduce((shortest, candidate) =>
      candidate.length < shortest.length ? candidate : shortest,
    );
  }

  const before = trimmed.replace(/\bCertification\b.*$/i, "").trim();
  const words = before.split(/\s+/).filter(Boolean);
  const fallbackCandidates: string[] = [];

  for (let count = 2; count <= Math.min(5, words.length); count += 1) {
    fallbackCandidates.push([...words.slice(-count), "Certification"].join(" "));
  }

  const titled = fallbackCandidates.filter((candidate) => /^[A-Z]/.test(candidate));
  if (titled.length > 0) {
    return titled.reduce((shortest, candidate) =>
      candidate.length < shortest.length ? candidate : shortest,
    );
  }

  return trimmed;
}

export function normalizeCertificationKey(name: string): string {
  const canonical = extractCanonicalCertificationName(name);
  const lower = canonical.toLowerCase();

  const core = lower.match(/([a-z0-9+ .-]{2,40})\s+certification\b/);
  if (core?.[1]) {
    const segment = core[1]
      .trim()
      .replace(/^(.*\b(?:in|the|structured|completed|participated|actively|successfully)\b\s+)/g, "")
      .trim();
    if (segment) {
      return `${segment.replace(/[^a-z0-9]+/g, " ").trim()} certification`;
    }
  }

  return lower.replace(/[^a-z0-9]+/g, " ").trim();
}

function certificationScore(name: string): number {
  let score = 0;
  const trimmed = coerceString(name).trim();
  if (/\bcertification\b/i.test(trimmed)) score += 4;
  if (trimmed.length <= 48) score += 3;
  if (!/^(successfully completed|tively participated)/i.test(trimmed)) score += 2;
  if (/^[A-Z][A-Za-z0-9+ .-]{2,40}\sCertification$/i.test(trimmed)) score += 3;
  return score;
}

function normalizeCertRecord<T extends JobCertification | Certification>(
  cert: T,
): T {
  const canonicalName = extractCanonicalCertificationName(cert.name);
  return {
    ...cert,
    name: canonicalName || coerceString(cert.name).trim(),
  };
}

export function dedupeJobCertifications(
  certifications: JobCertification[],
): JobCertification[] {
  const byKey = new Map<string, JobCertification>();

  for (const cert of certifications) {
    const normalized = normalizeCertRecord(normalizeJobCertificationInput(cert));
    const name = normalized.name.trim();
    if (!name) continue;

    const key = normalizeCertificationKey(name);
    if (!key) continue;

    const existing = byKey.get(key);
    if (!existing || certificationScore(name) > certificationScore(existing.name)) {
      byKey.set(key, normalized);
    }
  }

  return [...byKey.values()];
}

export function dedupeTopLevelCertifications(
  certifications: Certification[],
): Certification[] {
  const byKey = new Map<string, Certification>();

  for (const cert of certifications) {
    const normalized = normalizeCertRecord(cert);
    const name = normalized.name.trim();
    if (!name) continue;

    const key = normalizeCertificationKey(name);
    if (!key) continue;

    const existing = byKey.get(key);
    if (!existing || certificationScore(name) > certificationScore(existing.name)) {
      byKey.set(key, normalized);
    }
  }

  return [...byKey.values()];
}

function normalizeJobCertificationInput(cert: JobCertification): JobCertification {
  let status = coerceString(cert.status).trim();
  const rawName = coerceString(cert.name).trim();

  if (/^(successfully completed|tively participated)/i.test(rawName) && !status) {
    const shortStatus = rawName.match(
      /^(Successfully completed(?: and actively participated)?)/i,
    );
    status = shortStatus?.[0] ?? "Successfully completed";
  }

  if (status.length > 80) {
    const shortStatus = status.match(
      /^(Successfully completed|Completed|Certified|In progress|Active)/i,
    );
    status = shortStatus?.[0] ?? status.slice(0, 60).trim();
  }

  return { ...cert, status };
}
