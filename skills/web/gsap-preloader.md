---
description: GSAP preloaders — progress bars, animated logos, skeleton screens, number counters, and cinematic loading sequences
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "pnpm add"]
  network: false
  destructive: false
---

# GSAP Preloader

You are an expert in building animated preloaders and loading sequences using GSAP. Create polished loading experiences with progress indicators, animated logos, cinematic reveals, and smooth transitions from loading to content.

## 1. Setup

```bash
npm install gsap @gsap/react
```

```tsx
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);
```

## 2. Percentage Counter Preloader

Animated counter that tracks real loading progress with a reveal transition.

```tsx
function CounterPreloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(() => {
    const obj = { value: 0 };

    gsap.to(obj, {
      value: 100,
      duration: 2.5,
      ease: "power2.inOut",
      onUpdate: () => {
        const val = Math.round(obj.value);
        setProgress(val);
        if (counterRef.current) counterRef.current.textContent = `${val}`;
      },
      onComplete: () => {
        // Exit animation
        const tl = gsap.timeline({ onComplete });
        tl.to(".preloader-content", { opacity: 0, y: -30, duration: 0.4 })
          .to(containerRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: "power4.inOut",
          });
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="preloader-content text-center">
        <span ref={counterRef} className="text-8xl font-bold text-white tabular-nums">0</span>
        <span className="text-8xl font-bold text-white">%</span>
      </div>
    </div>
  );
}
```

## 3. Progress Bar Preloader

Horizontal bar that fills with real or simulated progress.

```tsx
function BarPreloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.to(barRef.current, {
      scaleX: 1,
      duration: 2,
      ease: "power1.inOut",
      transformOrigin: "left center",
    })
    .to(".preloader-label", { opacity: 0, duration: 0.2 })
    .to(containerRef.current, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.6,
      ease: "power3.inOut",
      onComplete,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-neutral-950 flex flex-col items-center justify-center">
      <span className="preloader-label text-neutral-500 text-sm mb-4 uppercase tracking-widest">Loading</span>
      <div className="w-64 h-0.5 bg-neutral-800 rounded-full overflow-hidden">
        <div ref={barRef} className="h-full bg-white scale-x-0 origin-left" />
      </div>
    </div>
  );
}
```

## 4. Animated Logo Preloader

Logo draws in with a stroke animation, then fills.

```tsx
function LogoPreloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const paths = gsap.utils.toArray<SVGPathElement>(".logo-path");
    const tl = gsap.timeline({ onComplete: exitAnimation });

    // Set stroke-dasharray for draw effect
    paths.forEach((path) => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, fill: "transparent" });
    });

    // Draw stroke
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 1.5,
      stagger: 0.2,
      ease: "power2.inOut",
    })
    // Fill in
    .to(paths, {
      fill: "#ffffff",
      stroke: "transparent",
      duration: 0.5,
      stagger: 0.1,
    });

    function exitAnimation() {
      gsap.timeline({ onComplete })
        .to(".logo-container", { scale: 0.8, opacity: 0, duration: 0.4, ease: "power2.in" })
        .to(containerRef.current, { opacity: 0, duration: 0.3 });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="logo-container">
        <svg viewBox="0 0 200 60" className="w-48">
          <path className="logo-path" d="M10 50 L30 10 L50 50" stroke="#fff" strokeWidth="2" />
          {/* Additional paths */}
        </svg>
      </div>
    </div>
  );
}
```

## 5. Curtain Reveal Preloader

Multiple panels slide away to reveal content.

```tsx
function CurtainPreloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const panels = gsap.utils.toArray<HTMLElement>(".curtain-panel");
    const tl = gsap.timeline({ delay: 1.5 });

    tl.to(".preloader-text", { opacity: 0, y: -20, duration: 0.3 })
      .to(panels, {
        scaleY: 0,
        transformOrigin: "top center",
        stagger: 0.1,
        duration: 0.6,
        ease: "power4.inOut",
        onComplete,
      });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="curtain-panel flex-1 bg-neutral-900" />
      ))}
      <span className="preloader-text absolute inset-0 flex items-center justify-center text-white text-2xl font-light">
        Loading...
      </span>
    </div>
  );
}
```

## 6. Spinning Dots Loader

Orbital dots spinning with staggered scaling.

