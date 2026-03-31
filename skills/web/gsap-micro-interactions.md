---
description: Premium micro-interactions — GSAP custom cursors, magnetic buttons, tilt cards, spotlight effects, button animations, scroll indicators
permissions:
  reads: ["**/*"]
  writes: ["**/*"]
  commands: ["npm install", "pnpm add"]
  network: false
  destructive: false
---

# GSAP Micro-Interactions & Cursor Effects

Implement premium micro-interactions using GSAP in React. All components use the `useGSAP` hook from `@gsap/react` for proper cleanup and lifecycle management.

Ensure `gsap`, `@gsap/react`, and (where noted) `gsap/ScrollTrigger` are installed:

```bash
npm install gsap @gsap/react
```

Register plugins once at app entry:

```tsx
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
```

---

## 1. Custom Cursor — Smooth Following

A custom cursor dot that smoothly tracks the pointer and scales up when hovering interactive elements.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cursor = cursorRef.current!;
    const follower = followerRef.current!;
    const pos = { x: 0, y: 0 };

    const moveCursor = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.to(cursor, { x: pos.x, y: pos.y, duration: 0.1, ease: "power2.out" });
      gsap.to(follower, { x: pos.x, y: pos.y, duration: 0.35, ease: "power2.out" });
    };

    const handleEnter = () => {
      gsap.to(cursor, { scale: 0.5, duration: 0.3 });
      gsap.to(follower, { scale: 1.8, duration: 0.3, ease: "power2.out" });
    };

    const handleLeave = () => {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      gsap.to(follower, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    document.addEventListener("mousemove", moveCursor);

    const interactives = document.querySelectorAll("a, button, [data-hover]");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: "fixed", top: -5, left: -5, width: 10, height: 10,
          borderRadius: "50%", background: "#fff", pointerEvents: "none",
          zIndex: 9999, mixBlendMode: "difference",
        }}
      />
      <div
        ref={followerRef}
        style={{
          position: "fixed", top: -20, left: -20, width: 40, height: 40,
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.5)",
          pointerEvents: "none", zIndex: 9998,
        }}
      />
    </>
  );
}
```

---

## 2. Cursor Trail — Fading Dots

A trail of dots that follow the cursor with staggered delay, each fading and shrinking out.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function CursorTrail({ count = 12, color = "#8b5cf6" }: { count?: number; color?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const dots = containerRef.current!.children;
    const positions = Array.from({ length: count }, () => ({ x: 0, y: 0 }));

    const onMove = (e: MouseEvent) => {
      positions[0] = { x: e.clientX, y: e.clientY };

      for (let i = 0; i < count; i++) {
        const dot = dots[i] as HTMLElement;
        const delay = (i + 1) * 0.04;
        const target = i === 0 ? positions[0] : positions[i - 1];

        gsap.to(positions[i], {
          x: target.x,
          y: target.y,
          duration: 0.25,
          delay,
          ease: "power2.out",
          onUpdate: () => {
            gsap.set(dot, { x: positions[i].x, y: positions[i].y });
          },
        });

        gsap.to(dot, {
          opacity: 1 - i / count,
          scale: 1 - i / (count * 1.5),
          duration: 0.2,
          delay,
        });
      }
    };

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [count]);

  return (
    <div ref={containerRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9990 }}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute", top: -4, left: -4, width: 8, height: 8,
            borderRadius: "50%", background: color, opacity: 0,
          }}
        />
      ))}
    </div>
  );
}
```

---

## 3. Magnetic Buttons

Button content gravitates toward the cursor when nearby, then snaps back with an elastic ease on leave.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function MagneticButton({ children, strength = 0.4 }: { children: React.ReactNode; strength?: number }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const btn = btnRef.current!;

    const handleMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      gsap.to(btn, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)",
      });
    };

    btn.addEventListener("mousemove", handleMove);
    btn.addEventListener("mouseleave", handleLeave);

    return () => {
      btn.removeEventListener("mousemove", handleMove);
      btn.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  return (
    <button
      ref={btnRef}
      style={{
        padding: "14px 32px", fontSize: "1rem", border: "2px solid #fff",
        background: "transparent", color: "#fff", borderRadius: 8,
        cursor: "pointer", position: "relative", willChange: "transform",
      }}
    >
      {children}
    </button>
  );
}
```

---

## 4. Spotlight / Flashlight Effect

A dark overlay with a radial gradient hole that follows the cursor, revealing content beneath.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function SpotlightEffect({ radius = 180 }: { radius?: number }) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const overlay = overlayRef.current!;

    const handleMove = (e: MouseEvent) => {
      gsap.to(overlay, {
        "--mx": `${e.clientX}px`,
        "--my": `${e.clientY}px`,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    document.addEventListener("mousemove", handleMove);
    return () => document.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9000, pointerEvents: "none",
        background: `radial-gradient(circle ${radius}px at var(--mx, 50%) var(--my, 50%), transparent 0%, rgba(0,0,0,0.85) 100%)`,
      } as React.CSSProperties}
    />
  );
}
```

