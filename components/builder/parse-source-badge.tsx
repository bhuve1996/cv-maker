"use client";

import { AlertTriangle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ParseParser = "gemini" | "heuristic" | null;

interface ParseSourceBadgeProps {
  parser: ParseParser;
  className?: string;
  size?: "sm" | "md";
}

export function ParseSourceBadge({
  parser,
  className,
  size = "md",
}: ParseSourceBadgeProps) {
  if (!parser) return null;

  const sizeClass =
    size === "sm"
      ? "h-auto gap-1 px-2 py-0.5 text-[11px] [&>svg]:size-3"
      : "h-auto gap-1.5 px-2.5 py-1 text-xs [&>svg]:size-3.5";

  if (parser === "gemini") {
    return (
      <Badge
        variant="default"
        className={cn(
          "border-primary/20 bg-primary/90 font-medium shadow-sm",
          sizeClass,
          className,
        )}
      >
        <Sparkles />
        Parsed with Gemini
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-amber-500/30 bg-amber-500/10 font-medium text-amber-800 dark:text-amber-200",
        sizeClass,
        className,
      )}
    >
      <AlertTriangle />
      Basic local parser
    </Badge>
  );
}
