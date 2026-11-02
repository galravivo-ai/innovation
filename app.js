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
const GSC_QUERIES = [
  ["רשות החדשנות אזור אישי",2475,2851,86.8,2.5],["רשות החדשנות",2288,15559,14.7,2.3],["רשות החדשנות דרושים",837,1415,59.2,1.7],["israel innovation authority",631,1960,32.2,3.2],
  ["הרשות לחדשנות אזור אישי",499,582,85.7,1.6],["הרשות לחדשנות",480,4111,11.7,7.8],["iia",300,886,33.9,2.3],["רשות החדשנות קריירה",157,240,65.4,3.9],
  ["נוהל 200-02",155,240,64.6,4.5],["תנופה",145,11076,1.3,4.9],["חברת תחבורה חכמה",128,1152,11.1,3.1],["דרושים רשות החדשנות",122,162,75.3,5.7],
];
const GSC_PAGES = [
  ["עמוד הבית",3280,59580,8.8],["אזור אישי (my.innovationisrael.org.il)",1975,10095,2.6],["/job/ (דרושים)",1567,22966,1.7],["/en/ (עמוד הבית באנגלית)",1081,38915,8.8],
  ["האזור האישי באתר רשות החדשנות",682,5633,4.6],["מסלול תנופה – קרן ההזנק",646,19380,5.6],["/fast-track/ (מסלול מהיר)",288,3754,10],["אזור אישי – כניסה להודעות",287,2136,3.4],
  ["נוהל ניהול מערכת הכספים והגשת דוחות",194,933,23.2],["/event_series/barevents2026/ (חדשנות על הבר)",176,353,5.4],
];
const parseCsv = (id) => window.IIA_DATA[id].trim().split('\n').map((l) => { const [d, c, i, p] = l.split(','); return { d, c: +c, i: +i, p: +p }; });
const GSC = { main: parseCsv('csv-main'), en: parseCsv('csv-en') };
const COVER = { main: [GSC.main[0].d, GSC.main[GSC.main.length - 1].d], en: [GSC.en[0].d, GSC.en[GSC.en.length - 1].d] };

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

