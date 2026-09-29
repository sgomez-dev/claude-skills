import { robotsTxt } from '@/lib/seo/robots';

// Prerendered at build time: a static file, no Worker work per request.
export const dynamic = 'force-static';

export function GET(): Response {
  return new Response(robotsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
