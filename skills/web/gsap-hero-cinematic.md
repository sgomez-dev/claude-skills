---
description: GSAP cinematic hero sections — layered reveals, 3D parallax, animated typography, video backgrounds, and immersive landing experiences
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "pnpm add"]
  network: false
  destructive: false
---

# GSAP Cinematic Hero Sections

You are an expert in building cinematic hero sections using GSAP. Create immersive above-the-fold experiences with layered reveals, 3D depth, animated typography, and coordinated entrance timelines.

## 1. Setup

```bash
npm install gsap @gsap/react
```

```tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);
```

## 2. Layered Reveal Timeline

Orchestrated entrance: overlay lifts, image scales in, text staggers up.

```tsx
function CinematicHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.set(".hero-overlay", { scaleY: 0 });
      gsap.from(".hero-title, .hero-subtitle, .hero-cta", { opacity: 0, duration: 0.3, stagger: 0.1 });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".hero-overlay", { scaleY: 0, duration: 0.8, transformOrigin: "top" })
      .from(".hero-image", { scale: 1.3, opacity: 0, duration: 1.2 }, "-=0.4")
      .from(".hero-title", { y: 80, opacity: 0, duration: 0.8 }, "-=0.6")
      .from(".hero-subtitle", { y: 40, opacity: 0, duration: 0.6 }, "-=0.4")
      .from(".hero-cta", { y: 30, opacity: 0, duration: 0.5 }, "-=0.3");
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      <div className="hero-overlay absolute inset-0 bg-black z-20" />
      <img className="hero-image absolute inset-0 w-full h-full object-cover" src="/hero.webp" alt="" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <h1 className="hero-title text-7xl font-bold">Headline</h1>
        <p className="hero-subtitle text-xl mt-4">Subheadline text</p>
        <button className="hero-cta mt-8 px-8 py-4 bg-white text-black rounded-full">Explore</button>
      </div>
    </section>
  );
}
```

## 3. 3D Parallax Depth Hero

Multiple layers with perspective-based parallax for depth illusion.

```tsx
function DepthHero() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const layers = gsap.utils.toArray<HTMLElement>(".depth-layer");

    layers.forEach((layer, i) => {
      const depth = (i + 1) * 0.2;
      gsap.to(layer, {
        yPercent: -30 * depth,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Initial entrance
    gsap.from(layers, {
      scale: 1.2,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: "power2.out",
    });
  }, { scope: container });

  return (
    <div ref={container} className="relative h-screen overflow-hidden" style={{ perspective: "1000px" }}>
      <div className="depth-layer absolute inset-0 bg-[url('/bg-far.webp')] bg-cover" />
      <div className="depth-layer absolute inset-0 bg-[url('/bg-mid.webp')] bg-cover" />
      <div className="depth-layer absolute inset-0 flex items-center justify-center">
        <h1 className="text-8xl font-bold text-white">DEPTH</h1>
      </div>
    </div>
  );
}
```

## 4. Split-Text Hero with Character Animation

Headline characters animate in with rotation and scale.

```tsx
function SplitTextHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const split = new SplitText(".hero-headline", { type: "chars, words" });

    if (prefersReduced) {
      gsap.from(".hero-headline, .hero-description, .hero-actions", { opacity: 0, duration: 0.3, stagger: 0.1 });
      return () => split.revert();
    }

    const tl = gsap.timeline({ delay: 0.3 });

    tl.from(split.chars, {
      opacity: 0,
      y: 100,
      rotateY: -60,
      stagger: 0.02,
      duration: 0.8,
      ease: "back.out(1.5)",
    })
    .from(".hero-description", { opacity: 0, y: 30, duration: 0.6 }, "-=0.3")
    .from(".hero-actions", { opacity: 0, y: 20, duration: 0.5 }, "-=0.2");

    return () => split.revert();
  }, { scope: heroRef });

  return (
    <div ref={heroRef} className="h-screen flex flex-col items-center justify-center">
      <h1 className="hero-headline text-8xl font-black tracking-tight">CINEMATIC</h1>
      <p className="hero-description text-lg text-neutral-400 mt-6 max-w-md text-center">
        Immersive experiences powered by GSAP.
      </p>
      <div className="hero-actions mt-8 flex gap-4">
        <button className="px-6 py-3 bg-white text-black rounded">Get Started</button>
        <button className="px-6 py-3 border border-white text-white rounded">Learn More</button>
      </div>
    </div>
  );
}
```

