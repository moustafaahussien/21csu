/* =====================================================================
   منصة المعلم الذكي — الصفحة الرئيسية (الدليل • الوكلاء • التدريب • البرومبتات • المعرض)
   ===================================================================== */
(function () {
'use strict';
const A = window.AI, D = A.D, esc = A.esc, $ = A.$, $$ = A.$$;

Object.assign(A.I18N.ar, { hub:{
  eyebrow:"منصة معلمي مدارس دار الذكر", h1:"المعلم الذكي",
  lead:"دليلك العملي للذكاء الاصطناعي في التعليم: الأداة المناسبة لكل مهمة، تدريب خطوة بخطوة، برومبتات جاهزة، ومعرض لمنتجات زملائك تجرّبها بنفسك.",
  askQ:"عايز تعمل إيه؟", askPh:"اختبار، ورقة عمل، عرض، لعبة تفاعلية…", askGo:"تصفح الدليل",
  st:{ tools:"أداة في الدليل", tasks:"مهمة تعليمية", products:"منتج للمعلمين", teachers:"معلماً مشاركاً" },
  guideH:"الأداة المناسبة لكل مهمة", guideP:"اختر ما تريد إنجازه، وستجد الأدوات المقترحة، نصيحة عملية، برومبتاً جاهزاً، ومنتجات زملائك في المهمة نفسها.",
  allTools:"كل الأدوات", allToolsP:"مرتبة حسب التكلفة ودعم العربية.", tf:{ all:"الكل", free:"مجانية أو بحساب المدرسة", arabic:"عربي ممتاز" },
  toolsFor:"الأدوات المقترحة", promptsFor:"برومبتات جاهزة", productsFor:"من منتجات زملائك", noProdsFor:"لا توجد منتجات في هذه المهمة بعد — كن أول من يضيف!",
  tip:"نصيحة", tryIt:"جرّب الأداة", useFor:"مقترحة لـ",
  agentsH:"وكلاء الذكاء الاصطناعي", agentsP:"مساعدات جاهزة صنعها معلمونا لمواد ودروس محددة، والمساعدات العامة وكيف تبني وكيلك الخاص.",
  tabOurs:"وكلاء معلمينا", tabGeneral:"المساعدات العامة وبناء وكيلك", noAgents:"لم يُضف أي وكيل بعد. ابنِ وكيلك وشاركه مع زملائك!",
  tmplH:"قالب تعليمات جاهز لوكيلك", tmplP:"انسخه في GPT أو Gem أو Claude Project، واستبدل ما بين الأقواس بمادتك ودرسك.", tmplCopy:"نسخ القالب", tmplLearn:"تعلّم بناء الوكيل",
  trainH:"مسار التدريب", trainP:"ستة دروس قصيرة عملية — من الأساسيات حتى بناء تطبيق تفاعلي ونشره. تقدمك يُحفظ على جهازك.",
  prog:"أنجزت", of:"من", lessonDone:"أنهيت هذا الدرس ✓", markDone:"تحديد كمكتمل", undo:"إلغاء الإكمال", practice:"تطبيق عملي:",
  promptsH:"مكتبة البرومبتات", promptsP:"برومبتات مجرّبة جاهزة للنسخ. الكلمات بين [ ] استبدلها ببياناتك.", byTeacher:"من", platformPrompt:"من المنصة", openProd:"عرض المنتج",
  prodH:"معرض منتجات المعلمين", prodP:"أفكار ومنتجات صنعها زملاؤك بالذكاء الاصطناعي — جرّبها مباشرة، واقرأ كيف صُنعت وكيف تُستخدم.",
  pSearch:"ابحث بالعنوان أو المعلم أو الأداة…", fSubject:"المادة", fStage:"المرحلة", fType:"النوع", fTask:"الاستخدام", fSort:"الترتيب",
  allSubjects:"كل المواد", allStages:"كل المراحل", allTypes:"كل الأنواع", allTasks:"كل الاستخدامات",
  sort:{ new:"الأحدث", views:"الأكثر مشاهدة", likes:"الأكثر إعجاباً" },
  emptyAll:"لا توجد منتجات منشورة بعد", emptyAllP:"شارك أول منتج لك وألهم زملاءك.", emptyFilter:"لا توجد منتجات تطابق البحث",
  loadErr:"تعذّر تحميل المنتجات", track:"متابعة منتجي", featured:"⭐ مميز",
  ctaH:"صنعت شيئاً مميزاً بالذكاء الاصطناعي؟", ctaP:"شاركه مع زملائك: المنتج نفسه، وكيف صنعته، وكيف تستخدمه في الحصة.",
  res:{ task:"مهمة", tool:"أداة", prod:"منتج", prompt:"برومبت" }
}});
Object.assign(A.I18N.en, { hub:{
  eyebrow:"For Dar Al-Thikr Schools teachers", h1:"Smart Teacher",
  lead:"Your practical guide to AI in teaching: the right tool for every task, step-by-step training, ready prompts, and a showcase of colleagues' products you can try yourself.",
  askQ:"What do you want to do?", askPh:"A test, a worksheet, slides, an interactive game…", askGo:"Browse the guide",
  st:{ tools:"tools in the guide", tasks:"teaching tasks", products:"teacher products", teachers:"contributing teachers" },
  guideH:"The right tool for every task", guideP:"Pick what you want to get done: suggested tools, a practical tip, a ready prompt, and colleagues' products for the same task.",
  allTools:"All tools", allToolsP:"With cost and Arabic support.", tf:{ all:"All", free:"Free or via school account", arabic:"Great Arabic" },
  toolsFor:"Suggested tools", promptsFor:"Ready prompts", productsFor:"From your colleagues", noProdsFor:"No products for this task yet — be the first to add one!",
  tip:"Tip", tryIt:"Try the tool", useFor:"Suggested for",
  agentsH:"AI agents", agentsP:"Ready assistants our teachers built for specific subjects and lessons, plus general assistants and how to build your own.",
  tabOurs:"Our teachers' agents", tabGeneral:"General assistants & building yours", noAgents:"No agents yet. Build yours and share it!",
  tmplH:"A ready instructions template for your agent", tmplP:"Paste it into a GPT, Gem or Claude Project and replace the brackets with your subject and lesson.", tmplCopy:"Copy template", tmplLearn:"Learn to build an agent",
  trainH:"Training path", trainP:"Six short practical lessons — from the basics to building and publishing an interactive app. Progress is saved on your device.",
  prog:"Completed", of:"of", lessonDone:"Lesson completed ✓", markDone:"Mark as completed", undo:"Undo", practice:"Practice:",
  promptsH:"Prompt library", promptsP:"Tested prompts ready to copy. Replace words in [ ] with your details.", byTeacher:"By", platformPrompt:"Platform", openProd:"View product",
  prodH:"Teachers' products showcase", prodP:"Ideas and products colleagues made with AI — try them directly and read how they were made and used.",
  pSearch:"Search by title, teacher or tool…", fSubject:"Subject", fStage:"Stage", fType:"Type", fTask:"Use", fSort:"Sort",
  allSubjects:"All subjects", allStages:"All stages", allTypes:"All types", allTasks:"All uses",
  sort:{ new:"Newest", views:"Most viewed", likes:"Most liked" },
  emptyAll:"No published products yet", emptyAllP:"Share your first product and inspire colleagues.", emptyFilter:"No products match your search",
  loadErr:"Couldn't load products", track:"Track my product", featured:"⭐ Featured",
  ctaH:"Made something great with AI?", ctaP:"Share it with colleagues: the product, how you made it, and how you use it in class.",
  res:{ task:"Task", tool:"Tool", prod:"Product", prompt:"Prompt" }
}});

const S = { products: null, loadErr: '', toolFilter:'all', promptTask:'all', agentTab:'ours',
  f:{ q:'', subject:'', stage:'', type:'', task:'', sort:'new' } };
const L = o => A.L(o), LG = () => A.LANG();
const sep = () => LG() === 'ar' ? '، ' : ', ';

/* ------------------------- عناصر مشتركة ------------------------- */
function priceTag(p) { return '<span class="tag ' + p + '">' + esc(A.T('price.' + p)) + '</span>'; }
function arTag(a) { return '<span class="tag ' + a + '">' + esc(A.T('arLvl.' + a)) + '</span>'; }
function toolCard(tl, withTasks) {
  const tasks = withTasks ? D.tasks.filter(x => x.tools.indexOf(tl.id) >= 0).map(x => x.icon).join(' ') : '';
  return '<div class="tool"><div class="top"><span class="lg" style="--c:' + tl.color + '">' + esc(tl.mono) + '</span><div><h4>' + esc(tl.name) + '</h4>' +
    (tasks ? '<small style="color:var(--soft);font-size:12px">' + esc(A.T('hub.useFor')) + ' ' + tasks + '</small>' : '') + '</div></div>' +
    '<p>' + esc(L(tl.d)) + '</p><div class="bad-row">' + priceTag(tl.price) + arTag(tl.ar) + '</div>' +
    '<a class="btn xs soft go" href="' + A.safeUrl(tl.url) + '" target="_blank" rel="noopener">' + esc(A.T('hub.tryIt')) + ' ↗</a></div>';
}
function hl(text) { return esc(text).replace(/\[([^\]\n]{1,60})\]/g, '<mark>[$1]</mark>'); }
function promptCard(title, sub, body, extra) {
  return '<div class="pcard"><div class="ph"><div><b>' + esc(title) + '</b><small>' + sub + '</small></div></div>' +
    '<pre class="pbody">' + hl(body) + '</pre><div class="pf"><button class="btn xs grad" type="button" data-copy>' + esc(A.T('common.copy')) + '</button>' + (extra || '') + '</div></div>';
}
const GRADS = ['linear-gradient(135deg,#6D4BFF,#0EA5D6)','linear-gradient(135deg,#E63E7C,#6D4BFF)','linear-gradient(135deg,#0E9F76,#0EA5D6)',
  'linear-gradient(135deg,#E8790A,#E63E7C)','linear-gradient(135deg,#4F46E5,#14B8A6)','linear-gradient(135deg,#8B5CF6,#EC4899)'];
function gradFor(id) { let h = 0; String(id).split('').forEach(c => { h = (h * 31 + c.charCodeAt(0)) >>> 0; }); return GRADS[h % GRADS.length]; }
const link = id => 'product.html?id=' + encodeURIComponent(id) + (A.DEMO ? '&demo=1' : '');
function initials(n) { const w = String(n || '').replace(/[()]/g, '').trim().split(/\s+/); return (w[0] || '?').charAt(0) + (w[1] ? w[1].charAt(0) : ''); }
function prodCard(p) {
  const ty = A.typeOf(p.type);
  const cover = p.coverId ? '<img src="' + esc(A.img(p.coverId, 700)) + '" alt="" loading="lazy" onerror="this.remove()">' : '<span class="ph">' + ty.icon + '</span><span class="ph-t">' + esc(p.title) + '</span>';
  return '<article class="prod"><a class="cover-link" href="' + link(p.id) + '" aria-label="' + esc(p.title) + '"></a>' +
    '<div class="cover" style="--g:' + gradFor(p.id) + '">' + cover + '<span class="type">' + ty.icon + ' ' + esc(ty[LG()]) + '</span>' +
    (p.featured ? '<span class="tag feat feat">' + esc(A.T('hub.featured')) + '</span>' : '') + '</div>' +
    '<div class="pb"><h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p>' +
    '<div class="bad-row" style="display:flex;flex-wrap:wrap;gap:4px"><span class="tag">' + esc(A.subjectName(p)) + '</span><span class="tag">' + esc(A.stageName(p.stage)) + '</span></div>' +
    '<div class="who"><span class="av">' + esc(initials(p.teacher)) + '</span>' + esc(p.teacher) + '</div></div>' +
    '<div class="pfoot"><span>👁 ' + A.fmtNum(p.views) + '</span><span>♥ ' + A.fmtNum(p.likes) + '</span><span class="go">' + esc(A.T('common.open')) + (LG() === 'ar' ? ' ←' : ' →') + '</span></div></article>';
}

/* ------------------------- الهيرو ------------------------- */
function renderHero() {
  $('#heroChips').innerHTML = D.tasks.slice(0, 6).map(x => '<button class="chip" type="button" data-task="' + x.id + '">' + x.icon + ' ' + esc(L(x.t)) + '</button>').join('');
  const prods = S.products || [];
  const teachers = new Set(prods.map(p => String(p.teacher || '').trim()).filter(Boolean)).size;
  const st = [[D.tools.length, 'tools'], [D.tasks.length, 'tasks'], [S.products ? prods.length : '—', 'products'], [S.products ? teachers : '—', 'teachers']];
  $('#stats').innerHTML = st.map(s => '<div class="stat"><b>' + (typeof s[0] === 'number' ? A.fmtNum(s[0]) : s[0]) + '</b><span>' + esc(A.T('hub.st.' + s[1])) + '</span></div>').join('');
}
function askSearch() {
  const q = $('#askIn').value.trim().toLowerCase(), box = $('#askRes');
  if (!q) { box.classList.add('hidden'); return; }
  const has = s => String(s || '').toLowerCase().indexOf(q) >= 0;
  const res = [];
  D.tasks.forEach(x => { if (has(x.t.ar) || has(x.t.en) || has(x.d.ar) || has(x.d.en)) res.push({ k:'task', id:x.id, t:x.icon + ' ' + L(x.t), s:L(x.d) }); });
  D.tools.forEach(x => { if (has(x.name) || has(x.d.ar) || has(x.d.en)) res.push({ k:'tool', id:x.id, t:x.name, s:L(x.d) }); });
  D.prompts.forEach((x, i) => { if (has(x.t.ar) || has(x.t.en)) res.push({ k:'prompt', id:i, t:'💬 ' + L(x.t), s:L(A.MAP.tasks[x.task].t) }); });
  (S.products || []).forEach(x => { if (has(x.title) || has(x.summary) || has(x.teacher)) res.push({ k:'prod', id:x.id, t:A.typeOf(x.type).icon + ' ' + x.title, s:x.teacher }); });
  box.innerHTML = res.length ? res.slice(0, 10).map((r, i) => '<button type="button" role="option" data-k="' + r.k + '" data-id="' + esc(r.id) + '"' + (i === 0 ? ' class="on"' : '') + '><span class="tag">' + esc(A.T('hub.res.' + r.k)) + '</span><span><b>' + esc(r.t) + '</b><br><small>' + esc(String(r.s).slice(0, 90)) + '</small></span></button>').join('')
    : '<div style="padding:12px;color:var(--muted)">' + esc(A.T('common.none')) + '</div>';
  box.classList.remove('hidden');
}
function askPick(b) {
  const k = b.dataset.k, id = b.dataset.id;
  $('#askRes').classList.add('hidden');
  if (k === 'task') openTask(id);
  else if (k === 'tool') { const t = A.MAP.tools[id]; window.open(t.url, '_blank', 'noopener'); }
  else if (k === 'prompt') { const p = D.prompts[+id]; S.promptTask = p.task; renderPrompts(); location.hash = '#prompts'; }
  else location.href = link(id);
}

/* ------------------------- الدليل ------------------------- */
function renderTasks() {
  const counts = {};
  (S.products || []).forEach(p => (p.tasks || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  $('#tasks').innerHTML = D.tasks.map(x => '<button class="task" type="button" data-task="' + x.id + '" style="--c:' + x.color + '">' +
    (counts[x.id] ? '<span class="cnt">' + A.fmtNum(counts[x.id]) + ' 🧑‍🏫</span>' : '') +
    '<span class="ic">' + x.icon + '</span><h3>' + esc(L(x.t)) + '</h3><p>' + esc(L(x.d)) + '</p>' +
    '<span class="mini">' + x.tools.slice(0, 4).map(id => '<i>' + esc(A.toolName(id)) + '</i>').join('') + '</span></button>').join('');
}
function renderTools() {
  $('#toolFilters').innerHTML = ['all','free','arabic'].map(k => '<button class="chip' + (S.toolFilter === k ? ' on' : '') + '" type="button" data-tf="' + k + '">' + esc(A.T('hub.tf.' + k)) + '</button>').join('');
  const list = D.tools.filter(t => S.toolFilter === 'all' || (S.toolFilter === 'free' ? (t.price === 'free' || t.price === 'edu') : t.ar === 'good'));
  $('#toolsGrid').innerHTML = list.map(t => toolCard(t, true)).join('');
}
function openTask(id) {
  const x = A.MAP.tasks[id]; if (!x) return;
  const prompts = D.prompts.filter(p => p.task === id);
  const tprompts = (S.products || []).filter(p => p.type === 'prompt' && (p.tasks || []).indexOf(id) >= 0 && p.prompt);
  const prods = (S.products || []).filter(p => (p.tasks || []).indexOf(id) >= 0);
  const html = '<div class="panel-h" style="--c:' + x.color + '"><span class="ic">' + x.icon + '</span><div><h2>' + esc(L(x.t)) + '</h2><p>' + esc(L(x.d)) + '</p></div></div>' +
    '<div class="tipbox"><span>💡</span><span><b>' + esc(A.T('hub.tip')) + ':</b> ' + esc(L(x.tip)) + '</span></div>' +
    '<div class="sub-h">🧰 ' + esc(A.T('hub.toolsFor')) + '</div><div class="tools">' + x.tools.map(tid => toolCard(A.MAP.tools[tid])).join('') + '</div>' +
    (prompts.length || tprompts.length ? '<div class="sub-h">💬 ' + esc(A.T('hub.promptsFor')) + '</div><div class="prompts">' +
      prompts.map(p => promptCard(L(p.t), esc(A.T('hub.platformPrompt')), L(p.p))).join('') +
      tprompts.map(p => promptCard(p.title, esc(A.T('hub.byTeacher')) + ' ' + esc(p.teacher), p.prompt, '<a class="btn xs soft" href="' + link(p.id) + '">' + esc(A.T('hub.openProd')) + '</a>')).join('') + '</div>' : '') +
    '<div class="sub-h">🧑‍🏫 ' + esc(A.T('hub.productsFor')) + '</div>' +
    (prods.length ? '<div class="products">' + prods.slice(0, 6).map(prodCard).join('') + '</div>'
      : '<div class="empty"><b>' + esc(A.T('hub.noProdsFor')) + '</b><button class="btn grad sm" type="button" data-add>' + esc(A.T('nav.add')) + '</button></div>') +
    '<p class="note">' + esc(A.T('common.lastReview')) + '</p>';
  const m = A.modal(html, { wide:true });
  bindCopy(m.el);
}

/* ------------------------- الوكلاء ------------------------- */
function renderAgents() {
  $$('#agentTabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === S.agentTab));
  const pane = $('#agentPane');
  if (S.agentTab === 'general') {
    pane.innerHTML = '<div class="agents">' + D.assistants.map(a => { const tl = A.MAP.tools[a.tool];
      return '<div class="agent"><div class="tool" style="border:0;padding:0"><div class="top"><span class="lg" style="--c:' + tl.color + '">' + esc(tl.mono) + '</span><div><h4>' + esc(tl.name) + '</h4></div></div><p>' + esc(L(tl.d)) + '</p><div class="bad-row">' + priceTag(tl.price) + arTag(tl.ar) + '</div></div>' +
        '<div class="build">🤖 ' + esc(L(a.build)) + '</div><a class="btn xs soft" style="align-self:flex-start" href="' + A.safeUrl(tl.url) + '" target="_blank" rel="noopener">' + esc(A.T('hub.tryIt')) + ' ↗</a></div>'; }).join('') + '</div>';
    return;
  }
  if (!S.products) { pane.innerHTML = productsState(true); return; }
  const ag = S.products.filter(p => p.type === 'agent');
  pane.innerHTML = ag.length ? '<div class="products">' + ag.map(prodCard).join('') + '</div>'
    : '<div class="empty"><b>' + esc(A.T('hub.noAgents')) + '</b><button class="btn grad sm" type="button" data-add>' + esc(A.T('nav.add')) + '</button></div>';
}

/* ------------------------- التدريب ------------------------- */
const DONE_KEY = 'ai_training_done';
const doneSet = () => { try { return new Set(JSON.parse(A.LS.get(DONE_KEY) || '[]')); } catch (e) { return new Set(); } };
function renderTraining() {
  const done = doneSet();
  $('#trainGrid').innerHTML = D.training.map(m => '<button class="tcard' + (done.has(m.id) ? ' done' : '') + '" type="button" data-train="' + m.id + '">' +
    '<span class="ic">' + m.icon + '</span><h3>' + esc(L(m.t)) + '</h3><p>' + esc(L(m.d)) + '</p>' +
    '<span class="meta"><span class="tag good">' + esc(L(m.level)) + '</span><span class="tag">⏱ ' + m.mins + ' ' + esc(A.T('common.minutes')) + '</span></span></button>').join('');
  const n = D.training.filter(m => done.has(m.id)).length;
  $('#trainProg').innerHTML = '<span>' + esc(A.T('hub.prog')) + ' ' + A.fmtNum(n) + ' ' + esc(A.T('hub.of')) + ' ' + A.fmtNum(D.training.length) + '</span><span class="bar"><i style="width:' + Math.round(n / D.training.length * 100) + '%"></i></span>';
}
function openTraining(id) {
  const m = D.training.find(x => x.id === id); if (!m) return;
  const done = doneSet().has(id);
  const html = '<div class="panel-h" style="--c:#6D4BFF"><span class="ic">' + m.icon + '</span><div><h2>' + esc(L(m.t)) + '</h2><p>' + esc(L(m.d)) + ' · ⏱ ' + m.mins + ' ' + esc(A.T('common.minutes')) + '</p></div></div>' +
    (m.body[LG()] || m.body.ar).map(s => '<div class="lesson-sec"><h4>' + esc(s[0]) + '</h4><p>' + esc(s[1]) + '</p></div>').join('') +
    '<div class="practice"><b>✍️ ' + esc(A.T('hub.practice')) + '</b> ' + esc(L(m.task)) + '</div>' +
    '<div class="f-foot"><span class="sp"></span><button class="btn ' + (done ? 'ghost' : 'grad') + '" type="button" id="tDone">' + esc(done ? A.T('hub.undo') : A.T('hub.markDone')) + '</button></div>';
  const md = A.modal(html, { wide:true });
  $('#tDone', md.el).onclick = () => {
    const s = doneSet(); if (s.has(id)) s.delete(id); else s.add(id);
    A.LS.set(DONE_KEY, JSON.stringify(Array.from(s)));
    renderTraining(); md.close(); if (!done) A.toast(A.T('hub.lessonDone'));
  };
}

/* ------------------------- البرومبتات ------------------------- */
function renderPrompts() {
  const used = D.tasks.filter(x => D.prompts.some(p => p.task === x.id) || (S.products || []).some(p => p.type === 'prompt' && (p.tasks || []).indexOf(x.id) >= 0));
  $('#promptFilters').innerHTML = '<button class="chip' + (S.promptTask === 'all' ? ' on' : '') + '" type="button" data-pt="all">' + esc(A.T('common.all')) + '</button>' +
    used.map(x => '<button class="chip' + (S.promptTask === x.id ? ' on' : '') + '" type="button" data-pt="' + x.id + '">' + x.icon + ' ' + esc(L(x.t)) + '</button>').join('');
  const okT = id => S.promptTask === 'all' || id === S.promptTask;
  const staticP = D.prompts.filter(p => okT(p.task)).map(p => promptCard(L(p.t), esc(A.MAP.tasks[p.task].icon + ' ' + L(A.MAP.tasks[p.task].t)) + ' · ' + esc(A.T('hub.platformPrompt')), L(p.p)));
  const teacherP = (S.products || []).filter(p => p.type === 'prompt' && p.prompt && (p.tasks || []).some(okT))
    .map(p => promptCard(p.title, esc(A.T('hub.byTeacher')) + ' ' + esc(p.teacher), p.prompt, '<a class="btn xs soft" href="' + link(p.id) + '">' + esc(A.T('hub.openProd')) + '</a>'));
  $('#promptGrid').innerHTML = teacherP.concat(staticP).join('');
}
function bindCopy(root) {
  root.addEventListener('click', e => { const b = e.target.closest('[data-copy]'); if (!b) return; const pre = b.closest('.pcard').querySelector('pre'); A.copy(pre.textContent, b); });
}

/* ------------------------- المعرض ------------------------- */
function fillSelects() {
  const sel = (id, all, list, val) => { $(id).innerHTML = '<option value="">' + esc(all) + '</option>' + list.map(x => '<option value="' + x.id + '"' + (x.id === val ? ' selected' : '') + '>' + esc(x.label) + '</option>').join(''); };
  sel('#fSubject', A.T('hub.allSubjects'), D.subjects.map(x => ({ id:x.id, label:x[LG()] })), S.f.subject);
  sel('#fStage', A.T('hub.allStages'), D.stages.map(x => ({ id:x.id, label:x[LG()] })), S.f.stage);
  sel('#fType', A.T('hub.allTypes'), D.types.map(x => ({ id:x.id, label:x.icon + ' ' + x[LG()] })), S.f.type);
  sel('#fTask', A.T('hub.allTasks'), D.tasks.map(x => ({ id:x.id, label:x.icon + ' ' + L(x.t) })), S.f.task);
  $('#fSort').innerHTML = ['new','views','likes'].map(k => '<option value="' + k + '"' + (S.f.sort === k ? ' selected' : '') + '>' + esc(A.T('hub.sort.' + k)) + '</option>').join('');
}
function productsState(inAgents) {
  if (S.loadErr) return '<div class="empty"><b>' + esc(A.T('hub.loadErr')) + '</b>' + esc(S.loadErr) + '<br><button class="btn ghost sm" type="button" data-reload>' + esc(A.T('common.retry')) + '</button></div>';
  if (!A.CONFIGURED && !A.DEMO) return '<div class="empty"><b>' + esc(A.T('hub.emptyAll')) + '</b>' + esc(A.T('common.notConfigured')) +
    '<br><a class="btn ghost sm" href="?demo=1#products">' + esc(A.T('common.demoOpen')) + '</a></div>';
  return inAgents ? '<div class="products"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>' : '<div class="skel"></div><div class="skel"></div><div class="skel"></div>';
}
function renderProducts() {
  const g = $('#pGrid');
  if (!S.products) { g.innerHTML = productsState(); return; }
  const f = S.f, q = f.q.trim().toLowerCase();
  let list = S.products.filter(p => (!f.subject || p.subject === f.subject) && (!f.stage || p.stage === f.stage) && (!f.type || p.type === f.type) &&
    (!f.task || (p.tasks || []).indexOf(f.task) >= 0) &&
    (!q || [p.title, p.summary, p.teacher, A.subjectName(p), (p.tools || []).map(A.toolName).join(' ')].join(' ').toLowerCase().indexOf(q) >= 0));
  const by = { new: (a, b) => String(b.createdAt).localeCompare(String(a.createdAt)), views: (a, b) => b.views - a.views, likes: (a, b) => b.likes - a.likes }[f.sort];
  list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || by(a, b));
  if (!S.products.length) g.innerHTML = '<div class="empty"><b>' + esc(A.T('hub.emptyAll')) + '</b>' + esc(A.T('hub.emptyAllP')) + '<br><button class="btn grad sm" type="button" data-add>' + esc(A.T('nav.add')) + '</button></div>';
  else g.innerHTML = list.length ? list.map(prodCard).join('') : '<div class="empty"><b>' + esc(A.T('hub.emptyFilter')) + '</b></div>';
}
async function loadProducts() {
  S.loadErr = '';
  if (!A.CONFIGURED && !A.DEMO) { S.products = null; renderAll(); return; }
  S.products = null; renderProducts(); renderAgents();
  try { const r = await A.call('list'); S.products = r.items || []; }
  catch (e) { S.loadErr = e.message; S.products = null; }
  renderAll();
}

/* ------------------------- الخلفية الشبكية ------------------------- */
function net() {
  const c = $('#net'); if (!c || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const g = c.getContext('2d'); let W, H, P = [], raf;
  const cols = ['109,75,255', '14,165,214', '20,184,166', '230,62,124'];
  function size() { const r = c.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; c.width = W * d; c.height = H * d; g.setTransform(d, 0, 0, d, 0, 0);
    const n = Math.min(70, Math.round(W * H / 16000)); P = Array.from({ length:n }, () => ({ x:Math.random() * W, y:Math.random() * H, vx:(Math.random() - .5) * .35, vy:(Math.random() - .5) * .35, c:cols[Math.floor(Math.random() * 4)], r:1.5 + Math.random() * 2 })); }
  function step() {
    g.clearRect(0, 0, W, H);
    for (let i = 0; i < P.length; i++) { const a = P[i]; a.x += a.vx; a.y += a.vy; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1;
      for (let j = i + 1; j < P.length; j++) { const b = P[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
        if (d < 15000) { g.strokeStyle = 'rgba(' + a.c + ',' + (0.16 * (1 - d / 15000)) + ')'; g.lineWidth = 1; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); } }
      g.fillStyle = 'rgba(' + a.c + ',.55)'; g.beginPath(); g.arc(a.x, a.y, a.r, 0, 7); g.fill(); }
    raf = requestAnimationFrame(step);
  }
  size(); step();
  addEventListener('resize', () => { cancelAnimationFrame(raf); size(); step(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else { cancelAnimationFrame(raf); step(); } });
}

/* ------------------------- التشغيل ------------------------- */
function renderAll() { renderHero(); renderTasks(); renderTools(); renderAgents(); renderTraining(); renderPrompts(); fillSelects(); renderProducts();
  $('#tmplBody').innerHTML = hl(L(D.agentTemplate)); }

A.shell('hub');
A.applyLang();
A.onLang(() => { renderAll(); });

document.addEventListener('click', e => {
  const b = e.target.closest('[data-task],[data-tf],[data-pt],[data-train],[data-open-train],[data-tab],[data-reload],#askRes button');
  if (!b) return;
  if (b.closest('#askRes')) return askPick(b);
  if (b.dataset.task) openTask(b.dataset.task);
  else if (b.dataset.tf) { S.toolFilter = b.dataset.tf; renderTools(); }
  else if (b.dataset.pt) { S.promptTask = b.dataset.pt; renderPrompts(); }
  else if (b.dataset.train) openTraining(b.dataset.train);
  else if (b.dataset.openTrain) openTraining(b.dataset.openTrain);
  else if (b.dataset.tab) { S.agentTab = b.dataset.tab; renderAgents(); }
  else if (b.dataset.reload != null) loadProducts();
});
bindCopy($('#promptGrid'));
$('#cpTmpl').onclick = e => A.copy(L(D.agentTemplate), e.currentTarget);
$('#trackBtn').onclick = () => window.AI_FORM.track();
const ai = $('#askIn');
ai.addEventListener('input', askSearch);
ai.addEventListener('focus', askSearch);
ai.addEventListener('keydown', e => {
  const items = $$('#askRes button'); if (!items.length) return;
  let i = items.findIndex(x => x.classList.contains('on'));
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[i] && items[i].classList.remove('on'); i = (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length; items[i].classList.add('on'); items[i].scrollIntoView({ block:'nearest' }); }
  else if (e.key === 'Enter' && i >= 0) { e.preventDefault(); askPick(items[i]); }
  else if (e.key === 'Escape') $('#askRes').classList.add('hidden');
});
document.addEventListener('click', e => { if (!e.target.closest('#ask')) $('#askRes').classList.add('hidden'); });
$('#pSearch').addEventListener('input', e => { S.f.q = e.target.value; renderProducts(); });
[['#fSubject','subject'],['#fStage','stage'],['#fType','type'],['#fTask','task'],['#fSort','sort']].forEach(([s, k]) => $(s).addEventListener('change', e => { S.f[k] = e.target.value; renderProducts(); }));

const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold:0, rootMargin:'0px 0px -40px 0px' }) : null;
$$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));
net();
renderAll();
loadProducts();
if (A.qs.get('add') === '1') setTimeout(() => window.AI_FORM.open(), 300);
if (A.qs.get('track')) setTimeout(() => window.AI_FORM.track({ id: A.qs.get('track') }), 300);
})();
