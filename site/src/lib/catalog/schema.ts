import { z } from 'zod';
import { SECTION_IDS } from './types';

const slug = z.string().regex(/^[a-z0-9]+(?:--?[a-z0-9]+)*$/);
const skillText = z.object({
  description: z.string().min(1),
  howToAsk: z.array(z.string()),
  translated: z.boolean(),
  title: z.string().min(1).optional(),
  summary: z.string().min(1).optional(),
  useWhen: z.array(z.string().min(1)).optional(),
  notFor: z.array(z.string().min(1)).optional(),
  output: z.string().min(1).optional(),
  faq: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).optional(),
});
const base = {
  slug,
  name: z.string().min(1),
  description: z.string().min(1),
  section: z.enum(SECTION_IDS),
  sourcePath: z.string().min(1),
  updatedAt: z.string().nullable(),
  text: z.object({ es: skillText, en: skillText }),
};

const command = z.object({
  ...base,
  kind: z.literal('command'),
  category: z.string().min(1),
  bundle: z.string().nullable(),
  permissions: z.object({
    reads: z.array(z.string()), writes: z.array(z.string()), commands: z.array(z.string()),
    network: z.boolean(), destructive: z.boolean(),
  }),
});

const external = z.object({
  ...base,
  kind: z.literal('external'),
  license: z.string().min(1),
  upstream: z.object({ url: z.url(), owner: z.string().min(1), repo: z.string().min(1), commit: z.string().min(1), path: z.string().min(1) }),
});

export const CatalogSchema = z.object({
  generatedAt: z.string(),
  counts: z.object({ commands: z.number().int(), external: z.number().int(), total: z.number().int() }),
  skills: z.array(z.discriminatedUnion('kind', [command, external])),
  pipelines: z.array(
    z.object({
      slug: z.string(), name: z.string(), description: z.string(), trigger: z.string(),
      steps: z.array(z.object({ name: z.string(), skill: z.string(), description: z.string() })),
    }),
  ),
});
