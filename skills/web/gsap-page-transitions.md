---
description: GSAP page transitions — route animations, shared element transitions, overlay wipes, and seamless navigation effects
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "pnpm add"]
  network: false
  destructive: false
---

# GSAP Page Transitions

You are an expert in page transition animations using GSAP. Build seamless, cinematic route transitions for React/Next.js applications with overlays, shared elements, and coordinated timelines.

## 1. Setup

```bash
npm install gsap @gsap/react
```

```tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(useGSAP, Flip);
```

## 2. Overlay Wipe Transition

Full-screen color overlay that wipes across during navigation.

```tsx
function OverlayTransition({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ onComplete });

    tl.set(overlayRef.current, { xPercent: -100 })
      .to(overlayRef.current, {
        xPercent: 0,
        duration: 0.5,
        ease: "power3.inOut",
      })
      .to(overlayRef.current, {
        xPercent: 100,
        duration: 0.5,
        ease: "power3.inOut",
        delay: 0.1,
      });
  }, { scope: overlayRef });

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black pointer-events-none"
      style={{ transform: "translateX(-100%)" }}
    />
  );
}
```

## 3. Curtain Reveal (Multi-Panel Wipe)

Multiple panels slide away to reveal the new page.

```tsx
function CurtainTransition() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const panels = gsap.utils.toArray<HTMLElement>(".curtain-panel");
    const tl = gsap.timeline();

    tl.to(panels, {
      scaleY: 0,
      transformOrigin: "top center",
      stagger: 0.08,
      duration: 0.6,
      ease: "power4.inOut",
    });
  }, { scope: container });

  return (
    <div ref={container} className="fixed inset-0 z-50 flex pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="curtain-panel flex-1 bg-neutral-900" />
      ))}
    </div>
  );
}
```

## 4. Clip-Path Circle Reveal

New page reveals through an expanding circle from a click point.

```tsx
function CircleReveal({ origin }: { origin: { x: number; y: number } }) {
  const revealRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const maxDim = Math.max(window.innerWidth, window.innerHeight) * 2;

    gsap.fromTo(
      revealRef.current,
      {
        clipPath: `circle(0% at ${origin.x}px ${origin.y}px)`,
      },
      {
        clipPath: `circle(${maxDim}px at ${origin.x}px ${origin.y}px)`,
        duration: 0.8,
        ease: "power2.out",
      }
    );
  }, { scope: revealRef });

  return (
    <div ref={revealRef} className="fixed inset-0 z-50 bg-white">
      {/* New page content */}
    </div>
  );
}
```

## 5. Shared Element Transition (FLIP)

Animate an element from its position on one page to its position on the next.

```tsx
function SharedElementTransition() {
  const container = useRef<HTMLDivElement>(null);

  const handleNavigate = (el: HTMLElement) => {
    // Capture current state
    const state = Flip.getState(el);

    // Move element to new container / change layout
    document.querySelector(".detail-target")?.appendChild(el);

    // Animate from old position to new
    Flip.from(state, {
      duration: 0.6,
      ease: "power3.inOut",
      absolute: true,
      scale: true,
    });
  };

  return <div ref={container}>...</div>;
}
```

## 6. Crossfade with Stagger

Old page fades out, new page elements stagger in.

```tsx
function useCrossfadeTransition() {
  const exitAnimation = (container: HTMLElement) => {
    return gsap.to(container.querySelectorAll(".animate-out"), {
      opacity: 0,
      y: -30,
      stagger: 0.05,
      duration: 0.4,
      ease: "power2.in",
    });
  };

  const enterAnimation = (container: HTMLElement) => {
    gsap.set(container.querySelectorAll(".animate-in"), { opacity: 0, y: 40 });
    return gsap.to(container.querySelectorAll(".animate-in"), {
      opacity: 1,
      y: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: "power3.out",
      delay: 0.1,
    });
  };

  return { exitAnimation, enterAnimation };
}
```

## 7. Slide Stack (iOS-Style)

Pages slide in from the right and stack, with the old page scaling slightly.

```tsx
function SlideStackTransition() {
  const pageRef = useRef<HTMLDivElement>(null);

  const enter = () => {
    const tl = gsap.timeline();
    tl.fromTo(
      pageRef.current,
      { xPercent: 100, boxShadow: "-20px 0 60px rgba(0,0,0,0.3)" },
      { xPercent: 0, duration: 0.5, ease: "power3.out" }
    );
    tl.to(".previous-page", { scale: 0.95, opacity: 0.5, duration: 0.5, ease: "power3.out" }, 0);
    return tl;
  };

  const exit = () => {
    const tl = gsap.timeline();
    tl.to(pageRef.current, { xPercent: 100, duration: 0.4, ease: "power3.in" });
    tl.to(".previous-page", { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }, 0);
    return tl;
  };

  return { pageRef, enter, exit };
}
```

