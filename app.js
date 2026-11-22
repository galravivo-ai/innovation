(() => {
// ---------- data ----------
const GA_SITES = [
  {site:"he",name:"אתר עברית",q:"Q3 2026",s:113261,u:63715,d:200},{site:"he",name:"אתר עברית",q:"Q2 2026",s:176714,u:115328,d:139},{site:"he",name:"אתר עברית",q:"Q1 2026",s:185828,u:127984,d:138},{site:"he",name:"אתר עברית",q:"Q3 2025",s:335612,u:219778,d:123},
  {site:"en",name:"אתר אנגלית",q:"Q3 2026",s:14563,u:10322,d:160},{site:"en",name:"אתר אנגלית",q:"Q2 2026",s:15287,u:10174,d:189},{site:"en",name:"אתר אנגלית",q:"Q1 2026",s:14436,u:9164,d:182},{site:"en",name:"אתר אנגלית",q:"Q3 2025",s:3589,u:2428,d:184},
  {site:"win25_he",name:"דף זוכים 2025",q:"Q3 2026",s:945,u:676},{site:"win25_he",name:"דף זוכים 2025",q:"Q2 2026",s:1333,u:829},{site:"win25_he",name:"דף זוכים 2025",q:"Q1 2026",s:2401,u:1375},{site:"win25_he",name:"דף זוכים 2025",q:"Q3 2025",s:909,u:656},
  {site:"win25_en",name:"דף זוכים 2025 באנגלית",q:"Q3 2026",s:194,u:114},{site:"win25_en",name:"דף זוכים 2025 באנגלית",q:"Q2 2026",s:204,u:132},{site:"win25_en",name:"דף זוכים 2025 באנגלית",q:"Q1 2026",s:402,u:264},{site:"win25_en",name:"דף זוכים 2025 באנגלית",q:"Q3 2025",s:112,u:89},
  {site:"ai",name:"אתר AI",q:"Q3 2026",s:4998,u:4350},{site:"ai",name:"אתר AI",q:"Q2 2026",s:8212,u:7603},{site:"ai",name:"אתר AI",q:"Q1 2026",s:4920,u:4151},{site:"ai",name:"אתר AI",q:"Q3 2025",s:1882,u:1421},
  {site:"bc",name:"אתר BC",q:"Q3 2026",s:1452,u:1105},{site:"bc",name:"אתר BC",q:"Q2 2026",s:1667,u:1069},{site:"bc",name:"אתר BC",q:"Q1 2026",s:1967,u:1381},{site:"bc",name:"אתר BC",q:"Q3 2025",s:522,u:355},
];
const GA_AI = [
  {ch:"ChatGPT",s3:2686,u3:1457,s2:2286,u2:1104},{ch:"Gemini",s3:368,u3:176,s2:401,u2:162},{ch:"Perplexity",s3:79,u3:46,s2:179,u2:98},
  {ch:"Claude",s3:67,u3:37,s2:88,u2:41},{ch:"Copilot",s3:5,u3:5,s2:18,u2:11},
];
const AI_DAYS = { q3: 60, q2: 91 };
const GA_PAGES = {
  he: [["Document",11627,8590],["רשות החדשנות - רשות החדשנות",19151,8073],["ערוץ המענקים המהיר - רשות החדשנות",13080,5301],["פתוחים להגשה - רשות החדשנות",5779,2737],["זכו בהשקעת הרשות",3074,2153],["הזנק - מסלולי תמיכה לסטארטאפים ויזמים | רשות החדשנות",3663,2131]],
  en: [["/en/calls_for_proposal/",423,272],["/en/contact-us/",357,263],["/en/press_release/",310,257],["/en/programs/",344,233],["/en/programs/startup-fund/",298,231],["/en/the-israel-innovation-authority/",300,212],["/en/blog/",150,203],["/en/press_release/israeli-high-tech-report-2026/",278,200]],
};
const GA_WINNERS = [["דף זוכים 2025",945,676],["דף זוכים 2025 באנגלית",194,114],["דף זוכים 2026",1953,1530],["דף זוכים 2026 באנגלית",226,180]];
// The daily refresh (scripts/refresh.mjs) writes fresh top lists, their date range and the update time into data.js;
// the lists below are the Q3 2026 fallback for a data.js that has none.
const D = window.IIA_DATA;
const pageName = (u) => {
  try {
    const x = new URL(u), path = decodeURIComponent(x.pathname);
    if (x.hostname.startsWith('my.')) return 'אזור אישי' + (path === '/' ? '' : ' · ' + path);
    return path === '/' ? 'עמוד הבית' : path === '/en/' ? '/en/ (עמוד הבית באנגלית)' : path;
  } catch (e) { return String(u); }
};
const GSC_QUERIES = D.queries || [
  ["רשות החדשנות אזור אישי",2475,2851,86.8,2.5],["רשות החדשנות",2288,15559,14.7,2.3],["רשות החדשנות דרושים",837,1415,59.2,1.7],["israel innovation authority",631,1960,32.2,3.2],
  ["הרשות לחדשנות אזור אישי",499,582,85.7,1.6],["הרשות לחדשנות",480,4111,11.7,7.8],["iia",300,886,33.9,2.3],["רשות החדשנות קריירה",157,240,65.4,3.9],
  ["נוהל 200-02",155,240,64.6,4.5],["תנופה",145,11076,1.3,4.9],["חברת תחבורה חכמה",128,1152,11.1,3.1],["דרושים רשות החדשנות",122,162,75.3,5.7],
];
const GSC_PAGES = D.pages ? D.pages.map(([u, ...rest]) => [pageName(u), ...rest]) : [
  ["עמוד הבית",3280,59580,8.8],["אזור אישי (my.innovationisrael.org.il)",1975,10095,2.6],["/job/ (דרושים)",1567,22966,1.7],["/en/ (עמוד הבית באנגלית)",1081,38915,8.8],
  ["האזור האישי באתר רשות החדשנות",682,5633,4.6],["מסלול תנופה – קרן ההזנק",646,19380,5.6],["/fast-track/ (מסלול מהיר)",288,3754,10],["אזור אישי – כניסה להודעות",287,2136,3.4],
  ["נוהל ניהול מערכת הכספים והגשת דוחות",194,933,23.2],["/event_series/barevents2026/ (חדשנות על הבר)",176,353,5.4],
];
const TOP_RANGE = D.topRange || ['2026-07-01', '2026-09-30'];
const UPDATED = D.updated ? D.updated.slice(0, 10) : '2026-10-28';
const parseCsv = (id) => window.IIA_DATA[id].trim().split('\n').map((l) => { const [d, c, i, p] = l.split(','); return { d, c: +c, i: +i, p: +p }; });
const GSC = { main: parseCsv('csv-main'), en: parseCsv('csv-en') };
// the Hebrew site = the domain without the English pages; an older data.js has no csv-he, so it is derived (position approximated)
GSC.he = D['csv-he'] ? parseCsv('csv-he') : (() => {
  const en = new Map(GSC.en.map((r) => [r.d, r]));
  return GSC.main.map((r) => { const e = en.get(r.d); if (!e) return r; const i = Math.max(0, r.i - e.i); return { d: r.d, c: Math.max(0, r.c - e.c), i, p: i ? Math.max(1, (r.p * r.i - e.p * e.i) / i) : r.p }; });
})();
const COVER = Object.fromEntries(Object.entries(GSC).map(([k, rows]) => [k, [rows[0].d, rows[rows.length - 1].d]]));
// the site shown everywhere: Hebrew or English (the switch in the top bar)
const SITE_NAME = { he: 'אתר עברית', en: 'אתר אנגלית' };
const SITE_IN = { he: 'באתר העברי', en: 'באתר האנגלי' };
let site = 'he';
try { if (['he', 'en'].includes(localStorage.getItem('iia-site'))) site = localStorage.getItem('iia-site'); } catch (err) {}
// top search terms and pages for the chosen site (an older data.js only has them for the whole domain)
const topFor = (s) => {
  const t = D.topBySite && D.topBySite[s];
  if (t) return { queries: t.queries, pages: t.pages.map(([u, ...rest]) => [pageName(u), ...rest]) };
  return s === 'he' ? { queries: GSC_QUERIES, pages: GSC_PAGES } : { queries: [], pages: [] };
};

// ---------- helpers ----------
const fmt = d3.format(',');
const pct1 = d3.format('.1%');
const pct0 = d3.format('.0%');
const signed = (v) => (v > 0 ? '+' : v < 0 ? '−' : '') + pct0(Math.abs(v));
const mmss = (s) => s == null ? '' : Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0');
const DAY = 86400000;
const toDate = (s) => new Date(s + 'T00:00:00Z');
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => iso(new Date(toDate(s).getTime() + n * DAY));
const daysBetween = (a, b) => Math.round((toDate(b) - toDate(a)) / DAY) + 1;
const heDate = (s) => { const d = toDate(s); return d.getUTCDate() + '.' + (d.getUTCMonth() + 1) + '.' + d.getUTCFullYear(); };
const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

function summarize(scope, start, end) {
  const rows = GSC[scope].filter((r) => r.d >= start && r.d <= end);
  const clicks = d3.sum(rows, (r) => r.c), impressions = d3.sum(rows, (r) => r.i);
  const position = impressions ? d3.sum(rows, (r) => r.p * r.i) / impressions : null;
  return { days_with_data: rows.length, days_in_range: daysBetween(start, end), clicks, impressions, ctr: impressions ? clicks / impressions : null, position };
}
function compare(scope, start, end) {
  const len = daysBetween(start, end);
  let pEnd = addDays(start, -1), pStart = addDays(start, -len);
  // whole calendar months (e.g. a quarter) compare with the same number of whole months before
  if (start.endsWith('-01') && addDays(end, 1).endsWith('-01')) {
    const s = toDate(start), months = (toDate(addDays(end, 1)).getUTCFullYear() - s.getUTCFullYear()) * 12 + toDate(addDays(end, 1)).getUTCMonth() - s.getUTCMonth();
    pStart = iso(new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth() - months, 1)));
  }
  const plen = daysBetween(pStart, pEnd);
  const cur = summarize(scope, start, end), prev = summarize(scope, pStart, pEnd);
  const ok = prev.days_with_data >= plen * 0.9 && cur.days_with_data > 0;
  return { cur, prev: ok ? prev : null, prevRange: [pStart, pEnd] };
}
function series(scope, start, end, grouping) {
  const rows = GSC[scope].filter((r) => r.d >= start && r.d <= end);
  const key = grouping === 'day' ? (r) => r.d : grouping === 'week' ? (r) => iso(d3.utcSunday.floor(toDate(r.d))) : (r) => r.d.slice(0, 7) + '-01';
  return d3.rollups(rows, (rs) => ({ clicks: d3.sum(rs, (r) => r.c), impressions: d3.sum(rs, (r) => r.i) }), key).map(([k, v]) => ({ period: k, ...v })).sort((a, b) => a.period < b.period ? -1 : 1);
}
const autoGrouping = (start, end) => { const n = daysBetween(start, end); return n <= 62 ? 'day' : n <= 210 ? 'week' : 'month'; };

