// Cloudflare Worker: a small proxy between the dashboard's "סוכן הנתונים" chat and the Claude API.
// The page sends { system, messages, tools }; the Worker adds the API key (a Worker secret named
// ANTHROPIC_API_KEY), fixes the model and limits, and returns { content, stop_reason }.
// The tool loop runs in the page, because the tools read the dashboard's own data.
// Written with plain fetch so it can be pasted into the Cloudflare dashboard editor without a build step.

const ALLOWED_ORIGINS = ['https://galravivo-ai.github.io', 'http://localhost:8766'];
const MODEL = 'claude-opus-5-5';
const MAX_TOKENS = 8000;
const PER_IP_LIMIT = 40; // requests per IP per 10 minutes (one question can take 2-4 requests)
const WINDOW_MS = 10 * 60 * 1000;
const SYSTEM_PREFIX = 'אתה "סוכן הנתונים"';

const hits = new Map(); // best effort: per Worker instance

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    };
    const reply = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' } });

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (req.method !== 'POST') return reply(405, { error: 'method_not_allowed' });
    if (!ALLOWED_ORIGINS.includes(origin)) return reply(403, { error: 'origin_not_allowed' });
    if (!env.ANTHROPIC_API_KEY) return reply(500, { error: 'not_configured' });

    const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= PER_IP_LIMIT) return reply(429, { error: 'rate_limited' });
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) hits.clear();

    const raw = await req.text();
    if (raw.length > 400000) return reply(413, { error: 'prompt_too_large' });
    let body;
    try { body = JSON.parse(raw); } catch { return reply(400, { error: 'bad_request' }); }
    const { system, messages, tools } = body || {};
    if (typeof system !== 'string' || !system.startsWith(SYSTEM_PREFIX)) return reply(400, { error: 'bad_request' });
    if (!Array.isArray(messages) || !messages.length || messages.length > 60) return reply(400, { error: 'bad_request' });

    const payload = {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages: messages.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
      output_config: { effort: 'low' },
      cache_control: { type: 'ephemeral' }, // the long data context repeats in every step of a question
      fallbacks: 'default',
    };
    if (Array.isArray(tools) && tools.length) {
      payload.tools = tools.slice(0, 8).map((t) => ({ name: String(t.name), description: String(t.description || ''), input_schema: t.input_schema }));
    }

    let upstream;
    try {
      upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2026-10-21',
          'anthropic-beta': 'server-side-fallback-2026-07-01',
        },
        body: JSON.stringify(payload),
      });
    } catch {
      return reply(502, { error: 'upstream' });
    }
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const type = data && data.error && data.error.type;
      if (upstream.status === 429 || type === 'rate_limit_error') return reply(429, { error: 'rate_limited' });
      if (upstream.status === 413 || /too long|too large/i.test((data.error && data.error.message) || '')) return reply(413, { error: 'prompt_too_large' });
      return reply(502, { error: 'upstream', detail: type || upstream.status });
    }
    return reply(200, { content: data.content || [], stop_reason: data.stop_reason });
  },
};
