/**
 * منصة الإشراف التربوي – مدارس دار الذكر
 * خادم بسيط على Google Sheets: لكل مشرف كود دخول، وبياناته (جدوله وإعداداته وتذكيراته) محفوظة هنا.
 *
 * الإعداد لمرة واحدة:
 *   1) شغّل الدالة setup مرة واحدة (تنشئ الأوراق وتضيف حسابك).
 *   2) Deploy ← New deployment ← Web app ← Execute as: Me ← Who has access: Anyone ← Deploy.
 *   3) انسخ رابط /exec وضعه في ملف timetable/config.js في المنصة.
 *
 * إدارة المشرفين (إضافة/إيقاف/كود جديد/حذف): من الصفحة نفسها ← تبويب «المشرفون» (يظهر للمدير فقط).
 * ويمكن أيضًا من الشيت: قائمة «منصة الإشراف». عمود «مدير» = نعم يعطي صلاحية الإدارة.
 */

const USERS = 'المشرفون';
const MSGS = 'الرسائل';
const DATA = 'البيانات';
const CHUNK = 45000; // أقصى طول آمن لخلية واحدة
const ONESIGNAL_APP_ID = '6f0b9d1d-b9c7-4d3c-90a0-ac78f2dc170b'; // معرّف عام (ليس سرًا)
const PAGE_URL = 'https://moustafaahussien.github.io/21csu/timetable/';
// تنبيهات يومية عامة لكل المشرفين (من الأحد للخميس) — عدّل الوقت أو النص هنا
const DAILY_ALERTS = [
  { id: 'dhuhr', time: '12:55', title: '🕌 صلاة الظهر', body: 'حان الآن وقت التوجه لصلاة الظهر.' }
];

function onOpen() {
  SpreadsheetApp.getUi().createMenu('منصة الإشراف')
    .addItem('إضافة مشرف جديد', 'addSupervisor')
    .addItem('إنشاء كود جديد للمشرف المحدد', 'regenerateCode')
    .addToUi();
}

function setup() {
  const ss = SpreadsheetApp.getActive();
  let u = ss.getSheetByName(USERS);
  if (!u) {
    u = ss.insertSheet(USERS);
    u.appendRow(['الكود', 'الاسم', 'القسم / الوحدة', 'مفعّل', 'تاريخ الإضافة', 'ملاحظات', 'مدير']);
    u.getRange('1:1').setFontWeight('bold').setBackground('#0f6e6a').setFontColor('#ffffff');
    u.setFrozenRows(1); u.setRightToLeft(true);
    u.setColumnWidths(1, 7, 160);
  }
  let d = ss.getSheetByName(DATA);
  if (!d) {
    d = ss.insertSheet(DATA);
    d.appendRow(['الكود', 'آخر تحديث', 'ختم', 'البيانات (لا تعدّل يدويًا)']);
    d.getRange('1:1').setFontWeight('bold');
    d.setFrozenRows(1);
  }
  // حذف الورقة الافتراضية الفارغة
  ss.getSheets().forEach(function (sh) {
    if (sh.getName() !== USERS && sh.getName() !== DATA && sh.getLastRow() === 0 && ss.getSheets().length > 2) ss.deleteSheet(sh);
  });

  // حساب صاحب النظام مع جدوله الحالي
  if (u.getLastRow() < 2) {
    const code = newCode_();
    u.appendRow([code, 'مصطفى أحمد حسين', 'وحدة مهارات القرن 21', 'نعم', new Date(), 'صاحب النظام', 'نعم']);
    writeData_(code, SEED_, Date.now());
    Logger.log('كودك: ' + code);
    try { SpreadsheetApp.getUi().alert('تم الإعداد ✓\n\nكود الدخول الخاص بك: ' + code + '\n\nالخطوة التالية: Deploy ← New deployment ← Web app.'); } catch (e) {}
  }
}

function addSupervisor() {
  const ui = SpreadsheetApp.getUi();
  const n = ui.prompt('إضافة مشرف', 'اسم المشرف:', ui.ButtonSet.OK_CANCEL);
  if (n.getSelectedButton() !== ui.Button.OK || !n.getResponseText().trim()) return;
  const dep = ui.prompt('إضافة مشرف', 'القسم أو الوحدة (مثال: قسم الرياضيات):', ui.ButtonSet.OK_CANCEL);
  if (dep.getSelectedButton() !== ui.Button.OK) return;
  const code = newCode_();
  SpreadsheetApp.getActive().getSheetByName(USERS)
    .appendRow([code, n.getResponseText().trim(), dep.getResponseText().trim(), 'نعم', new Date(), '', '']);
  ui.alert('تمت الإضافة ✓\n\nالمشرف: ' + n.getResponseText().trim() + '\nالكود: ' + code + '\n\nأرسل له رابط الصفحة والكود.');
}

