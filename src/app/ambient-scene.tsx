"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AmbientScene() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const pointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const layers = Array.from(element.querySelectorAll<HTMLElement>("[data-ambient-layer]"));
    const observedScene = document.querySelector<HTMLElement>("#home") ?? element;
    const quickX = layers.map((layer, index) => gsap.quickTo(layer, "x", { duration: 1.2 + index * 0.25, ease: "power3.out" }));
    const quickY = layers.map((layer, index) => gsap.quickTo(layer, "y", { duration: 1.4 + index * 0.25, ease: "power3.out" }));
    let active = false;
    let visible = false;

    const updateMotion = () => {
      active = visible && document.visibilityState === "visible" && !reducedMotion.matches;
      element.classList.toggle("ambient-active", active);
    };
    const onPointer = (event: PointerEvent) => {
      if (!active || !pointer.matches) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      quickX.forEach((move, index) => move(x * (index === 0 ? -24 : index === 1 ? 15 : 9)));
      quickY.forEach((move, index) => move(y * (index === 0 ? -15 : index === 1 ? 11 : 7)));
    };
    const onVisibility = () => updateMotion();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateMotion();
    }, { threshold: 0 });

    observer.observe(observedScene);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", updateMotion);
    updateMotion();

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", updateMotion);
      layers.forEach((layer) => gsap.killTweensOf(layer));
    };
  }, []);

  return <div className="ambient-scene" ref={root} aria-hidden="true">
    <div className="ambient-field ambient-field-one" data-ambient-layer />
    <div className="ambient-field ambient-field-two" data-ambient-layer />
    <div className="ambient-field ambient-field-three" data-ambient-layer />
    <div className="ambient-grain" />
  </div>;
}
