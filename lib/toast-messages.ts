import { toast } from "sonner";
import type { ParseResult } from "@/types/resume";

export function toastParseResult(result: ParseResult): void {
  if (result.parser === "gemini") {
    toast.success("Resume parsed with Gemini", {
      description:
        "AI extraction complete. Review Personal Info and Experience first.",
    });
    return;
  }

  toast.warning("Basic local parsing used", {
    description:
      result.warning ??
      "Gemini was unavailable. Double-check all sections for accuracy.",
    duration: 8000,
  });
}

export function toastParseError(message: string): void {
  toast.error("Could not parse resume", { description: message });
}

export function toastExportSuccess(filename: string): void {
  toast.success("PDF downloaded", {
    description: filename,
  });
}

export function toastExportError(message: string): void {
  toast.error("PDF export failed", {
    description: message,
    duration: 8000,
  });
}

export function toastResetSuccess(): void {
  toast.info("Saved resume cleared", {
    description: "Upload a new file or start from scratch.",
  });
}

export function toastRateLimitBlocked(countdown: string | null): void {
  toast.warning("AI parse limit reached", {
    description: `Wait ${countdown ?? "a moment"} before using Gemini again, or use basic parsing.`,
    duration: 6000,
  });
}
