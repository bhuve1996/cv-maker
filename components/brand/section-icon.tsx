import { SECTION_ICON_COLORS, SECTION_ICONS } from "@/lib/brand/section-icons";
import { cn } from "@/lib/utils";
import type { ResumeSection } from "@/types/resume";

interface SectionIconProps {
  section: ResumeSection;
  className?: string;
  size?: "sm" | "md";
}

export function SectionIcon({ section, className, size = "md" }: SectionIconProps) {
  const Icon = SECTION_ICONS[section];
  const colorClass = SECTION_ICON_COLORS[section];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg",
        size === "sm" ? "size-8" : "size-10",
        colorClass,
        className,
      )}
    >
      <Icon className={size === "sm" ? "size-4" : "size-5"} />
    </span>
  );
}
