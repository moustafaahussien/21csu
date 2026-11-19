/* =====================================================================
   منصة المعلم الذكي — نموذج إضافة/تعديل المنتج + متابعة المنتج بالكود
   ===================================================================== */
(function () {
'use strict';
const A = window.AI, D = A.D, esc = A.esc;

const TX = {
ar:{
  newT:"أضف منتجك للمعرض", editT:"تعديل المنتج", adminT:"تعديل المنتج (المدير)",
  sub:"شارك زملاءك فكرتك: المنتج نفسه + طريقة تنفيذه + طريقة استخدامه. يُنشر بعد مراجعة المشرف.",
  s1:"بياناتك", s2:"عن المنتج", s3:"المنتج نفسه", s4:"الشرح والنشر",
  teacher:"اسم المعلم/ة", email:"البريد الإلكتروني", emailH:"لا يظهر لأحد — يصلك عليه إشعار النشر",
  subject:"المادة", subjectOther:"اكتب اسم المادة", stage:"المرحلة", grades:"الصفوف", gradesPh:"مثال: الرابع والخامس",
  choose:"اختر…", title:"عنوان المنتج", titlePh:"مثال: لعبة تصنيف الكائنات الحية",
  type:"نوع المنتج", tasks:"يُستخدم في", tasksH:"اختر كل ما ينطبق", tools:"أدوات الذكاء الاصطناعي المستخدمة",
  toolsOther:"أدوات أخرى", toolsOtherPh:"اكتبها مفصولة بفاصلة", summary:"وصف مختصر", summaryH:"سطر أو سطران يظهران في بطاقة المنتج",
  idea:"الفكرة والمشكلة التي يحلها", ideaPh:"ما الذي دفعك لصناعته؟ وما الفرق الذي أحدثه مع طلابك؟",
  url:"رابط المنتج", urlLink:"رابط التطبيق أو الموقع (يبدأ بـ https://)", urlAgent:"رابط الوكيل (GPT / Gem / Claude …)",
  urlOpt:"رابط إضافي (اختياري)",
  app:"ملف التطبيق (.html)", appH:"ملف HTML واحد حتى 5 ميجابايت — سيعمل داخل المنصة مباشرة. للتطبيقات متعددة الملفات انشرها واختر «تطبيق برابط».",
  file:"الملف", fileH:"PDF أو Word أو PowerPoint أو Excel — حتى 10 ميجابايت",
  prompt:"نص البرومبت أو القالب", promptUsed:"البرومبت الذي استخدمته في صناعة المنتج", promptH:"أثمن ما تشاركه — ضعه كاملاً ليستفيد زملاؤك",
  drop:"اسحب الملف هنا أو اضغط للاختيار", replace:"استبدال", remove:"إزالة",
  cover:"صورة الغلاف", coverH:"اختياري — إن لم تضعها نصمم غلافاً تلقائياً", shots:"صور من المنتج", shotsH:"حتى 4 صور (لقطات شاشة، الطلاب أثناء الاستخدام بدون وجوه)",
  video:"فيديو شرح (يوتيوب)", videoPh:"https://youtube.com/…",
  build:"طريقة التنفيذ — كيف صنعته؟", buildH:"خطوات مرقمة: الأداة، البرومبت، التعديلات",
  use:"طريقة الاستخدام — كيف تستخدمه في الحصة؟", useH:"متى، كم دقيقة، فردي أم مجموعات",
  addStep:"＋ خطوة", stepPh:"اكتب الخطوة…", tips:"نصائح وملاحظات", tipsPh:"أخطاء تجنبها، تطوير مقترح…",
  agree:"أتعهد بأن المنتج من إعدادي، ولا يحتوي على بيانات شخصية للطلاب (أسماء، صور وجوه، درجات)، وأنني راجعت دقة محتواه، وأوافق على عرضه لمعلمي المدرسة.",
  submit:"إرسال للمراجعة", saveEdit:"حفظ التعديلات", uploading:"جارٍ رفع المنتج… لا تغلق النافذة",
  doneT:"تم استلام منتجك! 🎉", doneP:"سيظهر في المعرض بعد مراجعة المشرف. احتفظ بكود التعديل — تحتاجه لتعديل منتجك أو متابعة حالته:",
  doneId:"رقم المنتج", codeWarn:"⚠️ هذا الكود يظهر مرة واحدة فقط. انسخه أو صوّره الآن.", copyAll:"نسخ الرقم والكود",
  editDone:"تم حفظ التعديلات ✓", editDraft:"تم حفظ التعديلات — ستظهر للجميع بعد اعتماد المشرف، وتبقى النسخة الحالية ظاهرة حتى ذلك الحين.",
  editPending:"تم الحفظ — المنتج الآن بانتظار المراجعة.",
  err:{ required:"أكمل الحقول المطلوبة", tasks:"اختر استخداماً واحداً على الأقل", type:"اختر نوع المنتج", url:"ضع رابطاً صحيحاً يبدأ بـ https://",
    app:"ارفع ملف التطبيق (.html)", appExt:"الملف يجب أن يكون بصيغة .html", appSize:"ملف التطبيق أكبر من 5 ميجابايت",
    file:"ارفع الملف", fileType:"نوع الملف غير مدعوم — المسموح: PDF و Word و PowerPoint و Excel", fileSize:"الملف أكبر من 10 ميجابايت",
    prompt:"اكتب نص البرومبت", agree:"وافق على التعهد للإرسال", email:"البريد الإلكتروني غير صحيح", img:"تعذّر قراءة الصورة", video:"رابط الفيديو غير صحيح" },
  draftRestored:"استعدنا ما كتبته سابقاً ✓", clearDraft:"بدء من جديد",
  trackT:"متابعة منتجي", trackP:"أدخل رقم المنتج وكود التعديل الذي ظهر لك عند الإرسال.", trackId:"رقم المنتج", trackCode:"كود التعديل",
  trackGo:"دخول", status:{ pending:"بانتظار المراجعة", approved:"منشور", rejected:"يحتاج تعديلاً" }, adminNote:"ملاحظة المشرف",
  hasDraft:"لديك تعديلات بانتظار اعتماد المشرف", view:"عرض صفحة المنتج", editBtn:"تعديل المنتج", forgot:"نسيت الكود؟ تواصل مع مشرف المنصة ليصدر لك كوداً جديداً."
},
en:{
  newT:"Add your product to the showcase", editT:"Edit product", adminT:"Edit product (admin)",
  sub:"Share your idea with colleagues: the product itself + how you built it + how to use it. Published after the supervisor's review.",
  s1:"About you", s2:"About the product", s3:"The product", s4:"Guide & publish",
  teacher:"Teacher name", email:"Email", emailH:"Never shown — you'll get the publish notice here",
  subject:"Subject", subjectOther:"Subject name", stage:"Stage", grades:"Grades", gradesPh:"e.g. 4th and 5th",
  choose:"Choose…", title:"Product title", titlePh:"e.g. Living things sorting game",
  type:"Product type", tasks:"Used for", tasksH:"Pick all that apply", tools:"AI tools used",
  toolsOther:"Other tools", toolsOtherPh:"Comma separated", summary:"Short description", summaryH:"One or two lines shown on the product card",
  idea:"The idea & the problem it solves", ideaPh:"What made you build it? What difference did it make for your students?",
  url:"Product link", urlLink:"App or website link (starts with https://)", urlAgent:"Agent link (GPT / Gem / Claude …)",
  urlOpt:"Extra link (optional)",
  app:"App file (.html)", appH:"A single HTML file up to 5 MB — it runs right inside the platform. For multi-file apps, publish them and choose “App link”.",
  file:"File", fileH:"PDF, Word, PowerPoint or Excel — up to 10 MB",
  prompt:"Prompt or template text", promptUsed:"The prompt you used to make the product", promptH:"The most valuable thing you can share — include it in full",
  drop:"Drop the file here or click to choose", replace:"Replace", remove:"Remove",
  cover:"Cover image", coverH:"Optional — we'll design one automatically", shots:"Product images", shotsH:"Up to 4 images (screenshots, students using it without faces)",
  video:"Explainer video (YouTube)", videoPh:"https://youtube.com/…",
  build:"How it was built", buildH:"Numbered steps: tool, prompt, edits",
  use:"How to use it in class", useH:"When, how many minutes, individual or groups",
  addStep:"＋ Step", stepPh:"Write the step…", tips:"Tips & notes", tipsPh:"Pitfalls, suggested improvements…",
  agree:"I confirm the product is my own work, contains no personal student data (names, faces, grades), that I've checked its accuracy, and I agree to share it with the school's teachers.",
  submit:"Submit for review", saveEdit:"Save changes", uploading:"Uploading your product… keep this window open",
  doneT:"Your product was received! 🎉", doneP:"It will appear in the showcase after the supervisor's review. Keep your edit code — you need it to edit your product or check its status:",
  doneId:"Product ID", codeWarn:"⚠️ This code is shown only once. Copy it or take a screenshot now.", copyAll:"Copy ID and code",
  editDone:"Changes saved ✓", editDraft:"Changes saved — they'll go live after the supervisor approves; the current version stays visible until then.",
  editPending:"Saved — the product is now awaiting review.",
  err:{ required:"Complete the required fields", tasks:"Choose at least one use", type:"Choose the product type", url:"Enter a valid link starting with https://",
    app:"Upload the app file (.html)", appExt:"The file must be .html", appSize:"The app file is larger than 5 MB",
    file:"Upload the file", fileType:"Unsupported file type — allowed: PDF, Word, PowerPoint, Excel", fileSize:"The file is larger than 10 MB",
    prompt:"Write the prompt text", agree:"Accept the pledge to submit", email:"Invalid email", img:"Couldn't read the image", video:"Invalid video link" },
  draftRestored:"We restored what you typed earlier ✓", clearDraft:"Start over",
  trackT:"Track my product", trackP:"Enter the product ID and the edit code you received on submission.", trackId:"Product ID", trackCode:"Edit code",
  trackGo:"Enter", status:{ pending:"Awaiting review", approved:"Published", rejected:"Needs changes" }, adminNote:"Supervisor's note",
  hasDraft:"You have changes awaiting the supervisor's approval", view:"View product page", editBtn:"Edit product", forgot:"Forgot the code? Ask the platform supervisor to issue a new one."
}};
const t = k => k.split('.').reduce((o, x) => o == null ? o : o[x], TX[A.LANG()]);

const FILE_EXT = { pdf:'application/pdf', doc:'application/msword', docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt:'application/vnd.ms-powerpoint', pptx:'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xls:'application/vnd.ms-excel', xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };
const DRAFT_KEY = 'ai_submit_draft';
const TEXT_FIELDS = ['teacher','email','subject','subjectOther','stage','grades','title','type','summary','idea','url','prompt','video','tips'];

function blank() {
  return { teacher:'', email:'', subject:'', subjectOther:'', stage:'', grades:'', title:'', type:'', tasks:[], tools:[], toolsOther:'',
    summary:'', idea:'', url:'', prompt:'', video:'', buildSteps:['',''], useSteps:['',''], tips:'' };
}

function open(opts) {
  opts = opts || {};
  const mode = opts.mode || 'new';
  const S = { step: 0, d: blank(), files: { app:null, file:null, cover:null, removeCover:false, images:[] }, existing: {}, agree: mode !== 'new' };
  if (opts.item) {
    const it = opts.item;
    TEXT_FIELDS.forEach(k => { if (it[k] != null) S.d[k] = String(it[k]); });
    S.d.tasks = (it.tasks || []).slice();
    const known = (it.tools || []).filter(x => A.MAP.tools[x]); S.d.tools = known;
    S.d.toolsOther = (it.tools || []).filter(x => !A.MAP.tools[x]).join('، ');
    S.d.buildSteps = (it.buildSteps && it.buildSteps.length ? it.buildSteps : ['']).slice();
    S.d.useSteps = (it.useSteps && it.useSteps.length ? it.useSteps : ['']).slice();
    S.existing = { hasApp: !!it.hasApp, appFileName: it.appFileName || '', fileName: it.fileName || '', fileId: it.fileId || '', coverId: it.coverId || '' };
    S.files.images = (it.imageIds || []).map(id => ({ keep:id, src:A.img(id, 300) }));
  } else if (mode === 'new') {
    try { const dr = JSON.parse(A.LS.get(DRAFT_KEY) || 'null'); if (dr && dr.d) { Object.assign(S.d, dr.d); S.restored = true; } } catch (e) {}
  }
  const titleKey = mode === 'admin' ? 'adminT' : mode === 'teacher' ? 'editT' : 'newT';
  const M = A.modal('<div id="aiForm"></div>', { wide:true, sticky:true });
  const box = M.el.querySelector('#aiForm');
  const saveDraft = () => { if (mode === 'new') A.LS.set(DRAFT_KEY, JSON.stringify({ d: S.d, at: Date.now() })); };

  function head() {
    return '<div class="f-title">' + esc(t(titleKey)) + '</div>' +
      (S.step === 0 ? '<p class="f-sub">' + esc(t('sub')) + '</p>' : '') +
      '<div class="steps-bar">' + [0,1,2,3].map(i => '<i class="' + (i <= S.step ? 'on' : '') + '"></i>').join('') + '</div>' +
      '<div class="f-sub" style="font-weight:700;color:var(--indigo)">' + (S.step + 1) + ' / 4 — ' + esc(t('s' + (S.step + 1))) + '</div>' +
      (S.restored && S.step === 0 ? '<div class="banner info">' + esc(t('draftRestored')) + ' <button class="btn xs soft" type="button" data-act="clear">' + esc(t('clearDraft')) + '</button></div>' : '');
  }
  const fld = (label, inner, o) => '<div class="fld' + (o && o.full ? ' full' : '') + '"><label' + (o && o.for ? ' for="' + o.for + '"' : '') + '>' + esc(label) +
    (o && o.req ? ' <em>*</em>' : (o && o.opt ? ' <small>(' + esc(A.T('common.optional')) + ')</small>' : '')) + '</label>' + inner +
    (o && o.hint ? '<div class="hint">' + esc(o.hint) + '</div>' : '') + '</div>';
  const inp = (name, ph, type) => '<input class="inp" id="f_' + name + '" name="' + name + '" type="' + (type || 'text') + '" value="' + esc(S.d[name]) + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '>';
  const opts_ = (list, val) => '<option value="">' + esc(t('choose')) + '</option>' + list.map(x => '<option value="' + x.id + '"' + (x.id === val ? ' selected' : '') + '>' + esc(x[A.LANG()]) + '</option>').join('');

  function stepHtml() {
    const d = S.d, L = A.LANG();
    if (S.step === 0) return '<div class="fgrid">' +
      fld(t('teacher'), inp('teacher'), { req:1, for:'f_teacher' }) +
      fld(t('email'), inp('email', 'name@example.com', 'email'), { opt:1, for:'f_email', hint:t('emailH') }) +
      fld(t('subject'), '<select class="inp sel" id="f_subject" name="subject">' + opts_(D.subjects, d.subject) + '</select>', { req:1, for:'f_subject' }) +
      (d.subject === 'other' ? fld(t('subjectOther'), inp('subjectOther'), { req:1, for:'f_subjectOther' }) : '') +
      fld(t('stage'), '<select class="inp sel" id="f_stage" name="stage">' + opts_(D.stages, d.stage) + '</select>', { req:1, for:'f_stage' }) +
      fld(t('grades'), inp('grades', t('gradesPh')), { opt:1, for:'f_grades' }) + '</div>';
    if (S.step === 1) return '<div class="fgrid">' +
      fld(t('title'), inp('title', t('titlePh')), { req:1, full:1, for:'f_title' }) +
      '<div class="fld full"><div class="lbl">' + esc(t('type')) + ' <em>*</em></div><div class="pick typepick">' +
        D.types.map(x => '<label><input type="radio" name="type" value="' + x.id + '"' + (d.type === x.id ? ' checked' : '') + '><span><i>' + x.icon + '</i>' + esc(x[L]) + '</span></label>').join('') + '</div></div>' +
      '<div class="fld full"><div class="lbl">' + esc(t('tasks')) + ' <em>*</em> <small>— ' + esc(t('tasksH')) + '</small></div><div class="pick">' +
        D.tasks.map(x => '<label><input type="checkbox" name="tasks" value="' + x.id + '"' + (d.tasks.indexOf(x.id) >= 0 ? ' checked' : '') + '><span>' + x.icon + ' ' + esc(x.t[L]) + '</span></label>').join('') + '</div></div>' +
      '<div class="fld full"><div class="lbl">' + esc(t('tools')) + '</div><div class="pick">' +
        D.tools.map(x => '<label><input type="checkbox" name="tools" value="' + x.id + '"' + (d.tools.indexOf(x.id) >= 0 ? ' checked' : '') + '><span>' + esc(x.name) + '</span></label>').join('') + '</div></div>' +
      fld(t('toolsOther'), inp('toolsOther', t('toolsOtherPh')), { opt:1, full:1, for:'f_toolsOther' }) +
      fld(t('summary'), '<textarea class="inp" id="f_summary" name="summary" maxlength="300" style="min-height:70px">' + esc(d.summary) + '</textarea>', { req:1, full:1, for:'f_summary', hint:t('summaryH') }) +
      fld(t('idea'), '<textarea class="inp" id="f_idea" name="idea" maxlength="2000" placeholder="' + esc(t('ideaPh')) + '">' + esc(d.idea) + '</textarea>', { opt:1, full:1, for:'f_idea' }) +
      '</div>';
    if (S.step === 2) {
      let main = '';
      if (d.type === 'link' || d.type === 'agent') main = fld(d.type === 'agent' ? t('urlAgent') : t('urlLink'), inp('url', 'https://', 'url'), { req:1, full:1, for:'f_url' });
      else if (d.type === 'html') main = '<div class="fld full"><div class="lbl">' + esc(t('app')) + ' <em>*</em></div>' + fileBox('app', '.html,.htm,text/html') + '<div class="hint">' + esc(t('appH')) + '</div></div>' +
        fld(t('urlOpt'), inp('url', 'https://', 'url'), { full:1, for:'f_url' });
      else if (d.type === 'file') main = '<div class="fld full"><div class="lbl">' + esc(t('file')) + ' <em>*</em></div>' + fileBox('file', '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx') + '<div class="hint">' + esc(t('fileH')) + '</div></div>' +
        fld(t('urlOpt'), inp('url', 'https://', 'url'), { full:1, for:'f_url' });
      else if (d.type === 'prompt') main = fld(t('prompt'), '<textarea class="inp" id="f_prompt" name="prompt" maxlength="8000" style="min-height:200px;font-size:14px">' + esc(d.prompt) + '</textarea>', { req:1, full:1, for:'f_prompt' }) +
        fld(t('urlOpt'), inp('url', 'https://', 'url'), { full:1, for:'f_url' });
      return '<div class="fgrid">' + main +
        '<div class="fld"><div class="lbl">' + esc(t('cover')) + ' <small>(' + esc(A.T('common.optional')) + ')</small></div>' + coverBox() + '<div class="hint">' + esc(t('coverH')) + '</div></div>' +
        '<div class="fld"><div class="lbl">' + esc(t('shots')) + ' <small>(' + esc(A.T('common.optional')) + ')</small></div>' + imagesBox() + '<div class="hint">' + esc(t('shotsH')) + '</div></div>' +
        fld(t('video'), inp('video', t('videoPh'), 'url'), { opt:1, full:1, for:'f_video' }) + '</div>';
    }
    return '<div class="fgrid">' +
      stepList('buildSteps', t('build'), t('buildH')) +
      stepList('useSteps', t('use'), t('useH')) +
      (d.type !== 'prompt' ? fld(t('promptUsed'), '<textarea class="inp" id="f_prompt" name="prompt" maxlength="8000" style="min-height:110px;font-size:14px">' + esc(d.prompt) + '</textarea>', { opt:1, full:1, for:'f_prompt', hint:t('promptH') }) : '') +
      fld(t('tips'), '<textarea class="inp" id="f_tips" name="tips" maxlength="1500" placeholder="' + esc(t('tipsPh')) + '">' + esc(d.tips) + '</textarea>', { opt:1, full:1, for:'f_tips' }) +
      (mode === 'new' ? '<label class="agree full"><input type="checkbox" id="f_agree"' + (S.agree ? ' checked' : '') + '><span>' + esc(t('agree')) + '</span></label>' : '') +
      '</div>';
  }
  function fileBox(kind, accept) {
    const f = S.files[kind];
    const existingName = kind === 'app' ? (S.existing.hasApp ? (S.existing.appFileName || 'app.html') : '') : S.existing.fileName;
    const name = f ? f.name : existingName;
    return (name ? '<div class="filechip">' + (kind === 'app' ? '⚡' : '📎') + '<span>' + esc(name) + (f ? ' · ' + Math.ceil(f.size / 1024) + ' KB' : '') + '</span>' +
      '<label class="btn xs soft">' + esc(t('replace')) + '<input type="file" hidden data-file="' + kind + '" accept="' + accept + '"></label></div>'
      : '<label class="drop" data-drop="' + kind + '"><span style="font-size:30px">' + (kind === 'app' ? '⚡' : '📎') + '</span><b>' + esc(t('drop')) + '</b><input type="file" data-file="' + kind + '" accept="' + accept + '"></label>');
  }
  function coverBox() {
    const src = S.files.cover ? S.files.cover.b64 : (!S.files.removeCover && S.existing.coverId ? A.img(S.existing.coverId, 400) : '');
    if (src) return '<div class="thumbs"><div class="thumb" style="width:160px;height:90px"><img src="' + esc(src) + '" alt=""><button type="button" data-act="rmcover" aria-label="' + esc(t('remove')) + '">✕</button></div></div>';
    return '<label class="drop" data-drop="cover"><span style="font-size:26px">🖼️</span><b>' + esc(t('drop')) + '</b><input type="file" data-file="cover" accept="image/*"></label>';
  }
  function imagesBox() {
    const ims = S.files.images;
    return '<div class="thumbs">' + ims.map((im, i) => '<div class="thumb"><img src="' + esc(im.src) + '" alt=""><button type="button" data-rmimg="' + i + '" aria-label="' + esc(t('remove')) + '">✕</button></div>').join('') +
      (ims.length < 4 ? '<label class="thumb drop" style="padding:0;border-width:2px" data-drop="images"><span style="font-size:22px">＋</span><input type="file" data-file="images" accept="image/*" multiple></label>' : '') + '</div>';
  }
  function stepList(key, label, hint) {
    const arr = S.d[key];
    return '<div class="fld full"><div class="lbl">' + esc(label) + ' <small>— ' + esc(hint) + '</small></div><div class="steplist">' +
      arr.map((s, i) => '<div class="steprow"><textarea class="inp" data-steps="' + key + '" data-i="' + i + '" maxlength="600" placeholder="' + esc(t('stepPh')) + '">' + esc(s) + '</textarea>' +
        (arr.length > 1 ? '<button type="button" data-rmstep="' + key + '" data-i="' + i + '" aria-label="' + esc(t('remove')) + '">✕</button>' : '') + '</div>').join('') +
      '</div>' + (arr.length < 20 ? '<button class="btn xs soft" type="button" data-addstep="' + key + '" style="align-self:flex-start;margin-top:4px">' + esc(t('addStep')) + '</button>' : '') + '</div>';
  }
  function render(errMsg) {
    box.innerHTML = head() + stepHtml() +
      '<div class="f-foot">' + (S.step > 0 ? '<button class="btn ghost sm" type="button" data-act="prev">' + esc(A.T('common.prev')) + '</button>' : '<span></span>') +
      '<span class="f-err" role="alert">' + esc(errMsg || '') + '</span><span class="sp"></span>' +
      (S.step < 3 ? '<button class="btn grad" type="button" data-act="next">' + esc(A.T('common.next')) + '</button>'
        : '<button class="btn grad" type="button" data-act="send">' + esc(mode === 'new' ? t('submit') : t('saveEdit')) + '</button>') + '</div>';
  }

  /* ----- جمع القيم ----- */
  function collect() {
    A.$$('input.inp,select.inp,textarea.inp', box).forEach(el => { if (el.name && el.name in S.d && !el.dataset.steps) S.d[el.name] = el.value; });
    const tp = A.$('input[name="type"]:checked', box); if (tp) S.d.type = tp.value;
    if (A.$('input[name="tasks"]', box)) S.d.tasks = A.$$('input[name="tasks"]:checked', box).map(x => x.value);
    if (A.$('input[name="tools"]', box)) S.d.tools = A.$$('input[name="tools"]:checked', box).map(x => x.value);
    A.$$('[data-steps]', box).forEach(el => { S.d[el.dataset.steps][+el.dataset.i] = el.value; });
    const ag = A.$('#f_agree', box); if (ag) S.agree = ag.checked;
    saveDraft();
  }
  function mark(id) { const el = A.$('#' + id, box); if (el) { el.classList.add('err'); el.focus(); } }
  const isUrl = s => /^https?:\/\/[^\s]+$/i.test(String(s || '').trim());
  function validate() {
    const d = S.d;
    if (S.step === 0) {
      if (!d.teacher.trim()) { mark('f_teacher'); return t('err.required'); }
      if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) { mark('f_email'); return t('err.email'); }
      if (!d.subject) { mark('f_subject'); return t('err.required'); }
      if (d.subject === 'other' && !d.subjectOther.trim()) { mark('f_subjectOther'); return t('err.required'); }
      if (!d.stage) { mark('f_stage'); return t('err.required'); }
    }
    if (S.step === 1) {
      if (!d.title.trim()) { mark('f_title'); return t('err.required'); }
      if (!d.type) return t('err.type');
      if (!d.tasks.length) return t('err.tasks');
      if (!d.summary.trim()) { mark('f_summary'); return t('err.required'); }
    }
    if (S.step === 2) {
      if ((d.type === 'link' || d.type === 'agent') && !isUrl(d.url)) { mark('f_url'); return t('err.url'); }
      if (d.type !== 'link' && d.type !== 'agent' && d.url.trim() && !isUrl(d.url)) { mark('f_url'); return t('err.url'); }
      if (d.type === 'html' && !S.files.app && !S.existing.hasApp) return t('err.app');
      if (d.type === 'file' && !S.files.file && !S.existing.fileId) return t('err.file');
      if (d.type === 'prompt' && !d.prompt.trim()) { mark('f_prompt'); return t('err.prompt'); }
      if (d.video.trim() && !isUrl(d.video)) { mark('f_video'); return t('err.video'); }
    }
    if (S.step === 3 && mode === 'new' && !S.agree) return t('err.agree');
    return '';
  }

  /* ----- الملفات ----- */
  async function takeFile(kind, list) {
    const files = Array.from(list || []);
    if (!files.length) return;
    try {
      if (kind === 'app') {
        const f = files[0];
        if (!/\.html?$/i.test(f.name)) return render(t('err.appExt'));
        if (f.size > 5 * 1048576) return render(t('err.appSize'));
        S.files.app = { name: f.name, size: f.size, b64: await A.readAsDataURL(f) };
      } else if (kind === 'file') {
        const f = files[0], ext = (f.name.split('.').pop() || '').toLowerCase();
        const mime = FILE_EXT[ext];
        if (!mime) return render(t('err.fileType'));
        if (f.size > 10 * 1048576) return render(t('err.fileSize'));
        S.files.file = { name: f.name, size: f.size, mime, b64: await A.readAsDataURL(f) };
      } else if (kind === 'cover') {
        const b64 = await A.shrinkImage(files[0], 1400, 0.85);
        S.files.cover = { b64, mime:'image/jpeg' }; S.files.removeCover = false;
      } else if (kind === 'images') {
        for (const f of files) {
          if (S.files.images.length >= 4) break;
          if (!/^image\//.test(f.type)) continue;
          const b64 = await A.shrinkImage(f, 1600, 0.85);
          S.files.images.push({ b64, mime:'image/jpeg', src:b64 });
        }
      }
      render();
    } catch (e) { render(t('err.img')); }
  }

  box.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.file) { collect(); takeFile(el.dataset.file, el.files); return; }
    if (el.name === 'subject' || el.name === 'type') { collect(); render(); return; }
    if (el.classList) el.classList.remove('err');
    collect();
  });
  box.addEventListener('input', e => { if (e.target.classList.contains('err')) e.target.classList.remove('err'); });
  ['dragover','dragenter'].forEach(ev => box.addEventListener(ev, e => { const d = e.target.closest('[data-drop]'); if (d) { e.preventDefault(); d.classList.add('over'); } }));
  box.addEventListener('dragleave', e => { const d = e.target.closest('[data-drop]'); if (d) d.classList.remove('over'); });
  box.addEventListener('drop', e => { const d = e.target.closest('[data-drop]'); if (d) { e.preventDefault(); collect(); takeFile(d.dataset.drop, e.dataTransfer.files); } });
  box.addEventListener('click', async e => {
    const b = e.target.closest('button,[data-act]'); if (!b) return;
    if (b.dataset.addstep) { collect(); S.d[b.dataset.addstep].push(''); render(); const all = A.$$('[data-steps="' + b.dataset.addstep + '"]', box); all[all.length - 1].focus(); return; }
    if (b.dataset.rmstep) { collect(); S.d[b.dataset.rmstep].splice(+b.dataset.i, 1); render(); return; }
    if (b.dataset.rmimg != null) { collect(); S.files.images.splice(+b.dataset.rmimg, 1); render(); return; }
    const act = b.dataset.act;
    if (act === 'rmcover') { collect(); S.files.cover = null; S.files.removeCover = true; render(); return; }
    if (act === 'clear') { A.LS.del(DRAFT_KEY); S.d = blank(); S.restored = false; render(); return; }
    if (act === 'prev') { collect(); S.step--; render(); box.parentNode.scrollTop = 0; M.root.scrollTop = 0; return; }
    if (act === 'next') { collect(); const er = validate(); if (er) return render(er) || refocus(); S.step++; render(); M.root.scrollTop = 0; return; }
    if (act === 'send') { collect(); const er = validate(); if (er) return render(er); send(); }
  });
  function refocus() { const el = A.$('.inp.err', box); if (el) el.focus(); }

  function payload() {
    const d = S.d;
    const others = d.toolsOther.split(/[,،]/).map(s => s.trim()).filter(Boolean);
    const data = {
      teacher:d.teacher.trim(), email:d.email.trim(), subject:d.subject, subjectOther:d.subject === 'other' ? d.subjectOther.trim() : '',
      stage:d.stage, grades:d.grades.trim(), title:d.title.trim(), type:d.type, tasks:d.tasks, tools:d.tools.concat(others).slice(0, 12),
      summary:d.summary.trim(), idea:d.idea.trim(), url:d.url.trim(), prompt:d.prompt.trim(), video:d.video.trim(),
      buildSteps:d.buildSteps.map(s => s.trim()).filter(Boolean), useSteps:d.useSteps.map(s => s.trim()).filter(Boolean), tips:d.tips.trim()
    };
    const files = {};
    if (d.type === 'html' && S.files.app) files.app = { name:S.files.app.name, b64:S.files.app.b64 };
    if (d.type === 'file' && S.files.file) files.file = { name:S.files.file.name, mime:S.files.file.mime, b64:S.files.file.b64 };
    if (S.files.cover) files.cover = { b64:S.files.cover.b64, mime:'image/jpeg' };
    if (S.files.removeCover) files.removeCover = true;
    files.images = S.files.images.map(im => im.keep ? { keep:im.keep } : { b64:im.b64, mime:'image/jpeg' });
    return { data, files };
  }
  async function send() {
    const pl = payload();
    box.innerHTML = '<div class="progress-ring"><div class="spin"></div><b>' + esc(t('uploading')) + '</b></div>';
    try {
      let r;
      if (mode === 'new') r = await A.call('submit', { data:pl.data, files:pl.files, agree:true }, { timeout: 240000 });
      else if (mode === 'teacher') r = await A.call('teacherUpdate', { id:opts.id, code:opts.code, data:pl.data, files:pl.files }, { timeout: 240000 });
      else r = await A.call('adminUpdate', { id:opts.id, adminCode:opts.adminCode, data:pl.data, files:pl.files }, { timeout: 240000 });
      if (mode === 'new') {
        A.LS.del(DRAFT_KEY);
        const both = (A.LANG() === 'ar' ? 'رقم المنتج: ' : 'Product ID: ') + r.id + '\n' + (A.LANG() === 'ar' ? 'كود التعديل: ' : 'Edit code: ') + r.code;
        box.innerHTML = '<div class="success"><div class="big">🎉</div><h3>' + esc(t('doneT')) + '</h3><p>' + esc(t('doneP')) + '</p>' +
          '<div class="codebox"><div><small>' + esc(t('doneId')) + '</small><div style="font-family:Sora;font-weight:700;direction:ltr">' + esc(r.id) + '</div></div><b>' + esc(r.code) + '</b></div>' +
          '<div class="banner warn">' + esc(t('codeWarn')) + '</div>' +
          '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:10px"><button class="btn grad" type="button" id="cpBoth">' + esc(t('copyAll')) + '</button>' +
          '<a class="btn ghost" href="product.html?id=' + encodeURIComponent(r.id) + (A.DEMO ? '&demo=1' : '') + '">' + esc(t('view')) + '</a></div></div>';
        A.$('#cpBoth', box).onclick = ev => A.copy(both, ev.currentTarget);
        if (opts.onDone) opts.onDone(r);
      } else {
        A.toast(mode === 'teacher' ? (r.draft ? t('editDraft') : t('editPending')) : t('editDone'));
        M.close();
        if (opts.onDone) opts.onDone(r, opts.code);
      }
    } catch (e) { render(e.message); }
  }
  render();
}

