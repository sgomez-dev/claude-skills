---
description: SVG morphing & shape animations — GSAP path drawing, shape morphing, animated icons, blob shapes, wave dividers, motion paths
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "pnpm add"]
  network: false
  destructive: false
---

# GSAP SVG Morphing & Shape Animations

You are an expert in SVG animation using GSAP. Build path drawing effects, shape morphing transitions, animated icons, organic blob shapes, wave dividers, motion paths, and chart animations — all with full React components using `useGSAP`.

## 1. Setup

```bash
npm install gsap @gsap/react
```

```tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"; // Club GSAP only

gsap.registerPlugin(useGSAP, ScrollTrigger, MotionPathPlugin);
// gsap.registerPlugin(MorphSVGPlugin); // uncomment if you have Club GSAP
```

> **DrawSVG alternative:** GSAP's DrawSVGPlugin is Club-only. Every pattern below uses the free `stroke-dasharray` / `stroke-dashoffset` technique instead. If you have Club GSAP, swap in `DrawSVGPlugin` for cleaner syntax.

## 2. SVG Path Drawing (Stroke-Dasharray Technique)

Draw an SVG path progressively using `stroke-dasharray` and `stroke-dashoffset`.

```tsx
function PathDraw({ d, duration = 2 }: { d: string; duration?: number }) {
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const path = pathRef.current!;
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    gsap.to(path, {
      strokeDashoffset: 0,
      duration,
      ease: "power2.inOut",
    });
  }, [d, duration]);

  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Animated path drawing">
      <title>Path drawing animation</title>
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
}
```

## 3. Logo Draw + Fill Sequence

SVG logo strokes draw first, then fill color fades in.

```tsx
function LogoDrawFill({ children }: { children: React.ReactNode }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const paths = gsap.utils.toArray<SVGPathElement>("path", svgRef.current);
      const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      // Prepare: measure each path, set dasharray/offset, hide fill
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: "transparent",
          stroke: "currentColor",
          strokeWidth: 1.5,
        });
      });

      // Phase 1: draw all strokes with stagger
      tl.to(paths, {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.15,
      });

      // Phase 2: fade in fill, fade out stroke
      tl.to(
        paths,
        {
          fill: "var(--logo-color, #0066ff)",
          stroke: "transparent",
          duration: 0.8,
          stagger: 0.08,
        },
        "-=0.4"
      );
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 120 40"
      role="img"
      aria-label="Animated logo"
    >
      <title>Logo animation — strokes draw then fill appears</title>
      {children}
    </svg>
  );
}
```

Usage:

```tsx
<LogoDrawFill>
  <path d="M10 30 L20 10 L30 30 Z" />
  <path d="M35 30 V10 H50 V20 H35" />
</LogoDrawFill>
```

## 4. Animated Hamburger to X Icon

SVG path morphing for a menu toggle — three lines morph into an X.

```tsx
function HamburgerToggle() {
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const openRef = useRef(false);

  useGSAP(
    () => {
      const [top, mid, bot] = gsap.utils.toArray<SVGLineElement>(
        "line",
        svgRef.current
      );

      const tl = gsap.timeline({ paused: true });

      // Top line rotates +45 degrees and moves to center
      tl.to(top, { attr: { y1: 12, y2: 12, x1: 4, x2: 20 }, duration: 0.2 })
        .to(top, { rotation: 45, transformOrigin: "center", duration: 0.25 }, 0.15);

      // Middle line fades out
      tl.to(mid, { opacity: 0, duration: 0.15 }, 0);

      // Bottom line rotates -45 degrees and moves to center
      tl.to(bot, { attr: { y1: 12, y2: 12, x1: 4, x2: 20 }, duration: 0.2 }, 0)
        .to(bot, { rotation: -45, transformOrigin: "center", duration: 0.25 }, 0.15);

      tlRef.current = tl;
    },
    { scope: svgRef }
  );

  const toggle = () => {
    if (!tlRef.current) return;
    openRef.current = !openRef.current;
    openRef.current ? tlRef.current.play() : tlRef.current.reverse();
  };

  return (
    <button onClick={toggle} aria-label="Toggle menu" aria-expanded={false}>
      <svg ref={svgRef} viewBox="0 0 24 24" width={32} height={32}>
        <line x1={4} y1={6} x2={20} y2={6} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        <line x1={4} y1={12} x2={20} y2={12} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        <line x1={4} y1={18} x2={20} y2={18} stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </button>
  );
}
```

