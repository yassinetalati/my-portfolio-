"use client";

import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const statement = "I bridge financial intelligence and modern software — using Vibe Coding, AI agents, and n8n workflows to turn manual operations into autonomous systems.";

type Pillar = {
  number: string;
  title: string;
  shortLabel: string;
  what: string;
  provide: string[];
  how: string;
  deliverable: string;
  tools: string[];
};

const pillars: Pillar[] = [
  {
    number: "01",
    title: "n8n & Workflow Automation",
    shortLabel: "Workflow",
    what: "Complex multi-node workflows that move data between services without anyone touching it in between.",
    provide: [
      "Multi-node workflow design with validation, branching, and dedicated error responses.",
      "Webhook-driven pipelines that capture form submissions and API events in real time.",
      "CRM syncing, automated reporting, and API orchestration across the tools a business already uses.",
    ],
    how: "I map the manual process first, then rebuild it as an n8n workflow: triggers, validation, branching, storage, and notifications — each step observable and adjustable.",
    deliverable: "A running automation with the repetitive work removed, plus the workflow itself so every step stays inspectable.",
    tools: ["n8n", "Webhooks", "REST APIs", "JavaScript"],
  },
  {
    number: "02",
    title: "Finance × Tech (FinTech)",
    shortLabel: "FinTech",
    what: "Financial analysis turned into automated, always-current systems instead of one-off spreadsheets.",
    provide: [
      "Financial modeling and scenario analysis built with reproducible data flows.",
      "Automated cash-flow and KPI dashboards that refresh themselves.",
      "Invoice OCR pipelines and market data trackers feeding structured datasets.",
    ],
    how: "I start from the finance side — the numbers, the model, the KPIs that matter — then wire the data collection and calculations so they update on their own.",
    deliverable: "Dashboards and models that stay current without manual re-entry, ready to read at any time.",
    tools: ["Corporate Finance", "Python", "Automated Dashboards", "Financial Modeling"],
  },
  {
    number: "03",
    title: "Vibe Coding & Web Apps",
    shortLabel: "Vibe Coding",
    what: "Rapidly shipping sleek, production-ready web applications instead of long build cycles.",
    provide: [
      "SaaS MVPs and interactive tools taken from idea to deployable product.",
      "Next.js and TypeScript front-ends with clean, considered design.",
      "AI-assisted development that compresses build time without losing quality.",
    ],
    how: "I build in tight loops with AI-assisted development: design the surface, generate and review the code, ship, refine — keeping the product usable at every step.",
    deliverable: "A deployed web application with the core flows working end to end, built to extend.",
    tools: ["Next.js", "TypeScript", "Supabase", "Vibe Coding"],
  },
  {
    number: "04",
    title: "AI Agents & LLM Integrations",
    shortLabel: "AI Agents",
    what: "LLMs connected to real business data and real conversations, not isolated chat windows.",
    provide: [
      "OpenAI and Claude API integrations grounded in internal business data.",
      "Telegram and WhatsApp bots that hold context across conversations.",
      "Notion and Google Sheets pipelines so agents read and write where the team already works.",
    ],
    how: "I define what the agent may know and do, connect it to the actual data sources, and keep every action confirmable before it executes.",
    deliverable: "An AI assistant that answers from your data and takes guided actions inside your existing tools.",
    tools: ["OpenAI / Claude API", "Telegram & WhatsApp bots", "Notion", "Google Sheets"],
  },
];

const tools = ["n8n", "Vibe Coding", "Corporate Finance", "Next.js", "TypeScript", "Python", "OpenAI / Claude API", "Webhooks & REST APIs", "Supabase", "Financial Modeling", "Automated Dashboards"];

/** Scroll-linked 3D depth stack. A single rAF-throttled scroll listener drives
 *  a CSS custom property per card (--depth): buried cards scale down and dim
 *  progressively; the active card stays at full scale and brightness.
 *  Reversible by construction.
 *
 *  Lock geometry: every card sits inside a uniform-height sticky SLOT. The
 *  slots share the same measured min-height (tallest card + 20px step
 *  compensation), and each slot gets a compensating transparent bottom pad so
 *  the sticky bottom of every slot lands at the same Y when locked. All cards
 *  therefore release at the exact same scroll pixel and the stack lifts away
 *  as one rigid block. A physical runway div after the last slot keeps the
 *  final card locked and readable before the section scrolls on. */