/* ----- متابعة المنتج بالكود ----- */
function track(prefill) {
  prefill = prefill || {};
  const M = A.modal('<div id="trk"></div>');
  const box = M.el.querySelector('#trk');
  function form(err) {
    box.innerHTML = '<div class="f-title">' + esc(t('trackT')) + '</div><p class="f-sub">' + esc(t('trackP')) + '</p>' +
      '<div class="fgrid" style="margin-top:14px"><div class="fld"><label for="tk_id">' + esc(t('trackId')) + '</label><input class="inp" id="tk_id" dir="ltr" value="' + esc(prefill.id || '') + '" autocomplete="off"></div>' +
      '<div class="fld"><label for="tk_code">' + esc(t('trackCode')) + '</label><input class="inp" id="tk_code" dir="ltr" autocomplete="off" style="text-transform:uppercase;letter-spacing:.15em"' + (prefill.id ? ' autofocus' : '') + '></div></div>' +
      '<div class="f-foot"><span class="f-err" role="alert">' + esc(err || '') + '</span><span class="sp"></span><button class="btn grad" type="button" id="tk_go">' + esc(t('trackGo')) + '</button></div>' +
      '<p class="note">' + esc(t('forgot')) + '</p>';
    const go = async () => {
      const id = A.$('#tk_id', box).value.trim(), code = A.$('#tk_code', box).value.trim().toUpperCase();
      if (!id || !code) return form(t('err.required'));
      box.innerHTML = '<div class="progress-ring"><div class="spin"></div></div>';
      try { const r = await A.call('teacherGet', { id, code }); show(id, code, r); }
      catch (e) { prefill.id = id; form(e.message); }
    };
    A.$('#tk_go', box).onclick = go;
    A.$$('input', box).forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') go(); }));
  }
  function show(id, code, r) {
    const it = r.item;
    box.innerHTML = '<div class="f-title">' + esc(it.title) + '</div>' +
      '<p style="margin:10px 0"><span class="st ' + esc(it.status) + '">' + esc(t('status.' + it.status)) + '</span>' + (r.hasDraft ? ' <span class="st draft">' + esc(t('hasDraft')) + '</span>' : '') + '</p>' +
      (it.adminNote ? '<div class="banner ' + (it.status === 'rejected' ? 'bad' : 'info') + '"><b>' + esc(t('adminNote')) + ':</b> ' + A.nl2br(it.adminNote) + '</div>' : '') +
      '<div class="f-foot"><a class="btn ghost" href="product.html?id=' + encodeURIComponent(id) + (A.DEMO ? '&demo=1' : '') + '">' + esc(t('view')) + '</a><span class="sp"></span>' +
      '<button class="btn grad" type="button" id="tk_edit">' + esc(t('editBtn')) + '</button></div>';
    A.$('#tk_edit', box).onclick = () => { M.close(); open({ mode:'teacher', id, code, item: it, onDone: prefill.onDone }); };
  }
  form();
}

window.AI_FORM = { open, track, t };
})();
