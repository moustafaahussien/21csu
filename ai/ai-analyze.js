/* =====================================================================
   منصة المعلم الذكي — محلل نتائج الطلاب (يعمل داخل المتصفح بالكامل)
   ===================================================================== */
(function () {
'use strict';
const A = window.AI, esc = A.esc, $ = A.$;
A.shell('analyze');
A.applyLang();

const LET = { 'أ':'a','ا':'a','إ':'a','آ':'a','ب':'b','ج':'c','د':'d','هـ':'e','ه':'e','a':'a','b':'b','c':'c','d':'d','e':'e' };
const LETAR = { a:'أ', b:'ب', c:'ج', d:'د', e:'هـ' };
const norm = v => String(v == null ? '' : v).trim();
const normL = v => LET[norm(v).toLowerCase()] || norm(v).toLowerCase();
const label = s => /^(المهارة|مهارة|الناتج|skill|outcome)$/i.test(norm(s)) ? 'skill' : /^(الدرجة|الدرجة العظمى|العظمى|max|points)$/i.test(norm(s)) ? 'max' : /^(المفتاح|الإجابة الصحيحة|key|answer key)$/i.test(norm(s)) ? 'key' : '';

/* ------------------------- القراءة ------------------------- */
function parseText(txt) {
  const lines = txt.replace(/\r/g, '').split('\n').filter(l => l.trim());
  if (!lines.length) return [];
  const sep = lines[0].indexOf('\t') >= 0 ? '\t' : (lines[0].split(';').length > lines[0].split(',').length ? ';' : ',');
  return lines.map(l => l.split(sep).map(c => c.replace(/^"|"$/g, '')));
}
function analyze(rows) {
  rows = rows.filter(r => r.some(c => norm(c) !== ''));
  if (rows.length < 2) throw new Error('الجدول يحتاج صف عناوين وطالباً واحداً على الأقل.');
  const head = rows[0].slice(1).map(norm);
  let nq = head.length; while (nq > 0 && !head[nq - 1]) nq--;
  if (!nq) throw new Error('لم نجد أعمدة أسئلة في الصف الأول.');
  const Q = head.slice(0, nq).map((h, i) => ({ name: h || ('س' + (i + 1)), skill:'', max:1, key:'' }));
  let i = 1;
  while (i < rows.length && label(rows[i][0])) {
    const kind = label(rows[i][0]);
    Q.forEach((q, j) => { const v = norm(rows[i][j + 1]); if (kind === 'skill') q.skill = v; else if (kind === 'max') q.max = Number(v) > 0 ? Number(v) : 1; else if (kind === 'key') q.key = normL(v); });
    i++;
  }
  const hasKey = Q.some(q => q.key);
  const S = [];
  for (; i < rows.length; i++) {
    const code = norm(rows[i][0]) || ('ط' + (S.length + 1));
    const raw = Q.map((q, j) => norm(rows[i][j + 1]));
    const pts = Q.map((q, j) => {
      const v = raw[j];
      if (hasKey && q.key) return normL(v) === q.key ? q.max : 0;
      const n = Number(String(v).replace(',', '.'));
      return isFinite(n) && v !== '' ? Math.max(0, Math.min(q.max, n)) : 0;
    });
    S.push({ code, raw, pts });
  }
  if (!S.length) throw new Error('لا توجد صفوف طلاب بعد صفوف المهارة/الدرجة/المفتاح.');
  const maxTot = Q.reduce((a, q) => a + q.max, 0);
  S.forEach(s => { s.tot = s.pts.reduce((a, b) => a + b, 0); s.pct = s.tot / maxTot * 100; });
  // تحليل الأسئلة + معامل التمييز (أعلى وأدنى 27%)
  const sorted = S.slice().sort((a, b) => b.pct - a.pct), g = Math.max(1, Math.round(S.length * 0.27));
  const up = sorted.slice(0, g), lo = sorted.slice(-g);
  Q.forEach((q, j) => {
    q.p = S.reduce((a, s) => a + s.pts[j], 0) / (S.length * q.max) * 100;
    q.disc = S.length >= 6 ? (up.reduce((a, s) => a + s.pts[j], 0) / (g * q.max)) - (lo.reduce((a, s) => a + s.pts[j], 0) / (g * q.max)) : null;
    if (hasKey && q.key) {
      const c = {}; S.forEach(s => { const v = normL(s.raw[j]); if (v && v !== q.key) c[v] = (c[v] || 0) + 1; });
      const top = Object.keys(c).sort((a, b) => c[b] - c[a])[0];
      q.dist = top ? { opt: top, pct: c[top] / S.length * 100 } : null;
    }
  });
  // المهارات
  const skills = {};
  Q.forEach((q, j) => { if (!q.skill) return; (skills[q.skill] = skills[q.skill] || { name:q.skill, idx:[] }).idx.push(j); });
  const SK = Object.values(skills).map(k => {
    const mx = k.idx.reduce((a, j) => a + Q[j].max, 0);
    k.p = S.reduce((a, s) => a + k.idx.reduce((b, j) => b + s.pts[j], 0), 0) / (S.length * mx) * 100;
    k.low = S.filter(s => k.idx.reduce((b, j) => b + s.pts[j], 0) / mx * 100 < 50).map(s => s.code);
    return k;
  }).sort((a, b) => a.p - b.p);
  const pcts = S.map(s => s.pct).sort((a, b) => a - b);
  const mean = pcts.reduce((a, b) => a + b, 0) / pcts.length;
  const median = pcts.length % 2 ? pcts[(pcts.length - 1) / 2] : (pcts[pcts.length / 2 - 1] + pcts[pcts.length / 2]) / 2;
  const sd = Math.sqrt(pcts.reduce((a, b) => a + (b - mean) * (b - mean), 0) / pcts.length);
  const names = S.filter(s => /^[؀-ۿa-zA-Z]{2,}\s+[؀-ۿa-zA-Z]{2,}/.test(s.code)).length;
  return { Q, S, SK, hasKey, maxTot, mean, median, sd, min: pcts[0], max: pcts[pcts.length - 1], names };
}

/* ------------------------- العرض ------------------------- */
const f1 = n => (Math.round(n * 10) / 10).toLocaleString('en-US');
const diff = p => p >= 80 ? ['سهل', 'd-easy'] : p >= 50 ? ['متوسط', 'd-mid'] : ['صعب', 'd-hard'];
const decision = p => p < 50 ? ['إعادة تدريس للفصل كله', 'var(--red)'] : p < 80 ? ['دعم لمجموعة', 'var(--orange)'] : ['متقن — إثراء وتقدم', 'var(--green)'];
function render(R) {
  const { Q, S, SK } = R;
  const G = [['علاج', S.filter(s => s.pct < 50), 'var(--red)', 'أقل من 50%'], ['دعم', S.filter(s => s.pct >= 50 && s.pct < 80), 'var(--orange)', '50% – 79%'], ['إثراء', S.filter(s => s.pct >= 80), 'var(--green)', '80% فأكثر']];
  const hardQ = Q.filter(q => q.p < 50), weakDisc = Q.filter(q => q.disc != null && q.disc < 0.2);
  const reco = [];
  if (SK.length) SK.filter(k => k.p < 50).forEach(k => reco.push('مهارة «' + k.name + '» إتقانها ' + f1(k.p) + '% ← أعد تدريسها للفصل كله بنشاط مختلف (تمثيل بصري أو عملي)، ثم بطاقة خروج من 3 أسئلة لقياس التحسن.'));
  if (SK.length) SK.filter(k => k.p >= 50 && k.p < 80).forEach(k => reco.push('مهارة «' + k.name + '» إتقانها ' + f1(k.p) + '% ← مجموعة دعم صغيرة للطلاب: ' + (k.low.slice(0, 12).join('، ') || '—') + '.'));
  Q.filter(q => q.dist && q.dist.pct >= 30).forEach(q => reco.push('السؤال «' + q.name + '»: البديل (' + (LETAR[q.dist.opt] || q.dist.opt) + ') اختاره ' + f1(q.dist.pct) + '% — راجع المفهوم الخاطئ الذي يمثله هذا البديل وناقشه صفياً.'));
  if (weakDisc.length) reco.push('أسئلة تمييزها ضعيف (' + weakDisc.map(q => q.name).join('، ') + ') — راجع صياغتها أو مفتاحها قبل إعادة استخدامها.');
  if (G[2][1].length) reco.push('مجموعة الإثراء (' + G[2][1].length + ' طالباً): مهام تحدٍّ نوعية — استخدم برومبتات «إثراء الطلاب الموهوبين».');
  if (!reco.length) reco.push('الأداء متوازن؛ استمر في التقويم التكويني وتابع المهارات القريبة من 80%.');
  const summaryAI = 'نتائج اختبار (الطلاب برموز فقط): ' + S.length + ' طالباً، المتوسط ' + f1(R.mean) + '%.\n' +
    (SK.length ? 'إتقان المهارات: ' + SK.map(k => k.name + ' ' + f1(k.p) + '%').join('، ') + '.\n' : '') +
    'الأسئلة الصعبة (<50%): ' + (hardQ.map(q => q.name + ' ' + f1(q.p) + '%').join('، ') || 'لا يوجد') + '.\n' +
    'المطلوب: صمم خطة تدخل علاجية لمدة أسبوعين للمهارات الأضعف، بأهداف أسبوعية وأنشطة وتقييم قبلي وبعدي، دون أي استنتاجات شخصية عن الطلاب.';
  $('#out').innerHTML =
    (R.names ? '<div class="banner bad no-print">⚠️ يبدو أن ' + R.names + ' صفاً يحتوي أسماء طلاب. التحليل هنا لا يرفع البيانات، لكن استبدل الأسماء برموز قبل مشاركة التقرير أو استخدامه في أي أداة أخرى.</div>' : '') +
    '<div class="glass" style="padding:20px"><div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between"><h2 style="font-family:var(--display);font-weight:900">📋 تقرير تحليل النتائج</h2>' +
    '<div class="no-print" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm ghost" type="button" id="cpAI">📋 ملخص لوكيل «محلل النتائج»</button><button class="btn sm grad" type="button" onclick="print()">🖨️ طباعة / PDF</button></div></div>' +
    '<div class="kp">' + [[S.length, 'طالباً'], [Q.length, 'سؤالاً'], [f1(R.mean) + '%', 'المتوسط'], [f1(R.median) + '%', 'الوسيط'], [f1(R.sd), 'الانحراف المعياري'], [f1(R.max) + '%', 'أعلى نتيجة'], [f1(R.min) + '%', 'أدنى نتيجة']]
      .map(k => '<div class="stat" style="text-align:center"><b>' + k[0] + '</b><span>' + k[1] + '</span></div>').join('') + '</div>' +
    (SK.length ? '<div class="sub-h">🎯 إتقان المهارات</div><div class="bars">' + SK.map(k => { const d = decision(k.p);
      return '<div class="bar-row" style="grid-template-columns:minmax(120px,220px) 1fr 60px"><span>' + esc(k.name) + ' <small style="color:' + d[1] + ';font-weight:700">— ' + d[0] + '</small></span><span class="tr"><i style="width:' + Math.max(2, k.p) + '%;--c:' + d[1] + '"></i></span><b>' + f1(k.p) + '%</b></div>'; }).join('') + '</div>' : '<p class="note">أضف صف «المهارة» لتحليل الإتقان حسب المهارة.</p>') +
    '<div class="sub-h">❓ تحليل الأسئلة</div><div class="tablewrap"><table class="recs"><tr><th>السؤال</th>' + (SK.length ? '<th>المهارة</th>' : '') + '<th>نسبة الإتقان</th><th>الصعوبة</th><th>التمييز</th>' + (R.hasKey ? '<th>البديل الخاطئ الأشيع</th>' : '') + '</tr>' +
      Q.map(q => { const d = diff(q.p); return '<tr><td class="tl">' + esc(q.name) + '</td>' + (SK.length ? '<td>' + esc(q.skill || '—') + '</td>' : '') + '<td>' + f1(q.p) + '%</td><td class="' + d[1] + '">' + d[0] + '</td><td>' + (q.disc == null ? '—' : f1(q.disc) + (q.disc < 0.2 ? ' ⚠️' : '')) + '</td>' +
        (R.hasKey ? '<td>' + (q.dist ? (LETAR[q.dist.opt] || esc(q.dist.opt)) + ' (' + f1(q.dist.pct) + '%)' : '—') + '</td>' : '') + '</tr>'; }).join('') + '</table></div>' +
    '<p class="note">الصعوبة: سهل ≥ 80% • متوسط 50–79% • صعب < 50%. التمييز = (إتقان أعلى 27%) − (إتقان أدنى 27%)؛ أقل من 0.2 ضعيف' + (S.length < 6 ? ' (يحتاج 6 طلاب على الأقل)' : '') + '.</p>' +
    '<div class="sub-h">👥 مجموعات الاحتياج (حسب النتيجة الكلية)</div><div class="grp3">' + G.map(gr => '<div style="--c:' + gr[2] + '"><h4>' + gr[0] + ' — ' + gr[1].length + '</h4><small style="color:var(--muted)">' + gr[3] + '</small><div class="codes">' + gr[1].map(s => '<span>' + esc(s.code) + ' · ' + Math.round(s.pct) + '%</span>').join('') + '</div></div>').join('') + '</div>' +
    (SK.filter(k => k.low.length).length ? '<div class="sub-h">🧩 طلاب يحتاجون دعماً في مهارة محددة (أقل من 50%)</div><div class="tablewrap"><table class="recs"><tr><th>المهارة</th><th>الطلاب</th></tr>' + SK.filter(k => k.low.length).map(k => '<tr><td class="tl">' + esc(k.name) + '</td><td><div class="codes">' + k.low.map(c => '<span>' + esc(c) + '</span>').join('') + '</div></td></tr>').join('') + '</table></div>' : '') +
    '<div class="sub-h">💡 التدخلات المقترحة</div><ul class="reco" style="padding-inline-start:20px;color:#2f3460">' + reco.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul>' +
    '<p class="note">المجموعات مؤقتة وتتغير حسب كل مهارة — لا تستخدمها تصنيفاً ثابتاً للطلاب. التوصيات قواعد عامة؛ القرار التربوي للمعلم.</p></div>';
  $('#cpAI').onclick = e => A.copy(summaryAI, e.currentTarget);
  $('#out').scrollIntoView({ behavior:'smooth' });
}

/* ------------------------- التشغيل ------------------------- */
let rowsFromFile = null;
function run() {
  $('#err').textContent = '';
  try {
    const rows = rowsFromFile || parseText($('#paste').value);
    if (!rows || !rows.length) throw new Error('ارفع ملفاً أو الصق الجدول أولاً.');
    render(analyze(rows));
  } catch (e) { $('#err').textContent = e.message; }
}
async function takeFile(f) {
  $('#err').textContent = ''; rowsFromFile = null;
  try {
    if (/\.(csv|tsv|txt)$/i.test(f.name)) { rowsFromFile = parseText(await f.text()); }
    else {
      if (!window.XLSX) throw new Error('تعذّر تحميل قارئ ملفات Excel — احفظ الملف بصيغة CSV أو الصق الجدول.');
      const wb = XLSX.read(await f.arrayBuffer(), { type:'array' });
      rowsFromFile = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header:1, defval:'', raw:false });
    }
    $('#drop').querySelector('b').textContent = '✓ ' + f.name;
    $('#paste').value = '';
    run();
  } catch (e) { $('#err').textContent = e.message; }
}
const SAMPLE = 'الطالب\tس1\tس2\tس3\tس4\tس5\tس6\tس7\tس8\nالمهارة\tالكسور\tالكسور\tالكسور\tالقياس\tالقياس\tتحويل الوحدات\tتحويل الوحدات\tتحويل الوحدات\nالمفتاح\tب\tأ\tد\tج\tب\tأ\tج\tد\n' +
  ['ط1\tب\tأ\tد\tج\tب\tب\tج\tد','ط2\tب\tأ\tج\tج\tب\tب\tب\tأ','ط3\tأ\tأ\tد\tج\tأ\tب\tب\tد','ط4\tب\tأ\tد\tج\tب\tأ\tج\tد','ط5\tب\tج\tد\tب\tب\tب\tب\tأ','ط6\tب\tأ\tد\tج\tب\tأ\tج\tب',
   'ط7\tج\tأ\tب\tج\tد\tب\tب\tأ','ط8\tب\tأ\tد\tج\tب\tب\tج\tد','ط9\tب\tب\tد\tج\tب\tب\tأ\tأ','ط10\tب\tأ\tد\tج\tب\tأ\tج\tد','ط11\tد\tأ\tد\tأ\tب\tب\tب\tأ','ط12\tب\tأ\tد\tج\tب\tب\tج\tد'].join('\n');
$('#sample').onclick = () => { rowsFromFile = null; $('#paste').value = SAMPLE; run(); };
$('#tpl').onclick = () => {
  const csv = '﻿الطالب,س1,س2,س3,س4\nالمهارة,,,,\nالدرجة,1,1,2,1\nط1,1,0,2,1\nط2,1,1,1,0\n';
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv;charset=utf-8' })); a.download = 'قالب-نتائج-الطلاب.csv'; document.body.appendChild(a); a.click(); a.remove();
};
$('#run').onclick = run;
$('#paste').addEventListener('input', () => { rowsFromFile = null; });
$('#file').onchange = e => { if (e.target.files[0]) takeFile(e.target.files[0]); };
const dz = $('#drop');
['dragover','dragenter'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('over'); }));
dz.addEventListener('dragleave', () => dz.classList.remove('over'));
dz.addEventListener('drop', e => { e.preventDefault(); dz.classList.remove('over'); if (e.dataTransfer.files[0]) takeFile(e.dataTransfer.files[0]); });
})();