function setChip(chip, v, invert) {
  chip.classList.remove('up', 'down', 'flat');
  if (v == null || !isFinite(v)) { chip.textContent = 'אין השוואה'; chip.classList.add('flat'); return; }
  const good = invert ? v < 0 : v > 0;
  chip.textContent = signed(v);
  chip.classList.add(Math.abs(v) < 0.005 ? 'flat' : good ? 'up' : 'down');
}

function fillTable(id, rows, cols, rowClass) {
  const tb = $(id).querySelector('tbody');
  tb.replaceChildren(...rows.map((r) => {
    const tr = el('tr', rowClass ? rowClass(r) : '');
    for (const c of cols) {
      const td = el('td', typeof c.cls === 'function' ? c.cls(r) : (c.cls || ''), c.f(r));
      if (c.w) td.style.setProperty('--w', c.w(r));
      tr.appendChild(td);
    }
    return tr;
  }));
}

function barChart(box, rows, { x, y, label, tipLabel, hi, fmtY }) {
  box.replaceChildren();
  if (!rows.length) { box.appendChild(el('p', 'cnote', 'אין נתונים בתקופה שנבחרה.')); return; }
  const W = Math.max(280, box.clientWidth || 600), H = 250, m = { t: 26, r: 8, b: 28, l: 8 };
  const svg = d3.select(box).append('svg').attr('width', '100%').attr('viewBox', `0 0 ${W} ${H}`);
  const yS = d3.scaleLinear([0, d3.max(rows, y) || 1], [H - m.b, m.t]).nice();
  const ticks = yS.ticks(4);
  const probe = svg.append('text').attr('font-size', 11).text(fmtY(ticks[ticks.length - 1]));
  m.l = Math.ceil(probe.node().getComputedTextLength()) + 10; probe.remove();
  const xS = d3.scaleBand(rows.map(x), [m.l, W - m.r]).padding(rows.length > 40 ? 0.15 : 0.25);
  svg.append('g').selectAll('line').data(ticks).join('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', yS).attr('y2', yS).style('stroke', 'var(--grid)');
  svg.append('g').selectAll('text').data(ticks).join('text').attr('x', m.l - 6).attr('y', (d) => yS(d) + 4).attr('text-anchor', 'end').attr('font-size', 11).style('fill', 'var(--muted)').text(fmtY);
  svg.append('line').attr('x1', m.l).attr('x2', W - m.r).attr('y1', yS(0)).attr('y2', yS(0)).style('stroke', 'var(--line)');
  const bw = Math.min(32, xS.bandwidth());
  const bars = svg.append('g').selectAll('rect').data(rows).join('rect')
    .attr('x', (d) => xS(x(d)) + (xS.bandwidth() - bw) / 2).attr('width', bw)
    .attr('y', (d) => yS(y(d))).attr('height', (d) => Math.max(0, yS(0) - yS(y(d)))).attr('rx', Math.min(3, bw / 2))
    .style('fill', (d) => hi(d) ? 'var(--purple)' : 'var(--bar-muted)');
  const lab = (v) => v >= 10000 ? d3.format('.3~s')(v) : fmt(v);
  const hiRows = rows.filter(hi);
  if (hiRows.length && hiRows.length <= 16 && d3.max(hiRows, (d) => lab(y(d)).length * 7.2) <= xS.step() + 4) {
    svg.append('g').selectAll('text').data(hiRows).join('text')
      .attr('x', (d) => xS(x(d)) + xS.bandwidth() / 2).attr('y', (d) => yS(y(d)) - 7).attr('text-anchor', 'middle')
      .attr('font-size', 12).attr('font-weight', 800).style('fill', 'var(--purple-ink)').text((d) => lab(y(d)));
  }
  const every = Math.ceil(rows.length / Math.max(1, Math.floor((W - m.l) / 52)));
  svg.append('g').selectAll('text').data(rows.filter((d, i) => i % every === 0)).join('text')
    .attr('x', (d) => xS(x(d)) + xS.bandwidth() / 2).attr('y', H - 8).attr('text-anchor', 'middle').attr('font-size', 11)
    .attr('font-weight', (d) => hi(d) ? 700 : 400).style('fill', (d) => hi(d) ? 'var(--fg)' : 'var(--muted)').text(label);
  const tip = el('div', 'tip'); tip.hidden = true; box.appendChild(tip);
  svg.append('g').selectAll('rect').data(rows).join('rect')
    .attr('x', (d) => xS(x(d)) - xS.step() * xS.paddingInner() / 2).attr('width', xS.step()).attr('y', m.t).attr('height', H - m.t - m.b)
    .style('fill', 'transparent')
    .on('mouseenter mousemove', (ev, d) => {
      bars.attr('opacity', (b) => b === d ? 1 : 0.55);
      tip.replaceChildren(el('div', 'd', (tipLabel || label)(d)), el('b', '', fmt(y(d))));
      tip.hidden = false;
      const [px, py] = d3.pointer(ev, box);
      tip.style.left = Math.min(Math.max(0, px + 10), box.clientWidth - tip.offsetWidth) + 'px';
      tip.style.top = Math.max(0, py - 48) + 'px';
    })
    .on('mouseleave', () => { bars.attr('opacity', 1); tip.hidden = true; });
}

