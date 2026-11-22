// Daily data refresh for the dashboard (runs in GitHub Actions, Node 20+, no dependencies).
// Pulls Google Search Console data with a service account and rewrites data.js.
// Settings live in scripts/config.json; the service-account key comes from the GOOGLE_SA_KEY secret.
import { createSign } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const here = new URL('.', import.meta.url);
const config = JSON.parse(await readFile(new URL('config.json', here), 'utf8'));
const DATA_FILE = new URL('../data.js', here);

const rawKey = process.env.GOOGLE_SA_KEY;
if (!rawKey) {
  console.log('GOOGLE_SA_KEY is not set yet, so nothing was refreshed. See README.md, "רענון אוטומטי".');
  process.exit(0);
}
const key = JSON.parse(rawKey);

const b64url = (s) => Buffer.from(s).toString('base64url');
async function accessToken(scope) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(JSON.stringify({ iss: key.client_email, scope, aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const sig = createSign('RSA-SHA256').update(`${head}.${claims}`).sign(key.private_key).toString('base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claims}.${sig}` }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Google sign-in failed: ${body.error_description || body.error || res.status}`);
  return body.access_token;
}

const iso = (d) => d.toISOString().slice(0, 10);
const daysAgo = (n) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - n); return iso(d); };

// ---------- Search Console ----------
const gscToken = await accessToken('https://www.googleapis.com/auth/webmasters.readonly');
async function gsc(body) {
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.gsc.site)}/searchAnalytics/query`;
  const res = await fetch(url, { method: 'POST', headers: { authorization: `Bearer ${gscToken}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(`Search Console refused the request for ${config.gsc.site}: ${json.error?.message || res.status}. Is the service account added as a user on this property?`);
  return json.rows || [];
}
const end = daysAgo(config.gsc.lagDays ?? 2);
const enFilter = [{ filters: [{ dimension: 'page', operator: 'contains', expression: config.gsc.enPathContains }] }];
// the Hebrew site = the whole domain except the English pages (the personal area my.* is part of it)
const heFilter = [{ filters: [{ dimension: 'page', operator: 'notContains', expression: config.gsc.enPathContains }] }];

async function dailyCsv(filterGroups) {
  const rows = await gsc({ startDate: config.gsc.start, endDate: end, dimensions: ['date'], rowLimit: 25000, dimensionFilterGroups: filterGroups });
  return rows
    .map((r) => [r.keys[0], Math.round(r.clicks), Math.round(r.impressions), r.position.toFixed(2)].join(','))
    .sort()
    .join('\n');
}
const csvMain = await dailyCsv(undefined);
const csvEn = await dailyCsv(enFilter);
const csvHe = await dailyCsv(heFilter);
if (!csvMain) throw new Error('Search Console returned no daily rows for the whole domain; data.js was left as it was.');

const topStart = daysAgo((config.gsc.lagDays ?? 2) + (config.gsc.topDays ?? 90) - 1);
const topQueries = async (filterGroups) => (await gsc({ startDate: topStart, endDate: end, dimensions: ['query'], rowLimit: 12, dimensionFilterGroups: filterGroups }))
  .map((r) => [r.keys[0], Math.round(r.clicks), Math.round(r.impressions), +(r.ctr * 100).toFixed(1), +r.position.toFixed(1)]);
const topPages = async (filterGroups) => (await gsc({ startDate: topStart, endDate: end, dimensions: ['page'], rowLimit: 10, dimensionFilterGroups: filterGroups }))
  .map((r) => [r.keys[0], Math.round(r.clicks), Math.round(r.impressions), +r.position.toFixed(1)]);
const queries = await topQueries(undefined);
const pages = await topPages(undefined);
const topBySite = {
  he: { queries: await topQueries(heFilter), pages: await topPages(heFilter) },
  en: { queries: await topQueries(enFilter), pages: await topPages(enFilter) },
};

