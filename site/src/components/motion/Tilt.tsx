'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const STIFFNESS = 260;
const DAMPING = 22;
const MAX_DEG = 4; // ±4° at the edges

/**
 * Magnetic tilt for fine pointers: a damped spring (same constants as the spec's Motion spring) stepped on rAF.
 * Hand-rolled because pulling `motion/react` into every page with a SkillCard costs 43 KB gzip.
 * Plain div for touch, coarse pointers and reduced motion. The loop only runs while the spring is moving.
 */
export function Tilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    let rect: DOMRect | null = null;
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0, raf = 0, last = 0;
    const step = (t: number) => {
      const dt = Math.min(0.032, (t - last) / 1000);
      last = t;
      vx += (STIFFNESS * (tx - x) - DAMPING * vx) * dt;
      vy += (STIFFNESS * (ty - y) - DAMPING * vy) * dt;
      x += vx * dt;
      y += vy * dt;
      const settled = Math.abs(tx - x) < 0.01 && Math.abs(ty - y) < 0.01 && Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01;
      if (settled) {
        x = tx; y = ty; vx = vy = 0; raf = 0;
        el.style.transform = tx === 0 && ty === 0 ? '' : `perspective(800px) rotateX(${x}deg) rotateY(${y}deg)`;
        return;
      }
      el.style.transform = `perspective(800px) rotateX(${x.toFixed(3)}deg) rotateY(${y.toFixed(3)}deg)`;
      raf = requestAnimationFrame(step);
    };
    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    // Measure once per hover: the rect of a tilted element would feed back into the tilt.
    const enter = () => { rect = el.getBoundingClientRect(); };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      rect ??= el.getBoundingClientRect();
      ty = ((e.clientX - rect.left) / rect.width - 0.5) * 2 * MAX_DEG;
      tx = -((e.clientY - rect.top) / rect.height - 0.5) * 2 * MAX_DEG;
      kick();
    };
    const leave = () => { rect = null; tx = 0; ty = 0; kick(); };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      el.style.transform = '';
    };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