// ---------- Google Analytics model ----------
// One shape for both sources: the live GA4 data the daily refresh writes into data.js (D.ga),
// or, when that is missing, the Q3 2026 report figures at the top of this file.
// M.sites[key].stats[periodId] = { s: sessions, u: users, d: avg session seconds, days: days with data }
const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const qLabel = (id) => id.startsWith('Q') ? 'רבעון ' + id.slice(1, 2) + ' ' + id.slice(3) : MONTHS_HE[+id.slice(5) - 1] + ' ' + id.slice(0, 4);
const qShort = (id) => id.startsWith('Q') ? id.slice(0, 2) + ' ' + id.slice(5) : id.slice(5) + '/' + id.slice(2, 4);
// the dashboard reports on the main site only: Hebrew and English
const SITE_KEYS = ['he', 'en'];
function staticModel() {
  const q = (id, start, end) => ({ id, type: 'q', start, end });
  const periods = [q('Q3 2026', '2026-07-01', '2026-09-30'), q('Q2 2026', '2026-04-01', '2026-06-30'), q('Q1 2026', '2026-01-01', '2026-03-31'), q('Q3 2025', '2025-07-01', '2025-09-30')];
  // the main site was measured 1.7–29.8 in both Q3s; the AI and BC sites went live at the end of July 2025
  const days = (site, id) => (id === 'Q3 2026' && (site === 'he' || site === 'en')) || id === 'Q3 2025' ? 60 : daysBetween(periods.find((p) => p.id === id).start, periods.find((p) => p.id === id).end);
  const sites = {};
  for (const r of GA_SITES) {
    if (!SITE_KEYS.includes(r.site)) continue;
    const s = sites[r.site] = sites[r.site] || { key: r.site, name: r.name, stats: {} };
    s.stats[r.q] = { s: r.s, u: r.u, d: r.d ?? null, days: days(r.site, r.q) };
  }
  const ch = (k) => Object.fromEntries(GA_AI.map((r) => [r.ch, { s: r['s' + k], u: r['u' + k] }]));
  // AI totals as reported (they include small sources not listed per channel)
  const ai = { 'Q3 2026': { s: 3231, u: 1710, channels: ch(3) }, 'Q2 2026': { s: 3002, u: 1398, channels: ch(2) } };
  return { live: false, end: '2026-09-30', periods, sites, aiBySite: { he: ai }, pages: { he: { 'Q3 2026': GA_PAGES.he }, en: { 'Q3 2026': GA_PAGES.en } } };
}
function liveModel(g) {
  const sites = {};
  for (const s of g.sites) if (SITE_KEYS.includes(s.key) && Object.keys(s.stats).length) sites[s.key] = s;
  return { live: true, end: g.end, periods: g.periods, sites, aiBySite: g.aiBySite || (g.ai ? { he: g.ai } : {}), pages: g.pages || {} };
}
const M = D.ga && D.ga.sites && D.ga.sites.some((s) => s.key === 'he' && Object.keys(s.stats).length) ? liveModel(D.ga) : staticModel();
const period = (id) => M.periods.find((p) => p.id === id);
const lenOf = (id) => { const p = period(id); return p ? daysBetween(p.start, p.end) : 0; };
const stat = (site, id) => (M.sites[site] && M.sites[site].stats[id]) || null;
const has = (site, id) => !!stat(site, id);
const partial = (site, id) => { const s = stat(site, id); return !!s && s.days < lenOf(id) * 0.9; };
// "not measured": a period whose sessions are under a tenth of the site's usual pace, i.e. the tracking tag was not
// working (e.g. the English pages since September 2026); its numbers would mislead, so the page shows "לא נמדד" instead
const baseline = {};
const usualDaily = (k) => {
  if (baseline[k] != null) return baseline[k];
  const months = M.periods.filter((p) => p.type === 'm' && has(k, p.id)).map((p) => stat(k, p.id).s / lenOf(p.id)).sort((a, b) => a - b);
  return (baseline[k] = months.length ? months[Math.floor(months.length / 2)] : 0);
};
const unmeasured = (k, id) => { const s = stat(k, id); return !s || (usualDaily(k) > 0 && s.s < usualDaily(k) * lenOf(id) * 0.1); };
const NOT_MEASURED = 'לא נמדד';
const prevOf = (id) => { const p = period(id); if (!p) return null; const older = M.periods.filter((x) => x.type === p.type && x.start < p.start); return older.length ? older[0].id : null; };
const quarterEnd = (id) => iso(new Date(Date.UTC(+id.slice(3), +id.slice(1, 2) * 3, 0)));
// default: the last quarter that has ended (a quarter in progress can still be picked)
const DEFAULT_Q = (M.periods.find((p) => p.type === 'q' && has('he', p.id) && p.end === quarterEnd(p.id)) || M.periods.find((p) => has('he', p.id)) || M.periods[0]).id;
const QS = M.periods.filter((p) => p.type === 'q' && has('he', p.id)).slice(0, 4).map((p) => p.id);
const aiOf = (id) => (M.aiBySite[site] || {})[id] || null;
const aiDays = (id) => (stat(site, id) && stat(site, id).days) || lenOf(id);
const aiDaily = (id) => { const a = aiOf(id); return a ? a.s / aiDays(id) : null; };
const aiChange = (id) => { const p = prevOf(id); const a = aiDaily(id), b = p ? aiDaily(p) : null; return a != null && b ? a / b - 1 : null; };

function tile(parent, label, value, subParts) {
  const t = el('div', 'tile');
  t.append(el('span', 'lbl', label), el('span', 'val', value));
  const sub = el('span', 'sub');
  for (const p of subParts) sub.append(typeof p === 'string' ? document.createTextNode(p) : p);
  t.append(sub); parent.append(t);
}
const pv = (t) => el('span', 'pv', t);
const chipEl = (v) => { const c = el('span', 'chip'); setChip(c, v); return c; };

