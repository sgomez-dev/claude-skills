import type { Figures as FiguresData } from '@/lib/catalog/figures';
import { isoDay } from '@/lib/catalog/dates';
import type { Dictionary } from '@/lib/i18n';

/** The catalog in numbers, with the date. Every figure is derived from the catalog, so it cannot drift from the data. */
export function Figures({ dict, figures }: { dict: Dictionary; figures: FiguresData }) {
  return (
    <section aria-label={dict.home.figures.label} className="mx-auto mt-4 max-w-[1440px] px-4 sm:px-7">
      <p className="font-mono text-[12px] leading-relaxed text-ink-muted">
        {dict.home.figures.line(figures)}
        {figures.updatedAt ? (
          <>
            {' · '}{dict.home.figures.updated} <time dateTime={isoDay(figures.updatedAt)}>{dict.date(new Date(figures.updatedAt))}</time>
          </>
        ) : null}
      </p>
    </section>
  );
}
