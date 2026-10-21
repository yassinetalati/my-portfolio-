# Project Rules

These rules are the source of truth for this portfolio. Follow them for all future project changes.

## Owner Identity

- Name: Yassine Talati.
- Display the name in the logo and any preloader exactly as `YASSINE.TALATI`.
- Role: Finance Student, Vibe Coder & AI Automation Specialist (n8n Workflows).
- Core positioning: Bridge corporate and quantitative finance with modern technology through n8n workflow automation, AI agents, and high-speed vibe coding.
- Location: Morocco.
- Keep portfolio copy, metadata, navigation, and contact details aligned with this identity. Do not invent personal contact details, social handles, or project history.

## Visual and Design System

- The page background is pure pitch black (`#000000`); use deep obsidian (`#08080A`) for cards.
- Use pure white (`#FFFFFF`) for headlines, muted zinc (`#A1A1AA`) for body text, and dark zinc (`#52525B`) for labels and indices.
- Soft electric pink / magenta (`#EC4899`) is reserved for separator dots (`•`), subtle glowing status dots, and micro-interactions. Do not use it as a broad background or dominant text color.
- Strictly remove neon lime green, including `#a3e635` and `#bef264`, from the entire project. Do not use lime for cursors, menus, buttons, text, or any other UI.
- Follow the restrained, typography-led creative portfolio direction inspired by pablomiguez.dev without copying its content or assets.
- `/images/portrait.jpg` is the hero centerpiece portrait only. Never use it in project cards or other sections. Preserve this image path when building the hero portrait.
- Maintain responsive layouts and readable contrast on desktop and mobile.

## Technology and Animation

- Use Next.js App Router, TypeScript, and Tailwind CSS.
- Use GSAP (`gsap`, `ScrollTrigger`, and `@gsap/react`) for animation and Lenis for smooth scrolling.
- Integrate Lenis with GSAP's ticker where appropriate; avoid competing native and scripted smooth-scroll behavior.
- Register GSAP plugins appropriately and scope animations to their components.
- Clean up GSAP contexts, ticker callbacks, event listeners, and Lenis instances when components unmount. Animations must remain smooth and stable on desktop and mobile.
- Respect reduced-motion preferences and avoid enabling desktop-only cursor effects on touch devices.
- Keep server-rendered UI in Server Components where possible; isolate browser APIs and interactive behavior in Client Components.

## Change Discipline

- Read this file before making project changes and follow it as binding project guidance.
- Preserve unrelated existing user changes. Keep edits focused on the requested work.
- Do not introduce placeholder identity details where the owner information above applies.
