// Preview access is narrower than the general administrator panel: only its owner.
export const PREVIEW_OWNER = '6d2887ea-5b84-4ee3-84d4-8a88a36da00c';
const APP_ORIGIN = 'https://fafg-rn.github.io';
type Config = { url: string; anonKey: string; html: string; fetcher?: typeof fetch };

export function createPreviewHandler(config: Config) {
  const fetcher = config.fetcher || fetch;
  return async (req: Request): Promise<Response> => {
    const origin = req.headers.get('Origin');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'private, no-store, max-age=0',
      'Vary': 'Origin',
      'X-Content-Type-Options': 'nosniff',
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
    if (origin === APP_ORIGIN) headers['Access-Control-Allow-Origin'] = APP_ORIGIN;
    const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
    if (origin && origin !== APP_ORIGIN) return reply(403, { error: 'Acceso no autorizado.' });
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (req.method !== 'POST') return reply(405, { error: 'Método no permitido.' });
    const authorization = req.headers.get('Authorization') || '';
    if (!/^Bearer\s+\S+$/i.test(authorization)) return reply(401, { error: 'Iniciá sesión en FAFG.' });
    if (!config.url || !config.anonKey) return reply(503, { error: 'Vista previa no disponible.' });
    // Use the caller's token and a public key only. No service-role credentials.
    const authHeaders = { Authorization: authorization, apikey: config.anonKey };
    try {
      const auth = await fetcher(config.url + '/auth/v1/user', { headers: authHeaders });
      if (!auth.ok) return reply(401, { error: 'Sesión no disponible.' });
      const user = await auth.json();
      if (user?.id !== PREVIEW_OWNER) return reply(403, { error: 'Vista previa restringida.' });
      const admin = await fetcher(config.url + '/rest/v1/rpc/is_fafg_admin', {
        method: 'POST', headers: { ...authHeaders, 'Content-Type': 'application/json' }, body: '{}',
      });
      if (!admin.ok) return reply(403, { error: 'Vista previa restringida.' });
      if (await admin.json() !== true) return reply(403, { error: 'Vista previa restringida.' });
      return reply(200, { html: config.html });
    } catch (_) { return reply(503, { error: 'No se pudo abrir la vista previa.' }); }
  };
}