function regenerateCode() {
  const ss = SpreadsheetApp.getActive(), u = ss.getSheetByName(USERS), ui = SpreadsheetApp.getUi();
  const r = u.getActiveCell().getRow();
  if (ss.getActiveSheet().getName() !== USERS || r < 2) { ui.alert('اذهب لورقة «المشرفون» واختر أي خانة في صف المشرف أولًا.'); return; }
  const old = String(u.getRange(r, 1).getValue()).trim().toUpperCase();
  const code = newCode_();
  renameCode_(old, code, false); // نقل بياناته ورسائله للكود الجديد
  ui.alert('الكود الجديد: ' + code + '\nالكود القديم لم يعد يعمل.');
}

function newCode_() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const u = SpreadsheetApp.getActive().getSheetByName(USERS);
  const used = u ? u.getRange(1, 1, Math.max(u.getLastRow(), 1), 1).getValues().map(r => String(r[0]).toUpperCase()) : [];
  let c;
  do { c = ''; for (let i = 0; i < 8; i++) c += chars[Math.floor(Math.random() * chars.length)]; } while (used.indexOf(c) >= 0);
  return c;
}

function findUser_(code) {
  code = String(code || '').trim().toUpperCase();
  if (!code) return null;
  const u = SpreadsheetApp.getActive().getSheetByName(USERS);
  if (!u || u.getLastRow() < 2) return null;
  const v = u.getRange(2, 1, u.getLastRow() - 1, 8).getValues();
  for (let i = 0; i < v.length; i++) {
    const r = v[i];
    if (String(r[0]).trim().toUpperCase() === code) {
      const active = String(r[3]).trim();
      if (active === 'لا' || active.toLowerCase() === 'no') return null;
      return { code: code, name: String(r[1]), dept: String(r[2]), row: i + 2, admin: isAdminRow_(r), ids: pushIds_(code, r[7]), sid: r[4] instanceof Date ? 's' + r[4].getTime() : 'n' + String(r[1]) };
    }
  }
  return null;
}

// معرّفات الإشعار: الكود الحالي + معرّفات الأكواد السابقة (حتى تستمر الإشعارات على الأجهزة القديمة بعد تغيير الكود)
function pushIds_(code, prev) {
  const ids = [externalId_(code)];
  String(prev || '').split(',').forEach(function (x) { x = x.trim(); if (/^tt_[0-9a-f]{24}$/.test(x) && ids.indexOf(x) < 0) ids.push(x); });
  return ids;
}
// تغيير كود مستخدم في كل الأوراق: المشرفون + البيانات + الرسائل
function renameCode_(old, neu, keepPushIds) {
  const ss = SpreadsheetApp.getActive();
  const u = usersSheet_();
  const r = rowOf_(u, old);
  if (!r) return false;
  u.getRange(r, 1).setValue(neu);
  if (keepPushIds) {
    const prev = pushIds_(old, u.getRange(r, 8).getValue()).slice(0, 4); // نحتفظ بآخر 4 معرّفات فقط
    u.getRange(r, 8).setValue(prev.join(','));
  } else {
    u.getRange(r, 8).setValue(''); // كود جديد من المدير (مثلًا عند تسرّب الكود): الأجهزة القديمة تتوقف
  }
  const d = ss.getSheetByName(DATA);
  if (d && d.getLastRow() >= 2) {
    const vals = d.getRange(2, 1, d.getLastRow() - 1, 1).getValues();
    for (let i = 0; i < vals.length; i++) if (String(vals[i][0]).trim().toUpperCase() === old) d.getRange(i + 2, 1).setValue(neu);
  }
  const m = ss.getSheetByName(MSGS);
  if (m && m.getLastRow() >= 2) {
    const rg = m.getRange(2, 5, m.getLastRow() - 1, 1), tv = rg.getValues();
    let ch = false;
    tv.forEach(function (row) {
      const t = String(row[0]); if (t === 'all') return;
      const parts = t.split(','); const k = parts.indexOf(old);
      if (k >= 0) { parts[k] = neu; row[0] = parts.join(','); ch = true; }
    });
    if (ch) rg.setValues(tv);
  }
  return true;
}
// تغيير الكود بواسطة المشرف نفسه
function changeOwnCode_(user, p) {
  const neu = String(p.newcode || '').trim().toUpperCase().replace(/\s+/g, '');
  if (!/^[A-Z0-9]{6,16}$/.test(neu)) return { ok: false, error: 'bad_format' };
  if (!/[A-Z]/.test(neu) || !/[0-9]/.test(neu)) return { ok: false, error: 'weak' };
  if (/^(.)\1+$/.test(neu.replace(/[0-9]/g, '')) && /^(.)\1+$/.test(neu.replace(/[A-Z]/g, ''))) return { ok: false, error: 'weak' };
  if (neu === user.code) return { ok: false, error: 'same' };
  const cache = CacheService.getScriptCache(), ck = 'chg_' + user.row + '_' + user.name;
  const tries = Number(cache.get(ck) || 0);
  if (tries >= 5) return { ok: false, error: 'too_many' };
  const u = usersSheet_();
  if (rowOf_(u, neu)) return { ok: false, error: 'taken' };
  if (!renameCode_(user.code, neu, true)) return { ok: false, error: 'not_found' };
  cache.put(ck, String(tries + 1), 3600);
  return { ok: true, code: neu };
}

