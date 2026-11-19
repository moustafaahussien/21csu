/* =====================================================================
   منصة المعلم الذكي — المحتوى الثابت (الدليل • الأدوات • التدريب • البرومبتات)
   ---------------------------------------------------------------------
   هذا الملف هو "قاعدة المحتوى" للدليل. لتعديل أي نص أو إضافة أداة/مهمة/برومبت:
   عدّل هنا فقط، وكل الصفحات تتحدث تلقائياً.
   كل نص له نسختان: ar (عربي) و en (إنجليزي).
   آخر مراجعة لبيانات الأدوات: نوفمبر 2026 — الأسعار والخطط تتغير، راجع موقع الأداة.
   ملفات المحتوى: ai-data.js (الأدوات والمهام) • ai-guide-data.js (معايير الأدوات والتوصيات)
   ai-prompts.js (البرومبتات) • ai-agents.js (الوكلاء) • ai-training.js (التدريب) • ai-learn.js (المعرفة والسياسة)
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

/* قالب الوكيل الموحّد، مكتبة البرومبتات، ومسار التدريب أصبحت في ملفات مستقلة:
   ai-agents.js • ai-prompts.js • ai-training.js • ai-learn.js • ai-guide-data.js */

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
/* مستويات التعقيد (تُستخدم في البرومبتات والمنتجات) */
window.AI_DATA.levels = { b:{ ar:'مبتدئ', en:'Beginner' }, m:{ ar:'متوسط', en:'Intermediate' }, a:{ ar:'متقدم', en:'Advanced' } };
/* معايير تقييم المنتجات وأوزانها — يجب أن تطابق RATE_W في ai-script.gs */
window.AI_DATA.rateCriteria = [
  { id:'content', w:25, ar:'جودة المحتوى العلمي', en:'Content accuracy' },
  { id:'pedagogy', w:25, ar:'القيمة التربوية', en:'Pedagogical value' },
  { id:'design', w:20, ar:'جودة التصميم والتفاعل', en:'Design & interaction' },
  { id:'ease', w:15, ar:'سهولة الاستخدام', en:'Ease of use' },
  { id:'reuse', w:15, ar:'قابلية إعادة الاستخدام', en:'Reusability' }
];