function useDepthStack(
  containerRef: RefObject<HTMLElement | null>,
  cardsRef: RefObject<HTMLDivElement | null>,
) {  useEffect(() => {
    const container = containerRef.current;
    const cardsElement = cardsRef.current;
    if (!container || !cardsElement) return;

    const slots = Array.from(cardsElement.children).filter(
      (child) => child instanceof HTMLElement && child.classList.contains("pillar-slot"),
    ) as HTMLElement[];
    const cards = slots
      .map((slot) => slot.querySelector<HTMLElement>(".pillar-depth-card"))
      .filter((card): card is HTMLElement => Boolean(card));
    if (!slots.length || cards.length !== slots.length) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stackMedia = window.matchMedia("(min-width: 900px) and (min-height: 700px)");
    const stackEnabled = () => !reducedMotion && stackMedia.matches;

    // Sticky top per slot: 100px / 120px / 140px / 160px (index * 20px step).
    const slotTop = (index: number) => 100 + index * 20;

    // Uniform slot geometry: measure the tallest card, then give every slot
    // the same min-height and a transparent bottom pad that compensates for
    // its sticky-top step. When locked, the bottom of each slot's sticky box
    // sits at the same Y coordinate, so all cards unstick simultaneously.
    const equalizeSlots = () => {
      if (!stackEnabled()) {
        slots.forEach((slot) => {
          slot.style.removeProperty("--slot-min-height");
          slot.style.removeProperty("--slot-pad");
        });
        return;
      }
      const heights = cards.map((card) => {
        const inner = card.querySelector<HTMLElement>(".pillar-depth-card-inner");
        return (inner ?? card).getBoundingClientRect().height;
      });
      const tallest = Math.max(...heights);
      slots.forEach((slot, index) => {
        // Slot height = tallest card + padding that fills the visual gap
        // left by the 20px steps below it (3 - index steps of 20px).
        const minHeight = tallest + (slots.length - 1 - index) * 20;
        slot.style.setProperty("--slot-min-height", `${Math.ceil(minHeight)}px`);
        // Transparent pad at the bottom of the slot (outside the card):
        // card sits at the slot top, pad fills the remaining slot height so
        // the slot's sticky bottom edge aligns across all slots.
        slot.style.setProperty("--slot-pad", `${(slots.length - 1 - index) * 20}px`);
      });
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      if (!stackEnabled()) return;
      const viewportMid = window.innerHeight * 0.5;
      let activeIndex = 0;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        // A card counts as "arrived" once its top passes the viewport middle.
        if (rect.top < viewportMid) activeIndex = index;
      });

      // Burial depth per card: 0 while front-most, interpolating to 1 as the
      // NEXT card scrolls up over THIS one (scale/dim apply to the buried
      // card, never to the incoming one). The active card always stays at
      // scale(1) / brightness(1).
      cards.forEach((card, index) => {
        const next = cards[index + 1];
        let depth = 0;
        if (next) {
          const nextTop = next.getBoundingClientRect().top;
          // The next card's sticky resting top: 100px + its index * 20px.
          const rest = slotTop(index + 1);
          const start = window.innerHeight;
          depth = Math.min(1, Math.max(0, (start - nextTop) / (start - rest)));
        }
        if (index < activeIndex) depth = 1;
        card.style.setProperty("--depth", depth.toFixed(3));
      });

      const rail = container.querySelector<HTMLElement>(".pillar-rail-list");
      const railProgress = activeIndex / Math.max(1, cards.length - 1);
      container.style.setProperty("--active-index", String(activeIndex));
      container.style.setProperty("--rail-progress", railProgress.toFixed(3));
      cardsElement.setAttribute("data-active", String(activeIndex));
      if (rail) rail.setAttribute("data-active", String(activeIndex));
      rail?.querySelectorAll<HTMLElement>("li").forEach((li, index) => {
        li.classList.toggle("is-active", index === activeIndex);
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    equalizeSlots();
    update();
    if (stackEnabled()) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // Re-measure the slot geometry after fonts settle and on resize.
    const remeasure = () => { equalizeSlots(); update(); };
    document.fonts?.ready.then(remeasure).catch(() => undefined);
    const resizeRemeasure = () => remeasure();
    window.addEventListener("resize", resizeRemeasure, { passive: true });

    const onMediaChange = () => {
      cards.forEach((card) => card.style.removeProperty("--depth"));
      slots.forEach((slot) => {
        slot.style.removeProperty("--slot-min-height");
        slot.style.removeProperty("--slot-pad");
      });
      container.style.removeProperty("--active-index");
      container.style.removeProperty("--rail-progress");
      cardsElement.removeAttribute("data-active");
      window.removeEventListener("scroll", onScroll);
      if (stackEnabled()) {
        equalizeSlots();
        window.addEventListener("scroll", onScroll, { passive: true });
        update();
      }
    };
    stackMedia.addEventListener("change", onMediaChange);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeRemeasure);
      stackMedia.removeEventListener("change", onMediaChange);
      cards.forEach((card) => card.style.removeProperty("--depth"));
      slots.forEach((slot) => {
        slot.style.removeProperty("--slot-min-height");
        slot.style.removeProperty("--slot-pad");
      });
      container.style.removeProperty("--active-index");
      container.style.removeProperty("--rail-progress");
      cardsElement.removeAttribute("data-active");
    };
  }, [containerRef, cardsRef]);
}

