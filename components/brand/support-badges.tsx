import type { LucideIcon } from "lucide-react";
import { Download, FileType2, Lock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportItem {
  icon: LucideIcon;
  label: string;
}

const SUPPORT_ITEMS: SupportItem[] = [
  { icon: FileType2, label: "PDF & DOCX" },
  { icon: Sparkles, label: "AI parsing" },
  { icon: Lock, label: "No account" },
  { icon: Download, label: "PDF export" },
];

interface SupportBadgesProps {
  className?: string;
  compact?: boolean;
}

export function SupportBadges({ className, compact = false }: SupportBadgesProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        compact ? "justify-center" : "justify-center sm:justify-start",
        className,
      )}
    >
      {SUPPORT_ITEMS.map((item) => (
        <div
          key={item.label}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 text-muted-foreground",
            compact ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
          )}
        >
          <item.icon className={cn("text-primary/80", compact ? "size-3" : "size-3.5")} />
          <span className="font-medium text-foreground/75">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
