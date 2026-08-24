import Container from "./Container";

export default function PageHero({ eyebrow, title, description }) {
  return (
    <section className="border-b border-line bg-surface">
      <Container className="py-16 sm:py-20">
        {eyebrow && (
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-terracotta">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-balance font-display text-4xl font-medium text-ink sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-balance text-lg leading-relaxed text-ink-soft">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
