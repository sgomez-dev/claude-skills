export const LOGO_TEXT = '/claude-skills';

/** Logo C · "Comando vivo": the command you are about to type. Cursor blinks; static with reduced motion. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span aria-label="Claude Skills" role="img" className={`inline-flex items-center font-mono text-[19px] font-bold tracking-[-0.04em] ${className}`}>
      <span aria-hidden className="text-ink-muted">/</span>
      <span aria-hidden>claude-skills</span>
      <span aria-hidden className="logo-cursor" />
    </span>
  );
}
