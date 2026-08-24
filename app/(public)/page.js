import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ProgramCard from "@/components/ProgramCard";
import StatBand from "@/components/StatBand";
import CtaBand from "@/components/CtaBand";
import Icon from "@/components/Icon";
import { programs } from "@/data/programs";
import { site, impactStats } from "@/data/site";

const breakthroughs = [
  {
    icon: "BookOpen",
    title: "A Balwadi in Sangli",
    body: "A day-care and pre-school for children from slum settlements, run by two part-time teachers focused on literacy, hygiene and habit-building.",
  },
  {
    icon: "Home",
    title: "A home for brick-kiln children",
    body: "We adopted a pre-school for deaf and hard-of-hearing children at Tasgaon, built for the children of migrant brick-kiln labourers who move too often to stay enrolled anywhere else.",
  },
  {
    icon: "HandHeart",
    title: "Orphanages & senior care",
    body: "Ongoing support for a residential children's home and for senior citizens with nowhere else to turn — not one-time gifts, but a standing commitment.",
  },
  {
    icon: "ShieldCheck",
    title: "Safety workshops for girls",
    body: "Seminars and discourses in colleges addressing the sexual harassment of girl students — practical, uncomfortable conversations that most institutions skip.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-surface">
        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
              {site.location.city}, {site.location.state} · Registered since {site.founded}
            </p>
            <h1 className="text-balance font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl lg:text-[3.25rem]">
              Small acts, sustained for years, change what a family believes is possible.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-ink-soft">
              Vrushahi Foundation works alongside underprivileged children, women,
              senior citizens and disaster-affected families across Sangli district —
              through education, healthcare, elder care and vocational training built
              to outlast a single donation.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-terracotta-dark"
              >
                Donate Now
                <Icon name="ArrowUpRight" className="size-4" />
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
              >
                See our programs
              </Link>
            </div>
            <p className="mt-8 text-sm text-ink-faint">
              Registered under the {site.registration.act} · Reg. No.{" "}
              {site.registration.number}
            </p>
          </Reveal>

          <Reveal delay={0.15} className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-line shadow-lift sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="/images/hero-home.jpg"
                alt="Children from a Sangli community that Vrushahi Foundation works alongside"
                fill
                priority
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden max-w-[13rem] rounded-2xl border border-line bg-paper p-5 shadow-lift sm:block">
              <p className="font-display text-3xl font-medium text-terracotta">300+</p>
              <p className="mt-1 text-sm leading-snug text-ink-soft">
                children supported through our care and education programmes
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <SectionHeading
            eyebrow="Who we are"
            title="A team of social workers, not a fundraising brand."
            description="Vrushahi Foundation was founded by social workers already active in health, education, sustainability, vocational training and child development around Sangli. We work among migrants, abused women, neglected children, senior citizens, school drop-outs and Self-Help Groups — because the underprivileged don't just need resources, they need to be given a real opportunity and the motivation to use it."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {breakthroughs.map((item, i) => (
              <Reveal
                key={item.title}
                delay={i * 0.08}
                className="rounded-2xl border border-line bg-paper p-6"
              >
                <span className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-forest-light text-forest">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <h3 className="font-medium text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <StatBand stats={impactStats} />

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Where the work happens"
            title="Six programmes, one goal: dignity that doesn't depend on charity."
            description="Each programme is run as a standing commitment, not a seasonal campaign."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, i) => (
              <ProgramCard key={program.slug} program={program} delay={i * 0.06} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative order-2 aspect-[4/3] overflow-hidden rounded-2xl border border-line shadow-soft lg:order-1">
            <Image
              src="/images/events.jpg"
              alt="A festival gathering in Maharashtra that Vrushahi Foundation volunteers take part in"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={0.1} className="order-1 lg:order-2">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-terracotta">
              On the ground
            </p>
            <h2 className="text-balance font-display text-3xl font-medium text-ink sm:text-4xl">
              Festivals, workshops and exhibitions — not just donation drives.
            </h2>
            <p className="mt-4 text-balance text-lg leading-relaxed text-ink-soft">
              From a 25-volunteer Dahi Handi celebration to Children&apos;s Day
              festivities and hygiene workshops in local schools and hospitals, our
              events are where the community actually meets the mission.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-terracotta"
            >
              See our events
              <Icon name="ArrowRight" className="size-4" />
            </Link>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
