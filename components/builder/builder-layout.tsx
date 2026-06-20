"use client";

import { Suspense } from "react";
import { Eye, Loader2, PencilLine, RotateCcw } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { MobileBuilderBar } from "@/components/builder/mobile-builder-bar";
import { ParseSourceBadge } from "@/components/builder/parse-source-badge";
import { ParseStatusBanner } from "@/components/builder/parse-status-banner";
import { ResumeProgress } from "@/components/builder/resume-progress";
import { SaveIndicator } from "@/components/builder/save-indicator";
import { StartBanner } from "@/components/brand/start-banner";
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
  const { hasUploaded, reset, resume, startFromScratch, parseParser } = useResumeStore();

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
      <div className="bg-mesh pointer-events-none absolute inset-x-0 top-0 h-64 opacity-50" />
      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <LogoMark size={36} className="mt-0.5 hidden sm:block" />
          <div>
            <h1 className="text-2xl font-normal tracking-tight">Resume Builder</h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Upload your resume, refine the details, and export a polished PDF.
              Your progress is saved automatically in this browser.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {hasUploaded && parseParser && (
            <ParseSourceBadge parser={parseParser} size="sm" />
          )}
          {hasUploaded && <SaveIndicator />}
          {hasUploaded && (
            <Button type="button" variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="size-4" />
              Clear saved data
            </Button>
          )}
        </div>
      </div>

      {!hasUploaded ? (
        <div className="relative mx-auto max-w-2xl">
          <StartBanner />
          <ResumeUpload />
          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
              onClick={startFromScratch}
            >
              Skip upload and start from scratch
            </button>
          </div>
        </div>
      ) : (
        <>
          <ParseStatusBanner />
          <div className="relative mt-4 grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <ResumeProgress />
              <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-sm text-muted-foreground">
                <PencilLine className="size-4 shrink-0 text-primary" />
                <span>Edit sections below — green checks show completed sections.</span>
              </div>
              <ResumeUpload compact />
              <ResumeEditor />
            </div>
            <div className="lg:sticky lg:top-20 lg:self-start" id="resume-preview-panel">
              <div className="mb-3 flex items-center gap-2 px-1 text-sm text-muted-foreground">
                <Eye className="size-4 text-primary" />
                Live preview updates as you edit
              </div>
              <ResumePreview />
            </div>
          </div>
          <MobileBuilderBar />
          <div className="resume-print-only hidden">
            <ResumeDocument resume={resume} id="resume-print" />
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