```tsx
function SpinnerLoader() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(".spinner-dot", {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: 1.5,
      repeat: -1,
      ease: "none",
    });

    gsap.to(".spinner-dot", {
      scale: 0.3,
      stagger: { each: 0.15, repeat: -1, yoyo: true },
      duration: 0.5,
      ease: "power2.inOut",
    });
  }, { scope: container });

  return (
    <div ref={container} className="relative w-16 h-16">
      {[...Array(8)].map((_, i) => {
        const angle = (360 / 8) * i;
        return (
          <div
            key={i}
            className="spinner-dot absolute w-2.5 h-2.5 bg-white rounded-full"
            style={{
              left: `${50 + 40 * Math.cos((angle * Math.PI) / 180)}%`,
              top: `${50 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
}
```

## 7. Skeleton Screen to Content Transition

Animated skeleton placeholders that morph into real content.

```tsx
function SkeletonTransition({ isLoaded, children }: { isLoaded: boolean; children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isLoaded) {
      // Pulsing skeleton
      gsap.to(".skeleton-block", {
        opacity: 0.4,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        stagger: 0.1,
        ease: "power1.inOut",
      });
    } else {
      // Transition to content
      gsap.to(".skeleton-block", {
        opacity: 0,
        scale: 0.98,
        duration: 0.3,
        stagger: 0.05,
      });
      gsap.from(".content-block", {
        opacity: 0,
        y: 10,
        stagger: 0.08,
        duration: 0.5,
        delay: 0.2,
        ease: "power3.out",
      });
    }
  }, { dependencies: [isLoaded], scope: containerRef });

  return (
    <div ref={containerRef} className="relative">
      {!isLoaded && (
        <div className="space-y-4">
          <div className="skeleton-block h-8 w-3/4 bg-neutral-200 rounded" />
          <div className="skeleton-block h-4 w-full bg-neutral-200 rounded" />
          <div className="skeleton-block h-4 w-5/6 bg-neutral-200 rounded" />
        </div>
      )}
      {isLoaded && <div className="content-block">{children}</div>}
    </div>
  );
}
```

## 8. Real Asset-Tracking Preloader

Track actual image/font loading and animate progress accordingly.

```tsx
function AssetPreloader({ assets, onComplete }: { assets: string[]; onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let loaded = 0;
    const total = assets.length;

    const updateProgress = () => {
      loaded++;
      const progress = loaded / total;

      gsap.to(barRef.current, {
        scaleX: progress,
        duration: 0.3,
        ease: "power2.out",
      });

      if (loaded === total) {
        gsap.to(containerRef.current, {
          opacity: 0,
          delay: 0.5,
          duration: 0.5,
          onComplete,
        });
      }
    };

    assets.forEach((src) => {
      const img = new Image();
      img.onload = updateProgress;
      img.onerror = updateProgress; // Count errors to avoid stuck loaders
      img.src = src;
    });

    // Safety timeout -- never leave users stuck on a preloader
    const timeout = setTimeout(() => {
      if (loaded < total) {
        gsap.to(containerRef.current, { opacity: 0, duration: 0.3, onComplete });
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="w-48 h-1 bg-neutral-800 rounded-full overflow-hidden">
        <div ref={barRef} className="h-full bg-white scale-x-0 origin-left" />
      </div>
    </div>
  );
}
```

## 9. Staggered Word Reveal Preloader

Words appear one by one as a loading message.

```tsx
function WordRevealLoader() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const words = gsap.utils.toArray<HTMLElement>(".loader-word");

    gsap.from(words, {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
      stagger: 0.3,
      duration: 0.6,
      ease: "power3.out",
      repeat: -1,
      repeatDelay: 1,
    });
  }, { scope: container });

  return (
    <div ref={container} className="flex gap-3 text-white text-3xl font-light">
      <span className="loader-word">Creating</span>
      <span className="loader-word">your</span>
      <span className="loader-word">experience</span>
    </div>
  );
}
```

## Performance Tips

1. **Start preloader animations immediately** -- avoid waiting for React hydration
2. **Preload critical assets during the preloader** so content is ready when it exits
3. **Keep the preloader DOM lightweight** -- avoid complex layouts that slow initial paint
4. **Use `will-change: transform`** on the preloader container for smooth exit
5. **Remove the preloader from DOM** after exit animation completes (not just `display: none`)
6. **Set a maximum preloader duration** (3-5 seconds) even if assets are not fully loaded
7. **Use `requestAnimationFrame`** for canvas-based loaders to sync with display refresh

## Accessibility

```tsx
useGSAP(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    // Still show the preloader while assets load, but use a simple fade exit
    // Do NOT skip the preloader entirely -- users still need to wait for assets
    gsap.set(".preloader-content", { opacity: 1 }); // Show static progress
    // On complete, simple fade out instead of animated exit
    const exit = () => {
      gsap.to(containerRef.current, { opacity: 0, duration: 0.2, onComplete });
    };
    return exit;
  }
});
```

> **Important:** Never skip the preloader entirely for reduced-motion users. Assets still need to load. Use a simple progress bar with a quick fade-out exit instead of cinematic exit animations.

- Mark preloader with `role="progressbar"` and `aria-valuemin={0}`, `aria-valuemax={100}`, and `aria-valuenow` for screen readers
- Use `role="status"` for indeterminate loaders (spinners, dots) that do not track specific progress
- Provide a text-based loading status (not just visual progress) -- include `aria-label="Loading"` or visible text
- Announce completion with `aria-live="assertive"` region
- Never trap focus inside the preloader -- there are no interactive elements to focus on
- Ensure preloader is not blocking access to skip-to-content links
- Always include a safety timeout (8-12 seconds) to dismiss the preloader if loading stalls

## Mobile / Responsive

- Keep preloader animations lightweight on mobile -- avoid complex SVG path animations
- Use `dvh` units for full-screen preloaders to account for mobile browser chrome
- Reduce animation complexity on low-end devices:
  ```tsx
  const isLowEnd = navigator.hardwareConcurrency <= 4;
  const preloaderType = isLowEnd ? "simple-bar" : "cinematic";
  ```
- Test preloader on slow 3G network conditions
- Ensure the preloader exit animation works smoothly on 60Hz and 120Hz displays
- Set a shorter maximum timeout on mobile (2-3 seconds) for perceived speed

## Design System Integration

- Use the design system's background and text color tokens for the preloader
- Match the progress bar color to the brand's primary color: `var(--color-primary)`
- Logo preloader should use the same SVG as the site's logo component
- Coordinate the preloader exit with the site's standard page entry animation pattern

$ARGUMENTS
