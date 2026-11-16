/**
 * لوحة متابعة مؤشرات الأداء السنوية لمديري المراحل — مدارس دار الذكر
 * الخادم: Google Apps Script + Google Sheet
 * ---------------------------------------------------------------
 * طريقة التشغيل (مرة واحدة):
 *  1) أنشئ Google Sheet جديداً ← Extensions ← Apps Script ← الصق هذا الملف كاملاً.
 *  2) اختر الدالة setup من القائمة العلوية ← Run ← وافق على الصلاحيات.
 *     ستُنشأ الأوراق تلقائياً، وتظهر أكواد الدخول في ورقة «الحسابات» و«الإعدادات».
 *  3) Deploy ← New deployment ← Web app ← Execute as: Me ← Who has access: Anyone ← Deploy.
 *  4) انسخ رابط /exec وضعه في ملف kpi/config.js.
 * ملاحظة: لا تغيّر ترتيب الأعمدة في الأوراق (الكود يعتمد على ترتيبها).
 */

// ===================== المخطط (ترتيب الأعمدة ثابت) =====================
const SCHEMA = {
  accounts: {
    sheet: 'الحسابات',
    cols: [
      ['id', 'المعرف', 'text'], ['role', 'نوع الحساب', 'text'], ['name', 'الاسم', 'text'],
      ['empNo', 'الرقم الوظيفي', 'text'], ['title', 'المسمى الوظيفي', 'text'], ['stage', 'المرحلة (مختصر)', 'text'],
      ['manager', 'المدير المباشر', 'text'], ['code', 'كود الدخول', 'text'], ['active', 'مفعل', 'bool'],
      ['baseline', 'عدد الطلاب المسجلين فعلياً بداية العام', 'num'],
      ['t_init', 'مستهدف المبادرات', 'num'], ['t_wd', 'سقف نسبة الانسحاب %', 'num'], ['t_nps', 'مستهدف NPS', 'num'],
      ['t_etec', 'مستهدف الاعتماد %', 'num'], ['t_enps', 'مستهدف eNPS', 'num'],
      ['w_init', 'وزن المبادرات', 'num'], ['w_wd', 'وزن الانسحاب', 'num'], ['w_nps', 'وزن NPS', 'num'],
      ['w_etec', 'وزن الاعتماد', 'num'], ['w_enps', 'وزن eNPS', 'num'],
      ['updatedAt', 'آخر تحديث', 'text']
    ]
  },
  initiatives: {
    sheet: 'المبادرات',
    cols: [
      ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['date', 'التاريخ', 'date'],
      ['title', 'اسم المبادرة', 'text'], ['kind', 'النوع', 'text'], ['audience', 'الفئة المستهدفة', 'text'],
      ['status', 'الحالة', 'text'], ['attendees', 'عدد الحضور', 'num'], ['leads', 'الأسر المهتمة', 'num'],
      ['registrations', 'تسجيلات ناتجة', 'num'], ['evidence', 'رابط الشواهد', 'text'], ['notes', 'ملاحظات', 'text'],
      ['updatedAt', 'آخر تحديث', 'text']
    ]
  },
  withdrawals: {
    sheet: 'الانسحاب الشهري',
    cols: [
      ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['month', 'الشهر', 'month'],
      ['withdrawn', 'عدد المنسحبين', 'num'], ['newEnrolled', 'ملتحقون جدد', 'num'],
      ['r_move', 'سبب: انتقال سكن/سفر', 'num'], ['r_fees', 'سبب: الرسوم', 'num'], ['r_academic', 'سبب: أكاديمي', 'num'],
      ['r_service', 'سبب: عدم الرضا عن الخدمة', 'num'], ['r_other', 'سبب: أخرى', 'num'],
      ['notes', 'ملاحظات', 'text'], ['updatedAt', 'آخر تحديث', 'text']
    ]
  },
  surveys: {
    sheet: 'الاستبانات',
    cols: [
      ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kind', 'النوع (nps/enps)', 'text'],
      ['date', 'تاريخ القياس', 'date'], ['round', 'الجولة', 'text'], ['promoters', 'المروّجون 9-10', 'num'],
      ['passives', 'المحايدون 7-8', 'num'], ['detractors', 'المنتقدون 0-6', 'num'], ['population', 'إجمالي المستهدفين', 'num'],
      ['evidence', 'رابط النتائج', 'text'], ['notes', 'ملاحظات', 'text'], ['updatedAt', 'آخر تحديث', 'text']
    ]
  },
  etec: {
    sheet: 'الاعتماد المدرسي',
    cols: [
      ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['date', 'التاريخ', 'date'],
      ['kind', 'نوع التقييم', 'text'], ['d_admin', 'الإدارة المدرسية %', 'num'], ['d_teach', 'التعليم والتعلم %', 'num'],
      ['d_outcomes', 'نواتج التعلم %', 'num'], ['d_env', 'البيئة المدرسية %', 'num'], ['overall', 'النتيجة الكلية %', 'num'],
      ['evidence', 'رابط الشواهد', 'text'], ['notes', 'ملاحظات', 'text'], ['updatedAt', 'آخر تحديث', 'text']
    ]
  }
};
const RECORD_TYPES = ['initiatives', 'withdrawals', 'surveys', 'etec'];
const SETTINGS_SHEET = 'الإعدادات';
const DEFAULT_SETTINGS = {
  adminCode: '', yearLabel: '2026/2027', yearStart: '2026-08-20', yearEnd: '2027-06-30',
  schoolName: 'مدارس دار الذكر'
};
const DEFAULTS = { t_init: 4, t_wd: 8, t_nps: 40, t_etec: 85, t_enps: 80, w_init: 35, w_wd: 10, w_nps: 20, w_etec: 25, w_enps: 10 };

