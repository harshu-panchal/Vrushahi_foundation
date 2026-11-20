import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";
import { getSettings, getPageBlocks } from "@/lib/content/read";

export async function generateMetadata() {
  const blocks = await getPageBlocks("contact");
  return {
    title: "Contact",
    description: blocks.hero.description,
  };
}

export default async function ContactPage() {
  const [settings, blocks] = await Promise.all([
    getSettings(),
    getPageBlocks("contact"),
  ]);

  const phones = settings.contact?.phones || [];
  const phonesRaw = settings.contact?.phonesRaw || [];

  const details = [
    phones.length > 0 && {
      icon: "Phone",
      label: "Phone",
      lines: phones,
      hrefs: phones.map((p, i) => `tel:${phonesRaw[i] || p}`),
    },
    settings.contact?.email && {
      icon: "Mail",
      label: "Email",
      lines: [settings.contact.email],
      hrefs: [`mailto:${settings.contact.email}`],
    },
    settings.location?.line && {
      icon: "MapPin",
      label: "Location",
      lines: [settings.location.line],
      hrefs: [null],
    },
  ].filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={blocks.hero.eyebrow}
        title={blocks.hero.title}
        description={blocks.hero.description}
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            {details.map((detail, i) => (
              <Reveal
                key={detail.label}
                delay={i * 0.06}
                className="group flex items-start gap-4 rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-soft"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-terracotta-light text-terracotta-dark transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon name={detail.icon} className="size-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    {detail.label}
                  </p>
                  {detail.lines.map((line, j) =>
                    detail.hrefs[j] ? (
                      <a
                        key={line}
                        href={detail.hrefs[j]}
                        className="link-underline block text-lg font-medium text-ink transition-colors hover:text-terracotta"
                      >
                        {line}
                      </a>
                    ) : (
                      <p key={line} className="text-lg font-medium text-ink">
                        {line}
                      </p>
                    )
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.15} className="rounded-2xl border border-line bg-paper p-8">
            <h2 className="font-display text-xl font-medium text-ink">
              {blocks.form.title}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              {blocks.form.description}
            </p>
            <div className="mt-6">
              <ContactForm
                endpoint="/api/contact-messages"
                contactEmail={settings.contact?.email}
                submitLabel={blocks.form.primaryLabel || "Send Message"}
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
