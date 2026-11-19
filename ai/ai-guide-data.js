/* =====================================================================
   منصة المعلم الذكي — بيانات الدليل الموسّعة
   1) بطاقة تقييم موحّدة لكل أداة (المعايير)
   2) تصنيف الأدوات حسب نوع الاستخدام
   3) نظام التوصية حسب المهمة: (الحاجة ← الأداة الأنسب ← لماذا ← البديل)
   ---------------------------------------------------------------------
   مهم: هذه ترشيحات مبدئية مبنية على قدرات الأدوات المعلنة، وتحتاج تجربة
   عملية بنفس المهمة ونفس المدخلات قبل اعتمادها نهائياً. عند تجربة أداة
   حدّث حقل tested بما جرّبته فعلاً، وحدّث verified بتاريخ المراجعة.
   المراجعة الدورية المقترحة: كل 3 أشهر.
   ===================================================================== */
(function () {
const D = window.AI_DATA;

/* ---------------- 1) تصنيف الأدوات حسب نوع الاستخدام ---------------- */
D.useTypes = [
  { id:"think",   icon:"🧠", ar:"التفكير والكتابة والتحليل", en:"Thinking, writing & analysis" },
  { id:"assess",  icon:"📝", ar:"الاختبارات والتقويم", en:"Tests & assessment" },
  { id:"visual",  icon:"🎨", ar:"العروض والمواد البصرية", en:"Slides & visuals" },
  { id:"media",   icon:"🎧", ar:"الصوت والفيديو", en:"Audio & video" },
  { id:"build",   icon:"⚡", ar:"بناء التطبيقات والألعاب", en:"Building apps & games" },
  { id:"research",icon:"🔎", ar:"البحث العلمي", en:"Research" },
  { id:"data",    icon:"📊", ar:"تحليل البيانات", en:"Data analysis" },
  { id:"agents",  icon:"🤖", ar:"بناء الوكلاء الذكية", en:"Building AI agents" },
  { id:"content", icon:"🗂️", ar:"إدارة المحتوى التعليمي", en:"Learning content management" }
];

/* ---------------- 2) بطاقة التقييم الموحّدة لكل أداة ----------------
   ease : easy سهل | mid متوسط | adv متقدم
   stu  : yes يتفاعل معه الطلاب مباشرة | part جزئي | no للمعلم فقط
   gen  : yes ينشئ محتوى تعليمياً | part جزئي
   files: الملفات التي يستقبلها   |   exp: صيغ التصدير
   best : teacher معلم | student طالب | leader قائد مدرسي
   priv : ملاحظة الخصوصية         |   tested: ما جُرّب فعلياً (يُحدَّث بعد التجربة)
   ------------------------------------------------------------------ */
const M = {
  chatgpt:   { uses:["think","assess","data","agents","build"], ease:"easy", gen:"yes", stu:"part", files:"PDF، Word، Excel، صور", exp:"نص، Word، Excel، PowerPoint (عند الطلب)", best:["teacher","leader"],
               priv:"في الحساب الشخصي قد تُستخدم المحادثات لتحسين النماذج ما لم توقفه من إعدادات التحكم في البيانات. لا تُدخل بيانات طلاب تعرّف بهم." },
  gemini:    { uses:["think","assess","build","agents","research"], ease:"easy", gen:"yes", stu:"yes", files:"PDF، Docs، صور، ملفات Drive", exp:"Google Docs، Sheets، صفحة Canvas", best:["teacher","student","leader"],
               priv:"مع حساب Google Workspace للتعليم تسري شروط حماية بيانات المؤسسة، ويتحكم مسؤول المدرسة في الإتاحة. الحساب الشخصي تسري عليه شروط مختلفة." },
  claude:    { uses:["think","build","agents","data","assess"], ease:"easy", gen:"yes", stu:"part", files:"PDF، Word، Excel، صور", exp:"صفحات وتطبيقات HTML، Word، Excel، PowerPoint", best:["teacher","leader"],
               priv:"راجع إعدادات الخصوصية واختر ما يناسبك بشأن استخدام المحادثات للتدريب. لا تُدخل بيانات طلاب تعرّف بهم." },
  copilot:   { uses:["think","content","data"], ease:"easy", gen:"yes", stu:"no", files:"Word، PowerPoint، Excel (حسب الحساب)", exp:"Word، PowerPoint", best:["teacher","leader"],
               priv:"الحساب الشخصي يختلف عن حساب Microsoft 365 المؤسسي في شروط حماية البيانات." },
  notebooklm:{ uses:["research","assess","media","agents"], ease:"easy", gen:"yes", stu:"yes", files:"PDF، Docs، Slides، روابط، فيديو يوتيوب، صوت", exp:"ملخص صوتي/مرئي، ملاحظات، بطاقات واختبارات", best:["teacher","student"],
               priv:"يعمل على المصادر التي ترفعها فقط؛ لا ترفع مستندات فيها بيانات طلاب. مع حساب المدرسة تسري شروط Workspace للتعليم." },
  magicschool:{uses:["assess","think","content"], ease:"easy", gen:"yes", stu:"yes", files:"نص، PDF، روابط", exp:"نسخ، Google Docs، Word", best:["teacher"],
               priv:"منصة مخصّصة للتعليم؛ ومع ذلك لا تُدخل أسماء الطلاب أو بياناتهم الشخصية." },
  wayground: { uses:["assess"], ease:"easy", gen:"yes", stu:"yes", files:"نص، PDF، رابط", exp:"نشاط تفاعلي، تقارير نتائج", best:["teacher","student"],
               priv:"يجمع نتائج الطلاب داخل المنصة؛ استخدم أسماء مستعارة أو حسابات المدرسة حسب سياستها." },
  kahoot:    { uses:["assess"], ease:"easy", gen:"part", stu:"yes", files:"نص، جدول أسئلة", exp:"نشاط تفاعلي، تقرير نتائج", best:["teacher","student"],
               priv:"يطلب من الطلاب اسماً مستعاراً للدخول؛ وجّههم لاستخدام أسماء لا تكشف هوياتهم." },
  gamma:     { uses:["visual"], ease:"easy", gen:"yes", stu:"no", files:"نص، مخطط، ملفات", exp:"PowerPoint، PDF، رابط عرض", best:["teacher","leader"],
               priv:"المحتوى يُحفظ في حسابك على المنصة؛ لا تضع بيانات شخصية في العروض." },
  canva:     { uses:["visual","media","content"], ease:"easy", gen:"yes", stu:"yes", files:"صور، فيديو، PDF، PowerPoint", exp:"PDF، PowerPoint، PNG، MP4", best:["teacher","student","leader"],
               priv:"عند استخدام صور الطلاب تحقق من موافقة أولياء الأمور وسياسة المدرسة." },
  napkin:    { uses:["visual"], ease:"easy", gen:"part", stu:"no", files:"نص", exp:"PNG، SVG، PDF", best:["teacher"],
               priv:"يعالج النص الذي تلصقه فقط." },
  diffit:    { uses:["assess","content"], ease:"easy", gen:"yes", stu:"part", files:"نص، رابط، PDF", exp:"Google Docs، Slides، PDF", best:["teacher"],
               priv:"منصة تعليمية؛ لا تحتاج بيانات طلاب لعملها." },
  brisk:     { uses:["assess","think"], ease:"mid", gen:"yes", stu:"part", files:"Google Docs، صفحات الويب، PDF", exp:"داخل Google Docs", best:["teacher"],
               priv:"تعمل داخل مستندات الطلاب لتقديم التغذية الراجعة؛ استخدمها وفق سياسة المدرسة لمستندات الطلاب." },
  curipod:   { uses:["visual","assess"], ease:"easy", gen:"yes", stu:"yes", files:"نص، موضوع", exp:"درس تفاعلي، PDF", best:["teacher","student"],
               priv:"يجمع إجابات الطلاب داخل الدرس؛ استخدم أسماء مستعارة." },
  suno:      { uses:["media"], ease:"easy", gen:"yes", stu:"no", files:"كلمات نصية", exp:"MP3", best:["teacher"],
               priv:"راجع شروط الاستخدام وحقوق الموسيقى قبل النشر خارج الفصل." },
  elevenlabs:{ uses:["media"], ease:"mid", gen:"yes", stu:"no", files:"نص", exp:"MP3", best:["teacher"],
               priv:"لا تستنسخ صوت أي شخص دون إذنه الصريح." },
  perplexity:{ uses:["research"], ease:"easy", gen:"part", stu:"part", files:"نص، PDF", exp:"نص مع روابط المصادر", best:["teacher","student"],
               priv:"افتح المصدر الأصلي دائماً؛ الملخّص قد يخطئ في النسبة إلى المصادر." },
  consensus: { uses:["research"], ease:"mid", gen:"part", stu:"part", files:"سؤال بحثي", exp:"ملخص مع روابط الأوراق العلمية", best:["teacher","student"],
               priv:"يعمل على الأوراق العلمية المنشورة؛ لا يحتاج بيانات شخصية." }
};
D.tools.forEach(t => { Object.assign(t, M[t.id] || {}); t.verified = t.verified || "2026-11"; t.tested = t.tested || ""; });

D.criteria = {
  ease:{ easy:{ar:"سهل",en:"Easy"}, mid:{ar:"متوسط",en:"Medium"}, adv:{ar:"متقدم",en:"Advanced"} },
  yn:{ yes:{ar:"نعم",en:"Yes"}, part:{ar:"جزئي",en:"Partly"}, no:{ar:"للمعلم فقط",en:"Teacher only"} },
  best:{ teacher:{ar:"المعلم",en:"Teacher"}, student:{ar:"الطالب",en:"Student"}, leader:{ar:"القائد المدرسي",en:"School leader"} }
};

/* ---------------- 3) نظام التوصية حسب المهمة ----------------
   [الحاجة، الأداة الأنسب، لماذا، البديل]
   ------------------------------------------------------------- */
D.recs = {
  quiz:[
    ["استخراج أسئلة من درس الكتاب المدرسي","notebooklm","يعمل اعتماداً على الملف المرفوع فقط، فتأتي الأسئلة من محتواك","chatgpt"],
    ["بناء اختبار وفق جدول مواصفات ومستويات بلوم","claude","يتبع التعليمات الطويلة متعددة المراحل ويُخرج جداول منظمة","chatgpt"],
    ["تحويل الأسئلة إلى اختبار تفاعلي للفصل","wayground","يستورد الأسئلة ويعرضها كنشاط تفاعلي مع تقرير نتائج","kahoot"],
    ["تحليل نتائج الاختبار بعد التطبيق","chatgpt","يقرأ ملفات Excel ويحسب النسب ويستخرج الأنماط — أو استخدم «محلل النتائج» في المنصة دون رفع بيانات","claude"]
  ],
  worksheet:[
    ["ورقة عمل متدرجة المستويات","claude","يلتزم بالهيكل المطلوب ويُخرج ملف Word جاهزاً","magicschool"],
    ["نص قراءة بمستويات مع أسئلة","diffit","مخصص لتبسيط النصوص بمستويات مختلفة","magicschool"],
    ["إخراج ورقة العمل بتصميم جذاب","canva","قوالب جاهزة ودعم عربي ممتاز وتصدير PDF","gamma"]
  ],
  slides:[
    ["عرض سريع من مخطط جاهز","gamma","يحوّل المخطط إلى شرائح مصممة ويُصدّر PowerPoint","canva"],
    ["عرض مصمم بهوية المدرسة","canva","تحكم كامل في التصميم ودعم عربي ممتاز","gamma"],
    ["عرض ملخّص من مصادر الوحدة","notebooklm","يبني من المصادر المرفوعة فقط","claude"],
    ["درس تفاعلي بتصويت وإجابات الطلاب","curipod","يجمع تفاعل الطلاب مباشرة أثناء العرض","wayground"]
  ],
  lesson:[
    ["خطة درس وفق نموذج (5E أو التصميم العكسي)","claude","يربط الأنشطة بالنواتج وأدوات التقويم في جدول","chatgpt"],
    ["خطة سريعة من قالب جاهز","magicschool","أدوات تخطيط جاهزة لا تحتاج كتابة برومبت","gemini"],
    ["خطة وحدة كاملة من دليل المعلم","notebooklm","يرجع إلى ملفات المنهج التي ترفعها","claude"]
  ],
  visuals:[
    ["منظم بصري أو مخطط من نص","napkin","يحوّل النص مباشرة إلى رسوم توضيحية","canva"],
    ["ملصق أو إنفوجرافيك","canva","قوالب عربية جاهزة وتحكم في التصميم","gemini"],
    ["صورة توضيحية مولّدة","gemini","توليد صور من وصف — مع مراجعة الدقة العلمية","chatgpt"]
  ],
  media:[
    ["ملخص صوتي أو مرئي لدرس","notebooklm","ملخص صوتي ومرئي بالعربية من مصادرك","elevenlabs"],
    ["تسجيل شرح أو قصة بصوت طبيعي","elevenlabs","أصوات عربية طبيعية من النص","canva"],
    ["أنشودة تعليمية","suno","يلحّن كلماتك — راجع الكلمات علمياً ولغوياً أولاً","canva"],
    ["فيديو قصير بالصور والنص","canva","محرر فيديو بقوالب وتصدير MP4","notebooklm"]
  ],
  feedback:[
    ["بناء Rubric بأوزان ومستويات","magicschool","أداة Rubric جاهزة","claude"],
    ["تغذية راجعة على كتابات الطلاب","brisk","يعمل داخل مستند الطالب في Google Docs","claude"],
    ["تحليل أنماط الأخطاء في إجابات الطلاب","claude","يصنّف الأخطاء ويقترح تدخلات — بعد إزالة الأسماء","chatgpt"]
  ],
  differentiation:[
    ["نص بثلاثة مستويات قرائية","diffit","مخصص للتبسيط مع الحفاظ على المحتوى","claude"],
    ["أنشطة دعم وإثراء لنفس الهدف","claude","يبني نسخاً متوازية مرتبطة بالناتج نفسه","magicschool"],
    ["مسار تعلم فردي لمهارة","chatgpt","يصمم خطوات متدرجة ومعايير انتقال","claude"]
  ],
  interactive:[
    ["لعبة أو محاكاة في ملف HTML واحد","claude","يكتب التطبيق ويعرضه للتجربة فوراً ويمكن رفعه هنا","gemini"],
    ["نشاط تفاعلي سريع في المتصفح","gemini","Canvas يبني أنشطة تفاعلية ويشاركها برابط","chatgpt"],
    ["مسابقة صفية حماسية","wayground","لا يحتاج برمجة، ونتائج فورية","kahoot"]
  ],
  research:[
    ["تلخيص فصل أو مصدر بدقة","notebooklm","يجيب من المصدر فقط مع الإحالة إلى المقاطع","claude"],
    ["البحث في الإنترنت مع المصادر","perplexity","يعرض روابط المصادر بجانب الإجابة","gemini"],
    ["البحث في الدراسات العلمية المحكّمة","consensus","يبحث في الأوراق العلمية ويلخص نتائجها","perplexity"]
  ],
  communication:[
    ["رسالة لولي أمر أو إعلان","claude","نبرة عربية دقيقة ومهنية","chatgpt"],
    ["محضر اجتماع أو تقرير","copilot","يعمل داخل Word عند توفر الحساب","chatgpt"],
    ["تحليل استبيان وإعداد تقرير","chatgpt","يحسب النسب ويُخرج جداول","claude"]
  ]
};
D.recsNote = { ar:"ترشيحات مبدئية مبنية على القدرات المعلنة للأدوات، وتحتاج تجربة عملية بنفس المهمة والمدخلات قبل اعتمادها نهائياً.",
  en:"Initial recommendations based on the tools' published capabilities; test them on the same task and inputs before relying on them." };
})();
