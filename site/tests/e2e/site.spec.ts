import { expect, test } from '@playwright/test';

test('root redirects by Accept-Language', async ({ request }) => {
  const es = await request.get('/', { headers: { 'Accept-Language': 'es-MX,es;q=0.9' }, maxRedirects: 0 });
  expect(es.status()).toBe(307);
  expect(es.headers().location).toBe('/es');
  const en = await request.get('/', { headers: { 'Accept-Language': 'de-DE' }, maxRedirects: 0 });
  expect(en.headers().location).toBe('/en');
});

test('home renders the claim, nine sections and valid JSON-LD', async ({ page }) => {
  await page.goto('/es');
  await expect(page.locator('h1')).toContainText('Nadie lo sabe');
  await expect(page.locator('#index ~ ul > li')).toHaveCount(9);
  for (const raw of await page.locator('script[type="application/ld+json"]').allTextContents()) expect(() => JSON.parse(raw)).not.toThrow();
});

test('language switch keeps the page', async ({ page }) => {
  await page.goto('/es/s/legal--contract-review');
  await page.getByRole('group', { name: 'Idioma' }).getByRole('link', { name: 'en' }).click();
  await expect(page).toHaveURL(/\/en\/s\/legal--contract-review$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('skill page shows install, permissions and a working copy button', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/en/s/legal--contract-review');
  await expect(page.locator('h1')).toHaveText('/legal--contract-review');
  await expect(page.getByRole('heading', { name: 'What it can touch' })).toBeVisible();
  // Retry the click: before hydration the button exists but has no handler yet.
  await expect(async () => {
    await page.getByRole('tabpanel').getByRole('button', { name: 'Copy' }).click({ timeout: 2_000 });
    await expect(page.getByRole('tabpanel').getByText('Copied')).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
});

test('search finds a skill by an accentless Spanish word', async ({ page }) => {
  await page.goto('/es');
  // Retry the shortcut: before hydration the Ctrl+K listener is not attached yet.
  await expect(async () => {
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('combobox')).toBeVisible({ timeout: 1_000 });
  }).toPass({ timeout: 15_000 });
  await page.getByRole('combobox').fill('contrato');
  await expect(page.getByRole('option').first()).toContainText('legal--contract-review');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/es\/s\/legal--contract-review$/);
});

test('section filters narrow the grid', async ({ page }) => {
  await page.goto('/en/web');
  const cards = page.locator('main ul li a[href^="/en/s/"]');
  const total = await cards.count();
  // Retry the click: before hydration the filter button has no handler yet.
  await expect(async () => {
    await page.getByRole('button', { name: 'Community' }).click();
    expect(await cards.count()).toBeLessThan(total);
  }).toPass({ timeout: 15_000 });
});

test('the first filter change applies at once, before the lazy motion chunk arrives', async ({ page }) => {
  // Every chunk requested after hydration (i.e. the lazy `motion` one) is held for 5 s.
  let slow = false;
  await page.route('**/_next/static/chunks/*.js', async (route) => {
    if (slow) await new Promise((r) => setTimeout(r, 5000));
    await route.continue();
  });
  await page.goto('/en/web');
  const cards = page.locator('main ul li a[href^="/en/s/"]');
  const total = await cards.count();
  const community = page.getByRole('button', { name: 'Community' });
  await page.waitForFunction(() => {
    const el = document.querySelector('main [aria-pressed]');
    return !!el && Object.keys(el).some((k) => k.startsWith('__reactProps'));
  });
  slow = true;
  await expect(community).toHaveAttribute('aria-pressed', 'false');
  await community.click();
  await expect(community).toHaveAttribute('aria-pressed', 'true', { timeout: 1000 });
  await expect.poll(() => cards.count(), { timeout: 1000 }).toBeLessThan(total);
  await page.unrouteAll({ behavior: 'ignoreErrors' });
});

test('reduced motion: ticker is not animated', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/en');
  const name = await page.locator('.ticker-track').evaluate((el) => getComputedStyle(el).animationName);
  expect(name).toBe('none');
  await ctx.close();
});

test('markdown twin and llms.txt are served', async ({ request }) => {
  const md = await request.get('/es/s/legal--contract-review.md');
  expect(md.status()).toBe(200);
  expect(await md.text()).toMatch(/^# Revisión de contratos \(\/legal--contract-review\)\n/);
  expect((await request.get('/llms.txt')).status()).toBe(200);
});

test('humans.txt credits the author', async ({ request }) => {
  const res = await request.get('/humans.txt');
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain('Santiago Gómez de la Torre');
});

test('og:image resolves to a PNG', async ({ page, request }) => {
  await page.goto('/en/s/legal--contract-review');
  const src = await page.locator('meta[property="og:image"]').getAttribute('content');
  const res = await request.get(src!.replace('https://skills.sgomez.dev', ''));
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
});

test('no horizontal scroll on the longest skill page', async ({ page, request }) => {
  const index = (await (await request.get('/search/en.json')).json()) as { s: string; d: string }[];
  const longest = index.reduce((a, b) => (b.s.length + b.d.length > a.s.length + a.d.length ? b : a));
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto(`/en/s/${longest.s}`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
