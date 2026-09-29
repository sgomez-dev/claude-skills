import fs from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { LOGO_TEXT } from '@/components/brand/Logo';
import { COLORS } from '@/lib/design/tokens';

export const OG_SIZE = { width: 1200, height: 630 };

const font = (f: string) => fs.readFile(path.join(process.cwd(), 'assets', 'og-fonts', f));

/** Avoid glyphs outside the latin subset (✦, arrows): satori would draw tofu. */
export async function renderCover({ kicker, lead, accent, body, accentColor, accentSize = 112 }: { kicker: string; lead: string; accent: string; body?: string; accentColor: string; accentSize?: number }) {
  const [display, serif, mono] = await Promise.all([font('bricolage-800.woff'), font('instrument-italic.woff'), font('jetbrains-700.woff')]);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: COLORS.night, color: COLORS.ink, padding: 64, fontFamily: 'Display' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `3px solid ${COLORS.ink}`, paddingBottom: 18, fontFamily: 'Mono', fontSize: 22, letterSpacing: 3, textTransform: 'uppercase' }}>
          <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Mono', fontSize: 30, letterSpacing: -1, textTransform: 'none' }}>
            <span style={{ color: COLORS.inkMuted }}>{LOGO_TEXT.slice(0, 1)}</span>
            <span>{LOGO_TEXT.slice(1)}</span>
            <div style={{ width: 16, height: 28, background: COLORS.acid, borderRadius: 3, marginLeft: 8 }} />
          </div>
          <span>{kicker}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', marginTop: 56, fontSize: Math.round(accentSize * 104 / 112), lineHeight: 0.92, letterSpacing: -4 }}>
          {lead ? <span style={{ marginRight: 24 }}>{lead}</span> : null}
          <span style={{ fontFamily: 'Serif', fontSize: accentSize, letterSpacing: -2, background: accentColor, color: COLORS.night, padding: '0 18px 8px', borderRadius: 20 }}>{accent}</span>
        </div>
        {body ? <div style={{ marginTop: 'auto', fontSize: 30, lineHeight: 1.3, color: COLORS.inkMuted, maxWidth: 980 }}>{body}</div> : null}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: 'Display', data: display, weight: 800, style: 'normal' },
        { name: 'Serif', data: serif, weight: 400, style: 'italic' },
        { name: 'Mono', data: mono, weight: 700, style: 'normal' },
      ],
    },
  );
}