function renderStatic() {
  // headline figures and summary follow the chosen site and the default period (the last quarter that has ended)
  const dq = DEFAULT_Q, pq = prevOf(dq), dp = period(dq), pp = pq && period(pq);
  const cur = unmeasured(site, dq) ? null : stat(site, dq), prv = pq && !unmeasured(site, pq) ? stat(site, pq) : null, ac = cur && prv ? aiChange(dq) : null;
  $('h-users').textContent = cur ? fmt(cur.u) : '—';
  $('h-users-lbl').textContent = 'מבקרים ייחודיים ' + SITE_IN[site];
  $('h-users-range').textContent = qLabel(dq) + (M.live ? '' : ' · 1.7–29.8');
  $('h-ai').textContent = ac == null ? '—' : signed(ac);
  $('h-ai-range').textContent = 'ממוצע סשנים ליום, ' + qLabel(dq) + (pq ? ' מול ' + qLabel(pq) : '');
  const parts = [];
  if (cur) parts.push('זמן השהייה ' + SITE_IN[site] + ' ב' + qLabel(dq) + ' היה ', [mmss(cur.d) + ' דק\''], ' לסשן' + (prv ? ' (לעומת ' + mmss(prv.d) + ' ב' + qLabel(pq) + ')' : '') + '.');
  if (ac != null) parts.push(' התנועה מכלי AI ' + (ac < 0 ? 'ירדה' : 'עלתה') + ' ב־', [pct0(Math.abs(ac))], ' בממוצע יומי.');
  if (pp && dp.end <= COVER[site][1] && pp.start >= COVER[site][0]) {
    const g1 = summarize(site, dp.start, dp.end), g0 = summarize(site, pp.start, pp.end), gchg = g1.clicks / g0.clicks - 1;
    parts.push(' הקליקים מגוגל ' + (gchg < 0 ? 'ירדו' : 'עלו') + ' ב־', [pct0(Math.abs(gchg))], ' מול ' + qLabel(pq) + '.');
  }
  $('takeaway').replaceChildren(...parts.map((p) => typeof p === 'string' ? document.createTextNode(p) : el('b', '', p[0])));
  if (M.live) {
    $('ga-note').replaceChildren(el('b', '', 'הערה על המדידה: '), document.createTextNode('בעקבות תקלה טכנית במערך המדידה באתר הראשי, מ־30.8.2026 נאספו נתוני Google Analytics חלקיים בלבד (בעיקר בספטמבר 2026), ולכן נתוני האתר הראשי לתקופה זו נמוכים מהתנועה בפועל. באתר האנגלי (/en/) תג המדידה של Google Analytics לא פועל מאז ספטמבר 2026, ולכן תקופות אלה מסומנות "לא נמדד". נתוני Google Search Console מלאים לשני האתרים. הנתונים מתעדכנים אוטומטית כל בוקר.'));
    $('sites-table-note').textContent = '* נמדד רק בחלק מימי התקופה (למשל בתקופת התקלה).';
  }

  const winners = GA_WINNERS.filter((r) => (site === 'en') === r[0].includes('באנגלית'));
  const maxW = d3.max(winners, (r) => r[2]) || 1;
  fillTable('winners-table', winners, [{ cls: 'txt', f: (r) => r[0] }, { cls: 'num', f: (r) => fmt(r[1]) }, { cls: 'num bar', w: (r) => (r[2] / maxW * 100).toFixed(1) + '%', f: (r) => fmt(r[2]) }]);

  const top = topFor(site);
  const maxQ = d3.max(top.queries, (r) => r[1]) || 1;
  fillTable('gsc-queries', top.queries, [
    { cls: 'txt', f: (r) => r[0] }, { cls: 'num bar', w: (r) => (r[1] / maxQ * 100).toFixed(1) + '%', f: (r) => fmt(r[1]) },
    { cls: 'num', f: (r) => fmt(r[2]) }, { cls: 'num', f: (r) => r[3].toFixed(1) + '%' }, { cls: 'num', f: (r) => r[4].toFixed(1) },
  ]);
  const maxP = d3.max(top.pages, (r) => r[1]) || 1;
  fillTable('gsc-pages', top.pages, [
    { cls: 'txt', f: (r) => r[0] }, { cls: 'num bar', w: (r) => (r[1] / maxP * 100).toFixed(1) + '%', f: (r) => fmt(r[1]) },
    { cls: 'num', f: (r) => fmt(r[2]) }, { cls: 'num', f: (r) => r[3].toFixed(1) },
  ]);
  const topText = SITE_NAME[site] + ' · ' + heDate(TOP_RANGE[0]) + '–' + heDate(TOP_RANGE[1]) + (D.topRange ? ' (90 הימים האחרונים עם נתונים).' : ' (רבעון 3 2026).') + (top.queries.length ? '' : ' לאתר זה עדיין אין רשימה נפרדת; היא תופיע אחרי הרענון הבא.');
  $('top-q-note').textContent = topText;
  $('top-p-note').textContent = topText;
  $('updated').textContent = heDate(UPDATED);
}
// period chosen on the Analytics tabs: quarters and months that have data for that tab and the chosen site
const buildGaQ = () => {
  const withPages = M.periods.filter((p) => M.pages[site] && (M.pages[site][p.id] || []).length).map((p) => p.id);
  return {
    sites: M.periods.filter((p) => has(site, p.id)).map((p) => p.id),
    ai: M.periods.filter((p) => aiOf(p.id)).map((p) => p.id),
    pages: withPages.length ? withPages : [DEFAULT_Q],
    winners: ['Q3 2026'],
  };
};
let GA_Q = buildGaQ();
let gaQ = DEFAULT_Q;
const pick = (tabKey) => GA_Q[tabKey].includes(gaQ) ? gaQ : GA_Q[tabKey].includes(DEFAULT_Q) ? DEFAULT_Q : (GA_Q[tabKey][0] || DEFAULT_Q);
const setHead = (id, labels, isHi) => $(id).querySelector('thead tr').replaceChildren(...labels.map((t, i) => el('th', ((i ? 'num' : '') + (isHi(i) ? ' q3' : '')).trim(), t)));
const coverNote = (site, id) => { const s = stat(site, id); return s && s.days < lenOf(id) ? ' · נמדדו ' + s.days + ' מתוך ' + lenOf(id) + ' ימים' : ''; };
const prevWord = (id) => id.startsWith('Q') ? 'רבעון קודם ' : 'חודש קודם ';

