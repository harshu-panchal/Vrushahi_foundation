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
    icon: "Heart",
    title: "Entertainment & Festivals",
    body: "Entertainment is an activity which provides a diversion or permits people to amuse themselves in their leisure time, and may also provide fun, enjoyment and laughter. Vrushahi Foundation provides a platform to the underprivileged children during various events. Vrushahi Foundation celebrates all festivals with less fortunate children for bringing smile and motivates them in various extracurricular activities.",
  },
  {
    icon: "Users",
    title: "Dahi Handi celebrations",
    body: "Vrushahi Foundation celebrated Dahi Handi on the occasion of Janmashtami with 25 volunteers for creating awareness on team spirit skills, patience, hard work, confidence and honesty for success.",
  },
  {
    icon: "CalendarDays",
    title: "Children's Day (Bal Diwas)",
    body: "Children's day, in Hindi known as 'Bal Diwas', in India falls on November 14th every year and for good reason. In India it is celebrated on Pandit Nehru's birthday as a day of fun and frolic, a celebration of childhood, children and Nehruji's love for them. Chacha Nehru as the children fondly referred to him, was fond of both children and roses. They should be carefully and lovingly nurtured, as they are the future of the nation and the citizens of tomorrow. He felt that children are the real strength of a country and the very foundation of society. As a tribute to this great man and his love for the children, his birthday is celebrated all over India as 'Children's Day'. Vrushahi Foundation celebrates Children's Day with underprivileged children.",
  },
  {
    icon: "Stethoscope",
    title: "Training & Workshops",
    body: "Vrushahi Foundation provides training/workshops and campaigns to schools, colleges, hospitals for awareness on better living, health and hygiene and motivating them to live a healthy life.",
  },
  {
    icon: "Landmark",
    title: "Exhibitions & Trade Fairs",
    body: "Exhibitions and trade fairs are great places to network and forge good business relationships. Face-to-face contact with NGO's and Corporate make the wheels turn more smoothly. We can meet new prospects and find new sources of revenue. Vrushahi Foundation participates in various exhibitions held in Mumbai, Pune & Nearby Sangli location for promoting the activities conducted by the organization.",
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