## 8. Pixel/Grid Dissolve

Page dissolves into a grid of tiles that scatter away.

```tsx
function GridDissolve() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cols = 10;
    const rows = 8;
    const tiles = gsap.utils.toArray<HTMLElement>(".dissolve-tile");

    gsap.to(tiles, {
      opacity: 0,
      scale: 0,
      rotation: () => gsap.utils.random(-45, 45),
      stagger: {
        amount: 0.8,
        from: "center",
        grid: [rows, cols],
      },
      duration: 0.6,
      ease: "power2.in",
    });
  }, { scope: gridRef });

  return (
    <div ref={gridRef} className="fixed inset-0 z-50 grid grid-cols-10 grid-rows-8">
      {[...Array(80)].map((_, i) => (
        <div key={i} className="dissolve-tile bg-current" />
      ))}
    </div>
  );
}
```

## 9. Next.js App Router Integration

Coordinate GSAP transitions with Next.js routing.

```tsx
"use client";
import { usePathname } from "next/navigation";
import { useRef, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export function TransitionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Enter animation on route change
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        overlayRef.current,
        { scaleX: 1 },
        { scaleX: 0, duration: 0.5, ease: "power3.inOut", transformOrigin: "right" }
      );
    });

    return () => ctx.revert();
  }, { dependencies: [pathname] });

  return (
    <>
      <div ref={overlayRef} className="fixed inset-0 z-50 bg-black origin-right pointer-events-none" />
      <div ref={containerRef}>{children}</div>
    </>
  );
}
```

## 10. Transition Router Hook

Reusable hook for managing enter/exit transitions with any router.

```tsx
function usePageTransition(duration = 0.5) {
  const isAnimating = useRef(false);

  const animateOut = useCallback(async () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    return new Promise<void>((resolve) => {
      gsap.to("[data-transition-content]", {
        opacity: 0,
        y: -20,
        duration: duration * 0.6,
        ease: "power2.in",
        onComplete: resolve,
      });
    });
  }, [duration]);

  const animateIn = useCallback(() => {
    gsap.fromTo(
      "[data-transition-content]",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: duration,
        ease: "power3.out",
        onComplete: () => { isAnimating.current = false; },
      }
    );
  }, [duration]);

  return { animateOut, animateIn, isAnimating };
}
```

## Performance Tips

1. **Use `will-change: transform`** on overlay/transition elements only during animation, remove after
2. **Avoid layout thrashing** -- batch DOM reads (getState) before writes (appendChild)
3. **Use `force3D: true`** on sliding elements for GPU compositing
4. **Keep overlay elements in the DOM** (toggle visibility) rather than mounting/unmounting
5. **Preload the next page's critical assets** during the exit animation
6. **Use `pointer-events: none`** on transition overlays to prevent interaction during animation
7. **Limit transition duration to 300-600ms** -- longer feels sluggish for navigation

## Accessibility

```tsx
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReduced) {
  // Simple crossfade -- no motion, just opacity change
  gsap.to(oldPage, { opacity: 0, duration: 0.2 });
  gsap.fromTo(newPage, { opacity: 0 }, { opacity: 1, duration: 0.2, delay: 0.1 });
} else {
  // Full animated transition
}
```

- Always respect `prefers-reduced-motion` -- use a simple crossfade instead of spatial transitions
- Manage focus: move focus to the new page's main content or `<h1>` after transition
- Announce route changes to screen readers with a live region
- Ensure transition overlays never trap keyboard focus
- Keep `aria-hidden="true"` on decorative transition elements

## Mobile / Responsive

- Simplify transitions on mobile: use fades/slides instead of complex clip-path or grid dissolves
- Keep transitions under 400ms on mobile for perceived speed
- Test on lower-powered devices -- avoid multi-panel curtains on mobile
- Use `matchMedia` to choose transition complexity:
  ```tsx
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const transition = isMobile ? simpleFade : fullCurtainReveal;
  ```
- Disable shared element transitions on mobile if layout differs significantly between breakpoints

## Design System Integration

- Use the design system's overlay color token for transition overlays: `var(--color-overlay)`
- Match transition timing to the project's motion tokens if defined
- Pull transition overlay colors from CSS custom properties so they adapt to theme changes (light/dark mode)
- Coordinate the page enter animation pattern with other entry animations in the design system

$ARGUMENTS
