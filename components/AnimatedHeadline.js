import React from "react";
import clsx from "clsx";

/**
 * Splits a headline into words and letters, each masked inside an overflow-hidden box
 * and animated up into place with a bouncy staggered delay.
 * Includes continuous flying float wave animations on the letters and a perpetual wobble on underlines.
 * Safe under SSR, fully accessible to screen readers using ARIA tags.
 */
export default function AnimatedHeadline({
  segments,
  className,
  as: Tag = "h1",
  baseDelay = 0,
  stagger = 0.025, // character-to-character stagger delay
}) {
  let globalCharIndex = 0;

  // Compute text for screen readers (aria-label)
  const ariaLabel = segments.map((s) => s.text).join(" ");

  const segmentSpans = segments.map((seg, segIdx) => {
    // Determine if this segment should have a hand-drawn underline
    const isUnderlined = seg.className?.includes("text-terracotta");
    const words = seg.text.split(" ");
    
    // Group words of this segment
    const wordSpans = words.map((word, wIdx) => {
      const chars = word.split("");
      const charElements = chars.map((char, cIdx) => {
        const delay = baseDelay + globalCharIndex * stagger;
        const charID = globalCharIndex;
        globalCharIndex++;

        return (
          <span
            key={`char-${cIdx}`}
            className="inline-block overflow-hidden pb-[0.12em] align-bottom [margin-bottom:-0.15em]"
          >
            {/* Intro rollup span */}
            <span
              className="animate-char-in inline-block origin-bottom-left"
              style={{ animationDelay: `${delay}s` }}
            >
              {/* Continuous wave bobbing span */}
              <span
                className="animate-char-float inline-block"
                style={{
                  // Dynamic phase delay so letters bob in a continuous ripple wave
                  animationDelay: `${-charID * 0.12}s`,
                }}
              >
                {char}
              </span>
            </span>
          </span>
        );
      });

      // Render each word in white-space nowrap and apply class names
      return (
        <span
          key={`word-${wIdx}`}
          className={clsx("inline-block whitespace-nowrap", seg.className)}
        >
          {charElements}
        </span>
      );
    });

    // Join the words with space fragments
    const segmentChildren = [];
    wordSpans.forEach((wordEl, index) => {
      segmentChildren.push(wordEl);
      if (index < wordSpans.length - 1) {
        segmentChildren.push(" ");
      }
    });

    // The underline animation begins after the last letter of the segment has settled
    const lastCharIdx = globalCharIndex - 1;
    const underlineDelay = baseDelay + lastCharIdx * stagger + 0.15;

    return (
      <span
        key={`seg-${segIdx}`}
        className={clsx(
          "inline-block",
          isUnderlined && "relative pb-[0.2em] mb-[-0.2em] z-10"
        )}
      >
        {segmentChildren}
        {isUnderlined && (
          <svg
            className="absolute -left-[2%] -bottom-[4px] w-[104%] h-[12px] pointer-events-none stroke-current animate-line-wobble"
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Fine-tuned hand-drawn chalk feel double paths */}
            <path
              d="M 2,6 Q 50,2 98,5"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset="100"
              className="animate-draw-underline"
              style={{ animationDelay: `${underlineDelay}s` }}
            />
            <path
              d="M 10,9 Q 50,6 88,8"
              fill="none"
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset="100"
              className="animate-draw-underline-2"
              style={{ animationDelay: `${underlineDelay + 0.18}s` }}
            />
          </svg>
        )}
      </span>
    );
  });

  // Prepare final segments array and join with spaces
  const finalContent = [];
  segmentSpans.forEach((segSpan, index) => {
    finalContent.push(segSpan);
    if (index < segmentSpans.length - 1) {
      finalContent.push(" ");
    }
  });

  return (
    <Tag className={className} aria-label={ariaLabel}>
      <span aria-hidden="true">{finalContent}</span>
    </Tag>
  );
}
