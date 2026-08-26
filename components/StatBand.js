import Reveal from "./Reveal";
import Container from "./Container";
import CountUp from "./CountUp";
import Icon from "./Icon";

export default function StatBand({ stats }) {
  return (
    <section className="relative overflow-hidden bg-forest text-paper">
      <div className="bg-mesh-dark absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="animate-blob absolute -left-24 top-1/2 size-72 -translate-y-1/2 bg-marigold/10 blur-3xl"
      />
      <Container className="relative grid grid-cols-2 gap-10 py-16 sm:grid-cols-4 sm:py-20">
        {stats.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 0.08}
            className="group relative text-center sm:border-l sm:border-paper/10 sm:pl-8 sm:text-left first:sm:border-l-0 first:sm:pl-0"
          >
            <div
              className="shimmer-sweep -m-2 rounded-xl p-2"
              style={{ "--shimmer-delay": `${i * 0.7}s` }}
            >
              {stat.icon && (
                <span className="mb-3 hidden size-10 items-center justify-center rounded-full bg-paper/10 text-marigold-light transition-transform duration-300 group-hover:scale-110 sm:inline-flex">
                  <Icon name={stat.icon} className="size-5" />
                </span>
              )}
              <p className="shimmer-text font-display text-4xl font-medium tabular-nums sm:text-5xl">
                <CountUp value={stat.value} />
              </p>
              <p className="mt-2 text-sm leading-snug text-forest-light/80">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}
