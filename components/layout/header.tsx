import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group transition-opacity hover:opacity-90"
        >
          <Logo size="sm" />
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost" }), "text-muted-foreground")}
          >
            Home
          </Link>
          <Link
            href="/builder"
            className={cn(buttonVariants(), "shadow-sm shadow-primary/15")}
          >
            Build Resume
          </Link>
        </nav>
      </div>
    </header>
  );
}