// الحسابات الأولية من نماذج اتفاقية مؤشرات الأداء الموقعة بتاريخ 20/8/2026
const SEED_ACCOUNTS = [
  { name: 'رامي الشهراني', empNo: '19237', title: 'مدير المرحلة الابتدائية', stage: 'ابتدائي بنين', manager: 'د. مصطفى خلف', t_etec: 85 },
  { name: 'عبير طاهر', empNo: '22404', title: 'مديرة المرحلة الابتدائية - بنات', stage: 'ابتدائي بنات', manager: 'د. مصطفى خلف', t_etec: 85 },
  { name: 'خالد بخيت', empNo: '20825', title: 'مدير المرحلة المتوسطة - بنين', stage: 'متوسط بنين', manager: 'أ. بسام غراب', t_etec: 92 },
  { name: 'سلطان الشهابي', empNo: '21710', title: 'مدير المرحلة الثانوية', stage: 'ثانوي بنين', manager: 'د. مصطفى خلف', t_etec: 87 }
];

// ===================== الإعداد الأولي =====================
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // الإعدادات
  let st = ss.getSheetByName(SETTINGS_SHEET);
  if (!st) {
    st = ss.insertSheet(SETTINGS_SHEET);
    st.getRange(1, 1, 1, 2).setValues([['المفتاح', 'القيمة']]);
  }
  const settings = readSettings_();
  Object.keys(DEFAULT_SETTINGS).forEach(k => { if (settings[k] === undefined || settings[k] === '') settings[k] = DEFAULT_SETTINGS[k]; });
  if (!settings.adminCode) settings.adminCode = 'ADM-' + newCode_(6);
  writeSettings_(settings);
  // أوراق البيانات
  Object.keys(SCHEMA).forEach(t => ensureSheet_(t));
  // الحسابات الأولية (مرة واحدة فقط)
  const accounts = readTable_('accounts');
  if (accounts.length === 0) {
    SEED_ACCOUNTS.forEach(a => {
      const rec = Object.assign({}, DEFAULTS, a, { id: newId_(), role: 'principal', code: newCode_(6), active: true, baseline: '' });
      upsert_('accounts', rec);
    });
  }
  const msg = 'تم الإعداد.\nكود مدير التعليم (المسؤول): ' + settings.adminCode + '\n' +
    readTable_('accounts').map(a => a.name + ' : ' + a.code).join('\n');
  Logger.log(msg);
  return msg;
}

