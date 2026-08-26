import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import CtaBand from "@/components/CtaBand";

export const metadata = {
  title: "Founder",
  description: "The founder of Vrushahi Foundation.",
};

/**
 * Content note: the old site had no working Founder page (it was a broken
 * "Under Construction" stub). Name below is the best available reading from
 * the Foundation's own registration paperwork and should be confirmed with
 * the Foundation before this goes live — likewise the bio, which is
 * intentionally role-based rather than biographical, since no verified
 * personal history or photograph exists yet.
 */
const founder = {
  name: "Sudhir Nandkumar Deshpande",
  role: "Founder & Managing Trustee",
};

export default function FounderPage() {
  return (
    <>
      <PageHero
        eyebrow="Founder"
        title="The person behind the paperwork."
        description="Vrushahi Foundation was registered in 2017 by a founding trustee already active in social work across Sangli district."
      />

      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <Reveal className="group flex flex-col items-start gap-6 rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:border-forest/30 hover:shadow-soft sm:flex-row sm:items-center">
            <span className="flex size-24 shrink-0 items-center justify-center rounded-full bg-forest text-3xl font-medium text-paper transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
              SD
            </span>
            <div>
              <h1 className="font-display text-2xl font-medium text-ink">
                {founder.name}
              </h1>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-terracotta">
                {founder.role}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>
              Vrushahi Foundation grew out of work already underway — a founding
              trustee and a small team of social workers active in health, education
              and child welfare around Sangli, who formalised that work into a
              registered society in 2017.
            </p>
            <p>
              That founding decision shapes how the Foundation still operates today:
              programmes are run as long-term commitments — a Balwadi, a partner
              children&apos;s home, ongoing support for senior citizens — rather than
              campaigns built around a single fundraising moment.
            </p>
          </Reveal>

          <Reveal delay={0.16} className="mt-10 rounded-2xl border border-dashed border-line bg-paper p-6 text-sm text-ink-faint">
            A fuller founder profile — background, photograph and a first-person
            note — is on its way. If you&apos;re reading this from within the
            Foundation, this section is ready for that content.
          </Reveal>
        </Container>
      </section>

      <CtaBand
        title="Meet the people carrying this work forward."
        description="Our Board of Trustees oversees how every rupee and every hour of volunteer time is put to work."
        primary={{ href: "/about/trustees", label: "Meet the Trustees" }}
        secondary={{ href: "/contact", label: "Get in Touch" }}
      />
    </>
  );
}
