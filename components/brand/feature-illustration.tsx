import Image from "next/image";

interface FeatureIllustrationProps {
  variant: "extract" | "edit" | "private";
  className?: string;
}

export function FeatureIllustration({ variant, className }: FeatureIllustrationProps) {
  if (variant === "extract") {
    return (
      <div className={className} aria-hidden>
        <svg viewBox="0 0 120 80" fill="none" className="mx-auto h-16 w-auto opacity-90">
          <rect x="8" y="8" width="44" height="56" rx="4" fill="oklch(0.48 0.16 265 / 0.08)" stroke="oklch(0.48 0.16 265 / 0.2)" strokeWidth="1.5"/>
          <rect x="16" y="18" width="24" height="3" rx="1.5" fill="oklch(0.48 0.16 265 / 0.25)"/>
          <rect x="16" y="26" width="28" height="2" rx="1" fill="oklch(0.48 0.16 265 / 0.12)"/>
          <rect x="16" y="32" width="22" height="2" rx="1" fill="oklch(0.48 0.16 265 / 0.12)"/>
          <path d="M58 40h12" stroke="oklch(0.48 0.16 265 / 0.3)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3"/>
          <path d="M72 36l6 4-6 4V36z" fill="oklch(0.48 0.16 265 / 0.35)"/>
          <rect x="84" y="12" width="28" height="48" rx="4" fill="oklch(0.48 0.16 265 / 0.06)" stroke="oklch(0.48 0.16 265 / 0.15)" strokeWidth="1.5"/>
          <rect x="90" y="20" width="16" height="2" rx="1" fill="oklch(0.48 0.16 265 / 0.2)"/>
          <rect x="90" y="26" width="14" height="2" rx="1" fill="oklch(0.48 0.16 265 / 0.1)"/>
          <rect x="90" y="32" width="16" height="2" rx="1" fill="oklch(0.48 0.16 265 / 0.1)"/>
          <circle cx="98" cy="48" r="6" fill="oklch(0.48 0.16 265 / 0.15)"/>
          <path d="M96 48l1.5 1.5L100 46" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }

  if (variant === "edit") {
    return (
      <div className={className} aria-hidden>
        <svg viewBox="0 0 120 80" fill="none" className="mx-auto h-16 w-auto opacity-90">
          <rect x="20" y="10" width="80" height="60" rx="6" fill="oklch(0.48 0.16 265 / 0.06)" stroke="oklch(0.48 0.16 265 / 0.15)" strokeWidth="1.5"/>
          <rect x="30" y="22" width="32" height="4" rx="2" fill="oklch(0.48 0.16 265 / 0.2)"/>
          <rect x="30" y="32" width="50" height="2" rx="1" fill="oklch(0.48 0.16 265 / 0.1)"/>
          <rect x="30" y="38" width="44" height="2" rx="1" fill="oklch(0.48 0.16 265 / 0.1)"/>
          <rect x="30" y="48" width="18" height="10" rx="3" fill="oklch(0.48 0.16 265 / 0.12)" stroke="oklch(0.48 0.16 265 / 0.25)" strokeWidth="1"/>
          <rect x="52" y="48" width="18" height="10" rx="3" fill="oklch(0.48 0.16 265 / 0.08)"/>
          <rect x="74" y="48" width="18" height="10" rx="3" fill="oklch(0.48 0.16 265 / 0.08)"/>
          <path d="M88 18l8 8" stroke="oklch(0.48 0.16 265 / 0.4)" strokeWidth="2" strokeLinecap="round"/>
          <path d="M82 24l2 2 8-8-2-2-8 8z" fill="oklch(0.48 0.16 265 / 0.25)"/>
        </svg>
      </div>
    );
  }

  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 120 80" fill="none" className="mx-auto h-16 w-auto opacity-90">
        <rect x="30" y="16" width="60" height="48" rx="6" fill="oklch(0.48 0.16 265 / 0.06)" stroke="oklch(0.48 0.16 265 / 0.15)" strokeWidth="1.5"/>
        <rect x="40" y="28" width="28" height="3" rx="1.5" fill="oklch(0.48 0.16 265 / 0.15)"/>
        <rect x="40" y="36" width="36" height="2" rx="1" fill="oklch(0.48 0.16 265 / 0.1)"/>
        <rect x="40" y="42" width="30" height="2" rx="1" fill="oklch(0.48 0.16 265 / 0.1)"/>
        <circle cx="60" cy="58" r="14" fill="oklch(0.48 0.16 265 / 0.1)" stroke="oklch(0.48 0.16 265 / 0.2)" strokeWidth="1.5"/>
        <rect x="54" y="54" width="12" height="10" rx="2" fill="oklch(0.48 0.16 265 / 0.25)"/>
        <circle cx="60" cy="50" r="2.5" fill="oklch(0.48 0.16 265 / 0.3)"/>
        <path d="M18 40h8M94 40h8" stroke="oklch(0.48 0.16 265 / 0.15)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4"/>
      </svg>
    </div>
  );
}

export function HeroBackgroundPattern() {
  return (
    <Image
      src="/hero-pattern.svg"
      alt=""
      width={400}
      height={400}
      className="pointer-events-none absolute -right-16 -top-16 hidden size-64 opacity-30 md:block lg:-right-24 lg:size-80 lg:opacity-40 xl:-right-32 xl:size-96"
      aria-hidden
      priority
    />
  );
}
