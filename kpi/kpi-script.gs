/**
 * منظومة متابعة مؤشرات الأداء المؤسسي — مدارس دار الذكر (الإصدار 2)
 * الخادم: Google Apps Script + Google Sheet
 * ---------------------------------------------------------------
 * التشغيل لأول مرة أو بعد تحديث الكود:
 *  1) Extensions ← Apps Script ← الصق هذا الملف كاملاً ← حفظ.
 *  2) اختر الدالة setup ← Run (آمنة للتكرار: تنشئ الناقص فقط، وترحّل بيانات الإصدار 1 تلقائياً).
 *  3) أول مرة: Deploy ← New deployment ← Web app ← Execute as: Me ← Who has access: Anyone.
 *     بعد أي تحديث: Deploy ← Manage deployments ← ✎ ← Version: New version ← Deploy (الرابط لا يتغير).
 * لا تغيّر ترتيب الأعمدة في الأوراق؛ الكود يعتمد عليه.
 */

const APPROVAL = { pending: 'مدخل', approved: 'معتمد', returned: 'معاد للتعديل' };
const REVIEW_COLS = [['approval', 'حالة الاعتماد', 'text'], ['reviewNote', 'ملاحظة المراجعة', 'text'], ['reviewedBy', 'المراجِع', 'text'], ['reviewedAt', 'تاريخ المراجعة', 'text']];
const STAMP_COLS = [['updatedAt', 'آخر تحديث', 'text'], ['updatedBy', 'حدّثه', 'text']];

