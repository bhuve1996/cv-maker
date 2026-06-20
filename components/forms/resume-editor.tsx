"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FORM_BY_SECTION, RESUME_SECTIONS } from "@/components/forms/resume-forms";

export function ResumeEditor() {
  return (
    <Accordion
      multiple
      defaultValue={["personalInfo", "professionalSummary", "experience"]}
      className="w-full space-y-2"
    >
      {RESUME_SECTIONS.map((section) => (
        <AccordionItem
          key={section.id}
          value={section.id}
          className="rounded-lg border px-4"
        >
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="text-left">
              <p className="text-base font-medium">{section.title}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {section.description}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            {FORM_BY_SECTION[section.id]}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
