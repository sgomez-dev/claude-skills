export const DURATION = { fast: 0.12, base: 0.2, slow: 0.32, xslow: 0.6 } as const;
export const EASE_OUT = [0.2, 0.8, 0.2, 1] as const;

/** CSS equivalents of the GSAP eases named in the spec, for the Web Animations API. */
export const CSS_EASE = {
  /** GSAP power3.out */
  power3Out: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  /** GSAP back.out(2): about 10 % overshoot */
  backOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