## 5. Blob / Organic Shape Animation

Smooth blob animation cycling through multiple SVG path keyframes.

```tsx
const BLOB_PATHS = [
  "M45,-55C57.5,-45,66.5,-30,68,-14.5C69.5,1,63.5,17,54,29.5C44.5,42,31.5,51,16.5,55.5C1.5,60,-15.5,60,-30,53.5C-44.5,47,-56.5,34,-61,19C-65.5,4,-62.5,-13,-54,-27C-45.5,-41,-31.5,-52,-16.5,-57.5C-1.5,-63,14.5,-63,27,-59C39.5,-55,48,-47,45,-55Z",
  "M40,-50C52,-40,61,-25,63,-9C65,7,60,24,50,37C40,50,25,59,9,61C-7,63,-24,58,-38,48C-52,38,-63,23,-65,7C-67,-9,-60,-26,-48,-39C-36,-52,-19,-61,-2,-60C15,-59,28,-60,40,-50Z",
  "M42,-52C55,-42,65,-27,66,-11C67,5,59,22,48,36C37,50,23,60,7,62C-9,64,-27,58,-41,47C-55,36,-65,20,-66,3C-67,-14,-59,-32,-46,-44C-33,-56,-15,-62,1,-61C17,-60,29,-62,42,-52Z",
];

function BlobShape({
  color = "#6366f1",
  size = 300,
}: {
  color?: string;
  size?: number;
}) {
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // Static blob is fine for decorative elements

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    BLOB_PATHS.forEach((d, i) => {
      if (i === 0) return; // skip initial
      tl.to(pathRef.current, {
        attr: { d },
        duration: 3,
        ease: "sine.inOut",
      });
    });
  });

  return (
    <svg
      viewBox="-100 -100 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="Animated blob shape"
    >
      <desc>Organic shape that smoothly morphs between forms</desc>
      <path ref={pathRef} d={BLOB_PATHS[0]} fill={color} />
    </svg>
  );
}
```

## 6. Self-Drawing Illustration (Scroll-Triggered)

Complex SVG line art that draws itself as the user scrolls.

```tsx
function SelfDrawingIllustration({ svgContent }: { svgContent: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const paths = gsap.utils.toArray<SVGGeometryElement>(
        "path, line, polyline, polygon, circle, ellipse, rect",
        containerRef.current
      );

      // Prepare all stroke-based elements
      paths.forEach((el) => {
        const length = el.getTotalLength();
        gsap.set(el, {
          strokeDasharray: length,
          strokeDashoffset: length,
          fill: "transparent",
        });
      });

      // Animate on scroll
      gsap.to(paths, {
        strokeDashoffset: 0,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} role="img" aria-label="Self-drawing illustration">
      <svg viewBox="0 0 400 300" style={{ width: "100%", height: "auto" }}>
        <title>Illustration that draws itself on scroll</title>
        {svgContent}
      </svg>
    </div>
  );
}
```

## 7. Animated Chart Transitions

Bar chart data transitions using GSAP.

```tsx
interface ChartData {
  label: string;
  value: number;
}

function AnimatedBarChart({
  data,
  width = 400,
  height = 250,
}: {
  data: ChartData[];
  width?: number;
  height?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const barsRef = useRef<SVGRectElement[]>([]);
  const prevDataRef = useRef<ChartData[]>([]);

  const padding = 40;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barW = chartW / data.length - 8;

  useGSAP(
    () => {
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const targetH = (data[i].value / maxVal) * chartH;
        gsap.to(bar, {
          attr: {
            height: targetH,
            y: padding + chartH - targetH,
          },
          duration: 0.8,
          ease: "power2.out",
          delay: i * 0.05,
        });
      });
      prevDataRef.current = data;
    },
    { dependencies: [data], scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Animated bar chart"
    >
      <title>Bar chart with animated transitions</title>
      <desc>
        {data.map((d) => `${d.label}: ${d.value}`).join(", ")}
      </desc>
      {/* Axis */}
      <line
        x1={padding} y1={padding + chartH}
        x2={padding + chartW} y2={padding + chartH}
        stroke="currentColor" strokeWidth={1}
      />
      {/* Bars */}
      {data.map((d, i) => (
        <rect
          key={d.label}
          ref={(el) => { if (el) barsRef.current[i] = el; }}
          x={padding + i * (barW + 8) + 4}
          y={padding + chartH}
          width={barW}
          height={0}
          rx={3}
          fill="#6366f1"
        />
      ))}
      {/* Labels */}
      {data.map((d, i) => (
        <text
          key={`label-${d.label}`}
          x={padding + i * (barW + 8) + 4 + barW / 2}
          y={padding + chartH + 16}
          textAnchor="middle"
          fontSize={10}
          fill="currentColor"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}
```

