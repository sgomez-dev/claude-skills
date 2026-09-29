import { gzipSync } from 'node:zlib';
import { expect, test } from '@playwright/test';

const introState = (page: import('@playwright/test').Page) => page.evaluate(() => document.documentElement.dataset.intro);

test('intro plays once per session and never hides the claim text', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('h1')).toContainText('Nobody knows');
  await expect.poll(() => introState(page), { timeout: 5000 }).toBe('played');
  await expect(page.locator('html')).not.toHaveClass(/intro-pending/);
  await page.reload();
  await expect.poll(() => introState(page)).toBe('skipped');
});

test('reduced motion: no intro, no letter rise, static marquee', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/en');
  await expect.poll(() => introState(page)).toBe('skipped');
  await expect(page.locator('html')).not.toHaveClass(/intro-pending/);
  expect(await page.locator('.marquee-track').first().evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await page.goto('/en/video');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toHaveAccessibleName(/.+/);
  // The letters are still split on the server, but none of them rises and the heading itself never animates.
  const names = await h1.locator('.kc').evaluateAll((els) => els.map((el) => getComputedStyle(el).animationName));
  expect(names.length).toBeGreaterThan(0);
  expect(new Set(names)).toEqual(new Set(['none']));
  expect(await h1.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await ctx.close();
});

test('kinetic headline: letters split on the server, full accessible name', async ({ page, request }) => {
  const html = await (await request.get('/es/business')).text();
  const h1Html = html.match(/<h1[^>]*data-kinetic[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '';
  expect(h1Html).toContain('class="kc"'); // split markup is in the server HTML, not added after hydration
  expect(h1Html).toMatch(/<span aria-hidden="true">/);
  await page.goto('/es/business');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveAccessibleName(/Negocio\s+en\s+orden/);
  expect(await h1.locator('.kc').first().evaluate((el) => getComputedStyle(el).animationName)).toBe('kc-rise');
});

test('navigating from a card starts a view transition', async ({ page }) => {
  await page.goto('/en/business');
  await page.evaluate(() => {
    const w = window as unknown as { __vt: number };
    w.__vt = 0;
    const original = document.startViewTransition?.bind(document);
    if (original) {
      document.startViewTransition = ((arg: Parameters<typeof original>[0]) => {
        w.__vt += 1;
        return original(arg);
      }) as typeof document.startViewTransition;
    }
  });
  await page.locator('main a[href^="/en/s/"]').first().click();
  await expect(page).toHaveURL(/\/en\/s\//);
  expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBeGreaterThan(0);
});

test('copy shows a short burst', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/en/s/legal--contract-review');
  await page.getByRole('tabpanel').getByRole('button', { name: 'Copy' }).click();
  await expect(page.locator('.burst')).toHaveCount(1);
  await expect(page.locator('.burst')).toHaveCount(0, { timeout: 2000 });
});

test('JS stays within budget with the motion layer loaded', async ({ page, request }) => {
  for (const path of ['/en', '/en/video']) {
    const urls = new Set<string>();
    const onResponse = (r: import('@playwright/test').Response) => {
      if (r.request().resourceType() === 'script') urls.add(r.url());
    };
    page.on('response', onResponse);
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    page.off('response', onResponse);
    let total = 0;
    for (const u of urls) total += gzipSync(await (await request.get(u)).body()).length;
    expect(total, `${path} gzip JS bytes`).toBeLessThanOrEqual(150 * 1024);
  }
});

test('kinetic headline is painted before hydration (LCP never waits for React)', async ({ page }) => {
  // Hold every JS chunk (not CSS: a pending stylesheet would block the parser), so anything visible is server HTML + CSS.
  await page.route('**/_next/static/chunks/*.js', async (route) => {
    await new Promise((r) => setTimeout(r, 4000));
    await route.continue();
  });
  await page.goto('/es/business', { waitUntil: 'domcontentloaded' });
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible({ timeout: 1000 });
  const state = await h1.evaluate((el) => {
    const hydrated = Object.keys(el).some((k) => k.startsWith('__reactProps'));
    const letters = [...el.querySelectorAll<HTMLElement>('.kc')];
    const hidden = [el, ...letters].some((n) => { const cs = getComputedStyle(n); return cs.visibility !== 'visible' || cs.opacity !== '1'; });
    return { hydrated, letters: letters.length, hidden };
  });
  expect(state).toEqual({ hydrated: false, letters: expect.any(Number), hidden: false });
  expect(state.letters).toBeGreaterThan(0);
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});
