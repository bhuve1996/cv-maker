import { BuilderLayout } from "@/components/builder/builder-layout";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function BuilderPage() {
  return (
    <>
      <Header />
      <main className="flex-1 print:block">
        <BuilderLayout />
      </main>
      <Footer />
    </>
  );
}
