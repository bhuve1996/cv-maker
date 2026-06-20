import Link from "next/link";
import { ArrowRight, FileText, Sparkles, Upload, Wand2 } from "lucide-react";
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
  },
  {
    icon: Wand2,
    title: "Edit every section",
    description:
      "Review and refine personal info, experience, education, skills, and more in one place.",
  },
  {
    icon: Sparkles,
    title: "Live preview & export",
    description:
      "See your resume update instantly, then download a clean PDF or print directly.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm text-muted-foreground">
                <FileText className="size-4 text-primary" />
                Simple resume builder — no login required
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Build a professional resume in minutes
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                Upload your existing CV, edit the extracted content, preview a polished
                template, and export a PDF — all in your browser.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/builder" className={cn(buttonVariants({ size: "lg" }))}>
                  Upload Resume
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/builder"
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
                >
                  Start from scratch
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-3 text-muted-foreground">
              A focused workflow designed for speed — upload, edit, preview, export.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="border-muted/60 shadow-sm">
                <CardContent className="pt-6">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="size-5" />
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

        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight">
              Ready to polish your resume?
            </h2>
            <p className="mt-3 text-muted-foreground">
              No account, no database — just a fast frontend-first builder.
            </p>
            <Link href="/builder" className={cn(buttonVariants({ size: "lg" }), "mt-6")}>
              Open Resume Builder
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