function isAdminRow_(r) {
  return String(r[6]).trim() === 'نعم' || String(r[5]).indexOf('صاحب النظام') >= 0;
}

/* ===== إدارة المشرفين من الصفحة (للمدير فقط) ===== */
function usersSheet_() {
  const u = SpreadsheetApp.getActive().getSheetByName(USERS);
  if (String(u.getRange(1, 7).getValue()).trim() === '') u.getRange(1, 7).setValue('مدير').setFontWeight('bold').setBackground('#0f6e6a').setFontColor('#ffffff');
  if (String(u.getRange(1, 8).getValue()).trim() === '') u.getRange(1, 8).setValue('معرّفات إشعار سابقة (لا تعدّل)').setFontWeight('bold').setBackground('#0f6e6a').setFontColor('#ffffff');
  return u;
}
function listUsers_() {
  const u = usersSheet_();
  const n = u.getLastRow();
  if (n < 2) return [];
  const v = u.getRange(2, 1, n - 1, 8).getValues();
  const d = SpreadsheetApp.getActive().getSheetByName(DATA);
  const dn = d.getLastRow();
  const upd = {};
  if (dn >= 2) d.getRange(2, 1, dn - 1, 2).getValues().forEach(function (r) { upd[String(r[0]).trim().toUpperCase()] = r[1] instanceof Date ? r[1].getTime() : 0; });
  return v.filter(function (r) { return String(r[0]).trim(); }).map(function (r) {
    const c = String(r[0]).trim().toUpperCase();
    const a = String(r[3]).trim();
    return { code: c, name: String(r[1]), dept: String(r[2]), active: !(a === 'لا' || a.toLowerCase() === 'no'),
      added: r[4] instanceof Date ? r[4].getTime() : 0, admin: isAdminRow_(r), updated: upd[c] || 0, ids: pushIds_(c, r[7]) };
  });
}
function rowOf_(u, code) {
  const n = u.getLastRow();
  if (n < 2) return 0;
  const v = u.getRange(2, 1, n - 1, 1).getValues();
  for (let i = 0; i < v.length; i++) if (String(v[i][0]).trim().toUpperCase() === code) return i + 2;
  return 0;
}
function adminAction_(p, me) {
  const u = usersSheet_();
  const target = String(p.target || '').trim().toUpperCase();
  if (p.action === 'admin_setpush') {
    const k = String(p.key || '').trim();
    if (!/^os_v2_app_[a-z0-9]+$/.test(k)) return { ok: false, error: 'bad_key' };
    PropertiesService.getScriptProperties().setProperty('OS_KEY', k);
    return { ok: true };
  }
  if (p.action === 'admin_broadcast') {
    const title = String(p.title || '').trim().slice(0, 80);
    const body = String(p.body || '').trim().slice(0, 600);
    if (!body) return { ok: false, error: 'no_body' };
    const all = listUsers_().filter(function (u) { return u.active; });
    let targets = String(p.targets || 'all').trim();
    let list = all;
    if (targets !== 'all') {
      const want = targets.split(',').map(function (s) { return s.trim().toUpperCase(); });
      list = all.filter(function (u) { return want.indexOf(u.code) >= 0; });
      targets = list.map(function (u) { return u.code; }).join(',');
    }
    if (!list.length) return { ok: false, error: 'no_targets' };
    const id = 'm' + Date.now();
    const head = title || ('رسالة من ' + me.name);
    let push = { ok: false };
    try { push = sendPushTo_(flatIds_(list), '📩 ' + head, body, id, PAGE_URL + '#msgs'); } catch (e) { push = { ok: false, error: String(e) }; }
    msgsSheet_().appendRow([id, new Date(), head, body, targets, me.name, push.ok ? 'نعم' : 'لا']);
    return { ok: true, count: list.length, pushed: !!push.ok, pushError: push.ok ? '' : (push.error || '') };
  }
  if (p.action === 'admin_msgs') {
    return { ok: true, msgs: readMsgs_(null, 50) };
  }
  if (p.action === 'admin_list') return { ok: true, users: listUsers_() };
  if (p.action === 'admin_add') {
    const name = String(p.name || '').trim(), dept = String(p.dept || '').trim();
    if (!name) return { ok: false, error: 'no_name' };
    const code = newCode_();
    u.appendRow([code, name, dept, 'نعم', new Date(), '', '']);
    return { ok: true, code: code, users: listUsers_() };
  }
  const r = rowOf_(u, target);
  if (!r) return { ok: false, error: 'not_found' };
  if (target === me.code && p.action !== 'admin_edit') return { ok: false, error: 'self' };
  if (p.action === 'admin_toggle') {
    u.getRange(r, 4).setValue(String(p.active) === '1' ? 'نعم' : 'لا');
    return { ok: true, users: listUsers_() };
  }
  if (p.action === 'admin_edit') {
    if (p.name !== undefined && String(p.name).trim()) u.getRange(r, 2).setValue(String(p.name).trim());
    if (p.dept !== undefined) u.getRange(r, 3).setValue(String(p.dept).trim());
    return { ok: true, users: listUsers_() };
  }
  if (p.action === 'admin_regen') {
    const code = newCode_();
    renameCode_(target, code, false);
    return { ok: true, code: code, users: listUsers_() };
  }
  if (p.action === 'admin_delete') {
    const x = dataRow_(target);
    if (x.row) x.sheet.deleteRow(x.row);
    u.deleteRow(r);
    return { ok: true, users: listUsers_() };
  }
  return { ok: false, error: 'bad_action' };
}

