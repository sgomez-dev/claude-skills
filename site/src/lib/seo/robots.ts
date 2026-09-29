import { SITE_URL } from '@/lib/site';

/**
 * Crawlers that fetch pages for AI answers, search or training. `*` already allows them; naming them documents the intent
 * (and is what some agents look for). Whether Cloudflare lets them through is a zone setting, not something this file decides.
 */
export const AI_CRAWLERS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'CCBot', 'Meta-ExternalAgent', 'Amazonbot', 'DuckAssistBot', 'MistralAI-User', 'Bingbot',
] as const;

/** contentsignals.org: the owner's decision is search and AI answers yes, training yes. */
export const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes';

/**
 * `MetadataRoute.Robots` cannot express `Content-Signal`, so robots.txt is written by hand. The signal is repeated in
 * every group: a crawler obeys only the most specific group that names it and would never see it in `*`.
 * There is no `Host:` line (a Yandex-only directive).
 */
export function robotsTxt(): string {
  const group = (agents: readonly string[]) => [...agents.map((a) => `User-Agent: ${a}`), 'Allow: /', `Content-Signal: ${CONTENT_SIGNAL}`, ''];
  return [...group(['*']), ...group(AI_CRAWLERS), `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n');
}
