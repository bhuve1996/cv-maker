import Link from "next/link";
import { ArrowLeft, Braces, Download, FileJson } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const EXAMPLE_JSON = `{
  "resume": {
    "personalInfo": {
      "fullName": "Jane Doe",
      "currentTitle": "Senior Frontend Engineer",
      "specialization": ["React", "TypeScript"],
      "email": "jane.doe@email.com",
      "location": { "city": "San Francisco", "country": "USA", "postalCode": "94105" }
    },
    "professionalSummary": {
      "text": "Frontend engineer with 8+ years of experience.",
      "yearsOfExperience": "8+",
      "designation": "Senior Frontend Engineer",
      "coreExpertise": ["React", "TypeScript"]
    },
    "experience": [
      {
        "id": "exp-1",
        "company": "Acme Corp",
        "role": "Senior Frontend Engineer",
        "startDate": "01/2021",
        "endDate": "Present",
        "projects": [
          {
            "id": "proj-1",
            "client": "Customer Dashboard",
            "industry": "SaaS",
            "responsibilities": ["Built React dashboards used by 50k users."],
            "technologies": ["React", "TypeScript"]
          }
        ],
        "technologies": ["React", "TypeScript"]
      }
    ],
    "skills": [
      { "id": "skill-1", "name": "React", "category": "frontend" }
    ],
    "projects": [
      {
        "id": "personal-1",
        "name": "Portfolio Site",
        "description": "Personal site built with Next.js.",
        "technologies": "Next.js, TypeScript"
      }
    ]
  }
}`;

const REQUIRED_SECTIONS = [
  "personalInfo",
  "professionalSummary",
  "experience",
  "education",
  "skills",
  "spokenLanguages",
  "keyAchievements",
  "interests",
  "projects",
  "certifications",
  "optionalFields",
];

export default function JsonImportDocsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/builder"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to builder
          </Link>

          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-3.5 py-1.5 text-sm text-muted-foreground">
              <Braces className="size-3.5 text-primary" />
              JSON import guide
            </div>
            <h1 className="text-3xl font-normal tracking-tight sm:text-4xl">
              Resume JSON import format
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Upload a structured JSON file in the builder to load your full profile without
              AI parsing. Your file stays in the browser — nothing is sent to a server.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accepted formats</CardTitle>
                <CardDescription>
                  The importer accepts either a full parse result or just the resume object.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Recommended:</strong> wrap your data in a
                  top-level <code className="rounded bg-muted px-1.5 py-0.5">resume</code> key,
                  matching the CV Maker schema.
                </p>
                <p>
                  <strong className="text-foreground">Also supported:</strong> a JSON file that
                  contains resume fields directly (for example{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">personalInfo</code> and{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">experience</code> at the root).
                </p>
                <p>
                  Optional fields such as <code className="rounded bg-muted px-1.5 py-0.5">rawText</code>,{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">confidence</code>, and{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">parser</code> are preserved when
                  present.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resume sections</CardTitle>
                <CardDescription>
                  These are the main sections the builder understands.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  {REQUIRED_SECTIONS.map((section) => (
                    <li key={section} className="rounded-md border border-border/60 bg-muted/20 px-3 py-2">
                      <code>{section}</code>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Field notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Experience projects:</strong> each job can
                  include nested client projects with{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">responsibilities</code> and{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">technologies</code> arrays.
                </p>
                <p>
                  <strong className="text-foreground">Personal projects:</strong> use{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">technologies</code> as a single
                  comma-separated string, not an array.
                </p>
                <p>
                  <strong className="text-foreground">Skills:</strong> each skill needs{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">id</code>,{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">name</code>, and{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">category</code> (for example{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">frontend</code>,{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">languages</code>,{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5">backend</code>).
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Minimal example</CardTitle>
                <CardDescription>
                  A shortened sample you can copy and adapt.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <pre className="overflow-x-auto rounded-xl border border-border/60 bg-muted/30 p-4 text-xs leading-relaxed text-foreground">
                  <code>{EXAMPLE_JSON}</code>
                </pre>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/resume-import-example.json"
                    download
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    <Download className="size-4" />
                    Download small example
                  </a>
                  <a
                    href="/resume-master.json"
                    download
                    className={cn(buttonVariants({ variant: "outline" }))}
                  >
                    <FileJson className="size-4" />
                    Download full example
                  </a>
                  <Link href="/builder" className={cn(buttonVariants())}>
                    Import JSON in builder
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
