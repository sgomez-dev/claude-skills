import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import type { Pipeline } from './types';

export function listPipelineFiles(repoRoot: string): string[] {
  const base = path.join(repoRoot, 'pipelines');
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base)
    .filter((f) => f.endsWith('.yaml'))
    .sort()
    .map((f) => path.join(base, f));
}

interface RawStep {
  name?: unknown;
  skill?: unknown;
  description?: unknown;
}

export function parsePipeline(file: string): Pipeline {
  const doc = YAML.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;
  const steps = Array.isArray(doc.steps) ? (doc.steps as RawStep[]) : [];
  return {
    slug: path.basename(file, '.yaml'),
    name: String(doc.name ?? ''),
    description: String(doc.description ?? ''),
    trigger: String(doc.trigger ?? ''),
    steps: steps.map((s) => ({ name: String(s.name ?? ''), skill: String(s.skill ?? ''), description: String(s.description ?? '') })),
  };
}
