'use client';
import { useState } from 'react';

export function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }
  return (
    <button type="button" onClick={copy} className="shrink-0 rounded-full border border-line px-3 py-1 font-mono text-[11px] font-bold uppercase hover:border-acid hover:text-acid">
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
