import Reveal from "./Reveal";

export default function Timeline({ items }) {
  return (
    <Reveal as="div" className="relative">
      <div
        aria-hidden="true"
        className="animate-grow-y absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px origin-top bg-line"
      />
      <ol className="relative pl-8">
        {items.map((item, i) => (
          <Reveal as="li" key={item.year} delay={i * 0.1} className="group mb-10 last:mb-0">
            <span className="animate-pulse-ring absolute -left-[9px] mt-1.5 flex size-4 items-center justify-center rounded-full border-2 border-terracotta bg-paper transition-transform duration-300 group-hover:scale-110" />
            <p className="font-display text-xl font-medium text-terracotta">{item.year}</p>
            <h3 className="mt-1 text-lg font-medium text-ink">{item.title}</h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{item.body}</p>
          </Reveal>
        ))}
      </ol>
    </Reveal>
  );
}
