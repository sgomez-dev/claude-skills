/**
 * Giant outline section number that drifts with scroll. Pure CSS: a scroll-driven animation on the `--scrub`
 * view timeline, which the parent declares with `scrub-host`. It follows scroll and never hijacks it.
 * Browsers without scroll-driven animations show it static.
 */
export function ScrubNumber({ value }: { value: string }) {
  return (
    <span aria-hidden className="scrub-number pointer-events-none absolute -top-6 right-0 -z-10 select-none font-display text-[clamp(8rem,30vw,24rem)] font-extrabold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgb(244_238_228/0.16)]">
      {value}
    </span>
  );
}
