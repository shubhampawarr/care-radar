"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * A gentle entrance, once, on scroll into view.
 *
 * The whole animation budget for E1–E3 is this component. E4 is the page's
 * cinematic moment and it has to arrive against something calm, so these three
 * sections get a short fade and a few pixels of travel and nothing else.
 *
 * PROGRESSIVE ENHANCEMENT, NOT ANIMATION-BY-DEFAULT
 * The settled state — visible, untransformed, no transition — is the default,
 * and it is what the server renders. Animation is opted into imperatively after
 * mount, so SSR, a failed or blocked bundle, and reduced motion all get legible
 * content for free.
 *
 * This was originally a framer-motion `whileInView`, which was the obvious
 * choice because the codebase already uses it elsewhere. It was wrong here: the
 * motion component serialises its `initial` state into the markup, so the page
 * shipped with `opacity:0;transform:translateY(14px)` on all three sections and
 * a visitor without JavaScript got a blank page under a working header and
 * footer. PaperScene in this same codebase already documents the fix, and this
 * is that pattern — settled by default, hidden only once we know we can show it
 * again.
 *
 * `data-animate` is set in a layout effect rather than a normal effect so the
 * hidden state lands before first paint. Set it after paint and the content is
 * briefly visible, then hides, then fades back in.
 */

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const REVEAL_CSS = `
[data-reveal][data-animate="true"]{
  opacity:0;
  transform:translateY(14px);
  transition:opacity 600ms cubic-bezier(.22,1,.36,1),
             transform 600ms cubic-bezier(.22,1,.36,1);
  transition-delay:var(--reveal-delay,0ms);
  will-change:opacity,transform;
}
[data-reveal][data-animate="true"][data-shown="true"]{
  opacity:1;
  transform:none;
  will-change:auto;
}
`;

const STYLE_ID = "employer-reveal-css";

function ensureStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = REVEAL_CSS;
  document.head.appendChild(el);
}

export type RevealProps = {
  children: ReactNode;
  /** Seconds. Used sparingly, to let a heading land before its list. */
  delay?: number;
  className?: string;
};

export default function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Reduced motion keeps the settled default. Not a shorter animation: none.
       Checked here rather than in CSS so the element is never hidden at all. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    ensureStyles();
    el.style.setProperty("--reveal-delay", `${Math.round(delay * 1000)}ms`);
    el.dataset.animate = "true";

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.dataset.shown = "true";
          io.disconnect();
        }
      },
      { rootMargin: "-6% 0px -4% 0px" },
    );
    io.observe(el);

    /* Safety net. If the observer never fires — an element that is taller than
       the shrunken root, a browser that throttles it in a background tab — the
       content must not stay hidden. */
    const failsafe = window.setTimeout(() => {
      el.dataset.shown = "true";
    }, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [delay]);

  return (
    <div ref={ref} data-reveal="" className={className}>
      {children}
    </div>
  );
}
