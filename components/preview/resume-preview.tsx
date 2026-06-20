"use client";

import { useRef } from "react";
import { Download, Printer } from "lucide-react";
import { ResumeTemplate } from "@/components/preview/resume-template";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useResumeStore } from "@/hooks/use-resume-store";
import { downloadResumePdf, printResume } from "@/lib/pdf-export";

export function ResumePreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const resume = useResumeStore((state) => state.resume);
  const fullName = resume.personalInfo.fullName.trim() || "resume";

  const handleDownload = async () => {
    const element = previewRef.current?.querySelector("#resume-preview") as
      | HTMLElement
      | null;
    if (!element) return;
    await downloadResumePdf(element, `${fullName.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
        <CardTitle className="text-base">Live Preview</CardTitle>
        <div className="flex gap-2 print:hidden">
          <Button type="button" variant="outline" size="sm" onClick={printResume}>
            <Printer className="size-4" />
            Print
          </Button>
          <Button type="button" size="sm" onClick={() => void handleDownload()}>
            <Download className="size-4" />
            Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div ref={previewRef} className="bg-slate-100 p-4 print:bg-white print:p-0">
            <ResumeTemplate resume={resume} id="resume-preview" />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