function renderSites() {
  const q = pick('sites'), pq = prevOf(q);
  $('sites-title').textContent = 'תנועה ל' + SITE_NAME[site];
  $('users-chart-title').textContent = SITE_NAME[site] + ': משתמשים לפי רבעון';
  $('sites-q-label').textContent = 'Google Analytics · ' + qLabel(q) + (!M.live && (q === 'Q3 2026' || q === 'Q3 2025') ? ' · 1.7–29.8' : coverNote(site, q));
  const cur = unmeasured(site, q) ? null : stat(site, q), prv = pq && !unmeasured(site, pq) ? stat(site, pq) : null;
  const prev = (v) => v != null ? [prevWord(q), pv(v)] : ['אין נתוני תקופה קודמת'];
  const st = $('site-tiles'); st.replaceChildren();
  if (!cur) {
    for (const l of ['מבקרים ייחודיים', 'סשנים', 'זמן שהייה לסשן', 'סשנים למשתמש']) tile(st, l, NOT_MEASURED, ['Google Analytics לא מדד את האתר בתקופה זו']);
  } else {
    tile(st, 'מבקרים ייחודיים', fmt(cur.u), prev(prv ? fmt(prv.u) : null));
    tile(st, 'סשנים', fmt(cur.s), prev(prv ? fmt(prv.s) : null));
    tile(st, 'זמן שהייה לסשן', mmss(cur.d), [...prev(prv ? mmss(prv.d) : null), ' · ממוצע שוק 1:30–3:00']);
    tile(st, 'סשנים למשתמש', cur.u ? (cur.s / cur.u).toFixed(2) : '—', prev(prv && prv.u ? (prv.s / prv.u).toFixed(2) : null));
  }
  // quarters across, measures down
  const cell = (qq, f) => !has(site, qq) ? '—' : unmeasured(site, qq) ? NOT_MEASURED : (f === 'd' ? mmss(stat(site, qq).d) : fmt(stat(site, qq)[f])) + (partial(site, qq) ? '*' : '');
  fillTable('sites-table', [['s', 'סשנים'], ['u', 'מבקרים ייחודיים'], ['d', 'זמן שהייה לסשן']], [
    { f: (m) => m[1] }, ...QS.map((qq) => ({ cls: qq === q ? 'num q3' : 'num', f: (m) => cell(qq, m[0]) })),
  ]);
  setHead('sites-table', ['מדד', ...QS.map(qShort)], (i) => i > 0 && QS[i - 1] === q);
  // recent months, newest first
  const months = M.periods.filter((p) => p.type === 'm' && has(site, p.id)).slice(0, 6).map((p) => p.id);
  fillTable('dur-table', months, [
    { f: (m) => qLabel(m) + (partial(site, m) ? '*' : '') },
    { cls: (m) => 'num' + (m === q ? ' q3' : ''), f: (m) => unmeasured(site, m) ? NOT_MEASURED : fmt(stat(site, m).s) },
    { cls: (m) => 'num' + (m === q ? ' q3' : ''), f: (m) => unmeasured(site, m) ? '' : fmt(stat(site, m).u) },
    { cls: (m) => 'num' + (m === q ? ' q3' : ''), f: (m) => unmeasured(site, m) ? '' : mmss(stat(site, m).d) },
  ]);
  setHead('dur-table', ['חודש', 'סשנים', 'מבקרים', 'זמן שהייה'], () => false);
  $('dur-table').closest('.card').hidden = !months.length;
}
function renderAi() {
  const q = pick('ai'), pq = prevOf(q) && aiOf(prevOf(q)) ? prevOf(q) : null;
  const off = unmeasured(site, q);
  const a = off ? null : aiOf(q), b = pq && !unmeasured(site, pq) ? aiOf(pq) : null, he = stat(site, q), heP = pq ? stat(site, pq) : null, ch = b ? aiChange(q) : null;
  $('ai-intro').textContent = 'כל הכניסות ל' + SITE_NAME[site] + ' שמקורן בכלי AI';
  $('ai-empty').textContent = off ? 'Google Analytics לא מדד את ' + SITE_NAME[site] + ' ב' + qLabel(q) + ', ולכן אין נתוני תנועה מכלי AI לתקופה זו. בחרו תקופה אחרת.' : 'לאתר זה אין נתוני תנועה מכלי AI בתקופה שנבחרה.';
  $('ai-empty').hidden = !!a;
  $('ai-tiles').hidden = !a;
  $('ai-table').closest('.card').hidden = !a;
  if (!a) { $('ai-q-label').textContent = 'Google Analytics · ' + SITE_NAME[site]; return; }
  $('ai-q-label').textContent = 'Google Analytics · ' + qLabel(q) + ' · ' + aiDays(q) + ' ימי מדידה';
  const at = $('ai-tiles'); at.replaceChildren();
  tile(at, 'סשנים מכלי AI · ' + qLabel(q), fmt(a.s), b ? [pv(fmt(a.u)), ' משתמשים · ' + prevWord(q), pv(fmt(b.s)), ' סשנים'] : [pv(fmt(a.u)), ' משתמשים']);
  tile(at, 'ממוצע סשנים ליום', d3.format('.0f')(aiDaily(q)), b ? [chipEl(ch), ' מול ', pv(d3.format('.0f')(aiDaily(pq))), ' ביום ב' + qLabel(pq)] : [aiDays(q) + ' ימי מדידה']);
  if (he) tile(at, 'נתח מכלל הסשנים ' + SITE_IN[site], pct1(a.s / he.s), b && heP ? [prevWord(q), pv(pct1(b.s / heP.s))] : ['מתוך ' + fmt(he.s) + ' סשנים']);
  const lead = Object.entries(a.channels || {}).sort((x, y) => y[1].s - x[1].s)[0];
  if (lead) tile(at, 'חלק ' + lead[0] + ' מתנועת ה־AI', pct0(lead[1].s / a.s), ['המקור המוביל מבין כלי ה־AI']);
  const names = [...new Set([...Object.keys(a.channels || {}), ...Object.keys((b && b.channels) || {})])].sort((x, y) => ((a.channels[y] || {}).s || 0) - ((a.channels[x] || {}).s || 0));
  const row = (name, x, y, total) => ({ ch: name, s3: x ? x.s : 0, u3: x ? x.u : 0, s2: y ? y.s : null, u2: y ? y.u : null, total, chg: x && y && y.s ? (x.s / aiDays(q)) / (y.s / aiDays(pq)) - 1 : null });
  const rows = [...names.map((n) => row(n, a.channels[n], b && b.channels[n])), row('סה"כ', a, b, true)];
  const maxS = d3.max(rows.filter((r) => !r.total), (r) => r.s3) || 1;
  fillTable('ai-table', rows, [
    { f: (r) => r.ch },
    { cls: (r) => 'num q3' + (r.total ? '' : ' bar'), w: (r) => r.total ? '0%' : (r.s3 / maxS * 100).toFixed(1) + '%', f: (r) => fmt(r.s3) },
    { cls: 'num q3', f: (r) => fmt(r.u3) },
    { cls: 'num', f: (r) => r.s2 == null ? '—' : fmt(r.s2) }, { cls: 'num', f: (r) => r.u2 == null ? '—' : fmt(r.u2) },
    { cls: (r) => 'num lead' + (r.chg == null ? '' : r.chg >= 0 ? ' up' : ' down'), f: (r) => r.chg == null ? '—' : signed(r.chg) },
  ], (r) => r.total ? 'total' : '');
  const pl = pq ? qShort(pq) : 'קודם';
  setHead('ai-table', ['ערוץ', 'סשנים ' + qShort(q), 'משתמשים ' + qShort(q), 'סשנים ' + pl, 'משתמשים ' + pl, 'שינוי בממוצע יומי'], (i) => i === 1 || i === 2);
}
function renderPages() {
  const q = pick('pages');
  $('pages-q-label').textContent = 'Google Analytics · ' + SITE_NAME[site] + ' · ' + qLabel(q) + (!M.live && q === 'Q3 2026' ? ' · 1.7–29.8' : coverNote(site, q));
  $('pages-he-card').hidden = site !== 'he';
  $('pages-en-card').hidden = site !== 'en';
  if (unmeasured(site, q)) $('pages-q-label').textContent += ' · ' + NOT_MEASURED;
  for (const lang of [site]) {
    const rows = unmeasured(site, q) ? [] : (M.pages[lang] && M.pages[lang][q]) || [], maxU = d3.max(rows, (r) => r[2]) || 1;
    fillTable('pages-' + lang, rows.map((r, i) => [i + 1, ...r]), [
      { cls: 'num rank', f: (r) => r[0] }, { cls: 'txt', f: (r) => r[1] }, { cls: 'num', f: (r) => fmt(r[2]) },
      { cls: 'num bar', w: (r) => (r[3] / maxU * 100).toFixed(1) + '%', f: (r) => fmt(r[3]) },
    ]);
  }
}
function drawHeUsers() {
  const rows = QS.filter((q) => has(site, q) && !unmeasured(site, q)).reverse().map((q) => ({ q, ...stat(site, q) }));
  barChart($('he-users-chart'), rows, { x: (d) => d.q, y: (d) => d.u, label: (d) => qShort(d.q), tipLabel: (d) => qLabel(d.q), hi: (d) => d.q === gaQ, fmtY: (v) => d3.format('~s')(v) });
}

// ---------- period (Search Console) ----------
const DATA_END = COVER.main[1];
const PRESETS = [
  { id: 'd28', label: '28 ימים אחרונים', range: () => [addDays(DATA_END, -27), DATA_END] },
  { id: 'm3', label: '3 חודשים', range: () => [addDays(DATA_END, -90), DATA_END] },
  { id: 'q3', label: 'רבעון 3 2026', range: () => ['2026-07-01', '2026-09-30'] },
  { id: 'q2', label: 'רבעון 2 2026', range: () => ['2026-04-01', '2026-06-30'] },
  { id: 'y1', label: '12 חודשים', range: () => [addDays(DATA_END, -364), DATA_END] },
  { id: 'all', label: 'כל התקופה', range: () => [COVER.main[0], DATA_END] },
];
const state = { start: '2026-07-01', end: '2026-09-30' };
const startIn = $('range-start'), endIn = $('range-end');
for (const inp of [startIn, endIn]) { inp.min = COVER.main[0]; inp.max = DATA_END; }
const pop = $('period-pop'), pbtn = $('period-btn'), backdrop = $('pp-backdrop');

function setRange(s, e) {
  if (s > e) [s, e] = [e, s];
  s = s < COVER.main[0] ? COVER.main[0] : s; e = e > DATA_END ? DATA_END : e;
  state.start = s; state.end = e;
  try { localStorage.setItem('iia-range', JSON.stringify(state)); } catch (err) {}
  renderPeriod();
  if (tab !== 'gsc') showTab('gsc'); else updatePeriodUi();
}
function setQuarter(q) {
  gaQ = q;
  try { localStorage.setItem('iia-q', q); } catch (err) {}
  renderSites(); renderAi(); renderPages();
  if (tab === 'sites') drawHeUsers();
  updatePeriodUi();
}
const effQ = () => GA_Q[tab] ? pick(tab) : DEFAULT_Q;
const choice = (label, pressed, onPick) => { const b = el('button', '', label); b.type = 'button'; b.setAttribute('aria-pressed', String(pressed)); b.addEventListener('click', () => { onPick(); closePop(); pbtn.focus(); }); return b; };

