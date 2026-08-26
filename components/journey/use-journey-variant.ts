"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Which register a journey visual should render in.
 *
 * Lifted out of PaperScene without changes. Four components already called
 * it, and the employer page now makes a fifth; importing it from PaperScene
 * meant every one of them dragged in the whole paper-cut sheet builder for a
 * media query. PaperScene re-exports it, so nothing that used it before had
 * to change.
 */

const emptySubscribe = () => () => {};

function useMediaQuery(query: string, serverValue: boolean): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export type JourneyVariant = {
  isClient: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  /** Settle immediately, no crumple: mobile or reduced motion. */
  simplified: boolean;
};

/**
 * Scenes and PaperScene both call this; they resolve identically, so no
 * context plumbing is needed.
 */
export function useJourneyVariant(): JourneyVariant {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  // Server-renders as mobile + reduced: the settled, static, legible state.
  const isMobile = useMediaQuery("(max-width: 767px)", true);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  return {
    isClient,
    isMobile,
    reducedMotion,
    simplified: !isClient || isMobile || reducedMotion,
  };
}
