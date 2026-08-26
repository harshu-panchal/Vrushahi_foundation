import Link from "next/link";
import Container from "./Container";
import Reveal from "./Reveal";
import Icon from "./Icon";

export default function CtaBand({
  title = "Your support reaches people directly.",
  description = "No middle layers, no overhead theatre — donations and volunteer hours go straight into the programmes above.",
  primary = { href: "/donate", label: "Donate Now" },
  secondary = { href: "/volunteer", label: "Volunteer With Us" },
}) {
  return (
    <section className="relative overflow-hidden bg-terracotta">
      <div
        aria-hidden="true"
        className="animate-float pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-marigold/10 blur-3xl"
      />
      <Container className="relative py-16 text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-terracotta-light/95">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={primary.href}
              className="btn-shine group inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-terracotta-dark transition-all duration-300 hover:scale-[1.05] hover:shadow-lift"
            >
              {primary.label}
              <Icon
                name="ArrowUpRight"
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <Link
              href={secondary.href}
              className="inline-flex items-center gap-2 rounded-full border border-paper/70 px-6 py-3 text-sm font-semibold text-paper transition-all duration-300 hover:scale-[1.05] hover:border-paper hover:bg-paper/10"
            >
              {secondary.label}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
