import Link from "next/link";
import Image from "next/image";
import Icon from "./Icon";
import Reveal from "./Reveal";

export default function ProgramCard({ program, delay = 0 }) {
  return (
    <Reveal
      delay={delay}
      className="group relative overflow-hidden rounded-2xl border border-line bg-paper shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-terracotta/40 hover:shadow-lift"
    >
      <Link href={`/programs/${program.slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={program.image}
            alt={program.imageAlt}
            fill
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="p-6">
          <span className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-terracotta-light text-terracotta-dark transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
            <Icon name={program.icon} className="size-5" />
          </span>
          <h3 className="font-display text-xl font-medium text-ink transition-colors group-hover:text-terracotta-dark">
            {program.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{program.short}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta">
            Learn more
            <Icon
              name="ArrowRight"
              className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