export default function AboutCapabilities() {
  const section = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const words = statement.split(" ");

  useDepthStack(stackRef, cardsRef);

  useGSAP(() => {
    const sectionElement = section.current;
    if (!sectionElement) return;

    // Word-by-word statement reveal (existing behavior).
    const wordElements = gsap.utils.toArray<HTMLElement>(".about-statement-word");
    gsap.fromTo(wordElements, { opacity: 0.16 }, {
      opacity: 1,
      stagger: 0.035,
      ease: "none",
      scrollTrigger: {
        trigger: sectionElement,
        start: "top 72%",
        end: "top 18%",
        scrub: true,
      },
    });
  }, { scope: section });

  return <section className="about-capabilities section-wrap" id="about" ref={section}>
    <div className="about-capabilities-heading">
      <span className="section-kicker">01 / Finance × Tech &amp; Automation</span>
      <span className="about-capabilities-index">Hybrid by design<span>•</span></span>
    </div>
    <div className="about-editorial-grid">
      <p className="about-statement" aria-label={statement}>{words.map((word, index) => <span className="about-statement-word" key={`${word}-${index}`}>{word}{index < words.length - 1 ? " " : ""}</span>)}</p>
      <div className="about-bio"><p>As a Finance student obsessed with technology, I don&apos;t just analyze numbers — I build the systems that process them. From multi-step n8n automations and AI agents to custom full-stack web apps built through Vibe Coding, I help businesses save hours and make smarter decisions.</p><a className="text-link" href="#contact">Build something useful <ArrowUpRight size={16} /></a></div>
    </div>
    <div className="pillar-stack-layout" ref={stackRef}>
      <aside className="pillar-rail" aria-label="Pillar navigation">
        <span className="section-kicker">Capabilities</span>
        <ol className="pillar-rail-list" data-active="0">
          {pillars.map((pillar, index) => <li key={pillar.number} className={index === 0 ? "is-active" : ""}>
            <span className="pillar-rail-number">{pillar.number}</span>
            <span className="pillar-rail-label">{pillar.shortLabel}</span>
          </li>)}
        </ol>
        <span className="pillar-rail-note">Scroll through the four pillars</span>
      </aside>
      <div className="pillar-stack" ref={cardsRef}>
        {pillars.map((pillar, index) => <div className="pillar-slot" style={{ "--slot-index": index } as CSSProperties} key={pillar.number}>
          <article className="pillar-depth-card" aria-label={`Capability ${pillar.number}: ${pillar.title}`}>
            <div className="pillar-depth-card-inner">
              <div className="pillar-sticky-card-top"><span className="automation-number">{pillar.number} <i>/ 04</i></span></div>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-summary">{pillar.what}</p>
              <div className="pillar-sticky-section">
                <h4>What I provide</h4>
                <ul className="pillar-points">
                  {pillar.provide.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
              <div className="pillar-sticky-section">
                <h4>How it works</h4>
                <p className="pillar-how">{pillar.how}</p>
              </div>
              <p className="pillar-deliverable"><strong>Deliverable.</strong> {pillar.deliverable}</p>
              <div className="pillar-tools" aria-label={`${pillar.title} tools`}>{pillar.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
            </div>
          </article>
        </div>)}
        <div className="pillar-runway" aria-hidden="true" />
      </div>
    </div>
    <div className="tools-row"><span className="section-kicker">Tools &amp; methods</span><div className="tools-list">{tools.map((tool) => <span className="tool-tag" key={tool}>{tool}</span>)}</div></div>
  </section>;
}