function dataRow_(code) {
  const d = SpreadsheetApp.getActive().getSheetByName(DATA);
  const n = d.getLastRow();
  if (n < 2) return { sheet: d, row: 0 };
  const v = d.getRange(2, 1, n - 1, 1).getValues();
  for (let i = 0; i < v.length; i++) if (String(v[i][0]).trim().toUpperCase() === code) return { sheet: d, row: i + 2 };
  return { sheet: d, row: 0 };
}

function readData_(code) {
  const x = dataRow_(code);
  if (!x.row) return null;
  const lastCol = x.sheet.getLastColumn();
  const row = x.sheet.getRange(x.row, 1, 1, lastCol).getValues()[0];
  const json = row.slice(3).join('');
  if (!json) return null;
  try { return { data: JSON.parse(json), stamp: Number(row[2]) || 0 }; } catch (e) { return null; }
}

function writeData_(code, data, stamp) {
  const json = JSON.stringify(data);
  const parts = [];
  for (let i = 0; i < json.length; i += CHUNK) parts.push(json.slice(i, i + CHUNK));
  const x = dataRow_(code), d = x.sheet;
  const row = x.row || d.getLastRow() + 1;
  const lastCol = Math.max(d.getLastColumn(), 4);
  d.getRange(row, 1, 1, lastCol).clearContent();
  const vals = [code, new Date(), stamp].concat(parts);
  d.getRange(row, 1, 1, vals.length).setNumberFormat('@').setValues([vals.map(String)]);
  d.getRange(row, 2).setNumberFormat('yyyy-mm-dd hh:mm').setValue(new Date());
}

