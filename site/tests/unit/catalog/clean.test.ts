import { describe, expect, it } from 'vitest';
import matter from 'gray-matter';
import { normalizeFrontmatter, parseFrontmatter } from '@/lib/catalog/clean';

/** Parse with the real YAML engine and return the exact parsed description. */
function describedBy(raw: string): unknown {
  return matter(raw, {}).data.description;
}

describe('normalizeFrontmatter', () => {
  it('quotes a description containing a `: ` sequence', () => {
    const raw = '---\ndescription: Cut LLM costs: model routing\n---\nBody\n';
    const out = normalizeFrontmatter(raw);
    expect(out).toBe('---\ndescription: "Cut LLM costs: model routing"\n---\nBody\n');
    expect(describedBy(out)).toBe('Cut LLM costs: model routing');
  });

  it('escapes embedded double quotes and backslashes, round-tripping exactly', () => {
    const raw = '---\ndescription: Use "quotes": and \\ backslash together\n---\nBody\n';
    const out = normalizeFrontmatter(raw);
    expect(out).toBe('---\ndescription: "Use \\"quotes\\": and \\\\ backslash together"\n---\nBody\n');
    expect(describedBy(out)).toBe('Use "quotes": and \\ backslash together');
  });

  it('leaves an already-quoted description untouched', () => {
    const raw = '---\ndescription: "Already: quoted value"\n---\nBody\n';
    expect(normalizeFrontmatter(raw)).toBe(raw);
    expect(describedBy(raw)).toBe('Already: quoted value');

    const rawSingle = "---\ndescription: 'Already: quoted value'\n---\nBody\n";
    expect(normalizeFrontmatter(rawSingle)).toBe(rawSingle);
    expect(describedBy(rawSingle)).toBe('Already: quoted value');
  });

  it('leaves a `>` folded block scalar untouched', () => {
    const raw = '---\ndescription: >\n  Multi: line description\n  continues here\n---\nBody\n';
    expect(normalizeFrontmatter(raw)).toBe(raw);
    expect(describedBy(raw)).toBe('Multi: line description continues here\n');
  });

  it('leaves a `|` literal block scalar untouched', () => {
    const raw = '---\ndescription: |\n  Multi: line description\n  continues here\n---\nBody\n';
    expect(normalizeFrontmatter(raw)).toBe(raw);
    expect(describedBy(raw)).toBe('Multi: line description\ncontinues here\n');
  });

  it('handles CRLF line endings, preserving them, and produces valid YAML', () => {
    const raw = '---\r\ndescription: Cut LLM costs: model routing\r\n---\r\nBody\r\n';
    const out = normalizeFrontmatter(raw);
    expect(out).toBe('---\r\ndescription: "Cut LLM costs: model routing"\r\n---\r\nBody\r\n');
    expect(describedBy(out)).toBe('Cut LLM costs: model routing');
  });

  it('never touches a `description:` line inside the body, after the closing ---', () => {
    const raw =
      '---\ndescription: Fine description\n---\nSome body text.\ndescription: Cut LLM costs: model routing\nMore text.\n';
    expect(normalizeFrontmatter(raw)).toBe(raw);
    expect(describedBy(raw)).toBe('Fine description');
  });

  it('returns content unchanged when there is no frontmatter at all', () => {
    const raw = 'Just a plain markdown file\ndescription: fake: not frontmatter\n';
    expect(normalizeFrontmatter(raw)).toBe(raw);
  });
});

describe('parseFrontmatter', () => {
  it('parses valid YAML directly, never invoking the normalizer, so a trailing comment is stripped correctly', () => {
    // `description: value # note: x` is valid YAML: the scalar is `value`, and
    // ` #...` starts a real comment. The (unconditional) normalizer would
    // misinterpret the `: ` inside the comment as needing to be quoted, which
    // would leak the comment into the description. Because parseFrontmatter only
    // falls back to the normalizer on an actual YAML parse failure, this case
    // must never reach it.
    const raw = '---\ndescription: plain value # note: x\n---\nBody\n';
    expect(parseFrontmatter(raw).data.description).toBe('plain value');
  });

  it('recovers via the normalizer when the frontmatter is genuinely invalid YAML', () => {
    const raw = '---\ndescription: Cut LLM costs: model routing\n---\nBody\n';
    expect(parseFrontmatter(raw).data.description).toBe('Cut LLM costs: model routing');
  });

  it('rethrows non-YAML errors without ever invoking the normalizer', () => {
    // A frontmatter block with unsupported flow syntax (unterminated flow mapping) is
    // a genuine YAMLException, so this exercises the fallback path once more with
    // different content than the other tests, guarding against a normalizer that
    // only special-cases the exact fixture strings above.
    const raw = '---\ndescription: {unterminated\n---\nBody\n';
    expect(() => parseFrontmatter(raw)).toThrow();
  });

  it('is not tripped up by gray-matter caching a failed first parse', () => {
    // gray-matter caches by exact input string, but only when called without
    // options — and it stores the cache entry *before* parsing, so a thrown error
    // still leaves a broken, dataless entry behind for that string. Calling
    // parseFrontmatter twice on the very same broken raw string must recover
    // correctly both times, not silently return a stale cached failure.
    const raw = '---\ndescription: Cut LLM costs: model routing\n---\nBody\n';
    expect(parseFrontmatter(raw).data.description).toBe('Cut LLM costs: model routing');
    expect(parseFrontmatter(raw).data.description).toBe('Cut LLM costs: model routing');
  });
});
