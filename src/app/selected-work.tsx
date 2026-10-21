"use client";

import { useCallback, useEffect, useId, useRef, useState, type MouseEvent, type PointerEvent, type RefObject } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ExternalLink, Minus, Plus, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  number: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  status?: string;
  imageStyle?: React.CSSProperties;
};

const projects: Project[] = [
  {
    number: "01",
    title: "AI-Powered CSV Analytics Automation",
    image: "/images/projects/csv-analytics-workflow.png",
    imageWidth: 1113,
    imageHeight: 1033,
    alt: "Original n8n workflow for CSV analytics automation, showing the connected data validation, profiling, metrics, AI summary, and response nodes.",
    description: "Built an automated data analysis workflow using n8n that transforms uploaded CSV files into structured insights. The workflow validates files, extracts and profiles data, calculates key metrics, and prepares chart-ready datasets. It then uses AI through OpenRouter to generate a readable summary and returns the analysis to the frontend, with dedicated error responses for invalid uploads or datasets.",
    tags: ["n8n", "JavaScript", "Webhooks", "REST APIs", "OpenRouter AI"],
  },
  {
    number: "02",
    title: "Yacht Booking Request Automation",
    image: "/images/projects/yacht-booking-workflow.png",
    imageWidth: 1085,
    imageHeight: 818,
    alt: "Original n8n yacht charter booking request workflow with validation, Google Sheets logging, and Telegram notification branches.",
    description: "Built an automated booking request workflow for a Dubai Marina yacht charter website. The system captures form submissions through a webhook, validates required fields, and checks for spam using a honeypot field. Valid requests receive a booking ID, are logged in Google Sheets, and trigger a Telegram notification with customer and event details. The workflow returns a success response to the website or validation errors for incomplete submissions, streamlining inquiry management and reducing manual data entry.",
    tags: ["n8n", "JavaScript", "Webhooks", "Google Sheets", "Telegram Bot API"],
    imageStyle: { transform: "translateY(-18px) scale(0.88)" },
  },
  {
    number: "03",
    title: "AI Dental Receptionist & Appointment Booking",
    image: "/images/projects/dental-receptionist-workflow.png",
    imageWidth: 957,
    imageHeight: 623,
    alt: "Original n8n dental receptionist workflow connecting an AI conversational agent with Google Calendar and Google Sheets.",
    description: "Built an AI-powered virtual receptionist to help dental clinic website visitors book appointments through natural conversation. The agent collects patient details, maintains conversation context, and checks Google Calendar availability before requesting booking confirmation. Once confirmed, it creates the appointment and saves the patient’s information in Google Sheets. Designed around clinic working hours and 30-minute appointments, the workflow streamlines scheduling and reduces manual administrative work.",
    tags: ["n8n", "OpenRouter", "GPT-4o mini", "Google Calendar", "Google Sheets", "Webhooks"],
  },
  {
    number: "04",
    title: "Automotive Lead Capture & Quote Request Automation",
    image: "/images/projects/automotive-leads-workflow.png",
    imageWidth: 1332,
    imageHeight: 749,
    alt: "Original n8n automotive lead capture workflow showing form validation, optional photo handling, storage, and notification nodes.",
    description: "Built an automated lead management workflow for an automotive service website. The system captures quote requests, validates required customer and vehicle details, and generates a unique lead ID. It handles submissions with or without a photo, uploading attached images to Google Drive and logging request details in Google Sheets. Telegram notifications deliver customer information, service requirements, and photo links to help the team follow up, while the website receives a success response or validation error.",
    tags: ["n8n", "JavaScript", "Webhooks", "Google Drive", "Google Sheets", "Telegram Bot API"],
  },
  {
    number: "05",
    title: "WhatsApp AI Appointment Assistant",
    image: "/images/projects/whatsapp-assistant-workflow.png",
    imageWidth: 1254,
    imageHeight: 671,
    alt: "Original n8n WhatsApp AI appointment assistant prototype workflow with message processing, conversation memory, and calendar-flow branches.",
    description: "Built a conversational appointment assistant prototype using WhatsApp and an AI agent powered by OpenRouter. The workflow processes incoming text messages, maintains conversation history for each customer, and collects appointment details through guided conversations. Designed to integrate with Google Calendar, the prototype includes booking, rescheduling, and cancellation conversation flows that request customer confirmation before taking action. It accepts messages in Darija, Arabic, French, or English and is configured to respond in professional French.",
    tags: ["n8n", "WhatsApp Business Cloud API", "OpenRouter", "GPT-4o mini", "Google Calendar", "Conversation Memory"],
    status: "Prototype",
  },
];

type WorkflowDialogProps = {
  project: Project | null;
  opener: RefObject<HTMLElement | null>;
  onClose: () => void;
};

