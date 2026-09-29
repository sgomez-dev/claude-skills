'use client';
import { useEffect, useState } from 'react';

export const OPEN_SEARCH_EVENT = 'open-search';

export function SearchTrigger({ label }: { label: string }) {
  const [mod, setMod] = useState('Ctrl');
  useEffect(() => {
    if (/Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)) setMod('⌘');
  }, []);
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SEARCH_EVENT))}
      className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line px-3 py-1.5 font-mono text-[11px] font-bold uppercase hover:border-acid hover:text-acid">
      {/* Icon-only below sm so the masthead fits at 375 px; the label stays as the accessible name. */}
      <svg aria-hidden viewBox="0 0 16 16" width="14" height="14" className="sm:hidden" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3.5 3.5" />
      </svg>
      <span className="sr-only sm:not-sr-only">{label}</span>
      <kbd className="hidden rounded border border-line px-1 text-[10px] sm:inline">{mod} K</kbd>
    </button>
  );
}
