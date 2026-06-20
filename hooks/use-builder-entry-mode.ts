"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useResumeHydration } from "@/hooks/use-resume-hydration";
import { useResumeStore } from "@/hooks/use-resume-store";

export function useBuilderEntryMode() {
  const hydrated = useResumeHydration();
  const searchParams = useSearchParams();
  const hasUploaded = useResumeStore((state) => state.hasUploaded);
  const startFromScratch = useResumeStore((state) => state.startFromScratch);

  useEffect(() => {
    if (!hydrated || hasUploaded) return;
    if (searchParams.get("mode") === "scratch") {
      startFromScratch();
    }
  }, [hydrated, hasUploaded, searchParams, startFromScratch]);

  return hydrated;
}