function WorkflowDialog({ project, opener, onClose }: WorkflowDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const imageId = useId();
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOrigin = useRef({ x: 0, y: 0, originX: 0, originY: 0 });

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (project && !element.open) element.showModal();
    if (!project && element.open) element.close();
  }, [project]);

  const closeDialog = () => {
    onClose();
    requestAnimationFrame(() => opener.current?.focus());
  };

  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [project]);

  const adjustZoom = (amount: number) => {
    setZoom((current) => Math.min(4, Math.max(1, Number((current + amount).toFixed(2)))));
    if (zoom + amount <= 1) setPosition({ x: 0, y: 0 });
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = { x: event.clientX, y: event.clientY, originX: position.x, originY: position.y };
    setDragging(true);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    setPosition({
      x: dragOrigin.current.originX + event.clientX - dragOrigin.current.x,
      y: dragOrigin.current.originY + event.clientY - dragOrigin.current.y,
    });
  };
  const onPointerUp = () => setDragging(false);

  return <dialog className="workflow-dialog" ref={dialog} aria-label={project ? `${project.title} workflow image` : undefined} onClose={closeDialog} onClick={(event) => {
    if (event.target === dialog.current) closeDialog();
  }}>
    {project && <>
      <div className="workflow-dialog-toolbar">
        <div className="workflow-dialog-name"><span>{project.number}</span><strong>{project.title}</strong></div>
        <div className="workflow-dialog-controls">
          <button type="button" onClick={() => adjustZoom(-0.25)} aria-label="Zoom out" title="Zoom out" disabled={zoom <= 1}><Minus size={16} /></button>
          <span className="workflow-zoom-readout">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => adjustZoom(0.25)} aria-label="Zoom in" title="Zoom in" disabled={zoom >= 4}><Plus size={16} /></button>
          <button type="button" onClick={() => { setZoom(1); setPosition({ x: 0, y: 0 }); }} aria-label="Reset zoom" title="Reset zoom" className="workflow-reset">Reset</button>
          <button type="button" onClick={onClose} aria-label="Close workflow viewer" title="Close" className="workflow-close"><X size={19} /></button>
        </div>
      </div>
      <div className={`workflow-dialog-canvas ${dragging ? "is-dragging" : ""}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onWheel={(event) => {
        if (!event.ctrlKey && !event.metaKey) return;
        event.preventDefault();
        adjustZoom(event.deltaY < 0 ? 0.15 : -0.15);
      }}>
        <Image id={imageId} className="workflow-dialog-image" src={project.image} alt={project.alt} width={project.imageWidth} height={project.imageHeight} unoptimized draggable={false} style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})` }} priority />
      </div>
      <p className="workflow-dialog-hint">{zoom > 1 ? "Drag to inspect · Ctrl/⌘ + scroll or use controls to zoom" : "Use the controls or Ctrl/⌘ + scroll to inspect node labels"}</p>
    </>}
  </dialog>;
}

