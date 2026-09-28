import type { CSSProperties, ReactNode } from 'react';
import type { Accent } from '@/content/sections';
import { ACCENT_BG } from '@/lib/design/tokens';

export function Sticker({ children, color = 'acid', rotate = -3, className = '' }: { children: ReactNode; color?: Accent; rotate?: number; className?: string }) {
  return (
    <span
      className={`sticker inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-2 font-display text-[13px] font-extrabold text-night shadow-[0_5px_0_rgba(0,0,0,.35)] ${ACCENT_BG[color]} ${className}`}
      style={{ '--r': `${rotate}deg` } as CSSProperties}
    >
      {children}
    </span>
  );
}
