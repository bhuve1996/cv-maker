"use client";

import { useEffect, useRef, useState } from "react";
import { Bold, Italic, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !editorRef.current) return;
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [mounted, value]);

  const execCommand = (command: string) => {
    document.execCommand(command, false);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  if (!mounted) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex gap-1 rounded-md border bg-muted/40 p-1">
          <div className="size-7 rounded-md bg-muted" />
          <div className="size-7 rounded-md bg-muted" />
          <div className="size-7 rounded-md bg-muted" />
        </div>
        <div className="min-h-28 rounded-md border bg-muted/30" />
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-1 rounded-md border bg-muted/40 p-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => execCommand("bold")}
          aria-label="Bold"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => execCommand("italic")}
          aria-label="Italic"
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => execCommand("insertUnorderedList")}
          aria-label="Bullet list"
        >
          <List className="size-4" />
        </Button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-28 rounded-md border bg-background px-3 py-2 text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onInput={() => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
