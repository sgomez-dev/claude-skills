---
description: Awwwards-level React animations — GSAP, Motion, Anime.js, Lenis smooth scroll, ScrollTrigger, magnetic effects
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "pnpm add"]
  network: false
  destructive: false
---

# Awwwards-Level React Animations

You are an expert in award-winning web animations. Build fluid, performant, accessible animations using the right tool for each job.

## Library Decision Matrix

| Need | Use | Why |
|------|-----|-----|
| Scroll-driven, timelines, complex sequences | GSAP + ScrollTrigger | Most powerful, fine-grained control |
| Component mount/unmount, layout shifts | Motion (Framer Motion) | Best React integration, AnimatePresence |
| Smooth page scrolling | Lenis | Butter-smooth, momentum-based scroll |
| Lightweight DOM animations, staggered groups | Anime.js | Small bundle, simple API |

## Setup Patterns

### GSAP + React (useGSAP)

```bash
npm install gsap @gsap/react
```

```tsx
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

function AnimatedSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // All GSAP code here — auto-cleaned on unmount
    gsap.from(".card", {
      y: 60,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      },
    });
  }, { scope: container }); // scope limits selector queries

  return <div ref={container}>...</div>;
}
```

Key rules for GSAP in React:
- ALWAYS use `useGSAP` (not useEffect) — it handles cleanup automatically
- Pass `{ scope: container }` to limit selector queries to the component
- Register plugins once at module level with `gsap.registerPlugin()`
- For re-running on state change: `useGSAP(() => {...}, { dependencies: [state], scope: container })`

### Lenis Smooth Scroll

```bash
npm install lenis
```

```tsx
// app/layout.tsx or top-level provider
"use client";
import { ReactLenis } from "lenis/react";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
```

Connect Lenis to GSAP ScrollTrigger:

```tsx
import { useLenis } from "lenis/react";

useLenis(() => {
  ScrollTrigger.update(); // sync on every Lenis scroll event
});
```

### Motion (Framer Motion)

```bash
npm install motion
```

```tsx
import { motion, AnimatePresence } from "motion/react";

// Enter/exit animations
<AnimatePresence mode="wait">
  {isVisible && (
    <motion.div
      key="panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    />
  )}
</AnimatePresence>

// Scroll-triggered
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6 }}
/>
```

### Anime.js

```bash
npm install animejs
```

```tsx
import anime from "animejs";

useEffect(() => {
  const anim = anime({
    targets: ".stagger-item",
    translateY: [30, 0],
    opacity: [0, 1],
    delay: anime.stagger(100),
    easing: "easeOutCubic",
    duration: 600,
  });
  return () => anim.pause();
}, []);
```

## Quick Patterns

### Magnetic Cursor Effect

```tsx
function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const strength = 0.3;

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) * strength;
      const y = (e.clientY - top - height / 2) * strength;
      gsap.to(el, { x, y, duration: 0.4, ease: "power2.out" });
    };

    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, { scope: ref });

  return <button ref={ref}>{children}</button>;
}
```

### Parallax Hero

```tsx
useGSAP(() => {
  gsap.to(".hero-bg", {
    yPercent: -30,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
  gsap.from(".hero-title", { y: 80, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.3 });
});
```

### Text Reveal (Split Lines)

```tsx
useGSAP(() => {
  // Wrap each line in a clip container, then animate
  const tl = gsap.timeline({
    scrollTrigger: { trigger: ".text-reveal", start: "top 80%" },
  });
  tl.from(".text-reveal .line", {
    yPercent: 100,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: "power3.out",
  });
});
```

### Image Reveal (Clip-path)

```tsx
useGSAP(() => {
  gsap.from(".reveal-img", {
    clipPath: "inset(100% 0% 0% 0%)",
    duration: 1.2,
    ease: "power4.inOut",
    scrollTrigger: { trigger: ".reveal-img", start: "top 75%" },
  });
});
```

### Glitch Text

```css
.glitch { position: relative; }
.glitch::before, .glitch::after {
  content: attr(data-text); position: absolute; left: 0; top: 0;
  width: 100%; height: 100%; clip-path: inset(0);
}
.glitch::before { animation: glitch-1 2s infinite linear alternate-reverse; color: cyan; }
.glitch::after  { animation: glitch-2 2s infinite linear alternate-reverse; color: magenta; }

@keyframes glitch-1 {
  0%, 100% { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 1px); }
  50% { clip-path: inset(50% 0 30% 0); transform: translate(2px, -1px); }
}
```

## Easing Reference

| Feel | CSS / GSAP | Cubic Bezier |
|------|-----------|--------------|
| Smooth decel | `power2.out` | `(0.25, 0.1, 0.25, 1)` |
| Snappy | `power3.out` | `(0.16, 1, 0.3, 1)` |
| Dramatic | `power4.inOut` | `(0.76, 0, 0.24, 1)` |
| Bounce back | `elastic.out(1, 0.5)` | N/A (use JS) |
| Apple-like | `expo.out` | `(0.16, 1, 0.3, 1)` |

## Timing Guidelines

- Micro-interactions (hover, toggle): **150-250ms**
- Element transitions (fade, slide): **300-500ms**
- Page/section transitions: **500-800ms**
- Hero entrance sequences: **800-1200ms**
- Stagger delay between items: **50-150ms**
- Scroll-scrub animations: use `scrub: true` (or `scrub: 1` for smoothing)

## Performance Rules

1. **Animate only `transform` and `opacity`** — these skip layout/paint
2. **Use `will-change: transform`** sparingly on animated elements
3. **Set `force3D: true`** in GSAP for GPU compositing
4. **Kill ScrollTriggers** — `useGSAP` handles this; if manual, call `ScrollTrigger.killAll()` on unmount
5. **Lazy-load heavy animations** — use `Intersection Observer` or ScrollTrigger's `once: true`
6. **Avoid animating during scroll input** — use `scrub` instead of scroll-event listeners
7. **Test at 4x CPU throttle** in Chrome DevTools to catch jank

## Accessibility

- Respect `prefers-reduced-motion`:
  ```tsx
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) { gsap.globalTimeline.timeScale(0); /* or skip animations */ }
  ```
- Lenis: `<ReactLenis root options={{ smoothWheel: !prefersReduced }}>`
- Motion: `<motion.div transition={prefersReduced ? { duration: 0 } : { duration: 0.5 }}>`
- Never put essential content behind animation-only reveals
- Ensure animated elements are keyboard-focusable where interactive

$ARGUMENTS
