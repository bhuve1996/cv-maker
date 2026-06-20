import Link from "next/link";
import { ArrowRight, Sparkles, Upload, Wand2 } from "lucide-react";
import { HeroBanner } from "@/components/brand/hero-banner";
import { Logo } from "@/components/brand/logo";
import { SupportBadges } from "@/components/brand/support-badges";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Upload,
    title: "Upload PDF or DOCX",
    description:
      "Drop your existing resume and we'll extract the content to get you started quickly.",
    step: "01",
  },
  {
    icon: Wand2,
    title: "Edit every section",
    description:
      "Review and refine personal info, experience, education, skills, and more in one place.",
    step: "02",
  },
  {
    icon: Sparkles,
    title: "Live preview & export",
    description:
      "See your resume update instantly, then download a clean PDF or print directly.",
    step: "03",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="bg-mesh absolute inset-0" />
          <div className="bg-dot-grid absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="text-center lg:text-left">
                <div className="mb-6 flex justify-center lg:justify-start">
                  <Logo size="lg" />
                </div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/70 px-4 py-1.5 text-sm text-muted-foreground shadow-sm backdrop-blur-sm">
                  <Sparkles className="size-4 text-primary" />
                  Simple resume builder — no login required
                </div>
                <h1 className="text-4xl font-normal tracking-tight sm:text-5xl lg:text-5xl xl:text-6xl">
                  Build a{" "}
                  <span className="text-gradient italic">professional</span> resume
                  in minutes
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
                  Upload your existing CV, edit the extracted content, preview a polished
                  template, and export a PDF — all in your browser.
                </p>
                <SupportBadges className="mt-6" />
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                  <Link
                    href="/builder"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "glow-primary shadow-lg shadow-primary/20",
                    )}
                  >
                    Upload Resume
                    <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/builder?mode=scratch"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "outline" }),
                      "border-primary/20 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:bg-card",
                    )}
                  >
                    Start from scratch
                  </Link>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <HeroBanner />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium tracking-widest text-primary uppercase">
              How it works
            </p>
            <h2 className="mt-2 text-3xl font-normal tracking-tight">
              Three steps to a polished CV
            </h2>
            <p className="mt-3 text-muted-foreground">
              A focused workflow designed for speed — upload, edit, preview, export.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="hover-lift group border-border/60 bg-card/80 shadow-sm ring-1 ring-primary/5"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                      <feature.icon className="size-5" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground/60">
                      {feature.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden border-t">
          <div className="bg-mesh absolute inset-0 opacity-60" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <Logo className="mx-auto justify-center" size="md" />
            <h2 className="mt-4 text-2xl font-normal tracking-tight">
              Ready to polish your resume?
            </h2>
            <p className="mt-3 text-muted-foreground">
              No account, no database — just a fast frontend-first builder.
            </p>
            <Link
              href="/builder"
              className={cn(buttonVariants({ size: "lg" }), "mt-6 shadow-md shadow-primary/15")}
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
