'use client';
import { Fragment, useLayoutEffect, useState, type CSSProperties } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

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
 * Section headline whose letters rise in a stagger (CSS animation, no library).
 * Server and reduced-motion render plain text; the split happens before the first paint after hydration
 * (layout effect), so it is also in place when a view transition captures the new page.
 * The full text stays readable to assistive tech through a visually hidden copy.
 */
export function KineticHeadline({ lead, accent, className = '', accentClassName = '' }: { lead: string; accent: string; className?: string; accentClassName?: string }) {
  const [split, setSplit] = useState(false);
  useLayoutEffect(() => {
    if (!prefersReducedMotion()) setSplit(true);
  }, []);
  if (!split) {
    return (
      <h1 data-kinetic className={className}>
        {lead} <em className={accentClassName}>{accent}</em>
      </h1>
    );
  }
  const leadChars = Array.from(lead.replace(/\s+/g, '')).length;
  return (
    <h1 data-kinetic data-split className={className}>
      <span className="sr-only">{lead} {accent}</span>
      <span aria-hidden>
        <Split text={lead} start={0} /> <em className={accentClassName}><Split text={accent} start={leadChars} /></em>
      </span>
    </h1>
  );
}
