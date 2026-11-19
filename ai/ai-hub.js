/* =====================================================================
   منصة المعلم الذكي — الصفحة الرئيسية
   (البحث الموحّد • الدليل • الوكلاء • التدريب • البرومبتات • المختبر • المعرفة • المعرض • المفضلة)
   ===================================================================== */
(function () {
'use strict';
const A = window.AI, D = A.D, esc = A.esc, $ = A.$, $$ = A.$$;
const TEAM = 'فريق منصة المعلم الذكي';

Object.assign(A.I18N.ar, { hub:{
  eyebrow:"منصة معلمي مدارس دار الذكر", h1:"المعلم الذكي",
  lead:"من الحاجة التعليمية إلى الحل: الأداة المناسبة لكل مهمة، وكلاء جاهزون، تدريب تطبيقي بشهادات، برومبتات احترافية، مختبر لبناء البرومبت وتحليل النتائج، ومعرض لمنتجات زملائك.",
  askQ:"عايز تعمل إيه؟", askPh:"ابحث في الأدوات والبرومبتات والوكلاء والدروس والمنتجات…", askGo:"تصفح الدليل",
  st:{ tools:"أداة بمعايير مقارنة", prompts:"برومبت احترافي", agents:"وكيلاً جاهزاً", lessons:"دروس تطبيقية", products:"منتج في المعرض" },
  guideH:"الأداة المناسبة لكل مهمة", guideP:"اختر ما تريد إنجازه: جدول توصية (الحاجة ← الأداة الأنسب ← لماذا ← البديل)، بطاقات مقارنة، برومبتات جاهزة، ومنتجات زملائك.",
  allTools:"كل الأدوات ومعايير المقارنة", allToolsP:"صنّف حسب نوع الاستخدام، أو التكلفة ودعم العربية. اضغط «التفاصيل» لبطاقة التقييم الكاملة.",
  tf:{ all:"الكل", free:"مجانية أو بحساب المدرسة", arabic:"عربي ممتاز", easy:"سهلة الاستخدام", students:"يتفاعل معها الطلاب" },
  recsH:"نظام التوصية", toolsFor:"الأدوات المقترحة", promptsFor:"برومبتات جاهزة", productsFor:"من منتجات زملائك", noProdsFor:"لا توجد منتجات في هذه المهمة بعد — كن أول من يضيف!",
  allTaskPrompts:"كل برومبتات هذه المهمة", tip:"نصيحة", tryIt:"جرّب الأداة", details:"التفاصيل", useFor:"مقترحة لـ",
  need:"الحاجة", best:"الأداة الأنسب", why:"لماذا؟", alt:"البديل",
  crit:{ ar:"جودة العربية", ease:"سهولة الاستخدام", price:"الاستخدام المجاني", files:"الملفات المدعومة", gen:"إنشاء محتوى تعليمي", stu:"التفاعل مع الطلاب", exp:"التصدير", priv:"الخصوصية", best:"الأنسب لـ", uses:"أنواع الاستخدام", verified:"آخر تحقق", tested:"ما جُرّب فعلياً", site:"الموقع الرسمي" },
  notTested:"لم يُسجّل اختبار عملي بعد — الترشيح مبني على القدرات المعلنة.",
  agentsH:"وكلاء الذكاء الاصطناعي", agentsP:"12 وكيلاً جاهزاً بقالب احترافي من عشرة عناصر وثلاثة مستويات، ووكلاء صنعها معلمونا، وطريقة بناء وكيلك.",
  tabReady:"الوكلاء الجاهزون (12)", tabOurs:"وكلاء معلمينا", tabGeneral:"المساعدات العامة", noAgents:"لم يُضف معلم وكيلاً بعد. ابنِ وكيلك وشاركه!",
  agentNote:"هذه تعليمات وكلاء جاهزة تنسخها إلى GPT أو Gem أو Claude Project — وليست وكلاء تعمل داخل المنصة. وكلاء المعلمين في التبويب التالي لها روابط تعمل مباشرة.",
  copyInst:"انسخ التعليمات", tryChatGPT:"جرّب في ChatGPT", tryClaude:"جرّب في Claude", tryGemini:"انسخ وافتح Gemini",
  tmplH:"القالب الموحّد لبناء وكيلك (10 عناصر)", tmplP:"الهوية • التخصص • الجمهور • المهمة • المصادر • المنهجية • المخرجات • الجودة • القيود • التحقق. انسخه واستبدل ما بين الأقواس.", tmplCopy:"نسخ القالب", tmplLearn:"تعلّم بناء الوكيل",
  trainH:"مسار التدريب التطبيقي", trainP:"عشرة دروس؛ كل درس: ناتج تعلم، شرح، مثال، تطبيق موجّه، مهمة مستقلة، منتج، اختبار، ومعيار إتقان — وثلاثة مستويات اعتماد بشهادات.",
  promptsH:"مكتبة البرومبتات الاحترافية", promptsP:"أكثر من 120 برومبتاً في 11 تصنيفاً، بمستويات (مبتدئ • متوسط • متقدم/سير عمل)، مع المدخلات والمخرجات ومعايير المراجعة. الكلمات بين [ ] استبدلها ببياناتك.",
  openBuilder:"🧩 ابنِ برومبتك بنفسك", prSearch:"ابحث في البرومبتات…", fLevel:"المستوى", fTool:"الأداة", allLevels:"كل المستويات", allTools:"كل الأدوات", more:"عرض المزيد",
  inputs:"المدخلات", outputs:"المخرجات", check:"راجع النتيجة", toolsUse:"الأدوات", wf:"سير عمل", byTeacher:"من", platformPrompt:"من المنصة", openProd:"عرض المنتج", evalIt:"قيّم", shown:"معروض",
  labH:"مختبر المعلم الذكي", labP:"أدوات تعمل داخل المنصة: ابنِ برومبتك، حسّنه، قيّمه، وحلّل نتائج طلابك دون رفع بياناتهم.",
  lab:{ builder:["🧩","مولّد البرومبت","اختر المهمة والمادة والصف والمستوى وشكل المخرجات، واحصل على برومبت متكامل.","#6D4BFF"],
        optimizer:["✨","محسّن البرومبت","الصق طلباً بسيطاً واحصل على برومبت احترافي مع شرح ما تحسّن ولماذا.","#0EA5D6"],
        evaluator:["📏","مقيّم البرومبت","درجة من 80 وفق ثمانية معايير مع اقتراحات تحسين.","#0E9F76"],
        analyzer:["📊","محلل نتائج الطلاب","ارفع ملف النتائج: مؤشرات الأسئلة والمهارات، مجموعات الاحتياج، تدخلات مقترحة، وتقرير مطبوع — داخل متصفحك.","#E8790A"] },
  learnH:"مركز المعرفة", learnP:"الثقافة بالذكاء الاصطناعي، توظيفه في التدريس، صناعة المنتجات، تحليل البيانات التعليمية، والذكاء الاصطناعي في STEM.", policy:"🛡️ سياسة الاستخدام والخصوصية", related:"مرتبط بهذا المحور",
  prodH:"معرض منتجات المعلمين", prodP:"منتجات صنعها زملاؤك وفريق المنصة — جرّبها مباشرة، واقرأ المشكلة التي تعالجها وكيف صُنعت وكيف تُستخدم، وقيّمها بمعايير تربوية.",
  pSearch:"ابحث بالعنوان أو المعلم أو الأداة…", fSubject:"المادة", fStage:"المرحلة", fType:"النوع", fTask:"الاستخدام", fSort:"الترتيب",
  allSubjects:"كل المواد", allStages:"كل المراحل", allTypes:"كل الأنواع", allTasks:"كل الاستخدامات",
  sort:{ new:"المضافة حديثاً", rating:"الأعلى تقييماً", views:"الأكثر استخداماً", likes:"الأكثر إعجاباً" },
  emptyAll:"لا توجد منتجات منشورة بعد", emptyAllP:"شارك أول منتج لك وألهم زملاءك.", emptyFilter:"لا توجد منتجات تطابق البحث",
  loadErr:"تعذّر تحميل المنتجات", track:"متابعة منتجي", featured:"⭐ مميز", verified:"✓ تم التحقق", team:"نموذج من المنصة",
  ctaH:"صنعت شيئاً مميزاً بالذكاء الاصطناعي؟", ctaP:"شاركه مع زملائك: المشكلة التي يعالجها، المنتج نفسه، كيف صنعته، كيف تستخدمه، وأثره على طلابك.",
  res:{ task:"مهمة", tool:"أداة", prod:"منتج", prompt:"برومبت", agent:"وكيل", lesson:"درس", topic:"معرفة" },
  star:{ k:"STAR OF THE MONTH", badge:"نجم الشهر", pill:"⭐ تعرّف على نجم الشهر", why:"لماذا استحق اللقب؟", project:"المشروع الفائز", try:"جرّب المشروع ←",
    hall:"🏆 لوحة الشرف", hallT:"لوحة الشرف — نجوم الأشهر السابقة", hallEmpty:"ستظهر هنا نجوم الأشهر السابقة.", quote:"كلمة النجم", congrats:"ألف مبروك! 🎉", open:"صفحة المشروع", cert:"شهادة نجم الشهر",
    tPill:"⭐ نجم الشهر… قد تكون أنت!", tK:"قد تكون أنت! ✨", tName:"المعلم … ؟", tRole:"مكانك هنا — نجم هذا الشهر لم يُعلن بعد", tProj:"مشروعك القادم",
    tWhy:"كيف تصبح نجم الشهر؟", tReason:"كل شهر نختار معلماً أو معلمة صنع منتجاً تعليمياً مميزاً بالذكاء الاصطناعي ونشره في معرض المنصة. يُعلن اسمه هنا أمام جميع الزملاء، ويحصل على «شهادة نجم الشهر» باسمه، ويُخلَّد في لوحة الشرف.",
    tPoints:"يعالج مشكلة تعلم حقيقية|جُرّب فعلياً مع الطلاب|يشرح طريقة صنعه ليستفيد الزملاء|قابل لإعادة الاستخدام في فصول أخرى", tCta:"شارك منتجك الآن", tCert:"شاهد نموذج الشهادة" },
  favsT:"مفضلتي", favsEmpty:"لم تحفظ شيئاً بعد. اضغط ♥ على أي برومبت أو أداة أو وكيل أو درس أو منتج.", favsNote:"المفضلة محفوظة على هذا الجهاز."
}});
Object.assign(A.I18N.en, { hub:Object.assign({}, A.I18N.ar.hub, {
  eyebrow:"For Dar Al-Thikr Schools teachers", h1:"Smart Teacher",
  lead:"From a teaching need to a solution: the right tool per task, ready agents, applied training with certificates, professional prompts, a prompt & data lab, and a showcase of colleagues' products.",
  askQ:"What do you want to do?", askPh:"Search tools, prompts, agents, lessons and products…", askGo:"Browse the guide",
  st:{ tools:"tools with criteria", prompts:"pro prompts", agents:"ready agents", lessons:"applied lessons", products:"showcase products" },
  guideH:"The right tool for every task", guideP:"Pick a task: a recommendation table (need → best tool → why → alternative), comparison cards, ready prompts and colleagues' products.",
  allTools:"All tools & comparison criteria", allToolsP:"Filter by use type, cost or Arabic support. Click “Details” for the full scorecard.",
  tf:{ all:"All", free:"Free / school account", arabic:"Great Arabic", easy:"Easy to use", students:"Student-facing" },
  recsH:"Recommendations", toolsFor:"Suggested tools", promptsFor:"Ready prompts", productsFor:"From your colleagues", noProdsFor:"No products for this task yet — be the first!",
  allTaskPrompts:"All prompts for this task", tip:"Tip", tryIt:"Try the tool", details:"Details", useFor:"Suggested for",
  need:"Need", best:"Best tool", why:"Why?", alt:"Alternative",
  agentsH:"AI agents", agentsP:"12 ready agents built on a 10-element template across three levels, agents made by our teachers, and how to build yours.",
  tabReady:"Ready agents (12)", tabOurs:"Our teachers' agents", tabGeneral:"General assistants", noAgents:"No teacher agents yet. Build yours and share it!",
  copyInst:"Copy instructions", tryChatGPT:"Try in ChatGPT", tryClaude:"Try in Claude", tryGemini:"Copy & open Gemini",
  tmplH:"Unified template to build your agent (10 elements)", tmplCopy:"Copy template", tmplLearn:"Learn to build an agent",
  trainH:"Applied training path", trainP:"Ten lessons, each with an outcome, explanation, example, guided practice, task, product, quiz and mastery criteria — plus three certificate levels.",
  promptsH:"Professional prompt library", openBuilder:"🧩 Build your own prompt", prSearch:"Search prompts…", fLevel:"Level", fTool:"Tool", allLevels:"All levels", allTools:"All tools", more:"Show more",
  labH:"Smart Teacher Lab", learnH:"Knowledge hub", policy:"🛡️ Usage & privacy policy", prodH:"Teachers' products showcase",
  pSearch:"Search by title, teacher or tool…", fSubject:"Subject", fStage:"Stage", fType:"Type", fTask:"Use", fSort:"Sort",
  allSubjects:"All subjects", allStages:"All stages", allTypes:"All types", allTasks:"All uses",
  sort:{ new:"Newest", rating:"Top rated", views:"Most used", likes:"Most liked" },
  emptyAll:"No published products yet", emptyFilter:"No products match your search", loadErr:"Couldn't load products", track:"Track my product",
  ctaH:"Made something great with AI?", favsT:"My favorites",
  star:{ k:"STAR OF THE MONTH", badge:"Star of the Month", pill:"⭐ Meet the Star of the Month", why:"Why this teacher?", project:"Winning project", try:"Try the project →",
    hall:"🏆 Hall of fame", hallT:"Hall of fame — previous stars", hallEmpty:"Previous months' stars will appear here.", quote:"In their words", congrats:"Congratulations! 🎉", open:"Project page", cert:"Star certificate",
    tPill:"⭐ Star of the Month… could be you!", tK:"Could be you! ✨", tName:"The teacher … ?", tRole:"Your place is here — this month's star hasn't been announced yet", tProj:"Your next project",
    tWhy:"How to become the Star of the Month?", tReason:"Every month we choose a teacher who built an outstanding AI-powered learning product and shared it in the showcase. Their name is announced here, they receive a personal Star of the Month certificate, and join the hall of fame.",
    tPoints:"Solves a real learning problem|Tried with real students|Explains how it was built|Reusable in other classes", tCta:"Share your product now", tCert:"See a sample certificate" }
})});

const S = { star: null, products: null, loadErr: '', useFilter:'', toolFilter:'all', agentTab:'ready', agentLvl:0,
  pr:{ task:'all', q:'', lvl:'', stage:'', tool:'', limit:12 },
  f:{ q:'', subject:'', stage:'', type:'', task:'', tool:'', level:'', sort:'new' } };
const L = o => A.L(o), LG = () => A.LANG();
const link = id => 'product.html?id=' + encodeURIComponent(id) + (A.DEMO ? '&demo=1' : '');

/* ------------------------- عناصر مشتركة ------------------------- */
const priceTag = p => '<span class="tag ' + p + '">' + esc(A.T('price.' + p)) + '</span>';
const arTag = a => '<span class="tag ' + a + '">' + esc(A.T('arLvl.' + a)) + '</span>';
const crit = (k, v) => D.criteria[k] && D.criteria[k][v] ? L(D.criteria[k][v]) : v;
function toolCard(tl, withTasks) {
  const tasks = withTasks ? D.tasks.filter(x => x.tools.indexOf(tl.id) >= 0).map(x => x.icon).join(' ') : '';
  return '<div class="tool"><div class="top"><span class="lg" style="--c:' + tl.color + '">' + esc(tl.mono) + '</span><div style="flex:1"><h4>' + esc(tl.name) + '</h4>' +
    (tasks ? '<small style="color:var(--soft);font-size:12px">' + esc(A.T('hub.useFor')) + ' ' + tasks + '</small>' : '') + '</div>' + A.fav.btn('tool:' + tl.id) + '</div>' +
    '<p>' + esc(L(tl.d)) + '</p><div class="bad-row">' + priceTag(tl.price) + arTag(tl.ar) + '<span class="tag">' + esc(crit('ease', tl.ease)) + '</span>' +
    (tl.stu === 'yes' ? '<span class="tag ok">👩‍🎓 ' + esc(A.T('hub.tf.students')) + '</span>' : '') + '</div>' +
    '<div style="display:flex;gap:6px;margin-top:auto"><a class="btn xs soft" href="' + A.safeUrl(tl.url) + '" target="_blank" rel="noopener">' + esc(A.T('hub.tryIt')) + ' ↗</a>' +
    '<button class="btn xs ghost" type="button" data-tool="' + tl.id + '">' + esc(A.T('hub.details')) + '</button></div></div>';
}
function openTool(id) {
  const t = A.MAP.tools[id]; if (!t) return;
  const c = k => esc(A.T('hub.crit.' + k));
  const uses = (t.uses || []).map(u => { const x = D.useTypes.find(y => y.id === u); return x ? x.icon + ' ' + L(x) : u; }).join('، ');
  const tasks = D.tasks.filter(x => x.tools.indexOf(id) >= 0);
  const recs = []; Object.keys(D.recs).forEach(k => D.recs[k].forEach(r => { if (r[1] === id || r[3] === id) recs.push([k, r]); }));
  A.modal('<div class="panel-h"><span style="--c:' + t.color + ';width:58px;height:58px;border-radius:18px;display:grid;place-items:center;color:#fff;font-family:Sora;font-weight:800;background:var(--c);flex:none">' + esc(t.mono) + '</span><div><h2>' + esc(t.name) + '</h2><p>' + esc(L(t.d)) + '</p></div></div>' +
    '<dl class="crit">' +
    '<dt>' + c('ar') + '</dt><dd>' + esc(A.T('arLvl.' + t.ar)) + '</dd><dt>' + c('ease') + '</dt><dd>' + esc(crit('ease', t.ease)) + '</dd>' +
    '<dt>' + c('price') + '</dt><dd>' + esc(A.T('price.' + t.price)) + '</dd><dt>' + c('files') + '</dt><dd>' + esc(t.files || '—') + '</dd>' +
    '<dt>' + c('gen') + '</dt><dd>' + esc(crit('yn', t.gen)) + '</dd><dt>' + c('stu') + '</dt><dd>' + esc(crit('yn', t.stu)) + '</dd>' +
    '<dt>' + c('exp') + '</dt><dd>' + esc(t.exp || '—') + '</dd><dt>' + c('best') + '</dt><dd>' + esc((t.best || []).map(b => crit('best', b)).join('، ')) + '</dd>' +
    '<dt>' + c('uses') + '</dt><dd>' + esc(uses) + '</dd><dt>' + c('priv') + '</dt><dd style="font-weight:500">' + esc(t.priv || '—') + '</dd>' +
    '<dt>' + c('tested') + '</dt><dd style="font-weight:500">' + esc(t.tested || A.T('hub.notTested')) + '</dd><dt>' + c('verified') + '</dt><dd>' + esc(t.verified) + '</dd>' +
    '<dt>' + c('site') + '</dt><dd><a href="' + esc(A.safeUrl(t.url)) + '" target="_blank" rel="noopener" style="color:var(--indigo)">' + esc(t.url) + ' ↗</a></dd></dl>' +
    (recs.length ? '<div class="sub-h">⭐ ' + esc(A.T('hub.recsH')) + '</div><div class="tablewrap"><table class="recs"><tr><th>' + esc(A.T('hub.need')) + '</th><th>' + esc(A.T('hub.best')) + '</th><th>' + esc(A.T('hub.alt')) + '</th></tr>' +
      recs.map(([k, r]) => '<tr><td>' + A.MAP.tasks[k].icon + ' ' + esc(r[0]) + '</td><td class="tl">' + esc(A.toolName(r[1])) + '</td><td>' + esc(A.toolName(r[3])) + '</td></tr>').join('') + '</table></div>' : '') +
    (tasks.length ? '<div class="chiplinks">' + tasks.map(x => '<button class="chip" type="button" data-task="' + x.id + '">' + x.icon + ' ' + esc(L(x.t)) + '</button>').join('') + '</div>' : '') +
    '<p class="note">' + esc(L(D.recsNote)) + '</p>', { wide:true });
}
const hl = text => esc(text).replace(/\[([^\]\n]{1,60})\]/g, '<mark>[$1]</mark>');
function promptCard(p, idx) {
  const task = A.MAP.tasks[p.task || (p.tasks || [])[0]];
  const key = idx != null ? 'prompt:' + idx : 'tprompt:' + p.id;
  const meta = idx != null ? '<div class="pmeta">' +
      '<span>' + esc(A.T('hub.toolsUse')) + '</span><b>' + esc((p.tools || []).map(A.toolName).join('، ')) + '</b>' +
      (p.inp ? '<span>' + esc(A.T('hub.inputs')) + '</span><b>' + esc(p.inp) + '</b>' : '') +
      (p.res ? '<span>' + esc(A.T('hub.outputs')) + '</span><b>' + esc(p.res) + '</b>' : '') +
      '<span>' + esc(A.T('hub.check')) + '</span><b style="font-weight:500">' + esc(D.promptChecks[p.task] || '') + '</b></div>' : '';
  return '<div class="pcard"><div class="ph"><div><b>' + esc(idx != null ? L(p.t) : p.title) + '</b><small>' + (task ? task.icon + ' ' + esc(L(task.t)) : '') +
    (idx != null ? ' · ' + esc(A.T('hub.platformPrompt')) : ' · ' + esc(A.T('hub.byTeacher')) + ' ' + esc(p.teacher)) + '</small></div>' +
    '<div style="display:flex;gap:4px;align-items:center;flex-wrap:wrap;justify-content:flex-end">' + (p.lvl ? '<span class="lvl ' + p.lvl + '">' + esc(L(D.levels[p.lvl])) + '</span>' : '') + (p.wf ? '<span class="lvl a">⛓ ' + esc(A.T('hub.wf')) + '</span>' : '') + A.fav.btn(key) + '</div></div>' +
    '<pre class="pbody">' + hl(idx != null ? L(p.p) : p.prompt) + '</pre>' + meta +
    '<div class="pf"><button class="btn xs grad" type="button" data-copy>' + esc(A.T('common.copy')) + '</button><button class="btn xs ghost" type="button" data-evalp>📏 ' + esc(A.T('hub.evalIt')) + '</button>' +
    (idx == null ? '<a class="btn xs soft" href="' + link(p.id) + '">' + esc(A.T('hub.openProd')) + '</a>' : '') + '</div></div>';
}
const GRADS = ['linear-gradient(135deg,#6D4BFF,#0EA5D6)','linear-gradient(135deg,#E63E7C,#6D4BFF)','linear-gradient(135deg,#0E9F76,#0EA5D6)','linear-gradient(135deg,#E8790A,#E63E7C)','linear-gradient(135deg,#4F46E5,#14B8A6)','linear-gradient(135deg,#8B5CF6,#EC4899)'];
function gradFor(id) { let h = 0; String(id).split('').forEach(c => { h = (h * 31 + c.charCodeAt(0)) >>> 0; }); return GRADS[h % GRADS.length]; }
function initials(n) { const w = String(n || '').replace(/[()]/g, '').trim().split(/\s+/); return (w[0] || '?').charAt(0) + (w[1] ? w[1].charAt(0) : ''); }
function ratingTxt(p) { return p.ratingCount ? '<span class="rating">★ ' + Math.round(p.ratingAvg) + '% <small style="color:var(--soft);font-weight:500">(' + p.ratingCount + ')</small></span>' : ''; }
function prodCard(p) {
  const ty = A.typeOf(p.type);
  const cover = p.coverId ? '<img src="' + esc(A.img(p.coverId, 700)) + '" alt="" loading="lazy" onerror="this.remove()">' : '<span class="ph">' + ty.icon + '</span><span class="ph-t">' + esc(p.title) + '</span>';
  return '<article class="prod"><a class="cover-link" href="' + link(p.id) + '" aria-label="' + esc(p.title) + '"></a>' +
    '<div class="cover" style="--g:' + gradFor(p.id) + '">' + cover + '<span class="type">' + ty.icon + ' ' + esc(ty[LG()]) + '</span>' +
    (p.featured ? '<span class="tag feat feat">' + esc(A.T('hub.featured')) + '</span>' : '') + '</div>' +
    '<div class="pb"><h3>' + esc(p.title) + '</h3><p>' + esc(p.summary) + '</p>' +
    '<div class="bad-row" style="display:flex;flex-wrap:wrap;gap:4px">' + (p.verified ? '<span class="verified">' + esc(A.T('hub.verified')) + '</span>' : '') + (p.teacher === TEAM ? '<span class="team">' + esc(A.T('hub.team')) + '</span>' : '') +
    '<span class="tag">' + esc(A.subjectName(p)) + '</span><span class="tag">' + esc(A.stageName(p.stage)) + '</span>' + (p.level && D.levels[p.level] ? '<span class="lvl ' + p.level + '">' + esc(L(D.levels[p.level])) + '</span>' : '') + '</div>' +
    '<div class="who"><span class="av">' + esc(initials(p.teacher)) + '</span>' + esc(p.teacher) + '</div></div>' +
    '<div class="pfoot" style="position:relative;z-index:2"><span>👁 ' + A.fmtNum(p.views) + '</span><span>♥ ' + A.fmtNum(p.likes) + '</span>' + ratingTxt(p) + '<span class="go">' + A.fav.btn('prod:' + p.id) + '</span></div></article>';
}

/* ------------------------- الهيرو والبحث الموحّد ------------------------- */
function renderHero() {
  $('#heroChips').innerHTML = D.tasks.slice(0, 6).map(x => '<button class="chip" type="button" data-task="' + x.id + '">' + x.icon + ' ' + esc(L(x.t)) + '</button>').join('');
  const st = [[D.tools.length,'tools'],[D.prompts.length,'prompts'],[D.agents.length,'agents'],[D.training.length,'lessons'],[S.products ? S.products.length : '—','products']];
  $('#stats').style.gridTemplateColumns = 'repeat(auto-fit,minmax(130px,1fr))';
  $('#stats').style.maxWidth = '960px';
  $('#stats').innerHTML = st.map(s => '<div class="stat"><b>' + (typeof s[0] === 'number' ? A.fmtNum(s[0]) : s[0]) + '</b><span>' + esc(A.T('hub.st.' + s[1])) + '</span></div>').join('');
}
function searchAll(q) {
  q = q.trim().toLowerCase(); if (!q) return [];
  const words = q.split(/\s+/).filter(w => w.length > 1);
  if (!words.length) return [];
  const hit = s => { s = String(s || '').toLowerCase(); return words.every(w => s.indexOf(w) >= 0); };
  const R = [];
  D.tasks.forEach(x => { if (hit(x.t.ar + ' ' + x.t.en + ' ' + x.d.ar)) R.push({ k:'task', id:x.id, t:x.icon + ' ' + L(x.t), s:L(x.d) }); });
  D.tools.forEach(x => { if (hit(x.name + ' ' + x.d.ar + ' ' + x.d.en)) R.push({ k:'tool', id:x.id, t:x.name, s:L(x.d) }); });
  D.agents.forEach(x => { if (hit(x.name.ar + ' ' + x.name.en + ' ' + x.spec + ' ' + x.task)) R.push({ k:'agent', id:x.id, t:x.icon + ' ' + L(x.name), s:x.task }); });
  D.training.forEach(x => { if (hit(x.t.ar + ' ' + x.d.ar + ' ' + x.outcome)) R.push({ k:'lesson', id:x.id, t:x.icon + ' ' + L(x.t), s:L(x.d) }); });
  D.hubs.forEach(h => h.topics.forEach(tp => { if (hit(tp[0] + ' ' + tp[1])) R.push({ k:'topic', id:h.id, t:h.icon + ' ' + tp[0], s:L(h.t) }); }));
  D.prompts.forEach((x, i) => { if (hit(x.t.ar + ' ' + x.p.ar + ' ' + (x.inp || ''))) R.push({ k:'prompt', id:i, t:'💬 ' + L(x.t), s:L(A.MAP.tasks[x.task].t) }); });
  (S.products || []).forEach(x => { if (hit(x.title + ' ' + x.summary + ' ' + x.teacher)) R.push({ k:'prod', id:x.id, t:A.typeOf(x.type).icon + ' ' + x.title, s:x.teacher }); });
  return R;
}
function askSearch() {
  const box = $('#askRes'), v = $('#askIn').value;
  if (!v.trim()) { box.classList.add('hidden'); return; }
  const res = searchAll(v), order = ['task','tool','agent','lesson','prompt','topic','prod'], groups = {};
  res.forEach(r => { (groups[r.k] = groups[r.k] || []).push(r); });
  let n = 0;
  box.innerHTML = res.length ? order.filter(k => groups[k]).map(k => '<div class="grp">' + esc(A.T('hub.res.' + k)) + ' (' + groups[k].length + ')</div>' +
    groups[k].slice(0, k === 'prompt' ? 5 : 4).map(r => '<button type="button" role="option" data-k="' + r.k + '" data-id="' + esc(r.id) + '"' + (n++ === 0 ? ' class="on"' : '') + '><span><b>' + esc(r.t) + '</b><br><small>' + esc(String(r.s).slice(0, 90)) + '</small></span></button>').join('')).join('')
    : '<div style="padding:12px;color:var(--muted)">' + esc(A.T('common.none')) + '</div>';
  box.classList.remove('hidden');
}
function go(k, id) {
  $('#askRes').classList.add('hidden');
  if (k === 'task') openTask(id);
  else if (k === 'tool') openTool(id);
  else if (k === 'agent') openAgent(id);
  else if (k === 'lesson') window.AI_TRAIN.openLesson(id);
  else if (k === 'topic') openHub(id);
  else if (k === 'prompt') openPrompt(+id);
  else if (k === 'prod') location.href = link(id);
}
function openPrompt(i) { const p = D.prompts[i]; if (!p) return; const m = A.modal('<div class="prompts" style="grid-template-columns:1fr">' + promptCard(p, i) + '</div>', { wide:true }); bindPromptActions(m.el); $('pre', m.el).style.maxHeight = 'none'; }

/* ------------------------- الدليل ------------------------- */
function renderTasks() {
  const counts = {};
  (S.products || []).forEach(p => (p.tasks || []).forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
  $('#tasks').innerHTML = D.tasks.map(x => '<button class="task" type="button" data-task="' + x.id + '" style="--c:' + x.color + '">' +
    (counts[x.id] ? '<span class="cnt">' + A.fmtNum(counts[x.id]) + ' 🧑‍🏫</span>' : '') +
    '<span class="ic">' + x.icon + '</span><h3>' + esc(L(x.t)) + '</h3><p>' + esc(L(x.d)) + '</p>' +
    '<span class="mini">' + x.tools.slice(0, 4).map(id => '<i>' + esc(A.toolName(id)) + '</i>').join('') + '<i>💬 ' + D.prompts.filter(p => p.task === x.id).length + '</i></span></button>').join('');
}
function renderTools() {
  $('#useFilters').innerHTML = '<button class="chip' + (!S.useFilter ? ' on' : '') + '" type="button" data-uf="">' + esc(A.T('common.all')) + '</button>' +
    D.useTypes.map(u => '<button class="chip' + (S.useFilter === u.id ? ' on' : '') + '" type="button" data-uf="' + u.id + '">' + u.icon + ' ' + esc(L(u)) + '</button>').join('');
  $('#toolFilters').innerHTML = ['all','free','arabic','easy','students'].map(k => '<button class="chip' + (S.toolFilter === k ? ' on' : '') + '" type="button" data-tf="' + k + '">' + esc(A.T('hub.tf.' + k)) + '</button>').join('');
  const f = S.toolFilter;
  const list = D.tools.filter(t => (!S.useFilter || (t.uses || []).indexOf(S.useFilter) >= 0) &&
    (f === 'all' || (f === 'free' && (t.price === 'free' || t.price === 'edu')) || (f === 'arabic' && t.ar === 'good') || (f === 'easy' && t.ease === 'easy') || (f === 'students' && t.stu === 'yes')));
  $('#toolsGrid').innerHTML = list.length ? list.map(t => toolCard(t, true)).join('') : '<div class="empty"><b>' + esc(A.T('common.none')) + '</b></div>';
}
function openTask(id) {
  const x = A.MAP.tasks[id]; if (!x) return;
  const recs = D.recs[id] || [];
  const prompts = D.prompts.map((p, i) => [p, i]).filter(([p]) => p.task === id);
  const tprompts = (S.products || []).filter(p => p.type === 'prompt' && (p.tasks || []).indexOf(id) >= 0 && p.prompt);
  const prods = (S.products || []).filter(p => (p.tasks || []).indexOf(id) >= 0);
  const html = '<div class="panel-h" style="--c:' + x.color + '"><span class="ic">' + x.icon + '</span><div><h2>' + esc(L(x.t)) + '</h2><p>' + esc(L(x.d)) + '</p></div></div>' +
    (recs.length ? '<div class="sub-h">⭐ ' + esc(A.T('hub.recsH')) + '</div><div class="tablewrap"><table class="recs"><tr><th>' + esc(A.T('hub.need')) + '</th><th>' + esc(A.T('hub.best')) + '</th><th>' + esc(A.T('hub.why')) + '</th><th>' + esc(A.T('hub.alt')) + '</th></tr>' +
      recs.map(r => '<tr><td>' + esc(r[0]) + '</td><td class="tl"><button class="more" type="button" data-tool="' + r[1] + '">' + esc(A.toolName(r[1])) + '</button></td><td>' + esc(r[2]) + '</td><td><button class="more" type="button" data-tool="' + r[3] + '">' + esc(A.toolName(r[3])) + '</button></td></tr>').join('') + '</table></div><p class="note">' + esc(L(D.recsNote)) + '</p>' : '') +
    '<div class="tipbox"><span>💡</span><span><b>' + esc(A.T('hub.tip')) + ':</b> ' + esc(L(x.tip)) + '</span></div>' +
    '<div class="sub-h">🧰 ' + esc(A.T('hub.toolsFor')) + '</div><div class="tools">' + x.tools.map(tid => toolCard(A.MAP.tools[tid])).join('') + '</div>' +
    '<div class="sub-h">💬 ' + esc(A.T('hub.promptsFor')) + ' <button class="btn xs soft" type="button" data-allpr="' + id + '">' + esc(A.T('hub.allTaskPrompts')) + ' (' + (prompts.length + tprompts.length) + ')</button> <button class="btn xs ghost" type="button" data-lab="builder" data-task-preset="' + id + '">🧩</button></div><div class="prompts">' +
      prompts.filter(([p]) => p.wf || p.lvl === 'a').concat(prompts.filter(([p]) => !(p.wf || p.lvl === 'a'))).slice(0, 4).map(([p, i]) => promptCard(p, i)).join('') + tprompts.slice(0, 2).map(p => promptCard(p)).join('') + '</div>' +
    '<div class="sub-h">🧑‍🏫 ' + esc(A.T('hub.productsFor')) + '</div>' +
    (prods.length ? '<div class="products">' + prods.slice(0, 6).map(prodCard).join('') + '</div>'
      : '<div class="empty"><b>' + esc(A.T('hub.noProdsFor')) + '</b><button class="btn grad sm" type="button" data-add>' + esc(A.T('nav.add')) + '</button></div>') +
    '<p class="note">' + esc(A.T('common.lastReview')) + '</p>';
  const m = A.modal(html, { wide:true });
  bindPromptActions(m.el);
  m.el.addEventListener('click', e => { const b = e.target.closest('[data-allpr]'); if (b) { m.close(); S.pr.task = b.dataset.allpr; S.pr.limit = 60; renderPrompts(); setTimeout(() => $('#prompts').scrollIntoView({ behavior:'smooth' }), 220); } });
}

/* ------------------------- الوكلاء ------------------------- */
function lvlName(l) { return D.agentLevels[l].ar.split(' — '); }
function agentCard(a) {
  return '<div class="agent"><div class="ah"><span class="ic">' + a.icon + '</span><div style="flex:1"><h4>' + esc(L(a.name)) + '</h4><span class="lvl l' + a.level + '">' + esc(lvlName(a.level)[0]) + ' · ' + esc(lvlName(a.level)[1]) + '</span></div>' + A.fav.btn('agent:' + a.id) + '</div>' +
    '<p style="font-size:14px;color:var(--muted)">' + esc(a.task) + '</p>' +
    '<div class="pmeta" style="padding:6px 0;border:0"><span>التخصص</span><b>' + esc(a.spec) + '</b><span>الجمهور</span><b>' + esc(a.audience) + '</b><span>المرحلة</span><b>' + esc(A.stageName(a.stage)) + '</b><span>يحتاج</span><b>' + esc(a.files) + '</b></div>' +
    '<div class="acts"><button class="btn xs grad" type="button" data-agent="' + a.id + '">' + esc(A.T('hub.details')) + '</button><button class="btn xs soft" type="button" data-cpagent="' + a.id + '">' + esc(A.T('hub.copyInst')) + '</button></div></div>';
}
function openAgent(id) {
  const a = D.agents.find(x => x.id === id); if (!a) return;
  const inst = D.agentInstructions(a);
  const m = A.modal('<div class="panel-h"><span class="ic" style="background:rgba(109,75,255,.1)">' + a.icon + '</span><div><h2>' + esc(L(a.name)) + '</h2><p><span class="lvl l' + a.level + '">' + esc(D.agentLevels[a.level].ar) + '</span> — ' + esc(D.agentLevels[a.level].d) + '</p></div></div>' +
    '<dl class="crit"><dt>التخصص</dt><dd>' + esc(a.spec) + '</dd><dt>المرحلة</dt><dd>' + esc(A.stageName(a.stage)) + '</dd><dt>الفئة المستهدفة</dt><dd>' + esc(a.audience) + '</dd><dt>المهمة</dt><dd>' + esc(a.task) + '</dd><dt>الملفات المطلوبة</dt><dd>' + esc(a.files) + '</dd><dt>شكل المخرجات</dt><dd>' + esc(a.output) + '</dd></dl>' +
    '<div class="sub-h">🧭 المهام التي ينفذها (منهجية العمل)</div><ol class="nice">' + a.method.map(s => '<li><span>' + esc(s) + '</span></li>').join('') + '</ol>' +
    '<div class="sub-h">🧪 مثال على مخرجاته</div><div class="examplebox">' + esc(a.example) + '</div>' +
    '<div class="sub-h">📋 التعليمات الكاملة (العناصر العشرة)</div><pre class="pbody" style="max-height:360px;border-radius:14px;border:1px solid var(--line)">' + esc(inst) + '</pre>' +
    '<div class="banner info" style="font-size:13.5px">' + esc(A.T('hub.agentNote')) + '</div>' +
    '<div class="f-foot" style="flex-wrap:wrap"><button class="btn sm grad" type="button" id="agCp">' + esc(A.T('hub.copyInst')) + '</button><span class="sp"></span>' +
    '<a class="btn sm ghost" target="_blank" rel="noopener" href="https://chatgpt.com/?q=' + encodeURIComponent(inst) + '">' + esc(A.T('hub.tryChatGPT')) + ' ↗</a>' +
    '<a class="btn sm ghost" target="_blank" rel="noopener" href="https://claude.ai/new?q=' + encodeURIComponent(inst) + '">' + esc(A.T('hub.tryClaude')) + ' ↗</a>' +
    '<button class="btn sm ghost" type="button" id="agGem">' + esc(A.T('hub.tryGemini')) + ' ↗</button></div>', { wide:true });
  $('#agCp', m.el).onclick = e => A.copy(inst, e.currentTarget);
  $('#agGem', m.el).onclick = e => { A.copy(inst, e.currentTarget); window.open('https://gemini.google.com/app', '_blank', 'noopener'); };
}
function renderAgents() {
  $$('#agentTabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === S.agentTab));
  const pane = $('#agentPane');
  if (S.agentTab === 'ready') {
    pane.innerHTML = '<div class="lvlbar">' + [1,2,3].map(l => '<div><b><span class="lvl l' + l + '">' + l + '</span> ' + esc(lvlName(l)[1]) + '</b>' + esc(D.agentLevels[l].d) + '</div>').join('') + '</div>' +
      '<div class="filters"><button class="chip' + (!S.agentLvl ? ' on' : '') + '" type="button" data-alvl="0">' + esc(A.T('common.all')) + '</button>' + [1,2,3].map(l => '<button class="chip' + (S.agentLvl === l ? ' on' : '') + '" type="button" data-alvl="' + l + '">' + esc(lvlName(l)[0]) + '</button>').join('') + '</div>' +
      '<div class="agents">' + D.agents.filter(a => !S.agentLvl || a.level === S.agentLvl).map(agentCard).join('') + '</div>' +
      '<p class="note">' + esc(A.T('hub.agentNote')) + '</p>';
    return;
  }
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
function renderTraining() { window.AI_TRAIN.renderGrid($('#trainGrid')); window.AI_TRAIN.renderProgress($('#trainProg')); window.AI_TRAIN.renderCerts($('#certs')); }

/* ------------------------- البرومبتات ------------------------- */
function renderPrompts() {
  const pr = S.pr;
  $('#promptFilters').innerHTML = '<button class="chip' + (pr.task === 'all' ? ' on' : '') + '" type="button" data-pt="all">' + esc(A.T('common.all')) + '</button>' +
    D.tasks.map(x => '<button class="chip' + (pr.task === x.id ? ' on' : '') + '" type="button" data-pt="' + x.id + '">' + x.icon + ' ' + esc(L(x.t)) + '</button>').join('');
  const opt = (id, all, list, val) => { $(id).innerHTML = '<option value="">' + esc(all) + '</option>' + list.map(x => '<option value="' + x[0] + '"' + (x[0] === val ? ' selected' : '') + '>' + esc(x[1]) + '</option>').join(''); };
  opt('#prLevel', A.T('hub.allLevels'), [['b', L(D.levels.b)], ['m', L(D.levels.m)], ['a', L(D.levels.a)], ['wf', '⛓ ' + A.T('hub.wf')]], pr.lvl);
  opt('#prStage', A.T('hub.allStages'), D.stages.filter(s => s.id !== 'all').map(s => [s.id, s[LG()]]), pr.stage);
  opt('#prTool', A.T('hub.allTools'), D.tools.map(t => [t.id, t.name]), pr.tool);
  const q = pr.q.trim().toLowerCase();
  const okP = p => (pr.task === 'all' || p.task === pr.task) && (!pr.lvl || (pr.lvl === 'wf' ? p.wf : p.lvl === pr.lvl)) &&
    (!pr.stage || p.stage === 'all' || p.stage === pr.stage) && (!pr.tool || (p.tools || []).indexOf(pr.tool) >= 0) &&
    (!q || (L(p.t) + ' ' + L(p.p) + ' ' + (p.inp || '')).toLowerCase().indexOf(q) >= 0);
  const list = D.prompts.map((p, i) => [p, i]).filter(([p]) => okP(p));
  const tlist = (S.products || []).filter(p => p.type === 'prompt' && p.prompt && (pr.task === 'all' || (p.tasks || []).indexOf(pr.task) >= 0) && !pr.lvl && !pr.tool &&
    (!pr.stage || p.stage === pr.stage || p.stage === 'all') && (!q || (p.title + ' ' + p.prompt).toLowerCase().indexOf(q) >= 0));
  const total = list.length + tlist.length;
  const cards = tlist.map(p => promptCard(p)).concat(list.map(([p, i]) => promptCard(p, i)));
  $('#promptGrid').innerHTML = cards.length ? cards.slice(0, pr.limit).join('') : '<div class="empty"><b>' + esc(A.T('common.none')) + '</b></div>';
  $('#prCount').textContent = A.T('hub.shown') + ' ' + Math.min(pr.limit, total) + ' / ' + total;
  $('#prMore').classList.toggle('hidden', total <= pr.limit);
}
function bindPromptActions(root) {
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-copy],[data-evalp]'); if (!b) return;
    const pre = b.closest('.pcard').querySelector('pre');
    if (b.hasAttribute('data-copy')) A.copy(pre.textContent, b); else window.AI_LAB.open('evaluator', pre.textContent);
  });
}

/* ------------------------- المختبر والمعرفة ------------------------- */
function renderLab() {
  const lab = A.T('hub.lab');
  $('#labGrid').innerHTML = Object.keys(lab).map(k => '<button class="labcard" type="button" data-lab="' + k + '" style="--c:' + lab[k][3] + '"><span class="ic">' + lab[k][0] + '</span><h3>' + esc(lab[k][1]) + '</h3><p>' + esc(lab[k][2]) + '</p></button>').join('');
}
function renderHubs() {
  $('#hubGrid').innerHTML = D.hubs.map(h => '<button class="hub" type="button" data-hub="' + h.id + '" style="--c:' + h.color + '"><span class="ic">' + h.icon + '</span><h3>' + esc(L(h.t)) + '</h3><p>' + esc(L(h.d)) + '</p><small style="color:var(--indigo);font-weight:700">' + h.topics.length + ' موضوعات ←</small></button>').join('');
}
function linkChip(l) {
  const [k, id] = l.split(':');
  if (k === 'training') { const x = D.training.find(t => t.id === id); return x ? '<button class="chip" type="button" data-train="' + id + '">🎓 ' + esc(L(x.t)) + '</button>' : ''; }
  if (k === 'agent') { const x = D.agents.find(t => t.id === id); return x ? '<button class="chip" type="button" data-agent="' + id + '">' + x.icon + ' ' + esc(L(x.name)) + '</button>' : ''; }
  if (k === 'lab') return '<button class="chip" type="button" data-lab="' + id + '">🧪 ' + esc(A.T('hub.lab')[id][1]) + '</button>';
  return '';
}
function openHub(id) {
  const h = D.hubs.find(x => x.id === id); if (!h) return;
  A.modal('<div class="panel-h" style="--c:' + h.color + '"><span class="ic">' + h.icon + '</span><div><h2>' + esc(L(h.t)) + '</h2><p>' + esc(L(h.d)) + '</p></div></div>' +
    h.topics.map(t => '<div class="topic"><h4>' + esc(t[0]) + '</h4><p>' + esc(t[1]) + '</p>' + (t[2] ? '<small>↳ ' + esc(t[2]) + '</small>' : '') + '</div>').join('') +
    (h.links && h.links.length ? '<div class="sub-h">🔗 ' + esc(A.T('hub.related')) + '</div><div class="chiplinks">' + h.links.map(linkChip).join('') + '</div>' : ''), { wide:true });
}
function openPolicy() {
  A.modal('<div class="f-title">🛡️ ' + esc(L(D.policy.t)) + '</div>' + D.policy.items.map(i => '<div class="topic"><h4>' + esc(i[0]) + '</h4><p>' + esc(i[1]) + '</p></div>').join(''), { wide:true });
}

/* ------------------------- المفضلة ------------------------- */
function openFavs() {
  const keys = A.fav.all();
  const rows = [];
  keys.forEach(k => {
    const i = k.indexOf(':'), t = k.slice(0, i), id = k.slice(i + 1);
    let r = null;
    if (t === 'prompt') { const p = D.prompts[+id]; if (p) r = ['prompt', '💬 ' + L(p.t), 'data-gok="prompt" data-goid="' + id + '"']; }
    else if (t === 'tool') { const x = A.MAP.tools[id]; if (x) r = ['tool', '🧰 ' + x.name, 'data-tool="' + id + '"']; }
    else if (t === 'agent') { const x = D.agents.find(a => a.id === id); if (x) r = ['agent', x.icon + ' ' + L(x.name), 'data-agent="' + id + '"']; }
    else if (t === 'lesson') { const x = D.training.find(a => a.id === id); if (x) r = ['lesson', x.icon + ' ' + L(x.t), 'data-train="' + id + '"']; }
    else if (t === 'prod' || t === 'tprompt') { const x = (S.products || []).find(p => p.id === id); r = ['prod', (x ? A.typeOf(x.type).icon + ' ' + x.title : '📦 #' + id), 'data-gok="prod" data-goid="' + esc(id) + '"']; }
    if (r) rows.push(r.concat([k]));
  });
  const m = A.modal('<div class="f-title">♥ ' + esc(A.T('hub.favsT')) + '</div>' +
    (rows.length ? '<div class="alist" style="margin-top:12px">' + rows.map(r => '<div class="arow" style="grid-template-columns:auto 1fr auto"><span class="tag">' + esc(A.T('hub.res.' + r[0])) + '</span><button class="more" style="text-align:start;font-size:15px" type="button" ' + r[2] + '>' + esc(r[1]) + '</button>' + A.fav.btn(r[3]) + '</div>').join('') + '</div>'
      : '<div class="empty" style="margin-top:12px">' + esc(A.T('hub.favsEmpty')) + '</div>') + '<p class="note">' + esc(A.T('hub.favsNote')) + '</p>', { wide:true });
  m.el.addEventListener('click', e => { const b = e.target.closest('[data-gok]'); if (b) { m.close(); go(b.dataset.gok, b.dataset.goid); } });
}

/* ------------------------- المعرض ------------------------- */
function fillSelects() {
  const sel = (id, all, list, val) => { $(id).innerHTML = '<option value="">' + esc(all) + '</option>' + list.map(x => '<option value="' + x.id + '"' + (x.id === val ? ' selected' : '') + '>' + esc(x.label) + '</option>').join(''); };
  sel('#fSubject', A.T('hub.allSubjects'), D.subjects.map(x => ({ id:x.id, label:x[LG()] })), S.f.subject);
  sel('#fStage', A.T('hub.allStages'), D.stages.map(x => ({ id:x.id, label:x[LG()] })), S.f.stage);
  sel('#fType', A.T('hub.allTypes'), D.types.map(x => ({ id:x.id, label:x.icon + ' ' + x[LG()] })), S.f.type);
  sel('#fTask', A.T('hub.allTasks'), D.tasks.map(x => ({ id:x.id, label:x.icon + ' ' + L(x.t) })), S.f.task);
  sel('#fTool', A.T('hub.allTools'), D.tools.map(x => ({ id:x.id, label:x.name })), S.f.tool);
  sel('#fLevel', A.T('hub.allLevels'), ['b','m','a'].map(k => ({ id:k, label:L(D.levels[k]) })), S.f.level);
  $('#fSort').innerHTML = ['new','rating','views','likes'].map(k => '<option value="' + k + '"' + (S.f.sort === k ? ' selected' : '') + '>' + esc(A.T('hub.sort.' + k)) + '</option>').join('');
}
function productsState(inAgents) {
  if (S.loadErr) return '<div class="empty"><b>' + esc(A.T('hub.loadErr')) + '</b>' + esc(S.loadErr) + '<br><button class="btn ghost sm" type="button" data-reload>' + esc(A.T('common.retry')) + '</button></div>';
  if (!A.CONFIGURED && !A.DEMO) return '<div class="empty"><b>' + esc(A.T('hub.emptyAll')) + '</b>' + esc(A.T('common.notConfigured')) + '<br><a class="btn ghost sm" href="?demo=1#products">' + esc(A.T('common.demoOpen')) + '</a></div>';
  return inAgents ? '<div class="products"><div class="skel"></div><div class="skel"></div><div class="skel"></div></div>' : '<div class="skel"></div><div class="skel"></div><div class="skel"></div>';
}
function renderProducts() {
  const g = $('#pGrid');
  if (!S.products) { g.innerHTML = productsState(); return; }
  const f = S.f, q = f.q.trim().toLowerCase();
  const list = S.products.filter(p => (!f.subject || p.subject === f.subject) && (!f.stage || p.stage === f.stage) && (!f.type || p.type === f.type) &&
    (!f.task || (p.tasks || []).indexOf(f.task) >= 0) && (!f.tool || (p.tools || []).indexOf(f.tool) >= 0) && (!f.level || p.level === f.level) &&
    (!q || [p.title, p.summary, p.teacher, A.subjectName(p), p.skill, (p.tools || []).map(A.toolName).join(' ')].join(' ').toLowerCase().indexOf(q) >= 0));
  const by = { new:(a, b) => String(b.createdAt).localeCompare(String(a.createdAt)), views:(a, b) => b.views - a.views, likes:(a, b) => b.likes - a.likes,
    rating:(a, b) => (b.ratingCount ? b.ratingAvg : -1) - (a.ratingCount ? a.ratingAvg : -1) }[f.sort];
  list.sort((a, b) => (f.sort === 'new' ? (b.featured ? 1 : 0) - (a.featured ? 1 : 0) : 0) || by(a, b));
  if (!S.products.length) g.innerHTML = '<div class="empty"><b>' + esc(A.T('hub.emptyAll')) + '</b>' + esc(A.T('hub.emptyAllP')) + '<br><button class="btn grad sm" type="button" data-add>' + esc(A.T('nav.add')) + '</button></div>';
  else g.innerHTML = list.length ? list.map(prodCard).join('') : '<div class="empty"><b>' + esc(A.T('hub.emptyFilter')) + '</b></div>';
}
async function loadProducts() {
  S.loadErr = '';
  if (!A.CONFIGURED && !A.DEMO) { S.products = null; renderAll(); return; }
  S.products = null; renderProducts(); renderAgents();
  try { const r = await A.call('list'); S.products = r.items || []; S.star = r.star || null; }
  catch (e) { S.loadErr = e.message; S.products = null; }
  renderAll();
}

/* ------------------------- ⭐ نجم الشهر ------------------------- */
function starAvatar(name) { return '<div class="star-av" aria-hidden="true"><span class="crown">👑</span><b>' + esc(initials(name)) + '</b></div>'; }
function starMeta(s) {
  const bits = [];
  if (s.subject) bits.push(A.subjectName(s));
  if (s.stage) bits.push(A.stageName(s.stage));
  return bits.join(' · ');
}
function monthNow() { try { return new Intl.DateTimeFormat(LG() === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-US', { month:'long', year:'numeric' }).format(new Date()); } catch (e) { return ''; } }
function renderStar() {
  const sec = $('#star'), box = $('#starBox'); if (!sec || !box) return;
  const st = S.star || { cur:null, hist:[] }, real = st.cur;
  // قبل إعلان أول نجم: يظهر القسم بصيغة تحفيزية «المعلم … قد تكون أنت!»
  const s = real || { teacher: A.T('hub.star.tName'), role: A.T('hub.star.tRole'), month: monthNow(), title: A.T('hub.star.tProj'),
    reason: A.T('hub.star.tReason'), points: A.T('hub.star.tPoints').split('|') };
  sec.classList.remove('hidden');
  let pill = $('#starPill');
  if (!pill) { pill = document.createElement('a'); pill.id = 'starPill'; pill.className = 'star-pill'; pill.href = '#star'; const h = $('#top .eyebrow'); if (h) h.insertAdjacentElement('afterend', pill); }
  pill.textContent = A.T(real ? 'hub.star.pill' : 'hub.star.tPill');
  const sparks = Array.from({ length: 14 }, (_, i) => '<i style="--x:' + ((i * 37) % 100) + '%;--y:' + ((i * 61) % 100) + '%;--d:' + (i % 7) * .45 + 's;--s:' + (8 + (i * 5) % 12) + 'px">✦</i>').join('');
  const hist = (st.hist || []).filter(Boolean);
  box.innerHTML = '<article class="star-card' + (real ? '' : ' teaser') + ' reveal in"><div class="star-sparks" aria-hidden="true">' + sparks + '</div>' +
    '<div class="star-in">' +
      '<div class="star-side">' + (real ? starAvatar(s.teacher) : '<div class="star-av" aria-hidden="true"><span class="crown">👑</span><b>؟</b></div>') +
        '<span class="star-ribbon">⭐ ' + esc(A.T('hub.star.badge')) + '</span>' +
        '<span class="star-month">' + esc(s.month) + '</span>' +
      '</div>' +
      '<div class="star-main">' +
        '<span class="star-k">' + esc(A.T('hub.star.k')) + ' · ' + esc(A.T(real ? 'hub.star.congrats' : 'hub.star.tK')) + '</span>' +
        '<h2 class="star-name" id="starName">' + esc(s.teacher) + '</h2>' +
        (s.role ? '<p class="star-role">' + esc(s.role) + '</p>' : '') +
        (s.title ? '<div class="star-proj"><span>🏅 ' + esc(A.T('hub.star.project')) + '</span><b>' + esc(s.title) + '</b>' + (real && starMeta(s) ? '<small>' + esc(starMeta(s)) + '</small>' : '') + '</div>' : '') +
        '<h3 class="star-h">' + esc(A.T(real ? 'hub.star.why' : 'hub.star.tWhy')) + '</h3><p class="star-reason">' + esc(s.reason).replace(/\n/g, '<br>') + '</p>' +
        ((s.points || []).length ? '<ul class="star-points">' + s.points.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') +
        (real && s.quote ? '<blockquote class="star-quote"><span>' + esc(A.T('hub.star.quote')) + '</span>«' + esc(s.quote) + '»</blockquote>' : '') +
        '<div class="star-acts">' +
          (real ? (s.productId ? '<a class="btn star-btn" href="' + esc(link(s.productId)) + '">' + esc(A.T('hub.star.try')) + '</a>' : '') +
              '<button class="btn star-ghost" type="button" id="starCert">🎖️ ' + esc(A.T('hub.star.cert')) + '</button>'
            : '<button class="btn star-btn" type="button" data-add>🚀 ' + esc(A.T('hub.star.tCta')) + '</button>' +
              '<button class="btn star-ghost" type="button" id="starCert">🎖️ ' + esc(A.T('hub.star.tCert')) + '</button>') +
          (hist.length ? '<button class="btn star-ghost" type="button" id="starHall">' + esc(A.T('hub.star.hall')) + ' (' + hist.length + ')</button>' : '') + '</div>' +
      '</div>' +
    '</div></article>';
  $('#starCert').onclick = () => A.starCert(s, { sample: !real });
  const hb = $('#starHall'); if (hb) hb.onclick = () => openHall(hist);
}
function openHall(hist) {
  const m = A.modal('<div class="f-title">' + esc(A.T('hub.star.hallT')) + '</div>' +
    (hist.length ? '<div class="hall">' + hist.map((h, i) => '<div class="hall-it">' + starAvatar(h.teacher) + '<div><span class="star-month sm">' + esc(h.month) + '</span><b>' + esc(h.teacher) + '</b>' +
      (h.role ? '<small>' + esc(h.role) + '</small>' : '') + (h.title ? '<p>🏅 ' + esc(h.title) + '</p>' : '') + '<p class="r">' + esc(h.reason) + '</p>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap">' + (h.productId ? '<a class="btn xs soft" href="' + esc(link(h.productId)) + '">' + esc(A.T('hub.star.open')) + ' ↗</a>' : '') +
      '<button class="btn xs soft" type="button" data-hcert="' + i + '">🎖️ ' + esc(A.T('hub.star.cert')) + '</button></div></div></div>').join('') + '</div>'
      : '<div class="empty"><b>' + esc(A.T('hub.star.hallEmpty')) + '</b></div>'), { wide: true });
  $$('[data-hcert]', m.el).forEach(b => b.onclick = () => A.starCert(hist[Number(b.dataset.hcert)]));
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
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(raf); if (!document.hidden) step(); });
}

/* ------------------------- التشغيل ------------------------- */
function renderAll() { renderHero(); renderStar(); renderTasks(); renderTools(); renderAgents(); renderTraining(); renderPrompts(); renderLab(); renderHubs(); fillSelects(); renderProducts();
  $('#tmplBody').textContent = L(D.agentTemplate); }

A.shell('hub');
A.applyLang();
A.onLang(() => renderAll());
window.AI_TRAIN.onChange(() => renderTraining());

document.addEventListener('click', e => {
  const b = e.target.closest('[data-task],[data-tf],[data-uf],[data-pt],[data-train],[data-open-train],[data-tab],[data-reload],[data-tool],[data-agent],[data-cpagent],[data-alvl],[data-lab],[data-hub],[data-cert],[data-favs],#askRes button');
  if (!b) return;
  if (b.closest('#askRes')) return go(b.dataset.k, b.dataset.id);
  const inModal = b.closest('.modal-back');
  const closeModal = () => { if (inModal) { const x = inModal.querySelector('.m-x'); if (x) x.click(); } };
  if (b.dataset.task) { closeModal(); openTask(b.dataset.task); }
  else if (b.dataset.tf) { S.toolFilter = b.dataset.tf; renderTools(); }
  else if (b.dataset.uf != null) { S.useFilter = b.dataset.uf; renderTools(); }
  else if (b.dataset.pt) { S.pr.task = b.dataset.pt; S.pr.limit = 12; renderPrompts(); }
  else if (b.dataset.train) { closeModal(); window.AI_TRAIN.openLesson(b.dataset.train); }
  else if (b.dataset.openTrain) window.AI_TRAIN.openLesson(b.dataset.openTrain);
  else if (b.dataset.cert) window.AI_TRAIN.openCert(b.dataset.cert);
  else if (b.dataset.tab) { S.agentTab = b.dataset.tab; renderAgents(); }
  else if (b.dataset.alvl != null) { S.agentLvl = +b.dataset.alvl; renderAgents(); }
  else if (b.dataset.tool) openTool(b.dataset.tool);
  else if (b.dataset.agent) { closeModal(); openAgent(b.dataset.agent); }
  else if (b.dataset.cpagent) { const a = D.agents.find(x => x.id === b.dataset.cpagent); A.copy(D.agentInstructions(a), b); }
  else if (b.dataset.lab) window.AI_LAB.open(b.dataset.lab, b.dataset.taskPreset ? { task:b.dataset.taskPreset } : undefined);
  else if (b.dataset.hub) openHub(b.dataset.hub);
  else if (b.hasAttribute('data-favs')) openFavs();
  else if (b.dataset.reload != null) loadProducts();
});
bindPromptActions($('#promptGrid'));
$('#cpTmpl').onclick = e => A.copy(L(D.agentTemplate), e.currentTarget);
$('#trackBtn').onclick = () => window.AI_FORM.track();
$('#policyBtn').onclick = openPolicy;
$('#prMore').onclick = () => { S.pr.limit += 12; renderPrompts(); };
$('#prSearch').addEventListener('input', e => { S.pr.q = e.target.value; S.pr.limit = 12; renderPrompts(); });
[['#prLevel','lvl'],['#prStage','stage'],['#prTool','tool']].forEach(([s, k]) => $(s).addEventListener('change', e => { S.pr[k] = e.target.value; S.pr.limit = 12; renderPrompts(); }));
const ai = $('#askIn');
ai.addEventListener('input', askSearch);
ai.addEventListener('focus', askSearch);
ai.addEventListener('keydown', e => {
  const items = $$('#askRes button'); if (!items.length) return;
  let i = items.findIndex(x => x.classList.contains('on'));
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (items[i]) items[i].classList.remove('on'); i = (i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length; items[i].classList.add('on'); items[i].scrollIntoView({ block:'nearest' }); }
  else if (e.key === 'Enter' && i >= 0) { e.preventDefault(); go(items[i].dataset.k, items[i].dataset.id); }
  else if (e.key === 'Escape') $('#askRes').classList.add('hidden');
});
document.addEventListener('click', e => { if (!e.target.closest('#ask')) $('#askRes').classList.add('hidden'); });
$('#pSearch').addEventListener('input', e => { S.f.q = e.target.value; renderProducts(); });
[['#fSubject','subject'],['#fStage','stage'],['#fType','type'],['#fTask','task'],['#fTool','tool'],['#fLevel','level'],['#fSort','sort']].forEach(([s, k]) => $(s).addEventListener('change', e => { S.f[k] = e.target.value; renderProducts(); }));

const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold:0, rootMargin:'0px 0px -40px 0px' }) : null;
$$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));
net();
renderAll();
loadProducts();
if (A.qs.get('add') === '1') setTimeout(() => window.AI_FORM.open(), 300);
if (A.qs.get('track')) setTimeout(() => window.AI_FORM.track({ id: A.qs.get('track') }), 300);
if (A.qs.get('lab')) setTimeout(() => window.AI_LAB.open(A.qs.get('lab')), 300);
})();
