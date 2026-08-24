import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import { legalPages, getLegalBySlug } from "@/data/legal";

export function generateStaticParams() {
  return legalPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getLegalBySlug(slug);
  if (!page) return {};
  return { title: page.title };
}

export default async function LegalPage({ params }) {
  const { slug } = await params;
  const page = getLegalBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <PageHero eyebrow={`Updated ${page.updated}`} title={page.title} />
      <section className="py-16 sm:py-20">
        <Container className="max-w-2xl space-y-10">
          {page.body.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-xl font-medium text-ink">
                {section.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{section.text}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
