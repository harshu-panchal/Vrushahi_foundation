import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Lightbox from "@/components/Lightbox";
import CtaBand from "@/components/CtaBand";

export const metadata = {
  title: "Gallery",
  description: "Photos from Vrushahi Foundation's programmes and events across Sangli district.",
};

const categories = [
  {
    title: "Education",
    images: [
      { src: "/images/program-education.jpg", alt: "Students studying at desks in an Indian classroom", tall: true },
      { src: "/images/gallery-3.jpg", alt: "Close-up of hands working at a sewing machine" },
    ],
  },
  {
    title: "Women's empowerment",
    images: [
      { src: "/images/program-women.jpg", alt: "A group of women in colourful sarees at a self-help group meeting", tall: true },
    ],
  },
  {
    title: "Old age & orphan care",
    images: [
      { src: "/images/program-oldage.jpg", alt: "Close-up of wrinkled hands resting on a walking cane" },
      { src: "/images/program-orphanage.jpg", alt: "A group of smiling children with their arms around each other", tall: true },
    ],
  },
  {
    title: "Festivals & events",
    images: [
      { src: "/images/events.jpg", alt: "An aerial view of a crowded Ganesh festival celebration", tall: true },
    ],
  },
  {
    title: "Community & volunteers",
    images: [
      { src: "/images/hero-home.jpg", alt: "Children from a Sangli community smiling together", tall: true },
      { src: "/images/hands-together.jpg", alt: "Hands clasped together in a gesture of support" },
      { src: "/images/volunteer-hero.jpg", alt: "A group of volunteers stacking their hands together" },
    ],
  },
];

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A look at the work, category by category."
        description="Our photo library is growing alongside our programmes — this is a first look."
      />
      <section className="space-y-16 py-20 sm:py-24">
        <Container className="space-y-16">
          {categories.map((cat) => (
            <div key={cat.title}>
              <SectionHeading title={cat.title} className="mb-6" />
              <Lightbox images={cat.images} />
            </div>
          ))}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
