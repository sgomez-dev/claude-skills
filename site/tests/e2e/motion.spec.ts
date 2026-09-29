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

test('reduced motion: no intro, no split text, static marquee', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/en');
  await expect.poll(() => introState(page)).toBe('skipped');
  await expect(page.locator('html')).not.toHaveClass(/intro-pending/);
  expect(await page.locator('.marquee-track').first().evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
  await page.goto('/en/video');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible();
  expect(await h1.locator('div, span[style]').count()).toBe(0); // SplitText never ran
  await ctx.close();
});

test('kinetic headline stays accessible and becomes visible', async ({ page }) => {
  await page.goto('/es/business');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible({ timeout: 3000 });
  await expect(h1).toHaveAttribute('data-split'); // letters were split for the stagger…
  await expect(h1).toHaveAccessibleName(/Negocio\s+en\s+orden/); // …and the full name survives it
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
    expect(total, `${path} gzip JS bytes`).toBeLessThanOrEqual(165 * 1024);
  }
});
