"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";

export function ResumeStoreHydration() {
  useEffect(() => {
    useResumeStore.persist.rehydrate();
  }, []);

  return null;
}
