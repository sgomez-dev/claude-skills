import { expect, test } from '@playwright/test';

test('skill page: title, description and og tags come from the skill, not the router text', async ({ page }) => {
  await page.goto('/en/s/legal--contract-review');
  const title = await page.title();
  expect(title).toMatch(/Claude Code skill/);
  expect(title.length).toBeLessThanOrEqual(60);
  expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toBe(title);
  expect(await page.locator('meta[property="og:image:alt"]').getAttribute('content')).toContain('Claude Code skill');
  const desc = (await page.locator('meta[name="description"]').getAttribute('content'))!;
  expect(desc.length).toBeLessThanOrEqual(160);
  await page.goto('/es/s/legal--contract-review');
  expect(await page.locator('meta[property="og:image:alt"]').getAttribute('content')).toContain('skill de Claude Code');
  await expect(page.locator('time[datetime]').first()).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
});

test('every page ships one JSON-LD @graph that parses, with the author linked to the profiles', async ({ page }) => {
  for (const path of ['/en', '/es/business', '/en/s/legal--contract-review', '/es/methodology', '/en/credits']) {
    await page.goto(path);
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(scripts, path).toHaveLength(1);
    const ld = JSON.parse(scripts[0]!) as { '@context': string; '@graph': { '@type': string; '@id'?: string; sameAs?: string[] }[] };
    expect(ld['@context']).toBe('https://schema.org');
    const person = ld['@graph'].find((n) => n['@type'] === 'Person')!;
    expect(person.sameAs, path).toContain('https://www.linkedin.com/in/sgomez-dev/');
    // Every @id is unique in the graph.
    const ids = ld['@graph'].flatMap((n) => (n['@id'] ? [n['@id']] : []));
    expect(new Set(ids).size, path).toBe(ids.length);
  }
});

test('the home h1 holds the highlighted words once (no duplicate text for crawlers)', async ({ page, request }) => {
  const html = await (await request.get('/en')).text();
  const h1 = (html.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? '').replace(/<[^>]+>/g, '');
  expect(h1.split('Your agent,').length - 1).toBe(1);
  await page.goto('/en');
  expect((await page.locator('h1').textContent())!.split('Your agent,').length - 1).toBe(1);
});

test('methodology exists in both languages, in the footer and on every skill page', async ({ page, request }) => {
  await page.goto('/es/methodology');
  await expect(page.locator('h1')).toContainText('Cómo elegimos y revisamos');
  await expect(page.locator('#main').getByRole('link', { name: 'Santiago Gómez de la Torre' })).toHaveAttribute('href', 'https://sgomez.dev');
  await page.goto('/en/methodology');
  await expect(page.locator('h1')).toContainText('How we choose and review');
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Methodology' })).toHaveAttribute('href', '/en/methodology');
  await page.goto('/en/s/short-form-edit');
  await expect(page.getByRole('link', { name: 'How we review this' })).toHaveAttribute('href', '/en/methodology');
  expect((await request.get('/en/methodology.md')).status()).toBe(200);
  expect((await request.get('/es/methodology.md')).status()).toBe(200);
});

test('text files are UTF-8 and every .md twin names its page as canonical', async ({ request }) => {
  for (const p of ['/llms.txt', '/es/llms.txt', '/llms-full.txt', '/es/llms-full.txt', '/humans.txt']) {
    const res = await request.get(p);
    expect(res.headers()['content-type'], p).toBe('text/plain; charset=utf-8');
  }
  const cases: [string, string][] = [
    ['/es/s/legal--contract-review.md', '/es/s/legal--contract-review'],
    ['/en/business.md', '/en/business'],
    ['/en/methodology.md', '/en/methodology'],
    ['/es.md', '/es'],
  ];
  for (const [p, canonical] of cases) {
    const res = await request.get(p);
    expect(res.headers()['content-type'], p).toBe('text/markdown; charset=utf-8');
    // In production the host is the site's own. On a local preview wrangler rewrites it to localhost, so only the page path is compared
    // here; the literal https://skills.sgomez.dev URL is asserted against public/_headers in the unit tests and on the deployed preview.
    expect(res.headers().link, p).toMatch(new RegExp(`^<https?://[^>/]+${canonical}>; rel="canonical"$`));
  }
  // The HTML pages carry no such header.
  expect((await request.get('/es/s/legal--contract-review')).headers().link).toBeUndefined();
});

