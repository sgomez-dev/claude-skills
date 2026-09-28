import type { Accent } from '@/content/sections';

export const COLORS = {
  night: '#0d0d0f',
  ink: '#f4eee4',
  inkMuted: '#b9b2a8',
  acid: '#c6ff3d',
  pink: '#ff5ea8',
  cyan: '#2af5ff',
  sun: '#ffd23d',
  terra: '#d97757',
} as const;

export const ACCENT_BG: Record<Accent, string> = { acid: 'bg-acid', pink: 'bg-pink', cyan: 'bg-cyan', sun: 'bg-sun', terra: 'bg-terra' };
export const ACCENT_TEXT: Record<Accent, string> = { acid: 'text-acid', pink: 'text-pink', cyan: 'text-cyan', sun: 'text-sun', terra: 'text-terra' };
