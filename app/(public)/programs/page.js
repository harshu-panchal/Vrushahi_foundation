import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import ProgramCard from "@/components/ProgramCard";
import CtaBand from "@/components/CtaBand";
import { programs } from "@/data/programs";

export const metadata = {
  title: "Our Programs",
  description:
    "Education, medical support, old-age care, orphanage support, women's empowerment and disaster relief — the six programmes Vrushahi Foundation runs across Sangli district.",
};

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Six commitments, run as standing programmes."
        description="Each of these grew out of a need our team saw directly in Sangli district — not a template borrowed from elsewhere."
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, i) => (
              <ProgramCard key={program.slug} program={program} delay={i * 0.06} />
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
