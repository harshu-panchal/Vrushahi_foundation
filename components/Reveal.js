"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

/**
 * Scroll-triggered reveal. Renders fully visible by default (safe for
 * no-JS and for anything already in the viewport at mount) and only
 * animates content that is genuinely off-screen when it scrolls into view.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as: Tag = "div",
}) {
  const ref = useRef(null);
  const [state, setState] = useState("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (alreadyVisible) return;

    setState("pending");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={clsx(
        className,
        state !== "idle" && "transition-all duration-700 ease-out",
        state === "pending" && "opacity-0"
      )}
      style={
        state === "idle"
          ? undefined
          : {
              transform: state === "pending" ? `translateY(${y}px)` : undefined,
              transitionDelay: `${delay}s`,
            }
      }
    >
      {children}
    </Tag>
  );
}
