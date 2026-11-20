import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import DonationForm from "@/components/DonationForm";
import { getSettings, getPrograms, getContentItems, getPageBlocks } from "@/lib/content/read";

export async function generateMetadata() {
  const blocks = await getPageBlocks("donate");
  return {
    title: "Donate",
    description: blocks.hero.description,
  };
}

export default async function DonatePage() {
  const [settings, programs, ways, blocks] = await Promise.all([
    getSettings(),
    getPrograms(),
    getContentItems("donateWay"),
    getPageBlocks("donate"),
  ]);

  const bank = settings.bankDetails || {};
  const bankRows = [
    ["Name", bank.name],
    ["Bank Name", bank.bankName],
    ["Branch", bank.branch],
    ["A/C No", bank.accountNo],
    ["IFSC", bank.ifsc],
    ["City", bank.city],
    ["State", bank.state],
    ["PAN No", bank.pan],
  ].filter(([, value]) => value);

  const registration = settings.registration || {};
  const legalRows = [
    ["Registered under", registration.act],
    ["Registration number", registration.number],
    ["PAN", registration.pan],
    ["Incorporated", registration.incorporated],
  ].filter(([, value]) => value);

  const phone = settings.contact?.phones?.[0];
  const phoneRaw = settings.contact?.phonesRaw?.[0] || phone;
  const email = settings.contact?.email;

  return (
    <>
      <PageHero
        eyebrow={blocks.hero.eyebrow}
        title={blocks.hero.title}
        description={blocks.hero.description}
      />

      <section className="py-20 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow={blocks.ways.eyebrow}
              title={blocks.ways.title}
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {ways.map((way, i) => (
                <Reveal
                  key={way._id || way.title}
                  delay={i * 0.06}
                  className="group rounded-2xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-soft"
                >
                  <span className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-terracotta-light text-terracotta-dark transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon name={way.icon} className="size-5" />
                  </span>
                  <h3 className="font-medium text-ink">{way.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {way.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          {blocks.heroImage.image && (
            <Reveal
              delay={0.1}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-line shadow-soft"
            >
              <Image
                src={blocks.heroImage.image}
                alt={blocks.heroImage.imageAlt || ""}
                fill
                priority
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </Reveal>
          )}
        </Container>
      </section>

      <section className="border-y border-line bg-surface py-20 sm:py-24">
        <Container className="max-w-2xl">
          <SectionHeading
            eyebrow={blocks.online.eyebrow}
            title={blocks.online.title}
          />
          <Reveal
            delay={0.1}
            className="mt-8 rounded-2xl border border-line bg-paper p-6 shadow-soft sm:p-8"
          >
            <DonationForm settings={settings} programs={programs} />
          </Reveal>
          {blocks.online.body && (
            <p className="mt-4 text-xs text-ink-faint">{blocks.online.body}</p>
          )}

          {bankRows.length > 0 && (
            <Reveal
              delay={0.15}
              className="mt-10 rounded-2xl border border-line bg-paper p-6 shadow-soft sm:p-8"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-terracotta-light text-terracotta-dark">
                  <Icon name="Landmark" className="size-5" />
                </span>
                <div>
                  <p className="font-display text-lg font-medium text-ink">
                    {blocks.bank.title}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {blocks.bank.description}
                  </p>
                </div>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm sm:grid-cols-[auto_1fr_auto_1fr]">
                {bankRows.map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="font-semibold text-ink-faint">{label}</dt>
                    <dd className="text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </Container>
      </section>

      <section className="border-y border-line bg-forest py-20 text-paper sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-marigold-light">
              {blocks.contactBand.eyebrow}
            </p>
            <h2 className="text-balance font-display text-3xl font-medium sm:text-4xl">
              {blocks.contactBand.title}
            </h2>
            <p className="mt-4 max-w-lg text-forest-light/85">
              {blocks.contactBand.description}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            {phone && (
              <a
                href={`tel:${phoneRaw}`}
                className="group flex items-center gap-4 rounded-2xl bg-paper/10 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-paper/15"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-paper text-forest transition-transform duration-300 group-hover:scale-110">
                  <Icon name="Phone" className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-forest-light/70">
                    Call us
                  </span>
                  <span className="block font-medium">{phone}</span>
                </span>
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}?subject=${encodeURIComponent(
                  "Bank transfer details for a donation"
                )}`}
                className="group flex items-center gap-4 rounded-2xl bg-paper/10 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-paper/15"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-paper text-forest transition-transform duration-300 group-hover:scale-110">
                  <Icon name="Mail" className="size-5" />
                </span>
                <span>
                  <span className="block text-sm text-forest-light/70">
                    Email us
                  </span>
                  <span className="block font-medium">{email}</span>
                </span>
              </a>
            )}
          </div>
        </Container>
      </section>

      {legalRows.length > 0 && (
        <section className="py-20 sm:py-24">
          <Container className="max-w-3xl">
            <SectionHeading
              eyebrow={blocks.legal.eyebrow}
              title={blocks.legal.title}
            />
            <Reveal
              delay={0.1}
              className="mt-8 grid gap-4 rounded-2xl border border-line bg-surface p-8 sm:grid-cols-2"
            >
              {legalRows.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    {label}
                  </p>
                  <p className="mt-1 text-ink">{value}</p>
                </div>
              ))}
            </Reveal>
          </Container>
        </section>
      )}
    </>
  );
}