// ---------- Google Analytics 4 ----------
// Users are not additive across days, so every period (quarter and month) is its own report.
// days = days in the period on which the site recorded sessions (tracking gaps show up as fewer days).
async function gaData() {
  const cfg = config.ga;
  const token = await accessToken('https://www.googleapis.com/auth/analytics.readonly');
  async function report(property, body) {
    const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`, {
      method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(`Google Analytics refused the request for property ${property}: ${json.error?.message || res.status}. Is the service account a Viewer on it?`);
    return Object.assign(json.rows || [], { headers: (json.dimensionHeaders || []).map((h) => h.name) });
  }
  const num = (v) => Number(v?.value ?? 0);
  const gaEnd = daysAgo(1);
  // quarters and months from the start date to yesterday, newest first
  const periods = [];
  for (let d = new Date(cfg.start + 'T00:00:00Z'); iso(d) <= gaEnd; d.setUTCMonth(d.getUTCMonth() + 1)) {
    const y = d.getUTCFullYear(), m = d.getUTCMonth();
    const mEnd = iso(new Date(Date.UTC(y, m + 1, 0)));
    periods.push({ id: `${y}-${String(m + 1).padStart(2, '0')}`, type: 'm', start: iso(d), end: mEnd < gaEnd ? mEnd : gaEnd });
    if (m % 3 === 0) {
      const qEnd = iso(new Date(Date.UTC(y, m + 3, 0)));
      periods.push({ id: `Q${m / 3 + 1} ${y}`, type: 'q', start: iso(d), end: qEnd < gaEnd ? qEnd : gaEnd });
    }
  }
  periods.reverse();
  const batches = [];
  for (let i = 0; i < periods.length; i += 4) batches.push(periods.slice(i, i + 4));
  const ranges = (b) => b.map((p, i) => ({ startDate: p.start, endDate: p.end, name: `r${i}` }));

  async function perPeriod(property, extra, read) {
    const out = {};
    for (const b of batches) {
      const rows = await report(property, { dateRanges: ranges(b), ...extra });
      // with several date ranges GA adds a "dateRange" dimension (r0, r1, ...); with one range it does not
      const at = rows.headers.indexOf('dateRange');
      for (const r of rows) {
        const dims = r.dimensionValues.map((v) => v.value);
        const p = at < 0 ? b[0] : b[Number(dims[at].slice(1))];
        read(out, p.id, at < 0 ? dims : dims.filter((_, i) => i !== at), r.metricValues);
      }
    }
    return out;
  }

  // a site can be a whole property, or the part of a property that matches a filter (e.g. the English pages)
  const siteFilter = (s) => s.filter ? { dimensionFilter: { filter: { fieldName: s.filter.fieldName, stringFilter: { matchType: s.filter.matchType, value: s.filter.value } } } } : {};
  const sites = [];
  for (const s of cfg.sites) {
    try {
      const daily = await report(s.property, { dateRanges: [{ startDate: cfg.start, endDate: gaEnd }], dimensions: [{ name: 'date' }], metrics: [{ name: 'sessions' }], limit: 2000, ...siteFilter(s) });
      const active = daily.filter((r) => num(r.metricValues[0]) > 0).map((r) => r.dimensionValues[0].value.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
      const stats = await perPeriod(s.property, { metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'averageSessionDuration' }], ...siteFilter(s) }, (o, pid, dims, m) => {
        o[pid] = { s: num(m[0]), u: num(m[1]), d: Math.round(num(m[2])) };
      });
      for (const p of periods) if (stats[p.id]) stats[p.id].days = active.filter((d) => d >= p.start && d <= p.end).length;
      sites.push({ key: s.key, name: s.name, stats });
    } catch (e) { console.log(`GA: skipped ${s.name}: ${e.message}`); }
  }

  const aiSite = cfg.sites.find((s) => s.key === cfg.aiSite);
  const aiFilter = { filter: { fieldName: 'sessionSource', stringFilter: { matchType: 'FULL_REGEXP', value: cfg.aiSourcePattern, caseSensitive: false } } };
  const channel = (src) => /chatgpt|openai/i.test(src) ? 'ChatGPT' : /gemini|bard/i.test(src) ? 'Gemini' : /perplexity/i.test(src) ? 'Perplexity'
    : /claude|anthropic/i.test(src) ? 'Claude' : /copilot/i.test(src) ? 'Copilot' : /deepseek/i.test(src) ? 'DeepSeek' : 'אחר';
  // AI-tool traffic for each site: the AI-source filter, and for a filtered site (English) its page filter as well
  async function aiTraffic(s) {
    const own = siteFilter(s).dimensionFilter;
    const filter = own ? { andGroup: { expressions: [aiFilter, own] } } : aiFilter;
    const out = await perPeriod(s.property, { metrics: [{ name: 'sessions' }, { name: 'totalUsers' }], dimensionFilter: filter }, (o, pid, dims, m) => {
      o[pid] = { s: num(m[0]), u: num(m[1]), channels: {} };
    });
    await perPeriod(s.property, { dimensions: [{ name: 'sessionSource' }], metrics: [{ name: 'sessions' }, { name: 'totalUsers' }], dimensionFilter: filter, limit: 500 }, (o, pid, dims, m) => {
      const c = out[pid]?.channels; if (!c) return;
      const k = channel(dims[0]); c[k] = c[k] || { s: 0, u: 0 }; c[k].s += num(m[0]); c[k].u += num(m[1]);
    });
    return out;
  }
  const aiBySite = {};
  for (const s of cfg.sites) {
    try { aiBySite[s.key] = await aiTraffic(s); } catch (e) { console.log(`GA: AI traffic for ${s.name} skipped: ${e.message}`); }
  }
  const ai = aiBySite[aiSite.key] || null;

  const pages = {};
  for (const [key, dim] of Object.entries(cfg.topPages || {})) {
    const s = cfg.sites.find((x) => x.key === key); if (!s) continue;
    pages[key] = {};
    try {
      for (const p of periods) {
        const rows = await report(s.property, { dateRanges: [{ startDate: p.start, endDate: p.end }], dimensions: [{ name: dim }], metrics: [{ name: 'screenPageViews' }, { name: 'totalUsers' }], orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }], limit: 10, ...siteFilter(s) });
        pages[key][p.id] = rows.map((r) => [r.dimensionValues[0].value, num(r.metricValues[0]), num(r.metricValues[1])]);
      }
    } catch (e) { console.log(`GA: top pages for ${s.name} skipped: ${e.message}`); delete pages[key]; }
  }
  console.log(`GA: ${sites.length} sites, ${periods.length} periods, AI ${ai ? 'ok' : 'missing'}, top pages for ${Object.keys(pages).join(', ') || 'none'}.`);
  return { end: gaEnd, periods, sites, ai, aiBySite, pages };
}
let ga = null;
if (config.ga?.sites?.length) {
  try { ga = await gaData(); } catch (e) { console.log(`GA: not refreshed: ${e.message}`); }
}

// ---------- write data.js ----------
const out = `// Written by scripts/refresh.mjs. Do not edit by hand: the daily refresh replaces this file.
// Google Search Console, daily: date,clicks,impressions,avg position
// csv-main = ${config.gsc.site} (whole domain), csv-en = pages containing "${config.gsc.enPathContains}", csv-he = all other pages
window.IIA_DATA = {
updated: ${JSON.stringify(new Date().toISOString())},
topRange: ${JSON.stringify([topStart, end])},
queries: ${JSON.stringify(queries)},
pages: ${JSON.stringify(pages)},
topBySite: ${JSON.stringify(topBySite)},
ga: ${JSON.stringify(ga)},
'csv-main': \`${csvMain}\`,
'csv-en': \`${csvEn}\`,
'csv-he': \`${csvHe}\`,
};
`;
await writeFile(DATA_FILE, out);
console.log(`data.js refreshed: ${csvMain.split('\n').length} days (whole domain), ${csvEn ? csvEn.split('\n').length : 0} days (/en), top lists ${topStart} to ${end}.`);
