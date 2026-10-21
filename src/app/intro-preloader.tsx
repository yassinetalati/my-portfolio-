"use client";

import { useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const CORNERS = [
  { text: "Yassine", className: "intro-corner intro-corner-tl" },
  { text: "Talati", className: "intro-corner intro-corner-tr" },
  { text: "Portfolio", className: "intro-corner intro-corner-bl" },
  { text: "2026", className: "intro-corner intro-corner-br" },
];

/** Split a word into per-character spans for kinetic wipe/stagger effects. */
function Word({ word, className, ariaLabel }: { word: string; className: string; ariaLabel?: string }) {
  return <span className={`intro-word ${className}`} aria-label={ariaLabel ?? word} aria-hidden={ariaLabel ? undefined : true}>
    {word.split("").map((character, index) => <span className="intro-char" key={`${character}-${index}`}>{character}</span>)}
  </span>;
}

/**
 * Fullscreen kinetic-typography intro (Awwwards-style zoom-through reveal).
 *
 * Sequence (~3.0s total):
 *   0.0–0.7  "YASSINE.TALATI" slides in per-character; corner labels visible.
 *   0.7–1.3  "YASSINE." wipes out left→right, "TALATI" settles dead-center.
 *   1.3–1.8  "TALATI" wipes out, "DEV" snaps into the center.
 *   1.8–3.0  Beat hold (~0.3s), then "DEV" scales 1→55 (expo.inOut) as a
 *            zoom-through portal; during the last 35% the black overlay fades
 *            out while <main> and the navbar fade/scale into place.
 *
 * Scroll is locked during the intro and restored on completion. Skipped
 * entirely for prefers-reduced-motion. Replays on every load (dev testing);
 * the component unmounts when finished.
 */
export default function IntroPreloader() {
  const [done, setDone] = useState(false);

  useGSAP(() => {
    if (done) return;

    const skip = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (skip) {
      setDone(true);
      return;
    }
    // NOTE: no sessionStorage gate — the intro replays on every load so it can
    // be tested during development. Add `intro_seen` gating here when going live.

    const overlay = document.querySelector<HTMLElement>(".intro-preloader");
    const corners = gsap.utils.toArray<HTMLElement>(".intro-corner");
    const charsA = gsap.utils.toArray<HTMLElement>(".intro-word-a .intro-char");
    const charsB = gsap.utils.toArray<HTMLElement>(".intro-word-b .intro-char");
    const wordB = document.querySelector<HTMLElement>(".intro-word-b");
    const wordC = document.querySelector<HTMLElement>(".intro-word-c");
    const main = document.querySelector<HTMLElement>("main");
    const header = document.querySelector<HTMLElement>(".site-header");
    if (!overlay || !wordB || !wordC) return;

    // Lock scroll and hide the page until the zoom-through reveal.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const revealTargets = [main, header].filter(Boolean) as HTMLElement[];
    gsap.set(revealTargets, { autoAlpha: 0, scale: 1.04, transformOrigin: "50% 50%" });
    // Base clip state so the left→right wipes interpolate cleanly.
    gsap.set([...charsA, ...charsB], { clipPath: "inset(0% 0% 0% 0%)" });

    // "YASSINE." is the first 8 characters of "YASSINE.TALATI".
    const wipePrefixCount = 8;

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        gsap.set(revealTargets, { clearProps: "transform,opacity,visibility" });
        document.body.style.overflow = previousOverflow;
        setDone(true);
      },
    });

    timeline
      // Step A (0.0–0.7): full wordmark slides in per-character.
      .fromTo(charsA, { yPercent: 115, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.46, stagger: 0.022 }, 0.05)
      .fromTo(corners, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: 0.05 }, 0.1)
      // Step B (0.7–1.3): wipe "YASSINE." out left→right; "TALATI" settles centered.
      .to(charsA.slice(0, wipePrefixCount), { clipPath: "inset(0% 0% 0% 100%)", autoAlpha: 0, duration: 0.22, stagger: 0.045, ease: "power3.in" }, 0.72)
      .to(charsA.slice(wipePrefixCount), { autoAlpha: 0, duration: 0.12 }, 0.92)
      .fromTo(charsB, { yPercent: 70, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.26, stagger: 0.02 }, 1.02)
      // Step C (1.3–1.8): wipe "TALATI" out; "DEV" snaps into the center.
      .to(charsB, { clipPath: "inset(0% 0% 0% 100%)", autoAlpha: 0, duration: 0.18, stagger: 0.035, ease: "power3.in" }, 1.4)
      .set(wordB, { autoAlpha: 0 }, 1.8)
      .fromTo(wordC, { autoAlpha: 0, scale: 1.18 }, { autoAlpha: 1, scale: 1, duration: 0.24, ease: "power4.out" }, 1.5)
      // Beat hold until 2.1, corner labels fade as the zoom begins.
      .to(corners, { autoAlpha: 0, duration: 0.32 }, 2.1)
      // Zoom-through portal (2.1–3.0): DEV scales 1→55, flying through the letters.
      .to(wordC, { scale: 55, duration: 0.9, ease: "expo.inOut", transformOrigin: "50% 50%" }, 2.1)
      // Page reveal: main + navbar fade/scale into place.
      .to(revealTargets, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "power2.out" }, 2.45)
      // Last 35% of the zoom: the black overlay dissolves.
      .to(overlay, { autoAlpha: 0, duration: 0.315, ease: "power1.in" }, 2.685);

    return () => {
      timeline.kill();
      gsap.set(revealTargets, { clearProps: "transform,opacity,visibility" });
      document.body.style.overflow = previousOverflow;
    };
  }, { dependencies: [done] });

  if (done) return null;

  return <div className="intro-preloader" aria-hidden="true">
    {CORNERS.map((corner) => <span className={corner.className} key={corner.className}>{corner.text}</span>)}
    <div className="intro-stage">
      <Word word="YASSINE.TALATI" className="intro-word-a" />
      <Word word="TALATI" className="intro-word-b" />
      <span className="intro-word intro-word-c">DEV</span>
    </div>
  </div>;
}