## 5. Video Background with Text Overlay Entrance

Video hero with coordinated text entrance after video starts.

```tsx
function VideoHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Pause video for reduced-motion users
    if (prefersReduced && videoRef.current) {
      videoRef.current.pause();
    }

    const tl = gsap.timeline({ paused: true });

    if (prefersReduced) {
      tl.to(".video-overlay", { opacity: 0, duration: 0.3 })
        .from(".video-title, .video-tagline", { opacity: 0, duration: 0.3, stagger: 0.1 });
      const video = videoRef.current!;
      video.addEventListener("canplaythrough", () => tl.play(), { once: true });
      tl.play(); // Play immediately for reduced-motion since it's just fades
      return;
    }

    tl.from(".video-overlay", { opacity: 1, duration: 1.5 })
      .from(".video-title", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.8")
      .from(".video-tagline", { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
      .from(".video-scroll-indicator", { opacity: 0, y: -10, duration: 0.5 }, "-=0.2");

    // Start animation when video can play
    const video = videoRef.current!;
    video.addEventListener("canplaythrough", () => tl.play(), { once: true });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay absolute inset-0 bg-black" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
        <h1 className="video-title text-7xl font-bold">Experience</h1>
        <p className="video-tagline text-xl mt-4 text-neutral-300">Something extraordinary</p>
        <div className="video-scroll-indicator absolute bottom-10 animate-bounce">Scroll</div>
      </div>
    </section>
  );
}
```

## 6. Clip-Path Reveal Hero

Hero content reveals through an expanding geometric clip-path.

```tsx
function ClipPathHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".clip-reveal",
      { clipPath: "circle(0% at 50% 50%)" },
      { clipPath: "circle(75% at 50% 50%)", duration: 1.5, ease: "power3.inOut" }
    )
    .from(".clip-content > *", {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.7,
      ease: "power3.out",
    }, "-=0.5");
  }, { scope: heroRef });

  return (
    <div ref={heroRef} className="h-screen bg-black">
      <div className="clip-reveal absolute inset-0 bg-indigo-900">
        <div className="clip-content flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-7xl font-bold">Revealed</h1>
          <p className="text-xl mt-4">Through geometry</p>
        </div>
      </div>
    </div>
  );
}
```

## 7. Counter Stats Hero

Hero with animated number counters and staggered stat cards.

```tsx
function StatsHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    tl.from(".stats-title", { y: 60, opacity: 0, duration: 0.8, ease: "power3.out" })
      .from(".stat-card", { y: 40, opacity: 0, stagger: 0.12, duration: 0.6, ease: "power3.out" }, "-=0.3");

    // Animate each counter
    gsap.utils.toArray<HTMLElement>(".stat-value").forEach((el) => {
      const target = parseInt(el.dataset.target || "0", 10);
      const obj = { value: 0 };
      gsap.to(obj, {
        value: target,
        duration: 2,
        delay: 0.8,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(obj.value).toLocaleString();
        },
      });
    });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="stats-title text-6xl font-bold mb-12">By the Numbers</h1>
      <div className="flex gap-12">
        <div className="stat-card text-center">
          <span className="stat-value text-5xl font-bold" data-target="5000">0</span>
          <p className="text-neutral-400 mt-2">Customers</p>
        </div>
        <div className="stat-card text-center">
          <span className="stat-value text-5xl font-bold" data-target="99">0</span>
          <p className="text-neutral-400 mt-2">Uptime %</p>
        </div>
        <div className="stat-card text-center">
          <span className="stat-value text-5xl font-bold" data-target="150">0</span>
          <p className="text-neutral-400 mt-2">Countries</p>
        </div>
      </div>
    </section>
  );
}
```

