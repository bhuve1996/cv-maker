import { Eye, PencilLine, Upload } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";

const STEPS = [
  { icon: Upload, label: "Upload" },
  { icon: PencilLine, label: "Edit" },
  { icon: Eye, label: "Preview" },
] as const;

export function HeroBanner() {
  return (
    <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary/10 via-violet-400/5 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-lg shadow-primary/5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark size={28} />
            <div>
              <p className="text-sm font-semibold">Preview</p>
              <p className="text-xs text-muted-foreground">Export-ready layout</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Ready
          </span>
        </div>

        <div className="space-y-3 rounded-xl border border-border/50 bg-muted/30 p-4">
          <div className="space-y-2">
            <div className="h-3 w-2/5 rounded-full bg-primary/15" />
            <div className="h-2 w-3/5 rounded-full bg-border" />
            <div className="h-2 w-1/2 rounded-full bg-border" />
          </div>
          <div className="border-t border-dashed border-border/80 pt-3">
            <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Experience
            </p>
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-border" />
              <div className="h-2 w-11/12 rounded-full bg-border" />
              <div className="h-2 w-4/5 rounded-full bg-border" />
            </div>
          </div>
          <div className="border-t border-dashed border-border/80 pt-3">
            <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["React", "Next.js", "TypeScript"].map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-primary/8 px-2 py-0.5 text-[10px] text-primary/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          {STEPS.map((step, index) => (
            <div key={step.label} className="flex flex-1 items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-secondary text-primary/80">
                <step.icon className="size-3.5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{step.label}</span>
              {index < STEPS.length - 1 && (
                <div className="ml-auto hidden h-px flex-1 bg-border sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
