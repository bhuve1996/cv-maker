"use client";

import { useRef, useState } from "react";
import { Download, Loader2, Printer } from "lucide-react";
import { ResumeDocument } from "@/components/preview/resume-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useResumeStore } from "@/hooks/use-resume-store";
import { downloadResumePdf, printResume } from "@/lib/pdf-export";

export function ResumePreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const resume = useResumeStore((state) => state.resume);
  const fullName = resume.personalInfo.fullName.trim() || "resume";

  const handleDownload = async () => {
    const element = previewRef.current?.querySelector("#resume-preview") as
      | HTMLElement
      | null;

    if (!element) {
      setExportError("Resume preview not ready. Try again in a moment.");
      return;
    }

    setExportError(null);
    setIsExporting(true);

    try {
      await downloadResumePdf(
        element,
        `${fullName.replace(/\s+/g, "-").toLowerCase()}.pdf`,
      );
    } catch {
      setExportError("PDF export failed. Try Print and save as PDF instead.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
        <CardTitle className="text-base">Live Preview</CardTitle>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={printResume}>
            <Printer className="size-4" />
            Print
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isExporting}
            onClick={() => void handleDownload()}
          >
            {isExporting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
            Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        {exportError && (
          <p className="px-4 pt-3 text-sm text-destructive" role="alert">
            {exportError}
          </p>
        )}
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div
            ref={previewRef}
            className="flex justify-center bg-slate-100 p-4"
            id="resume-preview-container"
          >
            <ResumeDocument resume={resume} id="resume-preview" />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
