---
description: GSAP ScrollTrigger scroll-driven animations — parallax, pinning, horizontal scroll, scrub timelines, scroll velocity effects
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "pnpm add"]
  network: false
  destructive: false
---

# GSAP Scroll Experience

You are an expert in scroll-driven animations using GSAP ScrollTrigger. Build immersive, performant scroll experiences with parallax, pinning, horizontal scrolling, and scrub-driven timelines.

## 1. Setup

```bash
npm install gsap @gsap/react
```

```tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);
```

## 2. Parallax Layers

Multi-speed parallax with depth illusion.

```tsx
function ParallaxHero() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const layers = [
      { selector: ".parallax-bg", speed: -50 },
      { selector: ".parallax-mid", speed: -25 },
      { selector: ".parallax-fg", speed: 0 },
    ];

    layers.forEach(({ selector, speed }) => {
      gsap.to(selector, {
        yPercent: speed,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="relative h-[200vh]">
      <div className="parallax-bg absolute inset-0 bg-cover" />
      <div className="parallax-mid absolute inset-0" />
      <div className="parallax-fg absolute inset-0" />
    </div>
  );
}
```

## 3. Pin and Scrub Timeline

Pin a section and scrub through a multi-step animation timeline.

```tsx
function PinnedTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=3000",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    tl.from(".step-1", { opacity: 0, y: 60, duration: 1 })
      .from(".step-2", { opacity: 0, x: -60, duration: 1 })
      .from(".step-3", { opacity: 0, scale: 0.8, duration: 1 })
      .to(".step-1", { opacity: 0, duration: 0.5 }, "+=0.5");
  }, { scope: sectionRef });

  return <section ref={sectionRef} className="h-screen relative overflow-hidden">...</section>;
}
```

## 4. Horizontal Scroll Section

Scroll vertically to move content horizontally.

```tsx
function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current!;
    const scrollWidth = track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${scrollWidth}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div ref={trackRef} className="flex flex-nowrap">
        {panels.map((panel, i) => (
          <div key={i} className="min-w-screen h-screen flex-shrink-0">{panel}</div>
        ))}
      </div>
    </div>
  );
}
```

## 5. Scroll-Triggered Stagger Reveals

Batch-animate elements as they enter the viewport.

```tsx
function StaggerReveal() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    ScrollTrigger.batch(".reveal-item", {
      onEnter: (elements) => {
        gsap.from(elements, {
          y: 60,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
        });
      },
      start: "top 85%",
    });
  }, { scope: container });

  return <div ref={container}>...</div>;
}
```

## 6. Progress-Based Color/Theme Transitions

Change page background color as user scrolls through sections.

```tsx
function ColorTransitions() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".color-section");

    sections.forEach((section) => {
      const color = section.dataset.bgColor || "#ffffff";
      ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => gsap.to("body", { backgroundColor: color, duration: 0.6 }),
        onEnterBack: () => gsap.to("body", { backgroundColor: color, duration: 0.6 }),
      });
    });
  }, { scope: container });

  return (
    <div ref={container}>
      <section className="color-section" data-bg-color="#0f0f0f">...</section>
      <section className="color-section" data-bg-color="#1a1a2e">...</section>
      <section className="color-section" data-bg-color="#f5f5dc">...</section>
    </div>
  );
}
```

## 7. Scroll Velocity Text Marquee

Text speed reacts to how fast the user scrolls.

```tsx
function VelocityMarquee() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let currentVelocity = 0;
    const baseSpeed = 100; // px/s

    const marquee = gsap.to(".marquee-track", {
      xPercent: -50,
      repeat: -1,
      duration: 10,
      ease: "none",
    });

    ScrollTrigger.create({
      trigger: container.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        currentVelocity = self.getVelocity();
        const speedMultiplier = 1 + Math.abs(currentVelocity) / 1000;
        gsap.to(marquee, { timeScale: speedMultiplier, duration: 0.3 });
      },
    });
  }, { scope: container });

  return (
    <div ref={container} className="overflow-hidden whitespace-nowrap">
      <div className="marquee-track inline-flex">
        <span className="text-[10vw] font-bold px-8">SCROLL FASTER</span>
        <span className="text-[10vw] font-bold px-8">SCROLL FASTER</span>
      </div>
    </div>
  );
}
```

## 8. Snap Scrolling Between Sections

