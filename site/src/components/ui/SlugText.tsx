import { Fragment } from 'react';
import { splitDoubleHyphens } from '@/lib/slug-text';

/**
 * Renders a slug (or text containing one) so `--` stays two visible hyphens in display fonts.
 * The spacing is CSS on a span, so copied text is unchanged. Pair it with the `slug-text` class on the parent.
 */
export function SlugText({ text }: { text: string }) {
  const parts = splitDoubleHyphens(text);
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 ? <><span className="dd">-</span>-</> : null}
          {p}
        </Fragment>
      ))}
    </>
  );
}
