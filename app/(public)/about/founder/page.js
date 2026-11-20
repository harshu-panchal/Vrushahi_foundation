import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { getFounder, getPageBlocks, ctaProps } from "@/lib/content/read";
import { paragraphs } from "@/lib/content/text";

export async function generateMetadata() {
  const founder = await getFounder();
  return {
    title: "Founder",
    description: founder.name
      ? `${founder.name}, ${founder.role} of Vrushahi Foundation.`
      : "The founder of Vrushahi Foundation.",
  };
}

export default async function FounderPage() {
  const [founder, blocks] = await Promise.all([
    getFounder(),
    getPageBlocks("founder"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={blocks.hero.eyebrow}
        title={blocks.hero.title}
        description={blocks.hero.description}
      />

      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal className="group flex flex-col items-start gap-6 rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:border-forest/30 hover:shadow-soft sm:flex-row sm:items-center">
            {founder.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-entered arbitrary URL
              <img
                src={founder.photoUrl}
                alt={founder.name}
                className="size-24 shrink-0 rounded-full object-cover transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105"
              />
            ) : (
              <span className="flex size-24 shrink-0 items-center justify-center rounded-full bg-forest text-3xl font-medium text-paper transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
                {founder.initials}
              </span>
            )}
            <div>
              <h1 className="font-display text-2xl font-medium text-ink">
                {founder.name}
              </h1>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-terracotta">
                {founder.role}
              </p>
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            className="mt-10 space-y-5 text-lg leading-relaxed text-ink-soft"
          >
            {paragraphs(founder.bio).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </Reveal>

          {founder.note && (
            <Reveal
              delay={0.16}
              className="mt-10 rounded-2xl border border-dashed border-line bg-paper p-6 text-sm text-ink-faint"
            >
              {founder.note}
            </Reveal>
          )}
        </Container>
      </section>

      <CtaBand {...ctaProps(blocks.cta)} />
    </>
  );
}
