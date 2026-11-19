/* =====================================================================
   منصة المعلم الذكي — المختبر: مولّد البرومبت • محسّن البرومبت • مقيّم البرومبت
   تعمل بالكامل داخل المتصفح بقواعد ثابتة (بدون خادم ولا اشتراك ذكاء اصطناعي).
   ===================================================================== */
(function () {
'use strict';
const A = window.AI, D = A.D, esc = A.esc, $ = A.$, $$ = A.$$;

/* قوالب كل مهمة: الدور، الفعل، المخرجات المقترحة، وإضافات خاصة */
const T = {
  quiz:{ role:'خبير في القياس والتقويم التربوي ومعلم [المادة]', verb:'أنشئ اختباراً', outs:['أسئلة مرقمة مع مفتاح إجابة','جدول مواصفات + أسئلة + مفتاح','جدول جاهز للاستيراد في Wayground/Kahoot'],
    extra:['نوّع بين الاختيار من متعدد والصح والخطأ والإكمال والمقالي القصير.','وزّع الأسئلة على مستويات بلوم واذكر المستوى بجانب كل سؤال.','اجعل البدائل الخاطئة معقولة ومبنية على أخطاء شائعة.'] },
  worksheet:{ role:'معلم [المادة] خبير في تصميم الأنشطة الصفية', verb:'صمم ورقة عمل', outs:['ورقة عمل بأقسام وتعليمات ومساحات إجابة','ورقة بثلاثة مستويات (دعم/أساسي/إثراء)','بطاقات مهام'],
    extra:['اكتب معايير النجاح بلغة الطالب في أعلى الورقة.','أضف مفتاح إجابة منفصلاً للمعلم.'] },
  slides:{ role:'مصمم تعليمي خبير في العروض التفاعلية', verb:'اكتب مخطط عرض تقديمي', outs:['مخطط شرائح (عنوان + نقاط + صورة مقترحة)','نص جاهز للصق في Gamma','عرض بنقاط توقف تفاعلية'],
    extra:['مفهوم واحد لكل شريحة، ولا تزيد النقطة عن 12 كلمة.','أضف سؤالاً تفاعلياً كل 3 شرائح وتقييماً سريعاً في النهاية.'] },
  lesson:{ role:'خبير في التخطيط التعليمي والتعلم النشط', verb:'اكتب خطة درس', outs:['جدول خطة (المرحلة، الزمن، دور المعلم، دور الطالب، التقويم)','خطة وفق نموذج 5E','خطة وفق التصميم العكسي'],
    extra:['اربط كل نشاط بناتج تعلم وأداة تقويم.','أضف تهيئة، نشاطاً تعاونياً، تمايزاً، وبطاقة خروج.'] },
  visuals:{ role:'مصمم تعليمي بصري', verb:'صمم تصوراً لوسيلة بصرية', outs:['وصف تفصيلي للتصميم','خريطة مفاهيم بعبارات ربط','نص إنفوجرافيك مقسم'],
    extra:['تأكد من صحة المصطلحات والعلاقات العلمية.','اجعل النص العربي قصيراً وواضحاً وغير مزدحم.'] },
  media:{ role:'كاتب سيناريو تعليمي', verb:'اكتب سيناريو', outs:['سيناريو بالمشاهد (صورة، تعليق، نص)','نص تعليق صوتي جاهز للتسجيل','كلمات أنشودة'],
    extra:['حدد مدة كل مشهد.','لا تضحِّ بالدقة العلمية من أجل الإيقاع أو الإثارة.'] },
  feedback:{ role:'معلم خبير في التقويم والتغذية الراجعة البنّاءة', verb:'أنشئ', outs:['Rubric بأوزان ومستويات','تغذية راجعة مرتبطة بكل معيار','قائمة رصد'],
    extra:['اكتب أوصافاً سلوكية قابلة للملاحظة لا أحكاماً عامة.','القرار النهائي للدرجة للمعلم.'] },
  differentiation:{ role:'خبير في التدريس المتمايز', verb:'أعد تصميم', outs:['ثلاث نسخ (دعم/أساسي/إثراء)','مسار تعلم فردي بمراحل','لوحة اختيار أنشطة'],
    extra:['حافظ على ناتج التعلم والمفاهيم نفسها في كل المستويات.','استخدم أسماء محايدة للمستويات لا تصم الطلاب.'] },
  interactive:{ role:'مطوّر تطبيقات تعليمية', verb:'ابنِ تطبيقاً تعليمياً تفاعلياً في ملف HTML واحد', outs:['ملف HTML واحد (HTML+CSS+JS)','لعبة بنقاط ومستويات','محاكاة بمتغيرات'],
    extra:['واجهة عربية RTL متجاوبة مع الجوال.','تغذية راجعة فورية مع تفسير، ولا تظهر الإجابة قبل محاولة الطالب.','المحتوى في مصفوفة في أعلى الكود ليسهل تعديله.','اكتب بعد الكود قائمة اختبار وظيفي من 8 نقاط.'] },
  research:{ role:'باحث تربوي دقيق', verb:'لخّص وحلّل', outs:['ملخص بنقاط مع أرقام الصفحات','جدول مقارنة مصادر','ملف معلومات للمعلم'],
    extra:['لا تضف معلومات من خارج المصدر.','اذكر الصفحة أو الفقرة لكل معلومة، ولا تخترع اقتباسات.'] },
  communication:{ role:'معلم ومحرر تربوي يكتب بلغة مهنية', verb:'اكتب', outs:['رسالة قصيرة','تقرير منظم بعناوين','محضر اجتماع'],
    extra:['لا تذكر بيانات طلاب آخرين ولا أحكاماً غير مدعومة.','حدد النبرة والطول.'] }
};
const STAGE_TXT = { lower:'الصفوف الأولية', upper:'الصفوف العليا في الابتدائية', middle:'المرحلة المتوسطة', secondary:'المرحلة الثانوية', american:'الدبلوم الأمريكي', all:'' };
const TOOL_TIP = {
  notebooklm:'ارفع المصادر (الكتاب أو الدرس) في NotebookLM أولاً، ثم الصق البرومبت في المحادثة.',
  gemini:'إذا كان المطلوب تطبيقاً أو نشاطاً تفاعلياً فعّل Canvas قبل الإرسال.',
  claude:'إذا كان المطلوب تطبيقاً سيظهر للتجربة مباشرة (Artifact)، وتستطيع تنزيله.',
  chatgpt:'إذا أرفقت ملفاً فاذكر اسمه في البرومبت.',
  gamma:'الصق المخطط الناتج في Gamma واختر «Paste in text».',
  canva:'استخدم النتيجة نصاً داخل قالب Canva.',
  magicschool:'اختر الأداة الأقرب في MagicSchool والصق التفاصيل في خاناتها.'
};

function field(id, label, html, hint) { return '<div class="fld"><label for="' + id + '">' + esc(label) + '</label>' + html + (hint ? '<div class="hint">' + esc(hint) + '</div>' : '') + '</div>'; }
function sel(id, items, val) { return '<select class="inp sel" id="' + id + '">' + items.map(x => '<option value="' + esc(x[0]) + '"' + (x[0] === val ? ' selected' : '') + '>' + esc(x[1]) + '</option>').join('') + '</select>'; }

/* ======================== 1) مولّد البرومبت ======================== */
function builder(preset) {
  preset = preset || {};
  const tasks = D.tasks.map(x => [x.id, x.icon + ' ' + A.L(x.t)]);
  const m = A.modal('<div class="f-title">🧩 مولّد البرومبت</div><p class="f-sub">اختر المواصفات، وستحصل على برومبت متكامل قابل للنسخ بالعناصر الخمسة (الدور • المهمة • السياق • القيود • شكل المخرجات).</p>' +
    '<div class="fgrid" style="margin-top:12px">' +
      field('b_task', '1) نوع المهمة', sel('b_task', tasks, preset.task || 'quiz')) +
      field('b_subject', '2) المادة', sel('b_subject', [['','—']].concat(D.subjects.map(s => [s.ar, s.ar])), '')) +
      field('b_grade', '3) الصف', '<input class="inp" id="b_grade" placeholder="مثال: الخامس الابتدائي">') +
      field('b_stage', 'المرحلة', sel('b_stage', D.stages.map(s => [s.id, s.ar]), 'upper')) +
      field('b_topic', '4) الدرس أو الموضوع', '<input class="inp" id="b_topic" placeholder="مثال: جمع الكسور مختلفة المقامات">') +
      field('b_goal', '5) الهدف / ناتج التعلم', '<input class="inp" id="b_goal" placeholder="مثال: يجمع الطالب كسرين مختلفي المقام">') +
      field('b_level', '6) مستوى التعقيد', sel('b_level', [['b','مبتدئ — مهمة مباشرة'],['m','متوسط — مهمة مع سياق ومعايير'],['a','متقدم — سير عمل متعدد المراحل']], 'm')) +
      field('b_out', '7) شكل المخرجات', '<select class="inp sel" id="b_out"></select>') +
      field('b_count', 'العدد (اختياري)', '<input class="inp" id="b_count" type="number" min="1" max="100" placeholder="مثال: 10">') +
      field('b_tool', '8) الأداة التي ستستخدمها', sel('b_tool', [['','أي أداة']].concat(D.tools.map(t => [t.id, t.name])), '')) +
      '<div class="fld full"><div class="lbl">إضافات</div><div class="pick">' +
        [['saudi','أمثلة من البيئة السعودية'],['diff','تمايز للمستويات'],['key','مفتاح إجابة / نسخة للمعلم'],['check','مراجعة ذاتية قبل الإخراج'],['simple','لغة مبسطة للطالب']]
          .map(o => '<label><input type="checkbox" name="b_x" value="' + o[0] + '"' + (o[0] !== 'simple' ? ' checked' : '') + '><span>' + esc(o[1]) + '</span></label>').join('') + '</div></div>' +
    '</div><div class="f-foot"><span class="sp"></span><button class="btn grad" type="button" id="b_go">⚡ إنشاء البرومبت</button></div><div id="b_res"></div>', { wide:true });
  const el = m.el;
  const fillOuts = () => { const t = T[$('#b_task', el).value]; $('#b_out', el).innerHTML = t.outs.map(o => '<option>' + esc(o) + '</option>').join(''); };
  $('#b_task', el).onchange = fillOuts; fillOuts();
  $('#b_go', el).onclick = () => {
    const v = id => $('#' + id, el).value.trim();
    const task = v('b_task'), t = T[task], lvl = v('b_level'), xs = $$('input[name="b_x"]:checked', el).map(i => i.value);
    const subj = v('b_subject') || '[المادة]', grade = v('b_grade') || ('[الصف]' + (STAGE_TXT[v('b_stage')] ? ' — ' + STAGE_TXT[v('b_stage')] : ''));
    const topic = v('b_topic') || '[الدرس أو الموضوع]', goal = v('b_goal'), cnt = v('b_count');
    const L = [];
    L.push('أنت ' + t.role.replace('[المادة]', subj) + '.');
    L.push(t.verb + (cnt ? ' (' + cnt + ' عناصر)' : '') + ' حول «' + topic + '» لطلاب ' + grade + ' في مادة ' + subj + '.');
    if (goal) L.push('ناتج التعلم المستهدف: ' + goal + '.');
    if (lvl !== 'b') {
      L.push('\nالسياق: الطلاب بمستويات متفاوتة' + (xs.indexOf('saudi') >= 0 ? '، واستخدم أمثلة من الحياة اليومية في المجتمع السعودي' : '') + '.');
      L.push('\nالمتطلبات:');
      t.extra.forEach(e => L.push('- ' + e));
      if (xs.indexOf('diff') >= 0) L.push('- قدّم ثلاثة مستويات (دعم – أساسي – إثراء) لنفس الناتج.');
      if (xs.indexOf('simple') >= 0) L.push('- استخدم لغة عربية فصيحة مبسطة تناسب عمر الطلاب.');
    }
    if (lvl === 'a') {
      L.push('\nنفّذ العمل على مراحل، واعرض نتيجة كل مرحلة بعنوان:');
      L.push('1) التحليل: حلّل المحتوى ونواتج التعلم.\n2) التخطيط: ضع خطة/جدولاً قبل الإنتاج (وتوقف لأراجعه).\n3) الإنتاج: أنشئ المطلوب وفق الخطة.\n4) المراجعة: تحقق من الدقة والارتباط بالناتج ومناسبة المستوى، واعرض نتيجة المراجعة.\n5) الإخراج: النسخة النهائية.');
    }
    L.push('\nشكل المخرجات: ' + v('b_out') + '.');
    if (xs.indexOf('key') >= 0) L.push('أضف مفتاح إجابة أو نسخة منفصلة للمعلم.');
    L.push('\nالقيود: لا تضف معلومات غير دقيقة، وإذا لم تكن متأكداً فاذكر ذلك صراحة. لا تستخدم أي بيانات شخصية للطلاب.');
    if (xs.indexOf('check') >= 0) L.push('قبل الإخراج راجع عملك وفق: ' + (D.promptChecks[task] || 'الدقة والوضوح') + '.');
    const prompt = L.join('\n');
    const tool = v('b_tool');
    $('#b_res', el).innerHTML = '<div class="pcard" style="margin-top:14px"><div class="ph"><b>✅ البرومبت الجاهز</b><div style="display:flex;gap:6px"><button class="btn xs ghost" type="button" id="b_eval">📏 قيّمه</button><button class="btn xs grad" type="button" id="b_cp">نسخ</button></div></div>' +
      '<pre class="pbody" style="max-height:420px">' + esc(prompt).replace(/\[([^\]\n]{1,40})\]/g, '<mark>[$1]</mark>') + '</pre>' +
      (tool && TOOL_TIP[tool] ? '<div class="pf">💡 ' + esc(TOOL_TIP[tool]) + '</div>' : '') + '</div>' +
      (/\[/.test(prompt) ? '<p class="note">الكلمات الملونة بين [ ] لم تعبئها — استبدلها ببياناتك قبل الإرسال.</p>' : '');
    $('#b_cp', el).onclick = e => A.copy(prompt, e.currentTarget);
    $('#b_eval', el).onclick = () => evaluator(prompt);
    $('#b_res', el).scrollIntoView({ behavior:'smooth', block:'nearest' });
  };
}

/* ======================== 2) محسّن البرومبت ======================== */
const TASK_KEYS = [
  ['quiz',['اختبار','أسئلة','سؤال','كويز','quiz','بنك']], ['worksheet',['ورقة عمل','نشاط','أنشطة','تمارين','بطاقات']],
  ['slides',['عرض','شرائح','بوربوينت','باوربوينت','presentation']], ['lesson',['خطة','تحضير','درس كامل','وحدة']],
  ['visuals',['صورة','رسم','إنفوجرافيك','ملصق','خريطة مفاهيم','منظم']], ['media',['فيديو','صوت','بودكاست','أنشودة','قصة صوتية','سيناريو']],
  ['feedback',['تصحيح','تغذية راجعة','روبريك','rubric','معيار تقييم','قيّم']], ['differentiation',['تبسيط','بسّط','مستويات','متعثر','موهوب','تمايز']],
  ['interactive',['لعبة','تطبيق','محاكاة','تفاعلي','html']], ['research',['لخص','لخّص','ملخص','بحث','مصادر','تلخيص']],
  ['communication',['رسالة','ولي أمر','تقرير','محضر','إعلان','خطاب']]
];
function detectTask(s) {
  let best = 'worksheet', n = 0;
  TASK_KEYS.forEach(([id, ks]) => { const c = ks.filter(k => s.toLowerCase().indexOf(k) >= 0).length; if (c > n) { n = c; best = id; } });
  return best;
}
function optimizer(start) {
  const m = A.modal('<div class="f-title">✨ محسّن البرومبت</div><p class="f-sub">الصق طلباً بسيطاً (مثل: «اعمل لي ورقة عمل عن الخلية»)، وسنحوّله إلى برومبت احترافي ونوضح ما الذي تحسّن ولماذا.</p>' +
    '<div class="fld" style="margin-top:12px"><textarea class="inp" id="o_in" style="min-height:90px" placeholder="اكتب أو الصق البرومبت هنا…">' + esc(start || '') + '</textarea></div>' +
    '<div class="f-foot"><span class="sp"></span><button class="btn grad" type="button" id="o_go">✨ حسّن البرومبت</button></div><div id="o_res"></div>', { wide:true });
  const el = m.el;
  $('#o_go', el).onclick = () => {
    const raw = $('#o_in', el).value.trim();
    if (!raw) return A.toast('اكتب البرومبت أولاً', true);
    const task = detectTask(raw), t = T[task], why = [];
    const subj = D.subjects.find(s => raw.indexOf(s.ar.split(' ')[0].replace('ال', '')) >= 0 && s.id !== 'other');
    const gradeM = raw.match(/(?:الصف|للصف|صف)\s+([^\s،,.]+(?:\s+(?:الابتدائي|المتوسط|الثانوي))?)/);
    const numM = raw.match(/(\d{1,3})\s*(?:سؤال|أسئلة|نشاط|أنشطة|شريحة|شرائح|بطاقة|بطاقات)/);
    const topicM = raw.match(/(?:عن|حول|لدرس|درس|في موضوع)\s+(.{2,60}?)(?:[.،,؟?]|\s+(?:للصف|لطلاب|مع|بحيث)|$)/);
    const L = [];
    if (!/(أنت|بصفتك|كخبير|تصرف ك)/.test(raw)) { L.push('أنت ' + t.role.replace('[المادة]', subj ? subj.ar : '[المادة]') + '.'); why.push(['الدور','أضفنا دوراً مهنياً محدداً — يجعل الأداة تستخدم لغة ومعايير المختص.']); }
    L.push(t.verb + (numM ? ' من ' + numM[1] + ' عناصر' : ' [العدد]') + ' حول «' + (topicM ? topicM[1].trim() : '[الموضوع]') + '» لطلاب ' + (gradeM ? 'الصف ' + gradeM[1] : '[الصف]') + (subj ? ' في مادة ' + subj.ar : ' في مادة [المادة]') + '.');
    why.push(['المهمة','صغنا المهمة بفعل واضح وموضوع محدد' + (numM ? '' : '، وأضفنا خانة للعدد') + '.']);
    if (!gradeM) why.push(['المرحلة','لم تحدد الصف — أضفنا [الصف] لتعبئته؛ مستوى اللغة والصعوبة يعتمد عليه.']);
    L.push('ناتج التعلم المستهدف: [اكتب الهدف].'); why.push(['الهدف التعليمي','أضفنا ناتج التعلم — بدونه تكون النتيجة عامة.']);
    L.push('\nالمتطلبات:'); t.extra.forEach(e => L.push('- ' + e));
    L.push('- راعِ اختلاف مستويات الطلاب، واستخدم أمثلة من البيئة السعودية.');
    why.push(['السياق والقيود','أضفنا متطلبات تربوية خاصة بهذا النوع من المهام، ومراعاة الفروق والبيئة المحلية.']);
    L.push('\nشكل المخرجات: ' + t.outs[0] + '.'); why.push(['شكل المخرجات','حددنا شكل النتيجة ليسهل استخدامها مباشرة.']);
    L.push('قبل الإخراج راجع: ' + (D.promptChecks[task] || 'الدقة والوضوح') + '. وإذا لم تكن متأكداً من معلومة فاذكر ذلك.');
    why.push(['معايير الجودة','أضفنا مراجعة ذاتية قبل الإخراج — تقلل الأخطاء والهلوسة.']);
    const better = L.join('\n');
    $('#o_res', el).innerHTML = '<div class="diffbox" style="margin-top:14px"><div><div class="sub-h" style="margin-top:0">البرومبت الأصلي</div><pre class="pbody">' + esc(raw) + '</pre></div>' +
      '<div><div class="sub-h" style="margin-top:0">البرومبت المحسّن <button class="btn xs grad" type="button" id="o_cp">نسخ</button></div><pre class="pbody">' + esc(better).replace(/\[([^\]\n]{1,40})\]/g, '<mark>[$1]</mark>') + '</pre></div></div>' +
      '<div class="sub-h">ما الذي تحسّن ولماذا؟</div><div class="tablewrap"><table class="recs"><tr><th>العنصر</th><th>التحسين</th></tr>' + why.map(w => '<tr><td class="tl">' + esc(w[0]) + '</td><td>' + esc(w[1]) + '</td></tr>').join('') + '</table></div>' +
      '<p class="note">نوع المهمة المكتشف: ' + esc(A.L(A.MAP.tasks[task].t)) + ' — التحسين آلي بقواعد ثابتة؛ راجع النتيجة وعدّل ما بين [ ].</p>' +
      '<div class="f-foot"><span class="sp"></span><button class="btn ghost sm" type="button" id="o_eval">📏 قيّم البرومبت المحسّن</button></div>';
    $('#o_cp', el).onclick = e => A.copy(better, e.currentTarget);
    $('#o_eval', el).onclick = () => evaluator(better);
  };
  if (start) $('#o_go', el).click();
}

/* ======================== 3) مقيّم البرومبت ======================== */
const CRIT = [
  ['وضوح الدور', s => /(أنت|بصفتك|تصرّف|تصرف ك|كخبير)/.test(s) ? (/(خبير|متخصص|معلم|مصمم|باحث)/.test(s) ? 10 : 6) : 0, 'ابدأ بـ «أنت معلم/خبير…» مع التخصص.'],
  ['وضوح المهمة', s => { const v = (s.match(/(أنشئ|صمم|اكتب|حلل|حلّل|لخص|لخّص|حوّل|ابن|ابنِ|قيّم|قيم|راجع|أعد|اقترح|استخرج)/g) || []).length; return v >= 2 ? 10 : v === 1 ? 7 : 2; }, 'استخدم فعلاً واضحاً: أنشئ، صمم، حلّل…'],
  ['كفاية السياق', s => { let n = 0; [/(الصف|صف)/, /(مادة|المادة|درس|الدرس|وحدة|موضوع)/, /(طلاب|الطلاب|مستوى|مستويات|فصل)/].forEach(r => { if (r.test(s)) n++; }); return [0, 4, 7, 10][n]; }, 'اذكر الصف، المادة/الدرس، وطبيعة الطلاب.'],
  ['تحديد القيود', s => { const v = (s.match(/(لا |تجنب|بدون|لا يزيد|على الأكثر|فقط|حد|لا تضف|دون)/g) || []).length; return v >= 3 ? 10 : v === 2 ? 7 : v === 1 ? 4 : 0; }, 'أضف قيوداً: الطول، ما يجب تجنبه، حدود المصادر.'],
  ['شكل المخرجات', s => /(جدول|نقاط|قائمة|مرقم|مرقمة|ملف|صيغة|أعمدة|عمود|نسخة|شريحة|شرائح)/.test(s) ? (/\d/.test(s) ? 10 : 7) : 0, 'حدد الشكل: جدول بأعمدة، نقاط، عدد العناصر.'],
  ['الدقة التربوية', s => { const v = (s.match(/(ناتج|نواتج|هدف|أهداف|بلوم|معيار|معايير|تقويم|مستوى|تمايز|إتقان|مفهوم)/g) || []).length; return v >= 3 ? 10 : v === 2 ? 7 : v === 1 ? 4 : 0; }, 'اربط الطلب بناتج تعلم أو مستويات بلوم أو معايير نجاح.'],
  ['قابلية التحقق', s => { const v = (s.match(/(مفتاح|تحقق|راجع|مراجعة|مصدر|المصدر|صفحة|تبرير|فسّر|فسر|تأكد)/g) || []).length; return v >= 2 ? 10 : v === 1 ? 6 : 0; }, 'اطلب مفتاح إجابة أو مراجعة ذاتية أو ذكر المصادر.'],
  ['ملاءمة المرحلة العمرية', s => /(الصف|عمر|سنوات|ابتدائي|الابتدائي|متوسط|ثانوي|الأولية|العليا|يناسب|مناسب|مبسطة)/.test(s) ? 10 : 0, 'حدد الصف أو العمر واطلب لغة مناسبة له.']
];
function evaluator(start) {
  const m = A.modal('<div class="f-title">📏 مقيّم البرومبت</div><p class="f-sub">الصق البرومبت لتحصل على درجة من 80 وفق ثمانية معايير، مع اقتراحات للتحسين.</p>' +
    '<div class="fld" style="margin-top:12px"><textarea class="inp" id="e_in" style="min-height:120px" placeholder="الصق البرومبت هنا…">' + esc(start || '') + '</textarea></div>' +
    '<div class="f-foot"><span class="sp"></span><button class="btn grad" type="button" id="e_go">📏 قيّم</button></div><div id="e_res"></div>', { wide:true });
  const el = m.el;
  $('#e_go', el).onclick = () => {
    const s = $('#e_in', el).value.trim();
    if (!s) return A.toast('الصق البرومبت أولاً', true);
    let rows = CRIT.map(c => [c[0], c[1](s), c[2]]);
    if (s.length < 60) rows = rows.map(r => [r[0], Math.min(r[1], 5), r[2]]);
    const total = rows.reduce((a, r) => a + r[1], 0), pct = Math.round(total / 80 * 100);
    const color = pct >= 75 ? 'var(--green)' : pct >= 50 ? 'var(--orange)' : 'var(--red)';
    const verdict = pct >= 75 ? 'برومبت احترافي — جاهز للاستخدام وإعادة الاستخدام.' : pct >= 50 ? 'جيد — يحتاج تحسين بعض العناصر.' : 'ضعيف — النتيجة ستكون عامة غالباً. جرّب المحسّن.';
    $('#e_res', el).innerHTML = '<div class="score"><div class="ring" style="--p:' + pct + ';--c:' + color + '"><b>' + total + '</b></div><div><b style="font-family:var(--display);font-size:18px">' + total + ' / 80</b><p style="color:var(--muted)">' + esc(verdict) + '</p></div></div>' +
      '<div class="bars">' + rows.map(r => '<div class="bar-row"><span>' + esc(r[0]) + '</span><span class="tr"><i style="width:' + (r[1] * 10) + '%;--c:' + (r[1] >= 7 ? 'var(--green)' : r[1] >= 4 ? 'var(--orange)' : 'var(--red)') + '"></i></span><b>' + r[1] + '/10</b></div>').join('') + '</div>' +
      (rows.some(r => r[1] < 7) ? '<div class="sub-h">اقتراحات التحسين</div><ul style="padding-inline-start:20px;color:#2f3460">' + rows.filter(r => r[1] < 7).map(r => '<li><b>' + esc(r[0]) + ':</b> ' + esc(r[2]) + '</li>').join('') + '</ul>' : '') +
      '<p class="note">التقييم آلي تقريبي يعتمد على وجود عناصر البرومبت الجيد، ولا يقيس صحة المحتوى نفسه.</p>' +
      '<div class="f-foot"><span class="sp"></span><button class="btn ghost sm" type="button" id="e_opt">✨ حسّنه بالمحسّن</button></div>';
    $('#e_opt', el).onclick = () => optimizer(s);
  };
  if (start) $('#e_go', el).click();
}

function open(kind, preset) {
  if (kind === 'builder') return builder(preset);
  if (kind === 'optimizer') return optimizer(preset);
  if (kind === 'evaluator') return evaluator(preset);
  if (kind === 'analyzer') location.href = 'analyze.html' + (A.DEMO ? '?demo=1' : '');
}
window.AI_LAB = { open, CRIT };
})();