---

## 5. Hover Card Tilt (3D Perspective)

Cards tilt in 3D based on mouse position using `perspective`, `rotateX`, and `rotateY`.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function TiltCard({ children, maxTilt = 15 }: { children: React.ReactNode; maxTilt?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const card = cardRef.current!;

    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(card, {
        rotateY: x * maxTilt,
        rotateX: -y * maxTilt,
        transformPerspective: 800,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);

    return () => {
      card.removeEventListener("mousemove", handleMove);
      card.removeEventListener("mouseleave", handleLeave);
    };
  }, [maxTilt]);

  return (
    <div
      ref={cardRef}
      style={{
        padding: 32, borderRadius: 16, background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)", willChange: "transform",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}
```

---

## 6. Button Hover Animations Collection

Five distinct button hover effects: fill slide, shimmer sweep, border draw, ripple, underline slide.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// --- Fill Slide ---
export function FillSlideButton({ children }: { children: React.ReactNode }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const btn = btnRef.current!;
    const fill = fillRef.current!;
    gsap.set(fill, { scaleX: 0, transformOrigin: "left center" });

    btn.addEventListener("mouseenter", () => {
      gsap.to(fill, { scaleX: 1, duration: 0.4, ease: "power2.out" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(fill, { scaleX: 0, transformOrigin: "right center", duration: 0.3, ease: "power2.in" });
    });
  }, []);

  return (
    <button ref={btnRef} style={{ position: "relative", overflow: "hidden", padding: "12px 28px",
      background: "transparent", border: "2px solid #8b5cf6", color: "#fff", borderRadius: 6, cursor: "pointer" }}>
      <span ref={fillRef} style={{ position: "absolute", inset: 0, background: "#8b5cf6", zIndex: 0 }} />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </button>
  );
}

// --- Shimmer Sweep ---
export function ShimmerButton({ children }: { children: React.ReactNode }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const shimmerRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const btn = btnRef.current!;
    const shimmer = shimmerRef.current!;
    gsap.set(shimmer, { x: "-100%" });

    btn.addEventListener("mouseenter", () => {
      gsap.fromTo(shimmer, { x: "-100%" }, { x: "200%", duration: 0.7, ease: "power2.inOut" });
    });
  }, []);

  return (
    <button ref={btnRef} style={{ position: "relative", overflow: "hidden", padding: "12px 28px",
      background: "#8b5cf6", border: "none", color: "#fff", borderRadius: 6, cursor: "pointer" }}>
      <span ref={shimmerRef} style={{ position: "absolute", inset: 0, width: "50%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", zIndex: 0 }} />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </button>
  );
}

// --- Border Draw ---
export function BorderDrawButton({ children }: { children: React.ReactNode }) {
  const svgRef = useRef<SVGRectElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const rect = svgRef.current!;
    const len = rect.getTotalLength();
    gsap.set(rect, { strokeDasharray: len, strokeDashoffset: len });

    btnRef.current!.addEventListener("mouseenter", () => {
      gsap.to(rect, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" });
    });
    btnRef.current!.addEventListener("mouseleave", () => {
      gsap.to(rect, { strokeDashoffset: len, duration: 0.4, ease: "power2.in" });
    });
  }, []);

  return (
    <button ref={btnRef} style={{ position: "relative", padding: "12px 28px", background: "transparent",
      border: "none", color: "#fff", cursor: "pointer" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <rect ref={svgRef} x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
          rx="6" fill="none" stroke="#8b5cf6" strokeWidth="2" />
      </svg>
      <span style={{ position: "relative" }}>{children}</span>
    </button>
  );
}

// --- Ripple Effect ---
export function RippleButton({ children }: { children: React.ReactNode }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const btn = btnRef.current!;

    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height) * 2;
      Object.assign(ripple.style, {
        position: "absolute", width: `${size}px`, height: `${size}px`, borderRadius: "50%",
        background: "rgba(255,255,255,0.3)", left: `${e.clientX - rect.left - size / 2}px`,
        top: `${e.clientY - rect.top - size / 2}px`, pointerEvents: "none",
      });
      btn.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 1 }, {
        scale: 1, opacity: 0, duration: 0.6, ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
    });
  }, []);

  return (
    <button ref={btnRef} style={{ position: "relative", overflow: "hidden", padding: "12px 28px",
      background: "#8b5cf6", border: "none", color: "#fff", borderRadius: 6, cursor: "pointer" }}>
      {children}
    </button>
  );
}

// --- Underline Slide ---
export function UnderlineButton({ children }: { children: React.ReactNode }) {
  const lineRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const line = lineRef.current!;
    gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

    btnRef.current!.addEventListener("mouseenter", () => {
      gsap.to(line, { scaleX: 1, duration: 0.35, ease: "power2.out" });
    });
    btnRef.current!.addEventListener("mouseleave", () => {
      gsap.to(line, { scaleX: 0, transformOrigin: "right center", duration: 0.25, ease: "power2.in" });
    });
  }, []);

  return (
    <button ref={btnRef} style={{ position: "relative", padding: "8px 4px", background: "transparent",
      border: "none", color: "#fff", cursor: "pointer", fontSize: "1rem" }}>
      {children}
      <span ref={lineRef} style={{ position: "absolute", bottom: 0, left: 0, width: "100%",
        height: 2, background: "#8b5cf6" }} />
    </button>
  );
}
```

---

## 7. Menu Hover — Sliding Active Indicator

An animated indicator that slides between menu items following the hovered item.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function SlidingMenu({ items }: { items: string[] }) {
  const navRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const nav = navRef.current!;
    const indicator = indicatorRef.current!;
    const links = nav.querySelectorAll<HTMLElement>("[data-menu-item]");

    links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        const rect = link.getBoundingClientRect();
        const navRect = nav.getBoundingClientRect();
        gsap.to(indicator, {
          x: rect.left - navRect.left,
          width: rect.width,
          opacity: 1,
          duration: 0.35,
          ease: "power3.out",
        });
      });
    });

    nav.addEventListener("mouseleave", () => {
      gsap.to(indicator, { opacity: 0, duration: 0.25 });
    });
  }, [items]);

  return (
    <nav ref={navRef} style={{ display: "flex", gap: 8, position: "relative", padding: "8px 0" }}>
      <div ref={indicatorRef} style={{ position: "absolute", bottom: 0, height: 3,
        background: "#8b5cf6", borderRadius: 2, opacity: 0 }} />
      {items.map((item) => (
        <a key={item} data-menu-item href="#" style={{ padding: "8px 16px", color: "#fff",
          textDecoration: "none", position: "relative", zIndex: 1 }}>
          {item}
        </a>
      ))}
    </nav>
  );
}
```

---

## 8. Form Input Focus — Floating Label + Animated Underline

A floating label that animates up on focus, paired with an expanding underline.

```tsx
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function AnimatedInput({ label, type = "text" }: { label: string; type?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState("");

  useGSAP(() => {
    const input = containerRef.current!.querySelector("input")!;
    const lbl = labelRef.current!;
    const line = lineRef.current!;

    gsap.set(line, { scaleX: 0 });

    const floatUp = () => {
      gsap.to(lbl, { y: -22, scale: 0.8, color: "#8b5cf6", duration: 0.3, ease: "power2.out" });
      gsap.to(line, { scaleX: 1, duration: 0.4, ease: "power2.out" });
    };

    const floatDown = () => {
      if (!input.value) {
        gsap.to(lbl, { y: 0, scale: 1, color: "#888", duration: 0.3, ease: "power2.out" });
      }
      gsap.to(line, { scaleX: 0, duration: 0.3, ease: "power2.in" });
    };

    input.addEventListener("focus", floatUp);
    input.addEventListener("blur", floatDown);

    return () => {
      input.removeEventListener("focus", floatUp);
      input.removeEventListener("blur", floatDown);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", marginTop: 24, width: 280 }}>
      <label ref={labelRef} style={{ position: "absolute", top: 12, left: 0, color: "#888",
        fontSize: "1rem", pointerEvents: "none", transformOrigin: "left top" }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: "100%", padding: "12px 0", background: "transparent", border: "none",
          borderBottom: "2px solid #333", color: "#fff", fontSize: "1rem", outline: "none" }}
      />
      <span ref={lineRef} style={{ position: "absolute", bottom: 0, left: 0, width: "100%",
        height: 2, background: "#8b5cf6", transformOrigin: "center" }} />
    </div>
  );
}
```

---

## 9. Scroll Progress Indicator

A fixed top bar that fills based on page scroll percentage using GSAP ScrollTrigger.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgressBar({ color = "#8b5cf6", height = 3 }: { color?: string; height?: number }) {
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(barRef.current!, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    });
  }, []);

  return (
    <div ref={barRef} style={{
      position: "fixed", top: 0, left: 0, width: "100%", height,
      background: color, transformOrigin: "left center", transform: "scaleX(0)",
      zIndex: 10000,
    }} />
  );
}
```

---

## 10. Scroll-to-Top with Circular Progress Ring

An SVG circle that fills as the user scrolls. Clicking it smoothly scrolls to the top.

```tsx
import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function ScrollToTopButton({ size = 48 }: { size?: number }) {
  const circleRef = useRef<SVGCircleElement>(null);
  const containerRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const circumference = Math.PI * (size - 8);

  useGSAP(() => {
    const circle = circleRef.current!;
    gsap.set(circle, { strokeDasharray: circumference, strokeDashoffset: circumference });

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        gsap.set(circle, { strokeDashoffset: circumference * (1 - self.progress) });
        setVisible(self.progress > 0.1);
      },
    });
  }, [circumference]);

  useEffect(() => {
    gsap.to(containerRef.current!, { opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8, duration: 0.3 });
  }, [visible]);

  const scrollToTop = () => {
    gsap.to(window, { scrollTo: { y: 0 }, duration: 1, ease: "power3.inOut" });
  };

  return (
    <button
      ref={containerRef}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{
        position: "fixed", bottom: 24, right: 24, width: size, height: size,
        borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        opacity: 0, zIndex: 9999,
      }}
    >
      <svg width={size} height={size} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <circle ref={circleRef} cx={size / 2} cy={size / 2} r={(size - 8) / 2}
          fill="none" stroke="#8b5cf6" strokeWidth="3" />
      </svg>
      <span style={{ color: "#fff", fontSize: 18, lineHeight: 1 }}>&#8593;</span>
    </button>
  );
}
```

---

## 11. Toast / Notification Entrance

Toasts slide in from the right with spring physics and auto-dismiss with a visual countdown.

```tsx
import { useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function useToast(duration = 4) {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const show = useCallback((message: string) => {
    const id = ++idRef.current;
    const container = containerRef.current!;

    const el = document.createElement("div");
    el.setAttribute("role", "alert");
    el.setAttribute("aria-live", "polite");
    Object.assign(el.style, {
      padding: "12px 20px", background: "#1e1e2e", border: "1px solid #333",
      borderRadius: "8px", color: "#fff", marginBottom: "8px", position: "relative",
      overflow: "hidden", minWidth: "280px",
    });
    el.textContent = message;

    const progress = document.createElement("div");
    Object.assign(progress.style, {
      position: "absolute", bottom: "0", left: "0", height: "3px",
      background: "#8b5cf6", width: "100%", transformOrigin: "left",
    });
    el.appendChild(progress);
    container.appendChild(el);

    const tl = gsap.timeline();
    tl.from(el, { x: 120, opacity: 0, duration: 0.5, ease: "back.out(1.7)" })
      .to(progress, { scaleX: 0, duration, ease: "none" })
      .to(el, { x: 120, opacity: 0, height: 0, padding: 0, margin: 0, duration: 0.3,
        ease: "power2.in", onComplete: () => el.remove() });

    return id;
  }, [duration]);

  const ToastContainer = () => (
    <div ref={containerRef} style={{
      position: "fixed", top: 20, right: 20, zIndex: 10000, display: "flex",
      flexDirection: "column", gap: 8,
    }} />
  );

  return { show, ToastContainer };
}
```

---

## 12. Tooltip Animations

Tooltips that scale and fade from the trigger element's origin point, with a directional arrow.

```tsx
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function Tooltip({ children, content, placement = "top" }: {
  children: React.ReactNode; content: string; placement?: "top" | "bottom" | "left" | "right";
}) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  const origins: Record<string, string> = {
    top: "center bottom", bottom: "center top",
    left: "right center", right: "left center",
  };

  const offsets: Record<string, { x: number; y: number }> = {
    top: { x: 0, y: -8 }, bottom: { x: 0, y: 8 },
    left: { x: -8, y: 0 }, right: { x: 8, y: 0 },
  };

  useGSAP(() => {
    if (!tipRef.current) return;
    const tip = tipRef.current;

    if (show) {
      gsap.fromTo(tip,
        { scale: 0.8, opacity: 0, ...offsets[placement], transformOrigin: origins[placement] },
        { scale: 1, opacity: 1, x: 0, y: 0, duration: 0.25, ease: "back.out(2)" }
      );
    } else {
      gsap.to(tip, {
        scale: 0.8, opacity: 0, duration: 0.15, ease: "power2.in",
      });
    }
  }, [show, placement]);

  const placementStyles: Record<string, React.CSSProperties> = {
    top: { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 8 },
    bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 8 },
    left: { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: 8 },
    right: { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: 8 },
  };

  return (
    <span
      ref={triggerRef}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0}
      style={{ position: "relative", display: "inline-block" }}
    >
      {children}
      {show && (
        <div ref={tipRef} role="tooltip" style={{
          position: "absolute", ...placementStyles[placement],
          padding: "6px 12px", background: "#1e1e2e", border: "1px solid #333",
          borderRadius: 6, color: "#fff", fontSize: "0.85rem", whiteSpace: "nowrap",
          pointerEvents: "none", zIndex: 9999, opacity: 0,
        }}>
          {content}
        </div>
      )}
    </span>
  );
}
```

---

## Touch Alternatives for Cursor-Dependent Effects

Cursor effects (custom cursor, trail, spotlight, magnetic buttons, tilt cards) have no hover on touch devices. Provide alternatives:

- **Custom cursor / trail**: Hide entirely on touch. Detect with `window.matchMedia("(pointer: coarse)")`.
- **Magnetic buttons**: Replace with a press scale animation using `touchstart` / `touchend`.
- **Spotlight**: Convert to a tap-to-reveal or use device orientation (`DeviceOrientationEvent`) to move the spotlight.
- **Tilt cards**: Use `DeviceOrientationEvent` for physical tilt on mobile, or disable the effect gracefully.

```tsx
// Utility: detect coarse pointer (touch) device
export function isTouchDevice(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

// Wrap any cursor effect with this guard
export function useCursorEffect(setup: () => (() => void) | void) {
  useGSAP(() => {
    if (isTouchDevice()) return;
    return setup();
  }, []);
}
```

---

## Performance Guidelines

1. **Use `will-change: transform`** on elements that animate `transform` or `opacity` to promote them to their own compositor layer.
2. **Stick to transform and opacity** for animations. Avoid animating `width`, `height`, `top`, `left`, or `box-shadow` as these trigger layout repaints.
3. **Throttle `mousemove` handlers** if you attach them to `document`. GSAP's internal RAF loop handles interpolation, but avoid creating new timelines on every frame.
4. **Clean up listeners** via the `useGSAP` return function to prevent memory leaks on unmount.
5. **Use `gsap.quickTo()`** for high-frequency property updates (cursor position) -- it reuses the same tween instance:
   ```tsx
   const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power2.out" });
   const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power2.out" });
   document.addEventListener("mousemove", (e) => { xTo(e.clientX); yTo(e.clientY); });
   ```
6. **Batch ScrollTrigger refreshes** when dynamically adding content: call `ScrollTrigger.refresh()` once after all elements mount, not per-element.

---

## Accessibility

1. **Respect `prefers-reduced-motion`**: Wrap animations in a media query check and provide instant or no-motion fallbacks.
   ```tsx
   const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
   if (prefersReduced) {
     gsap.set(el, { opacity: 1 }); // Skip animation, set final state
     return;
   }
   ```
2. **Focus-visible styles**: All interactive components (magnetic buttons, tooltips, menu items) must have visible `:focus-visible` outlines. Never remove focus indicators.
3. **Keyboard navigation**: Tooltips show on `focus` and hide on `blur`. Menu items are navigable with `Tab` / `Shift+Tab`. Scroll-to-top button is in the tab order with `aria-label`.
4. **ARIA roles**: Toasts use `role="alert"` and `aria-live="polite"`. Tooltips use `role="tooltip"`.
5. **No seizure risk**: Avoid flashing content faster than 3 times per second. All animations here use durations of 200ms+ which is safe.

$ARGUMENTS
