"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function HeroContent() {
  const hero = useRef<HTMLElement>(null);
  const portrait = useRef<HTMLImageElement>(null);
  const decor = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });
    hero.current?.classList.add("motion-ready");
    timeline
      .fromTo(".hero-line-inner", { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.12 }, 0)
      .fromTo(".hero-kicker, .hero-summary, .hero-links", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1 }, 0.42)
      .fromTo(portrait.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: "power2.out" }, 0.12);

    if (!window.matchMedia("(pointer: fine)").matches || !portrait.current || !decor.current) return () => timeline.kill();
    const portraitX = gsap.quickTo(portrait.current, "x", { duration: 1.4, ease: "power3.out" });
    const portraitY = gsap.quickTo(portrait.current, "y", { duration: 1.4, ease: "power3.out" });
    const decorX = gsap.quickTo(decor.current, "x", { duration: 1.1, ease: "power3.out" });
    const decorY = gsap.quickTo(decor.current, "y", { duration: 1.1, ease: "power3.out" });
    const onPointer = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      portraitX(x * 12);
      portraitY(y * 8);
      decorX(x * -20);
      decorY(y * -12);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      timeline.kill();
      window.removeEventListener("pointermove", onPointer);
      gsap.killTweensOf([portrait.current, decor.current]);
    };
  }, { scope: hero });

  return <section className="hero" id="home" ref={hero}>
    <div className="hero-topline"><span>Independent builder <i>•</i> Casablanca, Morocco</span><span>Finance / Automation / Software</span></div>
    <div className="hero-portrait-wrap" aria-hidden="true">
      <img className="hero-portrait" src="/images/portrait.jpg" alt="Portrait of Yassine Talati" ref={portrait} onError={(event) => event.currentTarget.classList.add("portrait-unavailable")} />
      <div className="portrait-fade-top" />
      <div className="portrait-fade-sides" />
      <div className="portrait-fade-bottom" />
    </div>
    <div className="hero-copy" ref={decor}>
      <p className="hero-kicker">Finance student <span>bridging</span> modern technology</p>
      <h1><span className="hero-line-clip"><span className="hero-line-inner">Financial thinking.</span></span><span className="hero-line-clip hero-line-offset"><span className="hero-line-inner">Automated doing.</span></span></h1>
      <p className="hero-summary">I design intelligent workflows, AI agents, and thoughtful digital tools that turn complex operations into clear, useful systems.</p>
      <div className="hero-links"><a className="hero-link-primary" href="#work">Explore selected work <ArrowDownRight size={15} /></a><a className="hero-link-secondary" href="#contact">Start a conversation <ArrowUpRight size={14} /></a></div>
    </div>
    <div className="hero-side-note hero-note-right">Workflow automation<br />n8n · AI · FinTech</div>
    <div className="hero-bottomline"><span>YASSINE.TALATI</span><span>Scroll to discover <ArrowDownRight size={14} /></span><span>01 — 04</span></div>
  </section>;
}
