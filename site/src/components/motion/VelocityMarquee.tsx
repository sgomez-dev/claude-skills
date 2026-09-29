'use client';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const MAX_SKEW = 8; // degrees
const SMOOTHING = 0.12; // per-frame approach, ~0.5 s to settle like the spec's quickTo(power3)

/**
 * Decorative band (aria-hidden: its text is already the "In this issue" list).
 * The CSS marquee scrolls; this only skews it with scroll velocity and eases back when scrolling stops.
 * One passive scroll listener; the rAF loop runs only while the skew is moving.
 */
export function VelocityMarquee({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let lastY = window.scrollY, lastT = performance.now(), target = 0, skew = 0, raf = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      skew += (target - skew) * SMOOTHING;
      if (Math.abs(target - skew) < 0.01) {
        skew = target;
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
      el.style.transform = skew === 0 ? '' : `skewX(${skew.toFixed(2)}deg)`;
    };
    const onScroll = () => {
      const t = performance.now();
      const v = ((window.scrollY - lastY) / Math.max(1, t - lastT)) * 1000; // px/s
      lastY = window.scrollY;
      lastT = t;
      target = Math.max(-MAX_SKEW, Math.min(MAX_SKEW, v / -250));
      clearTimeout(idle);
      idle = setTimeout(() => { target = 0; if (!raf) raf = requestAnimationFrame(tick); }, 120);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(idle);
      cancelAnimationFrame(raf);
    };
  }, []);
  const text = items.join('  ✦  ');
  const track = (
    <div className="marquee-track flex shrink-0 gap-10 pr-10 font-display text-[clamp(1.5rem,4vw,3rem)] font-extrabold uppercase tracking-[-0.02em]">
      <span>{text}</span><span>{text}</span>
    </div>
  );
  return (
    <div aria-hidden className="mb-12 mt-4 overflow-hidden border-y-2 border-ink bg-acid py-3 text-night">
      <div ref={ref} className="flex w-max will-change-transform">{track}{track}</div>
    </div>
  );
}
