import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";
import { impactStats } from "@/data/site";

export const metadata = {
  title: "Stories",
  description: "Success stories and testimonials from Vrushahi Foundation's work in Sangli district.",
};

export default function StoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Stories"
        title="We'd rather publish real stories late than invented ones on time."
        description="This page is being built alongside our beneficiaries and partners, with their consent — not written for them in advance."
      />

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow="What we can show today" title="The shape of our impact so far." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * 0.08}
                className="rounded-2xl border border-line bg-surface p-6 text-center"
              >
                <p className="font-display text-4xl font-medium text-terracotta">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm leading-snug text-ink-soft">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-terracotta-light text-terracotta-dark">
              <Icon name="Quote" className="size-6" />
            </span>
            <h2 className="font-display text-2xl font-medium text-ink">
              Testimonials, done properly
            </h2>
            <p className="mt-3 max-w-md text-lg leading-relaxed text-ink-soft">
              We&apos;re collecting first-hand accounts from the families, volunteers
              and partner institutions we work with — each one published only with
              explicit consent. If you&apos;ve worked with Vrushahi Foundation and
              are willing to share your experience, we&apos;d like to hear it.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border border-line bg-paper p-8">
            <h3 className="font-display text-xl font-medium text-ink">
              Share your story
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              Volunteer, donor, partner or beneficiary — tell us what you&apos;d
              like to share.
            </p>
            <div className="mt-6">
              <ContactForm
                subjectPrefix="A story to share — vrushahifoundation.org"
                fields={["name", "email", "message"]}
                submitLabel="Share Your Story"
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
