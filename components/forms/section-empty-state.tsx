import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  className?: string;
}

export function SectionEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: SectionEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-primary/20 bg-muted/20 px-6 py-8 text-center",
        className,
      )}
    >
      <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
