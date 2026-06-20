import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  size?: number;
}

export function LogoMark({ className, size = 32 }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
      <path
        d="M10 9h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1Z"
        fill="white"
        fillOpacity="0.95"
      />
      <path
        d="M12 13h8M12 16.5h6M12 20h4"
        stroke="oklch(0.52 0.19 275)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M21.5 8.5 23 7l1.5 1.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="23.5" cy="7.5" r="2.5" fill="white" fillOpacity="0.35" />
      <defs>
        <linearGradient id="logo-gradient" x1="4" y1="4" x2="28" y2="28">
          <stop stopColor="oklch(0.58 0.19 275)" />
          <stop offset="1" stopColor="oklch(0.48 0.18 290)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const LOGO_SIZES = { sm: 28, md: 32, lg: 40 } as const;
const TEXT_SIZES = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
} as const;

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={LOGO_SIZES[size]} />
      {showText && (
        <span className={cn("font-heading font-normal tracking-tight", TEXT_SIZES[size])}>
          CV Maker
        </span>
      )}
    </span>
  );
}
