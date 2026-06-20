"use client";

import { useCallback, useRef, useState } from "react";
import { FileUp, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseResumeFile, ResumeParseError } from "@/hooks/use-resume-parser";
import { useResumeStore } from "@/hooks/use-resume-store";
import { cn } from "@/lib/utils";

interface ResumeUploadProps {
  compact?: boolean;
}

export function ResumeUpload({ compact = false }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mergeParsedResume, setIsParsing, isParsing } = useResumeStore();

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsParsing(true);

      try {
        const result = await parseResumeFile(file);
        mergeParsedResume(result.resume, result.rawText, {
          parser: result.parser,
          warning: result.warning,
        });
      } catch (err) {
        const message =
          err instanceof ResumeParseError
            ? err.message
            : "Something went wrong while parsing your resume.";
        setError(message);
      } finally {
        setIsParsing(false);
      }
    },
    [mergeParsedResume, setIsParsing],
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];
      if (file) void handleFile(file);
    },
    [handleFile],
  );

  return (
    <Card className={cn(compact && "border-dashed shadow-none")}>
      {!compact && (
        <CardHeader>
          <CardTitle>Upload your resume</CardTitle>
          <CardDescription>
            Drop a PDF or DOCX file. We&apos;ll extract what we can — you can edit
            everything afterward.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn(compact && "p-4")}>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 bg-muted/20",
          )}
        >
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            {isParsing ? (
              <Loader2 className="size-7 animate-spin" />
            ) : (
              <Upload className="size-7" />
            )}
          </div>
          <p className="text-base font-medium">
            {isParsing ? "Parsing resume with AI..." : "Drag & drop your resume"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            PDF or DOCX, up to 10MB
          </p>
          <Button
            type="button"
            className="mt-5"
            disabled={isParsing}
            onClick={() => inputRef.current?.click()}
          >
            <FileUp className="size-4" />
            Choose file
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
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
