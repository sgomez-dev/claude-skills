import Link from 'next/link';
import { getSkill } from '@/lib/catalog';
import type { Lang } from '@/lib/i18n/languages';
import { parseIntro } from '@/lib/intro';
import { paths } from '@/lib/urls';

/**
 * The editorial text of a section: paragraphs with `[text](skill-slug)` links, rendered as internal links.
 * Only real skills become links (anything else stays plain text), and nothing else in the text is interpreted.
 */
export function SectionIntro({ lang, paragraphs, label }: { lang: Lang; paragraphs: string[]; label: string }) {
  return (
    <section aria-label={label} className="mt-8 max-w-3xl space-y-4 text-[17px] leading-relaxed">
      {paragraphs.map((para, i) => (
        <p key={i}>
          {parseIntro(para).map((part, j) =>
            part.kind === 'link' && getSkill(part.slug) ? (
              <Link key={j} prefetch={false} href={paths.skill(lang, part.slug)} className="font-bold text-ink underline decoration-acid underline-offset-4 hover:text-acid">{part.text}</Link>
            ) : (
              <span key={j}>{part.text}</span>
            ),
          )}
        </p>
      ))}
    </section>
  );
}
