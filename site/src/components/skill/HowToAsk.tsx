import { CopyButton } from '@/components/ui/CopyButton';

export function HowToAsk({ items, copy, copied }: { items: string[]; copy: string; copied: string }) {
  return (
    <ul className="space-y-2">
      {items.map((p) => (
        <li key={p} className="flex items-start gap-3 rounded-xl border border-line p-3">
          <code className="min-w-0 flex-1 font-mono text-[13px] leading-relaxed break-words">{p}</code>
          <CopyButton text={p} label={copy} copiedLabel={copied} />
        </li>
      ))}
    </ul>
  );
}
