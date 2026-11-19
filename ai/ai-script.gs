/* =====================================================================
   منصة المعلم الذكي — الخادم (Google Apps Script)
   ---------------------------------------------------------------------
   طريقة التركيب (مرة واحدة):
   1) أنشئ Google Sheet جديداً باسم «منصة المعلم الذكي».
   2) من القائمة: الإضافات (Extensions) ← Apps Script، احذف أي كود والصق هذا الملف كاملاً.
   3) عدّل كود المدير المبدئي في السطر INITIAL_ADMIN_CODE أدناه، ثم احفظ.
   4) من القائمة العلوية اختر الدالة setup ثم اضغط «تشغيل» (Run) ووافق على الصلاحيات.
      ستنشئ: ورقة products + مجلد في Drive للملفات + كود المدير.
   5) Deploy ← New deployment ← Web app:
        Execute as: Me   |   Who has access: Anyone
      انسخ رابط /exec وضعه في ملف ai/config.js في الموقع.
   عند أي تعديل لاحق على هذا الكود: Deploy ← Manage deployments ← ✏️ ← Version: New version ← Deploy
   (الرابط يبقى كما هو).
   ===================================================================== */

const INITIAL_ADMIN_CODE = 'ChangeMe-2026';   // ← غيّره قبل تشغيل setup (يمكن تغييره لاحقاً من لوحة الإدارة)
const SITE_URL_DEFAULT  = 'https://moustafaahussien.github.io/21csu/ai/';
const SHEET_NAME = 'products';
const FOLDER_NAME = 'منصة المعلم الذكي - ملفات المنتجات';

const COLS = ['id','status','featured','createdAt','updatedAt','teacher','email','subject','subjectOther','stage','grades',
  'title','type','tasks','tools','summary','idea','url','appFileId','appFileName','fileId','fileName','fileMime',
  'prompt','video','coverId','imageIds','buildSteps','useSteps','tips','views','likes','editHash','adminNote','draft',
  'goal','skill','level','duration','impact','notes','verified','ratings'];
const JSON_COLS = ['tasks','tools','imageIds','buildSteps','useSteps'];
const TYPES = ['link','html','agent','file','prompt'];
const STATUSES = ['pending','approved','rejected'];
const LIMITS = { teacher:80, email:120, subject:40, subjectOther:60, stage:30, grades:60, title:120, summary:300, idea:2000,
  url:600, prompt:8000, video:300, tips:1500, step:600, steps:20, tasks:11, tools:12, tool:40, images:4,
  goal:300, skill:120, duration:60, impact:1000, notes:1500 };
/* معايير تقييم المنتجات وأوزانها (المجموع 100) */
const RATE_W = { content:25, pedagogy:25, design:20, ease:15, reuse:15 };
const MAX_APP_BYTES = 5 * 1024 * 1024, MAX_FILE_BYTES = 10 * 1024 * 1024, MAX_IMG_BYTES = 2 * 1024 * 1024;
const FILE_MIMES = {
  'application/pdf':'pdf',
  'application/msword':'doc','application/vnd.openxmlformats-officedocument.wordprocessingml.document':'docx',
  'application/vnd.ms-powerpoint':'ppt','application/vnd.openxmlformats-officedocument.presentationml.presentation':'pptx',
  'application/vnd.ms-excel':'xls','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'xlsx'
};
const IMG_MIMES = ['image/jpeg','image/png','image/webp','image/gif'];

/* ============================ الإعداد ============================ */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('شغّل هذا الكود من داخل Google Sheet (الإضافات ← Apps Script)');
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  sh.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold').setBackground('#ede9fe');
  sh.setFrozenRows(1);
  const props = PropertiesService.getScriptProperties();
  props.setProperty('SHEET_ID', ss.getId());
  if (!props.getProperty('ADMIN_CODE')) props.setProperty('ADMIN_CODE', INITIAL_ADMIN_CODE);
  if (!props.getProperty('SALT')) props.setProperty('SALT', Utilities.getUuid());
  if (!props.getProperty('SITE_URL')) props.setProperty('SITE_URL', SITE_URL_DEFAULT);
  if (!props.getProperty('NOTIFY_EMAIL')) { try { props.setProperty('NOTIFY_EMAIL', Session.getEffectiveUser().getEmail() || ''); } catch (e) {} }
  folder_();
  Logger.log('تم الإعداد ✓ — كود المدير الحالي: ' + props.getProperty('ADMIN_CODE'));
}

