import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import { site } from "@/data/site";

export const metadata = {
  title: "Donate",
  description: "How to donate to Vrushahi Foundation — bank transfer, cheque, in-kind support and CSR partnerships.",
};

const ways = [
  {
    icon: "Heart",
    title: "One-time gift",
    body: "A single donation directed to the programme of your choice, or to wherever the need is greatest that month.",
  },
  {
    icon: "CalendarDays",
    title: "Monthly giving",
    body: "Recurring support that lets us plan — a Balwadi teacher's salary or a senior citizen's care doesn't stop after one good month.",
  },
  {
    icon: "BookOpen",
    title: "In-kind donations",
    body: "Books, clothing, learning materials, or hygiene and medical supplies — useful directly, no conversion required.",
  },
  {
    icon: "Landmark",
    title: "Corporate & CSR",
    body: "Structured partnerships for organisations directing CSR funds or employee giving toward a specific programme.",
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Donate"
        title="Your donation reaches a person, not a processing fee."
        description="Vrushahi Foundation is a registered society — every donation is acknowledged and tracked against the programme it supports."
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Ways to give" title="Pick what fits." />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {ways.map((way, i) => (
                <Reveal
                  key={way.title}
                  delay={i * 0.06}
                  className="group rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-soft"
                >
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-terracotta-light text-terracotta-dark transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon name={way.icon} className="size-5" />
                  </span>
                  <h3 className="font-medium text-ink">{way.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{way.body}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1} className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-line shadow-soft">
            <Image
              src="/images/donate-hero.jpg"
              alt="A group of volunteers stacking their hands together"
              fill
              priority
              sizes="(min-width: 1024px) 480px, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-line bg-forest py-20 text-paper sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-marigold-light">
              Bank transfer, cheque or UPI
            </p>
            <h2 className="text-balance font-display text-3xl font-medium sm:text-4xl">
              We confirm every transfer detail directly — no account numbers posted online.
            </h2>
            <p className="mt-4 max-w-lg text-forest-light/85">
              To make sure your donation reaches the right account without error, call
              or email us and our team will share current, verified bank transfer or
              cheque details along with a receipt process.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <a
              href={`tel:${site.contact.phonesRaw[0]}`}
              className="group flex items-center gap-4 rounded-2xl bg-paper/10 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-paper/15"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-paper text-forest transition-transform duration-300 group-hover:scale-110">
                <Icon name="Phone" className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-forest-light/70">Call us</span>
                <span className="block font-medium">{site.contact.phones[0]}</span>
              </span>
            </a>
            <a
              href={`mailto:${site.contact.email}?subject=${encodeURIComponent(
                "Bank transfer details for a donation"
              )}`}
              className="group flex items-center gap-4 rounded-2xl bg-paper/10 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-paper/15"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-paper text-forest transition-transform duration-300 group-hover:scale-110">
                <Icon name="Mail" className="size-5" />
              </span>
              <span>
                <span className="block text-sm text-forest-light/70">Email us</span>
                <span className="block font-medium">{site.contact.email}</span>
              </span>
            </a>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="Trust & transparency" title="The legal basics." />
          <Reveal delay={0.1} className="mt-8 grid gap-4 rounded-2xl border border-line bg-surface p-8 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Registered under
              </p>
              <p className="mt-1 text-ink">{site.registration.act}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Registration number
              </p>
              <p className="mt-1 text-ink">{site.registration.number}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                PAN
              </p>
              <p className="mt-1 text-ink">{site.registration.pan}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Incorporated
              </p>
              <p className="mt-1 text-ink">{site.registration.incorporated}</p>
            </div>
          </Reveal>
          <p className="mt-6 text-sm text-ink-faint">
            An online payment gateway isn&apos;t live on this site yet — we&apos;d
            rather confirm every donation personally while we get that set up
            properly.
          </p>
        </Container>
      </section>
    </>
  );
}
