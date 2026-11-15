/**
 * متابعة الحصص – مدارس دار الذكر
 * خادم بسيط على Google Sheets: لكل مشرف كود دخول، وبياناته (جدوله وإعداداته وتذكيراته) محفوظة هنا.
 *
 * الإعداد لمرة واحدة:
 *   1) شغّل الدالة setup مرة واحدة (تنشئ الأوراق وتضيف حسابك).
 *   2) Deploy ← New deployment ← Web app ← Execute as: Me ← Who has access: Anyone ← Deploy.
 *   3) انسخ رابط /exec وضعه في ملف timetable/config.js في المنصة.
 *
 * إضافة مشرف جديد: من الشيت ← قائمة «متابعة الحصص» ← «إضافة مشرف جديد».
 * إيقاف مشرف: غيّر عمود «مفعّل» في ورقة «المشرفون» إلى «لا».
 */

const USERS = 'المشرفون';
const DATA = 'البيانات';
const CHUNK = 45000; // أقصى طول آمن لخلية واحدة

function onOpen() {
  SpreadsheetApp.getUi().createMenu('متابعة الحصص')
    .addItem('إضافة مشرف جديد', 'addSupervisor')
    .addItem('إنشاء كود جديد للمشرف المحدد', 'regenerateCode')
    .addToUi();
}

function setup() {
  const ss = SpreadsheetApp.getActive();
  let u = ss.getSheetByName(USERS);
  if (!u) {
    u = ss.insertSheet(USERS);
    u.appendRow(['الكود', 'الاسم', 'القسم / الوحدة', 'مفعّل', 'تاريخ الإضافة', 'ملاحظات']);
    u.getRange('1:1').setFontWeight('bold').setBackground('#0f6e6a').setFontColor('#ffffff');
    u.setFrozenRows(1); u.setRightToLeft(true);
    u.setColumnWidths(1, 6, 160);
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
    u.appendRow([code, 'مصطفى أحمد حسين', 'وحدة مهارات القرن 21', 'نعم', new Date(), 'صاحب النظام']);
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
    .appendRow([code, n.getResponseText().trim(), dep.getResponseText().trim(), 'نعم', new Date(), '']);
  ui.alert('تمت الإضافة ✓\n\nالمشرف: ' + n.getResponseText().trim() + '\nالكود: ' + code + '\n\nأرسل له رابط الصفحة والكود.');
}

function regenerateCode() {
  const ss = SpreadsheetApp.getActive(), u = ss.getSheetByName(USERS), ui = SpreadsheetApp.getUi();
  const r = u.getActiveCell().getRow();
  if (ss.getActiveSheet().getName() !== USERS || r < 2) { ui.alert('اذهب لورقة «المشرفون» واختر أي خانة في صف المشرف أولًا.'); return; }
  const old = String(u.getRange(r, 1).getValue()).trim().toUpperCase();
  const code = newCode_();
  u.getRange(r, 1).setValue(code);
  // نقل بياناته للكود الجديد
  const d = ss.getSheetByName(DATA), vals = d.getRange(1, 1, Math.max(d.getLastRow(), 1), 1).getValues();
  for (let i = 1; i < vals.length; i++) if (String(vals[i][0]).trim().toUpperCase() === old) d.getRange(i + 1, 1).setValue(code);
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
  const v = u.getRange(2, 1, u.getLastRow() - 1, 4).getValues();
  for (const r of v) {
    if (String(r[0]).trim().toUpperCase() === code) {
      const active = String(r[3]).trim();
      if (active === 'لا' || active.toLowerCase() === 'no') return null;
      return { code: code, name: String(r[1]), dept: String(r[2]) };
    }
  }
  return null;
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
      return out_({ ok: true, name: user.name, dept: user.dept, data: r ? r.data : null, stamp: r ? r.stamp : 0 }, cb);
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
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: 'server', message: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e) {}
  }
}

// البيانات الأولية (تُستخدم مرة واحدة عند setup). فارغة في النسخة المنشورة.
const SEED_ = { cfg: null, prefs: { reminders: [], lead: 5 } };
