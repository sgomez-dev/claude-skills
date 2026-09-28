import { pickLanguage } from '@/lib/i18n/negotiate';

export const dynamic = 'force-dynamic';

export function GET(request: Request): Response {
  const lang = pickLanguage(request.headers.get('accept-language'));
  return new Response(null, {
    status: 307,
    headers: { Location: `/${lang}`, Vary: 'Accept-Language', 'Cache-Control': 'private, no-store' },
  });
}