// the period button and its popover adapt to the open tab
function updatePeriodUi() {
  const isG = tab === 'gsc', opts = GA_Q[tab];
  $('period').hidden = !isG && !opts;
  $('period-kind').textContent = 'תקופה';
  $('period-label').textContent = isG ? rangeText(state.start, state.end) : qLabel(effQ());
  $('pp-title').textContent = isG ? 'בחירת תקופה' : 'בחירת רבעון';
  $('pp-custom').hidden = !isG;
  if (isG) {
    $('presets').replaceChildren(...PRESETS.map((p) => { const [s, e] = p.range(); return choice(p.label, s === state.start && e === state.end, () => setRange(s, e)); }));
    $('pp-note').textContent = 'נתוני Search Console זמינים מ־' + heDate(COVER.main[0]) + ' עד ' + heDate(DATA_END) + '. כל מספר מושווה לתקופה הקודמת באותו אורך.';
  } else if (opts) {
    $('presets').replaceChildren(...opts.map((q) => choice(qLabel(q), q === effQ(), () => setQuarter(q))));
    $('pp-note').textContent = opts.length === 1 ? 'לנתונים אלה זמין ' + qLabel(opts[0]) + ' בלבד.'
      : M.live ? 'נתוני Google Analytics זמינים לפי רבעון וחודש, עד ' + heDate(M.end) + '. רבעון או חודש שעוד לא הסתיימו מוצגים עד היום.'
      : 'נתוני Google Analytics בדוח זה זמינים לפי רבעון. ברבעון 3 2026 האתר הראשי נמדד 1.7–29.8.';
  }
}
function openPop() {
  updatePeriodUi();
  startIn.value = state.start; endIn.value = state.end;
  pop.hidden = false; backdrop.hidden = false; pbtn.setAttribute('aria-expanded', 'true');
  (pop.querySelector('[aria-pressed="true"]') || pop.querySelector('.pp-presets button'))?.focus();
}
function closePop() { pop.hidden = true; backdrop.hidden = true; pbtn.setAttribute('aria-expanded', 'false'); }
pbtn.addEventListener('click', () => (pop.hidden ? openPop() : closePop()));
$('pp-close').addEventListener('click', () => { closePop(); pbtn.focus(); });
backdrop.addEventListener('click', closePop);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) { closePop(); pbtn.focus(); } });
$('pp-apply').addEventListener('click', () => {
  if (startIn.value && endIn.value && startIn.validity.valid && endIn.validity.valid) { setRange(startIn.value, endIn.value); closePop(); pbtn.focus(); }
  else $('pp-note').textContent = 'יש לבחור תאריך התחלה ותאריך סיום בין ' + heDate(COVER.main[0]) + ' ל־' + heDate(DATA_END) + '.';
});

const rangeText = (s, e) => heDate(s) + '–' + heDate(e);
function renderPeriod() {
  const { start, end } = state;
  $('gsc-range-label').textContent = 'Google Search Console · ' + rangeText(start, end);
  $('h-clicks-range').textContent = rangeText(start, end);
  $('gsc-coverage').textContent = SITE_NAME[site] + ': נתונים זמינים מ־' + heDate(COVER[site][0]) + ' עד ' + heDate(COVER[site][1]) + '.';

  const m = compare(site, start, end), all = summarize('main', start, end);
  const prevTxt = (r) => r.prev ? ' מול ' + rangeText(r.prevRange[0], r.prevRange[1]) : '';
  $('h-clicks').textContent = fmt(m.cur.clicks);
  $('h-clicks-lbl').textContent = 'קליקים מחיפוש בגוגל ל' + SITE_NAME[site];
  $('t-clicks-lbl').textContent = 'קליקים מגוגל · ' + SITE_NAME[site];
  $('t-impr-lbl').textContent = 'חשיפות בגוגל · ' + SITE_NAME[site];
  $('t-clicks').textContent = fmt(m.cur.clicks);
  setChip($('c-clicks'), m.prev ? m.cur.clicks / m.prev.clicks - 1 : null);
  $('p-clicks').textContent = m.prev ? 'תקופה קודמת ' + fmt(m.prev.clicks) : '';
  $('t-impr').textContent = m.cur.impressions >= 1e6 ? Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(m.cur.impressions) : fmt(m.cur.impressions);
  setChip($('c-impr'), m.prev ? m.cur.impressions / m.prev.impressions - 1 : null);
  $('p-impr').textContent = prevTxt(m);
  $('t-ctr').textContent = m.cur.ctr == null ? '—' : pct1(m.cur.ctr);
  setChip($('c-ctr'), m.prev && m.cur.ctr != null ? m.cur.ctr / m.prev.ctr - 1 : null);
  $('p-ctr').textContent = m.prev ? 'תקופה קודמת ' + pct1(m.prev.ctr) : '';
  $('t-pos').textContent = m.cur.position == null ? '—' : m.cur.position.toFixed(1);
  setChip($('c-pos'), m.prev && m.cur.position != null ? m.cur.position / m.prev.position - 1 : null, true);
  $('p-pos').textContent = m.prev ? 'תקופה קודמת ' + m.prev.position.toFixed(1) + ' · נמוך יותר = טוב יותר' : 'נמוך יותר = טוב יותר';
  $('t-en').textContent = all.clicks ? pct1(m.cur.clicks / all.clicks) : '—';
  $('p-en').textContent = 'מתוך ' + fmt(all.clicks) + ' קליקים לכל הדומיין';
  drawPeriodCharts();
}
const GLABEL = { day: 'לפי יום', week: 'לפי שבוע (מיום ראשון)', month: 'לפי חודש' };
function drawPeriodCharts() {
  const { start, end } = state, g = autoGrouping(start, end);
  const lab = g === 'month' ? (d) => d3.utcFormat('%b %y')(toDate(d.period)) : (d) => d3.utcFormat('%-d.%-m')(toDate(d.period));
  const tipLab = g === 'month' ? lab : g === 'week' ? (d) => 'שבוע מ־' + heDate(d.period) : (d) => heDate(d.period);
  const rows = series(site, start, end, g);
  const note = GLABEL[g] + ' · ' + rangeText(start, end) + (site === 'he' ? ' · כולל האזור האישי, בלי דפי האנגלית.' : ' · דפים שכתובתם מכילה /en/.');
  $('main-chart-title').textContent = 'קליקים מגוגל · ' + SITE_NAME[site];
  $('en-chart-title').textContent = 'חשיפות בגוגל · ' + SITE_NAME[site];
  $('main-chart-note').textContent = note;
  $('en-chart-note').textContent = note;
  barChart($('main-chart'), rows, { x: (d) => d.period, y: (d) => d.clicks, label: lab, tipLabel: tipLab, hi: () => true, fmtY: (v) => d3.format('~s')(v) });
  barChart($('en-chart'), rows, { x: (d) => d.period, y: (d) => d.impressions, label: lab, tipLabel: tipLab, hi: () => true, fmtY: (v) => d3.format('~s')(v) });
}
// the Hebrew / English switch: every tab redraws for the chosen site
function setSite(s) {
  if (s === site) return;
  site = s;
  try { localStorage.setItem('iia-site', s); } catch (err) {}
  document.querySelectorAll('.site-switch button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.site === site)));
  GA_Q = buildGaQ();
  renderStatic(); renderSites(); renderAi(); renderPages(); renderPeriod(); updatePeriodUi();
  if (tab === 'sites') drawHeUsers();
}
document.querySelectorAll('.site-switch button').forEach((b) => {
  b.setAttribute('aria-pressed', String(b.dataset.site === site));
  b.addEventListener('click', () => setSite(b.dataset.site));
});

// ---------- tabs: each one is its own screen ----------
const TABS = [...document.querySelectorAll('.nav button')].map((b) => b.dataset.go);
const GA_TABS = ['sites', 'ai', 'pages', 'winners'];
let tab = null;
function showTab(id, fromClick) {
  if (!TABS.includes(id)) id = 'gsc';
  tab = id;
  for (const t of TABS) $(t).hidden = t !== id;
  document.querySelectorAll('.nav button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.go === id)));
  closePop();
  updatePeriodUi();
  $('ga-note').hidden = !GA_TABS.includes(id);
  if (id === 'gsc') drawPeriodCharts();
  if (id === 'sites') drawHeUsers();
  try { localStorage.setItem('iia-tab', id); } catch (err) {}
  if (fromClick) { const band = document.querySelector('.band'); if (band.getBoundingClientRect().top < 0 || window.scrollY > band.offsetTop) window.scrollTo({ top: band.offsetTop, behavior: 'smooth' }); }
}
document.querySelectorAll('.nav button').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.go, true)));

