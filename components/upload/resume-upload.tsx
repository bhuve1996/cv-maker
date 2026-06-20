"use client";

import { useCallback, useRef, useState } from "react";
import { FileText, FileType2, FileUp, Loader2, Upload } from "lucide-react";
import { ParseRateLimitIndicator } from "@/components/upload/parse-rate-limit-indicator";
import { ParseSourceBadge } from "@/components/builder/parse-source-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mergeParsedResume, setIsParsing, isParsing, parseParser } = useResumeStore();
  const { canRequest, countdown } = useParseRateLimit();
  const uploadDisabled = isParsing || !canRequest;

  const handleFile = useCallback(
    async (file: File) => {
      if (!canRequest) {
        toastRateLimitBlocked(countdown);
        return;
      }

      setError(null);
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
    [canRequest, countdown, mergeParsedResume, setIsParsing],
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (isParsing) return;
      if (!canRequest) {
        toastRateLimitBlocked(countdown);
        return;
      }
      const file = event.dataTransfer.files[0];
      if (file) void handleFile(file);
    },
    [canRequest, countdown, handleFile, isParsing],
  );

  return (
    <Card
      className={cn(
        compact
          ? "border-dashed border-primary/15 bg-card/60 shadow-none"
          : "border-border/60 bg-card/80 shadow-sm ring-1 ring-primary/5",
      )}
    >
      {!compact && (
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <CardTitle>Upload your resume</CardTitle>
              <CardDescription>
                Drop a PDF or DOCX file. Gemini AI parses the content — you can edit
                everything afterward.
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
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300",
            uploadDisabled
              ? "border-muted-foreground/15 bg-muted/10 opacity-80"
              : isDragging
                ? "border-primary bg-primary/8 shadow-inner shadow-primary/10"
                : "border-primary/20 bg-gradient-to-b from-primary/5 to-transparent hover:border-primary/35 hover:bg-primary/8",
          )}
        >
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-primary/5">
            {isParsing ? (
              <Loader2 className="size-7 animate-spin" />
            ) : (
              <Upload className="size-7" />
            )}
          </div>
          <p className="text-base font-medium">
            {isParsing
              ? "Parsing resume with AI..."
              : !canRequest
                ? `AI limit reached — wait ${countdown}`
                : "Drag & drop your resume"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            PDF or DOCX, up to 10MB
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-background/80 px-2.5 py-1 text-xs text-muted-foreground">
              <FileType2 className="size-3.5 text-primary" />
              PDF
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-background/80 px-2.5 py-1 text-xs text-muted-foreground">
              <FileText className="size-3.5 text-primary" />
              DOCX
            </span>
          </div>
          <Button
            type="button"
            className="mt-5"
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
        </div>
        {error && (
          <p className="mt-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