// ---------- static (Google Analytics) sections ----------
const ga = (site, q) => GA_SITES.find((r) => r.site === site && r.q === q);
const QS = ['Q3 2026', 'Q2 2026', 'Q1 2026', 'Q3 2025'];
// totals as reported by Google Analytics (they include small AI sources not listed per channel)
const aiTot = { s3: 3231, u3: 1710, s2: 3002, u2: 1398 };
const aiDaily = { q3: aiTot.s3 / AI_DAYS.q3, q2: aiTot.s2 / AI_DAYS.q2 };
const aiChg = aiDaily.q3 / aiDaily.q2 - 1;

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
  const he3 = ga('he', 'Q3 2026'), he2 = ga('he', 'Q2 2026'), en3 = ga('en', 'Q3 2026'), en2 = ga('en', 'Q2 2026');
  $('h-users').textContent = fmt(he3.u);
  $('h-ai').textContent = signed(aiChg);
  const gq3 = summarize('main', '2026-07-01', '2026-09-30'), gq2 = summarize('main', '2026-04-01', '2026-06-30');
  const gchg = gq3.clicks / gq2.clicks - 1;
  const parts = [
    'זמן השהייה באתר העברי עלה ל־', [mmss(he3.d) + ' דק\''], ' לסשן (לעומת ' + mmss(he2.d) + ' ברבעון הקודם), והתנועה מכלי AI עלתה ב־',
    [pct0(aiChg)], ' בממוצע יומי. הקליקים מגוגל ברבעון 3 ' + (gchg < 0 ? 'ירדו' : 'עלו') + ' ב־', [pct0(Math.abs(gchg))], ' מול רבעון 2' + (gchg < 0 ? ', בעיקר בספטמבר.' : '.'),
  ];
  $('takeaway').replaceChildren(...parts.map((p) => typeof p === 'string' ? document.createTextNode(p) : el('b', '', p[0])));

  for (const lang of ['he', 'en']) {
    const rows = GA_PAGES[lang], maxU = d3.max(rows, (r) => r[2]);
    fillTable('pages-' + lang, rows.map((r, i) => [i + 1, ...r]), [
      { cls: 'num rank', f: (r) => r[0] }, { cls: 'txt', f: (r) => r[1] }, { cls: 'num', f: (r) => fmt(r[2]) },
      { cls: 'num bar', w: (r) => (r[3] / maxU * 100).toFixed(1) + '%', f: (r) => fmt(r[3]) },
    ]);
  }
  const maxW = d3.max(GA_WINNERS, (r) => r[2]);
  fillTable('winners-table', GA_WINNERS, [{ cls: 'txt', f: (r) => r[0] }, { cls: 'num', f: (r) => fmt(r[1]) }, { cls: 'num bar', w: (r) => (r[2] / maxW * 100).toFixed(1) + '%', f: (r) => fmt(r[2]) }]);

  const maxQ = d3.max(GSC_QUERIES, (r) => r[1]);
  fillTable('gsc-queries', GSC_QUERIES, [
    { cls: 'txt', f: (r) => r[0] }, { cls: 'num bar', w: (r) => (r[1] / maxQ * 100).toFixed(1) + '%', f: (r) => fmt(r[1]) },
    { cls: 'num', f: (r) => fmt(r[2]) }, { cls: 'num', f: (r) => r[3].toFixed(1) + '%' }, { cls: 'num', f: (r) => r[4].toFixed(1) },
  ]);
  const maxP = d3.max(GSC_PAGES, (r) => r[1]);
  fillTable('gsc-pages', GSC_PAGES, [
    { cls: 'txt', f: (r) => r[0] }, { cls: 'num bar', w: (r) => (r[1] / maxP * 100).toFixed(1) + '%', f: (r) => fmt(r[1]) },
    { cls: 'num', f: (r) => fmt(r[2]) }, { cls: 'num', f: (r) => r[3].toFixed(1) },
  ]);
}
// quarter chosen on the Analytics tabs (Google Analytics data exists per quarter only)
const GA_Q = { sites: QS, ai: ['Q3 2026', 'Q2 2026'], pages: ['Q3 2026'], winners: ['Q3 2026'] };
const PREV_Q = { 'Q3 2026': 'Q2 2026', 'Q2 2026': 'Q1 2026' };
let gaQ = 'Q3 2026';
const qLabel = (q) => 'רבעון ' + q.slice(1, 2) + ' ' + q.slice(3);
const partialQ = (q) => q === 'Q3 2026' || q === 'Q3 2025';
const markHead = (id, qOf, q) => $(id).querySelectorAll('thead th').forEach((th, i) => { th.className = (i ? 'num' : '') + (qOf(i) === q ? ' q3' : ''); });

