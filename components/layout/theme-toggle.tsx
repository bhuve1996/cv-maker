"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("size-9", className)}
        aria-label="Toggle theme"
        disabled
      />
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const Icon =
    theme === "system" ? Monitor : resolvedTheme === "dark" ? Sun : Moon;

  const label =
    theme === "system"
      ? "System theme (click for light)"
      : resolvedTheme === "dark"
        ? "Dark mode (click for system)"
        : "Light mode (click for dark)";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn("size-9 text-muted-foreground", className)}
      aria-label={label}
      title={label}
      onClick={cycleTheme}
    >
      <Icon className="size-4" />
    </Button>
  );
}
