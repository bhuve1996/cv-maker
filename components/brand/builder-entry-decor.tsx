import { FileText, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const BUILDER_ICONS = [
  {
    icon: Upload,
    position: "right-0 top-2 translate-x-[30%]",
    delay: "0s",
  },
  {
    icon: FileText,
    position: "left-0 bottom-12 -translate-x-[35%]",
    delay: "1s",
  },
  {
    icon: Sparkles,
    position: "right-0 bottom-2 translate-x-[25%]",
    delay: "1.6s",
  },
] as const;

export function BuilderEntryDecor({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 hidden md:block",
        className,
      )}
    >
      {BUILDER_ICONS.map(({ icon: Icon, position, delay }) => (
        <div key={position} className={cn("absolute", position)} aria-hidden>
          <div
            className="animate-float flex size-9 items-center justify-center rounded-lg border border-border/60 bg-card/90 text-primary/70 shadow-sm backdrop-blur-sm"
            style={{ animationDelay: delay }}
          >
            <Icon className="size-3.5" />
          </div>
        </div>
      ))}
    </div>
  );
}
