---
description: Pre-built animated React components — Magic UI (150+ shadcn/Tailwind) and React Bits (90+ effects)
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "npx shadcn@latest add"]
  network: false
  destructive: false
---

# Animated Component Libraries

You are an expert at integrating pre-built animated React component libraries. Use Magic UI for polished shadcn/Tailwind components and React Bits for creative WebGL/canvas effects.

## Magic UI

**What:** 150+ animated components built on shadcn/ui, Tailwind CSS, and Motion (Framer Motion). Copy-paste or CLI install. MIT licensed.

**Site:** magicui.design

### Setup

```bash
# Prerequisites: shadcn/ui project with Tailwind CSS
npx shadcn@latest init  # if not already set up

# Install components via CLI
npx shadcn@latest add "https://magicui.design/r/shimmer-button"
npx shadcn@latest add "https://magicui.design/r/marquee"
npx shadcn@latest add "https://magicui.design/r/dock"
```

Components install to `components/magicui/` by default.

### Key Components

#### Background & Decoration
| Component | Use Case |
|-----------|----------|
| `dot-pattern` | Subtle dot grid backgrounds |
| `grid-pattern` | Engineering/technical grid bg |
| `ripple` | Expanding circle ripple effect |
| `particles` | Floating particle field |
| `meteors` | Animated meteor shower |
| `globe` | Interactive 3D globe (cobe) |
| `orbiting-circles` | Rotating icon orbit |

```tsx
import { DotPattern } from "@/components/magicui/dot-pattern";

<div className="relative h-screen">
  <DotPattern className="absolute inset-0 opacity-30" />
  <div className="relative z-10">Content here</div>
</div>
```

#### Text Animations
| Component | Effect |
|-----------|--------|
| `text-reveal` | Scroll-driven word reveal |
| `typing-animation` | Typewriter effect |
| `blur-fade` | Blur + fade entrance |
| `word-rotate` | Rotating word carousel |
| `number-ticker` | Animated number counter |
| `gradual-spacing` | Letters spread apart |
| `scroll-based-velocity` | Speed-reactive text |

```tsx
import { TextReveal } from "@/components/magicui/text-reveal";

<TextReveal text="Magic UI will change the way you design." />
```

#### Interactive Elements
| Component | Effect |
|-----------|--------|
| `shimmer-button` | Shimmer sweep on hover |
| `dock` | macOS-style magnifying dock |
| `marquee` | Infinite scrolling carousel |
| `bento-grid` | Animated bento layout |
| `hero-video-dialog` | Video modal with animation |
| `animated-list` | Staggered list entrance |

```tsx
import { ShimmerButton } from "@/components/magicui/shimmer-button";

<ShimmerButton className="shadow-2xl">
  <span className="text-sm font-medium text-white">Get Started</span>
</ShimmerButton>
```

```tsx
import { Dock, DockIcon } from "@/components/magicui/dock";

<Dock magnification={60} distance={100}>
  <DockIcon><HomeIcon /></DockIcon>
  <DockIcon><SearchIcon /></DockIcon>
  <DockIcon><SettingsIcon /></DockIcon>
</Dock>
```

#### Marquee (Testimonials/Logos)

```tsx
import { Marquee } from "@/components/magicui/marquee";

<Marquee pauseOnHover className="[--duration:20s]">
  {reviews.map((review) => <ReviewCard key={review.id} {...review} />)}
</Marquee>
```

## React Bits

**What:** 90+ animated components including WebGL backgrounds, text effects, and creative interactions. Copy-paste installation.

**Site:** reactbits.dev

### Key Components

#### Backgrounds (Canvas/WebGL)
| Component | Effect |
|-----------|--------|
| `Hyperspeed` | Star Wars hyperspace effect |
| `LetterGlitch` | Matrix-style glitch grid |
| `Threads` | Flowing thread lines |
| `Waves` | Animated wave patterns |
| `Aurora` | Northern lights gradient |
| `GridMotion` | Animated grid with images |

```tsx
// Copy from reactbits.dev, then:
import Hyperspeed from "@/components/reactbits/Hyperspeed";

<div className="h-screen w-full">
  <Hyperspeed />
  <div className="absolute inset-0 z-10 flex items-center justify-center">
    <h1 className="text-6xl font-bold text-white">Hero Title</h1>
  </div>
</div>
```

#### Text Effects
| Component | Effect |
|-----------|--------|
| `SplitText` | Character/word split reveal |
| `BlurText` | Blur-in text animation |
| `GradientText` | Animated gradient sweep |
| `TextPressure` | Mouse-reactive text weight |
| `CountUp` | Animated number counting |

#### Interactive
| Component | Effect |
|-----------|--------|
| `TiltedCard` | 3D tilt on hover |
| `SpotlightCard` | Mouse-following spotlight |
| `Magnet` | Magnetic cursor attraction |
| `ClickSpark` | Spark particles on click |
| `SmoothScroll` | Lenis-based smooth scroll |

## Integration Patterns

### Combining Libraries

```tsx
// Magic UI background + React Bits text effect
import { DotPattern } from "@/components/magicui/dot-pattern";
import SplitText from "@/components/reactbits/SplitText";

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <DotPattern className="absolute inset-0 opacity-20" />
      <div className="relative z-10 text-center">
        <SplitText text="Build Something Amazing" className="text-6xl font-bold" />
        <ShimmerButton className="mt-8">Get Started</ShimmerButton>
      </div>
    </section>
  );
}
```

### Landing Page Pattern

```
Hero: React Bits background (Hyperspeed/Aurora) + Magic UI text-reveal
Social proof: Magic UI marquee with logos
Features: Magic UI bento-grid with blur-fade entrance
Testimonials: Magic UI marquee (vertical) with cards
Stats: Magic UI number-ticker
CTA: Magic UI shimmer-button
Nav: Magic UI dock (floating bottom nav)
```

## Performance Tips

1. **Lazy-load heavy components** — WebGL backgrounds (Hyperspeed, Threads) are GPU-intensive; use dynamic imports:
   ```tsx
   const Hyperspeed = dynamic(() => import("@/components/reactbits/Hyperspeed"), { ssr: false });
   ```
2. **Limit simultaneous WebGL contexts** — browsers cap at ~8-16; use one background per page
3. **Pause off-screen animations** — use Intersection Observer to pause canvas/WebGL when not visible
4. **Reduce motion** — check `prefers-reduced-motion` and swap animated components for static versions
5. **SSR considerations** — Mark canvas/WebGL components with `"use client"` and `ssr: false` in dynamic imports
6. **Bundle size** — Magic UI CLI installs only what you use; React Bits is copy-paste so no unused code ships

$ARGUMENTS
