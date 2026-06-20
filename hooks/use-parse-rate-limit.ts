"use client";

import { useEffect, useState } from "react";
import {
  formatRateLimitCountdown,
  getParseRateLimitState,
  type ParseRateLimitState,
} from "@/lib/ai/parse-rate-limit";

export function useParseRateLimit(tickMs = 1000) {
  const [state, setState] = useState<ParseRateLimitState>(() =>
    getParseRateLimitState(),
  );

  useEffect(() => {
    const update = () => setState(getParseRateLimitState());
    update();
    const id = window.setInterval(update, tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);

  return {
    ...state,
    countdown: state.resetsInMs > 0 ? formatRateLimitCountdown(state.resetsInMs) : null,
  };
}
