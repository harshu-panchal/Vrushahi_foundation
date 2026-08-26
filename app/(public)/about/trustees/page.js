import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import CtaBand from "@/components/CtaBand";

export const metadata = {
  title: "Trustees",
  description: "The Board of Trustees governing Vrushahi Foundation.",
};

/**
 * Content note: the old site never published real trustee names (its
 * Trustees page was a broken stub). Seats are shown by role so the page is
 * launch-ready in structure; names/photos should be added once confirmed
 * with the Foundation.
 */
const seats = [
  "Chairperson",
  "Managing Trustee",
  "Secretary",
  "Treasurer",
  "Trustee",
  "Trustee",
];

export default function TrusteesPage() {
  return (
    <>
      <PageHero
        eyebrow="Governance"
        title="A Board of Trustees, not a single decision-maker."
        description="Vrushahi Foundation is governed by a Board of Trustees responsible for how the Foundation's programmes and funds are directed."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {seats.map((role, i) => (
              <Reveal
                key={`${role}-${i}`}
                delay={i * 0.06}
                className="group rounded-2xl border border-dashed border-line bg-surface p-6 text-center transition-all duration-300 hover:border-terracotta/40 hover:bg-paper"
              >
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-paper text-ink-faint transition-transform duration-300 group-hover:scale-110 group-hover:text-terracotta">
                  <Icon name="Users" className="size-6" />
                </span>
                <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-terracotta">
                  {role}
                </p>
                <p className="mt-1 text-sm text-ink-faint">Name to be confirmed</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3} className="mt-10 max-w-2xl text-sm text-ink-faint">
            We&apos;re updating this page with the current Board&apos;s names,
            designations and photographs. Reach out via our{" "}
            <a href="/contact" className="link-underline font-semibold text-terracotta">
              contact page
            </a>{" "}
            if you need trustee details sooner.
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
