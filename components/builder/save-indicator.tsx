"use client";

import { Check, Cloud, Loader2 } from "lucide-react";
import { useSaveIndicator } from "@/hooks/use-save-indicator";
import { cn } from "@/lib/utils";

export function SaveIndicator() {
  const status = useSaveIndicator();

  if (status === "idle") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/70 px-2.5 py-1 text-xs text-muted-foreground">
        <Cloud className="size-3.5" />
        Saved in browser
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors",
        status === "saved"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
          : "border-primary/20 bg-primary/5 text-muted-foreground",
      )}
    >
      {status === "saving" ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Check className="size-3.5" />
      )}
      {status === "saving" ? "Saving..." : "Saved"}
    </span>
  );
}
