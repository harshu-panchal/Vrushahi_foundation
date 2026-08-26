import clsx from "clsx";

export default function Marquee({ items, className, itemClassName, duration }) {
  return (
    <div className={clsx("group overflow-hidden", className)}>
      <div
        className="animate-marquee flex w-max items-center group-hover:[animation-play-state:paused]"
        style={duration ? { animationDuration: duration } : undefined}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <div key={i} className={clsx("shrink-0", itemClassName)}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
