"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/hooks/use-resume-store";

export function useResumeHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubscribe = useResumeStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    void useResumeStore.persist.rehydrate();

    return unsubscribe;
  }, []);

  return hydrated;
}
