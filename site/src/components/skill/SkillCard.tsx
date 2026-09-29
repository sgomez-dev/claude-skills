import Link from 'next/link';
import type { Accent } from '@/content/sections';
import { ACCENT_TEXT } from '@/lib/design/tokens';

export interface SkillCardProps {
  href: string;
  slug: string;
  description: string;
  descLang?: string;
  badge: string;
  accent: Accent;
  network?: boolean;
  networkLabel?: string;
}

// Every <Link> in the site passes prefetch={false}: on OpenNext for Cloudflare the segment prefetch (`Next-Router-Segment-Prefetch: /_tree`)
// is answered with the full RSC payload, the client rejects it and re-issues it in an endless loop (hundreds of requests per second).
export function SkillCard({ href, slug, description, descLang, badge, accent, network, networkLabel }: SkillCardProps) {
  return (
    <Link prefetch={false} href={href} className="group flex h-full flex-col gap-3 border-b border-r border-line p-5 transition-colors hover:bg-ink/[0.04] focus-visible:bg-ink/[0.06]">
      <span className={`font-mono text-[13px] font-bold break-all ${ACCENT_TEXT[accent]}`}>/{slug}</span>
      <p lang={descLang} className="line-clamp-3 text-[14px] leading-snug text-ink-muted group-hover:text-ink">{description}</p>
      <span className="mt-auto flex flex-wrap gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-ink-muted">
        <span className="rounded-full border border-line px-2 py-0.5">{badge}</span>
        {network ? <span className="rounded-full border border-line px-2 py-0.5">{networkLabel}</span> : null}
      </span>
    </Link>
  );
}
