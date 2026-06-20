"use client";

import { useTheme } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

export function AppToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      expand
      duration={5000}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
