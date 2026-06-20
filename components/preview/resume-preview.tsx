"use client";

import { Download, Loader2, Printer, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AtsAuditPanel } from "@/components/builder/ats-audit-panel";
import { AtsScoreBadge } from "@/components/builder/ats-score-badge";
import { ResumeStylePanel } from "@/components/builder/resume-style-panel";
import { ResumeDocument } from "@/components/preview/resume-document";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAtsAudit } from "@/hooks/use-ats-audit";
import { useResumeExport } from "@/hooks/use-resume-export";
import { useResumeStore } from "@/hooks/use-resume-store";
import { printResume } from "@/lib/pdf-export";

export function ResumePreview() {
  const { downloadPdf, isExporting, exportError } = useResumeExport();
  const resume = useResumeStore((state) => state.resume);
  const style = useResumeStore((state) => state.style);
  const { result, isAuditing, error: auditError, auditBuilderResume } = useAtsAudit();
  const [showAudit, setShowAudit] = useState(false);

  const previewTitle =
    resume.personalInfo.fullName.trim() || "Your resume";
  const previewSubtitle = "PDF export layout · updates as you edit";

  const handleAtsCheck = async () => {
    try {
      await auditBuilderResume(resume);
      setShowAudit(true);
    } catch {
      setShowAudit(true);
    }
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <Card className="flex h-full flex-col overflow-hidden border-border/60 bg-card/80 shadow-sm ring-1 ring-primary/5">
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 border-b pb-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-base font-semibold">{previewTitle}</h2>
              {result && <AtsScoreBadge score={result.overallScore} />}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{previewSubtitle}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isAuditing}
              onClick={() => void handleAtsCheck()}
            >
              {isAuditing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              <span className="hidden sm:inline">ATS check</span>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={printResume}>
              <Printer className="size-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={isExporting}
              onClick={() => void downloadPdf()}
            >
              {isExporting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {exportError && (
            <p className="px-4 pt-3 text-sm text-destructive" role="alert">
              {exportError}
            </p>
          )}
          {auditError && (
            <p className="px-4 pt-3 text-sm text-destructive" role="alert">
              {auditError}
            </p>
          )}
          <ScrollArea className="h-[min(60vh,800px)] lg:h-[calc(100vh-12rem)]">
            <div className="flex justify-center overflow-x-auto bg-gradient-to-b from-muted/80 to-muted/40 p-3 sm:p-4">
              <ResumeDocument resume={resume} style={style} id="resume-preview" />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <ResumeStylePanel />

      {showAudit && result && <AtsAuditPanel result={result} />}
    </div>
  );
}
