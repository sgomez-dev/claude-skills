import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { detectLicense } from '@/lib/catalog/license';
import { listCommandFiles, parseCommand } from '@/lib/catalog/parse-command';
import { listExternalDirs, parseExternal } from '@/lib/catalog/parse-external';
import { listPipelineFiles, parsePipeline } from '@/lib/catalog/parse-pipeline';
import { cleanDescription, toPosix } from '@/lib/catalog/clean';

const FIX = path.resolve(import.meta.dirname, '../../fixtures/repo');

describe('parseCommand', () => {
  it('reads description, permissions and the invocation slug', () => {
    const c = parseCommand(path.join(FIX, 'skills/legal/contract-review.md'), FIX);
    expect(c).toEqual({
      kind: 'command',
      slug: 'legal--contract-review',
      name: 'contract-review',
      category: 'legal',
      description: 'Review a contract draft - flag risky clauses',
      sourcePath: 'skills/legal/contract-review.md',
      permissions: { reads: ['**/*.md'], writes: ['legal/**'], commands: [], network: false, destructive: false },
    });
  });

  it('throws when description is missing', () => {
    expect(() => parseCommand(path.join(FIX, 'broken/no-description.md'), FIX)).toThrow(/missing description/);
  });

  it('lists only .md files under skills/<category>/', () => {
    expect(listCommandFiles(FIX).map((f) => path.basename(f))).toEqual(['contract-review.md', 'ffmpeg.md']);
  });
});

describe('parseExternal', () => {
  it('reads SKILL.md, UPSTREAM.md and LICENSE', () => {
    const e = parseExternal(path.join(FIX, 'external/ffmpeg'), FIX);
    expect(e).toEqual({
      kind: 'external',
      slug: 'ffmpeg',
      name: 'ffmpeg',
      description: 'FFmpeg recipes for video production.',
      sourcePath: 'external/ffmpeg',
      license: 'MIT',
      upstream: {
        url: 'https://github.com/digitalsamba/claude-code-video-toolkit',
        owner: 'digitalsamba',
        repo: 'digitalsamba/claude-code-video-toolkit',
        commit: 'abc1234def',
        path: '.claude/skills/ffmpeg',
      },
      commitDate: '2026-09-21T15:46:43+02:00',
    });
  });

  it('collapses folded YAML descriptions and tolerates a missing commit date', () => {
    const e = parseExternal(path.join(FIX, 'external/multi'), FIX);
    expect(e.description).toBe('Line one continues here. Second sentence.');
    expect(e.license).toBe('Apache-2.0');
    expect(e.commitDate).toBeNull();
  });

  it('skips dot-directories and directories without SKILL.md', () => {
    expect(listExternalDirs(FIX).map((d) => path.basename(d))).toEqual(['ffmpeg', 'multi']);
  });

  it('throws when LICENSE is missing', () => {
    expect(() => parseExternal(path.join(FIX, 'broken/external-no-license'), FIX)).toThrow(/missing LICENSE/);
  });
});

describe('parsePipeline', () => {
  it('reads name, trigger and steps', () => {
    const [file] = listPipelineFiles(FIX);
    const p = parsePipeline(file!);
    expect(p.slug).toBe('code-cleanup');
    expect(p.trigger).toBe('/pipeline--code-cleanup');
    expect(p.steps.map((s) => s.skill)).toEqual(['code-quality--dead-code', 'code-quality--dry']);
  });
});

describe('detectLicense', () => {
  it.each([
    ['Permission is hereby granted, free of charge, to any person', 'MIT'],
    ['Apache License\n Version 2.0, January 2004', 'Apache-2.0'],
    ['Creative Commons Attribution 4.0 International', 'CC-BY-4.0'],
    ['Some bespoke terms', 'LicenseRef-see-file'],
  ])('%s → %s', (text, spdx) => expect(detectLicense(text)).toBe(spdx));
});

describe('clean helpers', () => {
  it('normalises paths and whitespace', () => {
    expect(toPosix('skills\\legal\\a.md')).toBe('skills/legal/a.md');
    expect(cleanDescription('  a\n  b\t c ')).toBe('a b c');
    expect(cleanDescription(undefined)).toBe('');
  });
});
