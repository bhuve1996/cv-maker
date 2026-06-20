"use client";

import { useEffect, useRef, useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";

type SaveStatus = "idle" | "saving" | "saved";

export function useSaveIndicator() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = useResumeStore.subscribe((state, prevState) => {
      if (
        state.resume === prevState.resume &&
        state.hasUploaded === prevState.hasUploaded &&
        state.rawText === prevState.rawText
      ) {
        return;
      }

      if (timerRef.current) clearTimeout(timerRef.current);
      setStatus("saving");

      timerRef.current = setTimeout(() => {
        setStatus("saved");
        timerRef.current = setTimeout(() => setStatus("idle"), 2500);
      }, 400);
    });

    return () => {
      unsubscribe();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return status;
}
