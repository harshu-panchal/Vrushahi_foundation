import Link from "next/link";
import Image from "next/image";
import Icon from "./Icon";
import Reveal from "./Reveal";

export default function ProgramCard({ program, delay = 0 }) {
  return (
    <Reveal delay={delay} className="group relative overflow-hidden rounded-2xl border border-line bg-paper shadow-soft transition-shadow hover:shadow-lift">
      <Link href={`/programs/${program.slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={program.image}
            alt={program.imageAlt}
            fill
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <span className="mb-4 inline-flex size-11 items-center justify-center rounded-full bg-terracotta-light text-terracotta-dark">
            <Icon name={program.icon} className="size-5" />
          </span>
          <h3 className="font-display text-xl font-medium text-ink">{program.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{program.short}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta">
            Learn more
            <Icon name="ArrowRight" className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
