'use client';
import { useEffect } from 'react';
import { CSS_EASE } from '@/lib/motion';
import { INTRO_KEY } from '@/lib/motion/intro-key';

const INTERRUPT = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

/**
 * ~1.7 s magazine opening on the Web Animations API (zero bytes of animation library).
 * Only transforms, clip-path and opacity animate, so the h1 text paints at once.
 * Any input finishes it immediately.
 */
export function CoverIntro() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('intro-pending')) {
      root.dataset.intro = 'skipped';
      return;
    }
    const q = (k: string) => Array.from(document.querySelectorAll<HTMLElement>(`[data-intro="${k}"]`));
    const anims: Animation[] = [];
    // `backwards` holds each start state through its delay; with no forwards fill the element returns to its own CSS at the end.
    const play = (el: HTMLElement, frames: Keyframe[], delay: number, duration: number, easing: string = CSS_EASE.power3Out) =>
      anims.push(el.animate(frames, { delay, duration, easing, fill: 'backwards' }));

    // Timeline (ms), mirroring the spec's choreography: rule, accent, highlight, stickers.
    q('rule').forEach((el) => play(el, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 0, 600));
    q('accent').forEach((el) => play(el, [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }], 350, 500));
    const reveal = [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }];
    q('highlight-bg').forEach((el) => play(el, reveal, 700, 450));
    // The highlighted words: a night copy revealed with the bar (identical keyframes, timing and box) over the ink words.
    q('highlight').forEach((host) => {
      const overlay = host.querySelector<HTMLElement>('[data-intro="highlight-overlay"]');
      if (!overlay) return;
      host.dataset.sweep = '';
      const a = overlay.animate(reveal, { delay: 700, duration: 450, easing: CSS_EASE.power3Out, fill: 'backwards' });
      anims.push(a);
      const end = () => { delete host.dataset.sweep; };
      a.finished.then(end, end);
    });
    q('sticker').forEach((el, i) => {
      const r = getComputedStyle(el).getPropertyValue('--r').trim() || '-3deg';
      play(el, [
        { transform: `rotate(${r}) translateY(-40px) scale(1.2)`, opacity: 0 },
        { transform: `rotate(${r})`, opacity: 1 },
      ], 1050 + i * 120, 500, CSS_EASE.backOut);
    });
    // The animations now hold the start states, so the CSS guard can go (no flash in between: same frame).
    root.classList.remove('intro-pending');
    try { sessionStorage.setItem(INTRO_KEY, '1'); } catch { /* private mode */ }

    let done = false;
    const finish = () => anims.forEach((a) => { try { a.finish(); } catch { /* already gone */ } });
    INTERRUPT.forEach((e) => window.addEventListener(e, finish, { once: true, passive: true }));
    void Promise.all(anims.map((a) => a.finished)).then(
      () => { done = true; root.dataset.intro = 'played'; },
      () => { /* cancelled on unmount */ },
    );
    return () => {
      INTERRUPT.forEach((e) => window.removeEventListener(e, finish));
      if (!done) anims.forEach((a) => a.cancel());
    };
  }, []);
  return null;
}
