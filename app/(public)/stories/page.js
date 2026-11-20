import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";
import CountUp from "@/components/CountUp";
import { getContentItems, getPageBlocks, getSettings } from "@/lib/content/read";

export async function generateMetadata() {
  const blocks = await getPageBlocks("stories");
  return {
    title: "Stories",
    description: blocks.hero.description,
  };
}

export default async function StoriesPage() {
  const [impactStats, blocks, settings] = await Promise.all([
    getContentItems("impactStat"),
    getPageBlocks("stories"),
    getSettings(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={blocks.hero.eyebrow}
        title={blocks.hero.title}
        description={blocks.hero.description}
      />

      {impactStats.length > 0 && (
        <section className="py-20 sm:py-24">
          <Container>
            <SectionHeading
              eyebrow={blocks.stats.eyebrow}
              title={blocks.stats.title}
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {impactStats.map((stat, i) => (
                <Reveal
                  key={stat._id || stat.title}
                  delay={i * 0.08}
                  className="group rounded-2xl border border-line bg-surface p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-soft"
                >
                  <p className="font-display text-4xl font-medium tabular-nums text-terracotta">
                    <CountUp value={stat.label} />
                  </p>
                  <p className="mt-2 text-sm leading-snug text-ink-soft">
                    {stat.title}
                  </p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="border-y border-line bg-surface py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <Reveal className="group">
            <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-terracotta-light text-terracotta-dark transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
              <Icon name="Quote" className="size-6" />
            </span>
            <h2 className="font-display text-2xl font-medium text-ink">
              {blocks.testimonials.title}
            </h2>
            <p className="mt-3 max-w-md text-lg leading-relaxed text-ink-soft">
              {blocks.testimonials.description}
            </p>
          </Reveal>
          <Reveal delay={0.1} className="rounded-2xl border border-line bg-paper p-8">
            <h3 className="font-display text-xl font-medium text-ink">
              {blocks.form.title}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              {blocks.form.description}
            </p>
            <div className="mt-6">
              <ContactForm
                contactEmail={settings.contact?.email}
                subjectPrefix="A story to share — vrushahifoundation.org"
                fields={["name", "email", "message"]}
                submitLabel={blocks.form.primaryLabel || "Share Your Story"}
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
