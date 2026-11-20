import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import CtaBand from "@/components/CtaBand";
import { getTrustees, getPageBlocks, ctaProps } from "@/lib/content/read";

export async function generateMetadata() {
  const blocks = await getPageBlocks("trustees");
  return {
    title: "Trustees",
    description: blocks.hero.description,
  };
}

// Trustees are managed from the admin panel. The page is cached and the
// cache is invalidated on save (lib/content/revalidate.js), so it no longer
// needs force-dynamic to stay current.
export default async function TrusteesPage() {
  const [trustees, blocks] = await Promise.all([
    getTrustees(),
    getPageBlocks("trustees"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={blocks.hero.eyebrow}
        title={blocks.hero.title}
        description={blocks.hero.description}
      />

      <section className="py-20 sm:py-24">
        <Container>
          {trustees.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {trustees.map((t, i) => (
                <Reveal key={t._id} delay={i * 0.06}>
                  <Link
                    href={`/about/trustees/${t.slug}`}
                    className="group block rounded-2xl border border-line bg-surface p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/40 hover:bg-paper hover:shadow-soft"
                  >
                    <span className="mx-auto flex size-20 items-center justify-center overflow-hidden rounded-full bg-paper text-ink-faint transition-transform duration-300 group-hover:scale-105">
                      {t.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element -- admin-entered arbitrary URL
                        <img
                          src={t.photoUrl}
                          alt={t.name}
                          className="size-20 object-cover"
                        />
                      ) : (
                        <Icon name="Users" className="size-8" />
                      )}
                    </span>
                    <p className="mt-4 font-medium text-ink">{t.name}</p>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-terracotta">
                      {t.designation}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ink-faint transition-colors group-hover:text-terracotta">
                      View profile
                      <Icon name="ArrowRight" className="size-3.5 -rotate-45" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal className="max-w-2xl text-sm text-ink-faint">
              {blocks.empty.body}{" "}
              <Link
                href="/contact"
                className="link-underline font-semibold text-terracotta"
              >
                Contact us
              </Link>
              .
            </Reveal>
          )}
        </Container>
      </section>

      <CtaBand {...ctaProps(blocks.cta)} />
    </>
  );
}
