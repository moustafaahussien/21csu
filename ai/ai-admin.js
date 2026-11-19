/* =====================================================================
   منصة المعلم الذكي — لوحة الإدارة (مراجعة • اعتماد • تمييز • تعديل • حذف • إعدادات)
   ===================================================================== */
(function () {
'use strict';
const A = window.AI, esc = A.esc, $ = A.$, $$ = A.$$;

Object.assign(A.I18N.ar, { adm:{
  title:"لوحة إدارة المعلم الذكي", loginP:"أدخل كود المدير لمراجعة منتجات المعلمين ونشرها.", code:"كود المدير", enter:"دخول", logout:"خروج",
  demoHint:"الوضع التجريبي: الكود هو demo", notConf:"لم يتم ربط المنصة بالخادم بعد — راجع «دليل الإعداد» أدناه.",
  k:{ all:"كل المنتجات", pending:"بانتظار المراجعة", approved:"منشور", rejected:"مرفوض/يحتاج تعديلاً", views:"إجمالي المشاهدات" },
  tab:{ pending:"بانتظار المراجعة", approved:"المنشورة", rejected:"المرفوضة", all:"الكل" }, search:"بحث…",
  st:{ pending:"بانتظار المراجعة", approved:"منشور", rejected:"يحتاج تعديلاً" }, draft:"تعديل بانتظار الاعتماد",
  a:{ preview:"معاينة", approve:"اعتماد ونشر", reject:"رفض / طلب تعديل", unpublish:"إيقاف النشر", feature:"تمييز ⭐", unfeature:"إلغاء التمييز",
    edit:"تعديل", del:"حذف", code:"كود جديد للمعلم", draft:"مراجعة التعديل", open:"صفحة المنتج", verify:"✓ تم التحقق", unverify:"إلغاء التحقق" },
  noteT:"ملاحظة للمعلم", notePh:"اكتب سبب الرفض أو التعديل المطلوب — يصل للمعلم بالبريد ويظهر له عند المتابعة", send:"تأكيد",
  delQ:"حذف المنتج نهائياً مع ملفاته؟ لا يمكن التراجع.", codeT:"كود التعديل الجديد", codeP:"أرسل هذا الكود للمعلم مع رقم المنتج. الكود القديم لم يعد يعمل.",
  draftT:"مقارنة التعديل", field:"الحقل", old:"الحالي (المنشور)", nw:"التعديل الجديد", apply:"اعتماد التعديل", discard:"رفض التعديل", filesChanged:"تغيّرت الملفات أو الصور",
  noItems:"لا توجد منتجات هنا", email:"البريد", id:"الرقم",
  settings:"الإعدادات", newCode:"كود مدير جديد", newCodeH:"6 أحرف على الأقل — اتركه فارغاً لعدم التغيير", notify:"بريد إشعارات المنتجات الجديدة", folder:"مجلد ملفات المنتجات في Drive", saveSet:"حفظ الإعدادات", saved:"تم الحفظ ✓",
  guide:"دليل الإعداد والتشغيل", done:"تم ✓",
  star:{ t:"⭐ نجم الشهر", none:"لم يُعلن نجم لهذا الشهر بعد", now:"النجم الحالي:", prod:"المشروع الفائز (من المنتجات المنشورة)", noProd:"— بدون ربط بمنتج —",
    teacher:"اسم المعلم/ـة", role:"الوصف (المادة والمرحلة)", rolePh:"مثال: معلم العلوم — المرحلة المتوسطة", month:"الشهر", title:"عنوان المشروع", titleH:"يُؤخذ تلقائياً من المنتج إن تركته فارغاً",
    reason:"شرح المشروع وسبب الاختيار", reasonPh:"ما المشكلة التي عالجها؟ ماذا صنع؟ كيف استخدمه مع طلابه؟ وما الأثر الذي ظهر؟",
    points:"نقاط التميّز (سطر لكل نقطة — اختياري)", pointsPh:"منتج أصيل يعالج مشكلة حقيقية\nطُبّق فعلياً مع طلابه\nشارك طريقة بنائه مع زملائه",
    quote:"كلمة من المعلم/ـة (اختياري)", publish:"📣 إعلان / تحديث نجم الشهر", archive:"📦 إنهاء الشهر ونقله إلى لوحة الشرف", archiveQ:"نقل النجم الحالي إلى لوحة الشرف وإخفاء القسم من المنصة؟",
    view:"👁 عرضه في المنصة", fresh:"🆕 تفريغ النموذج لنجم جديد", hall:"لوحة الشرف", hallEmpty:"لا يوجد نجوم سابقون بعد", del:"حذف", delQ:"حذف هذا النجم من لوحة الشرف؟",
    hint:"إعلان نجم بشهر مختلف ينقل النجم السابق تلقائياً إلى لوحة الشرف. وإعادة الحفظ بنفس الشهر تعدّل النجم الحالي فقط." }
}});
Object.assign(A.I18N.en, { adm:{
  title:"Smart Teacher admin", loginP:"Enter the admin code to review and publish teachers' products.", code:"Admin code", enter:"Enter", logout:"Log out",
  demoHint:"Demo mode: the code is demo", notConf:"The platform isn't connected yet — see the setup guide below.",
  k:{ all:"All products", pending:"Awaiting review", approved:"Published", rejected:"Rejected / needs changes", views:"Total views" },
  tab:{ pending:"Awaiting review", approved:"Published", rejected:"Rejected", all:"All" }, search:"Search…",
  st:{ pending:"Awaiting review", approved:"Published", rejected:"Needs changes" }, draft:"Edit awaiting approval",
  a:{ preview:"Preview", approve:"Approve & publish", reject:"Reject / request changes", unpublish:"Unpublish", feature:"Feature ⭐", unfeature:"Unfeature",
    edit:"Edit", del:"Delete", code:"New teacher code", draft:"Review edit", open:"Product page", verify:"✓ Verify", unverify:"Unverify" },
  noteT:"Note to the teacher", notePh:"Reason or requested changes — emailed to the teacher and shown when they track", send:"Confirm",
  delQ:"Delete this product and its files permanently? This can't be undone.", codeT:"New edit code", codeP:"Send this code to the teacher with the product ID. The old code no longer works.",
  draftT:"Compare edit", field:"Field", old:"Current (published)", nw:"New edit", apply:"Approve edit", discard:"Reject edit", filesChanged:"Files or images changed",
  noItems:"No products here", email:"Email", id:"ID",
  settings:"Settings", newCode:"New admin code", newCodeH:"At least 6 characters — leave blank to keep", notify:"Email for new-product notifications", folder:"Products' Drive folder", saveSet:"Save settings", saved:"Saved ✓",
  guide:"Setup & operation guide", done:"Done ✓",
  star:{ t:"⭐ Star of the Month", none:"No star announced this month yet", now:"Current star:", prod:"Winning project (published products)", noProd:"— not linked to a product —",
    teacher:"Teacher's name", role:"Description (subject & stage)", rolePh:"e.g. Science teacher — middle school", month:"Month", title:"Project title", titleH:"Taken from the product if left empty",
    reason:"About the project & why it was chosen", reasonPh:"What problem did it solve? What was built? How was it used? What impact appeared?",
    points:"Highlights (one per line — optional)", pointsPh:"Original product solving a real problem\nUsed with real classes\nShared how it was built",
    quote:"A word from the teacher (optional)", publish:"📣 Announce / update star", archive:"📦 End month & move to hall of fame", archiveQ:"Move the current star to the hall of fame and hide the section?",
    view:"👁 View on platform", fresh:"🆕 Clear form for a new star", hall:"Hall of fame", hallEmpty:"No previous stars yet", del:"Delete", delQ:"Delete this star from the hall of fame?",
    hint:"Announcing a star with a different month moves the previous one to the hall of fame. Saving with the same month just edits the current star." }
}});

const KEY = 'ai_admin_code';
const S = { code: A.SS.get(KEY) || '', items: [], settings: {}, tab: 'pending', q: '', star: { cur:null, hist:[] }, sf: null };
const monthNow = () => { try { return new Intl.DateTimeFormat(A.LANG() === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-US', { month:'long', year:'numeric' }).format(new Date()); } catch (e) { return ''; } };
const starForm = c => c ? { productId:c.productId || '', teacher:c.teacher || '', role:c.role || '', month:c.month || '', title:c.title || '', reason:c.reason || '', points:(c.points || []).join('\n'), quote:c.quote || '' }
  : { productId:'', teacher:'', role:'', month:monthNow(), title:'', reason:'', points:'', quote:'' };
const root = $('#adm');
A.shell('admin');
A.applyLang();
A.onLang(() => { S.ready ? draw() : login(); });

const GUIDE = { ar: [
  ['إنشاء الخادم (مرة واحدة)', 'أنشئ Google Sheet جديداً باسم «منصة المعلم الذكي» ← الإضافات (Extensions) ← Apps Script ← احذف الكود الموجود والصق محتوى الملف ai/ai-script.gs من المستودع كاملاً ← عدّل كود المدير في سطر INITIAL_ADMIN_CODE ← احفظ.'],
  ['تشغيل الإعداد', 'اختر الدالة setup من القائمة أعلى المحرر ← تشغيل (Run) ← وافق على الصلاحيات (حسابك ← متقدم ← الانتقال إلى المشروع). ستُنشأ ورقة products ومجلد «منصة المعلم الذكي - ملفات المنتجات» في Drive.'],
  ['النشر', 'Deploy ← New deployment ← النوع Web app ← Execute as: Me ← Who has access: Anyone ← Deploy ← انسخ الرابط الذي ينتهي بـ /exec.'],
  ['ربط الموقع', 'في GitHub افتح ai/config.js وضع الرابط بين علامتي التنصيص: window.AI_API = "الرابط"; ثم Commit. بعد دقيقة يعمل المعرض.'],
  ['المراجعة اليومية', 'يصلك بريد عند كل منتج جديد. ادخل هنا ← «معاينة» ← «اعتماد ونشر» أو «رفض / طلب تعديل» مع ملاحظة تصل للمعلم.'],
  ['تعديل منتج منشور', 'إذا عدّل المعلم منتجاً منشوراً تبقى النسخة القديمة ظاهرة ويظهر لك «تعديل بانتظار الاعتماد» ← «مراجعة التعديل» ← اعتماد أو رفض.'],
  ['نسي المعلم الكود', 'من صف المنتج ← «كود جديد للمعلم» ← أرسل له الرقم والكود الجديد.'],
  ['أي تعديل على الخادم', 'بعد تعديل الكود في Apps Script: Deploy ← Manage deployments ← ✏️ ← Version: New version ← Deploy (الرابط لا يتغير).']
], en: [
  ['Create the server (once)', 'Create a new Google Sheet named “Smart Teacher” → Extensions → Apps Script → delete existing code and paste ai/ai-script.gs in full → change INITIAL_ADMIN_CODE → Save.'],
  ['Run setup', 'Choose the setup function at the top of the editor → Run → approve permissions. This creates the products sheet and a Drive folder for product files.'],
  ['Deploy', 'Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone → Deploy → copy the URL ending in /exec.'],
  ['Connect the site', 'In GitHub open ai/config.js and paste the URL: window.AI_API = "URL"; then commit. The showcase works a minute later.'],
  ['Daily review', 'You get an email for each new product. Come here → Preview → Approve & publish, or Reject with a note sent to the teacher.'],
  ['Edits to published products', 'If a teacher edits a published product, the old version stays live and you see “Edit awaiting approval” → Review edit → approve or reject.'],
  ['Teacher forgot the code', 'On the product row → New teacher code → send them the ID and the new code.'],
  ['Any server change', 'After editing the Apps Script code: Deploy → Manage deployments → ✏️ → Version: New version → Deploy (URL stays the same).']
]};
function guideHtml(open) {
  return '<details class="glass" style="padding:16px 20px;margin-top:20px"' + (open ? ' open' : '') + '><summary style="cursor:pointer;font-family:var(--display);font-weight:800">📘 ' + esc(A.T('adm.guide')) + '</summary>' +
    '<ol class="nice" style="margin-top:14px">' + (GUIDE[A.LANG()]).map(g => '<li><span><b>' + esc(g[0]) + ':</b> ' + esc(g[1]) + '</span></li>').join('') + '</ol></details>';
}

function login(err) {
  root.innerHTML = '<div class="wrap"><div class="glass adm-login"><div style="font-size:44px">🔐</div><h1>' + esc(A.T('adm.title')) + '</h1><p style="color:var(--muted)">' + esc(A.T('adm.loginP')) + '</p>' +
    (!A.CONFIGURED && !A.DEMO ? '<div class="banner warn">' + esc(A.T('adm.notConf')) + ' <a href="?demo=1" style="text-decoration:underline">' + esc(A.T('common.demoOpen')) + '</a></div>' : '') +
    (A.DEMO ? '<div class="banner info">' + esc(A.T('adm.demoHint')) + '</div>' : '') +
    '<div class="fld" style="margin-top:14px;text-align:start"><label for="ac">' + esc(A.T('adm.code')) + '</label><input class="inp" id="ac" type="password" autocomplete="current-password" dir="ltr" autofocus></div>' +
    '<p class="f-err" style="margin-top:8px" role="alert">' + esc(err || '') + '</p><button class="btn grad" style="width:100%;margin-top:10px" id="ag" type="button">' + esc(A.T('adm.enter')) + '</button></div>' +
    guideHtml(!A.CONFIGURED && !A.DEMO) + '</div>';
  const go = async () => {
    const c = $('#ac').value.trim(); if (!c) return;
    $('#ag').disabled = true;
    try { await A.call('adminLogin', { adminCode: c }); S.code = c; A.SS.set(KEY, c); await refresh(); }
    catch (e) { login(e.message); }
  };
  $('#ag').onclick = go; $('#ac').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  setTimeout(() => { const i = $('#ac'); if (i) i.focus(); }, 50);
}
async function api(action, p, okMsg) {
  try { const r = await A.call(action, Object.assign({ adminCode: S.code }, p || {}), { timeout: 240000 }); if (okMsg) A.toast(okMsg); return r; }
  catch (e) { if (/كود المدير|admin code/i.test(e.message)) { A.SS.del(KEY); S.code = ''; S.ready = false; login(e.message); } else A.toast(e.message, true); throw e; }
}
async function refresh() {
  const r = await api('adminList');
  S.items = r.items || []; S.settings = r.settings || {}; S.ready = true;
  S.star = r.star || { cur:null, hist:[] }; if (!S.sf) S.sf = starForm(S.star.cur);
  draw();
}

function row(p) {
  const ty = A.typeOf(p.type);
  const cv = p.coverId ? '<img src="' + esc(A.img(p.coverId, 300)) + '" alt="">' : ty.icon;
  const a = (k, cls, label) => '<button class="btn xs ' + cls + '" type="button" data-a="' + k + '" data-id="' + esc(p.id) + '">' + esc(label || A.T('adm.a.' + k)) + '</button>';
  return '<div class="arow"><div class="cv">' + cv + '</div><div><h3>' + esc(p.title) + '</h3>' +
    '<div class="m"><span class="st ' + p.status + '">' + esc(A.T('adm.st.' + p.status)) + '</span>' + (p.draft ? '<span class="st draft">' + esc(A.T('adm.draft')) + '</span>' : '') + (p.featured ? '<span class="tag feat">⭐</span>' : '') + (p.verified ? '<span class="verified">✓</span>' : '') + (p.ratingCount ? '<span class="rating">★ ' + Math.round(p.ratingAvg) + '% (' + p.ratingCount + ')</span>' : '') +
    '<span>' + ty.icon + ' ' + esc(ty[A.LANG()]) + '</span><span>🧑‍🏫 ' + esc(p.teacher) + '</span><span>' + esc(A.subjectName(p)) + ' · ' + esc(A.stageName(p.stage)) + '</span>' +
    (p.email ? '<span dir="ltr">✉ ' + esc(p.email) + '</span>' : '') + '<span dir="ltr">#' + esc(p.id) + '</span><span>' + esc(A.fmtDate(p.createdAt)) + '</span><span>👁 ' + A.fmtNum(p.views) + ' ♥ ' + A.fmtNum(p.likes) + '</span></div>' +
    (p.adminNote ? '<div class="m" style="color:#8a4500">📝 ' + esc(p.adminNote) + '</div>' : '') + '</div>' +
    '<div class="acts">' + a('preview', 'soft') +
      (p.draft ? a('draft', 'pink') : '') +
      (p.status !== 'approved' ? a('approve', 'ok') : a('unpublish', 'ghost')) +
      (p.status !== 'rejected' ? a('reject', 'ghost') : '') +
      (p.status === 'approved' ? a('feature', 'ghost', A.T(p.featured ? 'adm.a.unfeature' : 'adm.a.feature')) : '') +
      (p.status === 'approved' ? a('verify', p.verified ? 'ghost' : 'ok', A.T(p.verified ? 'adm.a.unverify' : 'adm.a.verify')) : '') +
      a('edit', 'ghost') + a('code', 'ghost') + a('del', 'bad') + '</div></div>';
}
function draw() {
  const it = S.items, cnt = s => it.filter(x => x.status === s).length;
  const views = it.reduce((a, x) => a + (Number(x.views) || 0), 0);
  const list = it.filter(x => (S.tab === 'all' || (S.tab === 'pending' ? (x.status === 'pending' || x.draft) : x.status === S.tab)) &&
    (!S.q || [x.title, x.teacher, x.email, x.id, x.summary].join(' ').toLowerCase().indexOf(S.q.toLowerCase()) >= 0))
    .sort((a, b) => String(b.updatedAt || b.createdAt).localeCompare(String(a.updatedAt || a.createdAt)));
  const pendN = it.filter(x => x.status === 'pending' || x.draft).length;
  root.innerHTML = '<div class="wrap"><div class="adm-top"><h1>🛠️ ' + esc(A.T('adm.title')) + '</h1><div style="display:flex;gap:8px;flex-wrap:wrap">' +
    '<a class="btn sm ghost" href="index.html' + (A.DEMO ? '?demo=1' : '') + '">↗ ' + esc(A.T('brand')) + '</a><button class="btn sm ghost" type="button" id="refresh">⟳</button><button class="btn sm ghost" type="button" id="out">' + esc(A.T('adm.logout')) + '</button></div></div>' +
    '<div class="kpis">' + [[it.length, 'all'], [cnt('pending'), 'pending'], [cnt('approved'), 'approved'], [cnt('rejected'), 'rejected'], [views, 'views']]
      .map(k => '<div class="stat"><b>' + A.fmtNum(k[0]) + '</b><span>' + esc(A.T('adm.k.' + k[1])) + '</span></div>').join('') + '</div>' +
    starHtml() +
    '<div class="ptools"><div class="tabs" style="margin:0">' + ['pending','approved','rejected','all'].map(k => '<button type="button" data-tab="' + k + '" class="' + (S.tab === k ? 'on' : '') + '">' + esc(A.T('adm.tab.' + k)) + (k === 'pending' && pendN ? ' (' + pendN + ')' : '') + '</button>').join('') + '</div>' +
    '<label class="search"><span>🔎</span><input id="aq" type="search" value="' + esc(S.q) + '" placeholder="' + esc(A.T('adm.search')) + '"></label></div>' +
    '<div class="alist">' + (list.length ? list.map(row).join('') : '<div class="empty"><b>' + esc(A.T('adm.noItems')) + '</b></div>') + '</div>' +
    settingsHtml() + guideHtml(false) + '</div>';
  $('#out').onclick = () => { A.SS.del(KEY); S.code = ''; S.items = []; S.ready = false; login(); };
  $('#refresh').onclick = () => refresh().catch(() => {});
  const q = $('#aq'); q.oninput = () => { S.q = q.value; const pos = q.selectionStart; draw(); const n = $('#aq'); n.focus(); n.setSelectionRange(pos, pos); };
  $$('[data-tab]').forEach(b => b.onclick = () => { S.tab = b.dataset.tab; draw(); });
  $('#saveSet').onclick = saveSettings;
  bindStar();
}

/* ------------------------- ⭐ نجم الشهر ------------------------- */
function starHtml() {
  const c = S.star.cur, f = S.sf || starForm(c), T = k => esc(A.T('adm.star.' + k));
  const pub = S.items.filter(x => x.status === 'approved');
  const inp = (k, lbl, extra) => '<div class="fld"><label for="sf_' + k + '">' + T(lbl || k) + '</label><input class="inp" id="sf_' + k + '" data-sf="' + k + '" value="' + esc(f[k]) + '"' + (extra || '') + '></div>';
  const ta = (k, ph, rows) => '<div class="fld full"><label for="sf_' + k + '">' + T(k) + '</label><textarea class="inp" id="sf_' + k + '" data-sf="' + k + '" rows="' + rows + '" placeholder="' + T(ph) + '">' + esc(f[k]) + '</textarea></div>';
  const hist = S.star.hist || [];
  return '<details class="star-adm"' + (S.starOpen ? ' open' : '') + ' id="starAdm"><summary>' + T('t') + ' — ' + (c ? '<span style="color:#b45309">' + esc(c.teacher) + ' · ' + esc(c.month) + '</span>' : '<span style="color:var(--muted);font-weight:600">' + T('none') + '</span>') + '</summary>' +
    (c ? '<div class="cur"><b>' + T('now') + '</b><span>👑 ' + esc(c.teacher) + '</span><span>📅 ' + esc(c.month) + '</span>' + (c.title ? '<span>🏅 ' + esc(c.title) + '</span>' : '') +
      '<a class="btn xs soft" href="index.html' + (A.DEMO ? '?demo=1' : '') + '#star" target="_blank" rel="noopener">' + T('view') + '</a></div>' : '') +
    '<p class="hint" style="margin:8px 0 12px">💡 ' + T('hint') + '</p>' +
    '<div class="fgrid"><div class="fld full"><label for="sf_productId">' + T('prod') + '</label><select class="inp" id="sf_productId" data-sf="productId"><option value="">' + T('noProd') + '</option>' +
      pub.map(x => '<option value="' + esc(x.id) + '"' + (f.productId === x.id ? ' selected' : '') + '>' + esc(x.title + ' — ' + x.teacher) + '</option>').join('') + '</select></div>' +
      inp('teacher') + inp('role', 'role', ' placeholder="' + T('rolePh') + '"') + inp('month') +
      '<div class="fld"><label for="sf_title">' + T('title') + '</label><input class="inp" id="sf_title" data-sf="title" value="' + esc(f.title) + '"><div class="hint">' + T('titleH') + '</div></div>' +
      ta('reason', 'reasonPh', 5) + ta('points', 'pointsPh', 3) + inp('quote') +
    '</div><div class="f-foot" style="flex-wrap:wrap;gap:8px">' + (c ? '<button class="btn ghost sm" type="button" id="starArch">' + T('archive') + '</button>' : '') +
      '<button class="btn ghost sm" type="button" id="starNew">' + T('fresh') + '</button><span class="sp"></span><button class="btn grad sm" type="button" id="starPub">' + T('publish') + '</button></div>' +
    '<h4 style="margin-top:18px;font-family:var(--display)">🏆 ' + T('hall') + ' (' + hist.length + ')</h4><div class="hl">' +
      (hist.length ? hist.map((h, i) => '<div><span>👑 <b>' + esc(h.teacher) + '</b> · ' + esc(h.month) + (h.title ? ' · ' + esc(h.title) : '') + '</span><button class="btn xs bad" type="button" data-hdel="' + i + '">' + T('del') + '</button></div>').join('')
        : '<div style="color:var(--muted)">' + T('hallEmpty') + '</div>') + '</div></details>';
}
function bindStar() {
  const d = $('#starAdm'); if (!d) return;
  d.addEventListener('toggle', () => { S.starOpen = d.open; });
  $$('[data-sf]').forEach(el => el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
    S.sf[el.dataset.sf] = el.value;
    if (el.dataset.sf === 'productId' && el.value) {
      const p = S.items.find(x => x.id === el.value);
      if (p) { S.sf.teacher = p.teacher || S.sf.teacher; S.sf.title = p.title || S.sf.title; $('#sf_teacher').value = S.sf.teacher; $('#sf_title').value = S.sf.title; }
    }
  }));
  $('#starPub').onclick = async ev => {
    const b = ev.currentTarget, f = S.sf;
    if (!f.teacher.trim() || !f.month.trim() || !f.reason.trim()) return A.toast(A.T('adm.star.teacher') + ' + ' + A.T('adm.star.month') + ' + ' + A.T('adm.star.reason'), true);
    b.disabled = true;
    const r = await api('adminStar', { mode:'set', star:Object.assign({}, f, { points: f.points.split('\n') }) }, A.T('adm.done')).catch(() => null);
    b.disabled = false; if (!r) return;
    S.star = r.star; S.sf = starForm(S.star.cur); S.starOpen = true; draw();
  };
  $('#starNew').onclick = () => { S.sf = starForm(null); S.starOpen = true; draw(); };
  const ar = $('#starArch'); if (ar) ar.onclick = async () => {
    if (!confirm(A.T('adm.star.archiveQ'))) return;
    const r = await api('adminStar', { mode:'archive' }, A.T('adm.done')).catch(() => null); if (!r) return;
    S.star = r.star; S.sf = starForm(null); S.starOpen = true; draw();
  };
  $$('[data-hdel]').forEach(b => b.onclick = async () => {
    if (!confirm(A.T('adm.star.delQ'))) return;
    const r = await api('adminStar', { mode:'delHist', index:Number(b.dataset.hdel) }, A.T('adm.done')).catch(() => null); if (!r) return;
    S.star = r.star; S.starOpen = true; draw();
  });
}
function settingsHtml() {
  const s = S.settings;
  return '<details class="glass" style="padding:16px 20px;margin-top:24px"><summary style="cursor:pointer;font-family:var(--display);font-weight:800">⚙️ ' + esc(A.T('adm.settings')) + '</summary>' +
    '<div class="fgrid" style="margin-top:14px"><div class="fld"><label for="sn">' + esc(A.T('adm.notify')) + '</label><input class="inp" id="sn" type="email" dir="ltr" value="' + esc(s.notifyEmail || '') + '"></div>' +
    '<div class="fld"><label for="sc">' + esc(A.T('adm.newCode')) + '</label><input class="inp" id="sc" type="password" dir="ltr" autocomplete="new-password"><div class="hint">' + esc(A.T('adm.newCodeH')) + '</div></div>' +
    (s.folderUrl ? '<div class="fld full"><span class="lbl">' + esc(A.T('adm.folder')) + '</span><a class="btn xs soft" style="align-self:flex-start" href="' + esc(A.safeUrl(s.folderUrl)) + '" target="_blank" rel="noopener">📁 Google Drive ↗</a></div>' : '') +
    '</div><div class="f-foot"><span class="sp"></span><button class="btn grad sm" type="button" id="saveSet">' + esc(A.T('adm.saveSet')) + '</button></div></details>';
}
async function saveSettings() {
  const nc = $('#sc').value.trim(), ne = $('#sn').value.trim();
  if (nc && nc.length < 6) return A.toast(A.T('adm.newCodeH'), true);
  const r = await api('adminSettings', { notifyEmail: ne, newCode: nc || null }, A.T('adm.saved')).catch(() => null);
  if (!r) return;
  if (nc) { S.code = nc; A.SS.set(KEY, nc); }
  S.settings = r.settings || S.settings;
}

/* ------------------------- المعاينة ------------------------- */
async function preview(p, useDraft) {
  const d = useDraft && p.draft ? Object.assign({}, p, p.draft) : p;
  const ty = A.typeOf(d.type);
  const lst = arr => arr && arr.length ? '<ol class="nice">' + arr.map(s => '<li><span>' + A.nl2br(s) + '</span></li>').join('') + '</ol>' : '—';
  const m = A.modal('<div class="f-title">' + ty.icon + ' ' + esc(d.title) + '</div><p class="f-sub">' + esc(d.teacher) + ' · ' + esc(A.subjectName(d)) + ' · ' + esc(A.stageName(d.stage)) + (d.grades ? ' · ' + esc(d.grades) : '') + '</p>' +
    '<p style="margin:10px 0">' + esc(d.summary) + '</p>' +
    '<div id="pv" style="margin:12px 0"></div>' +
    [['🧩 المشكلة', d.idea], ['🎯 الهدف', d.goal], ['🛠️ المهارة', d.skill], ['⏱ الزمن', d.duration], ['📈 الأثر', d.impact], ['📝 ملاحظات بعد التطبيق', d.notes]]
      .filter(x => x[1]).map(x => '<div class="lesson-sec"><h4>' + esc(x[0]) + '</h4><p>' + A.nl2br(x[1]) + '</p></div>').join('') +
    '<div class="lesson-sec"><h4>🛠️</h4>' + lst(d.buildSteps) + '</div><div class="lesson-sec"><h4>🏫</h4>' + lst(d.useSteps) + '</div>' +
    (d.prompt ? '<div class="lesson-sec"><h4>💬</h4><pre class="pbody" style="border-radius:12px">' + esc(d.prompt) + '</pre></div>' : '') +
    (d.tips ? '<div class="lesson-sec"><h4>📌</h4><p>' + A.nl2br(d.tips) + '</p></div>' : '') +
    ((d.imageIds || []).length ? '<div class="gal" style="margin-top:12px">' + d.imageIds.map(i => '<a href="' + esc(A.img(i, 1600)) + '" target="_blank" rel="noopener"><img src="' + esc(A.img(i, 400)) + '" alt="" style="border-radius:12px;aspect-ratio:4/3;object-fit:cover"></a>').join('') + '</div>' : '') +
    (d.video ? '<p style="margin-top:10px"><a class="btn xs soft" href="' + esc(A.safeUrl(d.video)) + '" target="_blank" rel="noopener">▶ ' + esc(d.video) + '</a></p>' : ''), { wide:true });
  const pv = $('#pv', m.el);
  if (d.type === 'html') {
    pv.innerHTML = '<div class="viewer" style="margin:0"><div class="frame-wrap"><div class="vmsg"><div class="spin" style="margin:auto"></div></div></div></div>';
    try {
      const r = await api('adminApp', { id: p.id, draft: !!useDraft });
      const f = document.createElement('iframe'); f.setAttribute('sandbox', A.SANDBOX_ATTR); f.srcdoc = A.sandboxDoc(r.html); f.style.height = '60vh';
      const w = $('.frame-wrap', pv); w.innerHTML = ''; w.appendChild(f);
    } catch (e) { pv.innerHTML = '<div class="banner bad">' + esc(e.message) + '</div>'; }
  } else if (d.url) pv.innerHTML = '<a class="btn sm grad" href="' + esc(A.safeUrl(d.url)) + '" target="_blank" rel="noopener">↗ ' + esc(d.url) + '</a>';
  if (d.type === 'file' && d.fileId && d.fileId !== 'local-file') pv.innerHTML += '<div class="viewer" style="margin-top:10px"><iframe src="https://drive.google.com/file/d/' + encodeURIComponent(d.fileId) + '/preview" style="height:60vh"></iframe></div>';
}
function draftCompare(p) {
  const dr = p.draft;
  const F = [['title','العنوان / Title'],['summary','الوصف / Summary'],['idea','المشكلة / Problem'],['goal','الهدف / Goal'],['skill','المهارة / Skill'],['level','المستوى / Level'],['duration','الزمن / Time'],['impact','الأثر / Impact'],['notes','ملاحظات / Notes'],['url','URL'],['prompt','Prompt'],['video','Video'],['tips','Tips'],
    ['teacher','Teacher'],['subject','Subject'],['stage','Stage'],['grades','Grades'],['type','Type'],['tasks','Tasks'],['tools','Tools'],['buildSteps','Build'],['useSteps','Use']];
  const v = x => Array.isArray(x) ? x.join('\n') : String(x == null ? '' : x);
  const rows = F.filter(f => v(p[f[0]]) !== v(dr[f[0]])).map(f => '<div class="h">' + esc(f[1]) + '</div><div class="old">' + esc(v(p[f[0]]) || '—') + '</div><div class="new">' + esc(v(dr[f[0]]) || '—') + '</div>').join('');
  const filesCh = ['coverId','fileId','fileName'].some(k => v(p[k]) !== v(dr[k])) || v(p.imageIds) !== v(dr.imageIds) || dr.hasApp && p.type === 'html';
  const m = A.modal('<div class="f-title">' + esc(A.T('adm.draftT')) + ': ' + esc(p.title) + '</div>' +
    '<div class="diff" style="margin-top:14px"><div class="h">' + esc(A.T('adm.field')) + '</div><div class="h">' + esc(A.T('adm.old')) + '</div><div class="h">' + esc(A.T('adm.nw')) + '</div>' + rows + '</div>' +
    (filesCh ? '<div class="banner info">📎 ' + esc(A.T('adm.filesChanged')) + '</div>' : '') +
    '<div class="f-foot"><button class="btn sm soft" type="button" id="dPrev">👁 ' + esc(A.T('adm.a.preview')) + '</button><span class="sp"></span><button class="btn sm bad" type="button" id="dNo">' + esc(A.T('adm.discard')) + '</button><button class="btn sm ok" type="button" id="dYes">' + esc(A.T('adm.apply')) + '</button></div>', { wide:true });
  $('#dPrev', m.el).onclick = () => preview(p, true);
  $('#dYes', m.el).onclick = async () => { await api('adminDraft', { id: p.id, apply: true }, A.T('adm.done')).catch(() => null); m.close(); refresh(); };
  $('#dNo', m.el).onclick = async () => { await api('adminDraft', { id: p.id, apply: false }, A.T('adm.done')).catch(() => null); m.close(); refresh(); };
}
function noteThen(status, p) {
  const m = A.modal('<div class="f-title">' + esc(A.T('adm.noteT')) + '</div><div class="fld" style="margin-top:12px"><textarea class="inp" id="nt" maxlength="600" placeholder="' + esc(A.T('adm.notePh')) + '" autofocus>' + esc(p.adminNote || '') + '</textarea></div>' +
    '<div class="f-foot"><span class="sp"></span><button class="btn grad sm" type="button" id="ns">' + esc(A.T('adm.send')) + '</button></div>');
  $('#ns', m.el).onclick = async () => { const note = $('#nt', m.el).value.trim(); $('#ns', m.el).disabled = true; await api('adminSet', { id: p.id, status, note }, A.T('adm.done')).catch(() => null); m.close(); refresh(); };
}

document.addEventListener('click', async e => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const p = S.items.find(x => x.id === b.dataset.id); if (!p) return;
  const k = b.dataset.a;
  if (k === 'preview') return preview(p, false);
  if (k === 'draft') return draftCompare(p);
  if (k === 'reject' || k === 'unpublish') return noteThen(k === 'reject' ? 'rejected' : 'pending', p);
  if (k === 'edit') return window.AI_FORM.open({ mode:'admin', id:p.id, adminCode:S.code, item:p, onDone: () => refresh() });
  b.disabled = true;
  try {
    if (k === 'approve') { await api('adminSet', { id:p.id, status:'approved', note:'' }, A.T('adm.done')); }
    else if (k === 'feature') { await api('adminFeature', { id:p.id, featured: !p.featured }, A.T('adm.done')); }
    else if (k === 'verify') { await api('adminVerify', { id:p.id, verified: !p.verified }, A.T('adm.done')); }
    else if (k === 'del') { if (!confirm(A.T('adm.delQ'))) { b.disabled = false; return; } await api('adminDelete', { id:p.id }, A.T('adm.done')); }
    else if (k === 'code') {
      const r = await api('adminResetCode', { id:p.id });
      const txt = (A.LANG() === 'ar' ? 'رقم المنتج: ' : 'Product ID: ') + p.id + '\n' + (A.LANG() === 'ar' ? 'كود التعديل: ' : 'Edit code: ') + r.code;
      const m = A.modal('<div class="f-title">' + esc(A.T('adm.codeT')) + '</div><p class="f-sub">' + esc(A.T('adm.codeP')) + '</p><div class="codebox"><b>' + esc(r.code) + '</b></div><div style="text-align:center"><button class="btn grad sm" type="button" id="cc">' + esc(A.T('common.copy')) + '</button></div>');
      $('#cc', m.el).onclick = ev => A.copy(txt, ev.currentTarget);
      b.disabled = false; return;
    }
    await refresh();
  } catch (err) { b.disabled = false; }
});

if (!A.CONFIGURED && !A.DEMO) login();
else if (S.code) refresh().catch(() => login());
else login();
})();