function out_(obj, cb) {
  const json = JSON.stringify(obj);
  if (cb && /^[A-Za-z_$][\w$]{0,60}$/.test(cb)) {
    return ContentService.createTextOutput(cb + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const cb = p.callback;
  try {
    const user = findUser_(p.code);
    if (p.action === 'login') {
      if (!user) return out_({ ok: false, error: 'bad_code' }, cb);
      const r = readData_(user.code);
      return out_({ ok: true, name: user.name, dept: user.dept, admin: user.admin, data: r ? r.data : null, stamp: r ? r.stamp : 0 }, cb);
    }
    if (String(p.action || '').indexOf('admin_') === 0) {
      if (!user || !user.admin) return out_({ ok: false, error: 'not_admin' }, cb);
      const lock = LockService.getScriptLock();
      lock.waitLock(20000);
      try { return out_(adminAction_(p, user), cb); } finally { lock.releaseLock(); }
    }
    if (p.action === 'msgs') {
      if (!user) return out_({ ok: false, error: 'bad_code' }, cb);
      return out_({ ok: true, msgs: readMsgs_(user.code, 30) }, cb);
    }
    if (p.action === 'change_code') {
      if (!user) return out_({ ok: false, error: 'bad_code' }, cb);
      const lock = LockService.getScriptLock();
      lock.waitLock(20000);
      try { return out_(changeOwnCode_(user, p), cb); } finally { lock.releaseLock(); }
    }
    if (p.action === 'push_test') {
      if (!user) return out_({ ok: false, error: 'bad_code' }, cb);
      const r = sendPush_(user, '🔔 تنبيه تجريبي', 'التنبيهات تعمل على هذا الجهاز ✓ — ستصلك تنبيهات حصصك هكذا.', 'test-' + Date.now());
      return out_(r, cb);
    }
    if (p.action === 'ver') {
      if (!user) return out_({ ok: false, error: 'bad_code' }, cb);
      const x = dataRow_(user.code);
      const stamp = x.row ? Number(x.sheet.getRange(x.row, 3).getValue()) || 0 : 0;
      return out_({ ok: true, stamp: stamp }, cb);
    }
    return out_({ ok: true, service: 'timetable' }, cb);
  } catch (err) {
    return out_({ ok: false, error: 'server', message: String(err) }, cb);
  }
}

/* ===== نسخة مقروءة من تقييمات المعلمين في ورقة «التقييمات» (للمدير) ===== */
const EVALS = 'التقييمات';
const EV_BANDS_ = [[90, 'استثنائي'], [80, 'متميز'], [70, 'متقدم'], [60, 'قابل للتطوير'], [0, 'غير مرضٍ']];
function evalsSheet_() {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(EVALS);
  if (!sh) {
    sh = ss.insertSheet(EVALS);
    const head = ['المعرّف', 'رمز المشرف (لا تعدّل)', 'المشرف', 'المعلم', 'المادة', 'الفصل', 'المرحلة', 'تاريخ الزيارة', 'الحصة', 'موضوع الدرس', 'رقم الزيارة', 'نوع الزيارة', 'المُقيِّم', 'الدرجة/100', 'المتوسط/5', 'الفئة الوصفية', 'متوسط أداء الشعبة'];
    for (let i = 1; i <= 20; i++) head.push('بند ' + i);
    head.push('ممارسات جيدة', 'توصيات لتجويد التعلم', 'تأملات المعلم', 'آخر تعديل');
    sh.appendRow(head);
    sh.getRange(1, 1, 1, head.length).setFontWeight('bold').setBackground('#0f6e6a').setFontColor('#ffffff');
    sh.setFrozenRows(1); sh.setRightToLeft(true); sh.hideColumns(1, 2);
  }
  return sh;
}
function syncEvals_(user, evals) {
  if (!Array.isArray(evals)) evals = [];
  const json = JSON.stringify(evals);
  const hash = Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, json + '|' + user.name, Utilities.Charset.UTF_8));
  const props = PropertiesService.getScriptProperties(), pk = 'evh_' + user.sid;
  if (props.getProperty(pk) === hash) return; // لا تغيير
  const sh = evalsSheet_();
  const n = sh.getLastRow();
  if (n >= 2) {
    const sids = sh.getRange(2, 2, n - 1, 1).getValues();
    for (let i = sids.length - 1; i >= 0; i--) if (String(sids[i][0]) === user.sid) sh.deleteRow(i + 2);
  }
  const rows = evals.filter(function (x) { return x && x.id; }).sort(function (a, b) { return String(a.date).localeCompare(String(b.date)); }).map(function (x) {
    const sc = (Array.isArray(x.scores) ? x.scores : []).slice(0, 20).map(function (v) { v = Number(v); return v >= 1 && v <= 5 ? v : ''; });
    while (sc.length < 20) sc.push('');
    const rated = sc.filter(function (v) { return v !== ''; }).length;
    const tot = sc.reduce(function (a, v) { return a + (v === '' ? 0 : v); }, 0);
    const done = rated === 20;
    const band = done ? EV_BANDS_.filter(function (b) { return tot >= b[0]; })[0][1] : '';
    return [String(x.id), user.sid, user.name, x.teacher || '', x.subj || '', x.cls || '', x.stage || '', x.date || '', x.period || '', x.topic || '', x.visitNo || '', x.visitType || '', x.evaluator || '',
      done ? tot : 'غير مكتمل (' + rated + '/20)', done ? Math.round(tot / 20 * 100) / 100 : '', band, x.sectionAvg || ''].concat(sc, [x.good || '', x.rec || '', x.refl || '', x.updated ? new Date(Number(x.updated)) : '']);
  });
  if (rows.length) {
    const rg = sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length);
    rg.setNumberFormat('@'); // نص كما هو (حتى لا تتحول أسماء الفصول مثل 2-3 إلى تواريخ)
    rg.setValues(rows.map(function (r) { return r.map(function (v, i) { return i === r.length - 1 || typeof v === 'number' ? v : String(v); }); }));
    sh.getRange(rg.getRow(), 14, rows.length, 2).setNumberFormat('0.##');
    sh.getRange(rg.getRow(), 18, rows.length, 20).setNumberFormat('0');
    sh.getRange(rg.getRow(), rows[0].length, rows.length, 1).setNumberFormat('yyyy-mm-dd hh:mm');
  }
  props.setProperty(pk, hash);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const body = JSON.parse(e.postData.contents);
    if (body.action !== 'save') return out_({ ok: false, error: 'bad_action' });
    const user = findUser_(body.code);
    if (!user) return out_({ ok: false, error: 'bad_code' });
    if (!body.data || typeof body.data !== 'object') return out_({ ok: false, error: 'bad_data' });
    writeData_(user.code, body.data, Number(body.stamp) || Date.now());
    try { syncEvals_(user, body.data.prefs && body.data.prefs.evals); } catch (e) {}
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: 'server', message: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

