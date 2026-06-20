"use client";

import { Download, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeExport } from "@/hooks/use-resume-export";

export function MobileBuilderBar() {
  const { downloadPdf, scrollToPreview, isExporting } = useResumeExport();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 p-3 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={scrollToPreview}
        >
          <Eye className="size-4" />
          Preview
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={isExporting}
          onClick={() => void downloadPdf()}
        >
          {isExporting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Download className="size-4" />
          )}
          Download PDF
        </Button>
      </div>
    </div>
  );
}