try { const saved = JSON.parse(localStorage.getItem('iia-range') || 'null'); if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved.start) && /^\d{4}-\d{2}-\d{2}$/.test(saved.end) && saved.start <= saved.end && saved.start >= COVER.main[0] && saved.end <= DATA_END) { state.start = saved.start; state.end = saved.end; } } catch (err) {}
try { const q = localStorage.getItem('iia-q'); if (period(q)) gaQ = q; } catch (err) {}
renderStatic();
renderSites();
renderAi();
renderPages();
renderPeriod();
let startTab = location.hash.slice(1);
if (!TABS.includes(startTab)) { try { startTab = localStorage.getItem('iia-tab'); } catch (err) { startTab = null; } }
showTab(startTab || 'gsc');
let rw = 0;
new ResizeObserver(() => { const w = document.body.clientWidth; if (w !== rw) { rw = w; if (tab === 'gsc') drawPeriodCharts(); if (tab === 'sites') drawHeUsers(); } }).observe(document.body);

// ---------- AI data agent ----------
const chat = $('chat'), log = $('chat-log'), input = $('chat-input'), sendBtn = $('chat-send'), askBtn = $('ask-btn');
const SUGGEST = ['מה המגמה בקליקים מגוגל בחצי השנה האחרונה?', 'איזה כלי AI הביא הכי הרבה תנועה ואיך הוא השתנה?', 'השווה את ספטמבר לאוגוסט 2026 בחיפוש בגוגל', 'תן לי 3 תובנות עיקריות מהרבעון לדיווח להנהלה'];
const turns = [];
let sample = null, toolsOk = false, ctl = null, busy = false, viaProxy = false;
// Outside claude.ai the chat goes through a small Cloudflare Worker (worker/chat-proxy.js) that holds the API key.
const CHAT_PROXY = 'https://iia-chat.galravivo.workers.dev';

const fail = (code, text) => Object.assign(new Error(code), { code, text });
async function proxySample(msgs, { tools, onText, signal } = {}) {
  const system = msgs[0].content;
  const convo = msgs.slice(1).map((m) => ({ role: m.role, content: m.content }));
  const defs = tools ? tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.inputSchema })) : undefined;
  let text = '';
  for (let step = 0; step < 6; step++) {
    let r;
    try {
      r = await fetch(CHAT_PROXY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ system, messages: convo, tools: defs }), signal });
    } catch (e) { throw fail(e && e.name === 'AbortError' ? 'cancelled' : 'network', text); }
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw fail(data.error || 'upstream', text);
    if (data.stop_reason === 'refusal') throw fail('refused', text);
    const content = data.content || [];
    const t = content.filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
    if (t) { text = t; onText && onText({ text }); }
    convo.push({ role: 'assistant', content });
    const uses = content.filter((b) => b.type === 'tool_use');
    if (data.stop_reason !== 'tool_use' || !uses.length) {
      if (!text) throw fail('empty_completion', text);
      return { text, truncated: data.stop_reason === 'max_tokens' };
    }
    convo.push({
      role: 'user',
      content: uses.map((u) => {
        const tool = (tools || []).find((x) => x.name === u.name);
        try {
          if (!tool) throw new Error('Unknown tool ' + u.name);
          return { type: 'tool_result', tool_use_id: u.id, content: JSON.stringify(tool.execute(u.input || {})) };
        } catch (err) { return { type: 'tool_result', tool_use_id: u.id, content: String((err && err.message) || err), is_error: true }; }
      }),
    });
  }
  if (!text) throw fail('empty_completion', text);
  return { text, truncated: true };
}

const monthly = (scope) => series(scope, COVER[scope][0], COVER[scope][1], 'month').map((r) => ({ month: r.period.slice(0, 7), clicks: r.clicks, impressions: r.impressions }));
function context() {
  return [
    'אתה "סוכן הנתונים" של דוח הדיגיטל של רשות החדשנות (innovationisrael.org.il). אתה עונה למי שצופה בדשבורד, בעברית, בשפה פשוטה וברורה.',
    'כללים: ענה רק על סמך הנתונים שלהלן ותוצאות הכלים. אל תמציא מספרים. אם אין נתון, אמור זאת ואמור מה כן קיים. ציין תמיד את התקופה ואת המקור (Google Analytics או Google Search Console). הדגש מספרים חשובים ב־**כוכביות**. השתמש ברשימות עם "- " כשזה עוזר. היה תמציתי: עד כ־150 מילים, אלא אם התבקש פירוט.',
    'הערות מתודולוגיות: (1) ' + (M.live ? 'מ־30.8.2026 נתוני Google Analytics של האתר הראשי חלקיים בלבד עקב תקלת מדידה (בעיקר בספטמבר 2026), ולכן הם נמוכים מהתנועה בפועל; days = מספר הימים בתקופה שבהם נמדדו סשנים, והשוואות AI נעשות לפי ממוצע יומי.' : 'נתוני Google Analytics של האתר הראשי ברבעון 3 2026 הם ל־1.7–29.8 בלבד (60 ימים) עקב תקלת מדידה; השוואות AI נעשות לפי ממוצע יומי (60 מול 91 ימים).') + ' (2) מסוף 2025 באנר עוגיות גורם לאנליטיקס למדוד כמחצית עד שני שלישים מהכניסות. (3) ברבעון 3 2025 נכללה תנועת ניוזלטר (כ־112 אלף סשנים), ולכן 2025 אינה בת השוואה ישירה. (4) Search Console נמדד בצד גוגל ומלא לכל התקופות. (5) מיקום ממוצע נמוך יותר הוא טוב יותר.',
    'היום: ' + heDate(iso(new Date())) + '. הנתונים עודכנו לאחרונה ב־' + heDate(UPDATED) + '. התקופה שהצופה בחר כרגע בדשבורד: ' + state.start + ' עד ' + state.end + '. האתר שנבחר כרגע: ' + SITE_NAME[site] + ' (scope "' + site + '"); אם לא צוין אחרת בשאלה, ענה על האתר הזה.',
    'כיסוי Search Console יומי: כל הדומיין ' + COVER.main.join(' עד ') + '; אתר האנגלית (/en) ' + COVER.en.join(' עד ') + '. ' + (toolsOk ? 'לחישוב מדויק של כל טווח תאריכים השתמש בכלים gsc_summary ו־gsc_series. אם הצופה מבקש להציג תקופה בדשבורד, השתמש ב־set_dashboard_period.' : 'לחישוב טווחים השתמש בסיכומים החודשיים שלהלן.'),
    'Search Console חודשי, כל הדומיין: ' + JSON.stringify(monthly('main')),
    'Search Console חודשי, אתר אנגלית: ' + JSON.stringify(monthly('en')),
    'Search Console, ביטויים מובילים ' + TOP_RANGE.join(' עד ') + ' [ביטוי, קליקים, חשיפות, CTR%, מיקום]: ' + JSON.stringify(GSC_QUERIES),
    'Search Console, דפים מובילים ' + TOP_RANGE.join(' עד ') + ' [דף, קליקים, חשיפות, מיקום]: ' + JSON.stringify(GSC_PAGES),
    'Google Analytics, תקופות (רבעונים "Q3 2026" וחודשים "2026-08", עם תאריכי התחלה וסיום): ' + JSON.stringify(M.periods.map((p) => [p.id, p.start, p.end])),
    'Google Analytics לפי אתר ותקופה (s=סשנים, u=משתמשים, d=זמן שהייה ממוצע לסשן בשניות, days=ימים עם נתונים): ' + JSON.stringify(Object.values(M.sites).map((s) => ({ site: s.name, stats: s.stats }))),
    'Google Analytics, כניסות מכלי AI לאתר הראשי לפי תקופה (s=סשנים, u=משתמשים, channels=לפי כלי): ' + JSON.stringify(M.ai),
    'Google Analytics, דפים נצפים לפי תקופה [דף, צפיות, משתמשים]: עברית ' + JSON.stringify(Object.fromEntries(QS.map((q) => [q, (M.pages.he || {})[q] || []]))) + '; אנגלית ' + JSON.stringify(Object.fromEntries(QS.map((q) => [q, (M.pages.en || {})[q] || []]))),
    'Google Analytics, דפי זוכים 1.7–29.8.2026 [דף, סשנים, משתמשים]: ' + JSON.stringify(GA_WINNERS),
  ].join('\n\n');
}
const dateArg = (v, name) => { const s = String(v || ''); if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error(name + ' must be YYYY-MM-DD'); return s; };
const scopeArg = (v) => { const s = String(v || 'main'); if (!['main', 'he', 'en'].includes(s)) throw new Error('scope must be "main", "he" or "en"'); return s; };
const TOOLS = [
  {
    name: 'gsc_summary',
    description: 'Google Search Console totals for any date range: clicks, impressions, CTR (0-1), impression-weighted average position, and the same for the previous period (equal length, or the preceding whole months when the range is whole months; null if not covered). scope "main" = whole domain, "he" = Hebrew site (all pages except /en/), "en" = English site.',
    inputSchema: { type: 'object', properties: { start: { type: 'string', description: 'YYYY-MM-DD' }, end: { type: 'string', description: 'YYYY-MM-DD' }, scope: { type: 'string', enum: ['main', 'he', 'en'] } }, required: ['start', 'end'] },
    execute: (a) => { const s = dateArg(a.start, 'start'), e = dateArg(a.end, 'end'); const r = compare(scopeArg(a.scope), s, e); return { range: [s, e], current: r.cur, previous_range: r.prevRange, previous: r.prev }; },
  },
  {
    name: 'gsc_series',
    description: 'Google Search Console clicks and impressions over time for a date range, grouped by "day", "week" (weeks start Sunday) or "month". Returns at most 120 rows; use a coarser grouping for long ranges.',
    inputSchema: { type: 'object', properties: { start: { type: 'string' }, end: { type: 'string' }, scope: { type: 'string', enum: ['main', 'he', 'en'] }, grouping: { type: 'string', enum: ['day', 'week', 'month'] } }, required: ['start', 'end', 'grouping'] },
    execute: (a) => { const g = ['day', 'week', 'month'].includes(a.grouping) ? a.grouping : 'week'; const rows = series(scopeArg(a.scope), dateArg(a.start, 'start'), dateArg(a.end, 'end'), g); if (rows.length > 120) throw new Error('Too many rows (' + rows.length + '); use a coarser grouping'); return rows; },
  },
  {
    name: 'set_dashboard_period',
    description: 'Changes the period shown in the dashboard\'s Google Search Console section (tiles and charts) for the viewer. Use only when the viewer asks to show or switch to a period.',
    inputSchema: { type: 'object', properties: { start: { type: 'string' }, end: { type: 'string' } }, required: ['start', 'end'] },
    execute: (a) => { setRange(dateArg(a.start, 'start'), dateArg(a.end, 'end')); return { shown: [state.start, state.end] }; },
  },
];

