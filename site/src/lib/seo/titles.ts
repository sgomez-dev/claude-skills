/** Google shows about 60 characters of a title; past that it cuts, so the slug suffix is the first thing to go. */
export const TITLE_BUDGET = 60;

/**
 * `<title>` of a skill page: "{title}: {suffix} (/{slug})", dropping "(/{slug})" when that passes the budget.
 * A skill with no authored title yet is named by its slug.
 */
export function skillPageTitle(suffix: string, title: string | null, slug: string): string {
  if (!title) return `/${slug}: ${suffix}`;
  const full = `${title}: ${suffix} (/${slug})`;
  return full.length <= TITLE_BUDGET ? full : `${title}: ${suffix}`;
}
