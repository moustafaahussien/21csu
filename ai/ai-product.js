/* =====================================================================
   منصة المعلم الذكي — صفحة المنتج (العرض الحي + الشرح + التفاعل)
   ===================================================================== */
(function () {
'use strict';
const A = window.AI, D = A.D, esc = A.esc, $ = A.$, $$ = A.$$;

Object.assign(A.I18N.ar, { pr:{
  home:"المعلم الذكي", showcase:"معرض المنتجات", notFound:"المنتج غير موجود", notFoundP:"ربما حُذف أو أن الرابط غير صحيح.",
  pendingT:"هذا المنتج غير منشور حالياً", pendingP:"المنتج بانتظار مراجعة المشرف أو يحتاج تعديلاً. إذا كنت صاحب المنتج أدخل كود التعديل لمعاينته وتعديله.",
  owner:"أنا صاحب المنتج", back:"العودة للمعرض", preview:"معاينة — هذا المنتج لم يُنشر بعد", previewDraft:"تعرض الآن تعديلاتك التي تنتظر اعتماد المشرف",
  live:"جرّب المنتج", openNew:"فتح في صفحة مستقلة", fullscreen:"ملء الشاشة", download:"تنزيل الملف", openDrive:"فتح الملف",
  dev:{ desk:"🖥️", tab:"📱 آيباد", mob:"📱 جوال" }, loadingApp:"جارٍ تحميل التطبيق…", appErr:"تعذّر تحميل التطبيق",
  linkNote:"بعض المواقع لا تسمح بعرضها داخل صفحة أخرى — إذا ظهرت الصفحة فارغة اضغط «فتح في صفحة مستقلة».", showInside:"عرض داخل الصفحة",
  agentT:"وكيل ذكاء اصطناعي جاهز", agentP:"يفتح الوكيل في موقعه، وقد تحتاج تسجيل الدخول بحسابك.", openAgent:"افتح الوكيل",
  fileNote:"إذا لم تظهر المعاينة، استخدم زر فتح الملف.", promptT:"البرومبت", copyPrompt:"نسخ البرومبت",
  idea:"الفكرة", build:"طريقة التنفيذ", use:"طريقة الاستخدام في الحصة", promptUsed:"البرومبت المستخدم", tips:"نصائح وملاحظات",
  tools:"الأدوات المستخدمة", tasks:"يُستخدم في", gallery:"صور من المنتج", video:"فيديو الشرح",
  teacher:"إعداد", subject:"المادة", stage:"المرحلة", grades:"الصفوف", date:"تاريخ الإضافة",
  like:"أعجبني", liked:"أعجبك", share:"نسخ الرابط", whatsapp:"واتساب", edit:"تعديل (لصاحب المنتج)", related:"منتجات مشابهة",
  extLink:"رابط إضافي", demoNoFile:"معاينة الملفات تعمل بعد ربط المنصة بالخادم (غير متاحة في الوضع التجريبي)."
}});
Object.assign(A.I18N.en, { pr:{
  home:"Smart Teacher", showcase:"Showcase", notFound:"Product not found", notFoundP:"It may have been deleted or the link is wrong.",
  pendingT:"This product isn't published", pendingP:"It's awaiting the supervisor's review or needs changes. If it's yours, enter your edit code to preview and edit it.",
  owner:"I own this product", back:"Back to showcase", preview:"Preview — this product isn't published yet", previewDraft:"Showing your changes awaiting approval",
  live:"Try the product", openNew:"Open in a new page", fullscreen:"Fullscreen", download:"Download", openDrive:"Open file",
  dev:{ desk:"🖥️", tab:"📱 iPad", mob:"📱 Phone" }, loadingApp:"Loading the app…", appErr:"Couldn't load the app",
  linkNote:"Some sites can't be shown inside another page — if it looks blank, click “Open in a new page”.", showInside:"Show inside page",
  agentT:"A ready AI agent", agentP:"The agent opens on its own site; you may need to sign in.", openAgent:"Open the agent",
  fileNote:"If the preview doesn't appear, use the open button.", promptT:"The prompt", copyPrompt:"Copy prompt",
  idea:"The idea", build:"How it was built", use:"How to use it in class", promptUsed:"Prompt used", tips:"Tips & notes",
  tools:"Tools used", tasks:"Used for", gallery:"Product images", video:"Explainer video",
  teacher:"By", subject:"Subject", stage:"Stage", grades:"Grades", date:"Added",
  like:"Like", liked:"Liked", share:"Copy link", whatsapp:"WhatsApp", edit:"Edit (owner)", related:"Similar products",
  extLink:"Extra link", demoNoFile:"File previews work once the platform is connected (not available in demo mode)."
}});

const id = A.qs.get('id') || '';
const P = $('#page');
let item = null, owner = null; // owner = { code, draft }
const LIKE_KEY = 'ai_liked';
const liked = () => { try { return new Set(JSON.parse(A.LS.get(LIKE_KEY) || '[]')); } catch (e) { return new Set(); } };

A.shell('product');

function crumbs() {
  return '<div class="crumbs"><a href="index.html' + (A.DEMO ? '?demo=1' : '') + '">' + esc(A.T('pr.home')) + '</a><span>/</span><a href="index.html' + (A.DEMO ? '?demo=1' : '') + '#products">' + esc(A.T('pr.showcase')) + '</a></div>';
}
function statusPage(kind, msg) {
  const isPending = kind === 'pending';
  P.innerHTML = '<div class="wrap">' + crumbs() + '<div class="glass status-box"><div class="big">' + (isPending ? '⏳' : '🔍') + '</div><h2>' + esc(A.T(isPending ? 'pr.pendingT' : 'pr.notFound')) + '</h2>' +
    '<p style="color:var(--muted)">' + esc(msg || A.T(isPending ? 'pr.pendingP' : 'pr.notFoundP')) + '</p><div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:16px">' +
    (isPending ? '<button class="btn grad" type="button" id="ownerBtn">' + esc(A.T('pr.owner')) + '</button>' : '') +
    '<a class="btn ghost" href="index.html' + (A.DEMO ? '?demo=1' : '') + '#products">' + esc(A.T('pr.back')) + '</a></div></div></div>';
  const ob = $('#ownerBtn'); if (ob) ob.onclick = ownerLogin;
}
function ownerLogin() {
  const m = A.modal('<div class="f-title">' + esc(A.T('pr.owner')) + '</div><div class="fld" style="margin-top:14px"><label for="oc">' + esc(window.AI_FORM.t('trackCode')) + '</label>' +
    '<input class="inp" id="oc" dir="ltr" autofocus autocomplete="off" style="text-transform:uppercase;letter-spacing:.15em"></div>' +
    '<div class="f-foot"><span class="f-err" id="oe" role="alert"></span><span class="sp"></span><button class="btn grad" id="og" type="button">' + esc(window.AI_FORM.t('trackGo')) + '</button></div>');
  const go = async () => {
    const code = $('#oc', m.el).value.trim().toUpperCase(); if (!code) return;
    $('#og', m.el).disabled = true;
    try { const r = await A.call('teacherGet', { id, code }); owner = { code, draft: r.hasDraft, status: r.item.status, note: r.item.adminNote }; item = r.item; m.close(); render(); }
    catch (e) { $('#oe', m.el).textContent = e.message; $('#og', m.el).disabled = false; }
  };
  $('#og', m.el).onclick = go; $('#oc', m.el).addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
}

/* ------------------------- العارض الحي ------------------------- */
function viewerHtml(p) {
  const L = A.LANG();
  const bar = (title, extra) => '<div class="vbar"><span class="dots"><i></i><i></i><i></i></span><span class="vt">' + esc(title) + '</span>' + (extra || '') + '</div>';
  if (p.type === 'html') return '<div class="viewer" id="viewer">' + bar(p.appFileName || p.title,
      '<span class="devices" role="group"><button type="button" class="on" data-w="100%">' + A.T('pr.dev.desk') + '</button><button type="button" data-w="820px">' + esc(A.T('pr.dev.tab')) + '</button><button type="button" data-w="390px">' + esc(A.T('pr.dev.mob')) + '</button></span>' +
      '<button class="btn xs soft" type="button" id="vFull">⛶ ' + esc(A.T('pr.fullscreen')) + '</button>' +
      '<button class="btn xs soft" type="button" id="vNew">↗ ' + esc(A.T('pr.openNew')) + '</button>' +
      '<button class="btn xs soft" type="button" id="vDl">⬇ ' + esc(A.T('pr.download')) + '</button>') +
    '<div class="frame-wrap" id="fw"><div class="vmsg"><div class="spin" style="margin:0 auto 10px"></div>' + esc(A.T('pr.loadingApp')) + '</div></div></div>';
  if (p.type === 'link') return '<div class="viewer" id="viewer">' + bar(p.url, '<button class="btn xs soft" type="button" id="vFull">⛶ ' + esc(A.T('pr.fullscreen')) + '</button><a class="btn xs grad" href="' + esc(A.safeUrl(p.url)) + '" target="_blank" rel="noopener">↗ ' + esc(A.T('pr.openNew')) + '</a>') +
    '<div class="frame-wrap"><iframe src="' + esc(A.safeUrl(p.url)) + '" title="' + esc(p.title) + '" loading="lazy" referrerpolicy="no-referrer" allow="fullscreen; clipboard-write; autoplay; microphone; camera"></iframe></div>' +
    '<div class="vmsg" style="padding:10px;font-size:13px">' + esc(A.T('pr.linkNote')) + '</div></div>';
  if (p.type === 'agent') {
    const tl = (p.tools || []).map(x => A.MAP.tools[x]).find(Boolean);
    return '<div class="viewer"><div class="agent-hero"><span class="big">🤖</span><h2 style="font-family:var(--display);font-weight:900">' + esc(A.T('pr.agentT')) + (tl ? ' — ' + esc(tl.name) : '') + '</h2>' +
      '<p style="color:var(--muted)">' + esc(A.T('pr.agentP')) + '</p><a class="btn grad" href="' + esc(A.safeUrl(p.url)) + '" target="_blank" rel="noopener">' + esc(A.T('pr.openAgent')) + ' ↗</a></div></div>';
  }
  if (p.type === 'file') {
    const isLocal = !p.fileId || p.fileId === 'local-file';
    return '<div class="viewer" id="viewer">' + bar(p.fileName || p.title, isLocal ? '' : '<button class="btn xs soft" type="button" id="vFull">⛶ ' + esc(A.T('pr.fullscreen')) + '</button>' +
      '<a class="btn xs soft" href="https://drive.google.com/file/d/' + encodeURIComponent(p.fileId) + '/view" target="_blank" rel="noopener">↗ ' + esc(A.T('pr.openDrive')) + '</a>' +
      '<a class="btn xs grad" href="https://drive.google.com/uc?export=download&id=' + encodeURIComponent(p.fileId) + '" target="_blank" rel="noopener">⬇ ' + esc(A.T('pr.download')) + '</a>') +
      (isLocal ? '<div class="vmsg">' + esc(A.T('pr.demoNoFile')) + '</div>' :
      '<div class="frame-wrap"><iframe src="https://drive.google.com/file/d/' + encodeURIComponent(p.fileId) + '/preview" title="' + esc(p.fileName || p.title) + '" loading="lazy" allow="autoplay; fullscreen"></iframe></div>' +
      '<div class="vmsg" style="padding:10px;font-size:13px">' + esc(A.T('pr.fileNote')) + '</div>') + '</div>';
  }
  if (p.type === 'prompt') return '<div class="pcard" style="margin:22px 0"><div class="ph"><b>💬 ' + esc(A.T('pr.promptT')) + '</b><button class="btn xs grad" type="button" data-cp="prompt">' + esc(A.T('pr.copyPrompt')) + '</button></div>' +
    '<pre class="pbody" style="max-height:none;font-size:15px" id="promptText">' + esc(p.prompt).replace(/\[([^\]\n]{1,60})\]/g, '<mark>[$1]</mark>') + '</pre></div>';
  return '';
}
let appHtml = '';
async function loadApp(p) {
  const fw = $('#fw'); if (!fw) return;
  try {
    let r;
    if (owner) r = await A.call('teacherApp', { id, code: owner.code, draft: !!owner.draft });
    else r = await A.call('app', { id });
    appHtml = r.html || '';
    const f = document.createElement('iframe');
    f.setAttribute('sandbox', A.SANDBOX_ATTR);
    f.setAttribute('allow', 'fullscreen; autoplay; clipboard-write; microphone; camera');
    f.title = p.title; f.style.maxWidth = '100%';
    f.srcdoc = A.sandboxDoc(appHtml);
    fw.innerHTML = ''; fw.appendChild(f);
  } catch (e) { fw.innerHTML = '<div class="vmsg">' + esc(A.T('pr.appErr')) + ' — ' + esc(e.message) + '</div>'; }
}
function bindViewer(p) {
  const v = $('#viewer'); if (!v) return;
  $$('.devices button', v).forEach(b => b.onclick = () => { $$('.devices button', v).forEach(x => x.classList.toggle('on', x === b)); const f = $('iframe', v); if (f) f.style.maxWidth = b.dataset.w; });
  const full = $('#vFull'); if (full) full.onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else if (v.requestFullscreen) v.requestFullscreen(); else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen(); };
  const nw = $('#vNew'); if (nw) nw.onclick = () => {
    if (!owner && !A.DEMO && A.CONFIGURED) { window.open(A.API + '?action=open&id=' + encodeURIComponent(id), '_blank', 'noopener'); return; }
    if (!appHtml) return;
    const w = window.open('', '_blank');
    if (w) { w.opener = null; const u = URL.createObjectURL(new Blob([appHtml], { type:'text/html' })); w.location.href = u; }
  };
  const dl = $('#vDl'); if (dl) dl.onclick = () => {
    if (!appHtml) return;
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([appHtml], { type:'text/html' }));
    a.download = (p.appFileName || (p.title + '.html')).replace(/[\\/:*?"<>|]+/g, '_'); document.body.appendChild(a); a.click(); a.remove();
  };
}

/* ------------------------- الصفحة ------------------------- */
function render() {
  const p = item;
  document.title = p.title + ' — ' + A.T('brand');
  const ty = A.typeOf(p.type), L = A.LANG();
  const tools = (p.tools || []).map(x => { const t = A.MAP.tools[x]; return t ? '<a class="tag good" href="' + esc(A.safeUrl(t.url)) + '" target="_blank" rel="noopener">' + esc(t.name) + ' ↗</a>' : '<span class="tag">' + esc(x) + '</span>'; }).join('');
  const tasks = (p.tasks || []).map(x => { const t = A.MAP.tasks[x]; return t ? '<span class="tag">' + t.icon + ' ' + esc(A.L(t.t)) + '</span>' : ''; }).join('');
  const lk = liked().has(id);
  const box = (icon, title, inner, full) => inner ? '<div class="glass p-box' + (full ? ' full' : '') + '"><h2>' + icon + ' ' + esc(title) + '</h2>' + inner + '</div>' : '';
  const ol = arr => arr && arr.length ? '<ol class="nice">' + arr.map(s => '<li><span>' + A.nl2br(s) + '</span></li>').join('') + '</ol>' : '';
  const yt = A.ytId(p.video);
  const imgs = p.imageIds || [];
  P.innerHTML = '<div class="wrap p-hero">' + crumbs() +
    (owner ? '<div class="banner warn">👁️ ' + esc(owner.status === 'approved' && owner.draft ? A.T('pr.previewDraft') : A.T('pr.preview')) +
      (owner.note ? '<br><b>' + esc(window.AI_FORM.t('adminNote')) + ':</b> ' + A.nl2br(owner.note) : '') + '</div>' : '') +
    '<div class="p-head"><div><span class="tag good">' + ty.icon + ' ' + esc(ty[L]) + '</span> ' + (p.featured ? '<span class="tag feat">⭐</span>' : '') +
      '<h1>' + esc(p.title) + '</h1><p class="sum">' + esc(p.summary) + '</p>' +
      '<div class="p-meta">' + tasks + '</div></div>' +
      '<aside class="glass p-card"><div class="row"><span class="av" style="width:42px;height:42px;font-size:15px">' + esc(String(p.teacher || '?').trim().charAt(0)) + '</span><div><small style="color:var(--muted)">' + esc(A.T('pr.teacher')) + '</small><br><b>' + esc(p.teacher) + '</b></div></div>' +
      '<dl><dt>' + esc(A.T('pr.subject')) + '</dt><dd>' + esc(A.subjectName(p)) + '</dd><dt>' + esc(A.T('pr.stage')) + '</dt><dd>' + esc(A.stageName(p.stage)) + '</dd>' +
      (p.grades ? '<dt>' + esc(A.T('pr.grades')) + '</dt><dd>' + esc(p.grades) + '</dd>' : '') +
      (p.createdAt ? '<dt>' + esc(A.T('pr.date')) + '</dt><dd>' + esc(A.fmtDate(p.createdAt)) + '</dd>' : '') + '</dl>' +
      '<div style="display:flex;gap:14px;font-size:13.5px;color:var(--muted)"><span>👁 ' + A.fmtNum(p.views) + ' ' + esc(A.T('common.views')) + '</span><span id="lkN">♥ ' + A.fmtNum(p.likes) + '</span></div>' +
      '<div class="p-act">' + (owner ? '' : '<button class="btn sm ghost likebtn' + (lk ? ' on' : '') + '" type="button" id="likeBtn">♥ ' + esc(A.T(lk ? 'pr.liked' : 'pr.like')) + '</button>') +
        '<button class="btn sm ghost" type="button" id="shareBtn">🔗 ' + esc(A.T('pr.share')) + '</button>' +
        '<a class="btn sm ghost" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(p.title + '\n' + location.href.replace(/[?&]demo=1/, '')) + '">' + esc(A.T('pr.whatsapp')) + '</a>' +
        '<button class="btn sm soft" type="button" id="editBtn">✏️ ' + esc(A.T('pr.edit')) + '</button></div>' +
      (tools ? '<div><small style="color:var(--muted)">' + esc(A.T('pr.tools')) + '</small><div class="bad-row" style="display:flex;flex-wrap:wrap;gap:5px;margin-top:4px">' + tools + '</div></div>' : '') +
      (p.url && p.type !== 'link' && p.type !== 'agent' ? '<a class="btn sm soft" href="' + esc(A.safeUrl(p.url)) + '" target="_blank" rel="noopener">🔗 ' + esc(A.T('pr.extLink')) + ' ↗</a>' : '') +
      '</aside></div>' +
    viewerHtml(p) +
    '<div class="p-grid">' +
      box('💡', A.T('pr.idea'), p.idea ? '<p>' + A.nl2br(p.idea) + '</p>' : '', true) +
      box('🛠️', A.T('pr.build'), ol(p.buildSteps)) +
      box('🏫', A.T('pr.use'), ol(p.useSteps)) +
      (p.type !== 'prompt' && p.prompt ? '<div class="pcard p-box full" style="padding:0"><div class="ph"><b>💬 ' + esc(A.T('pr.promptUsed')) + '</b><button class="btn xs grad" type="button" data-cp="used">' + esc(A.T('common.copy')) + '</button></div><pre class="pbody" style="max-height:340px" id="usedPrompt">' + esc(p.prompt) + '</pre></div>' : '') +
      box('🎬', A.T('pr.video'), yt ? '<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/' + yt + '" title="video" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" loading="lazy"></iframe></div>'
        : (p.video ? '<a class="btn soft sm" href="' + esc(A.safeUrl(p.video)) + '" target="_blank" rel="noopener">▶ ' + esc(p.video) + '</a>' : ''), true) +
      box('🖼️', A.T('pr.gallery'), imgs.length ? '<div class="gal">' + imgs.map((im, i) => '<button type="button" data-lb="' + i + '"><img src="' + esc(A.img(im, 600)) + '" alt="" loading="lazy"></button>').join('') + '</div>' : '', true) +
      box('📌', A.T('pr.tips'), p.tips ? '<p>' + A.nl2br(p.tips) + '</p>' : '', true) +
    '</div><div id="related"></div></div>';
  bindViewer(p);
  if (p.type === 'html') loadApp(p);
  $$('[data-cp]').forEach(b => b.onclick = () => A.copy($(b.dataset.cp === 'prompt' ? '#promptText' : '#usedPrompt').textContent, b));
  $$('[data-lb]').forEach(b => b.onclick = () => lightbox(imgs, +b.dataset.lb));
  $('#shareBtn').onclick = e => A.copy(location.href.replace(/[?&]demo=1/, ''), e.currentTarget);
  $('#editBtn').onclick = () => {
    if (owner) window.AI_FORM.open({ mode:'teacher', id, code: owner.code, item, onDone: afterEdit });
    else window.AI_FORM.track({ id, onDone: afterEdit });
  };
  const lb = $('#likeBtn');
  if (lb) lb.onclick = async () => {
    const s = liked(), on = s.has(id); lb.disabled = true;
    try { const r = await A.call('like', { id, delta: on ? -1 : 1 }); if (on) s.delete(id); else s.add(id); A.LS.set(LIKE_KEY, JSON.stringify(Array.from(s)));
      item.likes = r.value; lb.classList.toggle('on', !on); lb.textContent = '♥ ' + A.T(on ? 'pr.like' : 'pr.liked'); $('#lkN').textContent = '♥ ' + A.fmtNum(r.value); }
    catch (e) { A.toast(e.message, true); }
    lb.disabled = false;
  };
  if (!owner) related(p);
}
/* بعد تعديل المعلم: نعرض له نسخته (المعلقة أو المسودة) مع بقاء رسالة التأكيد ظاهرة */
async function afterEdit(r, code) {
  try { const g = await A.call('teacherGet', { id, code }); owner = { code, draft: g.hasDraft, status: g.item.status, note: g.item.adminNote }; item = g.item; appHtml = ''; render(); scrollTo(0, 0); }
  catch (e) { load(); }
}
async function related(p) {
  try {
    const r = await A.call('list');
    const list = (r.items || []).filter(x => x.id !== p.id && (x.tasks || []).some(t => (p.tasks || []).indexOf(t) >= 0) ).slice(0, 3);
    if (!list.length) return;
    $('#related').innerHTML = '<div class="sec-h" style="margin:40px 0 16px"><h2 style="font-size:24px">' + esc(A.T('pr.related')) + '</h2></div><div class="products">' +
      list.map(x => '<article class="prod"><a class="cover-link" href="product.html?id=' + encodeURIComponent(x.id) + (A.DEMO ? '&demo=1' : '') + '" aria-label="' + esc(x.title) + '"></a>' +
        '<div class="cover" style="--g:var(--ai)">' + (x.coverId ? '<img src="' + esc(A.img(x.coverId, 600)) + '" alt="" loading="lazy">' : '<span class="ph">' + A.typeOf(x.type).icon + '</span><span class="ph-t">' + esc(x.title) + '</span>') + '</div>' +
        '<div class="pb"><h3>' + esc(x.title) + '</h3><p>' + esc(x.summary) + '</p><div class="who"><span class="av">' + esc(String(x.teacher || '?').charAt(0)) + '</span>' + esc(x.teacher) + '</div></div></article>').join('') + '</div>';
  } catch (e) {}
}
function lightbox(list, i) {
  const el = document.createElement('div'); el.className = 'lb';
  const draw = () => { el.innerHTML = '<img src="' + esc(A.img(list[i], 1600)) + '" alt=""><button class="x" type="button" aria-label="close">✕</button>' +
    (list.length > 1 ? '<button class="pv" type="button" aria-label="prev">‹</button><button class="nx" type="button" aria-label="next">›</button>' : ''); };
  const close = () => { el.remove(); document.removeEventListener('keydown', key); };
  const mv = d => { i = (i + d + list.length) % list.length; draw(); };
  const key = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') mv(A.LANG() === 'ar' ? 1 : -1); if (e.key === 'ArrowRight') mv(A.LANG() === 'ar' ? -1 : 1); };
  el.onclick = e => { if (e.target === el || e.target.classList.contains('x')) close(); else if (e.target.classList.contains('pv')) mv(-1); else if (e.target.classList.contains('nx')) mv(1); };
  document.addEventListener('keydown', key); draw(); document.body.appendChild(el);
}

async function load() {
  if (!id) return statusPage('missing');
  if (!A.CONFIGURED && !A.DEMO) return statusPage('missing', A.T('common.notConfigured'));
  try {
    const r = await A.call('get', { id });
    item = r.item; render();
    const vk = 'ai_viewed_' + id;
    if (!A.SS.get(vk)) { A.SS.set(vk, '1'); A.call('view', { id }).catch(() => {}); }
  } catch (e) {
    if (e.data && e.data.notPublic) statusPage('pending');
    else statusPage('missing', e.message);
  }
}
A.applyLang();
A.onLang(() => { if (item) render(); else load(); });
load();
})();
