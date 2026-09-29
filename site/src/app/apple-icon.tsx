import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const dynamic = 'force-static';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0d0d0f' }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <polygon points="26,12 36,12 22,52 12,52" fill="#f4eee4" />
          <rect x="38" y="30" width="14" height="22" rx="2" fill="#c6ff3d" />
        </svg>
      </div>
    ),
    size,
  );
}
