import clsx from "clsx";

export default function Container({ children, className, as: Tag = "div" }) {
  return (
    <Tag className={clsx("mx-auto w-full max-w-6xl px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}
