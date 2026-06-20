import { FileUp, PencilLine, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SupportBadges } from "@/components/brand/support-badges";

const START_STEPS = [
  {
    icon: FileUp,
    title: "Upload your file",
    description: "PDF or DOCX — we extract the content with AI.",
  },
  {
    icon: PencilLine,
    title: "Edit every section",
    description: "Personal info, experience, skills, and more.",
  },
  {
    icon: Sparkles,
    title: "Export a polished PDF",
    description: "Live preview updates as you type.",
  },
] as const;

export function StartBanner() {
  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-primary/15 bg-card/70 shadow-sm ring-1 ring-primary/5">
      <div className="bg-mesh border-b border-primary/10 px-5 py-5 sm:px-6">
        <Logo size="md" />
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Get started by uploading an existing resume, or skip straight to the editor.
          Everything stays in your browser — no account needed.
        </p>
        <SupportBadges className="mt-4" compact />
      </div>
      <div className="grid gap-px bg-border/60 sm:grid-cols-3">
        {START_STEPS.map((step) => (
          <div
            key={step.title}
            className="flex gap-3 bg-card/80 px-5 py-4 sm:px-6"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <step.icon className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{step.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
