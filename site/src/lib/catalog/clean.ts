export function toPosix(p: string): string {
  return p.replace(/\\/g, '/');
}

export function cleanDescription(v: unknown): string {
  return typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : '';
}
