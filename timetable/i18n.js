/* منصة الإشراف التربوي — الترجمة (عربي / English)
 * تُترجم الواجهة فقط عند اختيار الإنجليزية، ولا تمسّ البيانات المخزنة.
 * لإضافة/تعديل ترجمة: أضف السطر في X (نص كامل) أو في R (نمط فيه أرقام/أسماء).
 */
(function () {
  "use strict";
  var AR = /[؀-ۿ]/;
  var LANG = "ar";
  try { LANG = localStorage.getItem("tt_lang") === "en" ? "en" : "ar"; } catch (e) {}
  window.LANG = LANG;
  window.LOC = function () { return LANG === "en" ? "en-GB" : "ar-SA-u-ca-gregory-nu-latn"; };
  window.LOCT = function () { return LANG === "en" ? "en-GB" : "ar-SA-u-nu-latn"; };
  window.setLang = function (l) { try { localStorage.setItem("tt_lang", l); } catch (e) {} location.reload(); };
  if (LANG !== "en") { window.TR = function (s) { return s; }; window.TRwalk = function () {}; return; }
  document.documentElement.lang = "en"; document.documentElement.dir = "ltr";

  /* ---------- نصوص كاملة ---------- */
  var X = {
    // العنوان والتبويبات
    "الإشراف التربوي": "Supervision",
    "منصة الإشراف التربوي": "Educational Supervision Platform",
    "منصة الإشراف التربوي – مدارس دار الذكر": "Educational Supervision Platform – Dar Al-Thikr Schools",
    "📩 الرسائل": "📩 Messages", "تغيير كود الدخول": "Change login code", "🔑 الكود": "🔑 Code", "خروج": "Log out",
    "حصص اليوم": "Today's Classes", "تذكيراتي": "My Reminders", "التقييمات": "Evaluations", "جدول معلم": "Teacher Timetable",
    "الإعدادات": "Settings", "المشرفون": "Supervisors",
    "اليوم السابق": "Previous day", "اليوم التالي": "Next day", "اليوم": "Today", "(اليوم)": "(Today)",
    "ابحث باسم معلم أو صف…": "Search by teacher or class…", "إظهار المعلمين بدون حصة": "Show teachers without a class",
    "إخفاء الحصص المنتهية": "Hide finished classes",
    // الدخول
    "مدارس دار الذكر": "Dar Al-Thikr Schools", "أدخل الكود الخاص بك": "Enter your code", "دخول": "Log in",
    "الكود يصلك من مشرف مهارات القرن 21. يُطلب مرة واحدة فقط على كل جهاز.": "You receive the code from the 21st Century Skills supervisor. It is asked only once on each device.",
    "اكتب الكود أولًا": "Enter the code first", "الصفحة لم تُربط بالخادم بعد (config.js).": "The page is not linked to the server yet (config.js).",
    "جارٍ التحقق…": "Checking…", "الكود غير صحيح أو غير مفعّل": "Wrong or inactive code", "تعذّر الدخول، حاول مرة أخرى": "Couldn't log in, please try again",
    "تعذّر الاتصال بالخادم. تأكد من الإنترنت وحاول مرة أخرى.": "Couldn't reach the server. Check your internet and try again.",
    "تسجيل الخروج من هذا الجهاز؟": "Log out from this device?", "بياناتك محفوظة على الخادم، وتعود عند إدخال الكود مرة أخرى.": "Your data is saved on the server and comes back when you enter your code again.",
    "الكود المحفوظ على هذا الجهاز لم يعد يعمل. إذا غيّرت كودك من جهاز آخر فادخل بالكود الجديد، وإلا تواصل مع مشرف مهارات القرن 21.": "The code saved on this device no longer works. If you changed your code on another device, log in with the new code; otherwise contact the 21st Century Skills supervisor.",
    // المزامنة
    "جارٍ الحفظ…": "Saving…", "محفوظ ✓": "Saved ✓", "متزامن ✓": "Synced ✓", "جارٍ المزامنة…": "Syncing…",
    "⚠️ لم يُحفظ على الخادم بعد — محفوظ على هذا الجهاز، سنحاول مرة أخرى": "⚠️ Not saved to the server yet — saved on this device, we'll retry",
    "تعذّرت المزامنة — يعمل من نسخة هذا الجهاز": "Sync failed — working from this device's copy", "بدون اتصال — يعمل من نسخة هذا الجهاز": "Offline — working from this device's copy",
    "تعذّر الاتصال بالخادم": "Couldn't reach the server",
    // حصص اليوم
    "لم يُرفع جدول الحصص بعد.": "No timetable uploaded yet.", "اذهب إلى تبويب": "Go to the", "«الإعدادات»": "«Settings» tab",
    "«رفع جدول الحصص من ملف Excel»": "«Upload timetable from Excel»", "وارفع ملف جدولك.": "and upload your timetable file.",
    "فسحة/صلاة أو لا توجد حصص الآن": "Break/prayer or no classes now", "جارية الآن": "In progress", "لا يوجد": "None",
    "الحصة القادمة": "Next period", "انتهت حصص اليوم": "Today's classes are over", "تذكيراتك في هذا اليوم": "Your reminders this day",
    "لا توجد حصص مطابقة للبحث/الفلاتر.": "No classes match the search/filters.", "القادمة": "Next", "انتهت": "Finished",
    "لا توجد حصص لعرضها.": "No classes to show.", "حصص اليوم ": "Today's classes", "حصص اليوم:": "Today's classes:",
    "إجازة، لا توجد حصص. اختر يومًا آخر.": "is a day off — no classes. Pick another day.",
    "تعديل التذكير": "Edit reminder", "إضافة تذكير": "Add reminder",
    "كل الجداول": "All timetables", "كل المواد": "All subjects", "كل المراحل": "All stages", "كل المعلمين": "All teachers",
    "بدون حصة": "No class", "بدون حصة:": "No class:", "غير محدد": "Unspecified", "اجتماع": "Meeting",
    // المراحل
    "ابتدائي": "Primary", "متوسط": "Intermediate", "ثانوي": "Secondary", "المتوسط": "Intermediate", "الثانوي": "Secondary",
    "المسار الأمريكي": "American Track", "ابتدائي (الصفوف العليا)": "Primary (upper grades)", "ابتدائي (4–6)": "Primary (4–6)",
    "الصفوف الأولية": "Early grades (1–3)", "المسار الأمريكي – Primary": "American Track – Primary", "المسار الأمريكي – Middle": "American Track – Middle",
    // الأيام
    "الأحد": "Sunday", "الاثنين": "Monday", "الثلاثاء": "Tuesday", "الأربعاء": "Wednesday", "الخميس": "Thursday", "الجمعة": "Friday", "السبت": "Saturday",
    // التذكيرات
    "تذكير قبل الحصة": "Reminder before class", "كل أسبوع في نفس الحصة": "Every week, same period", "التنبيه قبلها بـ": "Alert before by",
    "ملاحظة (اختياري):": "Note (optional):", "مثال: زيارة صفية": "e.g. classroom visit", "حذف التذكير": "Delete reminder",
    "إلغاء": "Cancel", "حفظ": "Save", "تم حذف التذكير": "Reminder deleted", "تم حفظ التذكير ✓": "Reminder saved ✓",
    "لا توجد تذكيرات بعد.": "No reminders yet.", "من تبويب «حصص اليوم» اضغط زر الجرس 🔕 على أي حصة لإضافة تذكير.": "In «Today's Classes», tap the bell 🔕 on any class to add a reminder.",
    "مرة واحدة": "Once", "📅 إضافة لتقويم الجوال": "📅 Add to phone calendar", "تقويم Google": "Google Calendar", "حذف": "Delete",
    "📲 التنبيه على الجوال (حتى لو الصفحة مغلقة)": "📲 Phone alerts (even when the page is closed)",
    "فعّل التنبيهات مرة واحدة على كل جهاز تريد أن يصلك عليه التنبيه. يصلك إشعار بصوت قبل كل حصة حددتها بالمدة التي اخترتها.": "Enable alerts once on every device you want them on. You'll get a sound notification before each class you marked, by the time you chose.",
    "🔔 تفعيل التنبيهات على هذا الجهاز": "🔔 Enable alerts on this device", "إرسال تنبيه تجريبي": "Send a test alert",
    "على الآيفون: افتح هذه الصفحة من Safari ← زر المشاركة": "On iPhone: open this page in Safari → Share button",
    "«إضافة إلى الشاشة الرئيسية»": "«Add to Home Screen»", "، ثم افتح الصفحة من الأيقونة الجديدة واضغط «تفعيل التنبيهات».": ", then open the page from the new icon and tap «Enable alerts».",
    "التنبيه داخل الصفحة يعمل ما دامت الصفحة مفتوحة (حتى لو كانت في تبويب آخر). ولتصلك والصفحة مغلقة فعّل «التنبيه على الجوال» بالأعلى.": "In-page alerts work while the page is open (even in another tab). To get them when the page is closed, enable «Phone alerts» above.",
    "التنبيه بالصوت داخل الصفحة يعمل ما دامت مفتوحة. ولتصلك التنبيهات والصفحة مغلقة فعّل «التنبيه على الجوال» بالأعلى (أو أضف التذكير لتقويمك إن أحببت).": "In-page sound alerts work while the page is open. To get alerts when it's closed, enable «Phone alerts» above (or add the reminder to your calendar).",
    "التنبيه قبل الحصة بـ": "Alert before class by", "جرّب صوت التنبيه": "Test alert sound", "تفعيل إشعارات المتصفح": "Enable browser notifications",
    "📅 كل التذكيرات إلى التقويم": "📅 All reminders to calendar", "حذف التذكيرات المنتهية": "Delete finished reminders",
    "أضف الصفحة للشاشة الرئيسية أولًا": "Add the page to the Home Screen first", "هذا المتصفح لا يدعم الإشعارات": "This browser doesn't support notifications",
    "✓ التنبيهات مفعّلة على هذا الجهاز": "✓ Alerts are enabled on this device", "غير مفعّلة": "Not enabled", "إعادة التفعيل": "Re-enable",
    "الإشعارات محظورة لهذه الصفحة من إعدادات المتصفح": "Notifications are blocked for this page in browser settings",
    "لتفعيل التنبيهات على أندرويد:": "To enable alerts on Android:", "1) افتح الرابط في": "1) Open the link in",
    "(وليس متصفح الجوال الافتراضي ولا من داخل واتساب).": "(not the phone's default browser, and not inside WhatsApp).",
    "2) إعدادات الجوال ← التطبيقات ← Chrome ← الإشعارات ←": "2) Phone Settings → Apps → Chrome → Notifications →", "تشغيل": "On",
    "3) في Chrome: ⋮ ← الإعدادات ← إعدادات المواقع ← الإشعارات ← تأكد أنها مسموحة، ولو كان موقع moustafaahussien.github.io في «محظور» احذفه منها.": "3) In Chrome: ⋮ → Settings → Site settings → Notifications → make sure they're allowed; if moustafaahussien.github.io is under «Blocked», remove it.",
    "4) لو جوالك هونر/هواوي: تأكد أن تطبيق": "4) On Honor/Huawei phones: make sure", "موجود ومحدّث، وألغِ «تحسين البطارية» لتطبيق Chrome.": "is installed and updated, and turn off «Battery optimization» for Chrome.",
    "5) أغلق الصفحة وافتحها من جديد ثم اضغط «تفعيل التنبيهات».": "5) Close and reopen the page, then tap «Enable alerts».",
    "على الآيفون أضف الصفحة للشاشة الرئيسية أولًا": "On iPhone, add the page to the Home Screen first", "هذا المتصفح لا يدعم التنبيهات": "This browser doesn't support alerts",
    "الإشعارات محظورة لهذه الصفحة": "Notifications are blocked for this page", "الإشعارات محظورة — لإلغاء الحظر": "Notifications are blocked — to unblock:",
    "جارٍ التفعيل…": "Enabling…", "لم تتم الموافقة على الإشعارات": "Notifications were not allowed", "لم يكتمل الاشتراك على هذا الجهاز": "Subscription didn't complete on this device",
    "تم التفعيل ✓ — جرّب «إرسال تنبيه تجريبي»": "Enabled ✓ — try «Send a test alert»", "تعذّر التفعيل": "Couldn't enable", "جارٍ الإرسال…": "Sending…",
    "✓ أُرسل — يصلك خلال ثوانٍ (اقفل الشاشة للتجربة)": "✓ Sent — it arrives in seconds (lock the screen to test)",
    "لا يوجد جهاز مفعّل بعد — اضغط «تفعيل التنبيهات» أولًا": "No enabled device yet — tap «Enable alerts» first", "تعذّر الاتصال": "Connection failed",
    "لا توجد تذكيرات قادمة": "No upcoming reminders", "افتح الملف الذي نزل ليضاف إلى تقويمك مع التنبيه": "Open the downloaded file to add it to your calendar with the alert",
    "حصة تبدأ قريبًا": "A class starts soon", "🔔 حصة تبدأ قريبًا": "🔔 A class starts soon", "🔔 حصة تبدأ قريبًا!": "🔔 A class starts soon!", "تم": "OK",
    "الافتراضي للتذكيرات الجديدة:": "Default for new reminders:", "لو لم تسمع الصوت ارفع صوت الجهاز وألغِ الوضع الصامت": "If you don't hear it, turn up the volume and turn off silent mode",
    "تم تفعيل الإشعارات ✓": "Notifications enabled ✓", "لم تُفعَّل الإشعارات — سيظهر التنبيه داخل الصفحة مع الصوت": "Notifications not enabled — the alert will show in the page with sound",
    "الإشعارات غير مدعومة هنا — سيظهر التنبيه داخل الصفحة مع الصوت": "Notifications aren't supported here — the alert will show in the page with sound", "تم الحذف": "Deleted",
    // جدول معلم والإعدادات
    "كل معلمي الجدول": "All teachers in the timetable", "حصة أسبوعيًا": "lessons/week",
    "هذه الإعدادات للعرض فقط؛ يعدّلها صاحب الصفحة.": "These settings are view-only; the page owner edits them.",
    "اسم القسم / الوحدة": "Department / unit name", "يظهر أعلى الصفحة (مثال: وحدة مهارات القرن 21، قسم الرياضيات).": "Shown at the top of the page (e.g. 21st Century Skills Unit, Math Department).",
    "اسم القسم": "Department name", "توقيت الحصص": "Period times",
    "لكل مرحلة توقيتها حسب الجداول الزمنية الرسمية للفصل الأول 1448هـ (الثانوي حسب التوقيت الشتوي — 7 حصص). كل صف يتبع توقيت مرحلته تلقائيًا، ويمكن تغيير ذلك من عمود «التوقيت» في جدول «مرحلة كل صف».": "Each stage has its own times per the official 1st-term 1448H schedules (secondary uses the winter schedule — 7 periods). Each class follows its stage's times automatically; change it from the «Timing» column in «Stage of each class».",
    "إرجاع التوقيت الرسمي": "Reset to official times", "تم إرجاع التوقيت الرسمي ✓": "Official times restored ✓",
    "أسماء الجداول": "Timetable names", "كل ورقة في ملف Excel تظهر هنا كجدول مستقل. سمِّها باسم واضح (مثل: بنين ابتدائي، بنات، المسار الأمريكي).": "Each sheet in the Excel file appears here as a separate timetable. Give it a clear name (e.g. Boys Primary, Girls, American Track).",
    "الورقة في الملف": "Sheet in file", "المعلمون": "Teachers", "الاسم الظاهر": "Display name",
    "مادة كل معلم": "Each teacher's subject", "اختر المادة أو اكتب مادة جديدة.": "Pick the subject or type a new one.",
    "المعلم": "Teacher", "عدد الحصص": "Lessons", "المادة": "Subject", "(من جدول المدرسة)": "(from the school timetable)",
    "مرحلة كل صف": "Stage of each class", "حدد المرحلة لكل صف دراسي.": "Set the stage for each class.",
    "المعلم/المادة": "Teacher/subject", "الشُعب": "Sections", "المرحلة": "Stage", "التوقيت": "Timing",
    "رفع جدول الحصص من ملف Excel": "Upload timetable from Excel",
    "ارفع ملف Excel بهذا الشكل (وعند تغيّر الجدول ارفع الملف الجديد): الأيام في العمود الأول، وأرقام الحصص في الصف العلوي، وفي كل خلية سطر لكل معلم بالصيغة «الاسم الصف» مثل «الشهري 6-د» أو «Hussain 5B». الاسم بدون صف يعني أن المعلم بدون حصة. الإعدادات والتذكيرات تبقى كما هي. لو في الملف أكثر من ورقة، ستُقرأ كل الأوراق كجداول منفصلة؛ احذف الأوراق غير المطلوبة قبل الرفع.": "Upload an Excel file in this layout (upload the new file whenever the timetable changes): days in the first column, period numbers in the top row, and in each cell one line per teacher as «name class», e.g. «Alshehri 6-D» or «Hussain 5B». A name without a class means the teacher is free. Settings and reminders stay as they are. If the file has several sheets, each is read as a separate timetable; delete unneeded sheets before uploading.",
    "نسخة احتياطية": "Backup", "انسخ الإعدادات كنص واحفظه عندك، أو الصق نسخة سابقة لاسترجاعها.": "Copy the settings as text and keep it, or paste an earlier copy to restore it.",
    "نسخ الإعدادات": "Copy settings", "استرجاع من نص": "Restore from text", "تم الحفظ ✓": "Saved ✓",
    "التحديث متاح لصاحب الصفحة فقط.": "Only the page owner can update.", "جارٍ القراءة…": "Reading…",
    "لم أجد أيامًا وأرقام حصص في الملف": "No days and period numbers were found in the file", "تعذّر تحميل قارئ Excel": "Couldn't load the Excel reader",
    "تم النسخ ✓ — الصقه في ملف نصي واحفظه": "Copied ✓ — paste it into a text file and save it", "حدّد النص الظاهر وانسخه يدويًا": "Select the text shown and copy it manually",
    "الصق النسخة الاحتياطية هنا ثم اضغط «استرجاع من نص» مرة أخرى": "Paste the backup here, then tap «Restore from text» again",
    "تم الاسترجاع ✓": "Restored ✓", "النص غير صالح": "Invalid text", "الجدول": "Timetable",
    "الذكاء العاطفي": "Emotional Intelligence", "التصميم من أجل التغيير": "Design for Change",
    // المشرفون (المدير)
    "📩 إرسال رسالة للمشرفين": "📩 Send a message to supervisors",
    "تصل كإشعار على جوالات المشرفين الذين فعّلوا التنبيهات، وتظهر أيضًا في «📩 الرسائل» داخل الصفحة لكل المستلمين.": "Arrives as a phone notification for supervisors who enabled alerts, and also appears in «📩 Messages» in the page for all recipients.",
    "العنوان (اختياري) — مثال: اجتماع المشرفين": "Title (optional) — e.g. Supervisors' meeting", "نص الرسالة": "Message text",
    "كل المشرفين": "All supervisors", "مشرفون محددون": "Selected supervisors", "إرسال": "Send", "الرسائل المرسلة سابقًا": "Previously sent messages",
    "إضافة مشرف جديد": "Add a new supervisor", "اسم المشرف": "Supervisor name", "القسم / الوحدة (مثال: قسم الرياضيات)": "Department / unit (e.g. Math Department)",
    "إضافة وإنشاء كود": "Add and create code", "تحديث": "Refresh", "جارٍ التحميل…": "Loading…",
    "لا يوجد مشرفون بعد.": "No supervisors yet.", "الاسم": "Name", "القسم / الوحدة": "Department / unit", "الكود": "Code", "الحالة": "Status",
    "آخر حفظ": "Last saved", "إجراءات": "Actions", "مدير": "Admin", "أنت": "You", "مفعّل": "Active", "موقوف": "Suspended", "لم يدخل بعد": "Not logged in yet",
    "نسخ رسالة الدعوة": "Copy invite message", "تعديل": "Edit", "كود جديد": "New code",
    "نسخ رسالة الدعوة (الرابط + الكود)": "Copy invite message (link + code)", "نسخ الكود فقط": "Copy code only", "اكتب اسم المشرف": "Enter the supervisor's name",
    "إيقاف المشرف؟": "Suspend supervisor?", "الدخول حتى تعيد تفعيله. بياناته تبقى محفوظة.": "log in until you reactivate them. Their data stays saved.", "إيقاف": "Suspend",
    "إنشاء كود جديد؟": "Create a new code?", "سيتوقف فورًا، وبياناته تنتقل للكود الجديد. ستحتاج إرسال الكود الجديد له.": "will stop immediately and their data moves to the new code. You'll need to send them the new code.",
    "إنشاء كود جديد": "Create new code", "حذف المشرف نهائيًا؟": "Delete supervisor permanently?",
    "وكل بياناته (جدوله وإعداداته وتذكيراته) ولا يمكن استرجاعها. إذا أردت منعه مؤقتًا فقط استخدم «إيقاف» بدلًا من الحذف.": "and all their data (timetable, settings and reminders) will be deleted and can't be recovered. To block them temporarily, use «Suspend» instead.",
    "حذف نهائي": "Delete permanently", "تعديل بيانات المشرف": "Edit supervisor details",
    "جارٍ التنفيذ…": "Working…", "هذه الصلاحية للمدير فقط": "This is for the admin only", "لا يمكن تنفيذ هذا على حسابك أنت": "You can't do this to your own account",
    "تم ✓": "Done ✓", "تعذّر الاتصال، حاول مرة أخرى": "Connection failed, try again", "تم النسخ ✓": "Copied ✓", "انسخ النص يدويًا": "Copy the text manually",
    "لا يوجد مشرفون": "No supervisors", "اكتب نص الرسالة": "Write the message text", "اختر مشرفًا واحدًا على الأقل": "Choose at least one supervisor",
    "إرسال الرسالة؟": "Send the message?", "(مع إشعار على الجوالات المفعّلة)": "(with a notification on enabled phones)",
    "— ظهرت في صندوق الرسائل، ولم يُرسل إشعار جوال (لا توجد أجهزة مفعّلة بعد)": "— it appears in the inbox; no phone notification was sent (no enabled devices yet)",
    "الخادم لم يُحدَّث بعد لدعم الرسائل": "The server hasn't been updated for messages yet", "الكل": "All", "لا توجد رسائل مرسلة.": "No sent messages.",
    "لا توجد رسائل.": "No messages.", "إغلاق": "Close",
    // تغيير الكود
    "🔑 تغيير كود الدخول": "🔑 Change login code", "كودك الحالي:": "Your current code:", "اختر كودًا جديدًا من": "Choose a new code of",
    "6 إلى 16 خانة": "6 to 16 characters", "فيه": "with", "حروف إنجليزية وأرقام": "English letters and digits",
    "معًا، أو اضغط «كود عشوائي». جدولك وتذكيراتك ورسائلك تنتقل كلها للكود الجديد.": "together, or tap «Random code». Your timetable, reminders and messages all move to the new code.",
    "الكود الجديد": "New code", "اكتب الكود الجديد مرة أخرى للتأكيد": "Type the new code again to confirm", "🎲 كود عشوائي": "🎲 Random code",
    "تغيير الكود": "Change code", "الكودان غير متطابقين.": "The two codes don't match.", "جارٍ حفظ تعديلاتك أولًا…": "Saving your changes first…",
    "تعذّر تغيير الكود، حاول مرة أخرى.": "Couldn't change the code, try again.", "✓ تم تغيير الكود": "✓ Code changed", "كودك الجديد:": "Your new code:",
    "احفظ الكود في مكان آمن": "Keep the code somewhere safe", "— الكود القديم توقف ولن يعمل بعد الآن.": "— the old code has stopped and won't work anymore.",
    "• هذا الجهاز انتقل للكود الجديد تلقائيًا.": "• This device switched to the new code automatically.",
    "• على أجهزتك الأخرى: سيُطلب منك الدخول مرة أخرى — ادخل بالكود الجديد.": "• On your other devices you'll be asked to log in again — use the new code.",
    "• التنبيهات تستمر في الوصول لأجهزتك المفعّلة.": "• Alerts keep reaching your enabled devices.", "نسخ الكود": "Copy code",
    "الكود يجب أن يكون من 6 إلى 16 خانة، حروف إنجليزية وأرقام فقط (بدون مسافات أو رموز).": "The code must be 6–16 characters, English letters and digits only (no spaces or symbols).",
    "الكود ضعيف — لازم يحتوي على حروف وأرقام معًا وما يكونش متكرر (مثل AAA111).": "Weak code — it must mix letters and digits and not be repetitive (like AAA111).",
    "هذا هو كودك الحالي نفسه.": "That's your current code.", "هذا الكود مستخدم — اختر كودًا آخر.": "This code is taken — choose another.",
    "غيّرت الكود عدة مرات خلال الساعة الأخيرة. حاول لاحقًا.": "You changed the code several times in the last hour. Try later.",
    "كودك الحالي لم يعد يعمل. سجّل الدخول من جديد.": "Your current code no longer works. Log in again.",
    "تعديلاتك الأخيرة لم تُحفظ على الخادم بعد (تحقق من الإنترنت). حاول بعد قليل.": "Your latest changes aren't saved to the server yet (check your internet). Try again shortly.",
    "جارٍ تغيير الكود…": "Changing code…",
    "تعذّر الاتصال بالخادم. تحقق من الإنترنت ثم جرّب الدخول بكودك الحالي؛ إن لم يعمل فادخل بالكود الجديد.": "Couldn't reach the server. Check your internet, then try logging in with your current code; if it fails, use the new code.",
    "تعذّر الاتصال بالخادم، لم يتغير الكود. حاول مرة أخرى.": "Couldn't reach the server; the code didn't change. Try again.",
    "الخادم لم يُحدَّث بعد لدعم تغيير الكود. لم يتغير كودك — حاول لاحقًا.": "The server doesn't support code changes yet. Your code didn't change — try later.",
    // التقييم
    "📝 تقييم المعلم": "📝 Evaluate teacher", "الحصة غير موجودة": "Class not found",
    "📝 استمارة ملاحظة بيئة التعلم (حصة صفية)": "📝 Learning Environment Observation Form (classroom)",
    "استمارة ملاحظة بيئة التعلم (حصة صفية)": "Learning Environment Observation Form (classroom)",
    "اسم المعلم": "Teacher name", "الفصل": "Class", "تاريخ الزيارة": "Visit date", "موضوع الدرس": "Lesson topic", "اكتب موضوع الدرس": "Write the lesson topic",
    "اسم المُقيِّم": "Evaluator", "المُقيِّم": "Evaluator", "متوسط أداء الشعبة": "Section performance average", "اختياري": "Optional",
    "رقم الزيارة": "Visit no.", "نوع الزيارة": "Visit type", "معلنة": "Announced", "غير معلنة": "Unannounced",
    "1 = لا يوجد دليل · 2 = دليل ضعيف · 3 = يوجد دليل إلى حد ما · 4 = يوجد دليل · 5 = يوجد دليل قوي": "1 = No evidence · 2 = Weak evidence · 3 = Some evidence · 4 = Evident · 5 = Very evident",
    "1 = لا يوجد دليل، 2 = دليل ضعيف، 3 = يوجد دليل إلى حد ما، 4 = يوجد دليل، 5 = يوجد دليل قوي": "1 = No evidence, 2 = Weak evidence, 3 = Some evidence, 4 = Evident, 5 = Very evident",
    "لا يوجد دليل": "No evidence", "دليل ضعيف": "Weak evidence", "يوجد دليل إلى حد ما": "Some evidence", "يوجد دليل": "Evident", "يوجد دليل قوي": "Very evident",
    "ملاحظات المُقيِّم": "Evaluator's notes", "✅ ممارسات جيدة": "✅ Good practices", "💡 توصيات لتجويد التعلم": "💡 Recommendations to improve learning",
    "ممارسات جيدة": "Good practices", "توصيات لتجويد التعلم": "Recommendations to improve learning",
    "📋 قوالبي": "📋 My templates", "اكتب أو أضف من «قوالبي»": "Type, or add from «My templates»", "🪞 تأملات المعلم": "🪞 Teacher's reflections",
    "تأملات المعلم": "Teacher's reflections", "تأملات المعلم بعد مناقشة الزيارة (اختياري)": "Teacher's reflections after discussing the visit (optional)",
    "*Reference: Effective Learning Environments Observation Tool® (eleot® 2.0) — إدارة الإشراف والتطوير التربوي": "*Reference: Effective Learning Environments Observation Tool® (eleot® 2.0) — Educational Supervision & Development",
    "💾 حفظ التقييم": "💾 Save evaluation", "🖨️ طباعة / PDF": "🖨️ Print / PDF", "🖨️ طباعة": "🖨️ Print", "فتح": "Open",
    "حذف التقييم؟": "Delete evaluation?", "تم حذف التقييم": "Evaluation deleted", "تم حفظ التقييم ✓": "Evaluation saved ✓",
    "⚠️ اختر نوع الزيارة (معلنة / غير معلنة)": "⚠️ Choose the visit type (announced / unannounced)",
    "إغلاق بدون حفظ؟": "Close without saving?", "لديك تعديلات على هذا التقييم لم تُحفظ.": "You have unsaved changes to this evaluation.", "إغلاق بدون حفظ": "Close without saving",
    "اضغط للإضافة": "Tap to add", "لا توجد قوالب بعد.": "No templates yet.", "＋ قالب جديد": "＋ New template",
    "حفظ السطر المحدد/الأخير كقالب": "Save selected/last line as template", "اضغط القالب لإضافته للنص، ثم أكمل مكان": "Tap a template to add it, then fill in",
    ". القوالب خاصة بك وتظهر في كل تقييماتك.": ". Templates are yours only and appear in all your evaluations.",
    "اكتب نصًا أولًا أو حدّده": "Type or select some text first", "هذا القالب موجود": "This template already exists", "تم حفظه كقالب ✓": "Saved as template ✓",
    "نص القالب — استخدم [...] لمكان تكمله عند الإضافة": "Template text — use [...] for a spot to fill in when adding", "حفظ القالب": "Save template",
    "اسمح بالنوافذ المنبثقة لهذه الصفحة للطباعة": "Allow pop-ups for this page to print",
    "وزارة التعليم": "Ministry of Education", "الإدارة العامة للتعليم بمحافظة جدة": "General Administration of Education – Jeddah",
    "مكتب التعليم الخاص": "Private Education Office", "مدارس دار الذكر الأهلية للبنين": "Dar Al-Thikr Private Schools for Boys",
    "مكتب الإشراف والتطوير التربوي": "Educational Supervision & Development Office", "إدارة الإشراف والتطوير التربوي": "Educational Supervision & Development",
    "الدرجة الكلية": "Total score", "الدرجة المستحقة": "Score earned", "الفئة الوصفية": "Rating", "المجال الرئيس": "Main domain", "المجالات الفرعية": "Sub-domains",
    "عدد التقييمات": "Evaluations", "كلها مكتملة": "All complete", "متوسط الدرجات": "Average score", "معلمون تمت زيارتهم": "Teachers visited",
    "ابحث باسم معلم أو مادة أو صف…": "Search by teacher, subject or class…", "من": "From", "إلى": "To", "⬇️ تصدير Excel": "⬇️ Export Excel",
    "📊 ملخص المعلمين": "📊 Teacher summary", "📋 قوالبي الجاهزة": "📋 My ready templates",
    "قوالب خاصة بك وحدك تضيفها بضغطة في خانتي «ممارسات جيدة» و«توصيات لتجويد التعلم» داخل الاستمارة. اكتب": "Templates only you see, added with one tap to «Good practices» and «Recommendations to improve learning» in the form. Write",
    "في أي مكان تريد تكملته عند الإضافة.": "anywhere you want to fill in when adding.",
    "للتقييم: من «حصص اليوم» اضغط": "To evaluate: in «Today's Classes» tap", "«📝 تقييم المعلم»": "«📝 Evaluate teacher»", "على أي حصة جارية أو منتهية.": "on any class in progress or finished.",
    "عدد الزيارات المكتملة": "Completed visits", "متوسط الدرجة": "Average score", "آخر درجة": "Last score", "الفئة": "Rating",
    "يظهر هنا ملخص كل معلم بعد أول تقييم مكتمل.": "Each teacher's summary appears here after their first complete evaluation.",
    "لا توجد قوالب.": "No templates.", "استرجاع القوالب الافتراضية": "Restore default templates", "استرجاع القوالب الافتراضية؟": "Restore default templates?",
    "ستُستبدل قوالبك الحالية بالقوالب الافتراضية.": "Your current templates will be replaced with the defaults.", "استرجاع": "Restore",
    "لا توجد تقييمات للتصدير": "No evaluations to export", "تعذّر تحميل أداة Excel": "Couldn't load the Excel tool",
    "التاريخ": "Date", "الدرجة/100": "Score/100", "المتوسط/5": "Average/5", "الحصة": "Period", "غير مكتمل": "Incomplete",
    "استثنائي": "Exceptional", "متميز": "Distinguished", "متقدم": "Advanced", "قابل للتطوير": "Developing", "غير مرضٍ": "Unsatisfactory",
    // مجالات وبنود الاستمارة (eleot)
    "بيئة تعليمية عادلة": "Equitable Learning Environment", "بيئة تعليمية ذات توقعات عالية": "High Expectations Environment",
    "بيئة تعليمية داعمة": "Supportive Learning Environment", "بيئة التعلم النشط": "Active Learning Environment",
    "مراقبة التقدم والتغذية الراجعة": "Progress Monitoring & Feedback Environment", "بيئة تعلم جيدة الإدارة": "Well-Managed Learning Environment",
    "بيئة التعلم الرقمي": "Digital Learning Environment",
    "يشارك المتعلمون في فرص تعليمية متباينة تلبي احتياجاتهم.": "Learners engage in differentiated learning opportunities and/or activities that meet their needs.",
    "يتمتع المتعلمون بالعدالة في المشاركة والمناقشات والوصول إلى الموارد والتقنية والدعم.": "Learners have equal access to classroom discussions, activities, resources, technology and support.",
    "ينخرط المتعلمون في افتتاحية قوية للدرس تكون جاذبة للانتباه وغير تقليدية ومتسقة مع أهدافه.": "Learners engage in a strong, attention-grabbing, non-traditional lesson opening aligned with its objectives.",
    "يسعى المتعلمون إلى تحقيق التوقعات العالية التي وضعها المعلم (الأهداف السلوكية الذكية).": "Learners strive to meet or are able to articulate the high expectations set by the teacher (SMART objectives).",
    "يُنتج المتعلمون أعمالًا عالية الجودة ويستطيعون وصف خصائصها.": "Learners demonstrate and/or are able to describe high-quality work.",
    "يمارس المتعلمون منهجية مدارس التفكير (مفاتيح المفكرين – التفكير البصري – عادات العقل – فلسفة المتعلم).": "Learners practice the Thinking Schools approach (Thinker's Keys – Visual Thinking – Habits of Mind – Philosophy for Learners).",
    "يتحمل المتعلمون المسؤولية ويكونون موجهين ذاتيًا في تعلمهم.": "Learners take responsibility for and are self-directed in their learning.",
    "يُظهر المتعلمون حسًا إيجابيًا واندماجًا فعليًا في المجتمع الصفي.": "Learners demonstrate a sense of community that is positive, cohesive, engaged and purposeful.",
    "يخاطر المتعلمون في التعلم (دون خوف من ردود الفعل السلبية).": "Learners take risks in learning (without fear of negative feedback).",
    "يتم دعم المتعلمين من قبل المعلم أو من زملائهم أو بموارد أخرى فيما يخص فهم المحتوى.": "Learners are supported by the teacher, their peers and/or other resources to understand content.",
    "يتبادل المتعلمون الآراء فيما بينهم بإشراف المعلم.": "Learners' discussions/dialogues/exchanges with each other and the teacher predominate.",
    "يربط المتعلمون محتوى الدرس بخبراتهم وتجاربهم الواقعية.": "Learners make connections from content to real-life experiences.",
    "يتعاون المتعلمون مع زملائهم لإنجاز المشاريع والأنشطة والمهام.": "Learners collaborate with their peers to accomplish/complete projects, activities and tasks.",
    "يتلقى المتعلمون نتائج تقدم تعلمهم (التقييم من أجل التعلم).": "Learners monitor their own progress or have mechanisms for it (assessment for learning).",
    "يتلقى المتعلمون تغذية راجعة من معلمهم أو من زملائهم لتحسين الفهم ومراجعة العمل.": "Learners receive/respond to feedback from teachers/peers to improve understanding and/or revise work.",
    "يُظهر المتعلمون إدراكًا لطريقة تقييم تعلمهم.": "Learners understand and/or are able to explain how their work is assessed.",
    "يُظهر المتعلمون معرفةً بقواعد الصف والسلوك ويلتزمون بها.": "Learners demonstrate knowledge of and/or follow classroom rules and behavioral expectations.",
    "ينتقل المتعلمون بسلاسة وكفاءة من نشاط إلى آخر.": "Learners transition smoothly and efficiently from one activity to another.",
    "يستخدم المتعلمون وقت الحصة بشكل هادف.": "Learners use class time purposefully.",
    "يظهر المتعلمون القدرة على استخدام أدوات التعلم الرقمية (AI - معامل افتراضية – برامج تفاعلية - منصات).": "Learners use digital tools/technology to learn (AI – virtual labs – interactive programs – platforms)."
  };

  X["الصف"] = "Class"; X["منصة الإشراف التربوي –"] = "Educational Supervision Platform –"; X["وحدة مهارات القرن 21"] = "21st Century Skills Unit";
  /* ---------- أسماء المواد (للعرض فقط) ---------- */
  var SUBJ = {
    "رياضيات": "Math", "قرآن": "Quran", "لغتي": "Arabic (Lughati)", "علوم": "Science", "إسلامية": "Islamic Studies", "إنجليزي": "English",
    "لغة انجليزية": "English", "لغة إنجليزية": "English", "عربي": "Arabic", "اللغة العربية": "Arabic", "اجتماعيات": "Social Studies", "كيمياء": "Chemistry",
    "حاسب آلي": "Computer", "فيزياء": "Physics", "كفايات لغوية": "Language Competencies", "أحياء": "Biology", "معمل ح حاسب": "Computer Lab",
    "بدنية": "PE", "تفسير وقران": "Tafsir & Quran", "تقنية رقمية": "Digital Technology", "التقنية الرقمية": "Digital Technology", "سباحة": "Swimming",
    "علم أرض": "Earth Science", "تصميم رقمي": "Digital Design", "علوم تط": "Applied Science", "رياضيات تط": "Applied Math", "تصميم": "Design",
    "فنية": "Art", "القيادة": "Leadership", "مهارات حياتية": "Life Skills", "قدرات لفظية": "Verbal Aptitude", "تاريخ": "History",
    "رياضيات ذهنية": "Mental Math", "ذكاء عاطفي": "Emotional Intelligence", "قدرات كمي": "Quantitative Aptitude", "تصميم هندسي": "Engineering Design",
    "تحصيلي فيزياء": "Tahsili Physics", "تحصيلي رياضيات": "Tahsili Math", "دراسات أدبية": "Literary Studies", "أمن سيبراني": "Cybersecurity",
    "ذكاء اصطناعي": "Artificial Intelligence", "مباديء علوم صحية": "Principles of Health Sciences", "رعاية صحية": "Health Care",
    "أنظمة جسم الإنسان": "Human Body Systems", "هندسة": "Engineering", "الإحصاء": "Statistics", "إسلامية وقرآن": "Islamic Studies & Quran",
    "اجتماعيات وتاريخ": "Social Studies & History", "الهوية الوطنية": "National Identity", "التفكير الناقد": "Critical Thinking", "مهارات القرن 21": "21st Century Skills"
  };
  /* ---------- كلمات للأنماط ---------- */
  var ORD = { "الأول": 1, "الثاني": 2, "الثالث": 3, "الرابع": 4, "الخامس": 5, "السادس": 6, "السابع": 7, "الثامن": 8, "التاسع": 9, "العاشر": 10, "الحادي عشر": 11, "الثاني عشر": 12 };
  var LET = { "أ": "A", "ا": "A", "ب": "B", "ج": "C", "د": "D", "ه": "E", "هـ": "E", "و": "F", "ز": "G" };
  function sec(s) { return String(s).split("").map(function (c) { return LET[c] || c; }).join(""); }
  function n(x, one, many) { return x + " " + (Number(x) === 1 ? one : many); }
  function T(s) { var r = core(s); return r == null ? s : r; }

  /* ---------- أنماط (نص فيه أرقام/أسماء) ---------- */
  var R = [
    [/^(.+?)((?: [\d\u2066\u2069-]+)*)$/, function (m, sj, rest) { var r = SUBJ[sj.trim()]; return r ? r + rest : null; }],
    [/^منصة الإشراف التربوي – (.+)$/, function (m, a) { return "Educational Supervision Platform – " + a; }],
    [/^الصف (الحادي عشر|الثاني عشر|الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر)(?: (المتوسط|الثانوي))?(?: \/ ([^ (]+))?(?: \(قاعة (.+)\))?$/,
      function (m, o, st, s, room) { var g = ORD[o] + (st === "المتوسط" ? 6 : st === "الثانوي" ? 9 : 0); return "Grade " + g + (s ? " / " + sec(s) : "") + (room ? " (Room " + room + ")" : ""); }],
    [/^\(قاعة (.+)\)$/, "(Room $1)"], [/^قاعة (.+)$/, "Room $1"],
    [/^(\d+) حصة$/, function (m, x) { return n(x, "lesson", "lessons"); }],
    [/^(\d+) حصة أسبوعيًا\.?$/, function (m, x) { return x + " lessons/week"; }],
    [/^(\d+) دقائق$/, "$1 min"], [/^(\d+) د$/, "$1 min"],
    [/^الحصة (\d+)$/, "Period $1"],
    [/^الحصة (\d+) \((.+)\)$/, "Period $1 ($2)"],
    [/^بعد (\d+) دقيقة$/, "in $1 min"],
    [/^تبدأ بعد (\d+) دقيقة$/, "starts in $1 min"],
    [/^حصة تبدأ بعد (\d+) دقيقة$/, "A class starts in $1 min"],
    [/^(\d+) حصص تبدأ قريبًا$/, "$1 classes start soon"],
    [/^🔔 بعد (\d+) دقائق: حصة (.+)$/, "🔔 In $1 min: $2's class"],
    [/^(.+) \(اليوم\)$/, function (m, a) { return T(a) + " (Today)"; }],
    [/^هذا اليوم فقط \((.+)\)$/, "This day only ($1)"],
    [/^(.+) – الحصة (\d+) \((.+)\)$/, function (m, d, p, t) { return T(d) + " – Period " + p + " (" + t + ")"; }],
    [/^محفوظ ✓ (.+)$/, function (m, t) { return "Saved ✓ " + t.replace(" ص", " AM").replace(" م", " PM"); }],
    [/^أهلًا (.+)$/, "Welcome, $1"],
    [/^متوسط ([\d.]+\/\d+)$/, "Avg $1"], [/^([\d\/ ·]*)متوسط ([\d.]+\/5)( ·)?$/, "$1Avg $2$3"],
    [/^قُيّم (\d+) من (\d+) بندًا$/, "$1 of $2 items rated"],
    [/^غير مكتمل (\d+\/\d+)$/, "Incomplete $1"], [/^📝 غير مكتمل (\d+\/\d+)$/, "📝 Incomplete $1"],
    [/^غير مكتمل \((\d+)\/(\d+)\)$/, "Incomplete ($1/$2)"],
    [/^منها (\d+) غير مكتمل$/, "$1 incomplete"],
    [/^⚠️ (\d+) بند بدون درجة \(مظللة بالأحمر\)( — اضغط «حفظ» مرة أخرى للحفظ كمسودة)?$/, function (m, x, more) { return "⚠️ " + x + " item(s) without a score (highlighted in red)" + (more ? " — press «Save» again to save as a draft" : ""); }],
    [/^حُفظ التقييم \(غير مكتمل: (\d+) بند بدون درجة\)$/, "Evaluation saved (incomplete: $1 item(s) without a score)"],
    [/^(\d+)- (.+)$/, function (m, i, t) { var r = X[t]; return r ? i + "- " + r : null; }],
    [/^➕ (.+)$/, function (m, t) { var r = X[t]; return r ? "➕ " + r : null; }],
    [/^زيارة (\d+) \((.+)\)$/, function (m, x, t) { return "Visit " + x + " (" + T(t) + ")"; }],
    [/^سيصل إلى (\d+) مشرف$/, "Will reach $1 supervisor(s)"],
    [/^سترسل إلى (\d+) (مشرف محدد|مشرف \(الكل\))\.?$/, function (m, x, k) { return "Will be sent to " + x + (k.indexOf("الكل") >= 0 ? " supervisor(s) (all)" : " selected supervisor(s)"); }],
    [/^✓ أُرسلت إلى (\d+) مشرف(.*)$/, function (m, x, rest) { return "✓ Sent to " + x + " supervisor(s)" + T(rest.trim() ? " " + rest.trim() : ""); }],
    [/^رسالة من (.+)$/, "Message from $1"],
    [/^تعذّر الإرسال \((.*)\)$/, "Couldn't send ($1)"], [/^تعذّر التنفيذ \((.*)\)$/, "Couldn't complete ($1)"], [/^تعذّر التفعيل \((.*)\)$/, "Couldn't enable ($1)"],
    [/^تعذّرت قراءة الملف: ?(.*)$/, "Couldn't read the file: $1"],
    [/^تم ✓ — (\d+) جداول، (\d+) حصة أسبوعيًا\.?$/, "Done ✓ — $1 timetables, $2 lessons/week."],
    [/^انتهى \((.*)\)$/, "Ended ($1)"],
    [/^تذكير لحصة لم تعد في الجدول \((.*)\)$/, "Reminder for a class no longer in the timetable ($1)"],
    [/^🔁 كل (.+)$/, function (m, d) { return "🔁 Every " + T(d); }],
    [/^تنبيه قبلها بـ (\d+) د$/, "alert $1 min before"],
    [/^(.+) إجازة، لا توجد حصص\. اختر يومًا آخر\.$/, function (m, d) { return T(d) + " is a day off — no classes. Pick another day."; }],
    [/^الجدول (\d+)$/, "Timetable $1"],
    [/^(.+):$/, function (m, a) { var r = core(a); return r == null ? null : r + ":"; }],
    [/^(.+) \+ (.+)$/, function (m) { var p = m.split(" + "); var q = p.map(T); return q.join(" + "); }],
    [/^الكود الحالي لـ$/, "The current code of"], [/^الكود الجديد لـ$/, "New code for"], [/^تمت إضافة$/, "Added"],
    [/^— الكود:$/, "— code:"], [/^لن يستطيع$/, "won't be able to"], [/^سيُحذف$/, "Will delete"], [/^سيُحذف تقييم$/, "This will permanently delete the evaluation of"],
    [/^بتاريخ (.+) نهائيًا\.$/, "dated $1."], [/^بتاريخ$/, "dated"], [/^نهائيًا\.$/, "."],
    [/^لا توجد تقييمات( مطابقة| بعد)?\.?$/, function (m, k) { return k && k.indexOf("مطابقة") >= 0 ? "No matching evaluations." : "No evaluations yet."; }],
    [/^(✅ قوالب الممارسات الجيدة|💡 قوالب توصيات تجويد التعلم) \((\d+)\)$/, function (m, k, x) { return (k.indexOf("✅") === 0 ? "✅ Good-practice templates" : "💡 Recommendation templates") + " (" + x + ")"; }],
    [/^· إلى: (.+)$/, function (m, a) { return "· To: " + T(a); }],
    [/^استمارة ملاحظة – (.+)$/, "Observation form – $1"],
    [/^بند (\d+)$/, "Item $1"]
  ];

  function core(t) {
    if (Object.prototype.hasOwnProperty.call(X, t)) return X[t];
    for (var i = 0; i < R.length; i++) {
      var m = t.match(R[i][0]);
      if (m) { var f = R[i][1]; var r = typeof f === "function" ? f.apply(null, m) : t.replace(R[i][0], f); if (r != null) return r; }
    }
    if (t.indexOf(" · ") >= 0) { var p = t.split(" · "), q = p.map(function (x) { var r = core(x.trim()); return r == null ? x : r; }); if (q.join() !== p.join()) return q.join(" · "); }
    if (t.indexOf("، ") >= 0) { return t.split("، ").map(function (x) { var r = core(x.trim()); return r == null ? x : r; }).join(", "); }
    if (/^[·•\-–—]\s/.test(t)) { var r2 = core(t.slice(2)); if (r2 != null) return t.slice(0, 2) + r2; }
    return null;
  }
  function TR(s) {
    if (s == null) return s; s = String(s); if (!AR.test(s)) return s;
    var m = s.match(/^(\s*)([\s\S]*?)(\s*)$/); var r = core(m[2]);
    return r == null ? s : m[1] + r + m[3];
  }
  window.TR = TR;

  /* ---------- ترجمة الصفحة تلقائيًا ---------- */
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, CODE: 1 };
  function okNode(el) { return el && !SKIP[el.tagName] && !(el.closest && el.closest("[data-raw]")); }
  function doText(nd) { if (!AR.test(nd.nodeValue)) return; var p = nd.parentElement; if (!okNode(p)) return; var r = TR(nd.nodeValue); if (r !== nd.nodeValue) nd.nodeValue = r; }
  function doAttrs(el) {
    if (!el.getAttribute || (el.closest && el.closest("[data-raw]"))) return;
    ["placeholder", "title", "aria-label"].forEach(function (a) { var v = el.getAttribute(a); if (v && AR.test(v)) { var r = TR(v); if (r !== v) el.setAttribute(a, r); } });
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    if (root.nodeType === 1) { if (SKIP[root.tagName]) return; doAttrs(root); }
    var w = (root.ownerDocument || root).createTreeWalker(root, 5 /* element|text */);
    var nd; while ((nd = w.nextNode())) { if (nd.nodeType === 3) doText(nd); else doAttrs(nd); }
  }
  window.TRwalk = walk;
  var mo = new MutationObserver(function (list) {
    for (var i = 0; i < list.length; i++) {
      var m = list[i];
      if (m.type === "characterData") doText(m.target);
      else if (m.type === "attributes") doAttrs(m.target);
      else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "title", "aria-label"] });
  walk(document.documentElement);
})();
