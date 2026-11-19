/* =====================================================================
   منصة المعلم الذكي — محرك التدريب التطبيقي والاعتماد
   الدرس يكتمل عند: اجتياز الاختبار (75%+) + تسليم دليل المنتج + تحقق كل معايير الإتقان.
   التقدم يُحفظ على جهاز المعلم (الحسابات الشخصية تأتي في المرحلة الرابعة).
   ===================================================================== */
(function () {
'use strict';
const A = window.AI, D = A.D, esc = A.esc, $ = A.$, $$ = A.$$;
const KEY = 'ai_train_v2', PUB = 'ai_cert_pub', NAME = 'ai_cert_name';
const PASS = D.passMark || 75;
const listeners = [];

function store() { try { return JSON.parse(A.LS.get(KEY) || '{}'); } catch (e) { return {}; } }
function save(s) { A.LS.set(KEY, JSON.stringify(s)); listeners.forEach(f => f()); }
function rec(id) { const s = store(); return s[id] || { quiz:null, ans:[], ev:'', m:[] }; }
function setRec(id, r) { const s = store(); s[id] = r; save(s); }
function parts(id) {
  const L = D.training.find(x => x.id === id), r = rec(id);
  const quiz = r.quiz != null && r.quiz >= PASS;
  const ev = (r.ev || '').trim().length >= 10;
  const mastery = L.mastery.every((_, i) => r.m[i]);
  return { quiz, ev, mastery, done: quiz && ev && mastery, score: r.quiz };
}
const isDone = id => parts(id).done;
function published() { try { return JSON.parse(A.LS.get(PUB) || 'null'); } catch (e) { return null; } }

/* ------------------------- بطاقات الدروس ------------------------- */
function renderGrid(el) {
  const total = D.training.length, done = D.training.filter(x => isDone(x.id)).length;
  el.innerHTML = D.training.map(m => { const p = parts(m.id);
    return '<div class="tcard' + (p.done ? ' done' : '') + '" role="button" tabindex="0" data-train="' + m.id + '">' + (m.isNew ? '<span class="newb">جديد</span>' : '') +
      '<span class="ic">' + m.icon + '</span><h3>' + esc(A.L(m.t)) + '</h3><p>' + esc(A.L(m.d)) + '</p>' +
      '<span class="st3" title="الاختبار • المنتج • الإتقان"><i class="' + (p.quiz ? 'on' : '') + '"></i><i class="' + (p.ev ? 'on' : '') + '"></i><i class="' + (p.mastery ? 'on' : '') + '"></i></span>' +
      '<span class="meta"><span class="tag good">' + esc(A.L(m.level)) + '</span><span class="tag">⏱ ' + m.mins + ' ' + esc(A.T('common.minutes')) + '</span>' + A.fav.btn('lesson:' + m.id) + '</span></div>'; }).join('');
  return { done, total };
}
function renderProgress(el) {
  const total = D.training.length, done = D.training.filter(x => isDone(x.id)).length;
  el.innerHTML = '<span>أنجزت ' + done + ' من ' + total + ' دروس</span><span class="bar"><i style="width:' + Math.round(done / total * 100) + '%"></i></span>';
}
function certState(c) {
  const n = c.req.filter(isDone).length, pub = published();
  const pubOk = !c.needPublished || (pub && pub.ok);
  return { n, total: c.req.length + (c.needPublished ? 1 : 0), got: n === c.req.length && pubOk, pubOk };
}
function renderCerts(el) {
  el.innerHTML = D.certLevels.map(c => { const s = certState(c); const k = s.n + (c.needPublished && s.pubOk ? 1 : 0);
    return '<div class="cert' + (s.got ? ' on' : '') + '"><span class="ci">' + c.icon + '</span><h4>' + esc(c.name.ar) + ' <small style="color:var(--muted);font-family:Sora">' + esc(c.en) + '</small></h4><p>' + esc(c.d) + '</p>' +
      '<p>المطلوب: ' + c.req.length + ' دروس' + (c.needPublished ? ' + منتج منشور في المعرض' : '') + '</p>' +
      '<span class="bar"><i style="width:' + Math.round(k / s.total * 100) + '%"></i></span>' +
      '<button class="btn sm ' + (s.got ? 'grad' : 'ghost') + '" type="button" data-cert="' + c.id + '">' + (s.got ? '🎓 استخرج الشهادة' : 'تفاصيل المتطلبات') + '</button></div>'; }).join('');
}

/* ------------------------- نافذة الدرس ------------------------- */
function openLesson(id) {
  const L = D.training.find(x => x.id === id); if (!L) return;
  const r = rec(id);
  const sec = (icon, title, inner) => '<div class="lesson-part"><h4>' + icon + ' ' + esc(title) + '</h4>' + inner + '</div>';
  const html = '<div class="panel-h" style="--c:#6D4BFF"><span class="ic">' + L.icon + '</span><div><h2>' + esc(A.L(L.t)) + '</h2><p>' + esc(A.L(L.level)) + ' · ⏱ ' + L.mins + ' دقيقة</p></div></div>' +
    '<div class="stepper" id="lsSteps"></div>' +
    sec('🎯', 'ناتج التعلم', '<div class="outcome">' + esc(L.outcome) + '</div>') +
    sec('📘', 'شرح مختصر', L.explain.map(s => '<div class="lesson-sec"><h4>' + esc(s[0]) + '</h4><p>' + esc(s[1]) + '</p></div>').join('')) +
    sec('💡', 'مثال عملي', '<div class="examplebox">' + esc(L.example) + '</div>') +
    sec('🧭', 'تطبيق موجّه — خطوة بخطوة', '<ol class="nice">' + L.guided.map(g => '<li><span>' + esc(g) + '</span></li>').join('') + '</ol>') +
    sec('✍️', 'المهمة المستقلة', '<div class="practice">' + esc(L.task) + '</div>') +
    sec('📦', 'المنتج النهائي (دليل الإنجاز)', '<p style="color:var(--muted);font-size:14px">' + esc(L.product) + '</p>' +
      '<textarea class="inp" id="lsEv" style="min-height:90px;margin-top:6px" placeholder="الصق رابط منتجك (Drive، رابط الوكيل، رقم المنتج في المعرض…) أو اكتب وصفاً لما أنجزته">' + esc(r.ev || '') + '</textarea>' +
      '<div style="margin-top:6px"><button class="btn xs soft" type="button" id="lsEvSave">حفظ الدليل</button> <small style="color:var(--muted)">يُحفظ على جهازك فقط</small></div>') +
    sec('📝', 'اختبار قصير (النجاح ' + PASS + '%)', '<div class="quiz" id="lsQuiz">' + L.q.map((q, i) => '<div class="qq"><b>' + (i + 1) + '. ' + esc(q[0]) + '</b>' +
      q[1].map((o, j) => '<label><input type="radio" name="q' + i + '" value="' + j + '"' + (r.ans[i] === j ? ' checked' : '') + '><span>' + esc(o) + '</span></label>').join('') + '<div class="why hidden"></div></div>').join('') +
      '</div><div style="margin-top:10px;display:flex;gap:10px;align-items:center"><button class="btn sm grad" type="button" id="lsCheck">تصحيح الاختبار</button><b id="lsScore"></b></div>') +
    sec('🏅', 'معيار الإتقان — تحقق بنفسك', '<div class="checklist">' + L.mastery.map((m, i) => '<label><input type="checkbox" data-m="' + i + '"' + (r.m[i] ? ' checked' : '') + '><span>' + esc(m) + '</span></label>').join('') + '</div>') +
    (L.res && L.res.length ? sec('🔗', 'مصادر إضافية', L.res.map(x => '<a class="btn xs soft" href="' + esc(A.safeUrl(x[1])) + '" target="_blank" rel="noopener">' + esc(x[0]) + ' ↗</a>').join(' ')) : '') +
    '<div class="banner info" id="lsStatus"></div>';
  const md = A.modal(html, { wide:true });
  const el = md.el;
  const status = () => {
    const p = parts(id);
    $('#lsSteps', el).innerHTML = [['الاختبار', p.quiz], ['دليل المنتج', p.ev], ['معايير الإتقان', p.mastery]].map(x => '<span class="' + (x[1] ? 'ok' : '') + '">' + (x[1] ? '✓ ' : '○ ') + x[0] + '</span>').join('');
    $('#lsStatus', el).className = 'banner ' + (p.done ? 'info' : 'warn');
    $('#lsStatus', el).innerHTML = p.done ? '🎉 <b>أنجزت هذا الدرس.</b> يُحتسب في مستويات الاعتماد.' : 'لإكمال الدرس: اجتز الاختبار، واحفظ دليل منتجك (10 أحرف على الأقل)، وحقق كل معايير الإتقان.';
  };
  const check = (silent) => {
    const ans = L.q.map((_, i) => { const c = $('input[name="q' + i + '"]:checked', el); return c ? +c.value : null; });
    if (!silent && ans.some(a => a == null)) return A.toast('أجب عن كل الأسئلة أولاً', true);
    let ok = 0;
    L.q.forEach((q, i) => {
      const box = $$('.qq', el)[i];
      $$('label', box).forEach((lb, j) => { lb.classList.toggle('ok', j === q[2]); lb.classList.toggle('no', ans[i] === j && j !== q[2]); });
      const w = $('.why', box); w.classList.remove('hidden'); w.textContent = (ans[i] === q[2] ? '✓ ' : '✗ ') + q[3];
      if (ans[i] === q[2]) ok++;
    });
    const pct = Math.round(ok / L.q.length * 100);
    $('#lsScore', el).textContent = pct + '% ' + (pct >= PASS ? '— ناجح ✓' : '— أعد المحاولة');
    $('#lsScore', el).style.color = pct >= PASS ? 'var(--green)' : 'var(--red)';
    if (!silent) { const r2 = rec(id); r2.quiz = Math.max(pct, r2.quiz || 0); r2.ans = ans; setRec(id, r2); status(); }
  };
  $('#lsCheck', el).onclick = () => check(false);
  if (r.quiz != null) check(true);
  $('#lsEvSave', el).onclick = () => { const r2 = rec(id); r2.ev = $('#lsEv', el).value; setRec(id, r2); status(); A.toast('تم حفظ الدليل ✓'); };
  $$('[data-m]', el).forEach(cb => cb.onchange = () => { const r2 = rec(id); r2.m[+cb.dataset.m] = cb.checked; setRec(id, r2); status(); });
  status();
}

/* ------------------------- الشهادات ------------------------- */
function openCert(cid) {
  const c = D.certLevels.find(x => x.id === cid); const s = certState(c); const pub = published();
  const rows = c.req.map(id => { const L = D.training.find(x => x.id === id), p = parts(id);
    return '<tr><td>' + L.icon + ' ' + esc(A.L(L.t)) + '</td><td>' + (p.quiz ? '✅' : '—') + '</td><td>' + (p.ev ? '✅' : '—') + '</td><td>' + (p.mastery ? '✅' : '—') + '</td><td><button class="btn xs soft" type="button" data-train="' + id + '">فتح</button></td></tr>'; }).join('');
  const md = A.modal('<div class="f-title">' + c.icon + ' ' + esc(c.name.ar) + ' — ' + esc(c.en) + '</div><p class="f-sub">' + esc(c.d) + '</p>' +
    '<div class="tablewrap" style="margin-top:12px"><table class="recs"><tr><th>الدرس</th><th>الاختبار</th><th>المنتج</th><th>الإتقان</th><th></th></tr>' + rows + '</table></div>' +
    (c.needPublished ? '<div class="lesson-part"><h4>🌟 منتج منشور في المعرض</h4>' + (pub && pub.ok ? '<div class="banner info">✅ تم التحقق من نشر المنتج رقم <b dir="ltr">' + esc(pub.id) + '</b>: ' + esc(pub.title || '') + '</div>'
      : '<p style="color:var(--muted);font-size:14px">أدخل رقم منتجك المنشور (يظهر لك عند الإرسال وفي رابط صفحة المنتج). سنتحقق من نشره في المعرض.</p><div style="display:flex;gap:8px;margin-top:6px"><input class="inp" id="cPub" dir="ltr" placeholder="مثال: 261119-ab12" style="max-width:240px"><button class="btn sm soft" type="button" id="cPubGo">تحقق</button></div><p class="f-err" id="cPubErr"></p>') + '</div>' : '') +
    (s.got ? '<div class="lesson-part"><h4>🎓 بيانات الشهادة</h4><div style="display:flex;gap:8px;flex-wrap:wrap"><input class="inp" id="cName" placeholder="اكتب اسمك كما تريده في الشهادة" value="' + esc(A.LS.get(NAME) || '') + '" style="max-width:360px"><button class="btn grad" type="button" id="cPrint">🖨️ عرض الشهادة وطباعتها</button></div>' +
      '<p class="note">شهادة إتمام ذاتي مبنية على تقدمك المحفوظ في هذا الجهاز. الاعتماد الرسمي المرتبط بحساب المعلم ولوحة الإدارة يأتي مع المرحلة الرابعة.</p></div>'
      : '<div class="banner warn">أكمل المتطلبات أعلاه لتستخرج الشهادة.</div>'), { wide:true });
  const el = md.el;
  const pg = $('#cPubGo', el);
  if (pg) pg.onclick = async () => {
    const pid = $('#cPub', el).value.trim(); if (!pid) return;
    pg.disabled = true; $('#cPubErr', el).textContent = '';
    try { const r = await A.call('get', { id: pid }); A.LS.set(PUB, JSON.stringify({ id: pid, ok: true, title: r.item.title })); md.close(); listeners.forEach(f => f()); openCert(cid); }
    catch (e) { $('#cPubErr', el).textContent = e.data && e.data.notPublic ? 'المنتج موجود لكنه لم يُنشر بعد — انتظر اعتماد المشرف.' : e.message; pg.disabled = false; }
  };
  const pr = $('#cPrint', el);
  if (pr) pr.onclick = () => {
    const name = $('#cName', el).value.trim(); if (!name) return A.toast('اكتب اسمك أولاً', true);
    A.LS.set(NAME, name); printCert(c, name);
  };
}
function code(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return ('00000000' + (h >>> 0).toString(16).toUpperCase()).slice(-8); }
function printCert(c, name) {
  const date = new Date().toLocaleDateString('ar-SA-u-ca-gregory-nu-latn', { year:'numeric', month:'long', day:'numeric' });
  const lessons = c.req.map(id => A.L(D.training.find(x => x.id === id).t));
  const ref = 'DTS-AI-' + c.id.toUpperCase().slice(0, 3) + '-' + code(name + '|' + c.id + '|' + date);
  const w = window.open('', '_blank');
  if (!w) return A.toast('اسمح بالنوافذ المنبثقة لعرض الشهادة', true);
  w.document.write('<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>شهادة — ' + esc(name) + '</title>' +
    '<link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;700;900&family=Sora:wght@600;800&display=swap" rel="stylesheet">' +
    '<style>@page{size:A4 landscape;margin:0}body{margin:0;font-family:"Noto Kufi Arabic",Tahoma;background:#eef0fb}.c{width:297mm;height:210mm;box-sizing:border-box;padding:16mm;background:#fff;position:relative;overflow:hidden;margin:auto}' +
    '.c:before{content:"";position:absolute;inset:8mm;border:2px solid #6D4BFF;border-radius:10mm}.c:after{content:"";position:absolute;width:160mm;height:160mm;border-radius:50%;background:radial-gradient(circle,#6D4BFF22,transparent 70%);top:-60mm;left:-40mm}' +
    '.in{position:relative;z-index:1;text-align:center;padding-top:6mm}.top{display:flex;justify-content:space-between;align-items:center;padding:0 10mm}.top img{height:20mm}' +
    'h1{font-size:30pt;margin:6mm 0 2mm;background:linear-gradient(90deg,#6D4BFF,#0EA5D6,#14B8A6);-webkit-background-clip:text;color:transparent}h2{font-family:Sora;color:#4F46E5;margin:0;font-size:15pt;letter-spacing:.08em}' +
    '.nm{font-size:28pt;font-weight:900;margin:8mm 0 2mm;color:#14173A}.t{font-size:13pt;color:#565D8C;line-height:1.9;max-width:220mm;margin:auto}.ls{font-size:9.5pt;color:#565D8C;margin-top:5mm;line-height:1.8}' +
    '.ft{position:absolute;bottom:16mm;left:20mm;right:20mm;display:flex;justify-content:space-between;font-size:10pt;color:#565D8C}.ft b{color:#14173A}.lvl{font-size:40pt}' +
    '.bar{position:fixed;top:10px;left:10px}@media print{.bar{display:none}body{background:#fff}}</style></head><body>' +
    '<div class="bar"><button onclick="print()" style="font:inherit;padding:8px 18px;border-radius:10px;border:0;background:#6D4BFF;color:#fff;cursor:pointer">🖨️ طباعة / حفظ PDF</button></div>' +
    '<div class="c"><div class="in"><div class="top"><img src="' + location.href.replace(/ai\/[^/]*$/, '') + 'assets/school-logo.png" onerror="this.style.visibility=\'hidden\'"><div class="lvl">' + c.icon + '</div><img src="' + location.href.replace(/ai\/[^/]*$/, '') + 'assets/unit-logo.png" onerror="this.style.visibility=\'hidden\'"></div>' +
    '<h1>شهادة إتمام مسار المعلم الذكي</h1><h2>' + esc(c.en) + '</h2>' +
    '<div class="t" style="margin-top:6mm">تشهد وحدة مهارات القرن 21 بمدارس دار الذكر بأن</div><div class="nm">' + esc(name) + '</div>' +
    '<div class="t">أتمّ متطلبات مستوى <b>«' + esc(c.name.ar) + '»</b> باجتياز الاختبارات وإنجاز المنتجات التطبيقية وتحقيق معايير الإتقان' + (c.needPublished ? ' ونشر منتج تعليمي في معرض المنصة' : '') + '.</div>' +
    '<div class="ls">' + lessons.map(esc).join(' • ') + '</div></div>' +
    '<div class="ft"><span>التاريخ: <b>' + esc(date) + '</b></span><span>منصة المعلم الذكي — وحدة مهارات القرن 21</span><span dir="ltr">Ref: <b>' + ref + '</b></span></div></div></body></html>');
  w.document.close();
}

document.addEventListener('keydown', e => { const t = e.target.closest && e.target.closest('.tcard[role="button"]'); if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openLesson(t.dataset.train); } });
window.AI_TRAIN = { renderGrid, renderProgress, renderCerts, openLesson, openCert, isDone, onChange: f => listeners.push(f) };
})();
