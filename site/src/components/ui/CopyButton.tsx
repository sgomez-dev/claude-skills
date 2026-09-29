'use client';
import { useEffect, useState, type CSSProperties } from 'react';

export function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);
  useEffect(() => {
    if (!burst) return;
    const t = setTimeout(() => setBurst(0), 700);
    return () => clearTimeout(t);
  }, [burst]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setBurst(Date.now());
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return (
    <button type="button" onClick={copy} className="relative shrink-0 rounded-full border border-line px-3 py-1 font-mono text-[11px] font-bold uppercase hover:border-acid hover:text-acid">
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
      {burst ? (
        <span key={burst} className="burst" aria-hidden>
          {Array.from({ length: 8 }, (_, i) => <i key={i} style={{ '--a': `${i * 45}deg` } as CSSProperties} />)}
        </span>
      ) : null}
    </button>
  );
}
