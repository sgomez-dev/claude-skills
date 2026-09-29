'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Lang } from '@/lib/i18n/languages';
import type { SearchEntry } from '@/lib/search/index';
import { OPEN_SEARCH_EVENT } from './SearchTrigger';

interface Labels {
  placeholder: string;
  noResults: string;
  hint: string;
  close: string;
  results: string;
  loading: string;
  error: string;
}

type Searcher = (q: string) => SearchEntry[];

export function SearchDialog({ lang, labels }: { lang: Lang; labels: Labels }) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const id = useId();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // Held in state so results recompute the moment the index finishes loading.
  const [searcher, setSearcher] = useState<Searcher | null>(null);

  const fetchPromiseRef = useRef<Promise<void> | null>(null);
  const searcherRef = useRef<Searcher | null>(null);
  const langRef = useRef(lang);
  langRef.current = lang;
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => (searcher ? searcher(query) : []), [searcher, query]);

  const ensureSearcher = () => {
    if (searcherRef.current || fetchPromiseRef.current) return;
    setLoading(true);
    setError(false);
    fetchPromiseRef.current = (async () => {
      try {
        const [{ createSearcher }, entries] = await Promise.all([
          import('@/lib/search/searcher'),
          fetch(`/search/${langRef.current}.json`).then((r) => {
            if (!r.ok) throw new Error(`Failed to load search index: ${r.status}`);
            return r.json() as Promise<SearchEntry[]>;
          }),
        ]);
        const fn = createSearcher(entries);
        searcherRef.current = fn;
        setSearcher(() => fn);
      } catch (err) {
        console.error('Search initialization failed:', err);
        setError(true);
        // Clear the in-flight ref so the next open retries.
        fetchPromiseRef.current = null;
      } finally {
        setLoading(false);
      }
    })();
  };

  const open = (initial = '') => {
    if (ref.current?.open) {
      inputRef.current?.focus();
    } else {
      ref.current?.showModal();
      setQuery(initial);
      setActive(0);
      ensureSearcher();
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        open();
      }
    };
    const onOpen = () => open();
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpen);

    // Read ?q only once on mount
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) open(q);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpen);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Arrow navigation moves aria-activedescendant, not focus, so the list does not scroll by itself.
  useEffect(() => {
    document.getElementById(`${id}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, id]);

  function go(entry: SearchEntry | undefined) {
    if (!entry) return;
    ref.current?.close();
    router.push(entry.h);
  }

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(0, results.length - 1)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    }
  }

  const noResults = !!searcher && query.trim() !== '' && results.length === 0;
  const message = error ? labels.error : loading ? labels.loading : noResults ? labels.noResults : null;

  return (
    <dialog ref={ref} aria-label={labels.results} onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto mt-[10vh] w-[min(640px,calc(100vw-2rem))] rounded-2xl border border-line bg-night p-0 text-ink backdrop:bg-black/70">
      <div className="flex items-center gap-3 border-b border-line p-4">
        <input
          ref={inputRef}
          autoFocus
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={results.length > 0}
          aria-controls={`${id}-list`}
          aria-activedescendant={results[active] ? `${id}-opt-${active}` : undefined}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          onKeyDown={onInputKey}
          placeholder={labels.placeholder}
          className="min-w-0 flex-1 bg-transparent font-display text-[18px] outline-none placeholder:text-ink-muted"
        />
        <button type="button" onClick={() => ref.current?.close()} className="font-mono text-[11px] font-bold uppercase text-ink-muted hover:text-ink">{labels.close}</button>
      </div>
      <div role="status" aria-live="polite" className="p-4 text-center text-ink-muted empty:hidden">
        {message}
      </div>
      <ul id={`${id}-list`} role="listbox" className="max-h-[55vh] overflow-y-auto p-2">
        {results.map((r, i) => (
          <li key={r.s} id={`${id}-opt-${i}`} role="option" aria-selected={i === active}
            onMouseEnter={() => setActive(i)} onClick={() => go(r)}
            className={`cursor-pointer rounded-xl p-3 ${i === active ? 'bg-ink/[0.08]' : ''}`}>
            <span className="font-mono text-[13px] font-bold text-acid">/{r.s}</span>
            <span className="ml-2 font-mono text-[10px] uppercase text-ink-muted">{r.n}</span>
            <span className="mt-1 block text-[14px] text-ink-muted">{r.d}</span>
          </li>
        ))}
      </ul>
      <p className="border-t border-line p-3 font-mono text-[10px] uppercase text-ink-muted">{labels.hint}</p>
    </dialog>
  );
}
