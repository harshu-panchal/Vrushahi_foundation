"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import clsx from "clsx";

const INTERVAL = 5000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export default function HeroCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState(-1);
  const [direction, setDirection] = useState("right");
  const [paused, setPaused] = useState(false);

  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const handleIndexChange = (newIdx) => {
    if (newIdx === index || newIdx < 0 || newIdx >= images.length) return;
    const dir = newIdx > index ? "right" : "left";
    setDirection(dir);
    setExitingIndex(index);
    setIndex(newIdx);
  };

  useEffect(() => {
    if (paused || images.length < 2) return;

    const id = setInterval(() => {
      const nextIdx = (index + 1) % images.length;
      handleIndexChange(nextIdx);
    }, INTERVAL);
    
    return () => clearInterval(id);
  }, [paused, images.length, index]);

  useEffect(() => {
    if (exitingIndex === -1) return;
    
    const timer = setTimeout(() => {
      setExitingIndex(-1);
    }, 1200); // matches CSS transition duration
    
    return () => clearTimeout(timer);
  }, [index, exitingIndex]);

  return (
    <div
      className="absolute inset-0 book-container bg-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((img, i) => {
        const isActive = i === index;
        const isExiting = i === exitingIndex;

        let pageClass = "";
        let shadowClass = "";

        if (reduced) {
          pageClass = isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none";
        } else {
          if (isActive) {
            pageClass = "book-page-active z-20";
            if (exitingIndex !== -1) {
              shadowClass = direction === "right" ? "book-page-shadow-left" : "book-page-shadow-right";
            }
          } else if (isExiting) {
            pageClass = direction === "right" ? "book-page-exiting-right z-10" : "book-page-exiting-left z-10";
          } else {
            // Dormant page stacks
            pageClass = i < index ? "book-page-hidden-left z-0" : "book-page-hidden-right z-0";
          }
        }

        return (
          <div
            key={img.src}
            aria-hidden={!isActive}
            className={clsx(
              reduced ? "absolute inset-0 transition-opacity duration-300" : "book-page",
              pageClass,
              shadowClass
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={i === 0}
              sizes="(min-width: 1024px) 520px, 100vw"
              className={clsx(
                "object-cover ease-out",
                reduced
                  ? "duration-0"
                  : isActive
                    ? "scale-105 transition-transform duration-[6000ms]"
                    : "scale-100 transition-transform duration-0"
              )}
            />

            {/* Dark shadow overlay when this page goes under another page */}
            {!reduced && <div className="page-shadow-overlay" />}
            
            {/* White sweep / shine curl edge highlight to simulate the page folding bend */}
            {!reduced && <div className="page-curl-highlight" />}
          </div>
        );
      })}

      <div className="absolute inset-0 z-30 bg-gradient-to-t from-ink/25 via-transparent to-transparent pointer-events-none" />

      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-4 z-40 flex items-center justify-center gap-1.5">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => handleIndexChange(i)}
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              className={clsx(
                "h-1.5 rounded-full bg-paper transition-all duration-300",
                i === index ? "w-6 opacity-100" : "w-1.5 opacity-50 hover:opacity-80"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