test('robots.txt states the content signal and names the AI crawlers', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.headers()['content-type']).toContain('text/plain');
  const txt = await res.text();
  expect(txt).toContain('Content-Signal: search=yes, ai-input=yes, ai-train=yes');
  for (const bot of ['Meta-ExternalAgent', 'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'Bingbot', 'GPTBot']) expect(txt).toContain(`User-Agent: ${bot}`);
  expect(txt).not.toMatch(/^Host:/im);
  expect(txt).toContain('Sitemap: https://skills.sgomez.dev/sitemap.xml');
});

test('sitemap: content dates only, x-default present', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).toContain('hreflang="x-default"');
  expect(xml).toContain('/en/methodology');
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]!);
  expect(lastmods.length).toBeGreaterThan(900);
  // A build timestamp has millisecond precision and a Z; the skills' own dates are git and upstream commit dates.
  for (const d of lastmods) expect(d, 'lastmod looks like a build timestamp').not.toMatch(/\.\d{3}Z$/);
});

test('home states the catalog figures and the license breakdown, with a dated <time>', async ({ page }) => {
  await page.goto('/en');
  const figures = page.getByRole('region', { name: 'The catalog in numbers' });
  await expect(figures).toContainText('478 skills');
  await expect(figures).toContainText('327 built here (MIT)');
  await expect(figures).toContainText('134 MIT, 17 Apache-2.0');
  await expect(figures.locator('time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
  const html = await page.content();
  expect(html).not.toMatch(/MIT licensed|every permission/i);
});

test('every skill page has at least 3 inbound internal links from other pages of the site', async ({ request }, info) => {
  test.skip(info.project.name !== 'desktop', 'run once');
  test.setTimeout(300_000);
  const index = (await (await request.get('/search/en.json')).json()) as { s: string }[];
  const slugs = index.map((i) => i.s);
  const inbound = new Map(slugs.map((s) => [s, new Set<string>()]));
  const sections = ['video', 'web', 'brand', 'ads', 'sales', 'business', 'ai', 'data', 'code'];
  const pages = [...slugs.map((s) => `/en/s/${s}`), ...sections.map((s) => `/en/${s}`), '/en', '/en/credits'];
  for (let i = 0; i < pages.length; i += 12) {
    await Promise.all(pages.slice(i, i + 12).map(async (p) => {
      const html = await (await request.get(p)).text();
      for (const m of html.matchAll(/href="\/en\/s\/([^"#?]+)"/g)) {
        const target = m[1]!;
        if (`/en/s/${target}` !== p) inbound.get(target)?.add(p);
      }
    }));
  }
  const lowest = [...inbound].map(([s, from]) => [s, from.size] as const).sort((a, b) => a[1] - b[1]);
  console.log(`inbound internal links per skill page: min ${lowest[0]![1]} (${lowest[0]![0]}), max ${lowest.at(-1)![1]} (${lowest.at(-1)![0]}), ${slugs.length} skills`);
  expect(lowest[0]![1], lowest[0]![0]).toBeGreaterThanOrEqual(3);
});

// Stands in for Lighthouse's robots-txt audit, which lighthouserc skips (its parser rejects Content-Signal; @lhci/cli 0.15.1).
test('robots.txt is well-formed: only known fields, and the * group never disallows the site', async ({ request }) => {
  const res = await request.get('/robots.txt');
  expect(res.status()).toBe(200);
  const lines = (await res.text()).split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
  for (const l of lines) expect(l, l).toMatch(/^(User-Agent|Allow|Disallow|Sitemap|Content-Signal):/);
  const star = (await (await request.get('/robots.txt')).text()).split('\n\n').find((g) => g.includes('User-Agent: *'))!;
  expect(star).not.toMatch(/^Disallow: \/\s*$/m);
});

test('a command page shows its license in the aside, and the author description only when a summary is authored', async ({ page }) => {
  await page.goto('/en/s/legal--contract-review');
  await expect(page.locator('#perm').locator('..')).toContainText('License: MIT');
  await page.goto('/en/s/vercel-react-best-practices');
  await expect(page.locator('#perm').locator('..')).toContainText('License');
});
