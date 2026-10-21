"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const items = ["Interactive", "Vibe Coder", "n8n Workflows", "Finance × Tech", "AI Automation"];

export default function HeroMarquee() {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const element = track.current;
    if (!element) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const tween = gsap.to(element, {
      xPercent: -50,
      duration: 24,
      ease: "none",
      repeat: -1,
    });
    return () => tween.kill();
  }, { scope: track });

  const renderItems = (copy: string) => items.map((item, index) => <span className="marquee-item" key={`${copy}-${item}`}>
    {item}<span className="marquee-separator" aria-hidden="true">•</span>
  </span>);

  return <div className="hero-marquee" aria-label="Interactive, Vibe Coder, n8n Workflows, Finance and Tech, AI Automation">
    <div className="hero-marquee-track" ref={track} aria-hidden="true">
      <div className="hero-marquee-group">{renderItems("first")}</div>
      <div className="hero-marquee-group">{renderItems("second")}</div>
    </div>
  </div>;
}
