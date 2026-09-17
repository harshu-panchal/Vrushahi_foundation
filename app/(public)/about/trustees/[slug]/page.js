import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import CtaBand from "@/components/CtaBand";
import { dbConnect } from "@/lib/db/connect";
import Trustee from "@/lib/models/Trustee";

// Trustees are managed live from the admin panel — always render fresh
// rather than baking a stale profile into the static build.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await dbConnect();
  const trustee = await Trustee.findOne({ slug, isActive: true }).lean();
  if (!trustee) return {};
  return {
    title: trustee.name,
    description: `${trustee.name}, ${trustee.designation} of Vrushahi Foundation.`,
  };
}

export default async function TrusteeDetailPage({ params }) {
  const { slug } = await params;
  await dbConnect();
  const trustee = await Trustee.findOne({ slug, isActive: true }).lean();
  if (!trustee) notFound();

  const bioParagraphs = (trustee.bio || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-marigold/10 blur-3xl"
        />
        <Container className="relative animate-hero-in py-16 sm:py-20">
          <Link
            href="/about/trustees"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-terracotta"
          >
            <Icon name="ArrowRight" className="size-3.5 rotate-180" />
            Back to Trustees
          </Link>
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:text-left">
            <span className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-paper text-ink-faint">
              {trustee.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin-entered arbitrary URL
                <img
                  src={trustee.photoUrl}
                  alt={trustee.name}
                  className="size-28 object-cover"
                />
              ) : (
                <Icon name="Users" className="size-10" />
              )}
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-terracotta">
                {trustee.designation}
              </p>
              <h1 className="mt-2 text-balance font-display text-4xl font-medium text-ink sm:text-5xl">
                {trustee.name}
              </h1>
              {(trustee.email || trustee.phone) && (
                <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-ink-soft sm:justify-start">
                  {trustee.email && (
                    <a
                      href={`mailto:${trustee.email}`}
                      className="flex items-center gap-1.5 hover:text-terracotta"
                    >
                      <Icon name="Mail" className="size-4" />
                      {trustee.email}
                    </a>
                  )}
                  {trustee.phone && (
                    <a
                      href={`tel:${trustee.phone}`}
                      className="flex items-center gap-1.5 hover:text-terracotta"
                    >
                      <Icon name="Phone" className="size-4" />
                      {trustee.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          {bioParagraphs.length > 0 ? (
            <Reveal className="space-y-4">
              {bioParagraphs.map((para, i) => (
                <p key={i} className="leading-relaxed text-ink-soft">
                  {para}
                </p>
              ))}
            </Reveal>
          ) : (
            <p className="text-sm text-ink-faint">
              A detailed profile for {trustee.name} is coming soon.
            </p>
          )}
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
