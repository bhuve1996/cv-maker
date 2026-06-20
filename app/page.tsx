import Link from "next/link";
import {
  ArrowRight,
  FileSearch,
  Layers,
  Shield,
  Sparkles,
} from "lucide-react";
import { FeatureGif } from "@/components/brand/animated-gif";
import { HeroBackgroundPattern } from "@/components/brand/feature-illustration";
import { HeroVisual } from "@/components/brand/hero-visual";
import { SupportBadges } from "@/components/brand/support-badges";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: FileSearch,
    illustration: "extract" as const,
    title: "Smart extraction",
    description:
      "Upload a PDF or Word file and AI pulls out your experience, education, and skills into editable fields.",
  },
  {
    icon: Layers,
    illustration: "edit" as const,
    title: "Every section covered",
    description:
      "Personal details, work history, projects, certifications — refine everything in one structured editor.",
  },
  {
    icon: Shield,
    illustration: "private" as const,
    title: "Private by design",
    description:
      "No account, no cloud storage. Your resume data stays in this browser until you export it.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-x-clip">
          <div className="bg-mesh absolute inset-0" />
          <div className="bg-dot-grid absolute inset-0 opacity-40 md:opacity-50" />
          <HeroBackgroundPattern />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
            <div className="grid w-full items-center justify-items-center gap-10 lg:grid-cols-2 lg:gap-16 lg:justify-items-stretch xl:gap-20">
              <div className="w-full max-w-xl text-center lg:max-w-none lg:text-left">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-3.5 py-1.5 text-sm text-muted-foreground">
                  <Sparkles className="size-3.5 animate-pulse-soft text-primary" />
                  Free resume builder
                </div>
                <h1 className="text-4xl font-normal tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                  Build a{" "}
                  <span className="text-gradient italic">professional</span> resume
                  in minutes
                </h1>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
                  Import an existing CV or start fresh. Edit on the left, preview and export on the right.
                </p>
                <SupportBadges className="mt-6 justify-center lg:justify-start" />
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                  <Link
                    href="/builder"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "shadow-md shadow-primary/15",
                    )}
                  >
                    Get started
                    <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/builder?mode=scratch"
                    className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
                  >
                    Start from scratch
                  </Link>
                </div>
              </div>
              <div className="flex w-full justify-center lg:justify-end">
                <HeroVisual />
              </div>
            </div>
          </div>
        </section>

        <section className="border-t bg-muted/30">
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-normal tracking-tight">
                Everything you need, nothing you don&apos;t
              </h2>
              <p className="mt-3 text-muted-foreground">
                A focused tool for creating and exporting a clean, ATS-friendly resume.
              </p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <Card
                  key={feature.title}
                  className="hover-lift overflow-hidden border-border/50 bg-card shadow-sm"
                >
                  <FeatureGif
                    variant={feature.illustration}
                    className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent px-4 py-4"
                  />
                  <CardContent className="pt-5">
                    <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <feature.icon className="size-4" />
                    </div>
                    <h3 className="text-base font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t">
          <div className="bg-mesh absolute inset-0 opacity-50" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <div className="mx-auto w-fit overflow-hidden rounded-2xl border border-border/50 bg-card/60 p-2 shadow-sm">
              <FeatureGif variant="edit" className="max-h-20" />
            </div>
            <h2 className="mt-5 text-2xl font-normal tracking-tight">
              Ready to build your resume?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Open the editor — it takes less than a minute to get started.
            </p>
            <Link
              href="/builder"
              className={cn(buttonVariants({ size: "lg" }), "mt-6")}
            >
              Open Resume Builder
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