// ===================== نقطة الدخول (JSONP) =====================
function doGet(e) {
  const p = (e && e.parameter) || {};
  let out;
  try {
    out = route_(p.action || '', String(p.code || '').trim(), p.p ? JSON.parse(p.p) : {});
  } catch (err) {
    out = { ok: false, error: String(err && err.message || err) };
  }
  const json = JSON.stringify(out);
  if (p.callback && /^[A-Za-z_$][\w$]*$/.test(p.callback)) {
    return ContentService.createTextOutput(p.callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function route_(action, code, p) {
  if (action === 'ping') return { ok: true, time: new Date().toISOString() };
  const who = auth_(code);
  if (!who) return { ok: false, error: 'كود الدخول غير صحيح أو الحساب موقوف' };

  switch (action) {
    case 'login':
    case 'getData':
      return { ok: true, data: buildData_(who) };

    case 'saveRecord': {
      if (who.role === 'viewer') throw new Error('هذا الحساب للعرض فقط');
      const type = p.type;
      if (RECORD_TYPES.indexOf(type) < 0) throw new Error('نوع سجل غير معروف');
      const rec = sanitize_(type, p.record || {});
      rec.accountId = who.role === 'admin' ? String(p.record.accountId || '') : who.id;
      if (!findAccount_(rec.accountId)) throw new Error('الحساب غير موجود');
      validate_(type, rec);
      if (rec.id) {
        const old = readTable_(type).filter(r => r.id === rec.id)[0];
        if (old && who.role !== 'admin' && old.accountId !== who.id) throw new Error('لا تملك صلاحية تعديل هذا السجل');
      } else rec.id = newId_();
      rec.updatedAt = stamp_();
      withLock_(() => upsert_(type, rec));
      return { ok: true, data: buildData_(who) };
    }

    case 'deleteRecord': {
      if (who.role === 'viewer') throw new Error('هذا الحساب للعرض فقط');
      if (RECORD_TYPES.indexOf(p.type) < 0) throw new Error('نوع سجل غير معروف');
      const old = readTable_(p.type).filter(r => r.id === p.id)[0];
      if (!old) throw new Error('السجل غير موجود');
      if (who.role !== 'admin' && old.accountId !== who.id) throw new Error('لا تملك صلاحية حذف هذا السجل');
      withLock_(() => deleteRow_(p.type, p.id));
      return { ok: true, data: buildData_(who) };
    }

    case 'saveBaseline': {
      if (who.role === 'viewer') throw new Error('هذا الحساب للعرض فقط');
      const id = who.role === 'admin' ? p.accountId : who.id;
      const acc = findAccount_(id);
      if (!acc) throw new Error('الحساب غير موجود');
      const n = Number(p.baseline);
      if (!(n > 0) || n > 100000) throw new Error('أدخل عدداً صحيحاً للطلاب');
      acc.baseline = Math.round(n);
      acc.updatedAt = stamp_();
      withLock_(() => upsert_('accounts', acc));
      return { ok: true, data: buildData_(who) };
    }

    // ----- إدارة (مدير التعليم فقط) -----
    case 'saveAccount': {
      requireAdmin_(who);
      const src = p.account || {};
      const acc = src.id ? findAccount_(src.id) : null;
      const rec = Object.assign({}, DEFAULTS, acc || {});
      ['name', 'empNo', 'title', 'stage', 'manager'].forEach(k => { if (src[k] !== undefined) rec[k] = clip_(src[k], 120); });
      if (src.role === 'viewer' || src.role === 'principal') rec.role = src.role;
      if (!rec.role) rec.role = 'principal';
      Object.keys(DEFAULTS).forEach(k => {
        if (src[k] !== undefined && src[k] !== '') rec[k] = Number(src[k]);
        if (rec[k] === '' || !isFinite(rec[k])) rec[k] = DEFAULTS[k];
        if (rec[k] < -100 || rec[k] > 100000) throw new Error('قيمة غير صالحة: ' + k);
      });
      if (src.baseline !== undefined) rec.baseline = src.baseline === '' ? '' : Math.max(0, Math.round(Number(src.baseline) || 0));
      if (src.active !== undefined) rec.active = !!src.active;
      if (!rec.name) throw new Error('الاسم مطلوب');
      const wsum = rec.w_init + rec.w_wd + rec.w_nps + rec.w_etec + rec.w_enps;
      if (Math.abs(wsum - 100) > 0.01) throw new Error('مجموع الأوزان يجب أن يساوي 100% (الحالي ' + wsum + '%)');
      if (!rec.id) { rec.id = newId_(); rec.code = newCode_(6); rec.active = src.active === undefined ? true : !!src.active; }
      rec.updatedAt = stamp_();
      withLock_(() => upsert_('accounts', rec));
      return { ok: true, data: buildData_(who) };
    }
    case 'regenCode': {
      requireAdmin_(who);
      const acc = findAccount_(p.id);
      if (!acc) throw new Error('الحساب غير موجود');
      acc.code = newCode_(6);
      acc.updatedAt = stamp_();
      withLock_(() => upsert_('accounts', acc));
      return { ok: true, data: buildData_(who) };
    }
    case 'deleteAccount': {
      requireAdmin_(who);
      const acc = findAccount_(p.id);
      if (!acc) throw new Error('الحساب غير موجود');
      withLock_(() => {
        RECORD_TYPES.forEach(t => readTable_(t).filter(r => r.accountId === acc.id).forEach(r => deleteRow_(t, r.id)));
        deleteRow_('accounts', acc.id);
      });
      return { ok: true, data: buildData_(who) };
    }
    case 'saveSettings': {
      requireAdmin_(who);
      const s = readSettings_();
      const src = p.settings || {};
      if (src.yearLabel) s.yearLabel = clip_(src.yearLabel, 30);
      ['yearStart', 'yearEnd'].forEach(k => {
        if (src[k]) { if (!/^\d{4}-\d{2}-\d{2}$/.test(src[k])) throw new Error('صيغة التاريخ غير صحيحة'); s[k] = src[k]; }
      });
      if (s.yearStart >= s.yearEnd) throw new Error('تاريخ نهاية العام يجب أن يكون بعد بدايته');
      if (src.schoolName) s.schoolName = clip_(src.schoolName, 80);
      if (src.adminCode) {
        const c = String(src.adminCode).trim().toUpperCase();
        if (c.length < 6) throw new Error('كود المسؤول يجب ألا يقل عن 6 أحرف');
        if (readTable_('accounts').some(a => String(a.code).toUpperCase() === c)) throw new Error('هذا الكود مستخدم لحساب آخر');
        s.adminCode = c;
      }
      withLock_(() => writeSettings_(s));
      return { ok: true, data: buildData_({ role: 'admin', id: 'admin', name: 'مدير التعليم' }), newAdminCode: !!src.adminCode };
    }
    default:
      throw new Error('إجراء غير معروف');
  }
}

// ===================== الصلاحيات والبيانات =====================
function auth_(code) {
  code = String(code || '').trim().toUpperCase();
  if (code.length < 4) return null;
  const s = readSettings_();
  if (s.adminCode && code === String(s.adminCode).toUpperCase()) return { role: 'admin', id: 'admin', name: 'مدير التعليم' };
  const acc = readTable_('accounts').filter(a => String(a.code).toUpperCase() === code)[0];
  if (!acc || !acc.active) return null;
  return acc;
}
function requireAdmin_(who) { if (who.role !== 'admin') throw new Error('هذه العملية لمدير التعليم فقط'); }

function buildData_(who) {
  const s = readSettings_();
  const settings = { yearLabel: s.yearLabel, yearStart: s.yearStart, yearEnd: s.yearEnd, schoolName: s.schoolName };
  let accounts = readTable_('accounts');
  const isAll = who.role === 'admin' || who.role === 'viewer';
  if (!isAll) accounts = accounts.filter(a => a.id === who.id);
  // الأكواد تظهر للمسؤول فقط
  accounts = accounts.map(a => { const c = Object.assign({}, a); if (who.role !== 'admin') delete c.code; return c; });
  const principals = isAll ? accounts.filter(a => a.role !== 'viewer') : accounts;
  const ids = {}; principals.forEach(a => ids[a.id] = true);
  const records = {};
  RECORD_TYPES.forEach(t => { records[t] = readTable_(t).filter(r => ids[r.accountId]); });
  return {
    me: { role: who.role, id: who.id, name: who.name, title: who.title || '', stage: who.stage || '' },
    settings: settings,
    accounts: who.role === 'admin' ? accounts : principals,
    records: records,
    serverTime: stamp_()
  };
}

// ===================== التحقق من المدخلات =====================
function sanitize_(type, src) {
  const rec = {};
  SCHEMA[type].cols.forEach(([k, , kind]) => {
    if (k === 'accountId' || k === 'updatedAt') return;
    let v = src[k];
    if (v === undefined || v === null) v = '';
    if (kind === 'num') rec[k] = v === '' ? '' : Number(v);
    else rec[k] = clip_(v, k === 'notes' ? 600 : 300);
  });
  return rec;
}
function validate_(type, r) {
  const nonNeg = keys => keys.forEach(k => {
    if (r[k] === '') r[k] = 0;
    if (!isFinite(r[k]) || r[k] < 0 || r[k] > 100000) throw new Error('قيمة غير صالحة في الحقل: ' + k);
    r[k] = Math.round(r[k]);
  });
  const isDate = v => /^\d{4}-\d{2}-\d{2}$/.test(v);
  if (type === 'initiatives') {
    if (!r.title) throw new Error('اسم المبادرة مطلوب');
    if (!isDate(r.date)) throw new Error('تاريخ المبادرة مطلوب');
    if (['منفذة', 'مخطط لها'].indexOf(r.status) < 0) r.status = 'منفذة';
    nonNeg(['attendees', 'leads', 'registrations']);
  } else if (type === 'withdrawals') {
    if (!/^\d{4}-\d{2}$/.test(r.month)) throw new Error('الشهر مطلوب');
    nonNeg(['withdrawn', 'newEnrolled', 'r_move', 'r_fees', 'r_academic', 'r_service', 'r_other']);
    const reasons = r.r_move + r.r_fees + r.r_academic + r.r_service + r.r_other;
    if (reasons > r.withdrawn) throw new Error('مجموع الأسباب أكبر من عدد المنسحبين');
    const dup = readTable_('withdrawals').filter(x => x.accountId === r.accountId && x.month === r.month && x.id !== r.id);
    if (dup.length) throw new Error('يوجد سجل لهذا الشهر مسبقاً — عدّله بدلاً من إضافة سجل جديد');
  } else if (type === 'surveys') {
    if (['nps', 'enps'].indexOf(r.kind) < 0) throw new Error('نوع الاستبانة غير معروف');
    if (!isDate(r.date)) throw new Error('تاريخ القياس مطلوب');
    nonNeg(['promoters', 'passives', 'detractors', 'population']);
    if (r.promoters + r.passives + r.detractors === 0) throw new Error('أدخل أعداد المستجيبين');
  } else if (type === 'etec') {
    if (!isDate(r.date)) throw new Error('التاريخ مطلوب');
    if (['تقويم ذاتي', 'تقييم تجريبي', 'النتيجة الرسمية'].indexOf(r.kind) < 0) r.kind = 'تقويم ذاتي';
    ['d_admin', 'd_teach', 'd_outcomes', 'd_env', 'overall'].forEach(k => {
      if (r[k] === '') return;
      if (!isFinite(r[k]) || r[k] < 0 || r[k] > 100) throw new Error('النسب يجب أن تكون بين 0 و 100');
    });
    if (r.overall === '') {
      const ds = ['d_admin', 'd_teach', 'd_outcomes', 'd_env'].map(k => r[k]).filter(v => v !== '');
      if (!ds.length) throw new Error('أدخل النتيجة الكلية أو نتائج المجالات');
      r.overall = Math.round(ds.reduce((a, b) => a + b, 0) / ds.length * 10) / 10;
    }
  }
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
function readTable_(type) {
  const sh = ensureSheet_(type);
  const n = sh.getLastRow();
  if (n < 2) return [];
  const cols = SCHEMA[type].cols;
  const vals = sh.getRange(2, 1, n - 1, cols.length).getValues();
  const tz = Session.getScriptTimeZone();
  return vals.filter(r => r[0] !== '' && r[0] !== null).map(row => {
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
}
function toCell_(v, kind) {
  if (v === undefined || v === null) return '';
  if (kind === 'num') return v === '' ? '' : Number(v);
  if (kind === 'bool') return !!v;
  let s = String(v);
  // التواريخ تُحفظ نصاً حتى لا يحولها الجدول، ومنع تنفيذ الصيغ
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
}
function deleteRow_(type, id) {
  const sh = ensureSheet_(type);
  const r = findRow_(sh, id);
  if (r) sh.deleteRow(r);
}
function findRow_(sh, id) {
  const n = sh.getLastRow();
  if (n < 2 || !id) return 0;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}
function findAccount_(id) { return readTable_('accounts').filter(a => a.id === id)[0] || null; }

function readSettings_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SETTINGS_SHEET);
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
  if (!sh) { sh = ss.insertSheet(SETTINGS_SHEET); }
  sh.clearContents();
  const rows = [['المفتاح', 'القيمة']].concat(Object.keys(s).map(k => [k, "'" + s[k]]));
  sh.getRange(1, 1, rows.length, 2).setValues(rows);
}

// ===================== أدوات =====================
function withLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}
function newId_() { return Utilities.getUuid().slice(0, 8) + Date.now().toString(36).slice(-4); }
function newCode_(len) {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < len; i++) c += A.charAt(Math.floor(Math.random() * A.length));
  return c;
}
function clip_(v, n) { return String(v === undefined || v === null ? '' : v).trim().slice(0, n); }
function stamp_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm"); }