const SCHEMA = {
  accounts: { sheet: 'الحسابات', cols: [
    ['id', 'المعرف', 'text'], ['role', 'نوع الحساب (admin/viewer/member)', 'text'], ['name', 'الاسم', 'text'],
    ['empNo', 'الرقم الوظيفي', 'text'], ['title', 'المسمى الوظيفي', 'text'], ['unit', 'المرحلة/الوحدة (مختصر)', 'text'],
    ['manager', 'المدير المباشر', 'text'], ['code', 'كود الدخول', 'text'], ['active', 'مفعل', 'bool'],
    ['avgFee', 'متوسط الرسوم السنوية للطالب', 'num'], ['updatedAt', 'آخر تحديث', 'text']] },
  kpis: { sheet: 'المؤشرات', cols: [
    ['id', 'المعرف', 'text'], ['order', 'الترتيب', 'num'], ['name', 'اسم المؤشر', 'text'], ['goal', 'الهدف الاستراتيجي', 'text'],
    ['subgoal', 'الهدف الفرعي', 'text'], ['text', 'نص المؤشر', 'text'], ['type', 'نوع القياس', 'text'], ['unit', 'الوحدة', 'text'],
    ['direction', 'الاتجاه (up/down)', 'text'], ['defTarget', 'المستهدف الافتراضي', 'num'], ['defWeight', 'الوزن الافتراضي', 'num'],
    ['fin', 'الربط المالي', 'text'], ['config', 'إعدادات (JSON)', 'json'], ['active', 'مفعل', 'bool'], ['updatedAt', 'آخر تحديث', 'text']] },
  assign: { sheet: 'تكليفات المؤشرات', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['target', 'المستهدف', 'num'],
    ['weight', 'الوزن %', 'num'], ['baseline', 'خط الأساس (المقام)', 'num'], ['updatedAt', 'آخر تحديث', 'text']] },
  activities: { sheet: 'الأنشطة والمبادرات', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['date', 'التاريخ', 'date'],
    ['title', 'الاسم', 'text'], ['kind', 'النوع', 'text'], ['audience', 'الفئة المستهدفة', 'text'], ['status', 'الحالة', 'text'],
    ['beneficiaries', 'المستفيدون/الحضور', 'num'], ['leads', 'المهتمون بالتسجيل', 'num'], ['applications', 'طلبات التسجيل', 'num'],
    ['registrations', 'المسجلون فعلياً', 'num'], ['budget', 'الميزانية المعتمدة', 'num'], ['cost', 'التكلفة الفعلية', 'num'],
    ['evidence', 'رابط الشواهد', 'text'], ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  events: { sheet: 'الأحداث الشهرية', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['month', 'الشهر', 'month'],
    ['count', 'العدد (المنسحبون)', 'num'], ['newEnrolled', 'ملتحقون جدد', 'num'], ['retained', 'حالات تم الاحتفاظ بها', 'num'],
    ['reasons', 'الأسباب (JSON)', 'json'], ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  surveys: { sheet: 'الاستبانات', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['date', 'تاريخ القياس', 'date'],
    ['round', 'الجولة', 'text'], ['promoters', 'المروّجون 9-10', 'num'], ['passives', 'المحايدون 7-8', 'num'],
    ['detractors', 'المنتقدون 0-6', 'num'], ['population', 'إجمالي المستهدفين', 'num'], ['reasons', 'أسباب عدم الرضا (JSON)', 'json'],
    ['actionTaken', 'الإجراء المتخذ', 'text'], ['evidence', 'رابط النتائج', 'text'], ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  assessments: { sheet: 'التقييمات', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['date', 'التاريخ', 'date'],
    ['kind', 'نوع التقييم', 'text'], ['domains', 'نتائج المجالات (JSON)', 'json'], ['overall', 'النتيجة الكلية %', 'num'],
    ['strengths', 'نقاط القوة', 'text'], ['improvements', 'فرص التحسين', 'text'], ['evidence', 'رابط الشواهد', 'text'],
    ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  readings: { sheet: 'القراءات الدورية', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['date', 'التاريخ', 'date'],
    ['value', 'القيمة', 'num'], ['evidence', 'رابط الشواهد', 'text'], ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  actions: { sheet: 'الإجراءات التحسينية', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['title', 'الإجراء', 'text'],
    ['owner', 'المسؤول', 'text'], ['due', 'تاريخ الاستحقاق', 'date'], ['status', 'الحالة', 'text'], ['progress', 'نسبة الإنجاز', 'num'],
    ['notes', 'ملاحظات المتابعة', 'text'], ['evidence', 'رابط الشواهد', 'text'], ['reviewNote', 'توجيه الإدارة', 'text'],
    ['createdBy', 'أنشأه', 'text']].concat(STAMP_COLS) },
  audit: { sheet: 'سجل التعديلات', cols: [
    ['id', 'المعرف', 'text'], ['time', 'الوقت', 'text'], ['actor', 'المستخدم', 'text'], ['role', 'الصلاحية', 'text'],
    ['action', 'العملية', 'text'], ['table', 'الجدول', 'text'], ['recordId', 'السجل', 'text'], ['account', 'الحساب المعني', 'text'],
    ['detail', 'التفاصيل', 'text']] }
};
const RECORD_TABLES = ['activities', 'events', 'surveys', 'assessments', 'readings', 'actions'];
const REVIEWABLE = ['activities', 'events', 'surveys', 'assessments', 'readings'];
const TABLE_OF_TYPE = { count: 'activities', rate: 'events', nps: 'surveys', score: 'assessments', reading: 'readings' };
const TYPES = Object.keys(TABLE_OF_TYPE);
const TABLE_NAMES = { activities: 'الأنشطة والمبادرات', events: 'الأحداث الشهرية', surveys: 'الاستبانات', assessments: 'التقييمات',
  readings: 'القراءات', actions: 'الإجراءات التحسينية', accounts: 'الحسابات', kpis: 'المؤشرات', assign: 'التكليفات', settings: 'الإعدادات' };
const ACTION_STATUS = ['لم يبدأ', 'جارٍ', 'مكتمل', 'متوقف'];
const SETTINGS_SHEET = 'الإعدادات';
const DEFAULT_SETTINGS = { adminCode: '', yearLabel: '2026/2027', yearStart: '2026-08-20', yearEnd: '2027-06-30',
  schoolName: 'مدارس دار الذكر', systemName: 'منظومة متابعة الأداء المؤسسي', schemaVersion: '2' };

// المؤشرات الخمسة من «نموذج اتفاقية مؤشرات الأداء السنوية» 2026/2027
const SEED_KPIS = [
  { id: 'init', order: 1, name: 'المبادرات الاستقطابية', goal: 'الأداء المالي', subgoal: 'دعم تحقيق مستهدفات النمو الطلابي للمرحلة',
    text: 'تنفيذ ما لا يقل عن (4) مبادرات وفعاليات استقطابية خلال العام الدراسي بما يدعم تحقيق مستهدفات تسجيل الطلاب بالمدرسة',
    type: 'count', unit: 'مبادرة', direction: 'up', defTarget: 4, defWeight: 35, fin: 'acquisition',
    config: { kinds: ['يوم مفتوح', 'لقاء تعريفي', 'ورشة لأولياء الأمور', 'زيارة/شراكة', 'حملة رقمية', 'معرض/مسابقة مفتوحة', 'فعالية مجتمعية', 'أخرى'] } },
  { id: 'wd', order: 2, name: 'نسبة الطلاب المنسحبين', goal: 'الاستدامة المالية', subgoal: 'المحافظة على استقرار واستدامة أعداد الطلاب بالمرحلة',
    text: 'ألا تتجاوز نسبة الطلاب المنسحبين من المرحلة السقف المحدد من إجمالي الطلاب المسجلين فعلياً',
    type: 'rate', unit: '%', direction: 'down', defTarget: 8, defWeight: 10, fin: 'attrition',
    config: { reasons: ['انتقال سكن/سفر', 'الرسوم', 'أكاديمي', 'عدم الرضا عن الخدمة', 'أخرى'], eventLabel: 'عدد المنسحبين', baselineLabel: 'عدد الطلاب المسجلين فعلياً بداية العام' } },
  { id: 'nps', order: 3, name: 'صافي نقاط رضا أولياء الأمور (NPS)', goal: 'رضا أولياء الأمور', subgoal: 'تحسين تجربة أولياء الأمور ورفع مستوى رضاهم عن المرحلة',
    text: 'تحقيق مؤشر صافي نقاط رضا أولياء أمور المرحلة (NPS) بما لا يقل عن المستهدف',
    type: 'nps', unit: '', direction: 'up', defTarget: 40, defWeight: 20, fin: '',
    config: { question: 'ما مدى احتمال أن توصي بمدارس دار الذكر لأقاربك وأصدقائك؟', populationLabel: 'إجمالي الأسر المستهدفة',
      reasons: ['جودة التعليم والتحصيل', 'التواصل مع الأسرة', 'الرسوم والقيمة', 'الانضباط والسلوك', 'المرافق والنقل', 'أخرى'] } },
  { id: 'etec', order: 4, name: 'نتيجة هيئة تقويم التعليم والتدريب', goal: 'التميز المؤسسي', subgoal: 'تحقيق التميز الأكاديمي والمؤسسي للمرحلة',
    text: 'تحقيق النتيجة المستهدفة في تقويم واعتماد هيئة تقويم التعليم والتدريب',
    type: 'score', unit: '%', direction: 'up', defTarget: 85, defWeight: 25, fin: '',
    config: { domains: ['الإدارة المدرسية', 'التعليم والتعلم', 'نواتج التعلم', 'البيئة المدرسية'], kinds: ['تقويم ذاتي', 'تقييم تجريبي', 'النتيجة الرسمية'], officialKind: 'النتيجة الرسمية' } },
  { id: 'enps', order: 5, name: 'مؤشر اندماج الموظفين (eNPS)', goal: 'مشاركة واندماج الموظفين', subgoal: 'توفير بيئة عمل داعمة ومحفزة لمنسوبي المرحلة',
    text: 'تحقيق مؤشر اندماج موظفي المرحلة (eNPS) بمستوى لا يقل عن المستهدف',
    type: 'nps', unit: '', direction: 'up', defTarget: 80, defWeight: 10, fin: '',
    config: { question: 'ما مدى احتمال أن توصي بالعمل في مرحلتنا لصديق؟', populationLabel: 'إجمالي موظفي المرحلة',
      reasons: ['عبء العمل', 'التقدير والحوافز', 'القيادة والتواصل', 'بيئة العمل', 'النمو المهني', 'أخرى'] } }
];
const SEED_MEMBERS = [
  { name: 'رامي الشهراني', empNo: '19237', title: 'مدير المرحلة الابتدائية', unit: 'ابتدائي بنين', manager: 'د. مصطفى خلف', etec: 85 },
  { name: 'عبير طاهر', empNo: '22404', title: 'مديرة المرحلة الابتدائية - بنات', unit: 'ابتدائي بنات', manager: 'د. مصطفى خلف', etec: 85 },
  { name: 'خالد بخيت', empNo: '20825', title: 'مدير المرحلة المتوسطة - بنين', unit: 'متوسط بنين', manager: 'أ. بسام غراب', etec: 92 },
  { name: 'سلطان الشهابي', empNo: '21710', title: 'مدير المرحلة الثانوية', unit: 'ثانوي بنين', manager: 'د. مصطفى خلف', etec: 87 }
];
const SEED_ADMINS = [
  { name: 'د. مصطفى خلف', title: 'مدير التعليم', unit: 'الإدارة العليا' },
  { name: 'أ. بسام غراب', title: 'المدير التنفيذي لمدارس دار الذكر', unit: 'الإدارة العليا' }
];

// ===================== الإعداد والترحيل =====================
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const log = [];
  migrateV1_(log);
  const settings = readSettings_();
  Object.keys(DEFAULT_SETTINGS).forEach(k => { if (settings[k] === undefined || settings[k] === '') settings[k] = DEFAULT_SETTINGS[k]; });
  settings.schemaVersion = '2';
  if (!settings.adminCode) settings.adminCode = 'ADM-' + newCode_(6);
  writeSettings_(settings);
  Object.keys(SCHEMA).forEach(t => ensureSheet_(t));
  // المؤشرات
  const kpis = readTable_('kpis');
  SEED_KPIS.forEach(k => { if (!kpis.some(x => x.id === k.id)) upsert_('kpis', Object.assign({ active: true, updatedAt: stamp_() }, k)); });
  // مديرو المراحل
  let accounts = readTable_('accounts');
  if (!accounts.some(a => a.role === 'member')) {
    SEED_MEMBERS.forEach(m => {
      const acc = { id: newId_(), role: 'member', name: m.name, empNo: m.empNo, title: m.title, unit: m.unit, manager: m.manager,
        code: newCode_(6), active: true, avgFee: '', updatedAt: stamp_() };
      upsert_('accounts', acc);
      SEED_KPIS.forEach(k => upsert_('assign', { id: newId_(), accountId: acc.id, kpiId: k.id,
        target: k.id === 'etec' ? m.etec : k.defTarget, weight: k.defWeight, baseline: '', updatedAt: stamp_() }));
    });
  }
  // حسابات الإدارة العليا (صلاحيات كاملة)
  accounts = readTable_('accounts');
  SEED_ADMINS.forEach(a => {
    if (!accounts.some(x => x.name === a.name)) upsert_('accounts', { id: newId_(), role: 'admin', name: a.name, empNo: '', title: a.title,
      unit: a.unit, manager: '', code: newCode_(6), active: true, avgFee: '', updatedAt: stamp_() });
  });
  // حذف الورقة الافتراضية الفارغة
  const def = ss.getSheetByName('الورقة1') || ss.getSheetByName('Sheet1');
  if (def && def.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(def);
  const msg = log.concat(['تم الإعداد (الإصدار 2).', 'كود مسؤول النظام: ' + settings.adminCode])
    .concat(readTable_('accounts').map(a => a.name + ' (' + roleName_(a.role) + ') : ' + a.code)).join('\n');
  Logger.log(msg);
  return msg;
}

// ترحيل بيانات الإصدار 1 (أعمدة ثابتة) إلى بنية الإصدار 2 مع الاحتفاظ بنسخة احتياطية
function migrateV1_(log) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const acc = ss.getSheetByName('الحسابات');
  if (!acc || acc.getLastColumn() < 11 || String(acc.getRange(1, 11, 1, 1).getValues()[0][0]) !== 'مستهدف المبادرات') return;
  const tz = Session.getScriptTimeZone();
  const fmt = (v, f) => v instanceof Date ? Utilities.formatDate(v, tz, f || 'yyyy-MM-dd') : (v === null || v === undefined ? '' : String(v));
  const rows = (name, n) => { const sh = ss.getSheetByName(name); if (!sh || sh.getLastRow() < 2) return [];
    return sh.getRange(2, 1, sh.getLastRow() - 1, n).getValues().filter(r => r[0] !== ''); };
  const oldAcc = rows('الحسابات', 21), oldInit = rows('المبادرات', 13), oldWd = rows('الانسحاب الشهري', 12),
    oldSv = rows('الاستبانات', 12), oldEt = rows('الاعتماد المدرسي', 12);
  ['الحسابات', 'المبادرات', 'الانسحاب الشهري', 'الاستبانات', 'الاعتماد المدرسي'].forEach(n => {
    const sh = ss.getSheetByName(n); if (sh) sh.setName('نسخة الإصدار 1 - ' + n);
  });
  Object.keys(SCHEMA).forEach(t => ensureSheet_(t));
  SEED_KPIS.forEach(k => upsert_('kpis', Object.assign({ active: true, updatedAt: stamp_() }, k)));
  const num = v => v === '' || v === null ? '' : Number(v);
  oldAcc.forEach(r => {
    upsert_('accounts', { id: String(r[0]), role: r[1] === 'viewer' ? 'viewer' : 'member', name: r[2], empNo: fmt(r[3]), title: r[4], unit: r[5],
      manager: r[6], code: String(r[7]), active: r[8] === true || String(r[8]).toUpperCase() === 'TRUE', avgFee: '', updatedAt: stamp_() });
    if (r[1] === 'viewer') return;
    [['init', 10, 15], ['wd', 11, 16], ['nps', 12, 17], ['etec', 13, 18], ['enps', 14, 19]].forEach(([k, ti, wi]) =>
      upsert_('assign', { id: newId_(), accountId: String(r[0]), kpiId: k, target: num(r[ti]), weight: num(r[wi]),
        baseline: k === 'wd' ? num(r[9]) : '', updatedAt: stamp_() }));
  });
  const ap = { approval: APPROVAL.approved, reviewNote: 'مرحّل من الإصدار 1', reviewedBy: 'النظام', reviewedAt: stamp_(), updatedAt: stamp_(), updatedBy: 'ترحيل' };
  oldInit.forEach(r => upsert_('activities', Object.assign({ id: String(r[0]), accountId: String(r[1]), kpiId: 'init', date: fmt(r[2]), title: r[3], kind: r[4],
    audience: r[5], status: r[6] || 'منفذة', beneficiaries: num(r[7]), leads: num(r[8]), applications: '', registrations: num(r[9]), budget: '', cost: '',
    evidence: r[10], notes: r[11] }, ap)));
  const wdReasons = SEED_KPIS[1].config.reasons;
  oldWd.forEach(r => { const reasons = {}; wdReasons.forEach((n, i) => { if (Number(r[5 + i])) reasons[n] = Number(r[5 + i]); });
    upsert_('events', Object.assign({ id: String(r[0]), accountId: String(r[1]), kpiId: 'wd', month: fmt(r[2], 'yyyy-MM'), count: num(r[3]),
      newEnrolled: num(r[4]), retained: '', reasons: JSON.stringify(reasons), notes: r[10] }, ap)); });
  oldSv.forEach(r => upsert_('surveys', Object.assign({ id: String(r[0]), accountId: String(r[1]), kpiId: r[2] === 'enps' ? 'enps' : 'nps', date: fmt(r[3]),
    round: r[4], promoters: num(r[5]), passives: num(r[6]), detractors: num(r[7]), population: num(r[8]), reasons: '{}', actionTaken: '',
    evidence: r[9], notes: r[10] }, ap)));
  const doms = SEED_KPIS[3].config.domains;
  oldEt.forEach(r => { const d = {}; doms.forEach((n, i) => { if (r[4 + i] !== '') d[n] = Number(r[4 + i]); });
    upsert_('assessments', Object.assign({ id: String(r[0]), accountId: String(r[1]), kpiId: 'etec', date: fmt(r[2]), kind: r[3], domains: JSON.stringify(d),
      overall: num(r[8]), strengths: '', improvements: '', evidence: r[9], notes: r[10] }, ap)); });
  log.push('تم ترحيل بيانات الإصدار 1: ' + oldAcc.length + ' حساب، ' + (oldInit.length + oldWd.length + oldSv.length + oldEt.length) + ' سجل (النسخ القديمة محفوظة بأوراق «نسخة الإصدار 1»).');
}

// ===================== نقطة الدخول (JSONP) =====================
function doGet(e) {
  const p = (e && e.parameter) || {};
  let out;
  try { out = route_(p.action || '', String(p.code || ''), p.p ? JSON.parse(p.p) : {}); }
  catch (err) { out = { ok: false, error: String(err && err.message || err) }; }
  const json = JSON.stringify(out);
  if (p.callback && /^[A-Za-z_$][\w$]*$/.test(p.callback))
    return ContentService.createTextOutput(p.callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function route_(action, code, p) {
  if (action === 'ping') return { ok: true, time: new Date().toISOString(), version: 2 };
  const who = auth_(code);
  if (!who) return { ok: false, error: 'كود الدخول غير صحيح أو الحساب موقوف' };
  const isAdmin = who.role === 'admin';
  const ok = () => ({ ok: true, data: buildData_(who) });

  switch (action) {
    case 'login': case 'getData': return ok();

    case 'saveRecord': {
      if (who.role === 'viewer') throw new Error('هذا الحساب للعرض فقط');
      const table = p.table;
      if (RECORD_TABLES.indexOf(table) < 0) throw new Error('نوع سجل غير معروف');
      const src = p.record || {};
      const rec = sanitize_(table, src);
      rec.accountId = isAdmin ? String(src.accountId || '') : who.id;
      const account = findById_('accounts', rec.accountId);
      if (!account || account.role !== 'member') throw new Error('الحساب غير موجود');
      const old = rec.id ? findById_(table, rec.id) : null;
      if (old && !isAdmin && old.accountId !== who.id) throw new Error('لا تملك صلاحية تعديل هذا السجل');
      if (old && old.accountId !== rec.accountId) throw new Error('لا يمكن نقل السجل لحساب آخر');
      // التحقق من المؤشر
      if (table !== 'actions' || rec.kpiId) {
        const kpi = findById_('kpis', rec.kpiId);
        if (!kpi) throw new Error('المؤشر غير موجود');
        if (table !== 'actions' && TABLE_OF_TYPE[kpi.type] !== table) throw new Error('نوع السجل لا يطابق نوع المؤشر');
        if (!readTable_('assign').some(a => a.accountId === rec.accountId && a.kpiId === rec.kpiId)) throw new Error('المؤشر غير مكلّف لهذا الحساب');
        validate_(table, rec, kpi);
      } else validate_(table, rec, null);
      if (!rec.id) rec.id = newId_();
      // الاعتماد: سجل يُدخله المسؤول يُعتمد مباشرة، وأي تعديل من المدير يعيده «مدخل»
      if (REVIEWABLE.indexOf(table) >= 0) {
        if (isAdmin) Object.assign(rec, { approval: APPROVAL.approved, reviewNote: old ? old.reviewNote : '', reviewedBy: who.name, reviewedAt: stamp_() });
        else Object.assign(rec, { approval: APPROVAL.pending, reviewNote: old ? old.reviewNote : '', reviewedBy: old ? old.reviewedBy : '', reviewedAt: old ? old.reviewedAt : '' });
      } else if (table === 'actions') {
        rec.reviewNote = isAdmin ? clip_(src.reviewNote, 600) : (old ? old.reviewNote : '');
        rec.createdBy = old ? old.createdBy : who.name;
      }
      rec.updatedAt = stamp_(); rec.updatedBy = who.name;
      withLock_(() => { upsert_(table, rec); audit_(who, old ? 'تعديل' : 'إضافة', table, rec.id, account.name, summary_(table, rec)); });
      return ok();
    }

    case 'deleteRecord': {
      if (who.role === 'viewer') throw new Error('هذا الحساب للعرض فقط');
      if (RECORD_TABLES.indexOf(p.table) < 0) throw new Error('نوع سجل غير معروف');
      const old = findById_(p.table, p.id);
      if (!old) throw new Error('السجل غير موجود');
      if (!isAdmin && old.accountId !== who.id) throw new Error('لا تملك صلاحية حذف هذا السجل');
      if (!isAdmin && old.approval === APPROVAL.approved) throw new Error('لا يمكن حذف سجل معتمد — اطلب من الإدارة إعادته للتعديل');
      const acc = findById_('accounts', old.accountId);
      withLock_(() => { deleteRow_(p.table, p.id); audit_(who, 'حذف', p.table, p.id, acc ? acc.name : '', summary_(p.table, old)); });
      return ok();
    }

    case 'review': {
      requireAdmin_(who);
      const items = Array.isArray(p.items) ? p.items : [{ table: p.table, id: p.id }];
      const decision = p.decision === 'return' ? APPROVAL.returned : APPROVAL.approved;
      const note = clip_(p.note, 600);
      if (decision === APPROVAL.returned && !note) throw new Error('اكتب سبب الإعادة للتعديل');
      withLock_(() => items.forEach(it => {
        if (REVIEWABLE.indexOf(it.table) < 0) return;
        const r = findById_(it.table, it.id); if (!r) return;
        Object.assign(r, { approval: decision, reviewNote: note || (decision === APPROVAL.approved ? '' : r.reviewNote), reviewedBy: who.name, reviewedAt: stamp_() });
        upsert_(it.table, r);
        const acc = findById_('accounts', r.accountId);
        audit_(who, decision === APPROVAL.approved ? 'اعتماد' : 'إعادة للتعديل', it.table, r.id, acc ? acc.name : '', note || summary_(it.table, r));
      }));
      return ok();
    }

    case 'saveBaseline': {
      if (who.role === 'viewer') throw new Error('هذا الحساب للعرض فقط');
      const asg = findById_('assign', p.assignId);
      if (!asg) throw new Error('التكليف غير موجود');
      if (!isAdmin && asg.accountId !== who.id) throw new Error('لا تملك الصلاحية');
      const n = Number(p.baseline);
      if (!(n > 0) || n > 1000000) throw new Error('أدخل عدداً صحيحاً');
      asg.baseline = Math.round(n); asg.updatedAt = stamp_();
      const acc = findById_('accounts', asg.accountId);
      withLock_(() => { upsert_('assign', asg); audit_(who, 'تعديل خط الأساس', 'assign', asg.id, acc ? acc.name : '', asg.kpiId + ' = ' + asg.baseline); });
      return ok();
    }

    // ---------- إدخال جماعي (الإدارة العليا) ----------
    case 'saveBasics': {
      requireAdmin_(who);
      const items = Array.isArray(p.items) ? p.items : [];
      const accounts = readTable_('accounts'), assigns = readTable_('assign');
      const plan = items.map(it => {
        const acc = accounts.filter(a => a.id === it.accountId && a.role === 'member')[0];
        if (!acc) throw new Error('حساب غير موجود');
        const fee = it.avgFee === '' || it.avgFee === undefined || it.avgFee === null ? '' : Number(it.avgFee);
        if (fee !== '' && (!isFinite(fee) || fee < 0 || fee > 1e7)) throw new Error('قيمة رسوم غير صالحة لـ ' + acc.name);
        const bl = (it.baselines || []).map(b => {
          const a = assigns.filter(x => x.id === b.assignId && x.accountId === acc.id)[0];
          if (!a) throw new Error('تكليف غير موجود لـ ' + acc.name);
          const v = b.baseline === '' || b.baseline === undefined || b.baseline === null ? '' : Number(b.baseline);
          if (v !== '' && (!isFinite(v) || v < 0 || v > 1e6)) throw new Error('عدد غير صالح لـ ' + acc.name);
          return { a: a, v: v === '' ? '' : Math.round(v) };
        });
        return { acc: acc, fee: fee, bl: bl };
      });
      withLock_(() => plan.forEach(x => {
        const ch = [];
        if (String(x.acc.avgFee) !== String(x.fee)) { ch.push('الرسوم: ' + (x.fee === '' ? '—' : x.fee)); x.acc.avgFee = x.fee; x.acc.updatedAt = stamp_(); upsert_('accounts', x.acc); }
        x.bl.forEach(b => { if (String(b.a.baseline) !== String(b.v)) { ch.push('خط الأساس (' + b.a.kpiId + '): ' + (b.v === '' ? '—' : b.v)); b.a.baseline = b.v; b.a.updatedAt = stamp_(); upsert_('assign', b.a); } });
        if (ch.length) audit_(who, 'تعديل البيانات الأساسية', 'accounts', x.acc.id, x.acc.name, ch.join(' • '));
      }));
      return ok();
    }
    case 'saveEventsBatch': {
      requireAdmin_(who);
      const kpi = findById_('kpis', p.kpiId);
      if (!kpi || kpi.type !== 'rate') throw new Error('المؤشر غير صالح');
      if (!/^\d{4}-\d{2}$/.test(p.month || '')) throw new Error('اختر الشهر');
      const rows = (Array.isArray(p.rows) ? p.rows : []).filter(r => ['count', 'retained', 'newEnrolled'].some(k => r[k] !== '' && r[k] !== undefined && r[k] !== null));
      const assigns = readTable_('assign'), events = readTable_('events');
      const plan = rows.map(r => {
        const acc = findById_('accounts', r.accountId);
        if (!acc || !assigns.some(a => a.accountId === r.accountId && a.kpiId === kpi.id)) throw new Error('المؤشر غير مكلّف لأحد الحسابات');
        const old = events.filter(e => e.accountId === r.accountId && e.kpiId === kpi.id && e.month === p.month)[0];
        const rec = old ? parseJsonCols_('events', Object.assign({}, old)) : { id: newId_(), accountId: r.accountId, kpiId: kpi.id, month: p.month, reasons: {}, notes: '' };
        ['count', 'retained', 'newEnrolled'].forEach(k => {
          const v = r[k] === '' || r[k] === undefined || r[k] === null ? (old ? old[k] : 0) : Number(r[k]);
          if (!isFinite(v) || v < 0 || v > 1e6) throw new Error('قيمة غير صالحة لـ ' + acc.name);
          rec[k] = Math.round(v);
        });
        const rs = Object.keys(rec.reasons || {}).reduce((t, k) => t + Number(rec.reasons[k] || 0), 0);
        if (rs > rec.count) throw new Error('عدد ' + acc.name + ' (' + rec.count + ') أقل من مجموع الأسباب المسجلة (' + rs + ') — عدّل الأسباب من صفحة التفاصيل');
        rec.reasons = JSON.stringify(rec.reasons || {});
        Object.assign(rec, { approval: APPROVAL.approved, reviewNote: old ? old.reviewNote : '', reviewedBy: who.name, reviewedAt: stamp_(), updatedAt: stamp_(), updatedBy: who.name });
        return { acc: acc, rec: rec, isNew: !old };
      });
      withLock_(() => plan.forEach(x => { upsert_('events', x.rec); audit_(who, x.isNew ? 'إضافة (إدخال جماعي)' : 'تعديل (إدخال جماعي)', 'events', x.rec.id, x.acc.name, p.month + ' : ' + x.rec.count); }));
      return ok();
    }

    // ---------- الإدارة ----------
    case 'saveAccount': {
      requireAdmin_(who);
      const src = p.account || {};
      const old = src.id ? findById_('accounts', src.id) : null;
      const rec = Object.assign({}, old || {});
      ['name', 'empNo', 'title', 'unit', 'manager'].forEach(k => { if (src[k] !== undefined) rec[k] = clip_(src[k], 120); });
      if (['admin', 'viewer', 'member'].indexOf(src.role) >= 0) rec.role = src.role;
      if (!rec.role) rec.role = 'member';
      if (src.active !== undefined) rec.active = !!src.active;
      if (src.avgFee !== undefined) rec.avgFee = src.avgFee === '' ? '' : Math.max(0, Number(src.avgFee) || 0);
      if (!rec.name) throw new Error('الاسم مطلوب');
      if (old && old.id === who.id && (rec.role !== 'admin' || !rec.active)) throw new Error('لا يمكنك إيقاف حسابك أو تغيير صلاحيته');
      // التكليفات
      let assigns = null;
      if (Array.isArray(src.assigns)) {
        if (rec.role !== 'member' && src.assigns.length) throw new Error('المؤشرات تُكلَّف لحسابات «مدير/مسؤول» فقط');
        const kpis = readTable_('kpis');
        assigns = src.assigns.map(a => {
          const k = kpis.filter(x => x.id === a.kpiId)[0];
          if (!k) throw new Error('مؤشر غير موجود');
          const t = Number(a.target), w = Number(a.weight);
          if (!isFinite(t) || !isFinite(w) || w < 0 || w > 100) throw new Error('قيمة غير صالحة في مستهدف/وزن «' + k.name + '»');
          return { kpiId: k.id, target: t, weight: w };
        });
        if (assigns.length) {
          const sum = assigns.reduce((s, a) => s + a.weight, 0);
          if (Math.abs(sum - 100) > 0.01) throw new Error('مجموع أوزان المؤشرات المكلّفة يجب أن يساوي 100% (الحالي ' + sum + '%)');
        }
      }
      if (!rec.id) { rec.id = newId_(); rec.code = newCode_(6); if (src.active === undefined) rec.active = true; }
      rec.updatedAt = stamp_();
      const cur = readTable_('assign').filter(a => a.accountId === rec.id);
      const removed = assigns ? cur.filter(a => !assigns.some(x => x.kpiId === a.kpiId)) : [];
      removed.forEach(a => {
        const k = findById_('kpis', a.kpiId);
        if (k && readTable_(TABLE_OF_TYPE[k.type]).some(r => r.accountId === rec.id && r.kpiId === a.kpiId))
          throw new Error('لا يمكن إلغاء تكليف «' + k.name + '» لوجود سجلات له — احذف سجلاته أولاً أو اجعل وزنه 0');
      });
      withLock_(() => {
        upsert_('accounts', rec);
        if (assigns) {
          removed.forEach(a => deleteRow_('assign', a.id));
          assigns.forEach(a => {
            const ex = cur.filter(x => x.kpiId === a.kpiId)[0];
            upsert_('assign', Object.assign(ex || { id: newId_(), accountId: rec.id, kpiId: a.kpiId, baseline: '' }, { target: a.target, weight: a.weight, updatedAt: stamp_() }));
          });
        }
        audit_(who, old ? 'تعديل حساب' : 'إضافة حساب', 'accounts', rec.id, rec.name, roleName_(rec.role) + (assigns ? ' • ' + assigns.length + ' مؤشر' : ''));
      });
      return ok();
    }
    case 'regenCode': {
      requireAdmin_(who);
      const acc = findById_('accounts', p.id);
      if (!acc) throw new Error('الحساب غير موجود');
      acc.code = p.code ? checkCode_(p.code, acc.id) : newCode_(6); acc.updatedAt = stamp_();
      withLock_(() => { upsert_('accounts', acc); audit_(who, p.code ? 'تعيين كود مخصص' : 'كود جديد', 'accounts', acc.id, acc.name, ''); });
      return ok();
    }
    case 'changeMyCode': {
      const c = checkCode_(p.newCode, who.id);
      withLock_(() => {
        if (who.id === 'system') { const s = readSettings_(); s.adminCode = c; writeSettings_(s); }
        else { const acc = findById_('accounts', who.id); acc.code = c; acc.updatedAt = stamp_(); upsert_('accounts', acc); }
        audit_(who, 'تغيير كود الدخول', 'accounts', who.id, who.name, 'بواسطة صاحب الحساب');
      });
      return { ok: true, newCode: c };
    }
    case 'deleteAccount': {
      requireAdmin_(who);
      const acc = findById_('accounts', p.id);
      if (!acc) throw new Error('الحساب غير موجود');
      if (acc.id === who.id) throw new Error('لا يمكنك حذف حسابك');
      withLock_(() => {
        RECORD_TABLES.concat(['assign']).forEach(t => readTable_(t).filter(r => r.accountId === acc.id).forEach(r => deleteRow_(t, r.id)));
        deleteRow_('accounts', acc.id);
        audit_(who, 'حذف حساب', 'accounts', acc.id, acc.name, 'مع جميع سجلاته');
      });
      return ok();
    }
    case 'saveKpi': {
      requireAdmin_(who);
      const src = p.kpi || {};
      const old = src.id ? findById_('kpis', src.id) : null;
      const rec = Object.assign({}, old || {});
      ['name', 'goal', 'subgoal', 'unit'].forEach(k => { if (src[k] !== undefined) rec[k] = clip_(src[k], 200); });
      if (src.text !== undefined) rec.text = clip_(src.text, 600);
      if (!rec.name) throw new Error('اسم المؤشر مطلوب');
      if (src.type !== undefined && src.type !== rec.type) {
        if (TYPES.indexOf(src.type) < 0) throw new Error('نوع القياس غير معروف');
        if (old && readTable_(TABLE_OF_TYPE[old.type]).some(r => r.kpiId === old.id)) throw new Error('لا يمكن تغيير نوع القياس لمؤشر له سجلات');
        rec.type = src.type;
      }
      if (!rec.type) throw new Error('نوع القياس مطلوب');
      rec.direction = rec.type === 'rate' ? 'down' : (rec.type === 'reading' ? (src.direction === 'down' ? 'down' : 'up') : 'up');
      ['defTarget', 'defWeight', 'order'].forEach(k => { if (src[k] !== undefined && src[k] !== '') rec[k] = Number(src[k]); if (!isFinite(rec[k])) rec[k] = 0; });
      rec.fin = rec.type === 'count' && src.fin === 'acquisition' ? 'acquisition' : rec.type === 'rate' && src.fin === 'attrition' ? 'attrition' : '';
      if (src.config !== undefined) rec.config = typeof src.config === 'string' ? src.config : JSON.stringify(src.config || {});
      if (src.active !== undefined) rec.active = !!src.active;
      if (!old) { rec.id = 'k' + newCode_(5).toLowerCase(); if (rec.active === undefined) rec.active = true; if (!rec.order) rec.order = readTable_('kpis').length + 1; }
      rec.updatedAt = stamp_();
      withLock_(() => { upsert_('kpis', rec); audit_(who, old ? 'تعديل مؤشر' : 'إضافة مؤشر', 'kpis', rec.id, '', rec.name); });
      return ok();
    }
    case 'deleteKpi': {
      requireAdmin_(who);
      const k = findById_('kpis', p.id);
      if (!k) throw new Error('المؤشر غير موجود');
      if (readTable_('assign').some(a => a.kpiId === k.id)) throw new Error('المؤشر مكلّف لحسابات — ألغِ التكليف أولاً أو أوقف المؤشر بدلاً من حذفه');
      withLock_(() => { deleteRow_('kpis', k.id); audit_(who, 'حذف مؤشر', 'kpis', k.id, '', k.name); });
      return ok();
    }
    case 'saveSettings': {
      requireAdmin_(who);
      const s = readSettings_(), src = p.settings || {};
      if (src.yearLabel) s.yearLabel = clip_(src.yearLabel, 30);
      ['yearStart', 'yearEnd'].forEach(k => { if (src[k]) { if (!/^\d{4}-\d{2}-\d{2}$/.test(src[k])) throw new Error('صيغة التاريخ غير صحيحة'); s[k] = src[k]; } });
      if (s.yearStart >= s.yearEnd) throw new Error('تاريخ نهاية العام يجب أن يكون بعد بدايته');
      if (src.schoolName) s.schoolName = clip_(src.schoolName, 80);
      if (src.systemName) s.systemName = clip_(src.systemName, 80);
      if (src.adminCode) {
        if (who.id !== 'system') throw new Error('كود مسؤول النظام يغيّره مسؤول النظام فقط');
        s.adminCode = checkCode_(src.adminCode, 'system');
      }
      withLock_(() => { writeSettings_(s); audit_(who, 'تعديل الإعدادات', 'settings', '', '', src.adminCode ? 'مع تغيير كود مسؤول النظام' : ''); });
      return { ok: true, data: buildData_(who) };
    }
    case 'getAudit': {
      requireAdmin_(who);
      const all = readTable_('audit');
      return { ok: true, audit: all.slice(-Math.min(Number(p.limit) || 300, 2000)).reverse() };
    }
    default: throw new Error('إجراء غير معروف');
  }
}

// ===================== الصلاحيات والبيانات =====================
function auth_(code) {
  code = String(code || '').trim().toUpperCase();
  if (code.length < 4) return null;
  const s = readSettings_();
  if (s.adminCode && code === String(s.adminCode).toUpperCase()) return { role: 'admin', id: 'system', name: 'مسؤول النظام', title: 'مسؤول النظام' };
  const acc = readTable_('accounts').filter(a => String(a.code).toUpperCase() === code)[0];
  if (!acc || !acc.active) return null;
  return acc;
}
function requireAdmin_(who) { if (who.role !== 'admin') throw new Error('هذه العملية للإدارة العليا فقط'); }
// التحقق من كود دخول جديد: 6–20 حرفاً إنجليزياً/رقماً/شرطة، وغير مستخدم لأي حساب آخر
function checkCode_(code, selfId) {
  const c = String(code || '').trim().toUpperCase();
  if (!/^[A-Z0-9-]{6,20}$/.test(c)) throw new Error('الكود يجب أن يكون من 6 إلى 20 خانة: حروف إنجليزية أو أرقام أو شرطة (-) فقط');
  if (/^(.)\1+$/.test(c) || ['123456', '1234567', '12345678', 'ABCDEF', 'QWERTY'].indexOf(c) >= 0) throw new Error('الكود سهل التخمين — اختر كوداً أقوى');
  const s = readSettings_();
  if (selfId !== 'system' && String(s.adminCode || '').toUpperCase() === c) throw new Error('هذا الكود مستخدم — اختر كوداً آخر');
  if (readTable_('accounts').some(a => a.id !== selfId && String(a.code).toUpperCase() === c)) throw new Error('هذا الكود مستخدم — اختر كوداً آخر');
  return c;
}
function roleName_(r) { return r === 'admin' ? 'إدارة عليا' : r === 'viewer' ? 'مشاهد' : 'مدير/مسؤول'; }

function buildData_(who) {
  const s = readSettings_();
  const settings = { yearLabel: s.yearLabel, yearStart: s.yearStart, yearEnd: s.yearEnd, schoolName: s.schoolName, systemName: s.systemName };
  const isAll = who.role === 'admin' || who.role === 'viewer';
  let accounts = readTable_('accounts');
  if (!isAll) accounts = accounts.filter(a => a.id === who.id);
  else if (who.role === 'viewer') accounts = accounts.filter(a => a.role === 'member');
  accounts = accounts.map(a => { const c = Object.assign({}, a); if (who.role !== 'admin') delete c.code; return c; });
  const ids = {}; accounts.filter(a => a.role === 'member').forEach(a => ids[a.id] = true);
  const records = {};
  RECORD_TABLES.forEach(t => { records[t] = readTable_(t).filter(r => ids[r.accountId]).map(parseJsonCols_.bind(null, t)); });
  return {
    me: { role: who.role, id: who.id, name: who.name, title: who.title || '', unit: who.unit || '' },
    settings: settings,
    kpis: readTable_('kpis').filter(k => who.role === 'admin' || k.active).map(parseJsonCols_.bind(null, 'kpis')),
    accounts: accounts,
    assigns: readTable_('assign').filter(a => ids[a.accountId]),
    records: records,
    serverTime: stamp_()
  };
}
function parseJsonCols_(t, r) {
  SCHEMA[t].cols.forEach(([k, , kind]) => { if (kind === 'json') { try { r[k] = r[k] ? JSON.parse(r[k]) : {}; } catch (e) { r[k] = {}; } } });
  return r;
}

// ===================== التحقق =====================
function sanitize_(table, src) {
  const rec = {};
  SCHEMA[table].cols.forEach(([k, , kind]) => {
    if (['accountId', 'updatedAt', 'updatedBy', 'approval', 'reviewNote', 'reviewedBy', 'reviewedAt', 'createdBy'].indexOf(k) >= 0) return;
    let v = src[k];
    if (v === undefined || v === null) v = '';
    if (kind === 'num') rec[k] = v === '' ? '' : Number(v);
    else if (kind === 'json') rec[k] = typeof v === 'object' ? v : (function () { try { return v ? JSON.parse(v) : {}; } catch (e) { return {}; } })();
    else rec[k] = clip_(v, ['notes', 'strengths', 'improvements', 'actionTaken'].indexOf(k) >= 0 ? 800 : 300);
  });
  return rec;
}
function validate_(table, r, kpi) {
  const cfg = kpi ? (typeof kpi.config === 'string' ? safeJson_(kpi.config) : kpi.config || {}) : {};
  const isDate = v => /^\d{4}-\d{2}-\d{2}$/.test(v);
  const nonNeg = keys => keys.forEach(k => {
    if (r[k] === '') r[k] = 0;
    if (!isFinite(r[k]) || r[k] < 0 || r[k] > 1e9) throw new Error('قيمة غير صالحة في الحقل: ' + k);
  });
  const cleanMap = (obj, allowed, max) => {
    const o = {}; let sum = 0;
    Object.keys(obj || {}).forEach(k => {
      if (allowed && allowed.indexOf(k) < 0) return;
      const v = Number(obj[k]); if (!isFinite(v) || v < 0 || (max != null && v > max)) throw new Error('قيمة غير صالحة: ' + k);
      if (obj[k] === '' || obj[k] === null) return;
      o[k] = Math.round(v * 10) / 10; sum += o[k];
    });
    return { o: o, sum: sum };
  };
  if (table === 'activities') {
    if (!r.title) throw new Error('الاسم مطلوب');
    if (!isDate(r.date)) throw new Error('التاريخ مطلوب');
    if (['منفذة', 'مخطط لها'].indexOf(r.status) < 0) r.status = 'منفذة';
    nonNeg(['beneficiaries', 'leads', 'applications', 'registrations', 'budget', 'cost']);
  } else if (table === 'events') {
    if (!/^\d{4}-\d{2}$/.test(r.month)) throw new Error('الشهر مطلوب');
    nonNeg(['count', 'newEnrolled', 'retained']);
    const m = cleanMap(r.reasons, cfg.reasons, null);
    if (m.sum > r.count) throw new Error('مجموع الأسباب أكبر من العدد');
    r.reasons = JSON.stringify(m.o);
    if (readTable_('events').some(x => x.accountId === r.accountId && x.kpiId === r.kpiId && x.month === r.month && x.id !== r.id))
      throw new Error('يوجد سجل لهذا الشهر مسبقاً — عدّله بدلاً من إضافة سجل جديد');
  } else if (table === 'surveys') {
    if (!isDate(r.date)) throw new Error('تاريخ القياس مطلوب');
    nonNeg(['promoters', 'passives', 'detractors', 'population']);
    const n = r.promoters + r.passives + r.detractors;
    if (n === 0) throw new Error('أدخل أعداد المستجيبين');
    if (r.population && n > r.population) throw new Error('عدد المستجيبين أكبر من إجمالي المستهدفين');
    r.reasons = JSON.stringify(cleanMap(r.reasons, cfg.reasons, null).o);
  } else if (table === 'assessments') {
    if (!isDate(r.date)) throw new Error('التاريخ مطلوب');
    const kinds = cfg.kinds || ['تقويم ذاتي', 'تقييم تجريبي', 'النتيجة الرسمية'];
    if (kinds.indexOf(r.kind) < 0) r.kind = kinds[0];
    const m = cleanMap(r.domains, cfg.domains, 100);
    r.domains = JSON.stringify(m.o);
    if (r.overall === '') {
      const vals = Object.keys(m.o).map(k => m.o[k]);
      if (!vals.length) throw new Error('أدخل النتيجة الكلية أو نتائج المجالات');
      r.overall = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10;
    } else if (!isFinite(r.overall) || r.overall < 0 || r.overall > 100) throw new Error('النتيجة الكلية بين 0 و 100');
  } else if (table === 'readings') {
    if (!isDate(r.date)) throw new Error('التاريخ مطلوب');
    if (r.value === '' || !isFinite(r.value)) throw new Error('القيمة مطلوبة');
  } else if (table === 'actions') {
    if (!r.title) throw new Error('وصف الإجراء مطلوب');
    if (!isDate(r.due)) throw new Error('تاريخ الاستحقاق مطلوب');
    if (ACTION_STATUS.indexOf(r.status) < 0) r.status = ACTION_STATUS[0];
    if (r.progress === '') r.progress = r.status === 'مكتمل' ? 100 : 0;
    if (!isFinite(r.progress) || r.progress < 0 || r.progress > 100) throw new Error('نسبة الإنجاز بين 0 و 100');
    if (r.status === 'مكتمل') r.progress = 100;
  }
}
function summary_(t, r) {
  if (t === 'activities') return (r.title || '') + ' — ' + (r.date || '');
  if (t === 'events') return (r.month || '') + ' : ' + r.count;
  if (t === 'surveys') return (r.round || '') + ' ' + (r.date || '');
  if (t === 'assessments') return (r.kind || '') + ' ' + (r.date || '') + ' = ' + r.overall + '%';
  if (t === 'readings') return (r.date || '') + ' = ' + r.value;
  if (t === 'actions') return (r.title || '') + ' (' + (r.status || '') + ')';
  return '';
}
function audit_(who, action, table, recordId, accountName, detail) {
  upsert_('audit', { id: newId_(), time: stamp_(), actor: who.name, role: roleName_(who.role), action: action,
    table: TABLE_NAMES[table] || table, recordId: recordId || '', account: accountName || '', detail: clip_(detail, 300) });
}

// ===================== طبقة الأوراق =====================
function ensureSheet_(type) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const def = SCHEMA[type];
  let sh = ss.getSheetByName(def.sheet);
  if (!sh) {
    sh = ss.insertSheet(def.sheet);
    sh.getRange(1, 1, 1, def.cols.length).setValues([def.cols.map(c => c[1])]).setFontWeight('bold').setBackground('#e8f5ef');
    sh.setFrozenRows(1);
    sh.setRightToLeft(true);
  }
  return sh;
}
const cache_ = {};
function readTable_(type) {
  if (cache_[type]) return cache_[type].map(o => Object.assign({}, o));
  const sh = ensureSheet_(type);
  const n = sh.getLastRow();
  const cols = SCHEMA[type].cols;
  if (n < 2) { cache_[type] = []; return []; }
  const vals = sh.getRange(2, 1, n - 1, cols.length).getValues();
  const tz = Session.getScriptTimeZone();
  const out = vals.filter(r => r[0] !== '' && r[0] !== null).map(row => {
    const o = {};
    cols.forEach(([k, , kind], i) => {
      let v = row[i];
      if (v instanceof Date) v = Utilities.formatDate(v, tz, kind === 'month' ? 'yyyy-MM' : 'yyyy-MM-dd');
      if (kind === 'num') v = (v === '' || v === null) ? '' : Number(v);
      else if (kind === 'bool') v = v === true || String(v).toUpperCase() === 'TRUE' || v === 'نعم';
      else v = v === null ? '' : String(v);
      o[k] = v;
    });
    return o;
  });
  cache_[type] = out;
  return out.map(o => Object.assign({}, o));
}
function toCell_(v, kind) {
  if (v === undefined || v === null) return '';
  if (kind === 'num') return v === '' ? '' : Number(v);
  if (kind === 'bool') return !!v;
  let s = (kind === 'json' && typeof v === 'object') ? JSON.stringify(v) : String(v);
  if (kind === 'date' || kind === 'month' || /^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}
function upsert_(type, rec) {
  const sh = ensureSheet_(type);
  const cols = SCHEMA[type].cols;
  const row = cols.map(([k, , kind]) => toCell_(rec[k], kind));
  const r = findRow_(sh, rec.id);
  if (r) sh.getRange(r, 1, 1, cols.length).setValues([row]);
  else sh.appendRow(row);
  delete cache_[type];
}
function deleteRow_(type, id) {
  const sh = ensureSheet_(type);
  const r = findRow_(sh, id);
  if (r) sh.deleteRow(r);
  delete cache_[type];
}
function findRow_(sh, id) {
  const n = sh.getLastRow();
  if (n < 2 || !id) return 0;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}
function findById_(type, id) { return id ? (readTable_(type).filter(a => a.id === id)[0] || null) : null; }

function readSettings_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_SHEET);
  const s = {};
  if (!sh || sh.getLastRow() < 2) return s;
  const tz = Session.getScriptTimeZone();
  sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues().forEach(([k, v]) => {
    if (!k) return;
    s[k] = v instanceof Date ? Utilities.formatDate(v, tz, 'yyyy-MM-dd') : String(v);
  });
  return s;
}
function writeSettings_(s) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SETTINGS_SHEET);
  if (!sh) { sh = ss.insertSheet(SETTINGS_SHEET); sh.setRightToLeft(true); }
  sh.clearContents();
  const rows = [['المفتاح', 'القيمة']].concat(Object.keys(s).map(k => [k, "'" + s[k]]));
  sh.getRange(1, 1, rows.length, 2).setValues(rows);
}

// ===================== أدوات =====================
function withLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try { return fn(); } finally { lock.releaseLock(); }
}
function safeJson_(s) { try { return s ? JSON.parse(s) : {}; } catch (e) { return {}; } }
function newId_() { return Utilities.getUuid().slice(0, 8) + Date.now().toString(36).slice(-4); }
function newCode_(len) {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < len; i++) c += A.charAt(Math.floor(Math.random() * A.length));
  return c;
}
function clip_(v, n) { return String(v === undefined || v === null ? '' : v).trim().slice(0, n); }
function stamp_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm"); }
