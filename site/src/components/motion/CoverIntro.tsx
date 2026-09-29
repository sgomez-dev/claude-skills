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
    q('highlight-bg').forEach((el) => play(el, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 700, 450));
    // The highlighted words: a hard ink|night gradient (200 % wide, clipped to the text) whose edge tracks the bar's edge.
    // Same delay, duration and ease as the bar, and both move linearly in eased progress, so they stay in lockstep.
    // The bar spans the host's padding box; the text starts `pad` in, so the edge runs from -pad to W + pad in text coordinates.
    q('highlight-text').forEach((el) => {
      const host = el.parentElement;
      if (!host) return;
      const pad = parseFloat(getComputedStyle(host).paddingLeft) || 0;
      el.dataset.sweep = '';
      // Text width without the paint-area padding that [data-sweep] adds (margin cancels it in layout).
      const w = el.offsetWidth - (parseFloat(getComputedStyle(el).paddingRight) || 0);
      const a = el.animate([{ backgroundPosition: `${-pad - w}px 0` }, { backgroundPosition: `${pad}px 0` }], { delay: 700, duration: 450, easing: CSS_EASE.power3Out, fill: 'backwards' });
      anims.push(a);
      const end = () => { delete el.dataset.sweep; };
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
