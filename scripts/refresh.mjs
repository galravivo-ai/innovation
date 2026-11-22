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

async function dailyCsv(filterGroups) {
  const rows = await gsc({ startDate: config.gsc.start, endDate: end, dimensions: ['date'], rowLimit: 25000, dimensionFilterGroups: filterGroups });
  return rows
    .map((r) => [r.keys[0], Math.round(r.clicks), Math.round(r.impressions), r.position.toFixed(2)].join(','))
    .sort()
    .join('\n');
}
const csvMain = await dailyCsv(undefined);
const csvEn = await dailyCsv(enFilter);
if (!csvMain) throw new Error('Search Console returned no daily rows for the whole domain; data.js was left as it was.');

const topStart = daysAgo((config.gsc.lagDays ?? 2) + (config.gsc.topDays ?? 90) - 1);
const queries = (await gsc({ startDate: topStart, endDate: end, dimensions: ['query'], rowLimit: 12 }))
  .map((r) => [r.keys[0], Math.round(r.clicks), Math.round(r.impressions), +(r.ctr * 100).toFixed(1), +r.position.toFixed(1)]);
const pages = (await gsc({ startDate: topStart, endDate: end, dimensions: ['page'], rowLimit: 10 }))
  .map((r) => [r.keys[0], Math.round(r.clicks), Math.round(r.impressions), +r.position.toFixed(1)]);

// ---------- write data.js ----------
const out = `// Written by scripts/refresh.mjs. Do not edit by hand: the daily refresh replaces this file.
// Google Search Console, daily: date,clicks,impressions,avg position
// csv-main = ${config.gsc.site} (whole domain), csv-en = pages containing "${config.gsc.enPathContains}"
window.IIA_DATA = {
updated: ${JSON.stringify(new Date().toISOString())},
topRange: ${JSON.stringify([topStart, end])},
queries: ${JSON.stringify(queries)},
pages: ${JSON.stringify(pages)},
'csv-main': \`${csvMain}\`,
'csv-en': \`${csvEn}\`,
};
`;
await writeFile(DATA_FILE, out);
console.log(`data.js refreshed: ${csvMain.split('\n').length} days (whole domain), ${csvEn ? csvEn.split('\n').length : 0} days (/en), top lists ${topStart} to ${end}.`);
