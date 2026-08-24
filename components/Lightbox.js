"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Icon from "./Icon";
import Reveal from "./Reveal";

export default function Lightbox({ images }) {
  const [index, setIndex] = useState(null);
  const open = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 [&>*]:mb-4">
        {images.map((img, i) => (
          <Reveal
            key={img.src}
            delay={(i % 6) * 0.05}
            className="break-inside-avoid overflow-hidden rounded-2xl border border-line"
          >
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="block w-full"
              aria-label={`Open image: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={img.tall ? 800 : 450}
                className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </button>
          </Reveal>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full bg-paper/10 text-paper hover:bg-paper/20"
            onClick={close}
            aria-label="Close"
          >
            <Icon name="X" className="size-5" />
          </button>
          <button
            className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/10 text-paper hover:bg-paper/20 sm:left-6"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
          >
            &larr;
          </button>
          <button
            className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-paper/10 text-paper hover:bg-paper/20 sm:right-6"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
          >
            &rarr;
          </button>
          <div
            className="relative max-h-[80vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index].src}
              alt={images[index].alt}
              width={1200}
              height={900}
              className="h-auto max-h-[80vh] w-full rounded-xl object-contain"
            />
            <p className="mt-3 text-center text-sm text-paper/80">
              {images[index].alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
