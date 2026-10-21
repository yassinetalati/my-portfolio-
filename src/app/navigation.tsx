"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { startSmoothScroll, stopSmoothScroll } from "./scroll-control";

const links = [
  { label: "Home", href: "#home", number: "01" },
  { label: "Work & Workflows", href: "#work", number: "02" },
  { label: "Finance × Tech", href: "#about", number: "03" },
  { label: "Contact", href: "#contact", number: "04" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);
  const navigated = useRef(false);

  useGSAP(() => {
    if (!panel.current) return;
    gsap.to(panel.current, {
      clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      duration: open ? 0.75 : 0.6,
      ease: open ? "power4.inOut" : "power3.inOut",
      pointerEvents: open ? "auto" : "none",
    });
    if (open) {
      gsap.fromTo(".menu-link-inner", { yPercent: 112, opacity: 0 }, {
        yPercent: 0, opacity: 1, duration: 0.65, stagger: 0.07, delay: 0.15, ease: "power3.out",
      });
    }
  }, { dependencies: [open], scope: panel });

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    stopSmoothScroll();
    firstLink.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggle.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      startSmoothScroll();
      if (!navigated.current && previousFocus?.isConnected) previousFocus.focus();
      navigated.current = false;
    };
  }, [open]);

  const close = (navigate = false) => {
    navigated.current = navigate;
    setOpen(false);
  };

  return <>
    <header className="site-header">
      <a className="wordmark" href="#home" onClick={() => close(true)} aria-label="Yassine Talati, home"><span>YASSINE.TALATI</span><span className="wordmark-badge">/ FT</span></a>
      <div className="availability"><span className="availability-dot" /> Available for Automation &amp; FinTech projects</div>
      <button ref={toggle} className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-menu" aria-label={open ? "Close menu" : "Open menu"}>
        <span>{open ? "Close" : "Menu"}</span><span className="menu-icon">{open ? <X size={18} strokeWidth={1.4} /> : <Menu size={18} strokeWidth={1.4} />}</span>
      </button>
    </header>
    <div className="menu-overlay" id="site-menu" ref={panel} aria-hidden={!open}>
      <div className="menu-content">
        <p className="menu-eyebrow">Navigation <span>(01 — 05)</span></p>
        <nav className="menu-links" aria-label="Main navigation">
          {links.map((link, index) => <a className="menu-link" key={link.number} href={link.href} onClick={() => close(true)} tabIndex={open ? 0 : -1} ref={index === 0 ? firstLink : undefined}>
            <span className="menu-number">{link.number}</span><span className="menu-label-clip"><span className="menu-link-inner">{link.label}</span></span><ArrowUpRight className="menu-arrow" size={27} strokeWidth={1.3} />
          </a>)}
        </nav>
        <div className="menu-bottom"><span>Based in Morocco</span><a href="#contact" onClick={() => close(true)}>LET&apos;S TALK <ArrowUpRight size={14} /></a><span>© 2026 Yassine Talati</span></div>
      </div>
    </div>
  </>;
}
