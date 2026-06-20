"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, FileType2, FileUp, Loader2, ShieldCheck, Upload } from "lucide-react";
import { UploadGif } from "@/components/brand/animated-gif";
import { AtsAuditPanel } from "@/components/builder/ats-audit-panel";
import { ParseRateLimitIndicator } from "@/components/upload/parse-rate-limit-indicator";
import { ParseSourceBadge } from "@/components/builder/parse-source-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAtsAudit } from "@/hooks/use-ats-audit";
import { useParseRateLimit } from "@/hooks/use-parse-rate-limit";
import { parseResumeFile, ResumeParseError } from "@/hooks/use-resume-parser";
import { useResumeStore } from "@/hooks/use-resume-store";
import {
  toastParseError,
  toastParseResult,
  toastRateLimitBlocked,
} from "@/lib/toast-messages";
import { cn } from "@/lib/utils";

interface ResumeUploadProps {
  compact?: boolean;
}

export function ResumeUpload({ compact = false }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const auditInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mergeParsedResume, setIsParsing, isParsing, parseParser } = useResumeStore();
  const { canRequest, countdown } = useParseRateLimit();
  const {
    result: auditResult,
    isAuditing,
    error: auditError,
    auditUploadedFile,
    clearAudit,
  } = useAtsAudit();
  const uploadDisabled = isParsing || !canRequest;

  const handleFile = useCallback(
    async (file: File) => {
      if (!canRequest) {
        toastRateLimitBlocked(countdown);
        return;
      }

      setError(null);
      clearAudit();
      setIsParsing(true);

      try {
        const result = await parseResumeFile(file);
        mergeParsedResume(result.resume, result.rawText, {
          parser: result.parser,
          warning: result.warning,
        });
        toastParseResult(result);
      } catch (err) {
        const message =
          err instanceof ResumeParseError
            ? err.message
            : "Something went wrong while parsing your resume.";
        setError(message);
        toastParseError(message);
      } finally {
        setIsParsing(false);
      }
    },
    [canRequest, clearAudit, countdown, mergeParsedResume, setIsParsing],
  );

  const handleAuditFile = useCallback(
    async (file: File) => {
      setError(null);
      clearAudit();

      try {
        await auditUploadedFile(file);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong while running the ATS check.";
        setError(message);
      }
    },
    [auditUploadedFile, clearAudit],
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (isParsing || isAuditing) return;
      const file = event.dataTransfer.files[0];
      if (file) void handleFile(file);
    },
    [handleFile, isAuditing, isParsing],
  );

  return (
    <div className="space-y-4">
      <Card
        className={cn(
          compact
            ? "border-dashed border-border/60 bg-card/60 shadow-none"
            : "border-border/50 bg-card shadow-sm",
        )}
      >
        {!compact && (
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg">Import your resume</CardTitle>
                <CardDescription>
                  We&apos;ll extract the content so you can edit it — nothing is uploaded to a server.
                </CardDescription>
              </div>
              {parseParser && <ParseSourceBadge parser={parseParser} size="sm" />}
            </div>
          </CardHeader>
        )}
        {compact && parseParser && (
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
            <p className="text-xs font-medium text-muted-foreground">Replace resume file</p>
            <ParseSourceBadge parser={parseParser} size="sm" />
          </div>
        )}
        <CardContent className={cn(compact && "p-4")}>
          <ParseRateLimitIndicator className="mb-4" compact={compact} />
          <div
            onDragOver={(event) => {
              event.preventDefault();
              if (!uploadDisabled) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-200",
              uploadDisabled
                ? "border-border bg-muted/20 opacity-80"
                : isDragging
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/80 bg-muted/20 hover:border-primary/30 hover:bg-primary/5",
            )}
          >
            {!compact && !isParsing && (
              <UploadGif className="mb-3 max-h-20" />
            )}
            {(compact || isParsing) && (
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                {isParsing ? (
                  <Loader2 className="size-7 animate-spin" />
                ) : (
                  <Upload className="size-7" />
                )}
              </div>
            )}
            <p className="text-base font-medium">
              {isParsing
                ? "Parsing resume with AI..."
                : !canRequest
                  ? `AI limit reached — wait ${countdown}`
                  : "Drag & drop your resume"}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-0.5">
                <FileType2 className="size-3 text-primary/70" />
                PDF
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-0.5">
                <FileText className="size-3 text-primary/70" />
                DOCX
              </span>
              <span>· up to 10 MB</span>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                disabled={isParsing}
                onClick={() => {
                  if (!canRequest) {
                    toastRateLimitBlocked(countdown);
                    return;
                  }
                  inputRef.current?.click();
                }}
              >
                <FileUp className="size-4" />
                Choose file
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isAuditing}
                onClick={() => auditInputRef.current?.click()}
              >
                {isAuditing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ShieldCheck className="size-4" />
                )}
                ATS formatting check
              </Button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              disabled={uploadDisabled}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
            <input
              ref={auditInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              disabled={isAuditing}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleAuditFile(file);
                event.target.value = "";
              }}
            />
          </div>
          {(error || auditError) && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error ?? auditError}
            </p>
          )}
        </CardContent>
      </Card>

      {auditResult && <AtsAuditPanel result={auditResult} />}
    </div>
  );
}
