import clsx from "clsx";
import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}) {
  return (
    <Reveal
      className={clsx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-terracotta">
          {eyebrow}
        </p>
      )}
      <h2 className="text-balance text-3xl font-medium text-ink sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-balance text-lg leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </Reveal>
  );
}