function renderAnswer(box, text) {
  box.replaceChildren();
  const inline = (parent, s) => s.split('**').forEach((part, i) => { if (part) parent.append(i % 2 ? el('b', '', part) : document.createTextNode(part)); });
  let ul = null;
  for (const raw of text.split('\n')) {
    const line = raw.trimEnd();
    if (!line.trim()) { ul = null; continue; }
    const li = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (li) { if (!ul) { ul = el('ul'); box.append(ul); } const item = el('li'); inline(item, li[1]); ul.append(item); continue; }
    ul = null;
    const h = line.match(/^#{1,4}\s+(.*)$/);
    if (h) { const s = el('span', 'hd'); inline(s, h[1].replace(/\*\*/g, '')); box.append(s); continue; }
    const p = el('p'); inline(p, line); box.append(p);
  }
}
const scrollLog = () => { log.scrollTop = log.scrollHeight; };
function addMsg(cls, text) { const m = el('div', 'msg ' + cls, text); log.append(m); scrollLog(); return m; }
function showSuggestions() {
  const wrap = el('div', 'sugg');
  for (const q of SUGGEST) { const b = el('button', '', q); b.type = 'button'; b.addEventListener('click', () => { wrap.remove(); ask(q); }); wrap.append(b); }
  log.append(wrap);
}
const ERR = {
  rate_limited: 'יותר מדי שאלות ברצף. נסו שוב בעוד דקה.',
  session_expired: 'צריך להתחבר מחדש ל־Claude כדי להמשיך.',
  refused: 'לא ניתן לענות על השאלה הזו. נסו לנסח אותה אחרת.',
  empty_completion: 'לא התקבלה תשובה. נסו לפשט את השאלה.',
  prompt_too_large: 'השיחה ארוכה מדי. רעננו את הדף כדי להתחיל שיחה חדשה.',
  network: 'אין חיבור לשרת הסוכן. בדקו את החיבור לאינטרנט ונסו שוב.',
};
const HIDE = ['not_granted', 'sampling_disabled', 'not_declared', 'capability_disabled', 'capability_removed'];
function setBusy(b) { busy = b; sendBtn.textContent = b ? 'עצירה' : 'שליחה'; sendBtn.classList.toggle('stop', b); input.disabled = b; }

async function ask(q) {
  q = q.trim();
  if (!q || busy || !sample) return;
  addMsg('user', q);
  turns.push({ role: 'user', content: q });
  while (turns.length > 12) turns.splice(0, 2);
  const bubble = addMsg('bot', '');
  const wait = el('span', 'thinking', 'מעיין בנתונים'); bubble.append(wait);
  ctl = new AbortController(); setBusy(true);
  try {
    const opts = { cache: false, signal: ctl.signal, onText: ({ text }) => { renderAnswer(bubble, text); scrollLog(); } };
    if (toolsOk) { delete opts.cache; opts.tools = TOOLS; }
    const res = await sample([{ role: 'user', content: context() }, ...turns], opts);
    renderAnswer(bubble, res.text);
    turns.push({ role: 'assistant', content: res.text });
    if (res.truncated) addMsg('note-msg', 'התשובה נקטעה. אפשר לבקש פחות פרטים בכל פעם.');
  } catch (e) {
    turns.pop();
    if (e && e.text) renderAnswer(bubble, e.text); else bubble.remove();
    const code = e && e.code;
    if (code === 'cancelled') { if (e.text) addMsg('note-msg', 'נעצר.'); }
    else if (HIDE.includes(code)) { addMsg('err', 'הסוכן אינו זמין בתצוגה הזו.'); askBtn.hidden = true; }
    else addMsg('err', ERR[code] || 'משהו השתבש. נסו לשאול שוב.');
  } finally { setBusy(false); ctl = null; input.focus(); }
}
sendBtn.addEventListener('click', () => { if (busy) { ctl?.abort(); return; } const q = input.value; input.value = ''; ask(q); });
input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); sendBtn.click(); } });
input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 128) + 'px'; });
askBtn.addEventListener('click', () => { chat.hidden = false; askBtn.hidden = true; if (!log.children.length) { addMsg('note-msg', viaProxy ? 'הסוכן עונה על סמך הנתונים שבדשבורד בלבד. השאלות נשלחות לעיבוד ב־Claude.' : 'הסוכן עונה על סמך הנתונים שבדשבורד. השאלות נשלחות ל־Claude דרך החשבון שלכם.'); showSuggestions(); } input.focus(); });
$('chat-close').addEventListener('click', () => { chat.hidden = true; askBtn.hidden = false; askBtn.focus(); });

(async () => {
  try {
    sample = window.claude && window.claude.use ? await window.claude.use('sample').catch(() => null) : null;
    if (sample) {
      const lim = await sample.limits().catch(() => null);
      toolsOk = !!(lim && lim.tools && lim.tools.maxCount >= TOOLS.length);
    } else if (CHAT_PROXY) {
      sample = proxySample; toolsOk = true; viaProxy = true;
    } else return;
    askBtn.hidden = false;
  } catch (err) { sample = null; }
})();
})();
