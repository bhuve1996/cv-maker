"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useResumeStore } from "@/hooks/use-resume-store";
import { cn } from "@/lib/utils";
import {
  RESUME_STYLE_PRESETS,
  type ExperienceLayout,
  type ResumeStylePreset,
  type SectionHeaderStyle,
  type SectionSpacing,
} from "@/types/resume-style";

const PRESET_ORDER: ResumeStylePreset[] = ["classic", "modernLight", "modernBanner"];

function PresetSwatch({ preset }: { preset: ResumeStylePreset }) {
  const { style } = RESUME_STYLE_PRESETS[preset];

  return (
    <div className="mt-2 space-y-1">
      {style.headerBanner && (
        <div className="h-2 rounded-sm bg-[#1E3A5F]" />
      )}
      {style.sectionHeaderStyle === "lightFill" && (
        <div className="h-1.5 rounded-sm bg-[#EAF2FF]" />
      )}
      {style.sectionHeaderStyle === "darkFill" && (
        <div className="h-1.5 rounded-sm bg-[#1E3A5F]" />
      )}
      {style.sectionHeaderStyle === "rule" && (
        <div className="space-y-0.5">
          <div className="h-0.5 w-1/2 rounded-sm bg-foreground/70" />
          <div className="h-px w-full bg-border" />
        </div>
      )}
    </div>
  );
}

export function ResumeStylePanel() {
  const style = useResumeStore((state) => state.style);
  const setStyle = useResumeStore((state) => state.setStyle);
  const applyStylePreset = useResumeStore((state) => state.applyStylePreset);

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm ring-1 ring-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Resume design</CardTitle>
        <p className="text-xs text-muted-foreground">
          ATS-safe styling — text stays selectable, no icons or graphics.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid gap-2 sm:grid-cols-3">
          {PRESET_ORDER.map((presetId) => {
            const preset = RESUME_STYLE_PRESETS[presetId];
            const isActive = style.preset === presetId;

            return (
              <button
                key={presetId}
                type="button"
                onClick={() => applyStylePreset(presetId)}
                className={cn(
                  "rounded-lg border p-3 text-left transition-colors hover:bg-muted/50",
                  isActive
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border/60",
                )}
              >
                <span className="text-sm font-medium">{preset.label}</span>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {preset.description}
                </p>
                <PresetSwatch preset={presetId} />
              </button>
            );
          })}
        </div>

        <Accordion>
          <AccordionItem value="advanced" className="border-none">
            <AccordionTrigger className="py-2 text-sm font-medium hover:no-underline">
              Advanced options
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-0">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label htmlFor="header-banner">Header banner</Label>
                  <p className="text-xs text-muted-foreground">
                    Dark navy background with white text
                  </p>
                </div>
                <button
                  id="header-banner"
                  type="button"
                  role="switch"
                  aria-checked={style.headerBanner}
                  onClick={() => setStyle({ headerBanner: !style.headerBanner })}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                    style.headerBanner ? "bg-primary" : "bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block size-5 rounded-full bg-background shadow-sm transition-transform",
                      style.headerBanner ? "translate-x-5" : "translate-x-0",
                    )}
                  />
                </button>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="section-header-style">Section headers</Label>
                <select
                  id="section-header-style"
                  value={style.sectionHeaderStyle}
                  onChange={(event) =>
                    setStyle({
                      sectionHeaderStyle: event.target.value as SectionHeaderStyle,
                    })
                  }
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="rule">Rule only</option>
                  <option value="lightFill">Light fill</option>
                  <option value="darkFill">Dark fill</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="section-spacing">Section spacing</Label>
                <select
                  id="section-spacing"
                  value={style.sectionSpacing}
                  onChange={(event) =>
                    setStyle({
                      sectionSpacing: event.target.value as SectionSpacing,
                    })
                  }
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="experience-layout">Experience layout</Label>
                <select
                  id="experience-layout"
                  value={style.experienceLayout}
                  onChange={(event) =>
                    setStyle({
                      experienceLayout: event.target.value as ExperienceLayout,
                    })
                  }
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="standard">Standard</option>
                  <option value="recruiter">Recruiter scan</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Recruiter scan shows company | role and location | dates on separate lines.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