function renderSites() {
  const q = gaQ, pq = PREV_Q[q];
  $('sites-q-label').textContent = 'Google Analytics · ' + qLabel(q) + (partialQ(q) ? ' · אתר ראשי 1.7–29.8' : '');
  const he = ga('he', q), en = ga('en', q), heP = pq && ga('he', pq), enP = pq && ga('en', pq);
  const prev = (v) => pq ? ['רבעון קודם ', pv(v)] : ['אין נתוני רבעון קודם בדוח'];
  const st = $('site-tiles'); st.replaceChildren();
  tile(st, 'אתר עברית · מבקרים ייחודיים', fmt(he.u), prev(pq && fmt(heP.u)));
  tile(st, 'אתר עברית · סשנים', fmt(he.s), prev(pq && fmt(heP.s)));
  tile(st, 'אתר עברית · זמן שהייה לסשן', mmss(he.d), [...prev(pq && mmss(heP.d)), ' · ממוצע שוק 1:30–3:00']);
  tile(st, 'אתר אנגלית · מבקרים ייחודיים', fmt(en.u), [...prev(pq && fmt(enP.u)), ' · סשנים ', pv(fmt(en.s))]);
  tile(st, 'אתר אנגלית · זמן שהייה לסשן', mmss(en.d), [...prev(pq && mmss(enP.d)), ' · ממוצע שוק 1:30–3:00']);
  tile(st, 'אתר AI · מבקרים ייחודיים', fmt(ga('ai', q).u), ['אתר BC ', pv(fmt(ga('bc', q).u)), q === 'Q3 2025' ? ' · נתונים חלקיים' : ' · ISERD טרם נמדד']);
  const sites = [...new Set(GA_SITES.map((r) => r.site))];
  fillTable('sites-table', sites, [
    { f: (s) => ga(s, q).name + (s === 'ai' || s === 'bc' ? ' *' : '') },
    ...QS.flatMap((qq) => [{ cls: qq === q ? 'num q3' : 'num', f: (s) => fmt(ga(s, qq).s) }, { cls: qq === q ? 'num q3' : 'num', f: (s) => fmt(ga(s, qq).u) }]),
  ]);
  markHead('sites-table', (i) => QS[(i - 1) >> 1], q);
  fillTable('dur-table', ['he', 'en'], [{ f: (s) => ga(s, q).name }, ...QS.map((qq) => ({ cls: qq === q ? 'num q3' : 'num', f: (s) => mmss(ga(s, qq).d) }))]);
  markHead('dur-table', (i) => QS[i - 1], q);
}
function renderAi() {
  const q = GA_Q.ai.includes(gaQ) ? gaQ : 'Q3 2026', is3 = q === 'Q3 2026';
  $('ai-q-label').textContent = 'Google Analytics · ' + qLabel(q) + (is3 ? ' · 1.7–29.8 (60 ימים)' : ' (91 ימים)');
  const s = is3 ? aiTot.s3 : aiTot.s2, u = is3 ? aiTot.u3 : aiTot.u2, daily = is3 ? aiDaily.q3 : aiDaily.q2;
  const at = $('ai-tiles'); at.replaceChildren();
  tile(at, 'סשנים מכלי AI · ' + qLabel(q), fmt(s), is3 ? [pv(fmt(u)), ' משתמשים · רבעון קודם ', pv(fmt(aiTot.s2)), ' סשנים'] : [pv(fmt(u)), ' משתמשים']);
  tile(at, 'ממוצע סשנים ליום', d3.format('.0f')(daily), is3 ? [chipEl(aiChg), ' מול ', pv(d3.format('.0f')(aiDaily.q2)), ' ביום ברבעון הקודם'] : ['91 ימי מדידה · אין נתוני רבעון קודם בדוח']);
  tile(at, 'נתח מכלל הסשנים באתר העברי', pct1(s / ga('he', q).s), is3 ? ['רבעון קודם ', pv(pct1(aiTot.s2 / ga('he', 'Q2 2026').s))] : ['מתוך ' + fmt(ga('he', q).s) + ' סשנים']);
  tile(at, 'חלק ChatGPT מתנועת ה־AI', pct0(GA_AI[0][is3 ? 's3' : 's2'] / s), ['המקור המוביל מבין כלי ה־AI']);
  const k = is3 ? 's3' : 's2', maxS = d3.max(GA_AI, (r) => r[k]);
  const aiRows = [...GA_AI, { ch: 'סה"כ', ...aiTot, total: true }].map((r) => ({ ...r, chg: (r.s3 / AI_DAYS.q3) / (r.s2 / AI_DAYS.q2) - 1 }));
  const c = (on, bar) => (r) => 'num' + (on ? ' q3' : '') + (on && bar && !r.total ? ' bar' : '');
  fillTable('ai-table', aiRows, [
    { f: (r) => r.ch },
    { cls: c(is3, true), w: (r) => is3 && !r.total ? (r.s3 / maxS * 100).toFixed(1) + '%' : '0%', f: (r) => fmt(r.s3) },
    { cls: c(is3), f: (r) => fmt(r.u3) },
    { cls: c(!is3, true), w: (r) => !is3 && !r.total ? (r.s2 / maxS * 100).toFixed(1) + '%' : '0%', f: (r) => fmt(r.s2) },
    { cls: c(!is3), f: (r) => fmt(r.u2) },
    { cls: (r) => 'num lead ' + (r.chg >= 0 ? 'up' : 'down'), f: (r) => signed(r.chg) },
  ], (r) => r.total ? 'total' : '');
  markHead('ai-table', (i) => (i === 1 || i === 2) ? 'Q3 2026' : (i === 3 || i === 4) ? 'Q2 2026' : null, q);
}
function drawHeUsers() {
  const rows = QS.slice().reverse().map((q) => ga('he', q));
  barChart($('he-users-chart'), rows, { x: (d) => d.q, y: (d) => d.u, label: (d) => d.q, hi: (d) => d.q === gaQ, fmtY: (v) => d3.format('~s')(v) });
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
  renderSites(); renderAi();
  if (tab === 'sites') drawHeUsers();
  updatePeriodUi();
}
const effQ = () => (GA_Q[tab] || []).includes(gaQ) ? gaQ : (GA_Q[tab] || ['Q3 2026'])[0];
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
    $('pp-note').textContent = opts.length > 1 ? 'נתוני Google Analytics בדוח זה זמינים לפי רבעון. ברבעון 3 2026 האתר הראשי נמדד 1.7–29.8.' : 'לנתונים אלה בדוח זמין רבעון 3 2026 בלבד (1.7–29.8).';
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
  $('gsc-coverage').textContent = 'נתונים זמינים עד ' + heDate(DATA_END) + (start < COVER.en[0] || end > COVER.en[1] ? '; לאתר האנגלית מ־' + heDate(COVER.en[0]) + ' עד ' + heDate(COVER.en[1]) + '.' : '.');

  const m = compare('main', start, end), en = compare('en', start, end);
  const prevTxt = (r) => r.prev ? ' מול ' + rangeText(r.prevRange[0], r.prevRange[1]) : '';
  $('h-clicks').textContent = fmt(m.cur.clicks);
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
  $('t-en').textContent = en.cur.days_with_data ? fmt(en.cur.clicks) : '—';
  setChip($('c-en'), en.prev && en.cur.days_with_data ? en.cur.clicks / en.prev.clicks - 1 : null);
  $('p-en').textContent = en.prev ? 'תקופה קודמת ' + fmt(en.prev.clicks) : '';
  drawPeriodCharts();
}
const GLABEL = { day: 'לפי יום', week: 'לפי שבוע (מיום ראשון)', month: 'לפי חודש' };
function drawPeriodCharts() {
  const { start, end } = state, g = autoGrouping(start, end);
  const lab = g === 'month' ? (d) => d3.utcFormat('%b %y')(toDate(d.period)) : (d) => d3.utcFormat('%-d.%-m')(toDate(d.period));
  const tipLab = g === 'month' ? lab : g === 'week' ? (d) => 'שבוע מ־' + heDate(d.period) : (d) => heDate(d.period);
  for (const [scope, box, note] of [['main', 'main-chart', 'main-chart-note'], ['en', 'en-chart', 'en-chart-note']]) {
    const rows = series(scope, start, end, g);
    $(note).textContent = GLABEL[g] + ' · ' + rangeText(start, end) + (scope === 'main' ? ' · כולל האזור האישי ואתר האנגלית.' : '.');
    barChart($(box), rows, { x: (d) => d.period, y: (d) => d.clicks, label: lab, tipLabel: tipLab, hi: () => true, fmtY: (v) => d3.format('~s')(v) });
  }
}

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
try { const q = localStorage.getItem('iia-q'); if (QS.includes(q)) gaQ = q; } catch (err) {}
renderStatic();
renderSites();
renderAi();
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
let sample = null, toolsOk = false, ctl = null, busy = false;

