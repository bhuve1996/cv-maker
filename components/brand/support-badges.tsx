import type { LucideIcon } from "lucide-react";
import {
  Download,
  FileType2,
  Lock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SupportItem {
  icon: LucideIcon;
  label: string;
  detail?: string;
}

const SUPPORT_ITEMS: SupportItem[] = [
  { icon: FileType2, label: "PDF", detail: "Upload & export" },
  { icon: FileType2, label: "DOCX", detail: "Word resumes" },
  { icon: Sparkles, label: "AI Parse", detail: "Gemini extraction" },
  { icon: Lock, label: "No login", detail: "Browser-only" },
  { icon: Download, label: "PDF export", detail: "One-click download" },
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
            "inline-flex items-center gap-2 rounded-full border border-primary/10 bg-card/70 text-muted-foreground backdrop-blur-sm",
            compact ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
          )}
          title={item.detail}
        >
          <item.icon className={cn("text-primary", compact ? "size-3.5" : "size-4")} />
          <span className="font-medium text-foreground/80">{item.label}</span>
          {!compact && item.detail && (
            <span className="hidden text-xs text-muted-foreground sm:inline">
              · {item.detail}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
