import type { LucideIcon } from "lucide-react";
import { Briefcase, Download, FileText, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingIconItem {
  icon: LucideIcon;
  label?: string;
  position: string;
  delay: string;
  size?: "sm" | "md";
  variant?: "default" | "accent" | "muted";
}

const HERO_ICONS: FloatingIconItem[] = [
  {
    icon: FileText,
    label: "PDF",
    position: "left-0 top-[18%] -translate-x-1/2",
    delay: "0s",
    size: "sm",
    variant: "default",
  },
  {
    icon: Sparkles,
    position: "right-0 top-[8%] translate-x-1/2",
    delay: "1.2s",
    size: "sm",
    variant: "accent",
  },
  {
    icon: Briefcase,
    position: "left-0 bottom-[30%] -translate-x-1/2",
    delay: "0.6s",
    size: "sm",
    variant: "muted",
  },
  {
    icon: Download,
    label: "Export",
    position: "right-0 bottom-[12%] translate-x-1/2",
    delay: "1.8s",
    size: "sm",
    variant: "accent",
  },
];

const VARIANT_STYLES = {
  default: "border-border/70 bg-card/95 text-primary shadow-sm",
  accent: "border-primary/20 bg-primary/10 text-primary shadow-sm",
  muted: "border-border/50 bg-secondary/90 text-muted-foreground shadow-sm",
} as const;

interface FloatingIconsProps {
  items?: FloatingIconItem[];
  className?: string;
}

function FloatingIconBadge({
  icon: Icon,
  label,
  position,
  delay,
  size = "md",
  variant = "default",
}: FloatingIconItem) {
  const iconSize = size === "sm" ? "size-3.5" : "size-4";
  const boxSize = label ? "h-8 gap-1 px-2" : "size-8";

  return (
    <div className={cn("absolute", position)} aria-hidden>
      <div
        className={cn(
          "animate-float flex items-center justify-center rounded-lg border backdrop-blur-sm",
          boxSize,
          VARIANT_STYLES[variant],
        )}
        style={{ animationDelay: delay }}
      >
        <Icon className={iconSize} />
        {label && <span className="text-[10px] font-medium">{label}</span>}
      </div>
    </div>
  );
}

export function FloatingIcons({ items = HERO_ICONS, className }: FloatingIconsProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -inset-x-6 -inset-y-2 hidden lg:block",
        className,
      )}
    >
      {items.map((item) => (
        <FloatingIconBadge key={`${item.position}-${item.delay}`} {...item} />
      ))}
    </div>
  );
}
