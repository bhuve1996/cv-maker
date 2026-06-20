"use client";

import { Loader2, RotateCcw } from "lucide-react";
import { ResumeEditor } from "@/components/forms/resume-editor";
import { ResumeDocument } from "@/components/preview/resume-document";
import { ResumePreview } from "@/components/preview/resume-preview";
import { ResumeUpload } from "@/components/upload/resume-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useResumeHydration } from "@/hooks/use-resume-hydration";
import { useResumeStore } from "@/hooks/use-resume-store";

export function BuilderLayout() {
  const hydrated = useResumeHydration();
  const { hasUploaded, rawText, reset, resume } = useResumeStore();

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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload your resume, refine the details, and export a polished PDF.
            Your progress is saved automatically in this browser.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {hasUploaded && rawText && (
            <Badge variant="secondary">Parsed from upload — review and edit below</Badge>
          )}
          {hasUploaded && (
            <Button type="button" variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="size-4" />
              Clear saved data
            </Button>
          )}
        </div>
      </div>

      {!hasUploaded ? (
        <div className="mx-auto max-w-2xl">
          <ResumeUpload />
          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-primary underline-offset-4 hover:underline"
              onClick={() => useResumeStore.setState({ hasUploaded: true })}
            >
              Skip upload and start from scratch
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <ResumeUpload compact />
              <ResumeEditor />
            </div>
            <div className="lg:sticky lg:top-20 lg:self-start">
              <ResumePreview />
            </div>
          </div>
          <div className="resume-print-only hidden">
            <ResumeDocument resume={resume} id="resume-print" />
          </div>
        </>
      )}
    </div>
  );
}
