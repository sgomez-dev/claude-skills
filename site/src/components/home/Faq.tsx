export function Faq({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  return (
    <section aria-labelledby="faq" className="mx-auto mt-20 max-w-3xl px-4 sm:px-7">
      <h2 id="faq" className="mb-6 font-display text-4xl font-extrabold tracking-[-0.03em]">{title}</h2>
      <div className="divide-y divide-line border-y border-line">
        {items.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-extrabold">
              {f.q}
              <span aria-hidden className="font-mono text-acid transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 leading-relaxed text-ink-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
