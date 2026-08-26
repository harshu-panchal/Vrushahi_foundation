import Image from "next/image";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import CtaBand from "@/components/CtaBand";

export const metadata = {
  title: "Events",
  description:
    "Dahi Handi, Children's Day, hygiene workshops and exhibitions — how Vrushahi Foundation shows up through the year.",
};

const events = [
  {
    icon: "Users",
    title: "Dahi Handi celebrations",
    body: "Every Janmashtami, around 25 volunteers take part in our Dahi Handi celebration — less a stunt than a lesson in teamwork, patience and hard-won confidence, values we try to carry into every other programme.",
  },
  {
    icon: "Heart",
    title: "Festivals with children",
    body: "Major festivals throughout the year are celebrated together with children from the communities we support — often the difference between a festival being an event they hear about and one they're part of.",
  },
  {
    icon: "CalendarDays",
    title: "Children's Day",
    body: "Every November 14th, we mark Bal Diwas with the children in our programmes — a day built around Nehru's belief that how a country treats its children says something about the country itself.",
  },
  {
    icon: "Stethoscope",
    title: "Health & hygiene workshops",
    body: "We run training sessions in schools, colleges and hospitals on health and hygiene — practical, repeatable sessions rather than one-off awareness talks.",
  },
  {
    icon: "Landmark",
    title: "Exhibitions & fairs",
    body: "We take part in exhibitions and trade fairs in Mumbai, Pune and around Sangli, using them to build the partnerships and visibility that keep our programmes funded.",
  },
];

export default function EventsPage() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Where the community and the mission actually meet."
        description="Our events aren't fundraising theatre — they're the same programmes, made visible."
      />

      <section className="py-16">
        <Container>
          <Reveal className="group relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line shadow-lift sm:aspect-[21/9]">
            <Image
              src="/images/events.jpg"
              alt="A crowded Ganesh festival celebration in Maharashtra"
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
          </Reveal>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24">
        <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event, i) => (
            <Reveal
              key={event.title}
              delay={i * 0.06}
              className="group rounded-2xl border border-line bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:border-terracotta/30 hover:shadow-soft"
            >
              <span className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-marigold-light text-terracotta-dark transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <Icon name={event.icon} className="size-5" />
              </span>
              <h3 className="font-display text-xl font-medium text-ink transition-colors group-hover:text-terracotta-dark">
                {event.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{event.body}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      <CtaBand
        title="Want to volunteer at our next event?"
        description="We put out a call for volunteers ahead of every major festival and workshop."
        primary={{ href: "/volunteer", label: "Volunteer With Us" }}
        secondary={{ href: "/contact", label: "Contact Us" }}
      />
    </>
  );
}