## 8. Particle Text Hero

Text formed from particles that converge on load.

```tsx
function ParticleTextHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw text to hidden canvas to get pixel positions
    ctx.font = "bold 120px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("HERO", canvas.width / 2, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const particles: { x: number; y: number; startX: number; startY: number }[] = [];

    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        if (imageData.data[(y * canvas.width + x) * 4 + 3] > 128) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            startX: Math.random() * canvas.width,
            startY: Math.random() * canvas.height,
          });
        }
      }
    }

    // Animate particles to their text positions
    const progress = { value: 0 };
    gsap.to(progress, {
      value: 1,
      duration: 2,
      ease: "power3.inOut",
      onUpdate: () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Render particles at interpolated positions
      },
    });
  }, { scope: canvasRef });

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
```

## 9. Scroll-Away Hero

Hero content fades and scales out as user scrolls down.

```tsx
function ScrollAwayHero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(".hero-content", {
      opacity: 0,
      scale: 0.9,
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "60% top",
        scrub: true,
      },
    });

    gsap.to(".hero-bg", {
      scale: 1.2,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative h-[150vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="hero-bg absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero.webp')" }} />
        <div className="hero-content relative z-10 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-7xl font-bold">Scroll Away</h1>
          <p className="text-xl mt-4">Content fades as you continue</p>
        </div>
      </div>
    </section>
  );
}
```

## Performance Tips

1. **Preload hero images** with `<link rel="preload">` to avoid flash of empty space
2. **Use `will-change: transform, opacity`** on hero layers only during animation
3. **Compress video backgrounds** aggressively -- hero videos should be under 5MB
4. **Use `poster` attribute** on video elements for instant visual before video loads
5. **Avoid animating `clip-path` on large areas** on mobile -- fallback to opacity
6. **Use `transform` and `opacity` only** for 60fps animations on the compositing layer
7. **Defer non-critical hero animations** with a small delay to prioritize page load

## Accessibility

```tsx
useGSAP(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    // Show hero content immediately
    gsap.set(".hero-title, .hero-subtitle, .hero-cta", { opacity: 1, y: 0 });
    gsap.set(".hero-overlay", { scaleY: 0 });
    return;
  }

  // Normal cinematic entrance...
});
```

- Ensure hero text has sufficient contrast against background images/videos (WCAG AA minimum)
- Provide `alt` text for decorative hero images or mark them `alt=""`
- Add `aria-label` to hero sections for screen reader context
- Video backgrounds should be `muted` and ideally have `aria-hidden="true"`
- Never auto-play video with sound
- Hero CTA buttons must be keyboard-focusable and visible without waiting for animations to finish
- Pause background videos for `prefers-reduced-motion` users -- show poster frame instead
- Use `aria-live="polite"` if hero content rotates dynamically (e.g., changing headlines)

## Design System Integration

- Pull colors from CSS custom properties: `gsap.to(el, { color: "var(--color-primary)" })`
- Use design system typography tokens with `clamp()` for responsive hero text
- Coordinate hero animation timing with your project's motion design tokens if defined
- Match CTA button styles to the design system's button component

## Mobile / Responsive

- Swap video backgrounds for static images on mobile to save bandwidth:
  ```tsx
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  ```
- Reduce parallax layer count on mobile (2 layers max instead of 4-5)
- Scale down font sizes with `clamp()`: `clamp(2.5rem, 8vw, 7rem)`
- Simplify entrance timelines on mobile -- fewer staggered elements
- Use `object-fit: cover` with `object-position` for responsive hero images
- Test hero height with mobile browser chrome (address bar) using `dvh` units

$ARGUMENTS
