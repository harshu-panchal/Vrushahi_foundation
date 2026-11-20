import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ProgramCard from "@/components/ProgramCard";
import StatBand from "@/components/StatBand";
import CtaBand from "@/components/CtaBand";
import CountUp from "@/components/CountUp";
import Marquee from "@/components/Marquee";
import HeroCarousel from "@/components/HeroCarousel";
import AnimatedHeadline from "@/components/AnimatedHeadline";
import Icon from "@/components/Icon";
import {
  getSettings,
  getPrograms,
  getContentItems,
  getPageBlocks,
  ctaProps,
} from "@/lib/content/read";
import { parseEmphasis } from "@/lib/content/text";

export default async function HomePage() {
  const [
    settings,
    blocks,
    programs,
    impactStats,
    breakthroughs,
    heroSlides,
    marqueeWords,
    galleryStrip,
  ] = await Promise.all([
    getSettings(),
    getPageBlocks("home"),
    getPrograms(),
    getContentItems("impactStat"),
    getContentItems("homeBreakthrough"),
    getContentItems("homeHeroSlide"),
    getContentItems("homeMarquee"),
    getContentItems("homeGalleryStrip"),
  ]);

  const hero = blocks.hero;
  const stats = impactStats.map((s) => ({
    value: s.label,
    label: s.title,
    icon: s.icon,
  }));

  return (
    <>
      <section className="bg-mesh bg-dots relative overflow-hidden bg-surface">
        <div
          aria-hidden="true"
          className="animate-blob absolute -right-32 -top-32 size-[28rem] bg-terracotta/[0.08] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="animate-blob absolute -bottom-40 -left-20 size-96 bg-forest/[0.07] blur-3xl [animation-delay:-6s]"
        />

        <Container className="relative grid gap-12 pb-16 pt-10 sm:pb-20 sm:pt-14 lg:grid-cols-2 lg:items-center lg:pb-24 lg:pt-16">
          <div>
            <p className="animate-badge-in mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta/60" />
                <span className="relative inline-flex size-2 rounded-full bg-terracotta" />
              </span>
              {settings.location?.city}, {settings.location?.state} · Registered
              since {settings.founded}
            </p>
            <AnimatedHeadline
              as="h1"
              baseDelay={0.25}
              className="text-balance font-display text-5xl font-medium leading-[1.05] text-ink sm:text-6xl lg:text-[3.75rem]"
              segments={parseEmphasis(hero.title)}
            />
            <p className="animate-hero-in mt-7 max-w-xl text-balance text-lg leading-relaxed text-ink-soft [animation-delay:1.3s]">
              {hero.description}
            </p>
            <div className="animate-hero-in mt-9 flex flex-wrap items-center gap-4 [animation-delay:1.45s]">
              <Link
                href={hero.primaryHref || "/donate"}
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-paper shadow-lift transition-all duration-300 hover:scale-[1.04] hover:bg-terracotta-dark"
              >
                {hero.primaryLabel}
                <Icon name="ArrowUpRight" className="size-4" />
              </Link>
              <Link
                href={hero.secondaryHref || "/programs"}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/60 px-6 py-3.5 text-sm font-semibold text-ink backdrop-blur transition-all duration-300 hover:scale-[1.04] hover:border-ink"
              >
                {hero.secondaryLabel}
              </Link>
            </div>
            <p className="animate-hero-in mt-8 text-sm text-ink-faint [animation-delay:1.6s]">
              Registered under the {settings.registration?.act} · Reg. No.{" "}
              {settings.registration?.number}
            </p>
          </div>

          <Reveal delay={0.15} className="relative">
            <div
              aria-hidden="true"
              className="absolute -right-4 -top-6 hidden aspect-[4/5] w-[88%] rotate-6 rounded-[2rem] bg-marigold/25 sm:block lg:-right-6 lg:-top-8"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-6 -left-4 hidden aspect-[4/5] w-[88%] -rotate-3 rounded-[2rem] bg-forest/15 sm:block"
            />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-line shadow-lift sm:aspect-[5/4] lg:aspect-[4/5]">
              <HeroCarousel
                images={heroSlides.map((s) => ({
                  src: s.image,
                  alt: s.imageAlt || "",
                }))}
              />
            </div>

            {(blocks.heroCard.title || blocks.heroCard.description) && (
              <div className="animate-float absolute -bottom-6 -left-6 hidden max-w-[13rem] rounded-2xl border border-line bg-paper p-5 shadow-lift sm:block">
                <p className="font-display text-3xl font-medium text-terracotta">
                  <CountUp value={blocks.heroCard.title} />
                </p>
                <p className="mt-1 text-sm leading-snug text-ink-soft">
                  {blocks.heroCard.description}
                </p>
              </div>
            )}

            <div className="absolute -right-3 -top-3 flex size-20 items-center justify-center rounded-full border border-line bg-paper shadow-lift sm:-right-5 sm:-top-5 sm:size-24">
              <svg
                viewBox="0 0 100 100"
                className="animate-spin-slow absolute size-full text-ink-faint/50"
              >
                <defs>
                  <path
                    id="badge-circle"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="none"
                  />
                </defs>
                <text fontSize="8.3" letterSpacing="1.5" fill="currentColor">
                  <textPath href="#badge-circle" startOffset="0%">
                    {blocks.heroBadge.title}
                  </textPath>
                </text>
              </svg>
              <span className="flex size-9 items-center justify-center rounded-full bg-forest text-paper sm:size-11">
                <Icon name="ShieldCheck" className="size-4 sm:size-5" />
              </span>
            </div>
          </Reveal>
        </Container>

        {marqueeWords.length > 0 && (
          <div className="relative border-y border-line/70 bg-ink py-3">
            <Marquee
              items={marqueeWords.map((w) => w.label)}
              itemClassName="mx-4 flex items-center gap-4 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em] text-paper/70 after:content-['✦'] after:text-terracotta/60 sm:text-sm"
            />
          </div>
        )}
      </section>

      <section className="relative overflow-hidden py-20 sm:py-24">
        <p
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 left-1/2 -z-10 -translate-x-1/2 select-none whitespace-nowrap font-display text-[10rem] font-medium text-ink/[0.03] sm:text-[14rem]"
        >
          {settings.shortName}
        </p>
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <SectionHeading
            eyebrow={blocks.whoWeAre.eyebrow}
            title={blocks.whoWeAre.title}
            description={blocks.whoWeAre.description}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {breakthroughs.map((item, i) => (
              <Reveal
                key={item._id || item.title}
                delay={i * 0.08}
                className="group rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-soft"
              >
                <span className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-forest-light text-forest transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <h3 className="font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {stats.length > 0 && <StatBand stats={stats} />}

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={blocks.programs.eyebrow}
            title={blocks.programs.title}
            description={blocks.programs.description}
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, i) => (
              <ProgramCard key={program.slug} program={program} delay={i * 0.06} />
            ))}
          </div>
        </Container>
      </section>

      {galleryStrip.length > 0 && (
        <section className="border-y border-line bg-surface py-14 sm:py-16">
          <Reveal className="mb-8 px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-terracotta">
              {blocks.galleryStrip.eyebrow}
            </p>
          </Reveal>
          <Marquee
            duration="38s"
            className="mask-fade-x"
            items={galleryStrip.map((img, i) => (
              <div
                key={i}
                className="relative mx-3 h-48 w-64 shrink-0 overflow-hidden rounded-2xl border border-line shadow-soft sm:h-56 sm:w-72"
              >
                <Image
                  src={img.image}
                  alt={img.imageAlt || ""}
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              </div>
            ))}
          />
        </section>
      )}

      <section className="relative overflow-hidden border-b border-line bg-surface py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative order-2 lg:order-1">
            <div
              aria-hidden="true"
              className="absolute -bottom-5 -right-5 hidden aspect-[4/3] w-[90%] rotate-3 rounded-2xl bg-terracotta/15 sm:block"
            />
            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line shadow-soft">
              <Image
                src={blocks.eventsTeaser.image}
                alt={blocks.eventsTeaser.imageAlt || ""}
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-terracotta">
              {blocks.eventsTeaser.eyebrow}
            </p>
            <h2 className="text-balance font-display text-3xl font-medium text-ink sm:text-4xl">
              {blocks.eventsTeaser.title}
            </h2>
            <p className="mt-4 text-balance text-lg leading-relaxed text-ink-soft">
              {blocks.eventsTeaser.description}
            </p>
            <Link
              href={blocks.eventsTeaser.primaryHref || "/events"}
              className="group/link mt-6 inline-flex items-center gap-2 text-sm font-semibold text-terracotta"
            >
              {blocks.eventsTeaser.primaryLabel}
              <Icon
                name="ArrowRight"
                className="size-4 transition-transform duration-300 group-hover/link:translate-x-1.5"
              />
            </Link>
          </Reveal>
        </Container>
      </section>

      <CtaBand {...ctaProps(blocks.cta)} />
    </>
  );
}