function props_() { return PropertiesService.getScriptProperties(); }
function sheet_() {
  const id = props_().getProperty('SHEET_ID');
  const ss = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) throw new Error('لم يتم الإعداد بعد: شغّل الدالة setup من محرر Apps Script');
  return sh;
}
function folder_() {
  const p = props_();
  const id = p.getProperty('FOLDER_ID');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) {} }
  const f = DriveApp.createFolder(FOLDER_NAME);
  try { f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
  p.setProperty('FOLDER_ID', f.getId());
  return f;
}

/* ============================ نقاط الدخول ============================ */
function doGet(e) {
  const p = (e && e.parameter) || {};
  // فتح تطبيق HTML مرفوع في صفحة مستقلة
  if (p.action === 'open') return openApp_(String(p.id || ''));
  let out;
  try { out = route_(String(p.action || ''), p.p ? JSON.parse(p.p) : {}, false); }
  catch (err) { out = { ok:false, error: msg_(err) }; }
  const json = JSON.stringify(out);
  if (p.callback && /^[A-Za-z_$][\w$]*$/.test(p.callback))
    return ContentService.createTextOutput(p.callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
function doPost(e) {
  let out;
  try {
    const b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    out = route_(String(b.action || ''), b.p || {}, true);
  } catch (err) { out = { ok:false, error: msg_(err) }; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
function msg_(err) { return String(err && err.message || err); }

const PUBLIC_GET = ['ping','list','get','app','view','like','rate'];
const WRITE = ['submit','teacherUpdate','adminSet','adminFeature','adminVerify','adminDelete','adminUpdate','adminDraft','adminSettings','adminResetCode','adminStar','view','like','rate'];

function route_(action, p, isPost) {
  // كل ما يحمل أكواداً أو ملفات يجب أن يأتي POST (لا يظهر في الروابط)
  if (!isPost && PUBLIC_GET.indexOf(action) < 0) return { ok:false, error:'طلب غير مسموح' };
  if (action.indexOf('admin') === 0) {
    if (action === 'adminLogin') return adminLogin_(p);
    checkAdmin_(p.adminCode);
  }
  const run = () => {
    switch (action) {
      case 'ping': return { ok:true, time:new Date().toISOString() };
      case 'list': { const all = rows_(); return { ok:true, items: all.filter(r => r.status === 'approved').map(publicCard_), star: starPublic_(all) }; }
      case 'get': return getPublic_(p.id);
      case 'app': return appContent_(p.id, 'public');
      case 'view': return bump_(p.id, 'views', 1);
      case 'like': return bump_(p.id, 'likes', Number(p.delta) < 0 ? -1 : 1);
      case 'rate': return rate_(p);
      case 'adminVerify': return patch_(p.id, { verified: p.verified ? 'yes' : '' });
      case 'submit': return submit_(p);
      case 'teacherGet': return teacherGet_(p);
      case 'teacherApp': checkTeacher_(p.id, p.code); return appContent_(p.id, 'owner', p.draft);
      case 'teacherUpdate': return teacherUpdate_(p);
      case 'adminList': return { ok:true, items: rows_().map(adminCard_), settings: settings_(), star: starGet_() };
      case 'adminStar': return adminStar_(p);
      case 'adminApp': return appContent_(p.id, 'owner', p.draft);
      case 'adminSet': return adminSet_(p);
      case 'adminFeature': return patch_(p.id, { featured: p.featured ? 'yes' : '' });
      case 'adminDelete': return adminDelete_(p);
      case 'adminUpdate': return adminUpdate_(p);
      case 'adminDraft': return adminDraft_(p);
      case 'adminSettings': return adminSettings_(p);
      case 'adminResetCode': return adminResetCode_(p);
      default: return { ok:false, error:'إجراء غير معروف: ' + action };
    }
  };
  if (WRITE.indexOf(action) < 0) return run();
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return { ok:false, error:'الخادم مشغول، حاول مرة أخرى بعد لحظات' };
  try { return run(); } finally { lock.releaseLock(); }
}

/* ============================ القراءة والكتابة ============================ */
function rows_() {
  const sh = sheet_();
  const v = sh.getDataRange().getValues();
  const head = v.shift() || [];
  return v.filter(r => r[0] !== '').map((r, i) => {
    const o = { _row: i + 2 };
    head.forEach((h, j) => { o[h] = r[j]; });
    JSON_COLS.forEach(k => { try { o[k] = o[k] ? JSON.parse(o[k]) : []; } catch (e) { o[k] = []; } });
    try { o.draft = o.draft ? JSON.parse(o.draft) : null; } catch (e) { o.draft = null; }
    try { o.ratings = o.ratings ? JSON.parse(o.ratings) : null; } catch (e) { o.ratings = null; }
    o.views = Number(o.views) || 0; o.likes = Number(o.likes) || 0;
    o.createdAt = iso_(o.createdAt); o.updatedAt = iso_(o.updatedAt);
    return o;
  });
}
function iso_(d) { return d instanceof Date ? d.toISOString() : String(d || ''); }
function find_(id) {
  id = String(id || '');
  const r = rows_().find(x => String(x.id) === id);
  if (!r) throw new Error('المنتج غير موجود');
  return r;
}
function write_(row, obj) {
  const sh = sheet_();
  const vals = COLS.map(k => {
    let v = obj[k];
    if (JSON_COLS.indexOf(k) >= 0) v = JSON.stringify(v || []);
    else if (k === 'draft' || k === 'ratings') v = v ? JSON.stringify(v) : '';
    return v == null ? '' : v;
  });
  if (row) sh.getRange(row, 1, 1, COLS.length).setValues([vals]);
  else sh.appendRow(vals);
}
function patch_(id, fields) {
  const r = find_(id);
  Object.assign(r, fields, { updatedAt: new Date().toISOString() });
  write_(r._row, r);
  return { ok:true };
}

/* ============================ تمثيل البيانات ============================ */
const PUBLIC_FIELDS = ['id','featured','createdAt','updatedAt','teacher','subject','subjectOther','stage','grades','title','type',
  'tasks','tools','summary','idea','url','appFileName','fileId','fileName','fileMime','prompt','video','coverId','imageIds',
  'buildSteps','useSteps','tips','views','likes','goal','skill','level','duration','impact','notes','verified'];
function ratingInfo_(r) {
  const R = r.ratings, n = R && R.n || 0, out = { ratingCount: n, ratingAvg: 0, ratingBy: {} };
  if (!n) return out;
  let tot = 0;
  Object.keys(RATE_W).forEach(k => { const avg = (Number(R.s && R.s[k]) || 0) / n; out.ratingBy[k] = Math.round(avg * 10) / 10; tot += RATE_W[k] * avg / 5; });
  out.ratingAvg = Math.round(tot * 10) / 10;
  return out;
}
function pick_(r, fields) { const o = {}; fields.forEach(k => { o[k] = r[k]; }); o.hasApp = !!r.appFileId; Object.assign(o, ratingInfo_(r)); return o; }
function publicCard_(r) {
  const o = pick_(r, ['id','featured','createdAt','teacher','subject','subjectOther','stage','grades','title','type','tasks','tools','summary','url','coverId','views','likes','skill','level','verified']);
  o.hasPrompt = !!r.prompt; o.prompt = r.type === 'prompt' ? String(r.prompt || '').slice(0, 4000) : '';
  return o;
}
function adminCard_(r) {
  const o = pick_(r, PUBLIC_FIELDS.concat(['status','email','adminNote']));
  o.draft = r.draft ? Object.assign({}, r.draft, { appFileId: undefined, hasApp: !!r.draft.appFileId }) : null;
  return o;
}
function getPublic_(id) {
  const r = find_(id);
  if (r.status !== 'approved') return { ok:false, notPublic:true, status:r.status, error:'هذا المنتج غير منشور حالياً' };
  return { ok:true, item: pick_(r, PUBLIC_FIELDS) };
}
function appContent_(id, mode, useDraft) {
  const r = find_(id);
  if (mode === 'public' && r.status !== 'approved') throw new Error('هذا المنتج غير منشور حالياً');
  const fid = (useDraft && r.draft && r.draft.appFileId) || r.appFileId;
  if (!fid) throw new Error('لا يوجد تطبيق مرفوع لهذا المنتج');
  return { ok:true, html: DriveApp.getFileById(fid).getBlob().getDataAsString('UTF-8') };
}
function openApp_(id) {
  try {
    const r = find_(id);
    if (r.status !== 'approved' || !r.appFileId) throw new Error('هذا التطبيق غير منشور');
    const html = DriveApp.getFileById(r.appFileId).getBlob().getDataAsString('UTF-8');
    return HtmlService.createHtmlOutput(html).setTitle(String(r.title || 'تطبيق'))
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return HtmlService.createHtmlOutput('<div dir="rtl" style="font-family:Tahoma;padding:40px;text-align:center">' + msg_(err) + '</div>');
  }
}
function rate_(p) {
  const r = find_(p.id);
  if (r.status !== 'approved') return { ok:false, error:'المنتج غير منشور' };
  const sc = p.scores || {}, R = r.ratings || { s:{}, n:0 };
  Object.keys(RATE_W).forEach(k => { const v = Math.round(Number(sc[k])); if (!(v >= 1 && v <= 5)) throw new Error('قيّم كل المعايير من 1 إلى 5'); });
  Object.keys(RATE_W).forEach(k => { R.s[k] = (Number(R.s[k]) || 0) + Math.round(Number(sc[k])); });
  R.n = (Number(R.n) || 0) + 1;
  sheet_().getRange(r._row, COLS.indexOf('ratings') + 1).setValue(JSON.stringify(R));
  r.ratings = R;
  return Object.assign({ ok:true }, ratingInfo_(r));
}
function bump_(id, key, d) {
  const r = find_(id);
  if (r.status !== 'approved') return { ok:false };
  const v = Math.max(0, (Number(r[key]) || 0) + d);
  const sh = sheet_();
  sh.getRange(r._row, COLS.indexOf(key) + 1).setValue(v);
  return { ok:true, value:v };
}

/* ============================ التحقق من البيانات ============================ */
function str_(v, max) { return String(v == null ? '' : v).replace(/\u0000/g, '').trim().slice(0, max); }
function arr_(v, maxN, maxL) { return (Array.isArray(v) ? v : []).map(x => str_(x, maxL)).filter(Boolean).slice(0, maxN); }
function url_(v) {
  const s = str_(v, LIMITS.url);
  if (!s) return '';
  if (!/^https?:\/\/[^\s]+$/i.test(s)) throw new Error('الرابط غير صحيح — يجب أن يبدأ بـ https://');
  return s;
}
function clean_(d) {
  d = d || {};
  const o = {
    teacher: str_(d.teacher, LIMITS.teacher), email: str_(d.email, LIMITS.email),
    subject: str_(d.subject, LIMITS.subject), subjectOther: str_(d.subjectOther, LIMITS.subjectOther),
    stage: str_(d.stage, LIMITS.stage), grades: str_(d.grades, LIMITS.grades),
    title: str_(d.title, LIMITS.title), type: str_(d.type, 10),
    tasks: arr_(d.tasks, LIMITS.tasks, 30), tools: arr_(d.tools, LIMITS.tools, LIMITS.tool),
    summary: str_(d.summary, LIMITS.summary), idea: str_(d.idea, LIMITS.idea),
    url: url_(d.url), prompt: str_(d.prompt, LIMITS.prompt), video: d.video ? url_(d.video) : '',
    buildSteps: arr_(d.buildSteps, LIMITS.steps, LIMITS.step), useSteps: arr_(d.useSteps, LIMITS.steps, LIMITS.step),
    tips: str_(d.tips, LIMITS.tips),
    goal: str_(d.goal, LIMITS.goal), skill: str_(d.skill, LIMITS.skill), level: ['b','m','a'].indexOf(d.level) >= 0 ? d.level : '',
    duration: str_(d.duration, LIMITS.duration), impact: str_(d.impact, LIMITS.impact), notes: str_(d.notes, LIMITS.notes)
  };
  if (o.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.email)) throw new Error('البريد الإلكتروني غير صحيح');
  if (!o.teacher) throw new Error('اكتب اسم المعلم');
  if (!o.title) throw new Error('اكتب عنوان المنتج');
  if (!o.subject) throw new Error('اختر المادة');
  if (!o.stage) throw new Error('اختر المرحلة');
  if (TYPES.indexOf(o.type) < 0) throw new Error('اختر نوع المنتج');
  if (!o.summary) throw new Error('اكتب وصفاً مختصراً');
  if (!o.idea) throw new Error('اكتب المشكلة التعليمية التي يعالجها المنتج');
  if (!o.tasks.length) throw new Error('اختر استخداماً واحداً على الأقل');
  if ((o.type === 'link' || o.type === 'agent') && !o.url) throw new Error('ضع رابط المنتج');
  if (o.type === 'prompt' && !o.prompt) throw new Error('اكتب نص البرومبت');
  return o;
}

/* ============================ الملفات ============================ */
function b64Blob_(f, maxBytes, label) {
  const bytes = Utilities.base64Decode(String(f.b64 || '').replace(/^data:[^,]*,/, ''));
  if (!bytes.length) throw new Error('الملف فارغ: ' + label);
  if (bytes.length > maxBytes) throw new Error('حجم ' + label + ' أكبر من المسموح (' + Math.round(maxBytes / 1048576) + ' ميجابايت)');
  return bytes;
}
function saveFile_(bytes, mime, name) {
  const file = folder_().createFile(Utilities.newBlob(bytes, mime, name));
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
  return file.getId();
}
function trash_(id) { if (!id) return; try { DriveApp.getFileById(id).setTrashed(true); } catch (e) {} }

/* يحفظ الملفات الجديدة ويعيد معرّفاتها. base = الملفات الحالية (للتعديل) */
function saveFiles_(files, type, base, title) {
  files = files || {}; base = base || {};
  const out = { appFileId: base.appFileId || '', appFileName: base.appFileName || '', fileId: base.fileId || '',
    fileName: base.fileName || '', fileMime: base.fileMime || '', coverId: base.coverId || '', imageIds: (base.imageIds || []).slice() };
  const created = [];
  const safe = s => String(s || 'file').replace(/[\\/:*?"<>|]+/g, '_').slice(0, 80);
  try {
    if (files.app && files.app.b64) {
      const bytes = b64Blob_(files.app, MAX_APP_BYTES, 'ملف التطبيق');
      const txt = Utilities.newBlob(bytes).getDataAsString('UTF-8');
      if (!/<(html|body|script|div|canvas|svg)[\s>]/i.test(txt)) throw new Error('الملف المرفوع ليس صفحة HTML صالحة');
      out.appFileId = saveFile_(bytes, 'text/html', safe(files.app.name || title + '.html'));
      out.appFileName = safe(files.app.name || title + '.html'); created.push(out.appFileId);
    }
    if (files.file && files.file.b64) {
      const mime = String(files.file.mime || '');
      if (!FILE_MIMES[mime]) throw new Error('نوع الملف غير مدعوم — المسموح: PDF و Word و PowerPoint و Excel');
      const bytes = b64Blob_(files.file, MAX_FILE_BYTES, 'الملف');
      out.fileId = saveFile_(bytes, mime, safe(files.file.name)); out.fileName = safe(files.file.name); out.fileMime = mime;
      created.push(out.fileId);
    }
    if (files.cover && files.cover.b64) {
      const mime = IMG_MIMES.indexOf(files.cover.mime) >= 0 ? files.cover.mime : 'image/jpeg';
      out.coverId = saveFile_(b64Blob_(files.cover, MAX_IMG_BYTES, 'صورة الغلاف'), mime, 'cover-' + safe(title) + '.jpg');
      created.push(out.coverId);
    } else if (files.removeCover) out.coverId = '';
    if (Array.isArray(files.images)) {
      const ids = [];
      files.images.slice(0, LIMITS.images).forEach((im, i) => {
        if (im && im.keep && out.imageIds.indexOf(im.keep) >= 0) ids.push(im.keep);
        else if (im && im.b64) {
          const mime = IMG_MIMES.indexOf(im.mime) >= 0 ? im.mime : 'image/jpeg';
          const id = saveFile_(b64Blob_(im, MAX_IMG_BYTES, 'الصورة ' + (i + 1)), mime, 'img-' + safe(title) + '-' + (i + 1) + '.jpg');
          ids.push(id); created.push(id);
        }
      });
      out.imageIds = ids;
    }
  } catch (err) { created.forEach(trash_); throw err; }
  if (type === 'html' && !out.appFileId) { created.forEach(trash_); throw new Error('ارفع ملف التطبيق (.html)'); }
  if (type === 'file' && !out.fileId) { created.forEach(trash_); throw new Error('ارفع الملف'); }
  return out;
}
/* حذف الملفات القديمة التي لم تعد مستخدمة بعد التحديث */
function cleanupFiles_(oldF, newF, alsoKeep) {
  let keep = [newF.appFileId, newF.fileId, newF.coverId].concat(newF.imageIds || []);
  if (alsoKeep) keep = keep.concat([alsoKeep.appFileId, alsoKeep.fileId, alsoKeep.coverId], alsoKeep.imageIds || []);
  [oldF.appFileId, oldF.fileId, oldF.coverId].concat(oldF.imageIds || []).forEach(id => { if (id && keep.indexOf(id) < 0) trash_(id); });
}
const FILE_KEYS = ['appFileId','appFileName','fileId','fileName','fileMime','coverId','imageIds'];
function fileSet_(o) { const f = {}; FILE_KEYS.forEach(k => { f[k] = o[k]; }); f.imageIds = (o.imageIds || []).slice(); return f; }

/* ============================ أكواد المعلم ============================ */
function hash_(code) {
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, props_().getProperty('SALT') + '|' + String(code).trim().toUpperCase(), Utilities.Charset.UTF_8);
  return raw.map(b => ('0' + (b & 255).toString(16)).slice(-2)).join('');
}
function newCode_() {
  const A = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let s = '';
  for (let i = 0; i < 6; i++) s += A.charAt(Math.floor(Math.random() * A.length));
  return s;
}
function newId_() {
  const t = Utilities.formatDate(new Date(), 'Asia/Riyadh', 'yyMMdd');
  return t + '-' + Math.random().toString(36).slice(2, 6);
}
function guard_(key) {
  const c = CacheService.getScriptCache(), k = 'fail_' + key, n = Number(c.get(k)) || 0;
  if (n >= 6) throw new Error('محاولات خاطئة كثيرة — انتظر 10 دقائق ثم حاول مرة أخرى');
  return { fail: () => c.put(k, String(n + 1), 600), clear: () => c.remove(k) };
}
function checkTeacher_(id, code) {
  const r = find_(id), g = guard_('t_' + id);
  if (!code || hash_(code) !== r.editHash) { g.fail(); throw new Error('كود التعديل غير صحيح'); }
  g.clear();
  return r;
}
function checkAdmin_(code) {
  const g = guard_('admin');
  if (!code || String(code) !== props_().getProperty('ADMIN_CODE')) { g.fail(); throw new Error('كود المدير غير صحيح'); }
  g.clear();
}
function adminLogin_(p) { checkAdmin_(p.adminCode); return { ok:true }; }

/* ============================ إرسال وتعديل المعلم ============================ */
function submit_(p) {
  const d = clean_(p.data);
  if (!p.agree) throw new Error('يجب الموافقة على تعهد المشاركة');
  const id = newId_(), code = newCode_(), now = new Date().toISOString();
  const files = saveFiles_(p.files, d.type, null, d.title);
  const row = Object.assign({ id, status:'pending', featured:'', createdAt:now, updatedAt:now, views:0, likes:0,
    editHash: hash_(code), adminNote:'', draft:null }, d, files);
  write_(0, row);
  notifyAdmin_('منتج جديد بانتظار المراجعة: ' + d.title, d.teacher + ' — ' + d.title + '\n\n' + d.summary);
  return { ok:true, id, code };
}
function teacherGet_(p) {
  const r = checkTeacher_(p.id, p.code);
  const base = pick_(r, PUBLIC_FIELDS.concat(['status','email','adminNote']));
  const out = { ok:true, item: base, hasDraft: !!r.draft };
  if (r.draft) out.item = Object.assign({}, base, r.draft, { hasApp: !!(r.draft.appFileId || r.appFileId) });
  delete out.item.appFileId; delete out.item.editHash; delete out.item.draft; delete out.item.at;
  return out;
}
function teacherUpdate_(p) {
  const r = checkTeacher_(p.id, p.code);
  const d = clean_(p.data);
  const now = new Date().toISOString();
  if (r.status === 'approved') {
    // المنتج المنشور يبقى ظاهراً كما هو، والتعديل يُحفظ كمسودة حتى يعتمدها المدير
    const prevDraft = r.draft;
    const base = prevDraft ? Object.assign(fileSet_(r), fileSet_(prevDraft)) : fileSet_(r);
    const files = saveFiles_(p.files, d.type, base, d.title);
    if (prevDraft) cleanupFiles_(fileSet_(prevDraft), files, fileSet_(r));
    r.draft = Object.assign({}, d, files, { at: now });
    r.updatedAt = now;
    write_(r._row, r);
    notifyAdmin_('تعديل بانتظار المراجعة: ' + d.title, d.teacher + ' عدّل منتجه المنشور: ' + d.title);
    return { ok:true, draft:true };
  }
  const old = fileSet_(r);
  const files = saveFiles_(p.files, d.type, old, d.title);
  Object.assign(r, d, files, { status:'pending', updatedAt: now, draft:null });
  write_(r._row, r);
  cleanupFiles_(old, files);
  notifyAdmin_('منتج معدّل بانتظار المراجعة: ' + d.title, d.teacher + ' — ' + d.title);
  return { ok:true, draft:false };
}

/* ============================ الإدارة ============================ */
function settings_() {
  const p = props_();
  return { notifyEmail: p.getProperty('NOTIFY_EMAIL') || '', siteUrl: p.getProperty('SITE_URL') || SITE_URL_DEFAULT,
    folderUrl: (function () { try { return folder_().getUrl(); } catch (e) { return ''; } })() };
}
function applyDraft_(r) {
  if (!r.draft) return;
  const old = fileSet_(r), dr = r.draft;
  delete dr.at;
  Object.assign(r, dr);
  r.draft = null;
  cleanupFiles_(old, fileSet_(r));
}
function adminSet_(p) {
  const r = find_(p.id);
  if (STATUSES.indexOf(p.status) < 0) throw new Error('حالة غير صحيحة');
  const was = r.status;
  if (p.status === 'approved' && r.draft) applyDraft_(r);
  r.status = p.status;
  r.adminNote = str_(p.note, 600);
  r.updatedAt = new Date().toISOString();
  write_(r._row, r);
  if (r.email && was !== p.status && p.status !== 'pending') {
    const site = props_().getProperty('SITE_URL') || SITE_URL_DEFAULT;
    const ok = p.status === 'approved';
    mail_(r.email, ok ? 'تم نشر منتجك في منصة المعلم الذكي 🎉' : 'منتجك في منصة المعلم الذكي يحتاج تعديلاً',
      'أهلاً ' + r.teacher + '\n\n' + (ok ? 'تم اعتماد ونشر منتجك «' + r.title + '».\nرابط المنتج: ' + site + 'product.html?id=' + r.id
        : 'منتجك «' + r.title + '» لم يُنشر بعد.' + (r.adminNote ? '\nملاحظة المشرف: ' + r.adminNote : '') + '\nيمكنك تعديله من صفحة المنتج باستخدام كود التعديل: ' + site + 'product.html?id=' + r.id)
      + '\n\nمنصة المعلم الذكي — مدارس دار الذكر');
  }
  return { ok:true };
}
function adminDraft_(p) {
  const r = find_(p.id);
  if (!r.draft) return { ok:true };
  if (p.apply) applyDraft_(r);
  else { cleanupFiles_(fileSet_(r.draft), fileSet_(r)); r.draft = null; }
  r.updatedAt = new Date().toISOString();
  write_(r._row, r);
  return { ok:true };
}
function adminDelete_(p) {
  const r = find_(p.id);
  const all = fileSet_(r);
  if (r.draft) cleanupFiles_(fileSet_(r.draft), all);
  cleanupFiles_(all, { imageIds: [] });
  sheet_().deleteRow(r._row);
  return { ok:true };
}
function adminUpdate_(p) {
  const r = find_(p.id);
  const d = clean_(p.data);
  const old = fileSet_(r);
  const files = saveFiles_(p.files, d.type, old, d.title);
  Object.assign(r, d, files, { updatedAt: new Date().toISOString() });
  write_(r._row, r);
  cleanupFiles_(old, files, r.draft ? fileSet_(r.draft) : null);
  return { ok:true };
}
function adminResetCode_(p) {
  const r = find_(p.id), code = newCode_();
  r.editHash = hash_(code);
  write_(r._row, r);
  return { ok:true, code };
}
function adminSettings_(p) {
  const pr = props_();
  if (p.newCode != null && String(p.newCode).trim()) {
    if (String(p.newCode).trim().length < 6) throw new Error('كود المدير يجب ألا يقل عن 6 أحرف');
    pr.setProperty('ADMIN_CODE', String(p.newCode).trim());
  }
  if (p.notifyEmail != null) {
    const e = str_(p.notifyEmail, 200);
    if (e && !/^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/.test(e)) throw new Error('البريد غير صحيح');
    pr.setProperty('NOTIFY_EMAIL', e);
  }
  return { ok:true, settings: settings_() };
}

/* ============================ نجم الشهر ============================ */
// يُحفظ في ورقة «star» داخل نفس ملف Google Sheet (تُنشأ تلقائياً):
// الخلية A2 = نجم الشهر الحالي، والصفوف التالية = لوحة الشرف (الأحدث أولاً). كل خلية تحوي JSON.
function starSheet_() {
  const ss = sheet_().getParent();
  let sh = ss.getSheetByName('star');
  if (!sh) { sh = ss.insertSheet('star'); sh.getRange('A1').setValue('نجم الشهر — لا تعدّل هذه الورقة يدوياً (الصف 2 = الحالي، وما بعده = لوحة الشرف)').setFontWeight('bold'); }
  return sh;
}
function starGet_() {
  const sh = starSheet_(), n = sh.getLastRow();
  const v = n >= 2 ? sh.getRange(2, 1, n - 1, 1).getValues().map(r => { try { return r[0] ? JSON.parse(r[0]) : null; } catch (e) { return null; } }) : [];
  return { cur: v[0] || null, hist: v.slice(1).filter(Boolean) };
}
function starSave_(x) {
  const sh = starSheet_(), n = sh.getLastRow();
  if (n >= 2) sh.getRange(2, 1, n - 1, 1).clearContent();
  const rows = [x.cur ? JSON.stringify(x.cur) : ''].concat((x.hist || []).slice(0, 36).map(h => JSON.stringify(h)));
  sh.getRange(2, 1, rows.length, 1).setValues(rows.map(r => [r]));
}
function starClean_(s) {
  s = s || {};
  const o = { teacher: str_(s.teacher, 120), role: str_(s.role, 160), month: str_(s.month, 60), productId: str_(s.productId, 40),
    title: str_(s.title, 200), reason: str_(s.reason, 2500), quote: str_(s.quote, 400),
    points: (Array.isArray(s.points) ? s.points : String(s.points || '').split('\n')).map(x => str_(x, 300)).filter(Boolean).slice(0, 8),
    at: new Date().toISOString() };
  if (!o.teacher) throw new Error('اكتب اسم المعلم');
  if (!o.month) throw new Error('اكتب الشهر');
  if (!o.reason) throw new Error('اكتب شرح المشروع وسبب الاختيار');
  if (o.productId) find_(o.productId);
  return o;
}
function adminStar_(p) {
  const x = starGet_();
  if (p.mode === 'set') {
    const n = starClean_(p.star);
    // إذا كان هناك نجم لشهر آخر يُنقل إلى لوحة الشرف تلقائياً، وإن كان لنفس الشهر فهو تعديل
    if (x.cur && x.cur.month !== n.month) x.hist.unshift(x.cur);
    x.cur = n;
  } else if (p.mode === 'archive') {
    if (x.cur) x.hist.unshift(x.cur);
    x.cur = null;
  } else if (p.mode === 'delHist') {
    const i = Number(p.index);
    if (!(i >= 0 && i < x.hist.length)) throw new Error('عنصر غير موجود');
    x.hist.splice(i, 1);
  } else throw new Error('إجراء غير معروف');
  starSave_(x);
  return { ok:true, star: x };
}
function starPublic_(all) {
  const x = starGet_();
  const live = {};
  (all || []).forEach(r => { if (r.status === 'approved') live[String(r.id)] = r; });
  const pub = s => {
    if (!s) return null;
    const o = { teacher:s.teacher, role:s.role, month:s.month, title:s.title, reason:s.reason, quote:s.quote, points:s.points || [] };
    const r = s.productId && live[s.productId];
    if (r) { o.productId = r.id; o.title = o.title || r.title; o.subject = r.subject; o.subjectOther = r.subjectOther; o.stage = r.stage; o.type = r.type; o.coverId = r.coverId; }
    return o;
  };
  return { cur: pub(x.cur), hist: x.hist.slice(0, 12).map(pub) };
}

/* ============================ البريد ============================ */
function mail_(to, subject, body) { try { if (to) MailApp.sendEmail(to, subject, body); } catch (e) {} }
function notifyAdmin_(subject, body) {
  const to = props_().getProperty('NOTIFY_EMAIL');
  const site = props_().getProperty('SITE_URL') || SITE_URL_DEFAULT;
  mail_(to, subject, body + '\n\nللمراجعة: ' + site + 'admin.html');
}
