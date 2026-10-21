import type Lenis from "lenis";

let activeLenis: Lenis | null = null;

export function setActiveLenis(lenis: Lenis | null) {
  activeLenis = lenis;
}

export function stopSmoothScroll() {
  activeLenis?.stop();
}

export function startSmoothScroll() {
  activeLenis?.start();
}

/** Scroll a stuck card into view so focused controls are never hidden under
 *  the next card. Uses the active Lenis instance when available. */
export function scrollToPosition(top: number) {
  if (activeLenis) {
    activeLenis.scrollTo(top, { duration: 0.6 });
    return;
  }
  window.scrollTo({ top, behavior: "auto" });
}
