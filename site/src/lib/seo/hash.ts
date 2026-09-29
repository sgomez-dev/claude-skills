/** FNV-1a, 32 bits, in base 36: a short, stable cache-busting token. Not for security (and free of node:crypto, so pages can import it). */
export function contentHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}
