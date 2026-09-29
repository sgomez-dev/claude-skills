import { expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test('every internal link from home and sections resolves', async ({ page, request }, info) => {
  test.skip(info.project.name !== 'desktop', 'run once');
  test.setTimeout(600_000);
  const seen = new Set<string>();
  const queue = ['/en', '/es'];
  for (const root of [...queue]) {
    await page.goto(root);
    for (const href of await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!))) {
      if (!seen.has(href)) { seen.add(href); queue.push(href); }
    }
  }
  const sections = [...seen].filter((h) => /^\/(es|en)\/[a-z]+$/.test(h) && !h.endsWith('/credits'));
  for (const s of sections) {
    await page.goto(s);
    for (const href of await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute('href')!))) seen.add(href);
  }
  const broken: string[] = [];
  for (const href of seen) {
    const res = await request.get(href, { maxRedirects: 0 });
    if (res.status() >= 400) broken.push(`${res.status()} ${href}`);
  }
  expect(broken).toEqual([]);
});
