import Image from "next/image";
import { cn } from "@/lib/utils";

interface AnimatedGifProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function AnimatedGif({
  src,
  alt,
  className,
  width = 240,
  height = 160,
  priority = false,
}: AnimatedGifProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      priority={priority}
      className={cn("h-auto w-full object-contain", className)}
    />
  );
}

const FEATURE_GIFS = {
  extract: { src: "/gifs/upload.gif", alt: "Animated upload — drop your resume file" },
  edit: { src: "/gifs/edit.gif", alt: "Animated editing — refine every section" },
  private: { src: "/gifs/export.gif", alt: "Animated export — download your PDF" },
} as const;

interface FeatureGifProps {
  variant: keyof typeof FEATURE_GIFS;
  className?: string;
}

export function FeatureGif({ variant, className }: FeatureGifProps) {
  const { src, alt } = FEATURE_GIFS[variant];
  return (
    <AnimatedGif
      src={src}
      alt={alt}
      className={cn("mx-auto max-h-28 w-auto", className)}
    />
  );
}

export function HeroResumeGif({ className }: { className?: string }) {
  return (
    <AnimatedGif
      src="/gifs/hero-resume.gif"
      alt="Animated resume preview with live updates"
      width={320}
      height={220}
      priority
      className={cn("mx-auto w-full max-w-[280px] sm:max-w-xs lg:max-w-sm", className)}
    />
  );
}

export function UploadGif({ className }: { className?: string }) {
  return (
    <AnimatedGif
      src="/gifs/upload.gif"
      alt="Drag and drop your resume to upload"
      className={cn("mx-auto max-h-24 w-auto opacity-90", className)}
    />
  );
}
