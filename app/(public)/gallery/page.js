import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Lightbox from "@/components/Lightbox";
import CtaBand from "@/components/CtaBand";
import {
  getGalleryCategories,
  getPageBlocks,
  ctaProps,
} from "@/lib/content/read";

export async function generateMetadata() {
  const blocks = await getPageBlocks("gallery");
  return {
    title: "Gallery",
    description: blocks.hero.description,
  };
}

export default async function GalleryPage() {
  const [categories, blocks] = await Promise.all([
    getGalleryCategories(),
    getPageBlocks("gallery"),
  ]);

  return (
    <>
      <PageHero
        eyebrow={blocks.hero.eyebrow}
        title={blocks.hero.title}
        description={blocks.hero.description}
      />
      <section className="space-y-16 py-20 sm:py-24">
        <Container className="space-y-16">
          {categories.map((cat) => (
            <div key={cat.title}>
              <SectionHeading title={cat.title} className="mb-6" />
              <Lightbox images={cat.images} />
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-ink-faint">
              Photos are being added to this gallery.
            </p>
          )}
        </Container>
      </section>
      <CtaBand {...ctaProps(blocks.cta)} />
    </>
  );
}
