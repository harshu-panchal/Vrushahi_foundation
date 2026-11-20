import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import ProgramCard from "@/components/ProgramCard";
import CtaBand from "@/components/CtaBand";
import { getPrograms, getPageBlocks, ctaProps } from "@/lib/content/read";

export async function generateMetadata() {
  const blocks = await getPageBlocks("programs");
  return {
    title: "Our Programs",
    description: blocks.hero.description,
  };
}

export default async function ProgramsPage() {
  const [programs, blocks] = await Promise.all([
    getPrograms(),
    getPageBlocks("programs"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={blocks.hero.eyebrow}
        title={blocks.hero.title}
        description={blocks.hero.description}
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
      <CtaBand {...ctaProps(blocks.cta)} />
    </>
  );
}
