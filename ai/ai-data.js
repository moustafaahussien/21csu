/* =====================================================================
   منصة المعلم الذكي — المحتوى الثابت (الدليل • الأدوات • التدريب • البرومبتات)
   ---------------------------------------------------------------------
   هذا الملف هو "قاعدة المحتوى" للدليل. لتعديل أي نص أو إضافة أداة/مهمة/برومبت:
   عدّل هنا فقط، وكل الصفحات تتحدث تلقائياً.
   كل نص له نسختان: ar (عربي) و en (إنجليزي).
   آخر مراجعة لبيانات الأدوات: نوفمبر 2026 — الأسعار والخطط تتغير، راجع موقع الأداة.
   ===================================================================== */

window.AI_DATA = {

/* ---------------------------------------------------------------------
   1) الأدوات
   price: free = مجاني | freemium = مجاني بحدود + خطط مدفوعة | edu = مجاني بحساب Google للتعليم (حساب المدرسة) | paid = مدفوع
   ar   : good = دعم عربي ممتاز | ok = جيد | low = محدود (الأفضل بالإنجليزية)
   --------------------------------------------------------------------- */
tools: [
  { id:"chatgpt", name:"ChatGPT", url:"https://chatgpt.com", color:"#10a37f", mono:"GPT", price:"freemium", ar:"good",
    d:{ ar:"مساعد عام قوي للكتابة والتخطيط وتوليد الأسئلة والشرح، ويمكن بناء وكلاء مخصصين (GPTs) عليه.",
        en:"A powerful general assistant for writing, planning, question generation and explanations; supports custom agents (GPTs)." } },
  { id:"gemini", name:"Gemini", url:"https://gemini.google.com", color:"#4285f4", mono:"G", price:"edu", ar:"good",
    d:{ ar:"مساعد Google، متاح مجاناً لحسابات Google للتعليم، وفيه Gems (وكلاء مخصصة) وCanvas لبناء أنشطة وتطبيقات تفاعلية.",
        en:"Google's assistant, free with Google Workspace for Education accounts; includes Gems (custom agents) and Canvas for building interactive activities and apps." } },
  { id:"claude", name:"Claude", url:"https://claude.ai", color:"#d97757", mono:"C", price:"freemium", ar:"good",
    d:{ ar:"ممتاز في الكتابة العربية الدقيقة والتحليل، ويبني صفحات وتطبيقات تفاعلية كاملة (Artifacts) يمكن نشرها ورفعها هنا.",
        en:"Excellent at precise Arabic writing and analysis; builds complete interactive pages and apps (Artifacts) you can publish and upload here." } },
  { id:"copilot", name:"Microsoft Copilot", url:"https://copilot.microsoft.com", color:"#0078d4", mono:"Co", price:"freemium", ar:"good",
    d:{ ar:"مساعد Microsoft، مفيد لمن يعمل على Word وPowerPoint وExcel.",
        en:"Microsoft's assistant, handy for those who work in Word, PowerPoint and Excel." } },
  { id:"notebooklm", name:"NotebookLM", url:"https://notebooklm.google.com", color:"#5b4fe0", mono:"NB", price:"edu", ar:"good",
    d:{ ar:"ارفع كتابك أو ملفاتك فيجيب منها فقط، ويصنع ملخصاً صوتياً أو فيديو بالعربية، وخرائط ذهنية، واختبارات وبطاقات مراجعة.",
        en:"Upload your textbook or files and it answers only from them; creates Arabic audio/video overviews, mind maps, quizzes and flashcards." } },
  { id:"magicschool", name:"MagicSchool", url:"https://www.magicschool.ai", color:"#7c3aed", mono:"MS", price:"freemium", ar:"ok",
    d:{ ar:"منصة للمعلمين فيها أكثر من 80 أداة جاهزة: خطط دروس، معايير تقييم (Rubrics)، تبسيط نصوص، أسئلة، رسائل لأولياء الأمور.",
        en:"A teacher platform with 80+ ready tools: lesson plans, rubrics, text leveling, questions, parent messages." } },
  { id:"wayground", name:"Wayground (Quizizz)", url:"https://wayground.com", color:"#8854c0", mono:"W", price:"freemium", ar:"ok",
    d:{ ar:"الاسم الجديد لـ Quizizz: ينشئ اختبارات تفاعلية بالذكاء الاصطناعي من نص أو ملف أو رابط، ويعرضها كلعبة في الفصل.",
        en:"The new name of Quizizz: generates interactive quizzes with AI from text, a file or a link, and runs them as a class game." } },
  { id:"kahoot", name:"Kahoot!", url:"https://kahoot.com", color:"#46178f", mono:"K!", price:"freemium", ar:"ok",
    d:{ ar:"مسابقات صفية حماسية، مع مولّد أسئلة بالذكاء الاصطناعي.",
        en:"Exciting class quiz games with an AI question generator." } },
  { id:"gamma", name:"Gamma", url:"https://gamma.app", color:"#ff6b4a", mono:"Γ", price:"freemium", ar:"ok",
    d:{ ar:"يحوّل فكرة أو نصاً إلى عرض تقديمي مصمم خلال دقائق، مع إمكانية التصدير إلى PowerPoint وPDF.",
        en:"Turns an idea or text into a designed presentation in minutes; exports to PowerPoint and PDF." } },
  { id:"canva", name:"Canva", url:"https://www.canva.com/education/", color:"#00c4cc", mono:"Cv", price:"freemium", ar:"good",
    d:{ ar:"تصميم عروض وأوراق عمل وإنفوجرافيك وفيديو بدعم عربي ممتاز، وفيه أدوات ذكاء اصطناعي. يوجد Canva للتعليم مجاناً للمعلمين المؤهلين.",
        en:"Design slides, worksheets, infographics and video with excellent Arabic support and built-in AI tools. Canva for Education is free for eligible teachers." } },
  { id:"napkin", name:"Napkin", url:"https://www.napkin.ai", color:"#111827", mono:"N", price:"freemium", ar:"ok",
    d:{ ar:"يحوّل النص إلى رسوم توضيحية ومخططات ومنظمات بصرية جاهزة للعرض.",
        en:"Turns text into ready-made diagrams, charts and visual organizers." } },
  { id:"diffit", name:"Diffit", url:"https://web.diffit.me", color:"#ef4444", mono:"Df", price:"freemium", ar:"low",
    d:{ ar:"ينشئ نصوص قراءة بمستويات صعوبة مختلفة مع أسئلة ومفردات — ممتاز للتمايز.",
        en:"Creates reading passages at different levels with questions and vocabulary — great for differentiation." } },
  { id:"brisk", name:"Brisk Teaching", url:"https://www.briskteaching.com", color:"#f97316", mono:"Br", price:"freemium", ar:"ok",
    d:{ ar:"إضافة لمتصفح Chrome تعمل داخل Google Docs والمواقع: تغذية راجعة على كتابات الطلاب، تبسيط، إنشاء أسئلة.",
        en:"A Chrome extension that works inside Google Docs and websites: feedback on student writing, leveling, question generation." } },
  { id:"curipod", name:"Curipod", url:"https://curipod.com", color:"#22c55e", mono:"Cp", price:"freemium", ar:"low",
    d:{ ar:"دروس تفاعلية فيها تصويت ورسم وأسئلة مفتوحة يجيب عنها الطلاب مباشرة من أجهزتهم.",
        en:"Interactive lessons with polls, drawing and open questions students answer live from their devices." } },
  { id:"suno", name:"Suno", url:"https://suno.com", color:"#0f172a", mono:"S", price:"freemium", ar:"ok",
    d:{ ar:"يؤلف أناشيد وأغانٍ تعليمية من كلماتك — ممتاز لحفظ القواعد والمفاهيم.",
        en:"Composes educational songs from your lyrics — great for memorizing rules and concepts." } },
  { id:"elevenlabs", name:"ElevenLabs", url:"https://elevenlabs.io", color:"#000000", mono:"11", price:"freemium", ar:"good",
    d:{ ar:"يحوّل النص إلى صوت طبيعي بالعربية — لتسجيل شروحات وقصص ونصوص استماع.",
        en:"Turns text into natural Arabic speech — for recorded explanations, stories and listening texts." } },
  { id:"perplexity", name:"Perplexity", url:"https://www.perplexity.ai", color:"#20808d", mono:"P", price:"freemium", ar:"good",
    d:{ ar:"محرك بحث يجيب مع ذكر المصادر — مفيد للتحضير والتحقق من المعلومات.",
        en:"An answer engine that cites its sources — useful for preparation and fact-checking." } },
  { id:"consensus", name:"Consensus", url:"https://consensus.app", color:"#2563eb", mono:"Cs", price:"freemium", ar:"low",
    d:{ ar:"يبحث في الأوراق العلمية المحكّمة ويلخّص ما توصلت إليه الدراسات — لمشاريع البحث العلمي.",
        en:"Searches peer-reviewed papers and summarizes what studies found — for research projects." } }
],

/* ---------------------------------------------------------------------
   2) المهام: "عايز تعمل إيه؟"
   tools: الأدوات المقترحة بالترتيب  |  tip: نصيحة  |  prompt: برومبت جاهز
   --------------------------------------------------------------------- */
tasks: [
  { id:"quiz", icon:"📝", color:"#6D4BFF",
    t:{ ar:"إعداد اختبار وأسئلة", en:"Create a test & questions" },
    d:{ ar:"أسئلة متنوعة بمستويات معرفية مختلفة، بنك أسئلة، اختبار تفاعلي.", en:"Varied questions across cognitive levels, question banks, interactive quizzes." },
    tools:["notebooklm","wayground","chatgpt","claude","gemini","kahoot"],
    tip:{ ar:"ارفع درس الكتاب نفسه (NotebookLM أو Wayground) لتأتي الأسئلة من محتواك لا من الإنترنت، ثم راجع كل سؤال ومفتاح إجابته قبل الاستخدام.",
          en:"Upload the actual textbook lesson (NotebookLM or Wayground) so questions come from your content, then review every question and its key before use." } },
  { id:"worksheet", icon:"📄", color:"#0EA5D6",
    t:{ ar:"أوراق عمل وأنشطة", en:"Worksheets & activities" },
    d:{ ar:"أوراق عمل بمستويات، أنشطة صفية وواجبات، بطاقات تعلم.", en:"Levelled worksheets, class activities, homework, task cards." },
    tools:["claude","chatgpt","magicschool","diffit","canva"],
    tip:{ ar:"اطلب النشاط أولاً كنص منظم، ثم صمّمه في Canva بقالب ثابت لهوية المدرسة.", en:"Ask for the activity as structured text first, then design it in Canva with a consistent school template." } },
  { id:"slides", icon:"🖥️", color:"#E8790A",
    t:{ ar:"عروض تقديمية", en:"Presentations" },
    d:{ ar:"عروض دروس جذابة، ملخصات مرئية، عروض للمشاريع.", en:"Engaging lesson decks, visual summaries, project presentations." },
    tools:["gamma","canva","notebooklm","claude","copilot"],
    tip:{ ar:"اكتب مخطط العرض (عنوان كل شريحة + نقطتين) بنفسك أو مع مساعد، ثم أعطه لـ Gamma أو Canva — النتيجة أدق بكثير.", en:"Write the outline (slide titles + two points each) yourself or with an assistant, then give it to Gamma or Canva — far more accurate." } },
  { id:"lesson", icon:"🗂️", color:"#0E9F76",
    t:{ ar:"تخطيط الدروس والوحدات", en:"Lesson & unit planning" },
    d:{ ar:"خطة درس، أهداف ونواتج، استراتيجيات تدريس، توزيع زمني.", en:"Lesson plans, objectives & outcomes, strategies, pacing." },
    tools:["magicschool","chatgpt","claude","gemini"],
    tip:{ ar:"حدّد للأداة: الصف، زمن الحصة، الأهداف من دليل المعلم، وطبيعة طلابك — الخطة العامة لا تفيد.", en:"Tell the tool the grade, period length, objectives from the teacher's guide, and your students' profile — generic plans don't help." } },
  { id:"visuals", icon:"🎨", color:"#E63E7C",
    t:{ ar:"صور ورسوم ووسائل", en:"Images, diagrams & visual aids" },
    d:{ ar:"رسوم توضيحية، منظمات بصرية، إنفوجرافيك، صور تعليمية.", en:"Illustrations, graphic organizers, infographics, learning images." },
    tools:["napkin","canva","gemini","chatgpt"],
    tip:{ ar:"تأكد من دقة الرسوم العلمية (الأعضاء، الخرائط، التفاعلات) — مولدات الصور تخطئ في التفاصيل الدقيقة والكتابة العربية داخل الصورة.", en:"Check scientific accuracy (organs, maps, reactions) — image generators get fine details and Arabic text inside images wrong." } },
  { id:"media", icon:"🎧", color:"#8B5CF6",
    t:{ ar:"فيديو وصوت وأناشيد", en:"Video, audio & songs" },
    d:{ ar:"ملخص صوتي أو فيديو للدرس، تسجيل شرح، أنشودة تعليمية.", en:"Audio/video lesson overviews, recorded explanations, learning songs." },
    tools:["notebooklm","elevenlabs","suno","canva"],
    tip:{ ar:"في NotebookLM اختر لغة المخرجات العربية من الإعدادات قبل إنشاء الملخص الصوتي أو المرئي.", en:"In NotebookLM set the output language to Arabic in Settings before generating an audio or video overview." } },
  { id:"feedback", icon:"✅", color:"#14B8A6",
    t:{ ar:"التصحيح والتغذية الراجعة", en:"Grading & feedback" },
    d:{ ar:"معايير تقييم (Rubric)، تغذية راجعة على الكتابة، تحليل نتائج.", en:"Rubrics, writing feedback, results analysis." },
    tools:["magicschool","brisk","claude","chatgpt"],
    tip:{ ar:"لا ترفع أسماء الطلاب أو درجاتهم مع بيانات تعرّف بهم — استخدم أرقاماً بدل الأسماء، والقرار النهائي للدرجة لك أنت.", en:"Never upload student names or identifiable grades — use numbers instead of names; the final grade decision is yours." } },
  { id:"differentiation", icon:"🧩", color:"#F59E0B",
    t:{ ar:"التمايز ودعم الطلاب", en:"Differentiation & support" },
    d:{ ar:"تبسيط نص، نسخ بمستويات، دعم الطلاب المتعثرين، إثراء الموهوبين.", en:"Text leveling, tiered versions, support for strugglers, enrichment for the gifted." },
    tools:["diffit","magicschool","claude","chatgpt"],
    tip:{ ar:"اطلب ثلاث نسخ من النشاط نفسه (دعم – أساسي – إثراء) بنفس الهدف، لتعمل كل المجموعات على درس واحد.", en:"Ask for three versions of the same activity (support – core – extension) with one objective, so all groups work on one lesson." } },
  { id:"interactive", icon:"🎮", color:"#6366F1",
    t:{ ar:"تطبيقات وألعاب تفاعلية", en:"Interactive apps & games" },
    d:{ ar:"لعبة تعليمية، محاكاة، بطاقات تفاعلية، تطبيق صغير لدرسك — بدون برمجة.", en:"Learning games, simulations, interactive cards, a mini-app for your lesson — no coding." },
    tools:["claude","gemini","chatgpt","wayground"],
    tip:{ ar:"صِف التطبيق كأنك تشرحه لمبرمج: من يستخدمه، ماذا يرى، ماذا يحدث عند الضغط. ثم اطلب «ملف HTML واحد» وارفعه هنا في معرض المنتجات.", en:"Describe the app as if briefing a developer: who uses it, what they see, what happens on click. Then ask for “a single HTML file” and upload it here." } },
  { id:"research", icon:"🔎", color:"#0891B2",
    t:{ ar:"البحث والتلخيص والتحضير", en:"Research, summarizing & prep" },
    d:{ ar:"تلخيص مصادر، البحث مع المراجع، إثراء معلومات الدرس، مشاريع البحث العلمي.", en:"Summarize sources, research with references, enrich lesson content, research projects." },
    tools:["notebooklm","perplexity","consensus","gemini"],
    tip:{ ar:"افتح المصدر الأصلي دائماً وتحقق منه — أدوات الذكاء الاصطناعي قد تخترع مراجع غير موجودة.", en:"Always open and check the original source — AI tools can invent references that don't exist." } },
  { id:"communication", icon:"✉️", color:"#64748B",
    t:{ ar:"التواصل والمهام الإدارية", en:"Communication & admin" },
    d:{ ar:"رسائل لأولياء الأمور، تقارير، محاضر، إعلانات وتهاني.", en:"Parent messages, reports, minutes, announcements." },
    tools:["chatgpt","claude","copilot","magicschool"],
    tip:{ ar:"حدّد النبرة (رسمية، ودّية، حازمة) والطول، واحذف أي بيانات شخصية قبل اللصق.", en:"Specify the tone (formal, warm, firm) and length, and remove personal data before pasting." } }
],

/* ---------------------------------------------------------------------
   3) المساعدات العامة وكيفية بناء وكيلك الخاص
   --------------------------------------------------------------------- */
assistants: [
  { tool:"chatgpt",
    build:{ ar:"وكيلك الخاص: GPTs — من «Explore GPTs» ثم «Create»: اكتب التعليمات، ارفع ملفات المرجع، وشارك الرابط مع زملائك.",
            en:"Your own agent: GPTs — from “Explore GPTs” → “Create”: write the instructions, upload reference files, share the link." } },
  { tool:"gemini",
    build:{ ar:"وكيلك الخاص: Gems — من القائمة الجانبية «Gems» ثم «New Gem»: اكتب التعليمات وارفع ملفات، ويمكن تعيينه للطلاب عبر Google Classroom.",
            en:"Your own agent: Gems — from the sidebar “Gems” → “New Gem”: write instructions and add files; can be assigned to students via Google Classroom." } },
  { tool:"claude",
    build:{ ar:"وكيلك الخاص: Projects — أنشئ مشروعاً، اكتب «تعليمات المشروع» وارفع ملفات المنهج، فتعمل كل محادثاته بنفس الإعداد.",
            en:"Your own agent: Projects — create a project, write “project instructions” and upload curriculum files; every chat in it follows that setup." } },
  { tool:"notebooklm",
    build:{ ar:"وكيل معرفي من مصادرك: أنشئ دفتراً، ارفع مصادر الوحدة، وشاركه مع الطلاب ليسألوه ويذاكروا منه فقط.",
            en:"A knowledge agent from your sources: create a notebook, upload the unit sources, and share it so students ask and study only from it." } }
],

/* قالب تعليمات جاهز لبناء وكيل تعليمي (GPT / Gem / Project) */
agentTemplate:{
  ar:`أنت [مساعد تعليمي لمادة ... للصف ...] في مدارس دار الذكر.
مهمتك: [مثال: مساعدة الطلاب على فهم دروس الوحدة الثالثة دون إعطائهم الإجابات الجاهزة].

طريقة عملك:
1. ابدأ بسؤال الطالب عمّا يعرفه عن الموضوع.
2. اشرح خطوة بخطوة بلغة عربية فصيحة مبسطة تناسب عمر الطالب.
3. استخدم أمثلة من حياة الطالب في السعودية.
4. بعد كل شرح اسأل سؤالاً قصيراً للتحقق من الفهم.
5. إذا طلب الإجابة مباشرة، أعطه تلميحاً بدلاً منها.

القيود:
- اعتمد على الملفات المرفوعة أولاً، وإذا لم تجد المعلومة فقل ذلك بوضوح.
- لا تطلب من الطالب أي بيانات شخصية.
- التزم بالقيم الإسلامية والأخلاقية وبثقافة المجتمع السعودي.`,
  en:`You are [a learning assistant for ... grade ...] at Dar Al-Thikr Schools.
Your task: [e.g., help students understand Unit 3 without giving them ready answers].

How you work:
1. Start by asking the student what they already know about the topic.
2. Explain step by step in simple language suited to the student's age.
3. Use examples from the student's daily life in Saudi Arabia.
4. After each explanation, ask a short question to check understanding.
5. If they ask for the answer directly, give a hint instead.

Constraints:
- Rely on the uploaded files first; if the information isn't there, say so clearly.
- Never ask the student for personal data.
- Respect Islamic and ethical values and Saudi culture.` },

/* ---------------------------------------------------------------------
   4) مكتبة البرومبتات الجاهزة — task: معرّف المهمة
   الأقواس [ ] = أماكن تكتب فيها بياناتك
   --------------------------------------------------------------------- */
prompts: [
  { task:"quiz",
    t:{ ar:"اختبار متنوع حسب مستويات بلوم", en:"Varied test across Bloom's levels" },
    p:{ ar:`أنت معلم [المادة] خبير في بناء الاختبارات للصف [الصف].
اعتماداً على الدرس التالي: [الصق نص الدرس أو ارفعه]
أنشئ اختباراً من [10] أسئلة:
- 4 اختيار من متعدد (4 بدائل، بديل واحد صحيح، والبدائل الخاطئة معقولة)
- 3 صح وخطأ مع تصحيح الخطأ
- 2 إكمال
- 1 سؤال مقالي قصير يقيس التفكير العليا
وزّع الأسئلة على مستويات بلوم (تذكر، فهم، تطبيق، تحليل) واكتب المستوى بجانب كل سؤال.
في النهاية: مفتاح الإجابة مع سطر يبرر كل إجابة.`,
        en:`You are an expert [subject] teacher who writes assessments for grade [grade].
Based on this lesson: [paste or upload the lesson]
Create a [10]-question test:
- 4 multiple choice (4 options, one correct, plausible distractors)
- 3 true/false with correction of false statements
- 2 fill-in-the-blank
- 1 short open question measuring higher-order thinking
Spread questions across Bloom's levels (remember, understand, apply, analyze) and label each.
Finally: an answer key with a one-line justification per answer.` } },
  { task:"quiz",
    t:{ ar:"تحويل الأسئلة لصيغة الاستيراد", en:"Convert questions to an import format" },
    p:{ ar:`حوّل الأسئلة التالية إلى جدول بالأعمدة: السؤال | البديل 1 | البديل 2 | البديل 3 | البديل 4 | رقم الإجابة الصحيحة | الزمن بالثواني (30).
لا تغيّر صياغة الأسئلة. الأسئلة: [الصق الأسئلة]`,
        en:`Convert the following questions into a table with columns: Question | Option 1 | Option 2 | Option 3 | Option 4 | Correct option number | Time in seconds (30).
Do not change the wording. Questions: [paste questions]` } },
  { task:"worksheet",
    t:{ ar:"ورقة عمل بثلاثة مستويات", en:"Three-level worksheet" },
    p:{ ar:`صمم ورقة عمل لدرس [عنوان الدرس] للصف [الصف] بهدف: [الهدف].
اجعلها ثلاثة أقسام:
🟢 أتدرّب (أسئلة أساسية مباشرة)
🟡 أطبّق (مواقف من الحياة)
🔴 أتحدّى (سؤال تفكير ناقد أو إبداعي)
أضف تعليمات قصيرة لكل قسم، ومساحة للإجابة، ومفتاح إجابة منفصل للمعلم.
اللغة: عربية فصيحة مبسطة تناسب العمر.`,
        en:`Design a worksheet for the lesson [title] for grade [grade] with the objective: [objective].
Make three sections:
🟢 Practice (direct core questions)
🟡 Apply (real-life situations)
🔴 Challenge (a critical or creative thinking question)
Add short instructions for each section, answer space, and a separate teacher answer key.` } },
  { task:"slides",
    t:{ ar:"مخطط عرض تقديمي جاهز لـ Gamma", en:"Presentation outline for Gamma" },
    p:{ ar:`اكتب مخطط عرض تقديمي من [10] شرائح لدرس [عنوان الدرس] للصف [الصف].
لكل شريحة: عنوان قصير جذاب + 2-3 نقاط (لا تزيد النقطة عن 12 كلمة) + اقتراح صورة أو رسم.
ابدأ بشريحة سؤال مثير للتفكير، واختم بشريحة تقييم سريع (3 أسئلة) وشريحة ملخص.`,
        en:`Write an outline for a [10]-slide presentation on [lesson title] for grade [grade].
For each slide: a short catchy title + 2–3 bullet points (max 12 words each) + a suggested image or diagram.
Start with a thought-provoking question slide; end with a quick check (3 questions) and a summary slide.` } },
  { task:"lesson",
    t:{ ar:"خطة درس نشط", en:"Active lesson plan" },
    p:{ ar:`أنت خبير في التعلم النشط. اكتب خطة درس لـ [عنوان الدرس] — مادة [المادة] — الصف [الصف] — زمن الحصة [45] دقيقة.
الأهداف من دليل المعلم: [الأهداف]
طبيعة الطلاب: [مثال: 28 طالباً، مستويات متفاوتة، 3 طلاب يحتاجون دعماً قرائياً]
المطلوب في جدول: المرحلة | الزمن | دور المعلم | دور الطالب | الاستراتيجية | أداة التقويم.
أضف: نشاط تهيئة مشوّق، نشاطاً تعاونياً، تمايزاً للمستويات، وبطاقة خروج.`,
        en:`You are an active-learning expert. Write a lesson plan for [lesson] — [subject] — grade [grade] — [45]-minute period.
Objectives from the teacher's guide: [objectives]
Student profile: [e.g., 28 students, mixed levels, 3 need reading support]
Output as a table: Phase | Time | Teacher role | Student role | Strategy | Assessment.
Include: an engaging hook, a cooperative activity, differentiation, and an exit ticket.` } },
  { task:"visuals",
    t:{ ar:"منظم بصري من نص الدرس", en:"Graphic organizer from lesson text" },
    p:{ ar:`حوّل النص التالي إلى منظم بصري مناسب (خريطة مفاهيم، أو مخطط مقارنة، أو تسلسل)، واختر النوع الأنسب وبيّن السبب.
اكتب محتوى كل عنصر بكلمات قليلة جداً. النص: [الصق النص]`,
        en:`Turn the following text into a suitable graphic organizer (concept map, comparison chart or sequence); choose the best type and explain why.
Keep every element to very few words. Text: [paste text]` } },
  { task:"media",
    t:{ ar:"كلمات أنشودة تعليمية", en:"Lyrics for a learning song" },
    p:{ ar:`اكتب كلمات أنشودة تعليمية قصيرة (3 مقاطع + لازمة) عن [المفهوم أو القاعدة] لطلاب الصف [الصف].
بلغة عربية فصيحة بسيطة، إيقاع سهل الحفظ، وتتضمن المعلومات الأساسية: [المعلومات].
بدون موسيقى صاخبة أو كلمات غير لائقة.`,
        en:`Write lyrics for a short learning song (3 verses + chorus) about [concept or rule] for grade [grade].
Simple language, an easy-to-memorize rhythm, including the key facts: [facts].` } },
  { task:"feedback",
    t:{ ar:"معيار تقييم (Rubric)", en:"Assessment rubric" },
    p:{ ar:`أنشئ معيار تقييم تحليلي (Rubric) لـ [المهمة: مثل مشروع/عرض/مقال] للصف [الصف].
4 معايير × 4 مستويات أداء (متميز 4 – متقن 3 – نامٍ 2 – مبتدئ 1)، بوصف سلوكي قابل للملاحظة لكل خلية، في جدول.
أضف سطراً بلغة يفهمها الطالب لكل معيار.`,
        en:`Create an analytic rubric for [task: project/presentation/essay] for grade [grade].
4 criteria × 4 performance levels (Exemplary 4 – Proficient 3 – Developing 2 – Beginning 1), with observable descriptors for every cell, as a table.
Add a student-friendly line for each criterion.` } },
  { task:"feedback",
    t:{ ar:"تغذية راجعة على كتابة طالب", en:"Feedback on student writing" },
    p:{ ar:`أنت معلم يقدم تغذية راجعة بنّاءة. هذا نص كتبه طالب في الصف [الصف] (بدون اسمه): [الصق النص]
المعيار: [الصق المعيار]
اكتب: نقطتي قوة محددتين، وأهم تحسينين مع مثال لكل منهما من النص نفسه، وسؤالاً يحفّزه على المراجعة.
بنبرة مشجعة ولغة مناسبة لعمره. لا تعِد كتابة النص بدلاً عنه.`,
        en:`You are a teacher giving constructive feedback. Here is a text by a grade [grade] student (no name): [paste text]
Criteria: [paste rubric]
Write: two specific strengths, the two most important improvements each with an example from the text, and a question that prompts revision.
Encouraging tone; don't rewrite the text for them.` } },
  { task:"differentiation",
    t:{ ar:"نص بثلاثة مستويات قرائية", en:"Text at three reading levels" },
    p:{ ar:`أعد كتابة النص التالي بثلاثة مستويات مع الحفاظ على المعلومات العلمية نفسها:
1) مبسّط: جمل قصيرة ومفردات سهلة مع شرح الكلمات الصعبة.
2) أساسي: مستوى الصف [الصف].
3) إثرائي: معلومة إضافية وسؤال تحدٍّ.
النص: [الصق النص]`,
        en:`Rewrite the following text at three levels while keeping the same core information:
1) Simplified: short sentences, easy words, key terms explained.
2) Core: grade [grade] level.
3) Extension: an extra fact and a challenge question.
Text: [paste text]` } },
  { task:"interactive",
    t:{ ar:"تطبيق تفاعلي في ملف HTML واحد", en:"Interactive app in a single HTML file" },
    p:{ ar:`ابنِ لي تطبيقاً تعليمياً تفاعلياً في ملف HTML واحد (HTML + CSS + JavaScript في نفس الملف) بدون أي خادم.
الفكرة: [مثال: لعبة سحب وإفلات لتصنيف الكائنات الحية إلى فقاريات ولافقاريات]
الطلاب: الصف [الصف]
المطلوب:
- واجهة عربية بالكامل من اليمين لليسار، ألوان مريحة، خطوط كبيرة واضحة، تعمل على الجوال والآيباد.
- [10] عناصر/أسئلة، وتغذية راجعة فورية (صح/خطأ) مع تفسير قصير.
- عدّاد نقاط، وزر «إعادة المحاولة»، وشاشة نهاية تعرض النتيجة.
- المحتوى في مصفوفة واضحة في أعلى الكود لأتمكن من تعديله بسهولة.`,
        en:`Build an interactive learning app in a single HTML file (HTML + CSS + JavaScript in one file), no server.
Idea: [e.g., drag-and-drop game sorting animals into vertebrates and invertebrates]
Students: grade [grade]
Requirements:
- Clean, comfortable design, large readable text, works on phones and iPads.
- [10] items/questions with instant feedback (right/wrong) and a short explanation.
- A score counter, a “Try again” button and an end screen with the result.
- Content kept in a clear array at the top of the code so I can edit it easily.` } },
  { task:"research",
    t:{ ar:"ملخص مصدر مع التحقق", en:"Source summary with verification" },
    p:{ ar:`لخّص المصدر المرفق في: فكرة رئيسة (سطران) + 5 نقاط أساسية + 3 مصطلحات مع تعريفها + سؤالان للنقاش.
اذكر بعد كل نقطة رقم الصفحة أو الفقرة التي أخذتها منها. لا تضف أي معلومة من خارج المصدر.`,
        en:`Summarize the attached source as: main idea (2 lines) + 5 key points + 3 terms with definitions + 2 discussion questions.
After each point cite the page or paragraph it came from. Do not add anything from outside the source.` } },
  { task:"communication",
    t:{ ar:"رسالة لولي أمر", en:"Message to a parent" },
    p:{ ar:`اكتب رسالة لولي أمر طالب في الصف [الصف] بخصوص [الموضوع: مثل تراجع في الواجبات / تميّز في مشروع].
النبرة: [ودّية ومحترمة]، الطول: لا يزيد عن 6 أسطر، تبدأ بإيجابية، تذكر الملاحظة بشكل محدد، وتقترح خطوة تعاون واحدة واضحة، وتختم بشكر.
لا تذكر أي معلومات عن طلاب آخرين.`,
        en:`Write a message to the parent of a grade [grade] student about [topic: e.g., missed homework / excellence in a project].
Tone: [warm and respectful]; length: max 6 lines; start positively, state the observation specifically, suggest one clear next step together, end with thanks.` } }
],

/* ---------------------------------------------------------------------
   5) مسار التدريب
   --------------------------------------------------------------------- */
training: [
  { id:"basics", icon:"🌱", level:{ ar:"مبتدئ", en:"Beginner" }, mins:15,
    t:{ ar:"الذكاء الاصطناعي التوليدي للمعلم", en:"Generative AI for teachers" },
    d:{ ar:"ما هو، ماذا يستطيع، وأين يخطئ.", en:"What it is, what it can do, and where it fails." },
    body:{ ar:[
      ["ما هو؟","نماذج لغوية تعلّمت من كميات ضخمة من النصوص، فتتوقع الكلام الأنسب لطلبك. هي لا «تعرف» الحقيقة، بل تولّد إجابة محتملة — لذلك تحتاج دائماً إلى مراجعتك."],
      ["أين يتفوق؟","المسودات الأولى، توليد أفكار وأمثلة، إعادة الصياغة والتبسيط، تحويل الصيغ (نص ← جدول ← أسئلة)، بناء أنشطة وتطبيقات بسيطة."],
      ["أين يخطئ؟","الأرقام والتواريخ والمراجع (قد يخترعها)، التفاصيل الدقيقة في المنهج السعودي، الحسابات الطويلة، والكتابة العربية داخل الصور."],
      ["القاعدة الذهبية","الذكاء الاصطناعي مساعد يكتب المسودة، وأنت المعلم الخبير الذي يراجع ويعدّل ويقرر."]
    ], en:[
      ["What is it?","Language models trained on huge amounts of text that predict the most fitting response to your request. They don't “know” the truth; they generate a likely answer — so they always need your review."],
      ["Where it shines","First drafts, generating ideas and examples, rewording and simplifying, converting formats (text → table → questions), building simple activities and apps."],
      ["Where it fails","Numbers, dates and references (it may invent them), fine curriculum details, long calculations, and Arabic text inside images."],
      ["The golden rule","AI is an assistant that drafts; you are the expert teacher who reviews, edits and decides."]
    ] },
    task:{ ar:"اطلب من أي مساعد شرح مفهوم من درسك القادم لطالب في صفك، ثم حدّد خطأً أو نقصاً واحداً في الإجابة.", en:"Ask any assistant to explain a concept from your next lesson to a student in your grade, then spot one error or gap in the answer." } },

  { id:"prompting", icon:"🎯", level:{ ar:"أساسي", en:"Core" }, mins:20,
    t:{ ar:"فن كتابة البرومبت", en:"The art of prompting" },
    d:{ ar:"إطار من 5 عناصر يضاعف جودة النتائج.", en:"A 5-part framework that multiplies output quality." },
    body:{ ar:[
      ["الإطار: د.م.س.ص.ق","الدور: «أنت معلم رياضيات خبير…» — المهمة: ماذا تريد بالضبط — السياق: الصف، الدرس، طبيعة الطلاب — الصيغة: جدول، نقاط، عدد الأسئلة — القيود: الطول، اللغة، ما يجب تجنبه."],
      ["قبل ✗","«اعمل لي أسئلة عن الكسور»"],
      ["بعد ✓","«أنت معلم رياضيات للصف الخامس. أنشئ 8 أسئلة اختيار من متعدد عن جمع الكسور مختلفة المقامات، متدرجة من السهل للصعب، 3 منها مواقف حياتية من السوق والمطبخ، مع مفتاح إجابة وشرح قصير لكل خطأ شائع.»"],
      ["حاوِر ولا تكتفِ بالمرة الأولى","اطلب التعديل: «اجعل السؤال 3 أصعب»، «أضف بديلاً خاطئاً شائعاً»، «اختصر إلى النصف». المحادثة الثانية والثالثة غالباً هي الأفضل."],
      ["أعطِ مثالاً","إذا أرفقت نموذجاً لسؤال أو نشاط يعجبك، ستقلّده الأداة بأسلوبك."]
    ], en:[
      ["The R.T.C.F.C framework","Role: “You are an expert math teacher…” — Task: exactly what you want — Context: grade, lesson, students — Format: table, bullets, number of questions — Constraints: length, language, what to avoid."],
      ["Before ✗","“Make me questions about fractions.”"],
      ["After ✓","“You are a grade 5 math teacher. Create 8 multiple-choice questions on adding fractions with unlike denominators, graded from easy to hard, 3 of them real-life situations from the market and kitchen, with an answer key and a short explanation of each common mistake.”"],
      ["Iterate","Ask for edits: “make Q3 harder”, “add a common wrong option”, “cut it in half”. The second or third turn is usually the best."],
      ["Give an example","Attach a sample question or activity you like and the tool will imitate your style."]
    ] },
    task:{ ar:"خذ برومبتاً من مكتبة البرومبتات، طبّقه على درسك، ثم حسّن النتيجة برسالتي متابعة.", en:"Take a prompt from the library, apply it to your lesson, then improve the result with two follow-up messages." } },

  { id:"agents", icon:"🤖", level:{ ar:"متوسط", en:"Intermediate" }, mins:25,
    t:{ ar:"ابنِ وكيلك التعليمي", en:"Build your teaching agent" },
    d:{ ar:"مساعد مخصص لمادتك يعمل بتعليماتك وملفاتك.", en:"A custom assistant for your subject that follows your instructions and files." },
    body:{ ar:[
      ["ما هو الوكيل؟","نسخة مخصصة من مساعد ذكي، تكتب لها التعليمات مرة واحدة وترفع لها ملفاتك، فتتصرف دائماً بنفس الطريقة دون إعادة الشرح كل مرة."],
      ["أين أبنيه؟","GPTs في ChatGPT، أو Gems في Gemini (متاح مع حساب Google للتعليم)، أو Projects في Claude، أو دفتر NotebookLM لمصادرك."],
      ["الخطوات","1) حدّد مهمة واحدة واضحة للوكيل. 2) انسخ «قالب تعليمات الوكيل» من قسم الوكلاء وعدّله. 3) ارفع ملفات المرجع (الدرس، دليل المعلم). 4) جرّبه بأسئلة طالب حقيقية وصحّح التعليمات. 5) شارك الرابط."],
      ["شاركه هنا","بعد نجاحه أضفه في «معرض المنتجات» بنوع «وكيل ذكاء اصطناعي» ليستفيد منه زملاؤك."]
    ], en:[
      ["What is an agent?","A customized version of an AI assistant: you write its instructions once and upload your files, and it behaves the same way every time."],
      ["Where to build it","GPTs in ChatGPT, Gems in Gemini (available with Google for Education accounts), Projects in Claude, or a NotebookLM notebook for your sources."],
      ["Steps","1) Pick one clear job for the agent. 2) Copy the agent instructions template from the Agents section and adapt it. 3) Upload reference files. 4) Test with real student questions and fix the instructions. 5) Share the link."],
      ["Share it here","Once it works, add it to the Products Showcase as an “AI agent” so colleagues benefit."]
    ] },
    task:{ ar:"ابنِ وكيلاً واحداً لدرس واحد، وجرّبه بخمسة أسئلة يتوقع أن يسألها طلابك.", en:"Build one agent for one lesson and test it with five questions your students would ask." } },

  { id:"apps", icon:"⚡", level:{ ar:"متقدم", en:"Advanced" }, mins:30,
    t:{ ar:"من الفكرة إلى تطبيق تفاعلي", en:"From idea to interactive app" },
    d:{ ar:"اصنع لعبة أو محاكاة لدرسك بدون برمجة، وانشرها هنا.", en:"Make a game or simulation for your lesson without coding, and publish it here." },
    body:{ ar:[
      ["الأداة","Claude (Artifacts) أو Gemini (Canvas) أو ChatGPT (Canvas): كلها تكتب الكود وتعرضه مباشرة لتجربته."],
      ["صِف التطبيق جيداً","من سيستخدمه؟ ماذا يظهر في الشاشة؟ ماذا يحدث عند كل ضغطة؟ كيف ينتهي؟ استخدم برومبت «تطبيق تفاعلي في ملف HTML واحد» من المكتبة."],
      ["جرّب وعدّل","افتحه على الجوال والكمبيوتر، واطلب التعديلات بوضوح: «الخط صغير»، «أضف صوتاً عند الإجابة الصحيحة»، «اجعل الأسئلة عشوائية»."],
      ["احفظه وارفعه","نزّل الملف بصيغة .html، ثم ارفعه في «أضف منتجك» بنوع «تطبيق HTML مرفوع» — سيعمل داخل المنصة مباشرة ويقدر زملاؤك يجربوه."]
    ], en:[
      ["The tool","Claude (Artifacts), Gemini (Canvas) or ChatGPT (Canvas): all write the code and render it instantly so you can try it."],
      ["Describe it well","Who uses it? What appears on screen? What happens on each click? How does it end? Use the “single HTML file app” prompt from the library."],
      ["Test and refine","Open it on a phone and a computer, and request changes clearly: “text is small”, “add a sound on correct answers”, “shuffle the questions”."],
      ["Save and upload","Download it as an .html file, then upload it via “Add your product” as an “Uploaded HTML app” — it runs right inside the platform for colleagues to try."]
    ] },
    task:{ ar:"اصنع تطبيقاً صغيراً من 5 أسئلة لدرس هذا الأسبوع وارفعه في المعرض.", en:"Make a small 5-question app for this week's lesson and upload it to the showcase." } },

  { id:"safety", icon:"🛡️", level:{ ar:"أساسي", en:"Core" }, mins:15,
    t:{ ar:"الاستخدام الآمن والأخلاقي", en:"Safe & ethical use" },
    d:{ ar:"حماية بيانات الطلاب، النزاهة الأكاديمية، والتحقق.", en:"Student data protection, academic integrity, verification." },
    body:{ ar:[
      ["بيانات الطلاب أولاً","لا ترفع أسماء الطلاب أو أرقام هوياتهم أو درجاتهم المرتبطة بأسمائهم أو صورهم إلى أي أداة. استبدل الأسماء بأرقام أو رموز."],
      ["تحقق قبل أن تنشر","راجع كل معلومة علمية وكل مرجع وكل مفتاح إجابة. أنت المسؤول عمّا يصل للطالب."],
      ["الشفافية","أخبر طلابك متى استخدمت الذكاء الاصطناعي في إعداد المادة، وعلّمهم أن يفعلوا الشيء نفسه."],
      ["النزاهة الأكاديمية","حدّد للطلاب بوضوح ما المسموح (العصف الذهني، الشرح) وما الممنوع (كتابة الواجب كاملاً)، وصمّم مهاماً تُظهر تفكير الطالب نفسه."],
      ["القيم والثقافة","تأكد أن الصور والأمثلة والنصوص تناسب قيمنا الإسلامية وثقافة المجتمع السعودي وعمر الطلاب. وراجع مبادئ أخلاقيات الذكاء الاصطناعي الصادرة عن الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)."]
    ], en:[
      ["Student data first","Never upload student names, ID numbers, grades linked to names, or photos to any tool. Replace names with numbers or codes."],
      ["Verify before you publish","Check every scientific fact, reference and answer key. You are responsible for what reaches students."],
      ["Transparency","Tell students when you used AI to prepare materials, and teach them to do the same."],
      ["Academic integrity","Tell students clearly what's allowed (brainstorming, explanations) and what's not (writing the whole assignment), and design tasks that reveal the student's own thinking."],
      ["Values & culture","Make sure images, examples and texts suit our Islamic values, Saudi culture and the students' age, and review the AI ethics principles issued by the Saudi Data & AI Authority (SDAIA)."]
    ] },
    task:{ ar:"راجع آخر مادة أعددتها بالذكاء الاصطناعي بقائمة: بيانات شخصية؟ معلومة غير متحقق منها؟ مناسبة للقيم والعمر؟", en:"Review the last AI-assisted material you made: any personal data? unverified facts? suitable for values and age?" } },

  { id:"share", icon:"🌟", level:{ ar:"للجميع", en:"Everyone" }, mins:10,
    t:{ ar:"شارك منتجك مع زملائك", en:"Share your product" },
    d:{ ar:"كيف تكتب شرحاً يجعل زميلك يطبّق فكرتك في 10 دقائق.", en:"How to write a guide that lets a colleague apply your idea in 10 minutes." },
    body:{ ar:[
      ["الفكرة","في سطرين: ما المشكلة التي يحلها منتجك؟ ولمن؟"],
      ["طريقة التنفيذ","خطوات مرقمة: الأداة التي استخدمتها، البرومبت، التعديلات التي طلبتها. أرفق البرومبت كاملاً — هو أثمن ما تشاركه."],
      ["طريقة الاستخدام","كيف تستخدمه في الحصة: متى، كم دقيقة، فردي أم مجموعات، وما الذي تلاحظه."],
      ["المنتج نفسه","رابط يعمل، أو ملف HTML يعمل داخل المنصة، أو ملف PDF/Word/PowerPoint، مع صورة غلاف."]
    ], en:[
      ["The idea","In two lines: what problem does your product solve, and for whom?"],
      ["How it was built","Numbered steps: the tool, the prompt, the edits you requested. Include the full prompt — it's the most valuable thing you share."],
      ["How to use it","How to use it in class: when, how many minutes, individual or groups, and what to look for."],
      ["The product itself","A working link, an HTML file that runs inside the platform, or a PDF/Word/PowerPoint file, with a cover image."]
    ] },
    task:{ ar:"أضف أول منتج لك من زر «أضف منتجك».", en:"Add your first product using “Add your product”." } }
],

/* ---------------------------------------------------------------------
   6) قوائم النموذج (المواد والمراحل)
   --------------------------------------------------------------------- */
subjects: [
  { id:"islamic", ar:"الدراسات الإسلامية والقرآن", en:"Islamic Studies & Quran" },
  { id:"arabic", ar:"اللغة العربية", en:"Arabic" },
  { id:"english", ar:"اللغة الإنجليزية", en:"English" },
  { id:"math", ar:"الرياضيات", en:"Mathematics" },
  { id:"science", ar:"العلوم", en:"Science" },
  { id:"physics", ar:"الفيزياء", en:"Physics" },
  { id:"chemistry", ar:"الكيمياء", en:"Chemistry" },
  { id:"biology", ar:"الأحياء", en:"Biology" },
  { id:"social", ar:"الدراسات الاجتماعية والتاريخ", en:"Social Studies & History" },
  { id:"digital", ar:"المهارات الرقمية والحاسب", en:"Digital Skills & Computing" },
  { id:"skills21", ar:"مهارات القرن 21", en:"21st Century Skills" },
  { id:"thinking", ar:"التفكير الناقد", en:"Critical Thinking" },
  { id:"art", ar:"التربية الفنية", en:"Art" },
  { id:"pe", ar:"التربية البدنية", en:"Physical Education" },
  { id:"lifeskills", ar:"المهارات الحياتية", en:"Life Skills" },
  { id:"admin", ar:"إداري / إشرافي", en:"Admin / Supervision" },
  { id:"other", ar:"أخرى", en:"Other" }
],
stages: [
  { id:"lower", ar:"الابتدائي (أولية)", en:"Lower primary" },
  { id:"upper", ar:"الابتدائي (عليا)", en:"Upper primary" },
  { id:"middle", ar:"المتوسط", en:"Intermediate" },
  { id:"secondary", ar:"الثانوي", en:"Secondary" },
  { id:"american", ar:"الدبلوم الأمريكي", en:"American Diploma" },
  { id:"all", ar:"كل المراحل", en:"All stages" }
],
/* أنواع المنتجات */
types: [
  { id:"link", icon:"🔗", ar:"تطبيق أو موقع برابط", en:"App / site link" },
  { id:"html", icon:"⚡", ar:"تطبيق HTML مرفوع", en:"Uploaded HTML app" },
  { id:"agent", icon:"🤖", ar:"وكيل ذكاء اصطناعي", en:"AI agent" },
  { id:"file", icon:"📎", ar:"ملف (PDF / Word / PowerPoint)", en:"File (PDF / Word / PowerPoint)" },
  { id:"prompt", icon:"💬", ar:"برومبت أو قالب", en:"Prompt or template" }
]
};
