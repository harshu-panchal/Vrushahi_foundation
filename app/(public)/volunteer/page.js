import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";
import { getContentItems, getPageBlocks, getSettings } from "@/lib/content/read";

export async function generateMetadata() {
  const blocks = await getPageBlocks("volunteer");
  return {
    title: "Volunteer",
    description: blocks.hero.description,
  };
}

export default async function VolunteerPage() {
  const [roles, blocks, settings] = await Promise.all([
    getContentItems("volunteerRole"),
    getPageBlocks("volunteer"),
    getSettings(),
  ]);

  return (
    <>
      <PageHero
        eyebrow={blocks.hero.eyebrow}
        title={blocks.hero.title}
        description={blocks.hero.description}
      />

      {blocks.heroImage.image && (
        <section className="py-16">
          <Container>
            <Reveal className="group relative aspect-[16/7] w-full overflow-hidden rounded-2xl border border-line shadow-lift">
              <Image
                src={blocks.heroImage.image}
                alt={blocks.heroImage.imageAlt || ""}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
            </Reveal>
          </Container>
        </section>
      )}

      <section className="pb-20 sm:pb-24">
        <Container>
          <SectionHeading
            eyebrow={blocks.roles.eyebrow}
            title={blocks.roles.title}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role, i) => (
              <Reveal
                key={role._id || role.title}
                delay={i * 0.06}
                className="group rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-forest/30 hover:shadow-soft"
              >
                <span className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-forest-light text-forest transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                  <Icon name={role.icon} className="size-5" />
                </span>
                <h3 className="font-display text-lg font-medium text-ink transition-colors group-hover:text-forest">
                  {role.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {role.body}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-20 sm:py-24">
        <Container className="max-w-xl">
          <SectionHeading
            eyebrow={blocks.signup.eyebrow}
            title={blocks.signup.title}
            description={blocks.signup.description}
          />
          <div className="mt-10 rounded-2xl border border-line bg-paper p-8">
            <ContactForm
              endpoint="/api/volunteer-signups"
              contactEmail={settings.contact?.email}
              subjectPrefix="Volunteer sign-up — vrushahifoundation.org"
              fields={["name", "email", "phone", "location", "interest", "message"]}
              submitLabel={blocks.signup.primaryLabel || "Send Sign-Up"}
            />
          </div>
        </Container>
      </section>
    </>
  );
}
