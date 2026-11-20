import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import { getLegalPages, getLegalBySlug } from "@/lib/content/read";

// See the note on the programme route: unknown slugs still render on demand,
// and a build without database access falls back to rendering on request.
export async function generateStaticParams() {
  try {
    const pages = await getLegalPages();
    return pages.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getLegalBySlug(slug);
  if (!page) return {};
  return { title: page.title };
}

export default async function LegalPage({ params }) {
  const { slug } = await params;
  const page = await getLegalBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <PageHero
        eyebrow={page.updated ? `Updated ${page.updated}` : undefined}
        title={page.title}
      />
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl space-y-10">
          {page.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-xl font-medium text-ink">
                {section.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                {section.text}
              </p>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