// البيانات الأولية (تُستخدم مرة واحدة عند setup). فارغة في النسخة المنشورة.
const SEED_ = { cfg: null, prefs: { reminders: [], lead: 5 } };

/* ===== التنبيه على الجوال (OneSignal Web Push) ===== */
function externalId_(code) {
  const b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, 'tt:' + code, Utilities.Charset.UTF_8);
  return 'tt_' + b.map(function (x) { return ('0' + (x & 255).toString(16)).slice(-2); }).join('').slice(0, 24);
}
function sendPush_(user, title, body, ref) { return sendPushTo_(user.ids || [externalId_(user.code)], title, body, ref); }
function flatIds_(list) { const out = []; list.forEach(function (u) { (u.ids || [externalId_(u.code)]).forEach(function (x) { if (out.indexOf(x) < 0) out.push(x); }); }); return out; }
function sendPushTo_(externalIds, title, body, ref, url) {
  const key = PropertiesService.getScriptProperties().getProperty('OS_KEY');
  if (!key) return { ok: false, error: 'no_key' };
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    target_channel: 'push',
    include_aliases: { external_id: externalIds },
    headings: { en: title, ar: title },
    contents: { en: body, ar: body },
    url: url || PAGE_URL,
    web_push_topic: String(ref || '').slice(0, 60),
    priority: 10
  };
  const res = UrlFetchApp.fetch('https://api.onesignal.com/notifications', {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    headers: { Authorization: 'Key ' + key }, payload: JSON.stringify(payload)
  });
  const codeHttp = res.getResponseCode();
  let j = {}; try { j = JSON.parse(res.getContentText()); } catch (e) {}
  if (codeHttp >= 300) return { ok: false, error: 'http_' + codeHttp, detail: String(res.getContentText()).slice(0, 200) };
  if (j.errors && !j.id) return { ok: false, error: 'no_subscribers', detail: JSON.stringify(j.errors).slice(0, 200) };
  return { ok: true, id: j.id || '' };
}
// يعمل كل دقيقة: يرسل التنبيهات المستحقة لكل المشرفين
function pushTick() {
  const now = new Date();
  const tz = 'Asia/Riyadh';
  const dow = Number(Utilities.formatDate(now, tz, 'u')); // 1=الاثنين ... 7=الأحد
  const hour = Number(Utilities.formatDate(now, tz, 'H'));
  if (dow === 5 || dow === 6) return;           // الجمعة والسبت
  if (hour < 6 || hour >= 15) return;           // خارج الدوام
  const users = {}; listUsers_().forEach(function (u) { users[u.code] = u; });
  const cache = CacheService.getScriptCache();
  // التنبيهات اليومية العامة
  const hm = Utilities.formatDate(now, tz, 'HH:mm'), today = Utilities.formatDate(now, tz, 'yyyy-MM-dd');
  DAILY_ALERTS.forEach(function (a) {
    const p = a.time.split(':'), target = Number(p[0]) * 60 + Number(p[1]);
    const cur = Number(hm.slice(0, 2)) * 60 + Number(hm.slice(3, 5));
    if (cur < target || cur > target + 4) return;           // نافذة 5 دقائق
    const ck = 'daily_' + a.id + '_' + today;
    if (cache.get(ck)) return;
    cache.put(ck, '1', 21600);
    const ids = flatIds_(Object.keys(users).map(function (c) { return users[c]; }).filter(function (x) { return x.active; }));
    if (ids.length) sendPushTo_(ids, a.title, a.body, 'daily-' + a.id + '-' + today);
  });
  const d = SpreadsheetApp.getActive().getSheetByName(DATA);
  const n = d.getLastRow(); if (n < 2) return;
  const rows = d.getRange(2, 1, n - 1, d.getLastColumn()).getValues();
  const t = now.getTime();
  rows.forEach(function (r) {
    const code = String(r[0]).trim().toUpperCase();
    const u = users[code]; if (!u || !u.active) return;
    let data; try { data = JSON.parse(r.slice(3).join('')); } catch (e) { return; }
    const q = (data && data.prefs && data.prefs.push) || [];
    q.forEach(function (it) {
      if (!it || !it.at) return;
      if (it.at > t + 20000 || it.at < t - 5 * 60000) return; // مستحق الآن (مع سماحية 5 دقائق)
      const ck = 'p_' + (u.added || code) + '_' + it.id; // لا يتأثر بتغيير الكود

      if (cache.get(ck)) return;
      cache.put(ck, '1', 21600);
      sendPush_(u, it.title, it.body, it.id);
    });
  });
}
// شغّلها مرة واحدة من المحرر لتفعيل الإرسال التلقائي كل دقيقة
function installPushTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (tr) { if (tr.getHandlerFunction() === 'pushTick') ScriptApp.deleteTrigger(tr); });
  ScriptApp.newTrigger('pushTick').timeBased().everyMinutes(1).create();
  PropertiesService.getScriptProperties().getProperty('OS_KEY'); // لطلب الصلاحيات
  UrlFetchApp.getRequest('https://api.onesignal.com/notifications');
  Logger.log('تم تفعيل الإرسال التلقائي ✓');
}

