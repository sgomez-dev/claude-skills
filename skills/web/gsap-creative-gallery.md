---
description: GSAP creative galleries — infinite scroll, masonry animations, lightbox transitions, FLIP layouts, and interactive image showcases
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "pnpm add"]
  network: false
  destructive: false
---

# GSAP Creative Gallery

You are an expert in building animated image galleries using GSAP. Create interactive, performant galleries with FLIP layout transitions, scroll-driven reveals, lightbox animations, and creative hover effects.

## 1. Setup

```bash
npm install gsap @gsap/react
```

```tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, Flip, ScrollTrigger);
```

## 2. FLIP Layout Filter Gallery

Filter gallery items with smooth FLIP-powered layout transitions.

```tsx
function FilterGallery({ items }: { items: GalleryItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState("all");

  const handleFilter = (category: string) => {
    const state = Flip.getState(".gallery-item");
    setFilter(category);

    // After React re-renders, animate layout change
    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.04,
        absolute: true,
        scale: true,
        onEnter: (elements) =>
          gsap.fromTo(elements, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4 }),
        onLeave: (elements) =>
          gsap.to(elements, { opacity: 0, scale: 0.8, duration: 0.3 }),
      });
    });
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  return (
    <div ref={containerRef}>
      <div className="flex gap-4 mb-8">
        {["all", "photo", "illustration", "3d"].map((cat) => (
          <button key={cat} onClick={() => handleFilter(cat)} className="px-4 py-2 rounded">
            {cat}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div key={item.id} data-flip-id={item.id} className="gallery-item">
            <img src={item.src} alt={item.alt} className="w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 3. Scroll-Triggered Stagger Grid

Gallery items animate in as rows enter the viewport.

```tsx
function StaggerGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ScrollTrigger.batch(".grid-item", {
      onEnter: (elements) => {
        gsap.from(elements, {
          y: prefersReduced ? 0 : 60,
          opacity: 0,
          scale: prefersReduced ? 1 : 0.95,
          stagger: prefersReduced ? 0.03 : 0.08,
          duration: prefersReduced ? 0.3 : 0.7,
          ease: "power3.out",
        });
      },
      start: "top 88%",
    });
  }, { scope: gridRef });

  return (
    <div ref={gridRef} className="grid grid-cols-3 gap-6">
      {images.map((src, i) => (
        <div key={i} className="grid-item overflow-hidden rounded-xl">
          <img src={src} alt={`Gallery image ${i + 1}`} className="w-full h-64 object-cover" loading="lazy" />
        </div>
      ))}
    </div>
  );
}
```

## 4. Lightbox Open/Close with FLIP

Expand a thumbnail to fullscreen with FLIP-powered smooth animation.

```tsx
function LightboxGallery() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openLightbox = (id: string) => {
    const el = document.querySelector(`[data-flip-id="${id}"]`)!;
    const state = Flip.getState(el);

    setActiveId(id);

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.5,
        ease: "power3.inOut",
        absolute: true,
        scale: true,
      });
      gsap.fromTo(".lightbox-overlay", { opacity: 0 }, { opacity: 1, duration: 0.3 });
    });
  };

  const closeLightbox = () => {
    const el = document.querySelector(`[data-flip-id="${activeId}"]`)!;
    const state = Flip.getState(el);

    setActiveId(null);

    requestAnimationFrame(() => {
      Flip.from(state, {
        duration: 0.4,
        ease: "power3.inOut",
        absolute: true,
        scale: true,
      });
      gsap.to(".lightbox-overlay", { opacity: 0, duration: 0.3 });
    });
  };

  return <div ref={containerRef}>...</div>;
}
```

## 5. Magnetic Hover Effect

Gallery items subtly follow the cursor with a magnetic pull.

```tsx
function MagneticGalleryItem({ children }: { children: React.ReactNode }) {
  const itemRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = itemRef.current!;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.2,
        y: y * 0.2,
        rotateX: -y * 0.05,
        rotateY: x * 0.05,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, { scope: itemRef });

  return (
    <div ref={itemRef} style={{ perspective: "600px" }} className="cursor-pointer">
      {children}
    </div>
  );
}
```

## 6. Infinite Horizontal Scroll Gallery

Continuously scrolling gallery that loops seamlessly.

```tsx
function InfiniteGallery() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const track = trackRef.current!;
    const items = gsap.utils.toArray<HTMLElement>(".infinite-item");
    const totalWidth = items.reduce((acc, el) => acc + el.offsetWidth + 16, 0);

    gsap.to(track, {
      x: -totalWidth / 2,
      duration: 30,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % (totalWidth / 2)),
      },
    });
  }, { scope: trackRef });

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex gap-4 whitespace-nowrap">
        {[...images, ...images].map((src, i) => (
          <div key={i} className="infinite-item flex-shrink-0 w-80 h-60">
            <img src={src} alt="" className="w-full h-full object-cover rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 7. Hover Reveal with Clip-Path

Image reveals on hover through an expanding clip-path.

```tsx
function ClipHoverCard({ src, title }: { src: string; title: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current!;
    const image = card.querySelector(".clip-image") as HTMLElement;

    const enter = () => {
      gsap.to(image, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.5,
        ease: "power3.inOut",
      });
      gsap.to(card.querySelector(".card-title"), { y: -10, opacity: 1, duration: 0.3 });
    };

    const leave = () => {
      gsap.to(image, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 0.4,
        ease: "power3.in",
      });
      gsap.to(card.querySelector(".card-title"), { y: 0, opacity: 0.7, duration: 0.3 });
    };

    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);

    return () => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    };
  }, { scope: cardRef });

  return (
    <div ref={cardRef} className="relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer">
      <img src={src} alt="" className="clip-image absolute inset-0 w-full h-full object-cover" style={{ clipPath: "inset(100% 0% 0% 0%)" }} />
      <h3 className="card-title absolute bottom-4 left-4 text-white text-2xl font-bold opacity-70">{title}</h3>
    </div>
  );
}
```

## 8. Masonry Layout with Staggered Entrance

Masonry grid with items entering at different speeds based on column.

```tsx
function MasonryGallery() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const columns = gsap.utils.toArray<HTMLElement>(".masonry-col");

    columns.forEach((col, i) => {
      const items = col.querySelectorAll(".masonry-item");
      gsap.from(items, {
        y: 100 + i * 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: col,
          start: "top 85%",
        },
      });
    });
  }, { scope: gridRef });

  return (
    <div ref={gridRef} className="flex gap-4">
      {[0, 1, 2].map((col) => (
        <div key={col} className="masonry-col flex-1 flex flex-col gap-4">
          {columnItems[col].map((item) => (
            <div key={item.id} className="masonry-item rounded-xl overflow-hidden">
              <img src={item.src} alt={item.alt} className="w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## 9. Cursor-Following Image Trail

Images appear along the cursor path as the user moves over the gallery area.

```tsx
function ImageTrail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const images = gsap.utils.toArray<HTMLElement>(".trail-image");
    let current = 0;

    const onMove = (e: MouseEvent) => {
      const img = images[current % images.length];
      gsap.set(img, { x: e.clientX - 75, y: e.clientY - 100, display: "block" });
      gsap.fromTo(img, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.6, duration: 1, delay: 0.3, ease: "power2.in" });
      current++;
    };

    const container = containerRef.current!;
    container.addEventListener("mousemove", onMove);

    return () => container.removeEventListener("mousemove", onMove);
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-screen cursor-none">
      {Array.from({ length: 15 }).map((_, i) => (
        <img
          key={i}
          src={`/gallery/${i % 5}.webp`}
          className="trail-image absolute w-36 h-48 object-cover rounded-lg pointer-events-none hidden"
          alt=""
        />
      ))}
    </div>
  );
}
```

## Performance Tips

1. **Use `loading="lazy"`** on gallery images below the fold
2. **Set `data-flip-id`** on elements for FLIP to track identity across re-renders
3. **Limit ScrollTrigger.batch** to visible viewport items (under 50 at a time)
4. **Use `srcset` and `sizes`** for responsive images to avoid loading oversized assets
5. **Use `will-change: transform`** only on actively animating items, remove after
6. **Debounce filter changes** if categories change rapidly
7. **Use CSS `content-visibility: auto`** on off-screen gallery sections

## Accessibility

```tsx
useGSAP(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    gsap.set(".gallery-item", { opacity: 1, y: 0, scale: 1 });
    return;
  }

  // Normal gallery animations...
});
```

- All images must have descriptive `alt` text -- never leave `alt=""` for meaningful gallery images
- Lightbox must trap focus, support Escape to close, use `role="dialog"` and `aria-modal="true"`, and restore focus to the trigger element on close
- Filter buttons must have clear labels and `aria-pressed` state
- Gallery should be navigable with keyboard (Tab through items, Enter to open lightbox, arrow keys inside lightbox)
- Ensure sufficient color contrast for image overlay text
- Infinite scroll galleries should have a way to pause or stop for keyboard-only users
- Cursor-following effects (image trail, magnetic) are hover enhancements -- all content must be accessible without them

## Mobile / Responsive

- Switch from 3-column to 2-column or single-column on mobile:
  ```tsx
  const columns = window.matchMedia("(max-width: 768px)").matches ? 1 : 3;
  ```
- Disable magnetic hover effects on touch devices
- Replace clip-path hover reveals with tap-to-reveal on mobile
- Reduce infinite scroll speed on mobile for readability
- Use `touch-action: pan-y` on horizontal scroll galleries for smooth mobile UX
- Optimize image sizes per breakpoint to reduce mobile bandwidth

## Design System Integration

- Use design system border-radius tokens for image rounding
- Pull gallery gap/spacing from CSS custom properties or Tailwind theme
- Coordinate lightbox overlay color with the design system's overlay token
- Use theme-aware transition durations if the design system defines motion tokens

$ARGUMENTS