## 8. SVG Mask Text Reveal

Text masked by an SVG circle that expands to reveal content.

```tsx
function MaskTextReveal({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      gsap.set(circleRef.current, { attr: { r: 0 } });

      gsap.to(circleRef.current, {
        attr: { r: 800 },
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef }
  );

  const maskId = `mask-reveal-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div ref={containerRef} style={{ position: "relative", overflow: "hidden" }}>
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="black" />
            <circle ref={circleRef} cx="50%" cy="50%" r={0} fill="white" />
          </mask>
        </defs>
      </svg>
      <h2
        style={{
          fontSize: "clamp(2rem, 6vw, 5rem)",
          fontWeight: 800,
          WebkitMaskImage: `url(#${maskId})`,
          maskImage: `url(#${maskId})`,
        }}
        role="heading"
        aria-level={2}
      >
        {text}
      </h2>
    </div>
  );
}
```

## 9. Wave / Liquid Section Dividers

Animated SVG wave between page sections.

```tsx
function WaveDivider({
  color = "#6366f1",
  height = 120,
  speed = 8,
}: {
  color?: string;
  height?: number;
  speed?: number;
}) {
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // Static wave shape is sufficient

    // Animate first wave
    gsap.to(path1Ref.current, {
      attr: {
        d: "M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z",
      },
      duration: speed,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Animate second wave offset
    gsap.to(path2Ref.current, {
      attr: {
        d: "M0,80 C200,20 400,100 600,40 C800,0 1000,100 1200,80 L1200,120 L0,120 Z",
      },
      duration: speed * 1.3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  });

  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      style={{ width: "100%", height, display: "block" }}
      role="presentation"
      aria-hidden="true"
    >
      <path
        ref={path1Ref}
        d="M0,60 C200,0 400,120 600,60 C800,0 1000,120 1200,60 L1200,120 L0,120 Z"
        fill={color}
        opacity={0.5}
      />
      <path
        ref={path2Ref}
        d="M0,80 C200,100 400,20 600,80 C800,120 1000,20 1200,80 L1200,120 L0,120 Z"
        fill={color}
        opacity={0.3}
      />
    </svg>
  );
}
```

## 10. Animated SVG Patterns

Repeating pattern elements that animate — rotate, scale, and shift.

```tsx
function AnimatedPattern() {
  const groupRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const elements = gsap.utils.toArray<SVGElement>("rect", groupRef.current);

      gsap.to(elements, {
        rotation: 360,
        scale: 0.6,
        transformOrigin: "center center",
        duration: 4,
        ease: "sine.inOut",
        stagger: {
          grid: [6, 6],
          from: "center",
          amount: 1.5,
        },
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: groupRef }
  );

  const size = 30;
  const gap = 40;
  const cols = 6;
  const rows = 6;

  return (
    <svg
      viewBox={`0 0 ${cols * gap} ${rows * gap}`}
      width={cols * gap}
      height={rows * gap}
      role="img"
      aria-label="Animated geometric pattern"
    >
      <desc>Grid of squares that rotate and scale in a wave from center</desc>
      <g ref={groupRef}>
        {Array.from({ length: rows * cols }, (_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          return (
            <rect
              key={i}
              x={col * gap + (gap - size) / 2}
              y={row * gap + (gap - size) / 2}
              width={size}
              height={size}
              rx={4}
              fill="#6366f1"
              opacity={0.8}
            />
          );
        })}
      </g>
    </svg>
  );
}
```

## 11. Motion Path Animation

Elements following an SVG path using GSAP MotionPathPlugin.

```tsx
function MotionPathFollower({
  pathD = "M20,200 C80,20 200,20 300,100 C400,180 500,20 580,200",
}: {
  pathD?: string;
}) {
  const followerRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    gsap.to(followerRef.current, {
      motionPath: {
        path: pathRef.current!,
        align: pathRef.current!,
        alignOrigin: [0.5, 0.5],
        autoRotate: true,
      },
      duration: 4,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });
  });

  return (
    <svg
      viewBox="0 0 600 250"
      style={{ width: "100%", maxWidth: 600 }}
      role="img"
      aria-label="Element following a curved path"
    >
      <title>Motion path animation</title>
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={2}
        strokeDasharray="6 4"
      />
      <circle ref={followerRef} r={10} fill="#6366f1" />
    </svg>
  );
}
```

## SVG Optimization Tips

1. **Run SVGO** before using SVGs in production:
   ```bash
   npx svgo icon.svg -o icon.min.svg
   # Or use the SVGO config:
   npx svgo --config '{"plugins":["preset-default",{"name":"removeViewBox","active":false}]}' icon.svg
   ```
2. **Clean paths** — remove editor metadata, collapse groups, merge redundant path segments.
3. **Simplify curves** — fewer control points = smoother morphing and faster rendering.
4. **Inline SVG vs external file:**
   - **Inline** — required for GSAP animation, ref access, CSS styling, and path drawing.
   - **External `<img>`** — good for static icons; cannot animate internal elements.
   - **`<use>` with sprites** — good for repeated static icons; limited animation support.

## Responsive SVG

- Always set `viewBox` on your `<svg>` element. Omit explicit `width`/`height` in favor of CSS sizing.
- Use `preserveAspectRatio="xMidYMid meet"` (the default) for most cases. Use `"none"` for full-bleed backgrounds and wave dividers so they stretch.
- For wave dividers, combine `preserveAspectRatio="none"` with CSS `width: 100%; height: auto` or a fixed height.
- Scale stroke widths with `vector-effect="non-scaling-stroke"` when you need consistent stroke thickness at any size.

## Performance

- **Animate transforms, not geometry** — prefer `rotation`, `scale`, `x`, `y` over changing path `d` attributes when possible.
- **Limit simultaneous path morphs** — each `d` attribute tween recomputes interpolation every frame. Keep morphing paths under 10 at a time.
- **Use `will-change: transform`** on SVG containers if animating many child elements.
- **Simplify paths** — fewer path points = less CPU per frame during morphing.
- **Pause off-screen** — pair with `ScrollTrigger` to only run animations when visible:
  ```tsx
  scrollTrigger: {
    trigger: containerRef.current,
    toggleActions: "play pause resume pause",
  }
  ```
- **Use `gsap.ticker`** instead of `requestAnimationFrame` for custom logic — GSAP already batches updates.
- **Avoid layout thrashing** — use `gsap.set()` for initial states rather than CSS transitions competing with GSAP.

## Accessibility

- Every decorative SVG should have `aria-hidden="true"` and `role="presentation"`.
- Every meaningful SVG needs `role="img"` and `aria-label="descriptive text"`.
- Include `<title>` as the first child of `<svg>` for screen reader tooltips. Add `<desc>` for longer explanations.
- Respect `prefers-reduced-motion`:
  ```tsx
  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Skip animation or show final state instantly
      gsap.set(pathRef.current, { strokeDashoffset: 0 });
      return;
    }
    // normal animation...
  });
  ```
- For interactive SVG elements (like the hamburger toggle), ensure the wrapping `<button>` has `aria-label` and `aria-expanded` attributes.
- Avoid conveying information through animation alone — always provide a static fallback or text alternative.

## Mobile / Responsive

- SVG morphing is generally performant on mobile since it is vector-based
- Disable continuous looping animations (blobs, waves, patterns) on mobile to save battery, or reduce their complexity
- Ensure touch targets for interactive SVG elements (hamburger toggle) are at least 44x44px
- Use `viewBox` and responsive CSS sizing so SVGs scale correctly across devices
- For wave dividers, test on mobile viewports -- `preserveAspectRatio="none"` may distort shapes at narrow widths
- Use `matchMedia` for mobile adjustments:
  ```tsx
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile) {
    // Simpler animations, fewer morphing paths, or disable continuous loops
  }
  ```

## Design System Integration

- Use `currentColor` in SVG fills and strokes so icons inherit the design system's text color
- Reference CSS custom properties for brand colors: `fill="var(--color-primary)"`
- Coordinate morph/draw durations with the project's motion design tokens
- Match icon sizes to the design system's icon scale (16, 20, 24, 32px)

$ARGUMENTS