export default function SelectedWork() {
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const dialogOpen = activeProject !== null;

  const onImageLoad = useCallback(() => ScrollTrigger.refresh(), []);

  useGSAP(() => {
    const sectionElement = section.current;
    const viewportElement = viewport.current;
    const trackElement = track.current;
    if (!sectionElement || !viewportElement || !trackElement) return;

    const media = gsap.matchMedia();
    media.add("(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => Math.max(0, trackElement.scrollWidth - viewportElement.clientWidth);
      const getPanelProgress = (value: number) => {
        const stride = distance() / (projects.length - 1);
        return Math.min(projects.length - 1, Math.max(0, Math.round(value / stride)));
      };
      const progressFill = sectionElement.querySelector<HTMLElement>(".automation-progress span");
      const currentPanel = sectionElement.querySelector<HTMLElement>(".automation-counter");
      const mobileProgress = sectionElement.querySelector<HTMLElement>(".automation-mobile-progress span");
      const panels = gsap.utils.toArray<HTMLElement>(".automation-panel", sectionElement);

      const horizontalTween = gsap.to(trackElement, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionElement,
          start: "top top+=82",
          end: () => `+=${distance() + window.innerHeight * 0.45}`,
          pin: sectionElement,
          pinSpacing: true,
          scrub: 0.65,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const value = self.progress * distance();
            const index = getPanelProgress(value);
            if (currentPanel) currentPanel.textContent = `${String(index + 1).padStart(2, "0")} / 05`;
            if (progressFill) {
              progressFill.style.transform = `scaleX(${Math.max(self.progress, 0.02)})`;
              progressFill.parentElement?.setAttribute("aria-valuenow", String(Math.round(self.progress * 100)));
            }
            if (mobileProgress) {
              mobileProgress.textContent = `${String(Math.round(self.progress * 100)).padStart(2, "0")}%`;
            }
          },
          onRefresh: (self) => {
            const index = getPanelProgress(self.progress * distance());
            if (currentPanel) currentPanel.textContent = `${String(index + 1).padStart(2, "0")} / 05`;
          },
        },
      });

      panels.forEach((panel) => {
        const stage = panel.querySelector<HTMLElement>(".automation-stage-inner");
        if (!stage) return;
        gsap.fromTo(stage, { y: 8 }, {
          y: -8,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: horizontalTween,
            start: "left right",
            end: "right left",
            scrub: true,
          },
        });
      });

      return () => {
        panels.forEach((panel) => {
          panel.removeAttribute("aria-hidden");
          panel.querySelectorAll<HTMLElement>("button").forEach((button) => { button.tabIndex = 0; });
        });
      };
    });

    media.add("(max-width: 899px), (max-height: 699px), (prefers-reduced-motion: reduce)", () => {
      gsap.set(trackElement, { clearProps: "transform" });
      gsap.set(".automation-panel", { autoAlpha: 1, clearProps: "transform" });
      if (counter.current) counter.current.textContent = "01 / 05";
      const progressFill = sectionElement.querySelector<HTMLElement>(".automation-progress span");
      if (progressFill) progressFill.style.transform = "scaleX(.02)";
      const mobileProgress = sectionElement.querySelector<HTMLElement>(".automation-mobile-progress span");
      if (mobileProgress) mobileProgress.textContent = "00%";
      sectionElement.querySelectorAll<HTMLElement>(".automation-panel").forEach((panel) => {
        panel.removeAttribute("aria-hidden");
        panel.querySelectorAll<HTMLElement>("button").forEach((button) => { button.tabIndex = 0; });
      });
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize, { passive: true });
    document.fonts?.ready.then(onResize);
    const images = Array.from(sectionElement.querySelectorAll("img"));
    images.forEach((image) => {
      if (image.complete) return;
      image.addEventListener("load", onImageLoad);
      image.addEventListener("error", onImageLoad);
    });

    return () => {
      window.removeEventListener("resize", onResize);
      images.forEach((image) => {
        image.removeEventListener("load", onImageLoad);
        image.removeEventListener("error", onImageLoad);
      });
      media.revert();
    };
  }, { scope: section });

  useEffect(() => {
    if (!dialogOpen) return;
    document.body.classList.add("workflow-viewer-open");
    return () => document.body.classList.remove("workflow-viewer-open");
  }, [dialogOpen]);

  const showProject = useCallback((index: number, trigger: HTMLElement) => {
    opener.current = trigger;
    setActiveProject(projects[Math.min(projects.length - 1, Math.max(0, index))]);
  }, []);

  const openFromEvent = (index: number, event: MouseEvent<HTMLElement>) => {
    showProject(index, event.currentTarget);
  };

  return <>
    <section className="work section-wrap automation-work" id="work" ref={section}>
      <div className="automation-heading">
        <div>
          <span className="section-kicker">02 / Selected Automations</span>
          <h2>Workflows in<br />the <span className="hero-italic">real world.</span></h2>
          <p className="automation-subtitle">Practical workflows connecting data, conversations, and everyday operations.</p>
        </div>
        <div className="automation-heading-meta"><span className="automation-counter" ref={counter}>01 / 05</span><div className="automation-progress" role="progressbar" aria-label="Showcase progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><span /></div></div>
      </div>
      <div className="automation-viewport" ref={viewport}>
        <div className="automation-track" ref={track}>
          {projects.map((project, index) => <article className="automation-panel" key={project.number} aria-label={`Project ${project.number}: ${project.title}`}>
            <div className="automation-stage-column">
              <button type="button" className="automation-image-button" onClick={(event) => openFromEvent(index, event)} aria-label={`View full-size workflow: ${project.title}`}>
                <div className="automation-stage"><div className="automation-stage-glow" /><div className="automation-stage-inner"><Image src={project.image} alt={project.alt} width={project.imageWidth} height={project.imageHeight} unoptimized priority={index < 2} onLoad={onImageLoad} style={project.imageStyle} /></div></div>
                <span className="automation-view-label">View workflow <ExternalLink size={13} /></span>
              </button>
            </div>
            <div className="automation-copy-column">
              <div className="automation-copy-top"><span className="automation-number">{project.number} <i>/ 05</i></span>{project.status && <span className="automation-status">{project.status}</span>}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="automation-tags" aria-label="Technology stack">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <button type="button" className="automation-open-link" onClick={(event) => openFromEvent(index, event)}>View workflow <ArrowRight size={15} /></button>
            </div>
          </article>)}
        </div>
      </div>
      <div className="automation-mobile-progress" aria-hidden="true">Scroll through the work <span data-progress>00%</span></div>
    </section>
    <WorkflowDialog project={activeProject} opener={opener} onClose={() => setActiveProject(null)} />
  </>;
}

