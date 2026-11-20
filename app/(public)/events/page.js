import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import CtaBand from "@/components/CtaBand";
import { getContentItems, getPageBlocks, ctaProps } from "@/lib/content/read";

export async function generateMetadata() {
  const blocks = await getPageBlocks("events");
  return {
    title: "Events",
    description: blocks.hero.description,
  };
}

export default async function EventsPage() {
  const [events, blocks] = await Promise.all([
    getContentItems("eventCard"),
    getPageBlocks("events"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={blocks.hero.eyebrow}
        title={blocks.hero.title}
        description={blocks.hero.description}
      />

      {blocks.heroImage.image && (
        <section className="py-16">
          <Container>
            <Reveal className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line shadow-lift sm:aspect-[21/9]">
              <Image
                src={blocks.heroImage.image}
                alt={blocks.heroImage.imageAlt || ""}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
            </Reveal>
          </Container>
        </section>
      )}

      <section className="pb-20 sm:pb-24">
        <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <Reveal
              key={event._id || event.title}
              delay={i * 0.06}
              className="group rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-soft"
            >
              <span className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-marigold-light text-terracotta-dark transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Icon name={event.icon} className="size-5" />
              </span>
              <h3 className="font-display text-xl font-medium text-ink transition-colors group-hover:text-terracotta-dark">
                {event.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {event.body}
              </p>
            </Reveal>
          ))}
        </Container>
      </section>

      <CtaBand {...ctaProps(blocks.cta)} />
    </>
  );
}