const monthly = (scope) => series(scope, COVER[scope][0], COVER[scope][1], 'month').map((r) => ({ month: r.period.slice(0, 7), clicks: r.clicks, impressions: r.impressions }));
function context() {
  return [
    'אתה "סוכן הנתונים" של דוח הדיגיטל של רשות החדשנות (innovationisrael.org.il). אתה עונה למי שצופה בדשבורד, בעברית, בשפה פשוטה וברורה.',
    'כללים: ענה רק על סמך הנתונים שלהלן ותוצאות הכלים. אל תמציא מספרים. אם אין נתון, אמור זאת ואמור מה כן קיים. ציין תמיד את התקופה ואת המקור (Google Analytics או Google Search Console). הדגש מספרים חשובים ב־**כוכביות**. השתמש ברשימות עם "- " כשזה עוזר. היה תמציתי: עד כ־150 מילים, אלא אם התבקש פירוט.',
    'הערות מתודולוגיות: (1) נתוני Google Analytics של האתר הראשי ברבעון 3 2026 הם ל־1.7–29.8 בלבד (60 ימים) עקב תקלת מדידה; השוואות AI נעשות לפי ממוצע יומי (60 מול 91 ימים). (2) מסוף 2025 באנר עוגיות גורם לאנליטיקס למדוד כמחצית עד שני שלישים מהכניסות. (3) ברבעון 3 2025 נכללה תנועת ניוזלטר (כ־112 אלף סשנים), ולכן 2025 אינה בת השוואה ישירה. (4) Search Console נמדד בצד גוגל ומלא לכל התקופות. (5) מיקום ממוצע נמוך יותר הוא טוב יותר.',
    'היום: 28.10.2026. התקופה שהצופה בחר כרגע בדשבורד: ' + state.start + ' עד ' + state.end + '.',
    'כיסוי Search Console יומי: כל הדומיין ' + COVER.main.join(' עד ') + '; אתר האנגלית (/en) ' + COVER.en.join(' עד ') + '. ' + (toolsOk ? 'לחישוב מדויק של כל טווח תאריכים השתמש בכלים gsc_summary ו־gsc_series. אם הצופה מבקש להציג תקופה בדשבורד, השתמש ב־set_dashboard_period.' : 'לחישוב טווחים השתמש בסיכומים החודשיים שלהלן.'),
    'Search Console חודשי, כל הדומיין: ' + JSON.stringify(monthly('main')),
    'Search Console חודשי, אתר אנגלית: ' + JSON.stringify(monthly('en')),
    'Search Console, ביטויים מובילים ברבעון 3 2026 [ביטוי, קליקים, חשיפות, CTR%, מיקום]: ' + JSON.stringify(GSC_QUERIES),
    'Search Console, דפים מובילים ברבעון 3 2026 [דף, קליקים, חשיפות, מיקום]: ' + JSON.stringify(GSC_PAGES),
    'Google Analytics לפי אתר ורבעון (s=סשנים, u=משתמשים, d=זמן שהייה ממוצע לסשן בשניות): ' + JSON.stringify(GA_SITES),
    'Google Analytics, כניסות מכלי AI לאתר הראשי (s3/u3 = רבעון 3 2026, 1.7–29.8, 60 ימים; s2/u2 = רבעון 2 2026, 91 ימים): ' + JSON.stringify(GA_AI) + '. עמודי נחיתה מובילים מ־AI: מסלול תנופה, עמוד הבית, Pre-Seed, מסלול מהיר להארכת ה־Runway.',
    'Google Analytics, דפים נצפים 1.7–29.8.2026 [דף, צפיות, משתמשים]: עברית ' + JSON.stringify(GA_PAGES.he) + '; אנגלית ' + JSON.stringify(GA_PAGES.en),
    'Google Analytics, דפי זוכים 1.7–29.8.2026 [דף, סשנים, משתמשים]: ' + JSON.stringify(GA_WINNERS),
  ].join('\n\n');
}
const dateArg = (v, name) => { const s = String(v || ''); if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error(name + ' must be YYYY-MM-DD'); return s; };
const scopeArg = (v) => { const s = String(v || 'main'); if (s !== 'main' && s !== 'en') throw new Error('scope must be "main" or "en"'); return s; };
const TOOLS = [
  {
    name: 'gsc_summary',
    description: 'Google Search Console totals for any date range: clicks, impressions, CTR (0-1), impression-weighted average position, and the same for the previous period (equal length, or the preceding whole months when the range is whole months; null if not covered). scope "main" = whole domain, "en" = English site.',
    inputSchema: { type: 'object', properties: { start: { type: 'string', description: 'YYYY-MM-DD' }, end: { type: 'string', description: 'YYYY-MM-DD' }, scope: { type: 'string', enum: ['main', 'en'] } }, required: ['start', 'end'] },
    execute: (a) => { const s = dateArg(a.start, 'start'), e = dateArg(a.end, 'end'); const r = compare(scopeArg(a.scope), s, e); return { range: [s, e], current: r.cur, previous_range: r.prevRange, previous: r.prev }; },
  },
  {
    name: 'gsc_series',
    description: 'Google Search Console clicks and impressions over time for a date range, grouped by "day", "week" (weeks start Sunday) or "month". Returns at most 120 rows; use a coarser grouping for long ranges.',
    inputSchema: { type: 'object', properties: { start: { type: 'string' }, end: { type: 'string' }, scope: { type: 'string', enum: ['main', 'en'] }, grouping: { type: 'string', enum: ['day', 'week', 'month'] } }, required: ['start', 'end', 'grouping'] },
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
askBtn.addEventListener('click', () => { chat.hidden = false; askBtn.hidden = true; if (!log.children.length) { addMsg('note-msg', 'הסוכן עונה על סמך הנתונים שבדשבורד. השאלות נשלחות ל־Claude דרך החשבון שלכם.'); showSuggestions(); } input.focus(); });
$('chat-close').addEventListener('click', () => { chat.hidden = true; askBtn.hidden = false; askBtn.focus(); });

(async () => {
  try {
    sample = window.claude && window.claude.use ? await window.claude.use('sample') : null;
    if (!sample) return;
    const lim = await sample.limits().catch(() => null);
    toolsOk = !!(lim && lim.tools && lim.tools.maxCount >= TOOLS.length);
    askBtn.hidden = false;
  } catch (err) { sample = null; }
})();
})();
