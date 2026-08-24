import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Volunteer",
  description: "Volunteer roles at Vrushahi Foundation, tied to our real programmes in Sangli district.",
};

const roles = [
  {
    icon: "BookOpen",
    title: "Teaching support at our Balwadi",
    body: "Help our two part-time teachers with basic English, reading and activity sessions for pre-schoolers in Sangli's slum settlements.",
  },
  {
    icon: "Stethoscope",
    title: "Health & hygiene workshops",
    body: "Assist in running our hygiene and health-awareness sessions in schools, colleges and hospitals around Sangli.",
  },
  {
    icon: "Scissors",
    title: "Vocational training mentors",
    body: "Share tailoring, beautician or leatherwork skills with women in our Self-Help Groups, or simply help run a session.",
  },
  {
    icon: "CalendarDays",
    title: "Event volunteers",
    body: "Join our Dahi Handi celebration, Children's Day festivities, or one of our exhibition stalls in Mumbai, Pune or Sangli.",
  },
  {
    icon: "HandHeart",
    title: "Companionship visits",
    body: "Spend time with the senior citizens we support — conversation and company matter as much as the material support does.",
  },
  {
    icon: "Landmark",
    title: "Corporate & CSR partners",
    body: "Organisations looking to contribute funding, materials or employee volunteering hours at scale — we'll work out a programme that fits.",
  },
];

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        eyebrow="Volunteer"
        title="Roles tied to real programmes, not generic 'help out' shifts."
        description="Every volunteer role below maps to something we're already running — you're joining existing work, not inventing a task for yourself."
      />

      <section className="py-16">
        <Container>
          <Reveal className="relative aspect-[16/7] w-full overflow-hidden rounded-2xl border border-line shadow-lift">
            <Image
              src="/images/volunteer-hero.jpg"
              alt="A group of volunteers stacking their hands together in a show of teamwork"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </Reveal>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container>
          <SectionHeading eyebrow="Where you fit in" title="Six ways to get involved." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((role, i) => (
              <Reveal
                key={role.title}
                delay={i * 0.06}
                className="rounded-2xl border border-line bg-paper p-6"
              >
                <span className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-forest-light text-forest">
                  <Icon name={role.icon} className="size-5" />
                </span>
                <h3 className="font-display text-lg font-medium text-ink">
                  {role.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{role.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-surface py-20 sm:py-24">
        <Container className="max-w-xl">
          <SectionHeading
            eyebrow="Sign up"
            title="Tell us where you'd like to help."
            description="Share a little about yourself and we'll get back to you about current openings."
          />
          <div className="mt-10 rounded-2xl border border-line bg-paper p-8">
            <ContactForm
              endpoint="/api/volunteer-signups"
              subjectPrefix="Volunteer sign-up — vrushahifoundation.org"
              fields={["name", "email", "phone", "location", "interest", "message"]}
              submitLabel="Send Sign-Up"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
