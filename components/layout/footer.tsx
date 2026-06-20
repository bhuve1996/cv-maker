import { Logo } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        <Logo className="justify-center" size="sm" />
        <p>Build a polished resume in minutes. No account required.</p>
      </div>
    </footer>
  );
}