/* ===== رسائل المدير للمشرفين ===== */
function msgsSheet_() {
  const ss = SpreadsheetApp.getActive();
  let m = ss.getSheetByName(MSGS);
  if (!m) {
    m = ss.insertSheet(MSGS);
    m.appendRow(['المعرّف', 'التاريخ', 'العنوان', 'الرسالة', 'المستلمون', 'المرسل', 'أُرسل إشعار']);
    m.getRange('1:1').setFontWeight('bold').setBackground('#0f6e6a').setFontColor('#ffffff');
    m.setFrozenRows(1); m.setRightToLeft(true);
  }
  return m;
}
function readMsgs_(code, limit) {
  const m = msgsSheet_();
  const n = m.getLastRow(); if (n < 2) return [];
  const v = m.getRange(2, 1, n - 1, 7).getValues();
  const out = [];
  for (let i = v.length - 1; i >= 0 && out.length < limit; i--) {
    const r = v[i]; const tg = String(r[4]);
    if (code && tg !== 'all' && tg.split(',').indexOf(code) < 0) continue;
    out.push({ id: String(r[0]), at: r[1] instanceof Date ? r[1].getTime() : 0, title: String(r[2]), body: String(r[3]), from: String(r[5]), targets: code ? undefined : tg });
  }
  return out;
}
