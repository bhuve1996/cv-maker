"use client";

import { Check } from "lucide-react";
import { RESUME_SECTIONS } from "@/types/resume";
import { useResumeStore } from "@/hooks/use-resume-store";
import { getSectionStatus } from "@/lib/resume/section-completion";
import { cn } from "@/lib/utils";

interface SectionNavProps {
  openSections: string[];
  onNavigate: (sectionId: string) => void;
}

export function SectionNav({ openSections, onNavigate }: SectionNavProps) {
  const resume = useResumeStore((state) => state.resume);

  return (
    <nav
      aria-label="Jump to resume section"
      className="sticky top-16 z-20 -mx-1 rounded-xl border border-border/60 bg-card/95 p-2 shadow-sm backdrop-blur-sm lg:top-20"
    >
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {RESUME_SECTIONS.map((section) => {
          const status = getSectionStatus(section.id, resume);
          const isOpen = openSections.includes(section.id);

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onNavigate(section.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors",
                isOpen
                  ? "border-primary/20 bg-primary/10 text-primary"
                  : "border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {status.complete && (
                <Check className="size-3 shrink-0 text-emerald-600" aria-hidden />
              )}
              <span className="whitespace-nowrap">{section.title}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
