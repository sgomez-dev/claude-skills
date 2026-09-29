/**
 * Splits text at each `--` so the first hyphen of the pair can take extra spacing.
 * With the display font's negative tracking, `--` touches and reads as one long dash, but readers type these commands.
 * Returns the text between pairs: joining with '--' gives the input back.
 */
export function splitDoubleHyphens(text: string): string[] {
  return text.split('--');
}
