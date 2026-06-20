"use client";

import { Suspense } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { BuilderEntryDecor } from "@/components/brand/builder-entry-decor";
import { MobileBuilderBar } from "@/components/builder/mobile-builder-bar";
import { ParseStatusBanner } from "@/components/builder/parse-status-banner";
import { ResumeProgress } from "@/components/builder/resume-progress";
import { SaveIndicator } from "@/components/builder/save-indicator";
import { ResumeEditor } from "@/components/forms/resume-editor";
import { ResumeDocument } from "@/components/preview/resume-document";
import { ResumePreview } from "@/components/preview/resume-preview";
import { ResumeUpload } from "@/components/upload/resume-upload";
import { Button } from "@/components/ui/button";
import { useBuilderEntryMode } from "@/hooks/use-builder-entry-mode";
import { useResumeStore } from "@/hooks/use-resume-store";
import { toastResetSuccess } from "@/lib/toast-messages";

function BuilderLayoutContent() {
  const hydrated = useBuilderEntryMode();
  const { hasUploaded, reset, resume, style, startFromScratch } = useResumeStore();

  const handleReset = () => {
    if (
      window.confirm(
        "Clear all saved resume data from this browser? This cannot be undone.",
      )
    ) {
      reset();
      toastResetSuccess();
    }
  };

  if (!hydrated) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading your saved resume...
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-6">
      <div className="bg-mesh pointer-events-none absolute inset-x-0 top-0 h-48 opacity-40" />
      {hasUploaded && (
        <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <p className="text-sm text-muted-foreground">
            Auto-saved in this browser — pick up where you left off.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <SaveIndicator />
            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="size-4" />
              Clear saved data
            </Button>
          </div>
        </div>
      )}

      {!hasUploaded ? (
        <div className="relative mx-auto max-w-xl overflow-visible py-4 md:px-10">
          <div className="bg-dot-grid pointer-events-none absolute inset-0 overflow-x-clip opacity-20 md:opacity-30" />
          <BuilderEntryDecor className="-inset-x-4" />
          <div className="relative">
            <ResumeUpload />
          </div>
          <div className="relative mt-5 text-center">
            <button
              type="button"
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              onClick={startFromScratch}
            >
              Or start from scratch without uploading
            </button>
          </div>
        </div>
      ) : (
        <>
          <ParseStatusBanner />
          <div className="relative mt-4 grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <ResumeProgress />
              <ResumeUpload compact />
              <ResumeEditor />
            </div>
            <div className="lg:sticky lg:top-20 lg:self-start" id="resume-preview-panel">
              <ResumePreview />
            </div>
          </div>
          <MobileBuilderBar />
          <div className="resume-print-only hidden">
            <ResumeDocument resume={resume} style={style} id="resume-print" />
          </div>
        </>
      )}
    </div>
  );
}

export function BuilderLayout() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading your saved resume...
          </div>
        </div>
      }
    >
      <BuilderLayoutContent />
    </Suspense>
  );
}
