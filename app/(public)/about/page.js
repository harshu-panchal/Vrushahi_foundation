import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Timeline from "@/components/Timeline";
import Reveal from "@/components/Reveal";
import CtaBand from "@/components/CtaBand";
import { site } from "@/data/site";

export const metadata = {
  title: "Our Story",
  description:
    "The vision, mission and objectives behind Vrushahi Foundation, a Sangli-based society registered since 2017.",
};

const missionPoints = [
  "Promote education, food, health and clothing for underprivileged children and women, giving them appropriate opportunities.",
  "Improve the quality of life of the people we work alongside.",
  "Promote sustainable social change by improving the living conditions of vulnerable populations.",
  "Identify and work with marginalised populations, especially underprivileged children.",
  "Give deserving youth an equal chance to become self-reliant, with a healthy, dignified and sustainable quality of life.",
];

const objectives = [
  "Provide for basic needs — food, shelter, clothing, education and medical care — for women, senior citizens and children.",
  "Secure the rights of children, adults and women by ensuring real opportunity, not just intention.",
  "Support a healthy childhood through quality education, nutrition and health services for marginalised children.",
  "Help enrol underprivileged children in municipal schools.",
  "Provide youth with vocational training to improve their employment prospects.",
  "Provide medical support for children who need critical surgeries.",
  "Promote unity amongst diverse groups within the communities we serve.",
];

const timeline = [
  {
    year: "2016",
    title: "Groundwork",
    body: "A team of social workers already active in health, education and child welfare around Sangli begin organising formally as Vrushahi Foundation.",
  },
  {
    year: "2017",
    title: "Registered as a society",
    body: `Vrushahi Foundation is registered under the ${site.registration.act} (Reg. No. ${site.registration.number}), incorporated on ${site.registration.incorporated}.`,
  },
  {
    year: "Since 2017",
    title: "Six programmes, one district",
    body: "Education, medical support, old-age care, orphan care, women's empowerment and disaster relief grow from a single Balwadi into standing commitments across Sangli district.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="History"
        title="A life not lived for others is not a life."
        description="Vrushahi Foundation is a non-profit registered under the Societies Registration Act, 1860, founded by a team already working in health, education, sustainability, vocational training and child development around Sangli."
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-line shadow-soft">
            <Image
              src="/images/hands-together.jpg"
              alt="Hands clasped together in a gesture of support"
              fill
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Who we are ?"
              title="Working among migrants, abused women, neglected children and senior citizens."
            />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>
                Vrushahi Foundation is a non-profit NGO established under society Registration Act, 1860 (Registration No: Maharashtra/349/2017).
              </p>
              <p>
                Vrushahi Foundation was established by a team of social workers who are working in the field of health, education, sustainability, vocational training, empowering women and child development.
              </p>
              <p>
                Vrushahi Foundation works among migrants, poor and abused women, neglected children, senior citizens, school drop outs, Self Help Groups, and awareness on various social, health and current issues. The underprivileged need to be given the appropriate opportunities and they need to be motivated. Vrushahi Foundation works with a view to help the poor community through various welfare activities.
              </p>
            </div>
            <Reveal
              delay={0.1}
              className="group relative mt-8 overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors duration-300 hover:border-terracotta/30"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-terracotta transition-transform duration-500 ease-out group-hover:scale-y-100"
              />
              <p className="text-sm font-semibold uppercase tracking-wide text-terracotta">
                Our vision
              </p>
              <p className="mt-2 text-lg leading-relaxed text-ink">
                To ensure that the needy women, children and senior citizens we work
                with regain their human rights and are able to sustain themselves in
                society.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our mission" title="What we're working toward." />
            <ul className="mt-8 space-y-4">
              {missionPoints.map((point, i) => (
                <Reveal
                  as="li"
                  key={point}
                  delay={i * 0.05}
                  className="group flex gap-3 text-ink-soft"
                >
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-terracotta transition-transform duration-300 group-hover:scale-150" />
                  <span className="leading-relaxed transition-colors group-hover:text-ink">
                    {point}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading eyebrow="Our objectives" title="How we get there." />
            <ul className="mt-8 space-y-4">
              {objectives.map((point, i) => (
                <Reveal
                  as="li"
                  key={point}
                  delay={i * 0.05}
                  className="group flex gap-3 text-ink-soft"
                >
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-forest transition-transform duration-300 group-hover:scale-150" />
                  <span className="leading-relaxed transition-colors group-hover:text-ink">
                    {point}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Milestones" title="How we got here." />
          <div className="mt-12">
            <Timeline items={timeline} />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
