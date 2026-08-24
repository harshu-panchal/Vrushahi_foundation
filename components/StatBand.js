import Reveal from "./Reveal";
import Container from "./Container";

export default function StatBand({ stats }) {
  return (
    <section className="bg-forest text-paper">
      <Container className="grid grid-cols-2 gap-8 py-14 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08} className="text-center sm:text-left">
            <p className="font-display text-4xl font-medium sm:text-5xl">{stat.value}</p>
            <p className="mt-2 text-sm leading-snug text-forest-light/80">{stat.label}</p>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
