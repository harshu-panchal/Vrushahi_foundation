import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Timeline from "@/components/Timeline";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import {
  getSettings,
  getContentItems,
  getPageBlocks,
  ctaProps,
} from "@/lib/content/read";
import { fillPlaceholders, paragraphs } from "@/lib/content/text";

export async function generateMetadata() {
  const blocks = await getPageBlocks("about");
  return {
    title: "Our Story",
    description: blocks.hero.description,
  };
}

export default async function AboutPage() {
  const [settings, blocks, missionPoints, objectives, milestones] =
    await Promise.all([
      getSettings(),
      getPageBlocks("about"),
      getContentItems("missionPoint"),
      getContentItems("objective"),
      getContentItems("timelineEntry"),
    ]);

  const timeline = milestones.map((m) => ({
    year: m.label,
    title: m.title,
    body: fillPlaceholders(m.body, settings),
  }));

  return (
    <>
      <PageHero
        eyebrow={blocks.hero.eyebrow}
        title={blocks.hero.title}
        description={blocks.hero.description}
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-line shadow-soft">
            <Image
              src={blocks.intro.image}
              alt={blocks.intro.imageAlt || ""}
              fill
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Reveal>
          <div>
            <SectionHeading
              eyebrow={blocks.intro.eyebrow}
              title={blocks.intro.title}
            />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
              {paragraphs(blocks.intro.body).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            {blocks.vision.body && (
              <Reveal
                delay={0.1}
                className="group relative mt-8 overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-terracotta/30"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-terracotta transition-transform duration-500 ease-out group-hover:scale-y-100"
                />
                <p className="text-sm font-semibold uppercase tracking-wide text-terracotta">
                  {blocks.vision.eyebrow}
                </p>
                <p className="mt-2 text-lg leading-relaxed text-ink">
                  {blocks.vision.body}
                </p>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={blocks.mission.eyebrow}
              title={blocks.mission.title}
            />
            <ul className="mt-8 space-y-4">
              {missionPoints.map((point, i) => (
                <Reveal
                  as="li"
                  key={point._id || i}
                  delay={i * 0.05}
                  className="group flex gap-3 text-ink-soft"
                >
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-terracotta transition-transform duration-300 group-hover:scale-150" />
                  <span className="leading-relaxed transition-colors group-hover:text-ink">
                    {point.body}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow={blocks.objectives.eyebrow}
              title={blocks.objectives.title}
            />
            <ul className="mt-8 space-y-4">
              {objectives.map((point, i) => (
                <Reveal
                  as="li"
                  key={point._id || i}
                  delay={i * 0.05}
                  className="group flex gap-3 text-ink-soft"
                >
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-forest transition-transform duration-300 group-hover:scale-150" />
                  <span className="leading-relaxed transition-colors group-hover:text-ink">
                    {point.body}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {timeline.length > 0 && (
        <section className="py-20 sm:py-24">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow={blocks.milestones.eyebrow}
              title={blocks.milestones.title}
            />
            <div className="mt-12">
              <Timeline items={timeline} />
            </div>
          </Container>
        </section>
      )}

      <CtaBand {...ctaProps(blocks.cta)} />
    </>
  );
}
