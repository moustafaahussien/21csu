/* =====================================================================
   محرك حساب مؤشرات الأداء — ملف واحد مشترك بين:
   - الواجهة (index.html) لعرض النتائج لحظياً
   - الخادم (kpi-script.gs) الذي يحسب به لقطة الإقفال الشهري بنفسه ولا يقبل نتائج من المتصفح
   أي تعديل في معادلة يُكتب هنا فقط. في Apps Script: الصق هذا الملف قبل kpi-script.gs (نفس الملف أو ملف مستقل في المشروع).
   S = { data, approvedOnly, asOfDate } — البيانات كما يعيدها buildData_ في الخادم.
   ===================================================================== */
function makeKpiEngine(S) {
'use strict';
const TYPES = {
  count:   { l:'إنجاز عددي (أنشطة/مبادرات)', table:'activities', items:'أنواع الأنشطة', formula:'الفعلي = عدد المنفذ — المستهدف المرحلي = المستهدف السنوي × نسبة المنحنى الزمني حتى اليوم — الأداء = الفعلي ÷ المرحلي، والإنجاز = الفعلي ÷ السنوي' },
  rate:    { l:'نسبة تراكمية شهرية (الأقل أفضل)', table:'events', items:'الأسباب', formula:'النسبة = مجموع الأعداد الشهرية منذ بداية العام ÷ خط الأساس × 100 — السقف المرحلي = السقف السنوي × نسبة المنحنى الزمني حتى آخر شهر مُدخل (لا يقل عن ربع السقف) — ضمن السقف = 100%، وتنخفض تدريجياً حتى 0% عند ضعفه' },
  nps:     { l:'استبانة صافي نقاط الترويج (NPS)', table:'surveys', items:'أسباب عدم الرضا', formula:'NPS = نسبة المروّجين (9–10) − نسبة المنتقدين (0–6)، من −100 إلى +100 — نسبة التحقق = النتيجة ÷ المستهدف، والسالب = 0%' },
  score:   { l:'نتيجة تقييم بالمجالات (%)', table:'assessments', items:'المجالات', formula:'نسبة التحقق = النتيجة ÷ المستهدف — تُعتمد النتيجة الرسمية فور تسجيلها، وإلا آخر تقييم' },
  amount:  { l:'مبلغ مالي تراكمي (إيرادات − مصروفات)', table:'finance', items:'', formula:'الفعلي = مجموع الإيرادات − مجموع المصروفات منذ بداية العام — المستهدف المرحلي = السنوي × نسبة المنحنى الزمني حتى نهاية آخر شهر مُدخل — الأداء = الفعلي ÷ المرحلي، والإنجاز = الفعلي ÷ السنوي' },
  ratio:   { l:'نسبة بسط ÷ مقام (الأعلى أفضل)', table:'ratios', items:'أسباب الفجوة', formula:'النسبة = مجموع البسط ÷ مجموع المقام × 100 لكل الفترات المدخلة — نسبة التحقق = النسبة ÷ المستهدف' },
  reading: { l:'قراءة دورية لقيمة رقمية', table:'readings', items:'', formula:'آخر قراءة مقارنة بالمستهدف (الأعلى أفضل: القيمة ÷ المستهدف، الأقل أفضل: ضمن المستهدف = 100%)' }
};
const STATUS = {
  done:  { l:'محقق', i:'✓' }, ahead: { l:'متقدم', i:'⇈' }, track: { l:'على المسار', i:'↗' }, risk: { l:'متأخر', i:'!' },
  off:   { l:'يحتاج تدخل', i:'✕' }, late: { l:'متأخر الإدخال', i:'⏱' }, rejected: { l:'مرفوض — بانتظار التصحيح', i:'↩' }, nodata:{ l:'لم يحن موعده', i:'–' }
};
const AP = { pending:'مدخل', approved:'معتمد', returned:'معاد للتعديل' };
const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const STALE_DAYS = 30;
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = (n, d=0) => (n == null || n === '' || !isFinite(n)) ? '—' : Number(n).toLocaleString('en-US', {maximumFractionDigits:d});
const money = n => (n == null || !isFinite(n)) ? '—' : fmt(n) + ' <small>ر.س</small>';
const N = v => (v === '' || v == null || !isFinite(v)) ? 0 : Number(v);
const signed = v => v == null ? '—' : (v > 0 ? '+' : '') + fmt(v);
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const monthLabel = m => { if(!m) return ''; const [y,mm] = m.split('-'); return MONTHS[+mm-1] + ' ' + y; };
const dateLabel = d => { if(!d) return '—'; const [y,m,dd] = d.slice(0,10).split('-'); return +dd + ' ' + MONTHS[+m-1] + ' ' + y; };
function todayStr(){ if (S.asOfDate) return S.asOfDate; const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function daysBetween(a,b){ return Math.round((new Date(b)-new Date(a))/86400000); }
const sum = (arr, f) => arr.reduce((s, x) => s + N(f(x)), 0);
const kpiById = id => (S.data.kpis || []).find(k => k.id === id);
const accById = id => (S.data.accounts || []).find(a => a.id === id);
// أصحاب البطاقات: مديرو المراحل + أي حساب إدارة عليا مكلّف بمؤشرات (المدير التنفيذي، مدير التعليم…)
const isHolder = a => a.role === 'member' || (a.role === 'admin' && (S.data.assigns || []).some(x => x.accountId === a.id));
// الهيكل التنظيمي: 1 = مديرو المراحل (فرع stages) ومشرف الدبلوما ومدير مكتب الإشراف (فرع support) • 2 = مدير التعليم • 3 = المدير التنفيذي
const levelOf = a => N(a.level) || (a.role === 'admin' ? 3 : 1);
const isExec = a => levelOf(a) >= 2;
const isStage = a => levelOf(a) === 1 && a.branch !== 'support';
const LEVEL_NAME = { 3:'المستوى الثالث — المدير التنفيذي', 2:'المستوى الثاني — مدير التعليم', 1:'المستوى الأول' };
// «يصب في»: كل مستوى يأخذ من كل المستويات التي تحته (الثالث من الثاني والأول) بلا تكرار:
// تُستخدم البيانات المدخلة مباشرة فقط، فقيمة مجمّعة عند المستوى الثاني لا تُضاف فوق مصادرها في المستوى الأول
// العائلة = config.family، أو جدول الربط أدناه، أو معرّف المؤشر نفسه
// استبانات الدبلوما خارج التجميع: طلابها ومعلموها ضمن المراحل، فضمّها يكرر نفس الأسر/الموظفين
const FAMILY = { nps:'nps', x_nps:'nps', enps:'enps', x_enps:'enps' };
const famOf = k => !k ? '' : (k.config || {}).family || FAMILY[k.id] || k.id;
const LEVEL_SHORT = { 1:'المستوى الأول', 2:'المستوى الثاني', 3:'المستوى الثالث' };
function feeders(acc) {   // من يصب في هذا الحساب: كل الحسابات في المستويات الأدنى، كلٌّ مرة واحدة
  const L = levelOf(acc);
  return L < 2 ? [] : members().filter(a => a.id !== acc.id && a.active !== false && levelOf(a) < L);
}
function rollSrc(acc, k) {
  const cfg = k.config || {}, L = levelOf(acc), fam = famOf(k);
  if (L < 2 && !cfg.rollupFrom) return null;
  const has = a => assignsOf(a.id).find(x => famOf(kpiById(x.kpiId)) === fam);
  const pool = L >= 2 ? feeders(acc) : members().filter(a => a.id !== acc.id && a.active !== false && levelOf(a) === 1);
  // بلا تكرار: يُستبعد كل مصدر قيمته نفسها مجمّعة من حسابات أدنى (موجودة أصلاً في القائمة)
  const src = pool.filter(has).filter(a => !rollSrc(a, kpiById(has(a).kpiId)));
  if (!src.length && !cfg.rollupFrom) return null;   // لا مصدر في المستويات الأدنى ← إدخال مباشر
  return { fam, src, asgOf: has };
}
const members = () => (S.data.accounts || []).filter(isHolder);
function allMonths() { const st = S.data.settings, out = []; let [y, m] = st.yearStart.slice(0,7).split('-').map(Number); const end = st.yearEnd.slice(0,7);
  for (let i = 0; i < 36; i++) { const k = y + '-' + String(m).padStart(2,'0'); out.push(k); if (k >= end) break; m++; if (m > 12) { m = 1; y++; } } return out; }
const activeMembers = () => members().filter(a => a.active !== false);
// withInactive: يشمل المؤشرات الموقوفة (لنموذج التكليف فقط) — المؤشر الموقوف لا يدخل في أي حساب لدى أي صلاحية
function assignsOf(accId, withInactive) {
  return (S.data.assigns || []).filter(a => { const k = kpiById(a.kpiId); return a.accountId === accId && k && (withInactive || k.active !== false); })
    .sort((x, y) => N(kpiById(x.kpiId).order) - N(kpiById(y.kpiId).order));
}
function recsAll(table, accId, kpiId) {
  return (S.data.records[table] || []).filter(r => r.accountId === accId && (kpiId == null || r.kpiId === kpiId));
}
function recs(table, accId, kpiId) {
  const all = recsAll(table, accId, kpiId);
  const valid = all.filter(r => r.approval !== AP.returned);   // المعاد للتعديل لا يُحتسب
  return S.approvedOnly ? valid.filter(r => r.approval === AP.approved) : valid;
}
// هل السجل داخل العام الدراسي الحالي (حسب الإعدادات)؟
function inYear(r) {
  const st = S.data.settings;
  if (S.asOfDate) { const d = r.month ? monthEnd(r.month) : r.date; if (d && d > S.asOfDate) return false; }   // لقطة شهرية: ما بعد نهاية الشهر لا يدخل
  if (!st.yearStart || !st.yearEnd) return true;
  if (r.month) return r.month >= st.yearStart.slice(0,7) && r.month <= st.yearEnd.slice(0,7);
  if (r.date) return r.date >= st.yearStart && r.date <= st.yearEnd;
  return true;
}
const unitLbl = acc => acc.unit || acc.title || acc.name;
/* =====================================================================
   محرك الحساب العام لكل نوع قياس
   ===================================================================== */
function yearFraction() {
  const st = S.data.settings, now = new Date(todayStr());
  return clamp((now - new Date(st.yearStart)) / (new Date(st.yearEnd) - new Date(st.yearStart)), 0, 1);
}
function npsOf(r){ const n = N(r.promoters)+N(r.passives)+N(r.detractors); return n ? Math.round((N(r.promoters)-N(r.detractors))/n*100) : null; }
function respRate(r){ const n = N(r.promoters)+N(r.passives)+N(r.detractors); return N(r.population) ? n/N(r.population)*100 : null; }
const genericStatus = ach => ach >= 1 ? 'done' : ach >= 0.8 ? 'risk' : 'off';
// المبادرات العددية: التحقق مقابل «المستحق حتى اليوم» (كما في المبلغ المالي) — لا يُعاقب من هو على المسار في منتصف العام
function paceAch(done, t) {
  if (!t) return 0;
  if (done >= t) return 1;
  const due = Math.min(t, Math.floor(t * yearFraction() + 1e-9));
  return due > 0 ? clamp(done / due, 0, 1) : 1;
}
const countStatus = (done, t) => { const exp = t * yearFraction(); return done >= t ? 'done' : done >= Math.floor(exp + 1e-9) ? 'track' : done >= exp * 0.5 ? 'risk' : 'off'; };
// النسبة التراكمية (الأقل أفضل): تُقيَّم على الأعلى من القيمة الحالية والإسقاط لنهاية العام
const rateAch = (rate, proj, t) => { const p = Math.max(rate, proj); return !t ? (p > 0 ? 0 : 1) : p <= t ? 1 : clamp(1 - (p - t) / t, 0, 1); };
const rateStatus = (rate, ach, t) => rate > t ? 'off' : ach >= 1 ? 'track' : ach >= 0.8 ? 'risk' : 'off';
// نسبة المتوقع من المستهدف المالي حتى نهاية الشهر m: توزيع شهري معتمد (config.phasing) إن وُجد، وإلا أيام العام الدراسي المنقضية
/* =====================================================================
   منحنى الأداء الزمني (Performance Trajectory)
   لكل مؤشر: نسبة المستهدف السنوي المفترض تحقيقها حتى كل شهر (config.trajectory = {"2026-09": 10, ...} تراكمية %).
   بدونه: المؤشرات التراكمية (العددي، المالي، النسبة التراكمية، النمو) تتوزع على أيام العام، والمؤشرات اللحظية مستهدفها المرحلي = السنوي.
   ===================================================================== */
const isCumulative = k => ['count', 'amount', 'rate'].includes(k.type) || !!(k.config || {}).growth;
function trajOf(k) {
  const c = k.config || {};
  if (c.trajectory && typeof c.trajectory === 'object' && Object.keys(c.trajectory).length) return c.trajectory;
  if (c.phasing && typeof c.phasing === 'object') {   // التوزيع الشهري القديم (أوزان) ← نسب تراكمية
    const ks = Object.keys(c.phasing).sort(), tot = sum(ks, x => c.phasing[x]); if (!(tot > 0)) return null;
    let cum = 0; const o = {}; ks.forEach(m => { cum += N(c.phasing[m]); o[m] = Math.round(cum / tot * 1000) / 10; }); return o;
  }
  return null;
}
const monthEnd = m => { const [y, mm] = String(m).split('-').map(Number); return new Date(Date.UTC(y, mm, 0)).toISOString().slice(0, 10); };
// نسبة المستهدف السنوي المفترض تحقيقها بنهاية اليوم dateStr
function planShare(k, dateStr) {
  const st = S.data.settings, s0 = Date.parse(st.yearStart), e0 = Date.parse(st.yearEnd) + 864e5;
  const at = clamp(Date.parse(String(dateStr).slice(0, 10)) + 864e5, s0, e0), tr = trajOf(k), cum = isCumulative(k);
  if (!tr) return cum ? (at - s0) / (e0 - s0) : 1;
  const pts = Object.keys(tr).sort().map(m => { const [y, mm] = m.split('-').map(Number); return [Math.min(Date.UTC(y, mm, 1), e0), clamp(N(tr[m]) / 100, 0, 1.5)]; }).filter(x => x[0] > s0);
  if (!pts.length) return cum ? (at - s0) / (e0 - s0) : 1;
  const all = [[s0, cum ? 0 : pts[0][1]]].concat(pts);
  for (let i = 1; i < all.length; i++) if (at <= all[i][0]) { const [a, va] = all[i - 1], [b, vb] = all[i]; return va + (vb - va) * (at - a) / (b - a); }
  return all[all.length - 1][1];
}
// الميزانية الشهرية بالريال (config.budget = {"2026-08": -200000, ...}) — تُقاس بها المؤشرات المالية بدل المنحنى، والسالب مسموح
function budgetOf(k) { const b = (k.config || {}).budget; return b && typeof b === 'object' && Object.keys(b).length ? b : null; }
function budgetShare(k, m) {
  const b = budgetOf(k); if (!b) return null;
  const ks = Object.keys(b), tot = sum(ks, x => b[x]); if (!tot) return null;
  return sum(ks.filter(x => x <= m), x => b[x]) / tot;   // نسبة تراكمية من المجموع (قد تكون سالبة)
}
const expectedShare = (k, m) => { const bs = budgetShare(k, m); return bs != null ? bs : planShare(k, monthEnd(m)); };
// موعد القياس: بعده بلا بيانات صالحة يُحتسب المؤشر صفراً («متأخر الإدخال»)
const GRACE_DAYS = 10;   // المهلة الافتراضية بعد نهاية شهر الموعد، وتُضبط لكل مؤشر (config.graceDays)
const graceOf = k => { const g = (k.config || {}).graceDays; return g === '' || g == null || !isFinite(g) ? GRACE_DAYS : clamp(Number(g), 0, 120); };
const addDays = (d, n) => new Date(Date.parse(d) + n * 864e5).toISOString().slice(0, 10);
function dueOf(k) {
  const c = k.config || {};
  if (/^\d{4}-\d{2}$/.test(c.dueFrom || '')) return addDays(monthEnd(c.dueFrom), graceOf(k));
  if (k.type === 'rate' || k.type === 'amount') return addDays(monthEnd(S.data.settings.yearStart.slice(0, 7)), graceOf(k));   // الشهرية: من أول شهر تلقائياً
  return null;   // العددي له قيمة دائماً (الصفر قيمة)، واللحظي بلا موعد محدد لا يُستحق
}
// الحد الأدنى للعينة في الاستبانات
const npsN = r => N(r.promoters) + N(r.passives) + N(r.detractors);
function sampleRule(k) { const c = k.config || {}, v = (x, d) => x === '' || x == null ? d : N(x); return { minN: v(c.minResponses, 30), minRate: v(c.minRate, 30) }; }
function sampleOk(k, rec) {
  if (k.type !== 'nps' || !rec) return true;
  const { minN, minRate } = sampleRule(k), rr = respRate(rec);
  return npsN(rec) >= minN && (rr == null || rr >= minRate);
}
// الأشهر التي مضى موعد إدخالها بلا سجل (المؤشرات الشهرية)
function missingMonths(o) {
  if (o.rollup || !['rate', 'amount'].includes(o.k.type)) return [];
  const have = new Set(o.list.map(r => r.month)), today = todayStr();
  const g = graceOf(o.k);
  return allMonths().filter(m => addDays(monthEnd(m), g) < today && !have.has(m));
}
// تاريخ الحكم على المؤشر: اليوم للمبادرات، وإلا تاريخ آخر بيانات (نهاية آخر شهر مُدخل)
function asOfOf(o) {
  if (o.k.type === 'count') return todayStr();
  const dOf = r => r ? (r.month ? monthEnd(r.month) : r.date || '') : '';
  if (o.rollup) { const ds = o.rollup.parts.map(p => p.o.asOf || dOf(p.r)).filter(Boolean).sort(); return ds.pop() || todayStr(); }
  if (o.rec) return dOf(o.rec);
  return dOf(o.list[o.list.length - 1]) || todayStr();
}
// الأرقام الثلاثة ← نسبتا التحقيق والانحراف والحالة (متقدم / على المسار / متأخر)
const PLAN_TOL = 0.05;
function planGrade(o) {
  const k = o.k, t = o.target, cfg = k.config || {};
  if (o.noTarget) return o;
  if (k.type === 'nps' && o.value != null && !sampleOk(k, o.last)) { o.lowSample = true; o.sampleN = npsN(o.last); o.display = o.display + ' (غير موثوق)'; }
  const due = dueOf(k); o.dueDate = due;
  o.missing = missingMonths(o);
  if (o.value == null || o.lowSample) {   // لا قيمة صالحة: لم يحن الموعد ← خارج الحساب، حان ← صفر
    const why = o.lowSample ? `عينة غير كافية (${fmt(o.sampleN)} مستجيب، الحد ${fmt(sampleRule(k).minN)} واستجابة ${fmt(sampleRule(k).minRate)}%)` : '';
    const rj = o.value == null && o.rejected && o.rejected.length ? o.rejected[o.rejected.length - 1] : null;
    if (due && todayStr() > due && rj) { Object.assign(o, { status: 'rejected', ach: 0, achYear: 0, late: true }); o.note = `بياناته أُعيدت للتعديل: «${esc(rj.reviewNote || '')}» — أعادها ${esc(rj.reviewedBy || 'الإدارة')} • يُحتسب صفراً حتى التصحيح`; }
    else if (due && todayStr() > due) { Object.assign(o, { status: 'late', ach: 0, achYear: 0, late: true }); o.note = (why ? why + ' — ' : '') + `حان موعد القياس (${dateLabel(due)}) دون بيانات صالحة • يُحتسب صفراً`; }
    else if (rj) o.note = `بياناته أُعيدت للتعديل: «${esc(rj.reviewNote || '')}»` + (due ? ` • الموعد ${dateLabel(due)}` : '');
    else if (o.lowSample) { o.status = 'nodata'; o.note = why + ' — لا يُحتسب' + (due ? ` • الموعد ${dateLabel(due)}` : ''); }
    else if (due) o.note = (o.note ? o.note + ' • ' : '') + `موعد القياس ${dateLabel(due)}`;
    return o;
  }
  const down = k.type === 'rate' || (k.type === 'reading' && k.direction === 'down');
  o.asOf = asOfOf(o);
  const bs = k.type === 'amount' ? budgetShare(k, o.asOf.slice(0, 7)) : null;
  let share = bs != null ? bs : planShare(k, o.asOf);
  if (k.type === 'rate' && !trajOf(k)) share = Math.max(share, 0.25);   // سقف الانسحاب مبكراً: لا يقل عن ربع السقف السنوي
  const v = o.value, interim = t * share, st = S.data.settings;
  // المؤشر الهابط: 100% حتى المستهدف، و0% عند «الحد غير المقبول»، وخطي بينهما؛ والحد المرحلي يتبع المنحنى مثل المستهدف
  const lim = down ? (N(cfg.failLimit) > t ? N(cfg.failLimit) : 2 * t) : null, limI = down ? lim * (isCumulative(k) ? share : 1) : null;
  const rUp = (x, tg) => tg > 0 ? Math.max(0, x) / tg : (x >= tg ? 1 : 0);
  const rDn = (x, tg, L) => x <= tg ? 1 : x >= L ? 0 : clamp(1 - (x - tg) / (L - tg), 0, 1);
  const dev = down ? interim - v : v - interim;   // موجب = أفضل من الخطة
  Object.assign(o, { actual: v, annual: t, interim, share, down, dev, failLimit: lim, failLimitI: limI, limitDefault: down && !(N(cfg.failLimit) > t), budgeted: bs != null,
    achYear: down ? rDn(v, t, lim) : (t > 0 ? Math.min(1, rUp(v, t)) : null) });
  let tol;
  if (!down && interim <= 0) {
    // مستهدف مرحلي صفر أو سالب (ميزانية تبدأ بخسارة مثلاً): النسبة بلا معنى، فيُحكم بالانحراف بالريال مقابل حجم المستهدف المفترض حتى الآن
    const ds = clamp((Date.parse(o.asOf) + 864e5 - Date.parse(st.yearStart)) / (Date.parse(st.yearEnd) + 864e5 - Date.parse(st.yearStart)), 0, 1);
    const scale = Math.max(Math.abs(t) * Math.max(ds, 0.1), 1);
    o.achInterim = null; o.ratioNA = true; o.ach = dev >= 0 ? 1 : clamp(1 + dev / scale, 0, 1); tol = PLAN_TOL * scale; o.devScale = scale;
  } else {
    o.achInterim = down ? rDn(v, interim, limI) : rUp(v, interim); o.ach = Math.min(1, o.achInterim);
    tol = Math.max(PLAN_TOL * Math.abs(interim), k.type === 'count' ? 0.5 : 0);
  }
  if (o.achYear == null) o.achYear = o.ach;   // مستهدف سنوي صفري أو سالب
  o.status = (!down && t > 0 && v >= t) ? 'done' : (down && v > t) ? 'off' : dev > tol ? 'ahead' : dev >= -tol ? 'track' : o.ach >= 0.8 ? 'risk' : 'off';
  o.bar = down ? o.ach : o.achYear;
  o.tick = !down && t > 0 && share > 0 && share < 1 ? share : null;
  if (k.type === 'rate' || k.type === 'amount') o.proj = share > 0 ? v / Math.max(share, 0.25) : null;
  if (o.missing.length) o.note = (o.note ? o.note + ' • ' : '') + `أشهر لم تُدخل: ${o.missing.map(monthLabel).join('، ')}`;
  if (o.rejected && o.rejected.length) o.note = (o.note ? o.note + ' • ' : '') + `${o.rejected.length} سجل مُعاد للتعديل غير محتسب`;
  return o;
}
// عرض قيمة بنفس وحدة المؤشر
function planFmt(o, v) {
  const k = o.k;
  if (k.type === 'nps') return signed(Math.round(v));
  if (k.type === 'rate' || k.type === 'ratio' || k.type === 'score' || k.unit === '%') return fmt(v, 1) + '%';
  return fmt(v, k.type === 'amount' ? 0 : 1);
}
// حجم الحساب (عدد طلابه من خط أساس مؤشر الانسحاب) — لترجيح متوسطات التجميع
function sizeOf(a) {
  const asg = assignsOf(a.id).find(x => { const kk = kpiById(x.kpiId); return kk && kk.type === 'rate' && kk.fin === 'attrition'; });
  return asg ? N(asg.baseline) : 0;
}
const byDate = (a, b) => (a.date || a.month) < (b.date || b.month) ? -1 : 1;
function fmtVal(k, v) { if (v == null) return '—'; if (k.type === 'nps') return signed(v); if (k.unit === '%') return fmt(v, 1) + '%'; return fmt(v, 1); }
function trendObj(delta, goodWhenUp, text) {
  if (delta == null || !isFinite(delta)) return null;
  if (Math.abs(delta) < 1e-9) return { cls:'flat', icon:'▬', text };
  const up = delta > 0, good = up === goodWhenUp;
  return { cls: good ? 'good' : 'bad', icon: up ? '▲' : '▼', text };
}

function computeKpi(acc, asg) { return planGrade(computeKpiRaw_(acc, asg)); }
function computeKpiRaw_(acc, asg) {
  const k = kpiById(asg.kpiId), cfg = k.config || {}, T = TYPES[k.type];
  const t = N(asg.target);
  const all = recsAll(T.table, acc.id, k.id);
  const valid = all.filter(r => r.approval !== AP.returned);   // السجل المعاد للتعديل (المرفوض) لا يدخل في أي حساب
  const hist = (S.approvedOnly ? valid.filter(r => r.approval === AP.approved) : valid).slice().sort(byDate);
  const list = hist.filter(inYear);   // قيمة المؤشر من سجلات العام الحالي فقط
  const prevOf = r => { const i = hist.indexOf(r); return i > 0 ? hist[i-1] : null; };   // المقارنة مع القياس السابق ولو من عام سابق
  const o = { k, asg, weight:N(asg.weight), target:t, pending: all.filter(r => r.approval === AP.pending).length,
    returned: all.filter(r => r.approval === AP.returned).length, rejected: all.filter(r => r.approval === AP.returned && inYear(r)), list, value:null, display:'—', ach:0, status:'nodata', note:'', trend:null };
  const unit = k.unit ? ' ' + k.unit : '';
  const roll = rollSrc(acc, k);
  if (roll) {
    // مؤشر مجمّع من المستوى الأول (مصدر واحد للحقيقة): لا يُدخل له شيء، ويُحسب من بيانات المراحل نفسها
    const parts = roll.src.map(a => ({ a, o: computeKpi(a, roll.asgOf(a)) }));
    const got = parts.filter(p => p.o.value != null), n = got.length;
    const names = [...new Set(roll.src.map(a => roll.asgOf(a).kpiId))].map(id => kpiById(id).name);
    const lv = [...new Set(roll.src.map(levelOf))].sort();
    o.rollup = { names, levelTxt: lv.length > 1 ? 'المستويات ' + lv.map(x => ({ 1:'الأول', 2:'الثاني' })[x]).join(' و') : LEVEL_SHORT[lv[0] || 1], parts: got.map(p => ({ a: p.a, o: p.o, r: p.o.last })), total: roll.src.length, missing: parts.filter(p => p.o.value == null).map(p => p.a) };
    o.list = []; o.pending = 0; o.returned = 0;
    const of = `${n} من ${roll.src.length} حسابات`;
    if (k.type === 'nps') {
      o.targetLbl = 'المستهدف ' + signed(t);
      if (n) {
        // جولة واحدة لكل الحسابات: آخر جولة مسجّلة، ومن لم يُقِسها يُعدّ «لم يُقِس بعد» (لا تُخلط جولات مختلفة)
        const round = got.map(p => p.o.last).sort(byDate).pop().round || '';
        const pick = p => { if (!round) return p.o.last; const m = p.o.list.filter(r => r.round === round); return m.length ? m[m.length - 1] : null; };
        const use = got.map(p => ({ a: p.a, o: p.o, r: pick(p) })).filter(x => x.r);
        o.rollup.parts = use; o.rollup.missing = o.rollup.missing.concat(got.filter(p => !pick(p)).map(p => p.a)); o.rollup.round = round;
        const reasons = {}; use.forEach(x => Object.entries(x.r.reasons || {}).forEach(([nm, v]) => reasons[nm] = (reasons[nm] || 0) + N(v)));
        const pool = { promoters: sum(use, x => x.r.promoters), passives: sum(use, x => x.r.passives), detractors: sum(use, x => x.r.detractors), population: sum(use, x => x.r.population), reasons };
        const v = npsOf(pool), rr = use.every(x => N(x.r.population)) ? respRate(pool) : null;
        o.value = v; o.display = signed(v); o.ach = t > 0 ? clamp(Math.max(0, v) / t, 0, 1) : (v >= t ? 1 : 0); o.status = genericStatus(o.ach); o.last = pool;
        o.note = `مجمّع من ${use.length} من ${roll.src.length} حسابات${round ? ' • ' + esc(round) : ''} • ${fmt(pool.promoters + pool.passives + pool.detractors)} مستجيب`; o.lowResp = rr != null && rr < 30;
      }
    } else if (k.type === 'count') {
      const tot = sum(got, p => p.o.value), avg = roll.src.length ? tot / roll.src.length : 0;
      o.targetLbl = 'المستهدف ' + fmt(t) + unit + ' لكل حساب'; o.value = avg; o.display = fmt(avg, 1); o.total = tot;
      o.ach = paceAch(avg, t); o.bar = t ? clamp(avg / t, 0, 1) : 0; o.tick = yearFraction(); o.status = countStatus(avg, t);
      o.note = `${fmt(tot)} منفذة في ${roll.src.length} حسابات — المتوسط لكل حساب (من لم ينفّذ يُحسب صفراً)`;
    } else if (k.type === 'rate') {
      o.targetLbl = 'السقف ' + fmt(t) + '%';
      if (n) {
        const sC = sum(got, p => p.o.sumC), sB = sum(got, p => p.o.base), rate = sB ? sC / sB * 100 : 0, proj = rate / Math.max(yearFraction(), 0.25);
        o.value = rate; o.display = fmt(rate, 1) + '%'; o.sumC = sC; o.base = sB; o.proj = proj;
        o.ach = rateAch(rate, proj, t); o.status = rateStatus(rate, o.ach, t);
        o.note = `${fmt(sC)} من ${fmt(sB)} في ${of}`;
      }
    } else if (k.type === 'ratio') {
      // بجمع البسوط والمقامات لا بمتوسط النسب
      o.targetLbl = 'المستهدف ' + fmt(t) + '% فأكثر';
      if (n) { const num = sum(got, p => p.o.num), den = sum(got, p => p.o.den), v = den ? num / den * 100 : 0;
        Object.assign(o, { value: v, display: fmt(v, 1) + '%', num, den, ach: t ? clamp(v / t, 0, 1) : 0 }); o.status = genericStatus(o.ach); o.note = `${fmt(num)} من ${fmt(den)} في ${of}`; }
    } else if (k.type === 'amount') {
      // المبالغ تُجمع ولا يُؤخذ متوسطها
      o.targetLbl = 'المستهدف ' + fmt(t) + unit;
      if (n) { const net = sum(got, p => p.o.value), lastM = got.map(p => p.o.list[p.o.list.length - 1].month).sort().pop(), cov = expectedShare(k, lastM) || yearFraction(), expd = t * cov;
        Object.assign(o, { value: net, display: fmt(net), rev: sum(got, p => p.o.rev), exp: sum(got, p => p.o.exp), expected: expd, proj: net / cov, ach: expd > 0 ? clamp(net / expd, 0, 1) : 0 });
        o.note = `مجموع ${of} • حتى نهاية ${monthLabel(lastM)}`; }
    } else {
      o.targetLbl = 'المستهدف ' + fmtVal(k, t);
      if (n) {
        // متوسط موزون بعدد طلاب كل حساب إن توفر لجميعها، وإلا متوسط بسيط
        const wts = got.map(p => sizeOf(p.a)), wtd = wts.every(w => w > 0), W = wtd ? sum(wts, w => w) : n;
        const v = sum(got.map((p, i) => p.o.value * (wtd ? wts[i] : 1)), x => x) / W;
        o.value = v; o.display = fmt(v, 1) + (k.unit === '%' ? '%' : ''); o.ach = t ? clamp(v / t, 0, 1) : 0; o.status = genericStatus(o.ach);
        o.note = `${wtd ? 'متوسط موزون بعدد الطلاب' : 'متوسط بسيط'} — ${of}` + (n < roll.src.length ? ' (بلا بيانات: ' + (roll.src.length - n) + ')' : '');
      }
    }
    if (o.value == null) o.note = 'لا توجد بيانات في الحسابات المغذية هذا العام بعد';
    return o;
  }
  if (k.type === 'count') {
    const doneL = list.filter(r => r.status !== 'مخطط لها'), done = doneL.length, planned = list.length - done;
    const exp = t * yearFraction(), due = Math.min(t, Math.floor(exp + 1e-9));
    o.targetLbl = 'المستهدف ' + fmt(t) + unit; o.value = done; o.display = fmt(done);
    o.ach = paceAch(done, t); o.bar = t ? clamp(done / t, 0, 1) : 0;
    o.status = countStatus(done, t);
    o.note = planned ? `${planned} مخطط لها` : '';
    o.tick = yearFraction();
    const last30 = doneL.filter(r => daysBetween(r.date, todayStr()) <= 30 && r.date <= todayStr()).length;
    o.trend = last30 ? { cls:'good', icon:'▲', text:`+${last30} خلال آخر 30 يوماً` } : null;
  } else if (k.type === 'rate') {
    const base = N(asg.baseline);
    o.targetLbl = 'السقف ' + fmt(t) + '%';
    if (!base || !list.length) { o.note = !base ? 'أدخل ' + (cfg.baselineLabel || 'خط الأساس') : 'لم تُسجَّل بيانات شهرية بعد'; o.needsBaseline = !base; }
    else {
      const s = sum(list, r => r.count), rate = s / base * 100, f = yearFraction(), proj = rate / Math.max(f, 0.25);
      o.value = rate; o.display = fmt(rate,1) + '%'; o.sumC = s; o.base = base;
      o.ach = rateAch(rate, proj, t); o.proj = proj;
      o.status = rateStatus(rate, o.ach, t);
      o.note = `${fmt(s)} من ${fmt(base)}`;
      if (list.length > 1) { const a = N(list[list.length-1].count), b = N(list[list.length-2].count); o.trend = trendObj(a - b, false, `${monthLabel(list[list.length-1].month)}: ${fmt(a)} مقابل ${fmt(b)} في الشهر السابق`); }
    }
  } else if (k.type === 'amount') {
    o.targetLbl = 'المستهدف ' + fmt(t) + unit;
    if (!list.length) o.note = 'لم تُسجَّل بيانات مالية بعد';
    else {
      const rev = sum(list, r => r.revenue), exp = sum(list, r => r.expenses), net = rev - exp, am = allMonths(), lastM = list[list.length-1].month;
      const cov = expectedShare(k, lastM) || yearFraction(), expd = t * cov;
      Object.assign(o, { value: net, display: fmt(net), rev, exp, expected: expd, proj: net / cov, ach: expd > 0 ? clamp(net / expd, 0, 1) : 0 });   // التحقق مقابل المتوقع حتى تاريخه؛ يساوي القيمة ÷ المستهدف عند نهاية العام
      o.status = net >= t ? 'done' : net >= expd ? 'track' : net >= expd * 0.8 ? 'risk' : 'off';
      o.note = `إيرادات ${fmt(rev)} − مصروفات ${fmt(exp)} • حتى نهاية ${monthLabel(lastM)}`;
      if (list.length > 1) { const a = N(list[list.length-1].revenue) - N(list[list.length-1].expenses), b = N(list[list.length-2].revenue) - N(list[list.length-2].expenses); o.trend = trendObj(a - b, true, `${monthLabel(lastM)}: ${fmt(a)} مقابل ${fmt(b)} في الشهر السابق`); }
    }
  } else if (k.type === 'ratio') {
    o.targetLbl = 'المستهدف ' + fmt(t) + '% فأكثر';
    if (!list.length) o.note = 'لم تُسجَّل أي فترة بعد';
    else {
      const num = sum(list, r => r.num), den = sum(list, r => r.den), v = den ? num / den * 100 : 0, rt = r => N(r.den) ? N(r.num) / N(r.den) * 100 : 0;
      Object.assign(o, { value: v, display: fmt(v, 1) + '%', num, den, ach: t ? clamp(v / t, 0, 1) : 0 }); o.status = genericStatus(o.ach);
      o.note = `${fmt(num)} من ${fmt(den)}`;
      if (list.length > 1) { const d = rt(list[list.length-1]) - rt(list[list.length-2]); o.trend = trendObj(d, true, `${d > 0 ? '+' : ''}${fmt(d, 1)} نقطة عن الفترة السابقة`); }
    }
  } else if (k.type === 'nps') {
    o.targetLbl = 'المستهدف ' + signed(t);
    if (!list.length) o.note = 'لم يُسجَّل أي قياس بعد';
    else {
      const last = list[list.length-1], v = npsOf(last), rr = respRate(last);
      o.value = v; o.display = signed(v); o.ach = t > 0 ? clamp(Math.max(0, v) / t, 0, 1) : (v >= t ? 1 : 0); o.status = genericStatus(o.ach);
      o.note = `${esc(last.round || '')} • ${dateLabel(last.date)}` + (rr != null ? ` • الاستجابة ${fmt(rr)}%` : '');
      o.lowResp = rr != null && rr < 30; o.last = last;
      const pr = prevOf(last); if (pr) { const p = npsOf(pr); o.trend = trendObj(v - p, true, `${signed(v - p)} عن القياس السابق`); o.declined = v < p; }
    }
  } else if (k.type === 'score') {
    o.targetLbl = 'المستهدف ' + fmt(t) + '%';
    if (!list.length) o.note = 'لم يُسجَّل أي تقييم بعد';
    else {
      const offK = cfg.officialKind || 'النتيجة الرسمية', off = list.filter(r => r.kind === offK);
      const use = off.length ? off[off.length-1] : list[list.length-1];
      o.value = N(use.overall); o.display = fmt(o.value,1) + '%'; o.ach = t ? clamp(o.value / t, 0, 1) : 0; o.status = genericStatus(o.ach);
      o.note = `${esc(use.kind)} • ${dateLabel(use.date)}`; o.rec = use;
      const pr = prevOf(use);
      if (pr) { const d = N(use.overall) - N(pr.overall); o.trend = trendObj(d, true, `${d > 0 ? '+' : ''}${fmt(d,1)} نقطة عن التقييم السابق`); }
    }
  } else if (k.type === 'reading') {
    const down = k.direction === 'down';
    o.targetLbl = (down ? 'الحد الأعلى ' : 'المستهدف ') + fmtVal(k, t);
    if (!list.length) o.note = 'لم تُسجَّل أي قراءة بعد';
    else {
      const last = list[list.length-1], v0 = N(last.value);
      if (cfg.growth) {   // مؤشر نمو: القيمة = آخر قياس − أول قياس هذا العام (القياس القبلي)
        const first = list[0];
        if (list.length < 2) { o.note = `سُجّل القياس القبلي (${fmt(v0, 1)}) — يُحسب النمو من القياس التالي`; return o; }
        const g = v0 - N(first.value);
        o.value = g; o.display = (g > 0 ? '+' : '') + fmt(g, 1); o.ach = t ? clamp(Math.max(0, g) / t, 0, 1) : 0; o.status = genericStatus(o.ach);
        o.targetLbl = 'المستهدف +' + fmt(t) + unit; o.note = `من ${fmt(first.value, 1)} إلى ${fmt(v0, 1)} • آخر قياس ${dateLabel(last.date)}`;
        return o;
      }
      const v = v0;
      o.value = v; o.display = fmtVal(k, v);
      if (!t && !down) { o.targetLbl = 'المستهدف لم يُحدَّد'; o.note = 'حدّد المستهدف المعتمد من «الإدارة ← تعديل وتكليف»'; o.noTarget = true; return o; }
      o.ach = down ? (v <= t ? 1 : clamp(1 - (v - t) / (t || 1), 0, 1)) : (t ? clamp(Math.max(0, v) / t, 0, 1) : 1);
      o.status = genericStatus(o.ach); o.note = 'آخر قراءة ' + dateLabel(last.date);
      const pr = prevOf(last); if (pr) { const d = v - N(pr.value); o.trend = trendObj(d, !down, `${d > 0 ? '+' : ''}${fmt(d,1)} عن القراءة السابقة`); }
    }
  }
  return o;
}
const ACC_CACHE = new Map();   // يُفرَّغ مع كل عرض وكل تحديث للبيانات
function computeAccount(acc) {
  const key = acc.id + '|' + (S.approvedOnly ? 1 : 0);
  if (ACC_CACHE.has(key)) return ACC_CACHE.get(key);
  const res = computeAccount_(acc); ACC_CACHE.set(key, res); return res;
}
function computeAccount_(acc) {
  const items = assignsOf(acc.id).map(a => computeKpi(acc, a));
  // المؤشرات المستحقة = ما له بيانات + ما حان موعده دون بيانات (صفر)؛ ما لم يحن موعده خارج الحساب
  let wAll = 0, wDue = 0, wLate = 0, sc = 0, yr = 0;
  items.forEach(o => { wAll += o.weight; if (o.status === 'nodata') return; wDue += o.weight; sc += o.weight * o.ach; yr += o.weight * (o.achYear != null ? o.achYear : o.ach); if (o.status === 'late' || o.status === 'rejected') wLate += o.weight; });
  let last = acc.updatedAt || '';
  Object.keys(S.data.records).forEach(t => recsAll(t, acc.id).forEach(r => { if ((r.updatedAt || '') > last) last = r.updatedAt; }));
  (S.data.assigns || []).forEach(a => { if (a.accountId === acc.id && (a.updatedAt || '') > last) last = a.updatedAt; });
  const actions = recsAll('actions', acc.id);
  return { items, byKpi: Object.fromEntries(items.map(o => [o.k.id, o])),
    score: wDue ? sc / wDue * 100 : null, yearAch: wDue ? yr / wDue * 100 : null,
    coverage: wDue ? (wDue - wLate) / wDue * 100 : null,   // اكتمال البيانات المستحقة (مؤشر الالتزام بالإدخال)
    dueShare: wAll ? wDue / wAll * 100 : 0, late: items.filter(o => o.status === 'late' || o.status === 'rejected'), complete: wLate === 0,
    lastUpdate: last, stale: !last || daysBetween(last.slice(0,10), todayStr()) > STALE_DAYS,
    pending: sum(items, o => o.pending), returned: sum(items, o => o.returned),
    actionsOpen: actions.filter(x => x.status !== 'مكتمل').length,
    overdue: actions.filter(x => x.status !== 'مكتمل' && x.status !== 'متوقف' && x.due < todayStr()) };
}
const scoreStatus = s => s == null ? 'nodata' : s >= 90 ? 'done' : s >= 75 ? 'risk' : 'off';
const bandOf = s => s == null ? '' : s >= 90 ? 'متميز' : s >= 80 ? 'جيد جداً' : s >= 75 ? 'جيد' : s >= 60 ? 'دون المستهدف' : 'يحتاج تدخل';
// لقطة نهاية الشهر: على السجلات المعتمدة فقط، و«اليوم» = نهاية الشهر — يحسبها الخادم عند الإقفال بهذا المحرك نفسه
function snapshotRows(m) {
  const keep = { ao: S.approvedOnly, asOf: S.asOfDate }, num = v => v == null || !isFinite(v) ? '' : Math.round(v * 1e4) / 1e4, rows = [];
  S.approvedOnly = true; S.asOfDate = monthEnd(m); ACC_CACHE.clear();
  try {
    activeMembers().forEach(a => { const c = computeAccount(a);
      c.items.forEach(o => rows.push({ accountId: a.id, kpiId: o.k.id, actual: o.lowSample ? '' : num(o.value), interim: num(o.interim), annual: num(o.target), achYear: num(o.achYear), achInterim: num(o.achInterim), dev: num(o.dev), status: o.status, weight: num(o.weight) }));
      rows.push({ accountId: a.id, kpiId: '', score: num(c.score), achYear: num(c.yearAch), coverage: num(c.coverage), status: c.score == null ? 'nodata' : scoreStatus(c.score) }); });
  } finally { S.approvedOnly = keep.ao; S.asOfDate = keep.asOf; ACC_CACHE.clear(); }
  return rows;
}

return { TYPES, STATUS, AP, MONTHS, STALE_DAYS, esc, fmt, money, N, signed, clamp, monthLabel, dateLabel, todayStr, daysBetween, sum, kpiById, accById, isHolder, levelOf, isExec, isStage, LEVEL_NAME, FAMILY, famOf, LEVEL_SHORT, feeders, rollSrc, members, allMonths, activeMembers, assignsOf, recsAll, recs, inYear, unitLbl, yearFraction, npsOf, respRate, genericStatus, paceAch, countStatus, rateAch, rateStatus, isCumulative, trajOf, monthEnd, planShare, budgetOf, budgetShare, expectedShare, GRACE_DAYS, graceOf, addDays, dueOf, npsN, sampleRule, sampleOk, missingMonths, asOfOf, PLAN_TOL, planGrade, planFmt, sizeOf, byDate, fmtVal, trendObj, computeKpi, computeKpiRaw_, ACC_CACHE, computeAccount, computeAccount_, scoreStatus, bandOf, snapshotRows };
}
if (typeof module !== 'undefined' && module.exports) module.exports = { makeKpiEngine };
