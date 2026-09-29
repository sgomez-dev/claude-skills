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
      className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[11px] font-bold uppercase hover:border-acid hover:text-acid">
      <span>{label}</span>
      <kbd className="hidden rounded border border-line px-1 text-[10px] sm:inline">{mod} K</kbd>
    </button>
  );
}
