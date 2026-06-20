import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DATE_FORMAT_HINT,
  DATE_PLACEHOLDER,
} from "@/lib/resume/field-hints";

interface DateRangeFieldsProps {
  startDate: string;
  endDate: string;
  endPlaceholder: string;
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  hintId: string;
}

export function DateRangeFields({
  startDate,
  endDate,
  endPlaceholder,
  onStartChange,
  onEndChange,
  hintId,
}: DateRangeFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${hintId}-start`}>Start Date</Label>
        <Input
          id={`${hintId}-start`}
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          placeholder={DATE_PLACEHOLDER}
          aria-describedby={hintId}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${hintId}-end`}>End Date</Label>
        <Input
          id={`${hintId}-end`}
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          placeholder={endPlaceholder}
          aria-describedby={hintId}
        />
      </div>
      <p id={hintId} className="text-xs text-muted-foreground sm:col-span-2">
        {DATE_FORMAT_HINT}
      </p>
    </>
  );
}
