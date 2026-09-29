import { Fragment, type CSSProperties } from 'react';

/** Words as masks, chars as risers. `start` is the running char index, so the stagger flows across lead and accent. */
function Split({ text, start }: { text: string; start: number }) {
  let i = start;
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          {wi > 0 ? ' ' : null}
          <span className="kw">
            {Array.from(w).map((ch, ci) => <span key={ci} className="kc" style={{ '--i': i++ } as CSSProperties}>{ch}</span>)}
          </span>
        </Fragment>
      ))}
    </>
  );
}

/**
 * Section headline whose letters rise in a stagger. Server-rendered and pure CSS: it is the LCP element of every
 * section page, so it never waits for hydration and is painted from the first frame (see `.kc` in globals.css).
 * The letters are decoration (aria-hidden); the accessible name comes from a visually hidden full-text copy.
 */
export function KineticHeadline({ lead, accent, className = '', accentClassName = '' }: { lead: string; accent: string; className?: string; accentClassName?: string }) {
  const leadChars = Array.from(lead.replace(/\s+/g, '')).length;
  return (
    <h1 data-kinetic className={className}>
      <span className="sr-only">{lead} {accent}</span>
      <span aria-hidden>
        <Split text={lead} start={0} /> <em className={accentClassName}><Split text={accent} start={leadChars} /></em>
      </span>
    </h1>
  );
}
