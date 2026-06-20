import { FloatingIcons } from "@/components/brand/floating-icons";
import { HeroResumeGif } from "@/components/brand/animated-gif";
import { HeroBanner } from "@/components/brand/hero-banner";

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px]">
      <div
        className="animate-drift pointer-events-none absolute -right-6 top-0 size-28 rounded-full bg-primary/10 blur-3xl lg:-right-10 lg:size-32"
        aria-hidden
      />
      <div
        className="animate-drift-reverse pointer-events-none absolute -left-4 bottom-8 size-20 rounded-full bg-violet-400/10 blur-2xl lg:-left-6"
        aria-hidden
      />

      {/* Padded orbit area — icons stay anchored to the preview card */}
      <div className="relative lg:px-7 lg:py-5">
        <FloatingIcons />

        <div className="relative z-[1] space-y-3 sm:space-y-4">
          <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-2.5 shadow-sm sm:p-3">
            <HeroResumeGif />
          </div>
          <HeroBanner />
        </div>
      </div>
    </div>
  );
}
