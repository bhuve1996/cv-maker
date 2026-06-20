"use client";

import { Check } from "lucide-react";
import { SectionIcon } from "@/components/brand/section-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { FORM_BY_SECTION, RESUME_SECTIONS } from "@/components/forms/resume-forms";
import { useResumeStore } from "@/hooks/use-resume-store";
import { getSectionStatus } from "@/lib/resume/section-completion";
import { cn } from "@/lib/utils";

export function ResumeEditor() {
  const resume = useResumeStore((state) => state.resume);

  return (
    <Accordion
      multiple
      defaultValue={["personalInfo", "professionalSummary", "experience"]}
      className="w-full space-y-2"
    >
      {RESUME_SECTIONS.map((section) => {
        const status = getSectionStatus(section.id, resume);

        return (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="rounded-xl border border-border/60 bg-card/70 px-4 shadow-sm ring-1 ring-primary/5 transition-colors hover:border-primary/20 hover:bg-card"
          >
            <AccordionTrigger className="gap-3 py-4 hover:no-underline">
              <SectionIcon section={section.id} size="sm" />
              <div className="min-w-0 flex-1 text-left">
                <p className="text-base font-medium">{section.title}</p>
                <p className="text-xs font-normal text-muted-foreground">
                  {section.description}
                </p>
              </div>
              <div className="mr-1 flex shrink-0 items-center gap-1.5">
                {status.detail && (
                  <Badge variant="secondary" className="hidden font-normal sm:inline-flex">
                    {status.detail}
                  </Badge>
                )}
                {status.complete ? (
                  <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    <Check className="size-3.5" />
                  </span>
                ) : (
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      status.detail ? "bg-amber-400" : "bg-muted-foreground/30",
                    )}
                    title={status.detail ? "In progress" : "Not started"}
                  />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              {FORM_BY_SECTION[section.id]}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
