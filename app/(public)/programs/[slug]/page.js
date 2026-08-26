import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import CtaBand from "@/components/CtaBand";
import ProgramCard from "@/components/ProgramCard";
import CountUp from "@/components/CountUp";
import { programs, getProgramBySlug } from "@/data/programs";

export function generateStaticParams() {
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) return {};
  return {
    title: program.title,
    description: program.short,
  };
}

export default async function ProgramPage({ params }) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  const others = programs.filter((p) => p.slug !== program.slug).slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-surface">
        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Link
              href="/programs"
              className="group/back mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-terracotta"
            >
              <span className="inline-block transition-transform duration-300 group-hover/back:-translate-x-1">
                &larr;
              </span>
              All programs
            </Link>
            <span className="mb-5 inline-flex size-12 items-center justify-center rounded-full bg-terracotta-light text-terracotta-dark">
              <Icon name={program.icon} className="size-6" />
            </span>
            <h1 className="text-balance font-display text-4xl font-medium text-ink sm:text-5xl">
              {program.title}
            </h1>
            <p className="mt-5 max-w-xl text-balance text-lg leading-relaxed text-ink-soft">
              {program.short}
            </p>
            <div className="mt-8 inline-flex items-baseline gap-2 rounded-2xl border border-line bg-paper px-5 py-4">
              <span className="font-display text-3xl font-medium tabular-nums text-terracotta">
                <CountUp value={program.stat.value} />
              </span>
              <span className="text-sm text-ink-soft">{program.stat.label}</span>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-line shadow-lift">
            <Image
              src={program.image}
              alt={program.imageAlt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl space-y-14">
          {program.sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 0.06}>
              <h2 className="font-display text-2xl font-medium text-ink">
                {section.heading}
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-ink-soft">
                {section.body}
              </p>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-20 sm:py-24">
        <Container>
          <h2 className="font-display text-2xl font-medium text-ink">
            Other programmes
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p, i) => (
              <ProgramCard key={p.slug} program={p} delay={i * 0.06} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand
        title={`Help us do more for ${program.title.toLowerCase()}.`}
        description="Every donation to this programme goes directly toward the activities described above."
      />
    </>
  );
}
