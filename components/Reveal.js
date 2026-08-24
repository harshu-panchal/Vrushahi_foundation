import clsx from "clsx";

export default function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as: Tag = "div",
}) {
  return (
    <Tag
      className={clsx("animate-reveal", className)}
      style={{ animationDelay: `${delay}s`, "--reveal-y": `${y}px` }}
    >
      {children}
    </Tag>
  );
}
