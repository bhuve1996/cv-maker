"use client";

import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useParseRateLimit } from "@/hooks/use-parse-rate-limit";
import { cn } from "@/lib/utils";

interface ParseRateLimitIndicatorProps {
  className?: string;
  compact?: boolean;
}

export function ParseRateLimitIndicator({
  className,
  compact = false,
}: ParseRateLimitIndicatorProps) {
  const { remaining, limit, countdown, canRequest } = useParseRateLimit();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 text-xs text-muted-foreground",
        className,
      )}
    >
      <Badge variant={canRequest ? "secondary" : "outline"} className="font-normal">
        <Clock className="size-3" />
        {canRequest
          ? `${remaining}/${limit} AI parses left this minute`
          : `AI limit reached · retry in ${countdown}`}
      </Badge>
      {!compact && (
        <span>
          Tracked in this browser to stay within Gemini free-tier limits.
        </span>
      )}
    </div>
  );
}