Full-page snap scrolling with animated transitions.

```tsx
function SnapSections() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".snap-section");

    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        snap: {
          snapTo: 1,
          duration: { min: 0.3, max: 0.6 },
          ease: "power2.inOut",
        },
      });

      gsap.from(section.querySelectorAll(".animate-in"), {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
        },
      });
    });
  }, { scope: container });

  return (
    <div ref={container}>
      {sections.map((_, i) => (
        <section key={i} className="snap-section h-screen">...</section>
      ))}
    </div>
  );
}
```

## 9. Scroll-Driven Image Sequence (Video-like)

Play through image frames based on scroll position.

```tsx
function ScrollImageSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const frameCount = 120;
    const images: HTMLImageElement[] = [];
    const tracker = { frame: 0 };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `/frames/frame-${String(i).padStart(4, "0")}.webp`;
      images.push(img);
    }

    gsap.to(tracker, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=4000",
        pin: true,
        scrub: 0.5,
      },
      onUpdate: () => {
        const ctx = canvasRef.current?.getContext("2d");
        const img = images[Math.round(tracker.frame)];
        if (ctx && img.complete) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          ctx.drawImage(img, 0, 0, ctx.canvas.width, ctx.canvas.height);
        }
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="h-screen">
      <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full object-cover" />
    </div>
  );
}
```

## 10. Lenis + ScrollTrigger Integration

Smooth scroll with Lenis synced to GSAP ScrollTrigger.

```tsx
import { ReactLenis, useLenis } from "lenis/react";

function SmoothScrollLayout({ children }: { children: React.ReactNode }) {
  useLenis(() => {
    ScrollTrigger.update();
  });

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
```

## Performance Tips

1. **Use `scrub: 1`** (not `scrub: true`) for smoothed scrub with 1-second catch-up
2. **Set `invalidateOnRefresh: true`** for layouts that change on resize
3. **Use `anticipatePin: 1`** to prevent pin jump on fast scroll
4. **Avoid pinning multiple elements simultaneously** -- use a single pinned container with internal animation
5. **Use `fastScrollEnd: true`** to prevent stuck ScrollTriggers on momentum scrolling
6. **Limit `ScrollTrigger.batch()`** to under 50 elements for best performance
7. **Test at 4x CPU throttle** in Chrome DevTools Performance panel

## Accessibility

Always respect `prefers-reduced-motion`:

```tsx
useGSAP(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    // Show all content immediately -- no scroll-driven motion
    gsap.set(".reveal-item", { opacity: 1, y: 0 });
    // Still allow subtle opacity fades (non-motion) as a gentler alternative
    ScrollTrigger.batch(".reveal-item", {
      onEnter: (elements) => {
        gsap.from(elements, { opacity: 0, duration: 0.4, stagger: 0.05 });
      },
      start: "top 90%",
    });
    return;
  }

  // Normal scroll animations here...
});
```

- Provide a "skip animation" or "jump to content" link for long pinned sequences
- Ensure all content is accessible without scroll animations (progressive enhancement)
- Horizontal scroll sections must have keyboard navigation support (arrow keys to move between panels)
- Never hide essential content behind scroll-only animations
- Use `aria-label` on pinned/horizontal sections to describe the interaction model
- For image sequences, provide a static fallback image or summary for screen readers
- Ensure scroll-triggered color changes maintain WCAG contrast ratios in all states

## Mobile / Responsive

- Use `ScrollTrigger.matchMedia()` to apply different animations at different breakpoints:
  ```tsx
  ScrollTrigger.matchMedia({
    "(min-width: 768px)": () => { /* desktop animations */ },
    "(max-width: 767px)": () => { /* simpler mobile animations */ },
  });
  ```
- Reduce parallax intensity on mobile (smaller `yPercent` values)
- Disable horizontal scroll sections on mobile -- stack vertically instead
- Use `touch-action: pan-y` on pinned containers for smooth mobile scrolling
- Test on real devices -- mobile Safari and Chrome handle scroll differently

## Design System Integration

- Use CSS custom properties for scroll-triggered color transitions: `gsap.to("body", { backgroundColor: "var(--color-surface)" })`
- Coordinate reveal animation timings with the project's motion design tokens
- Pull spacing values for parallax offsets from the design system's spacing scale
- Ensure color transitions between sections stay within the brand palette

$ARGUMENTS
