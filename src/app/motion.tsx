"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import { setActiveLenis } from "./scroll-control";

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ autoRaf: false, smoothWheel: true, lerp: 0.11, duration: 1.05 });
    setActiveLenis(lenis);
    const update = (time: number) => lenis.raf(time * 1000);
    const updateScrollTrigger = () => ScrollTrigger.update();
    const refreshScrollTrigger = () => ScrollTrigger.refresh();
    lenis.on("scroll", updateScrollTrigger);
    window.addEventListener("load", refreshScrollTrigger, { once: true });
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", updateScrollTrigger);
      window.removeEventListener("load", refreshScrollTrigger);
      setActiveLenis(null);
      lenis.destroy();
    };
  }, []);
  return null;
}

export function Preloader() {
  const overlay = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!overlay.current || !name.current) return;
    if (window.sessionStorage.getItem("portfolio-intro-seen") === "true" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(overlay.current, { yPercent: -100, pointerEvents: "none" });
      return;
    }
    window.sessionStorage.setItem("portfolio-intro-seen", "true");
    const timeline = gsap.timeline({ defaults: { ease: "expo.inOut" } });
    timeline
      .fromTo(name.current, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: "power4.out" })
      .to(name.current, { yPercent: -110, duration: 0.65, delay: 0.35, ease: "power4.in" })
      .to(overlay.current, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.18");
    return () => timeline.kill();
  }, { scope: overlay });

  return <div className="preloader" ref={overlay} aria-hidden="true">
    <span className="preloader-corner preloader-top-left">Yassine</span>
    <span className="preloader-corner preloader-top-right">Talati</span>
    <span className="preloader-corner preloader-bottom-left">Finance <i>×</i> Tech</span>
    <span className="preloader-corner preloader-bottom-right">2026</span>
    <div className="preloader-name-clip"><h2 ref={name}>YASSINE.TALATI</h2></div>
  </div>;
}

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

    const moveX = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const moveY = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    const onMove = (event: MouseEvent) => {
      moveX(event.clientX);
      moveY(event.clientY);
    };
    const cards = document.querySelectorAll<HTMLElement>("[data-cursor-hover]");
    const onEnter = () => {
      cursor.classList.add("is-hovering-card");
      gsap.to(cursor, { width: 78, height: 38, borderRadius: 24, duration: 0.28, ease: "power3.out" });
    };
    const onLeave = () => {
      cursor.classList.remove("is-hovering-card");
      gsap.to(cursor, { width: 10, height: 10, borderRadius: 50, duration: 0.28, ease: "power3.out" });
    };

    window.addEventListener("mousemove", onMove);
    cards.forEach((card) => {
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
    });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
      gsap.killTweensOf(cursor);
    };
  }, { scope: cursorRef });

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><span /></div>;
}
