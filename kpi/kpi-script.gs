/**
 * منظومة متابعة مؤشرات الأداء المؤسسي — مدارس دار الذكر (الإصدار 2)
 * الخادم: Google Apps Script + Google Sheet
 * ---------------------------------------------------------------
 * التشغيل لأول مرة أو بعد تحديث الكود:
 *  1) Extensions ← Apps Script ← الصق هذا الملف كاملاً ← حفظ.
 *  2) اختر الدالة setup ← Run (آمنة للتكرار: تنشئ الناقص فقط، وترحّل بيانات الإصدار 1 تلقائياً).
 *  3) أول مرة: Deploy ← New deployment ← Web app ← Execute as: Me ← Who has access: Anyone.
 *     بعد أي تحديث: Deploy ← Manage deployments ← ✎ ← Version: New version ← Deploy (الرابط لا يتغير).
 * لا تغيّر ترتيب الأعمدة في الأوراق؛ الكود يعتمد عليه.
 *
 * الأمان (الإصدار 2.1):
 *  - أكواد الدخول تُحفظ بطريقتين: تجزئة SHA-256 مع ملح (CODE_SALT) للتحقق من الدخول، ونسخة مشفّرة قابلة للاسترجاع
 *    (مفتاح CODE_KEY) تُعرض لمسؤول النظام وحده (كود ADM-) في صفحة الإدارة. لا يظهر أي كود كنص صريح في Google Sheet.
 *    لا تحذف CODE_SALT ولا CODE_KEY من Script Properties: حذف الأول يُبطل كل الأكواد، وحذف الثاني يخفي عرضها. بعد التحديث شغّل setup مرة واحدة: يشفّر الأكواد الحالية ويطبعها في السجل لآخر مرة.
 *  - الكود يُستخدم لتسجيل الدخول فقط، ثم تعمل بقية الطلبات برمز جلسة (12 ساعة، أو 30 يوماً مع «تذكّرني»).
 *  - المحاولات الخاطئة المتكررة توقف الدخول بالكود مؤقتاً 10 دقائق.
 *  - مبدأ «الأربع عيون»: سجل تُدخله الإدارة يعتمده مستخدم إدارة آخر (يُضبط من الإعدادات بواسطة مسؤول النظام).
 */

const APPROVAL = { pending: 'مدخل', approved: 'معتمد', returned: 'معاد للتعديل' };
const REVIEW_COLS = [['approval', 'حالة الاعتماد', 'text'], ['reviewNote', 'ملاحظة المراجعة', 'text'], ['reviewedBy', 'المراجِع', 'text'], ['reviewedAt', 'تاريخ المراجعة', 'text']];
const STAMP_COLS = [['updatedAt', 'آخر تحديث', 'text'], ['updatedBy', 'حدّثه', 'text']];

const SCHEMA = {
  snapshots: { sheet: 'اللقطات الشهرية', cols: [
    ['id', 'المعرف', 'text'], ['month', 'الشهر', 'month'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر (فارغ = الدرجة الكلية)', 'text'],
    ['actual', 'الفعلي', 'num'], ['interim', 'المستهدف المرحلي', 'num'], ['annual', 'المستهدف السنوي', 'num'], ['achYear', 'تحقيق السنوي', 'num'],
    ['achInterim', 'تحقيق المرحلي', 'num'], ['dev', 'الانحراف', 'num'], ['status', 'الحالة', 'text'], ['score', 'درجة الأداء', 'num'],
    ['coverage', 'اكتمال البيانات المستحقة', 'num'], ['weight', 'الوزن', 'num'], ['createdBy', 'أقفله', 'text'], ['createdAt', 'وقت الإقفال', 'text']] },
  accounts: { sheet: 'الحسابات', cols: [
    ['id', 'المعرف', 'text'], ['role', 'نوع الحساب (admin/viewer/member)', 'text'], ['name', 'الاسم', 'text'],
    ['empNo', 'الرقم الوظيفي', 'text'], ['title', 'المسمى الوظيفي', 'text'], ['unit', 'المرحلة/الوحدة (مختصر)', 'text'],
    ['manager', 'المدير المباشر', 'text'], ['code', 'كود الدخول', 'text'], ['active', 'مفعل', 'bool'],
    ['avgFee', 'متوسط الرسوم السنوية للطالب', 'num'], ['updatedAt', 'آخر تحديث', 'text'],
    ['level', 'المستوى التنظيمي (1 مراحل/إشراف، 2 مدير التعليم، 3 المدير التنفيذي)', 'num'], ['branch', 'الفرع (stages/support)', 'text'],
    ['oneTime', 'حساب مؤقت لمرة واحدة', 'bool'], ['usedAt', 'وقت استخدام الحساب المؤقت', 'text'], ['session', 'جلسة الحساب المؤقت', 'text'],
    ['codeEnc', 'كود الدخول (مشفّر — يقرؤه الخادم لصفحة الإدارة فقط)', 'text']] },
  kpis: { sheet: 'المؤشرات', cols: [
    ['id', 'المعرف', 'text'], ['order', 'الترتيب', 'num'], ['name', 'اسم المؤشر', 'text'], ['goal', 'الهدف الاستراتيجي', 'text'],
    ['subgoal', 'الهدف الفرعي', 'text'], ['text', 'نص المؤشر', 'text'], ['type', 'نوع القياس', 'text'], ['unit', 'الوحدة', 'text'],
    ['direction', 'الاتجاه (up/down)', 'text'], ['defTarget', 'المستهدف الافتراضي', 'num'], ['defWeight', 'الوزن الافتراضي', 'num'],
    ['fin', 'الربط المالي', 'text'], ['config', 'إعدادات (JSON)', 'json'], ['active', 'مفعل', 'bool'], ['updatedAt', 'آخر تحديث', 'text']] },
  assign: { sheet: 'تكليفات المؤشرات', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['target', 'المستهدف', 'num'],
    ['weight', 'الوزن %', 'num'], ['baseline', 'خط الأساس (المقام)', 'num'], ['updatedAt', 'آخر تحديث', 'text']] },
  activities: { sheet: 'الأنشطة والمبادرات', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['date', 'التاريخ', 'date'],
    ['title', 'الاسم', 'text'], ['kind', 'النوع', 'text'], ['audience', 'الفئة المستهدفة', 'text'], ['status', 'الحالة', 'text'],
    ['beneficiaries', 'المستفيدون/الحضور', 'num'], ['leads', 'المهتمون بالتسجيل', 'num'], ['applications', 'طلبات التسجيل', 'num'],
    ['registrations', 'المسجلون فعلياً', 'num'], ['budget', 'الميزانية المعتمدة', 'num'], ['cost', 'التكلفة الفعلية', 'num'],
    ['evidence', 'رابط الشواهد', 'text'], ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  events: { sheet: 'الأحداث الشهرية', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['month', 'الشهر', 'month'],
    ['count', 'العدد (المنسحبون)', 'num'], ['newEnrolled', 'ملتحقون جدد', 'num'], ['retained', 'حالات تم الاحتفاظ بها', 'num'],
    ['reasons', 'الأسباب (JSON)', 'json'], ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  surveys: { sheet: 'الاستبانات', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['date', 'تاريخ القياس', 'date'],
    ['round', 'الجولة', 'text'], ['promoters', 'المروّجون 9-10', 'num'], ['passives', 'المحايدون 7-8', 'num'],
    ['detractors', 'المنتقدون 0-6', 'num'], ['population', 'إجمالي المستهدفين', 'num'], ['reasons', 'أسباب عدم الرضا (JSON)', 'json'],
    ['actionTaken', 'الإجراء المتخذ', 'text'], ['evidence', 'رابط النتائج', 'text'], ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  assessments: { sheet: 'التقييمات', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['date', 'التاريخ', 'date'],
    ['kind', 'نوع التقييم', 'text'], ['domains', 'نتائج المجالات (JSON)', 'json'], ['overall', 'النتيجة الكلية %', 'num'],
    ['strengths', 'نقاط القوة', 'text'], ['improvements', 'فرص التحسين', 'text'], ['evidence', 'رابط الشواهد', 'text'],
    ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  readings: { sheet: 'القراءات الدورية', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['date', 'التاريخ', 'date'],
    ['value', 'القيمة', 'num'], ['evidence', 'رابط الشواهد', 'text'], ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  finance: { sheet: 'البيانات المالية الشهرية', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['month', 'الشهر', 'month'],
    ['revenue', 'إجمالي الإيرادات', 'num'], ['expenses', 'إجمالي المصروفات', 'num'], ['revItems', 'بنود الإيرادات (JSON)', 'json'],
    ['expItems', 'بنود المصروفات (JSON)', 'json'], ['evidence', 'رابط الشواهد', 'text'], ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  ratios: { sheet: 'نسب البسط والمقام', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['date', 'التاريخ', 'date'],
    ['period', 'الفترة/الدفعة', 'text'], ['num', 'البسط', 'num'], ['den', 'المقام', 'num'], ['reasons', 'توزيع الفجوة (JSON)', 'json'],
    ['evidence', 'رابط الشواهد', 'text'], ['notes', 'ملاحظات', 'text']].concat(REVIEW_COLS, STAMP_COLS) },
  actions: { sheet: 'الإجراءات التحسينية', cols: [
    ['id', 'المعرف', 'text'], ['accountId', 'الحساب', 'text'], ['kpiId', 'المؤشر', 'text'], ['title', 'الإجراء', 'text'],
    ['owner', 'المسؤول', 'text'], ['due', 'تاريخ الاستحقاق', 'date'], ['status', 'الحالة', 'text'], ['progress', 'نسبة الإنجاز', 'num'],
    ['notes', 'ملاحظات المتابعة', 'text'], ['evidence', 'رابط الشواهد', 'text'], ['reviewNote', 'توجيه الإدارة', 'text'],
    ['createdBy', 'أنشأه', 'text']].concat(STAMP_COLS) },
  audit: { sheet: 'سجل التعديلات', cols: [
    ['id', 'المعرف', 'text'], ['time', 'الوقت', 'text'], ['actor', 'المستخدم', 'text'], ['role', 'الصلاحية', 'text'],
    ['action', 'العملية', 'text'], ['table', 'الجدول', 'text'], ['recordId', 'السجل', 'text'], ['account', 'الحساب المعني', 'text'],
    ['detail', 'التفاصيل', 'text']] }
};
const SNAPSHOT_STATUS = ['done', 'ahead', 'track', 'risk', 'off', 'late', 'nodata'];
const RECORD_TABLES = ['activities', 'events', 'surveys', 'assessments', 'readings', 'finance', 'ratios', 'actions'];
const REVIEWABLE = ['activities', 'events', 'surveys', 'assessments', 'readings', 'finance', 'ratios'];
const TABLE_OF_TYPE = { count: 'activities', rate: 'events', nps: 'surveys', score: 'assessments', reading: 'readings', amount: 'finance', ratio: 'ratios' };
const TYPES = Object.keys(TABLE_OF_TYPE);
const TABLE_NAMES = { activities: 'الأنشطة والمبادرات', events: 'الأحداث الشهرية', surveys: 'الاستبانات', assessments: 'التقييمات',
  readings: 'القراءات', finance: 'البيانات المالية الشهرية', ratios: 'النسب', actions: 'الإجراءات التحسينية', accounts: 'الحسابات', kpis: 'المؤشرات', assign: 'التكليفات', settings: 'الإعدادات' };
const ACTION_STATUS = ['لم يبدأ', 'جارٍ', 'مكتمل', 'متوقف'];
const SETTINGS_SHEET = 'الإعدادات';
const DEFAULT_SETTINGS = { adminCode: '', yearLabel: '2026/2027', yearStart: '2026-08-20', yearEnd: '2027-06-30',
  schoolName: 'مدارس دار الذكر', systemName: 'منظومة متابعة الأداء المؤسسي', schemaVersion: '2',
  fourEyes: '1', contributionMargin: '', attributionShare: '100' };

// المؤشرات الخمسة من «نموذج اتفاقية مؤشرات الأداء السنوية» 2026/2027
const SEED_KPIS = [
  { id: 'init', order: 1, name: 'المبادرات الاستقطابية', goal: 'الأداء المالي', subgoal: 'دعم تحقيق مستهدفات النمو الطلابي للمرحلة',
    text: 'تنفيذ ما لا يقل عن (4) مبادرات وفعاليات استقطابية خلال العام الدراسي بما يدعم تحقيق مستهدفات تسجيل الطلاب بالمدرسة',
    type: 'count', unit: 'مبادرة', direction: 'up', defTarget: 4, defWeight: 35, fin: 'acquisition',
    config: { kinds: ['يوم مفتوح', 'لقاء تعريفي', 'ورشة لأولياء الأمور', 'زيارة/شراكة', 'حملة رقمية', 'معرض/مسابقة مفتوحة', 'فعالية مجتمعية', 'أخرى'] } },
  { id: 'wd', order: 2, name: 'نسبة الطلاب المنسحبين', goal: 'الاستدامة المالية', subgoal: 'المحافظة على استقرار واستدامة أعداد الطلاب بالمرحلة',
    text: 'ألا تتجاوز نسبة الطلاب المنسحبين من المرحلة السقف المحدد من إجمالي الطلاب المسجلين فعلياً',
    type: 'rate', unit: '%', direction: 'down', defTarget: 8, defWeight: 10, fin: 'attrition',
    config: { reasons: ['انتقال سكن/سفر', 'الرسوم', 'أكاديمي', 'عدم الرضا عن الخدمة', 'أخرى'], eventLabel: 'عدد المنسحبين', baselineLabel: 'عدد الطلاب المسجلين فعلياً بداية العام' } },
  { id: 'nps', order: 3, name: 'صافي نقاط رضا أولياء الأمور (NPS)', goal: 'رضا أولياء الأمور', subgoal: 'تحسين تجربة أولياء الأمور ورفع مستوى رضاهم عن المرحلة',
    text: 'تحقيق مؤشر صافي نقاط رضا أولياء أمور المرحلة (NPS) بما لا يقل عن المستهدف',
    type: 'nps', unit: '', direction: 'up', defTarget: 40, defWeight: 20, fin: '',
    config: { question: 'ما مدى احتمال أن توصي بمدارس دار الذكر لأقاربك وأصدقائك؟', populationLabel: 'إجمالي الأسر المستهدفة',
      reasons: ['جودة التعليم والتحصيل', 'التواصل مع الأسرة', 'الرسوم والقيمة', 'الانضباط والسلوك', 'المرافق والنقل', 'أخرى'] } },
  { id: 'etec', order: 4, name: 'نتيجة هيئة تقويم التعليم والتدريب', goal: 'التميز المؤسسي', subgoal: 'تحقيق التميز الأكاديمي والمؤسسي للمرحلة',
    text: 'تحقيق النتيجة المستهدفة في تقويم واعتماد هيئة تقويم التعليم والتدريب',
    type: 'score', unit: '%', direction: 'up', defTarget: 85, defWeight: 25, fin: '',
    config: { domains: ['الإدارة المدرسية', 'التعليم والتعلم', 'نواتج التعلم', 'البيئة المدرسية'], kinds: ['تقويم ذاتي', 'تقييم تجريبي', 'النتيجة الرسمية'], officialKind: 'النتيجة الرسمية' } },
  { id: 'enps', order: 5, name: 'مؤشر اندماج الموظفين (eNPS)', goal: 'مشاركة واندماج الموظفين', subgoal: 'توفير بيئة عمل داعمة ومحفزة لمنسوبي المرحلة',
    text: 'تحقيق مؤشر اندماج موظفي المرحلة (eNPS) بمستوى لا يقل عن المستهدف',
    type: 'nps', unit: '', direction: 'up', defTarget: 80, defWeight: 10, fin: '',
    config: { question: 'ما مدى احتمال أن توصي بالعمل في مرحلتنا لصديق؟', populationLabel: 'إجمالي موظفي المرحلة',
      reasons: ['عبء العمل', 'التقدير والحوافز', 'القيادة والتواصل', 'بيئة العمل', 'النمو المهني', 'أخرى'] } }
];
// مؤشرات مشرف المسار الأمريكي (الدبلوما) — من اتفاقية مؤشرات الأداء 2026/2027
const SEED_DIPLOMA_KPIS = [
  { id: 'd_nps', order: 21, name: 'رضا أولياء الأمور عن جودة التدريس (NPS) — المسار الأمريكي', goal: 'رضا أولياء الأمور', subgoal: 'تحسين جودة التدريس والممارسات التعليمية داخل الصفوف',
    text: 'تحقيق مؤشر رضا أولياء الأمور عن جودة التدريس (NPS) بما لا يقل عن (+40)', type: 'nps', unit: '', direction: 'up', defTarget: 40, defWeight: 20, fin: '',
    config: { question: 'ما مدى احتمال أن توصي بالمسار الأمريكي في مدارس دار الذكر بناءً على جودة التدريس؟', populationLabel: 'إجمالي أسر طلاب المسار', reasons: ['جودة التدريس', 'متابعة تقدم الطالب', 'التواصل مع الأسرة', 'الواجبات والتقويم', 'أخرى'] } },
  { id: 'd_visits', order: 22, name: 'نمو نتائج الزيارات الصفية والإشرافية', goal: 'التميز المؤسسي', subgoal: 'رفع مستوى الامتثال والجاهزية الأكاديمية لمتطلبات الاعتماد والمؤشرات التعليمية المعتمدة',
    text: 'تحقيق متوسط نمو لا يقل عن (5) نقاط في نتائج الزيارات الصفية والإشرافية', type: 'reading', unit: 'نقطة', direction: 'up', defTarget: 5, defWeight: 25, fin: '',
    config: { growth: true, valueLabel: 'متوسط نتائج الزيارات الصفية (من 100)' } },
  { id: 'd_achieve', order: 23, name: 'المعدل العام للتحصيل الأكاديمي', goal: 'الاستدامة المالية', subgoal: 'تعزيز تجربة التعلم للطلاب بما يدعم استمراريتهم ونجاحهم الأكاديمي',
    text: 'رفع المعدل العام للتحصيل الأكاديمي لمجمع مدارس دار الذكر إلى (83.42%)', type: 'reading', unit: '%', direction: 'up', defTarget: 83.42, defWeight: 20, fin: '', config: { valueLabel: 'المعدل العام للتحصيل (%)' } },
  { id: 'd_enps', order: 24, name: 'اندماج المشرفين والمعلمين (eNPS) — المسار الأمريكي', goal: 'مشاركة واندماج الموظفين', subgoal: 'تقديم الدعم الأكاديمي الفعال للمعلمين وتحسين مستوى رضاهم',
    text: 'تحقيق مؤشر اندماج المشرفين والمعلمين (eNPS) بما لا يقل عن (80)', type: 'nps', unit: '', direction: 'up', defTarget: 80, defWeight: 15, fin: '',
    config: { question: 'ما مدى احتمال أن توصي بالعمل في المسار الأمريكي بمدارس دار الذكر لزميل؟', populationLabel: 'إجمالي مشرفي ومعلمي المسار', reasons: ['الدعم الأكاديمي', 'عبء العمل', 'التقدير والحوافز', 'القيادة والتواصل', 'النمو المهني', 'أخرى'] } },
  { id: 'd_students', order: 25, name: 'أعداد طلاب المسار الأمريكي', goal: 'الأداء المالي', subgoal: 'تعزيز جاذبية البرامج الأكاديمية بما يدعم استقطاب الطلاب والمحافظة عليهم',
    text: 'تحقيق المستهدف المعتمد لأعداد الطلاب بالمسار الأمريكي من خلال جودة الخدمات الأكاديمية', type: 'reading', unit: 'طالب', direction: 'up', defTarget: 0, defWeight: 20, fin: '', config: { valueLabel: 'عدد الطلاب المسجلين فعلياً بالمسار' } }
];
// مؤشرات مدير مكتب الإشراف الأكاديمي — الاتفاقية لا تحدد مستهدفات رقمية بعد؛ المستهدفات هنا مقترحة وتُعدَّل من الإدارة
const SEED_OFFICE_KPIS = [
  { id: 's_tests', order: 31, name: 'تحسين نتائج الاختبارات الوطنية والدولية', goal: 'تحسين نواتج التعلم والجاهزية الأكاديمية', subgoal: 'تحليل نتائج نافس وMAP ومتابعة النمو حسب الصف والمرحلة؛ متابعة القدرات والتحصيلي؛ إعداد خطط تحسين وقياس أثرها',
    text: 'تحقيق مستهدفات التحسن المعتمدة في نافس وMAP والقدرات والتحصيلي (تُعتمد بعد تثبيت خط الأساس والفئات المشاركة)', type: 'score', unit: '%', direction: 'up', defTarget: 100, defWeight: 30, fin: '',
    config: { domains: ['نافس', 'MAP', 'القدرات', 'التحصيلي'], kinds: ['متابعة دورية', 'النتيجة النهائية'], officialKind: 'النتيجة النهائية', domainHint: 'نسبة تحقق مستهدف التحسن المعتمد لكل اختبار (%)' } },
  { id: 's_accred', order: 32, name: 'دعم الاعتمادات والتقويم الخارجي', goal: 'الجودة والاعتماد والتحسين المستمر', subgoal: 'استكمال الأدلة التعليمية المسندة للمكتب وإغلاق الملاحظات في موعدها بالتنسيق مع مسؤولي ملفات هيئة تقويم التعليم والتدريب وNEASC',
    text: 'استكمال الأدلة المسندة للمكتب وإغلاق الملاحظات في موعدها', type: 'ratio', unit: '%', direction: 'up', defTarget: 90, defWeight: 25, fin: '',
    config: { numLabel: 'المنجز في موعده (أدلة مكتملة + ملاحظات مغلقة)', denLabel: 'المسند للمكتب والمستحق حتى تاريخه', periodLabel: 'الملف/الفترة', reasons: ['تأخر من مالك الملف', 'نقص بيانات من المدارس', 'ضيق الوقت', 'تغيّر في المتطلبات', 'أخرى'] } },
  { id: 's_quality', order: 33, name: 'رفع جودة التعليم والتعلم', goal: 'التميز الأكاديمي والتعليمي', subgoal: 'تنفيذ الزيارات الصفية المعتمدة وتوثيق التغذية الراجعة ومتابعة أثرها بأداة موحدة',
    text: 'تنفيذ الزيارات الصفية المعتمدة في الخطة وتوثيق تغذيتها الراجعة', type: 'ratio', unit: '%', direction: 'up', defTarget: 90, defWeight: 20, fin: '',
    config: { numLabel: 'الزيارات المنفذة والموثقة بتغذية راجعة', denLabel: 'الزيارات المعتمدة في الخطة حتى تاريخه', periodLabel: 'الشهر/الفترة', reasons: ['غياب المعلم أو المشرف', 'تعارض الجدول', 'اختبارات وفعاليات', 'نقص المشرفين', 'أخرى'] } },
  { id: 's_pd', order: 34, name: 'تطوير أداء المعلمين والمشرفين', goal: 'التطوير المهني وبناء القدرات', subgoal: 'تحويل نتائج الإشراف إلى خطط تطوير ومتابعة التنفيذ والأثر في التدريس والتقويم',
    text: 'تنفيذ خطط التطوير المهني المبنية على نتائج الإشراف ومتابعة أثرها', type: 'ratio', unit: '%', direction: 'up', defTarget: 85, defWeight: 15, fin: '',
    config: { numLabel: 'خطط التطوير المنفذة والمتابَع أثرها', denLabel: 'خطط التطوير المعتمدة المستحقة', periodLabel: 'الفصل/الفترة', reasons: ['لم تبدأ', 'منفذة دون قياس أثر', 'اعتذار المعلم', 'نقص الموارد التدريبية', 'أخرى'] } },
  { id: 's_curric', order: 35, name: 'ضبط المناهج والتقويم الأكاديمي', goal: 'اتساق التنفيذ الأكاديمي وفاعلية التقويم', subgoal: 'متابعة الخطط الدراسية وجودة أدوات التقويم وتحليل النتائج ومعالجة فجوات التغطية والمهارات الأساسية',
    text: 'ضبط تنفيذ الخطط الدراسية وجودة أدوات التقويم ومعالجة الفجوات', type: 'score', unit: '%', direction: 'up', defTarget: 90, defWeight: 10, fin: '',
    config: { domains: ['تغطية الخطط الدراسية', 'جودة أدوات التقويم', 'تحليل نتائج التقويم', 'معالجة فجوات المهارات الأساسية'], kinds: ['مراجعة دورية', 'النتيجة النهائية'], officialKind: 'النتيجة النهائية' } }
];
// مؤشرات مدير التعليم: نفس مؤشرات المراحل بأوزانه ومستهدفاته، وتُجمَّع قيمها تلقائياً من المراحل
const DIRECTOR_ASSIGN = [['init', 4, 20], ['nps', 40, 20], ['etec', 88, 20], ['enps', 80, 15], ['wd', 8, 25]];

// مؤشرات المدير التنفيذي (مدير مجمع المدارس) من وثيقة الأهداف السنوية 2026/2027 — على مستوى المجمع كله
const SEED_EXEC_KPIS = [
  { id: 'x_profit', order: 11, name: 'صافي الربح', goal: 'الأداء المالي', subgoal: 'تحقيق صافي الربح المستهدف لمجمع المدارس',
    text: 'تحقيق صافي ربح لا يقل عن (10,227,244) ريال سعودي للعام الدراسي 2026/2027', type: 'amount', unit: 'ر.س', direction: 'up', defTarget: 10227244, defWeight: 40, fin: '',
    config: { revItems: ['الرسوم الدراسية', 'رسوم التسجيل والقبول', 'النقل المدرسي', 'الأنشطة والبرامج الإضافية', 'إيرادات أخرى'],
      expItems: ['الرواتب والأجور والمزايا', 'الإيجارات', 'التشغيل والصيانة والمرافق', 'المستلزمات والمواد التعليمية', 'التسويق والاستقطاب', 'مصروفات إدارية وعمومية', 'الإهلاك وتكاليف التمويل'] } },
  { id: 'x_collect', order: 12, name: 'جودة التحصيل', goal: 'الاستدامة المالية', subgoal: 'تحصيل المستحقات في وقتها',
    text: 'تحصيل 90% فأكثر من الرسوم المستحقة خلال 90 يوماً من تاريخ استحقاقها', type: 'ratio', unit: '%', direction: 'up', defTarget: 90, defWeight: 20, fin: '',
    config: { numLabel: 'المحصّل خلال 90 يوماً (ر.س)', denLabel: 'المستحق الذي مضى على استحقاقه 90 يوماً (ر.س)', periodLabel: 'الدفعة/الفصل',
      reasons: ['تعثر مالي للأسرة', 'خطة سداد مجدولة', 'اعتراض على الرسوم أو الخدمة', 'انسحاب الطالب', 'أخرى'] } },
  { id: 'x_nps', order: 13, name: 'صافي نقاط رضا أولياء الأمور (NPS) — المجمع', goal: 'رضا أولياء الأمور', subgoal: 'رفع رضا أولياء الأمور على مستوى المجمع',
    text: 'تحقيق صافي نقاط رضا أولياء الأمور (NPS) +40 فأكثر على مستوى مجمع المدارس', type: 'nps', unit: '', direction: 'up', defTarget: 40, defWeight: 15, fin: '',
    config: { rollupFrom: 'nps', question: 'ما مدى احتمال أن توصي بمدارس دار الذكر لأقاربك وأصدقائك؟', populationLabel: 'إجمالي الأسر المستهدفة',
      reasons: ['جودة التعليم والتحصيل', 'التواصل مع الأسرة', 'الرسوم والقيمة', 'الانضباط والسلوك', 'المرافق والنقل', 'أخرى'] } },
  { id: 'x_enps', order: 14, name: 'مؤشر رضا الموظفين (eNPS) — المجمع', goal: 'مشاركة واندماج الموظفين', subgoal: 'بيئة عمل داعمة ومحفزة لمنسوبي المجمع',
    text: 'تحقيق مؤشر رضا الموظفين (eNPS) +20 فأكثر على مستوى مجمع المدارس', type: 'nps', unit: '', direction: 'up', defTarget: 20, defWeight: 15, fin: '',
    config: { rollupFrom: 'enps', question: 'ما مدى احتمال أن توصي بالعمل في مدارس دار الذكر لصديق؟', populationLabel: 'إجمالي موظفي المجمع',
      reasons: ['عبء العمل', 'التقدير والحوافز', 'القيادة والتواصل', 'بيئة العمل', 'النمو المهني', 'أخرى'] } },
  { id: 'x_comply', order: 15, name: 'نسبة الامتثال للمتطلبات المؤسسية المعتمدة', goal: 'التميز المؤسسي', subgoal: 'استيفاء المتطلبات النظامية والمؤسسية',
    text: 'تحقيق نسبة امتثال 90% فأكثر للمتطلبات المؤسسية المعتمدة', type: 'score', unit: '%', direction: 'up', defTarget: 90, defWeight: 10, fin: '',
    config: { domains: ['التراخيص والاعتمادات', 'الأمن والسلامة', 'الموارد البشرية وأنظمة العمل', 'الالتزامات المالية والزكوية والضريبية', 'السياسات والحوكمة', 'الأنظمة التقنية وحماية البيانات'],
      kinds: ['مراجعة داخلية ربعية', 'تدقيق خارجي', 'النتيجة المعتمدة'], officialKind: 'النتيجة المعتمدة' } }
];
// أسماء افتراضية فقط — الأسماء والأرقام الوظيفية الحقيقية تُدخل من صفحة الإدارة وتبقى في Google Sheet (لا تُكتب في الكود المنشور)
const SEED_MEMBERS = [
  { name: 'مدير المرحلة الابتدائية (بنين)', empNo: '', title: 'مدير المرحلة الابتدائية', unit: 'ابتدائي بنين', manager: 'مدير التعليم', etec: 85 },
  { name: 'مديرة المرحلة الابتدائية (بنات)', empNo: '', title: 'مديرة المرحلة الابتدائية - بنات', unit: 'ابتدائي بنات', manager: 'مدير التعليم', etec: 85 },
  { name: 'مدير المرحلة المتوسطة (بنين)', empNo: '', title: 'مدير المرحلة المتوسطة - بنين', unit: 'متوسط بنين', manager: 'المدير التنفيذي', etec: 92 },
  { name: 'مدير المرحلة الثانوية (بنين)', empNo: '', title: 'مدير المرحلة الثانوية', unit: 'ثانوي بنين', manager: 'مدير التعليم', etec: 87 }
];
const SEED_ADMINS = [
  { name: 'مدير التعليم', title: 'مدير التعليم', unit: 'الإدارة العليا' },
  { name: 'المدير التنفيذي', title: 'المدير التنفيذي لمدارس دار الذكر', unit: 'الإدارة العليا' }
];

// ===================== الإعداد والترحيل =====================
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const log = [];
  migrateV1_(log);
  const settings = readSettings_();
  Object.keys(DEFAULT_SETTINGS).forEach(k => { if (settings[k] === undefined || settings[k] === '') settings[k] = DEFAULT_SETTINGS[k]; });
  settings.schemaVersion = '2';
  if (!settings.adminCode) settings.adminCode = 'ADM-' + newCode_(6);
  writeSettings_(settings);
  Object.keys(SCHEMA).forEach(t => ensureSheet_(t));
  // المؤشرات
  const kpis = readTable_('kpis');
  SEED_KPIS.forEach(k => { if (!kpis.some(x => x.id === k.id)) upsert_('kpis', Object.assign({ active: true, updatedAt: stamp_() }, k)); });
  // مديرو المراحل
  let accounts = readTable_('accounts');
  if (!accounts.some(a => a.role === 'member')) {
    SEED_MEMBERS.forEach(m => {
      const acc = { id: newId_(), role: 'member', name: m.name, empNo: m.empNo, title: m.title, unit: m.unit, manager: m.manager,
        code: newCode_(6), active: true, avgFee: '', updatedAt: stamp_() };
      upsert_('accounts', acc);
      SEED_KPIS.forEach(k => upsert_('assign', { id: newId_(), accountId: acc.id, kpiId: k.id,
        target: k.id === 'etec' ? m.etec : k.defTarget, weight: k.defWeight, baseline: '', updatedAt: stamp_() }));
    });
  }
  // حسابات الإدارة العليا (صلاحيات كاملة)
  accounts = readTable_('accounts');
  // تُنشأ حسابات الإدارة الافتراضية في التثبيت الأول فقط (لا يُبحث بالاسم، فتغيير الأسماء لا يُنشئ حسابات مكررة)
  if (!accounts.some(x => x.role === 'admin')) SEED_ADMINS.forEach(a => {
    if (!accounts.some(x => x.name === a.name)) upsert_('accounts', { id: newId_(), role: 'admin', name: a.name, empNo: '', title: a.title,
      unit: a.unit, manager: '', code: newCode_(6), active: true, avgFee: '', updatedAt: stamp_() });
  });
  log.push(seedExec());
  log.push(seedOrg());
  // حذف الورقة الافتراضية الفارغة
  const def = ss.getSheetByName('الورقة1') || ss.getSheetByName('Sheet1');
  if (def && def.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(def);
  const fresh = migrateCodes_();
  const msg = log.concat(['تم الإعداد (الإصدار 2.1).'])
    .concat(fresh.length ? ['أكواد الدخول التالية حُفظت الآن مشفّرة ولن تظهر مرة أخرى — سلّمها لأصحابها أو أنشئ أكواداً جديدة من صفحة الإدارة:'].concat(fresh)
      : ['كل أكواد الدخول محفوظة مشفّرة.']).join('\n');
  Logger.log(msg);
  return msg;
}

// إضافة مؤشرات المدير التنفيذي وتكليفه بها (آمنة للتكرار، ولا تعرض أي أكواد دخول)
function seedExec() {
  Object.keys(SCHEMA).forEach(t => ensureSheet_(t));
  const kpis = readTable_('kpis'); let added = 0, asg = 0;
  SEED_EXEC_KPIS.forEach(k => { if (!kpis.some(x => x.id === k.id)) { upsert_('kpis', Object.assign({ active: true, updatedAt: stamp_() }, k)); added++; } });
  const acc = readTable_('accounts').filter(a => a.role === 'admin' && /تنفيذي|مدير المدارس|مدير المجمع/.test(a.title))[0];
  if (acc && !readTable_('assign').some(a => a.accountId === acc.id))
    SEED_EXEC_KPIS.forEach(k => { upsert_('assign', { id: newId_(), accountId: acc.id, kpiId: k.id, target: k.defTarget, weight: k.defWeight, baseline: '', updatedAt: stamp_() }); asg++; });
  if (acc && asg && acc.unit === 'الإدارة العليا') { acc.unit = 'مجمع المدارس'; upsert_('accounts', acc); }
  const msg = 'مؤشرات المدير التنفيذي: أضيف ' + added + ' مؤشر، و' + (acc ? (asg ? 'كُلّف بها «' + acc.name + '»' : 'التكليف موجود مسبقاً') : 'لم يُعثر على حساب المدير التنفيذي — كلّفه من صفحة الإدارة');
  Logger.log(msg);
  return msg;
}

// الهيكل التنظيمي: المستويات، مؤشرات مدير التعليم، وحسابا مشرف المسار الأمريكي ومدير مكتب الإشراف (آمنة للتكرار، ولا تعرض أكواداً)
function seedOrg() {
  Object.keys(SCHEMA).forEach(t => ensureSheet_(t));
  Object.keys(cache_).forEach(k => delete cache_[k]);
  const out = [], kpis = readTable_('kpis');
  let addedK = 0;
  SEED_DIPLOMA_KPIS.concat(SEED_OFFICE_KPIS).forEach(k => { if (!kpis.some(x => x.id === k.id)) { upsert_('kpis', Object.assign({ active: true, updatedAt: stamp_() }, k)); addedK++; } });
  out.push('أضيف ' + addedK + ' مؤشر');
  const hasAsg = id => readTable_('assign').some(a => a.accountId === id);
  const giveAsg = (id, rows) => rows.forEach(r => upsert_('assign', { id: newId_(), accountId: id, kpiId: r[0], target: r[1], weight: r[2], baseline: '', updatedAt: stamp_() }));
  let accounts = readTable_('accounts');
  // المستوى 3: المدير التنفيذي
  accounts.filter(a => a.role === 'admin' && /تنفيذي|مدير المدارس|مدير المجمع/.test(a.title)).forEach(a => { if (a.level !== 3) { a.level = 3; upsert_('accounts', a); } });
  // المستوى 2: مدير التعليم
  const dir = accounts.filter(a => a.role === 'admin' && /مدير التعليم|الشؤون التعليمية|قطاع التعليم/.test(a.title))[0];
  if (dir) {
    dir.level = 2; if (dir.unit === 'الإدارة العليا') dir.unit = 'قطاع التعليم';
    upsert_('accounts', dir);
    if (!hasAsg(dir.id)) { giveAsg(dir.id, DIRECTOR_ASSIGN); out.push('كُلّف مدير التعليم بمؤشراته'); }
  } else out.push('لم يُعثر على حساب مدير التعليم');
  // المستوى 1 — فرع المراحل
  accounts.filter(a => a.role === 'member' && !a.level).forEach(a => { a.level = 1; if (!a.branch) a.branch = 'stages'; upsert_('accounts', a); });
  // المستوى 1 — فرع الإشراف والمسارات
  [{ name: 'مدير مكتب الإشراف الأكاديمي', re: /مكتب الإشراف/, empNo: '', title: 'مدير مكتب الإشراف الأكاديمي', unit: 'مكتب الإشراف', manager: 'مدير التعليم', ks: SEED_OFFICE_KPIS },
   { name: 'مشرف الدبلوما الأمريكية', re: /الدبلوما|المسار الأمريكي/, empNo: '', title: 'مشرف الدبلوما الأمريكية (المسار الأمريكي)', unit: 'الدبلوما الأمريكية', manager: 'مدير مكتب الإشراف الأكاديمي', ks: SEED_DIPLOMA_KPIS }
  ].forEach(d => {
    // المطابقة بالمسمى أو الوحدة (لا بأسماء الأشخاص)
    let a = readTable_('accounts').filter(x => x.role !== 'viewer' && (d.re.test(x.title) || d.re.test(x.unit)))[0];
    if (!a) { a = { id: newId_(), role: 'member', name: d.name, empNo: d.empNo, title: d.title, unit: d.unit, manager: d.manager, code: newCode_(6), active: true, avgFee: '', updatedAt: stamp_(), level: 1, branch: 'support' };
      upsert_('accounts', a); out.push('أُنشئ حساب «' + d.name + '»'); }
    else if (a.role === 'member' && a.branch !== 'support') { a.level = 1; a.branch = 'support'; upsert_('accounts', a); }
    if (!hasAsg(a.id)) giveAsg(a.id, d.ks.map(k => [k.id, k.defTarget, k.defWeight]));
  });
  const msg = 'الهيكل التنظيمي: ' + out.join('، ');
  Logger.log(msg);
  return msg;
}

// ترحيل بيانات الإصدار 1 (أعمدة ثابتة) إلى بنية الإصدار 2 مع الاحتفاظ بنسخة احتياطية
function migrateV1_(log) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const acc = ss.getSheetByName('الحسابات');
  if (!acc || acc.getLastColumn() < 11 || String(acc.getRange(1, 11, 1, 1).getValues()[0][0]) !== 'مستهدف المبادرات') return;
  const tz = Session.getScriptTimeZone();
  const fmt = (v, f) => v instanceof Date ? Utilities.formatDate(v, tz, f || 'yyyy-MM-dd') : (v === null || v === undefined ? '' : String(v));
  const rows = (name, n) => { const sh = ss.getSheetByName(name); if (!sh || sh.getLastRow() < 2) return [];
    return sh.getRange(2, 1, sh.getLastRow() - 1, n).getValues().filter(r => r[0] !== ''); };
  const oldAcc = rows('الحسابات', 21), oldInit = rows('المبادرات', 13), oldWd = rows('الانسحاب الشهري', 12),
    oldSv = rows('الاستبانات', 12), oldEt = rows('الاعتماد المدرسي', 12);
  ['الحسابات', 'المبادرات', 'الانسحاب الشهري', 'الاستبانات', 'الاعتماد المدرسي'].forEach(n => {
    const sh = ss.getSheetByName(n); if (sh) sh.setName('نسخة الإصدار 1 - ' + n);
  });
  Object.keys(SCHEMA).forEach(t => ensureSheet_(t));
  SEED_KPIS.forEach(k => upsert_('kpis', Object.assign({ active: true, updatedAt: stamp_() }, k)));
  const num = v => v === '' || v === null ? '' : Number(v);
  oldAcc.forEach(r => {
    upsert_('accounts', { id: String(r[0]), role: r[1] === 'viewer' ? 'viewer' : 'member', name: r[2], empNo: fmt(r[3]), title: r[4], unit: r[5],
      manager: r[6], code: String(r[7]), active: r[8] === true || String(r[8]).toUpperCase() === 'TRUE', avgFee: '', updatedAt: stamp_() });
    if (r[1] === 'viewer') return;
    [['init', 10, 15], ['wd', 11, 16], ['nps', 12, 17], ['etec', 13, 18], ['enps', 14, 19]].forEach(([k, ti, wi]) =>
      upsert_('assign', { id: newId_(), accountId: String(r[0]), kpiId: k, target: num(r[ti]), weight: num(r[wi]),
        baseline: k === 'wd' ? num(r[9]) : '', updatedAt: stamp_() }));
  });
  const ap = { approval: APPROVAL.approved, reviewNote: 'مرحّل من الإصدار 1', reviewedBy: 'النظام', reviewedAt: stamp_(), updatedAt: stamp_(), updatedBy: 'ترحيل' };
  oldInit.forEach(r => upsert_('activities', Object.assign({ id: String(r[0]), accountId: String(r[1]), kpiId: 'init', date: fmt(r[2]), title: r[3], kind: r[4],
    audience: r[5], status: r[6] || 'منفذة', beneficiaries: num(r[7]), leads: num(r[8]), applications: '', registrations: num(r[9]), budget: '', cost: '',
    evidence: r[10], notes: r[11] }, ap)));
  const wdReasons = SEED_KPIS[1].config.reasons;
  oldWd.forEach(r => { const reasons = {}; wdReasons.forEach((n, i) => { if (Number(r[5 + i])) reasons[n] = Number(r[5 + i]); });
    upsert_('events', Object.assign({ id: String(r[0]), accountId: String(r[1]), kpiId: 'wd', month: fmt(r[2], 'yyyy-MM'), count: num(r[3]),
      newEnrolled: num(r[4]), retained: '', reasons: JSON.stringify(reasons), notes: r[10] }, ap)); });
  oldSv.forEach(r => upsert_('surveys', Object.assign({ id: String(r[0]), accountId: String(r[1]), kpiId: r[2] === 'enps' ? 'enps' : 'nps', date: fmt(r[3]),
    round: r[4], promoters: num(r[5]), passives: num(r[6]), detractors: num(r[7]), population: num(r[8]), reasons: '{}', actionTaken: '',
    evidence: r[9], notes: r[10] }, ap)));
  const doms = SEED_KPIS[3].config.domains;
  oldEt.forEach(r => { const d = {}; doms.forEach((n, i) => { if (r[4 + i] !== '') d[n] = Number(r[4 + i]); });
    upsert_('assessments', Object.assign({ id: String(r[0]), accountId: String(r[1]), kpiId: 'etec', date: fmt(r[2]), kind: r[3], domains: JSON.stringify(d),
      overall: num(r[8]), strengths: '', improvements: '', evidence: r[9], notes: r[10] }, ap)); });
  log.push('تم ترحيل بيانات الإصدار 1: ' + oldAcc.length + ' حساب، ' + (oldInit.length + oldWd.length + oldSv.length + oldEt.length) + ' سجل (النسخ القديمة محفوظة بأوراق «نسخة الإصدار 1»).');
}

// ===================== نقطة الدخول (JSONP) =====================
function doGet(e) {
  const p = (e && e.parameter) || {};
  let out;
  try { out = handle_(p.action || '', String(p.code || ''), p.p ? JSON.parse(p.p) : {}); }
  catch (err) { out = { ok: false, error: String(err && err.message || err) }; }
  const json = JSON.stringify(out);
  if (p.callback && /^[A-Za-z_$][\w$]*$/.test(p.callback))
    return ContentService.createTextOutput(p.callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

// الطلبات الطويلة (ملاحظات كثيرة) تُرسل POST بنص JSON لتفادي حد طول الرابط
function doPost(e) {
  let out;
  try {
    const b = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    out = handle_(String(b.action || ''), String(b.code || ''), typeof b.p === 'string' ? JSON.parse(b.p || '{}') : (b.p || {}));
  } catch (err) { out = { ok: false, error: String(err && err.message || err) }; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

// كل عمليات الكتابة تُنفَّذ كاملة داخل القفل (القراءة + التحقق + الحفظ) لمنع التكرار عند الحفظ المتزامن
const READ_ACTIONS = ['ping', 'login', 'logout', 'getData', 'getAudit'];
function handle_(action, code, p) {
  if (READ_ACTIONS.indexOf(action) >= 0) return route_(action, code, p);
  return withLock_(() => { Object.keys(cache_).forEach(k => delete cache_[k]); return route_(action, code, p); });
}

function route_(action, code, p) {
  if (action === 'ping') return { ok: true, time: new Date().toISOString(), version: 2 };
  const who = auth_(code, action);
  if (who && who._used) return { ok: false, error: 'هذا الكود المؤقت استُخدم من قبل — اطلب كوداً جديداً من الإدارة' };
  if (who && who._locked) return { ok: false, error: 'محاولات دخول خاطئة كثيرة — توقف الدخول بالكود مؤقتاً، حاول بعد 10 دقائق' };
  if (!who) return { ok: false, error: 'كود الدخول غير صحيح أو الحساب موقوف' };
  const isAdmin = who.role === 'admin';
  const ok = () => { const r = { ok: true, data: buildData_(who) }; if (who._session) r.session = who._session; return r; };

  switch (action) {
    case 'login': {
      const r = ok(), tok = String(code).trim().toUpperCase();
      if (!who._session && !who.oneTime) r.token = tok.indexOf('T-') === 0 ? tok : newSession_(who.id, !!p.remember);
      return r;
    }
    case 'getData': return ok();
    case 'logout': { const tok = String(code).trim().toUpperCase(); if (tok.indexOf('T-') === 0) endSession_(tok); return { ok: true }; }

    case 'saveRecord': {
      if (who.role === 'viewer') throw new Error('هذا الحساب للعرض فقط');
      const table = p.table;
      if (RECORD_TABLES.indexOf(table) < 0) throw new Error('نوع سجل غير معروف');
      const src = p.record || {};
      const rec = sanitize_(table, src);
      rec.accountId = isAdmin ? String(src.accountId || '') : who.id;
      const account = findById_('accounts', rec.accountId);
      if (!account || account.role === 'viewer') throw new Error('الحساب غير موجود');
      const old = rec.id ? findById_(table, rec.id) : null;
      if (old && !isAdmin && old.accountId !== who.id) throw new Error('لا تملك صلاحية تعديل هذا السجل');
      if (old && old.accountId !== rec.accountId) throw new Error('لا يمكن نقل السجل لحساب آخر');
      // التحقق من المؤشر
      if (table !== 'actions' || rec.kpiId) {
        const kpi = findById_('kpis', rec.kpiId);
        if (!kpi) throw new Error('المؤشر غير موجود');
        if (table !== 'actions' && TABLE_OF_TYPE[kpi.type] !== table) throw new Error('نوع السجل لا يطابق نوع المؤشر');
        if (!readTable_('assign').some(a => a.accountId === rec.accountId && a.kpiId === rec.kpiId)) throw new Error('المؤشر غير مكلّف لهذا الحساب');
        validate_(table, rec, kpi);
      } else validate_(table, rec, null);
      checkYear_(table, rec, old);
      if (!rec.id) rec.id = newId_();
      // الاعتماد: سجل يُدخله المسؤول يُعتمد مباشرة، وأي تعديل من المدير يعيده «مدخل»
      if (REVIEWABLE.indexOf(table) >= 0) {
        if (isAdmin && !fourEyes_()) Object.assign(rec, { approval: APPROVAL.approved, reviewNote: old ? old.reviewNote : '', reviewedBy: who.name, reviewedAt: stamp_() });
        else Object.assign(rec, { approval: APPROVAL.pending, reviewNote: old ? old.reviewNote : '', reviewedBy: old ? old.reviewedBy : '', reviewedAt: old ? old.reviewedAt : '' });
      } else if (table === 'actions') {
        rec.reviewNote = isAdmin ? clip_(src.reviewNote, 600) : (old ? old.reviewNote : '');
        rec.createdBy = old ? old.createdBy : who.name;
      }
      rec.updatedAt = stamp_(); rec.updatedBy = who.name;
      withLock_(() => { upsert_(table, rec); audit_(who, old ? 'تعديل' : 'إضافة', table, rec.id, account.name, summary_(table, rec)); });
      return ok();
    }

    case 'deleteRecord': {
      if (who.role === 'viewer') throw new Error('هذا الحساب للعرض فقط');
      if (RECORD_TABLES.indexOf(p.table) < 0) throw new Error('نوع سجل غير معروف');
      const old = findById_(p.table, p.id);
      if (!old) throw new Error('السجل غير موجود');
      if (!isAdmin && old.accountId !== who.id) throw new Error('لا تملك صلاحية حذف هذا السجل');
      if (!isAdmin && old.approval === APPROVAL.approved) throw new Error('لا يمكن حذف سجل معتمد — اطلب من الإدارة إعادته للتعديل');
      const acc = findById_('accounts', old.accountId);
      withLock_(() => { deleteRow_(p.table, p.id); audit_(who, 'حذف', p.table, p.id, acc ? acc.name : '', summary_(p.table, old)); });
      return ok();
    }

    case 'review': {
      requireAdmin_(who);
      const items = Array.isArray(p.items) ? p.items : [{ table: p.table, id: p.id }];
      const decision = p.decision === 'return' ? APPROVAL.returned : APPROVAL.approved;
      const note = clip_(p.note, 600);
      if (decision === APPROVAL.returned && !note) throw new Error('اكتب سبب الإعادة للتعديل');
      const fe = fourEyes_(); let self = 0, done = 0;
      withLock_(() => items.forEach(it => {
        if (REVIEWABLE.indexOf(it.table) < 0) return;
        const r = findById_(it.table, it.id); if (!r) return;
        // الأربع عيون: لا يعتمد أحد سجلاً أدخله أو عدّله بنفسه
        if (fe && decision === APPROVAL.approved && r.updatedBy === who.name) { self++; return; }
        done++;
        Object.assign(r, { approval: decision, reviewNote: note || (decision === APPROVAL.approved ? '' : r.reviewNote), reviewedBy: who.name, reviewedAt: stamp_() });
        upsert_(it.table, r);
        const acc = findById_('accounts', r.accountId);
        audit_(who, decision === APPROVAL.approved ? 'اعتماد' : 'إعادة للتعديل', it.table, r.id, acc ? acc.name : '', note || summary_(it.table, r));
      }));
      if (self && !done) throw new Error('لا يمكنك اعتماد سجل أدخلته أو عدّلته بنفسك — يعتمده مستخدم آخر من الإدارة العليا');
      const res = ok(); if (self) res.warn = 'تُرك ' + self + ' سجل بلا اعتماد لأنك أدخلته بنفسك — يعتمده مستخدم آخر من الإدارة'; return res;
    }

    case 'saveBaseline': {
      if (who.role === 'viewer') throw new Error('هذا الحساب للعرض فقط');
      const asg = findById_('assign', p.assignId);
      if (!asg) throw new Error('التكليف غير موجود');
      if (!isAdmin && asg.accountId !== who.id) throw new Error('لا تملك الصلاحية');
      const n = Number(p.baseline);
      if (!(n > 0) || n > 1000000) throw new Error('أدخل عدداً صحيحاً');
      asg.baseline = Math.round(n); asg.updatedAt = stamp_();
      const acc = findById_('accounts', asg.accountId);
      withLock_(() => { upsert_('assign', asg); audit_(who, 'تعديل خط الأساس', 'assign', asg.id, acc ? acc.name : '', asg.kpiId + ' = ' + asg.baseline); });
      return ok();
    }

    // ---------- إدخال جماعي (الإدارة العليا) ----------
    case 'saveBasics': {
      requireAdmin_(who);
      const items = Array.isArray(p.items) ? p.items : [];
      const accounts = readTable_('accounts'), assigns = readTable_('assign');
      const plan = items.map(it => {
        const acc = accounts.filter(a => a.id === it.accountId && a.role !== 'viewer')[0];
        if (!acc) throw new Error('حساب غير موجود');
        const fee = it.avgFee === '' || it.avgFee === undefined || it.avgFee === null ? '' : Number(it.avgFee);
        if (fee !== '' && (!isFinite(fee) || fee < 0 || fee > 1e7)) throw new Error('قيمة رسوم غير صالحة لـ ' + acc.name);
        const bl = (it.baselines || []).map(b => {
          const a = assigns.filter(x => x.id === b.assignId && x.accountId === acc.id)[0];
          if (!a) throw new Error('تكليف غير موجود لـ ' + acc.name);
          const v = b.baseline === '' || b.baseline === undefined || b.baseline === null ? '' : Number(b.baseline);
          if (v !== '' && (!isFinite(v) || v < 0 || v > 1e6)) throw new Error('عدد غير صالح لـ ' + acc.name);
          return { a: a, v: v === '' ? '' : Math.round(v) };
        });
        return { acc: acc, fee: fee, bl: bl };
      });
      withLock_(() => plan.forEach(x => {
        const ch = [];
        if (String(x.acc.avgFee) !== String(x.fee)) { ch.push('الرسوم: ' + (x.fee === '' ? '—' : x.fee)); x.acc.avgFee = x.fee; x.acc.updatedAt = stamp_(); upsert_('accounts', x.acc); }
        x.bl.forEach(b => { if (String(b.a.baseline) !== String(b.v)) { ch.push('خط الأساس (' + b.a.kpiId + '): ' + (b.v === '' ? '—' : b.v)); b.a.baseline = b.v; b.a.updatedAt = stamp_(); upsert_('assign', b.a); } });
        if (ch.length) audit_(who, 'تعديل البيانات الأساسية', 'accounts', x.acc.id, x.acc.name, ch.join(' • '));
      }));
      return ok();
    }
    case 'saveEventsBatch': {
      requireAdmin_(who);
      const kpi = findById_('kpis', p.kpiId);
      if (!kpi || kpi.type !== 'rate') throw new Error('المؤشر غير صالح');
      if (!/^\d{4}-\d{2}$/.test(p.month || '')) throw new Error('اختر الشهر');
      checkYear_('events', { month: p.month }, null);
      const rows = (Array.isArray(p.rows) ? p.rows : []).filter(r => ['count', 'retained', 'newEnrolled'].some(k => r[k] !== '' && r[k] !== undefined && r[k] !== null));
      const assigns = readTable_('assign'), events = readTable_('events');
      const plan = rows.map(r => {
        const acc = findById_('accounts', r.accountId);
        if (!acc || !assigns.some(a => a.accountId === r.accountId && a.kpiId === kpi.id)) throw new Error('المؤشر غير مكلّف لأحد الحسابات');
        const old = events.filter(e => e.accountId === r.accountId && e.kpiId === kpi.id && e.month === p.month)[0];
        const rec = old ? parseJsonCols_('events', Object.assign({}, old)) : { id: newId_(), accountId: r.accountId, kpiId: kpi.id, month: p.month, reasons: {}, notes: '' };
        ['count', 'retained', 'newEnrolled'].forEach(k => {
          const v = r[k] === '' || r[k] === undefined || r[k] === null ? (old ? old[k] : 0) : Number(r[k]);
          if (!isFinite(v) || v < 0 || v > 1e6) throw new Error('قيمة غير صالحة لـ ' + acc.name);
          rec[k] = Math.round(v);
        });
        const rs = Object.keys(rec.reasons || {}).reduce((t, k) => t + Number(rec.reasons[k] || 0), 0);
        if (rs > rec.count) throw new Error('عدد ' + acc.name + ' (' + rec.count + ') أقل من مجموع الأسباب المسجلة (' + rs + ') — عدّل الأسباب من صفحة التفاصيل');
        rec.reasons = JSON.stringify(rec.reasons || {});
        Object.assign(rec, fourEyes_() ? { approval: APPROVAL.pending, reviewNote: old ? old.reviewNote : '', reviewedBy: '', reviewedAt: '' }
          : { approval: APPROVAL.approved, reviewNote: old ? old.reviewNote : '', reviewedBy: who.name, reviewedAt: stamp_() }, { updatedAt: stamp_(), updatedBy: who.name });
        return { acc: acc, rec: rec, isNew: !old };
      });
      withLock_(() => plan.forEach(x => { upsert_('events', x.rec); audit_(who, x.isNew ? 'إضافة (إدخال جماعي)' : 'تعديل (إدخال جماعي)', 'events', x.rec.id, x.acc.name, p.month + ' : ' + x.rec.count); }));
      return ok();
    }

    // ---------- الإدارة ----------
    case 'saveAccount': {
      requireAdmin_(who);
      const src = p.account || {};
      const old = src.id ? findById_('accounts', src.id) : null;
      const rec = Object.assign({}, old || {});
      ['name', 'empNo', 'title', 'unit', 'manager'].forEach(k => { if (src[k] !== undefined) rec[k] = clip_(src[k], 120); });
      if (['admin', 'viewer', 'member'].indexOf(src.role) >= 0) rec.role = src.role;
      if (!rec.role) rec.role = 'member';
      if (src.active !== undefined) rec.active = !!src.active;
      if (src.avgFee !== undefined) rec.avgFee = src.avgFee === '' ? '' : Math.max(0, Number(src.avgFee) || 0);
      if (src.level !== undefined) rec.level = [1, 2, 3].indexOf(Number(src.level)) >= 0 ? Number(src.level) : '';
      if (src.branch !== undefined) rec.branch = src.branch === 'support' ? 'support' : 'stages';
      if (src.oneTime !== undefined) { rec.oneTime = !!src.oneTime && rec.role === 'viewer'; if (!rec.oneTime) { rec.usedAt = ''; rec.session = ''; } }
      if (rec.role !== 'viewer') rec.oneTime = false;
      if (!rec.name) throw new Error('الاسم مطلوب');
      if (old && old.id === who.id && (rec.role !== 'admin' || !rec.active)) throw new Error('لا يمكنك إيقاف حسابك أو تغيير صلاحيته');
      // التكليفات
      let assigns = null;
      if (Array.isArray(src.assigns)) {
        if (rec.role === 'viewer' && src.assigns.length) throw new Error('حساب المشاهد لا يُكلَّف بمؤشرات');
        const kpis = readTable_('kpis');
        assigns = src.assigns.map(a => {
          const k = kpis.filter(x => x.id === a.kpiId)[0];
          if (!k) throw new Error('مؤشر غير موجود');
          const t = Number(a.target), w = Number(a.weight);
          if (!isFinite(t) || !isFinite(w) || w < 0 || w > 100) throw new Error('قيمة غير صالحة في مستهدف/وزن «' + k.name + '»');
          return { kpiId: k.id, target: t, weight: w };
        });
        if (assigns.length) {
          const sum = assigns.reduce((s, a) => s + a.weight, 0);
          if (Math.abs(sum - 100) > 0.01) throw new Error('مجموع أوزان المؤشرات المكلّفة يجب أن يساوي 100% (الحالي ' + sum + '%)');
        }
      }
      let newCode = '';
      if (!rec.id) { rec.id = newId_(); newCode = newCode_(6); setCode_(rec, newCode); if (src.active === undefined) rec.active = true; }
      rec.updatedAt = stamp_();
      const cur = readTable_('assign').filter(a => a.accountId === rec.id);
      // تحويل حساب مكلّف بمؤشرات إلى «مشاهد»: تُحذف تكليفاته (ولا يُسمح بذلك إن كانت له سجلات)
      if (rec.role === 'viewer' && cur.length) {
        if (RECORD_TABLES.some(t => readTable_(t).some(r => r.accountId === rec.id)))
          throw new Error('لا يمكن تغيير صلاحية حساب له سجلات بيانات — أوقفه وأنشئ حساباً جديداً بالصلاحية المطلوبة');
        assigns = [];
      }
      const removed = assigns ? cur.filter(a => !assigns.some(x => x.kpiId === a.kpiId)) : [];
      removed.forEach(a => {
        const k = findById_('kpis', a.kpiId);
        if (k && readTable_(TABLE_OF_TYPE[k.type]).some(r => r.accountId === rec.id && r.kpiId === a.kpiId))
          throw new Error('لا يمكن إلغاء تكليف «' + k.name + '» لوجود سجلات له — احذف سجلاته أولاً أو اجعل وزنه 0');
      });
      withLock_(() => {
        upsert_('accounts', rec);
        if (assigns) {
          removed.forEach(a => deleteRow_('assign', a.id));
          assigns.forEach(a => {
            const ex = cur.filter(x => x.kpiId === a.kpiId)[0];
            upsert_('assign', Object.assign(ex || { id: newId_(), accountId: rec.id, kpiId: a.kpiId, baseline: '' }, { target: a.target, weight: a.weight, updatedAt: stamp_() }));
          });
        }
        audit_(who, old ? 'تعديل حساب' : 'إضافة حساب', 'accounts', rec.id, rec.name, roleName_(rec.role) + (assigns && rec.role !== 'viewer' ? ' • ' + assigns.length + ' مؤشر' : ''));
      });
      // الكود الجديد يظهر مرة واحدة لمن أنشأه ليسلّمه، ثم لا يراه بعدها إلا مسؤول النظام
      const res = ok(); if (newCode) { res.newCode = newCode; res.forName = rec.name; } return res;
    }
    case 'regenCode': {
      requireAdmin_(who);
      const acc = findById_('accounts', p.id);
      if (!acc) throw new Error('الحساب غير موجود');
      const plain = p.code ? checkCode_(p.code, acc.id) : newCode_(6);
      setCode_(acc, plain); acc.updatedAt = stamp_();
      acc.usedAt = ''; acc.session = '';   // كود جديد لحساب مؤقت = صلاحية دخول واحدة جديدة
      withLock_(() => { upsert_('accounts', acc); audit_(who, p.code ? 'تعيين كود مخصص' : 'كود جديد', 'accounts', acc.id, acc.name, ''); });
      revokeSessions_(acc.id);   // الكود الجديد يُنهي كل جلسات الحساب المفتوحة
      const res = ok(); res.newCode = plain; res.forName = acc.name; return res;   // مرة واحدة لمن أنشأه
    }
    case 'changeMyCode': {
      if (who.oneTime) throw new Error('الحساب المؤقت لا يغيّر كوده');
      const plain = checkCode_(p.newCode, who.id), c = hashCode_(plain);
      withLock_(() => {
        if (who.id === 'system') { const s = readSettings_(); s.adminCode = c; writeSettings_(s); }
        else { const acc = findById_('accounts', who.id); setCode_(acc, plain); acc.updatedAt = stamp_(); upsert_('accounts', acc); }
        audit_(who, 'تغيير كود الدخول', 'accounts', who.id, who.name, 'بواسطة صاحب الحساب');
      });
      revokeSessions_(who.id);   // إنهاء الجلسات على الأجهزة الأخرى، وإصدار جلسة جديدة لهذا الجهاز
      return { ok: true, token: newSession_(who.id, !!p.remember) };
    }
    case 'deleteAccount': {
      requireAdmin_(who);
      const acc = findById_('accounts', p.id);
      if (!acc) throw new Error('الحساب غير موجود');
      if (acc.id === who.id) throw new Error('لا يمكنك حذف حسابك');
      withLock_(() => {
        RECORD_TABLES.concat(['assign']).forEach(t => readTable_(t).filter(r => r.accountId === acc.id).forEach(r => deleteRow_(t, r.id)));
        deleteRow_('accounts', acc.id);
        audit_(who, 'حذف حساب', 'accounts', acc.id, acc.name, 'مع جميع سجلاته');
      });
      return ok();
    }
    case 'saveKpi': {
      requireAdmin_(who);
      const src = p.kpi || {};
      const old = src.id ? findById_('kpis', src.id) : null;
      const rec = Object.assign({}, old || {});
      ['name', 'goal', 'subgoal', 'unit'].forEach(k => { if (src[k] !== undefined) rec[k] = clip_(src[k], 200); });
      if (src.text !== undefined) rec.text = clip_(src.text, 600);
      if (!rec.name) throw new Error('اسم المؤشر مطلوب');
      if (src.type !== undefined && src.type !== rec.type) {
        if (TYPES.indexOf(src.type) < 0) throw new Error('نوع القياس غير معروف');
        if (old && readTable_(TABLE_OF_TYPE[old.type]).some(r => r.kpiId === old.id)) throw new Error('لا يمكن تغيير نوع القياس لمؤشر له سجلات');
        rec.type = src.type;
      }
      if (!rec.type) throw new Error('نوع القياس مطلوب');
      rec.direction = rec.type === 'rate' ? 'down' : (rec.type === 'reading' ? (src.direction === 'down' ? 'down' : 'up') : 'up');
      ['defTarget', 'defWeight', 'order'].forEach(k => { if (src[k] !== undefined && src[k] !== '') rec[k] = Number(src[k]); if (!isFinite(rec[k])) rec[k] = 0; });
      rec.fin = rec.type === 'count' && src.fin === 'acquisition' ? 'acquisition' : rec.type === 'rate' && src.fin === 'attrition' ? 'attrition' : '';
      if (src.config !== undefined) rec.config = typeof src.config === 'string' ? src.config : JSON.stringify(src.config || {});
      if (src.active !== undefined) rec.active = !!src.active;
      if (!old) { rec.id = 'k' + newCode_(5).toLowerCase(); if (rec.active === undefined) rec.active = true; if (!rec.order) rec.order = readTable_('kpis').length + 1; }
      rec.updatedAt = stamp_();
      withLock_(() => { upsert_('kpis', rec); audit_(who, old ? 'تعديل مؤشر' : 'إضافة مؤشر', 'kpis', rec.id, '', rec.name); });
      return ok();
    }
    case 'deleteKpi': {
      requireAdmin_(who);
      const k = findById_('kpis', p.id);
      if (!k) throw new Error('المؤشر غير موجود');
      if (readTable_('assign').some(a => a.kpiId === k.id)) throw new Error('المؤشر مكلّف لحسابات — ألغِ التكليف أولاً أو أوقف المؤشر بدلاً من حذفه');
      withLock_(() => { deleteRow_('kpis', k.id); audit_(who, 'حذف مؤشر', 'kpis', k.id, '', k.name); });
      return ok();
    }
    case 'saveSettings': {
      requireAdmin_(who);
      const s = readSettings_(), src = p.settings || {};
      if (src.yearLabel) s.yearLabel = clip_(src.yearLabel, 30);
      ['yearStart', 'yearEnd'].forEach(k => { if (src[k]) { if (!/^\d{4}-\d{2}-\d{2}$/.test(src[k])) throw new Error('صيغة التاريخ غير صحيحة'); s[k] = src[k]; } });
      if (s.yearStart >= s.yearEnd) throw new Error('تاريخ نهاية العام يجب أن يكون بعد بدايته');
      if (src.schoolName) s.schoolName = clip_(src.schoolName, 80);
      if (src.systemName) s.systemName = clip_(src.systemName, 80);
      if (src.adminCode) {
        if (who.id !== 'system') throw new Error('كود مسؤول النظام يغيّره مسؤول النظام فقط');
        s.adminCode = hashCode_(checkCode_(src.adminCode, 'system'));
      }
      ['contributionMargin', 'attributionShare'].forEach(k => {
        if (src[k] === undefined) return;
        if (src[k] === '' || src[k] === null) { s[k] = ''; return; }
        const v = Number(src[k]); if (!isFinite(v) || v < 0 || v > 100) throw new Error('النسب المالية بين 0 و 100');
        s[k] = String(v);
      });
      const fe = src.fourEyes === undefined ? null : (src.fourEyes ? '1' : '0');
      if (fe !== null && fe !== (fourEyes_() ? '1' : '0')) {
        if (who.id !== 'system') throw new Error('مبدأ «الأربع عيون» يغيّره مسؤول النظام فقط');
        s.fourEyes = fe;
      }
      withLock_(() => { writeSettings_(s); audit_(who, 'تعديل الإعدادات', 'settings', '', '', (src.adminCode ? 'مع تغيير كود مسؤول النظام • ' : '') + 'الأربع عيون: ' + (s.fourEyes === '0' ? 'معطّل' : 'مفعّل')); });
      if (src.adminCode) revokeSessions_('system');
      return { ok: true, data: buildData_(who) };
    }
    // استعادة عرض الأكواد الحالية: يلصق المسؤول نصاً فيه الأكواد (مثل سجل setup)، ويُقبل كل كود يطابق تجزئة حسابه فقط
    case 'restoreCodes': {
      if (who.id !== 'system') throw new Error('عرض الأكواد لمسؤول النظام فقط');
      const tokens = (String(p.text || '').toUpperCase().match(/[A-Z0-9][A-Z0-9-]{3,19}/g) || []).filter((v, i, a) => a.indexOf(v) === i).slice(0, 2000);
      let n = 0;
      withLock_(() => {
        const hs = tokens.map(t => [t, hashCode_(t)]);
        readTable_('accounts').forEach(a => {
          if (!isHashed_(a.code) || decCode_(a.codeEnc)) return;
          const m = hs.filter(x => x[1] === a.code)[0];
          if (m) { a.codeEnc = encCode_(m[0]); upsert_('accounts', a); n++; }
        });
        if (n) audit_(who, 'استعادة عرض الأكواد', 'accounts', '', '', n + ' حساب');
      });
      const res = ok(); res.restored = n; return res;
    }
    // الإقفال الشهري: لقطة رسمية لنتائج كل الحسابات في نهاية الشهر (من المعتمد فقط)، لا تتغير بعدها
    case 'saveSnapshot': {
      requireAdmin_(who);
      const m = String(p.month || ''), st = readSettings_(), tz = Session.getScriptTimeZone();
      if (!/^\d{4}-\d{2}$/.test(m)) throw new Error('اختر الشهر');
      if (m < String(st.yearStart).slice(0, 7) || m > String(st.yearEnd).slice(0, 7)) throw new Error('الشهر خارج العام الدراسي الحالي');
      if (m >= Utilities.formatDate(new Date(), tz, 'yyyy-MM')) throw new Error('لا يُقفل شهر لم ينتهِ بعد');
      const old = readTable_('snapshots').filter(r => r.month === m);
      if (old.length && !p.replace) throw new Error('هذا الشهر مُقفل مسبقاً');
      if (old.length && who.id !== 'system') throw new Error('إعادة إقفال شهر سابق لمسؤول النظام فقط');
      const accs = {}, kpis = {}; readTable_('accounts').forEach(a => accs[a.id] = true); readTable_('kpis').forEach(k => kpis[k.id] = true);
      const nz = v => { if (v === '' || v === null || v === undefined) return ''; const n = Number(v); if (!isFinite(n) || Math.abs(n) > 1e13) throw new Error('قيمة غير صالحة في اللقطة'); return Math.round(n * 1e4) / 1e4; };
      const rows = (Array.isArray(p.rows) ? p.rows : []).slice(0, 5000).map(r => {
        if (!accs[r.accountId]) throw new Error('حساب غير موجود في اللقطة');
        const kpiId = String(r.kpiId || ''); if (kpiId && !kpis[kpiId]) throw new Error('مؤشر غير موجود في اللقطة');
        if (SNAPSHOT_STATUS.indexOf(r.status) < 0) throw new Error('حالة غير معروفة في اللقطة');
        return { id: newId_(), month: m, accountId: String(r.accountId), kpiId: kpiId, actual: nz(r.actual), interim: nz(r.interim), annual: nz(r.annual),
          achYear: nz(r.achYear), achInterim: nz(r.achInterim), dev: nz(r.dev), status: r.status, score: nz(r.score), coverage: nz(r.coverage), weight: nz(r.weight),
          createdBy: who.name, createdAt: stamp_() };
      });
      if (!rows.length) throw new Error('لا توجد نتائج لحفظها');
      withLock_(() => {
        old.forEach(r => deleteRow_('snapshots', r.id));
        appendRows_('snapshots', rows);
        audit_(who, old.length ? 'إعادة إقفال شهر' : 'إقفال شهر', 'snapshots', m, '', m + ' • ' + rows.length + ' سطر');
      });
      return ok();
    }
    case 'getAudit': {
      requireAdmin_(who);
      const all = readTable_('audit');
      return { ok: true, audit: all.slice(-Math.min(Number(p.limit) || 300, 2000)).reverse() };
    }
    default: throw new Error('إجراء غير معروف');
  }
}

// ===================== الصلاحيات والبيانات =====================
const SESSION_HOURS = 12, REMEMBER_DAYS = 30, FAIL_WINDOW_MIN = 10, FAIL_MAX = 30;
const SYSTEM_WHO_ = { role: 'admin', id: 'system', name: 'مسؤول النظام', title: 'مسؤول النظام' };
function auth_(code, action) {
  code = String(code || '').trim().toUpperCase();
  if (code.length < 4) return null;
  // جلسة حساب مؤقت: صالحة لساعات محدودة بعد أول (وآخر) دخول
  if (code.indexOf('S-') === 0) {
    const a = readTable_('accounts').filter(x => x.oneTime && x.session && String(x.session).toUpperCase() === code)[0];
    if (!a || !a.active || !a.usedAt || (Date.now() - new Date(a.usedAt).getTime()) > SESSION_HOURS * 3600e3) return null;
    return a;
  }
  // رمز جلسة يصدر عند الدخول — كل الطلبات بعد الدخول تستخدمه بدل الكود
  if (code.indexOf('T-') === 0) return sessionWho_(code);
  // الكود نفسه لا يُقبل إلا لتسجيل الدخول، فلا يتكرر إرساله مع كل طلب
  if (action !== 'login') return null;
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('authFails') || 0);
  if (fails >= FAIL_MAX) return { _locked: true };
  const who = codeWho_(code);
  if (!who) { cache.put('authFails', String(fails + 1), FAIL_WINDOW_MIN * 60); Utilities.sleep(1500); }
  return who;
}
function codeWho_(code) {
  const h = hashCode_(code), s = readSettings_();
  if (s.adminCode && (s.adminCode === h || (!isHashed_(s.adminCode) && String(s.adminCode).toUpperCase() === code))) {
    if (!isHashed_(s.adminCode)) withLock_(() => { const s2 = readSettings_(); if (!isHashed_(s2.adminCode)) { s2.adminCode = h; writeSettings_(s2); } });
    return SYSTEM_WHO_;
  }
  const acc = readTable_('accounts').filter(a => a.code === h || (!isHashed_(a.code) && String(a.code).toUpperCase() === code))[0];
  if (!acc || !acc.active) return null;
  // ترقية كود قديم غير مشفّر، أو حفظ نسخته القابلة للعرض إن لم تكن موجودة — عند أول دخول ناجح
  if (!isHashed_(acc.code) || !decCode_(acc.codeEnc)) withLock_(() => {
    delete cache_.accounts; const cur = findById_('accounts', acc.id);
    if (cur && (!isHashed_(cur.code) || !decCode_(cur.codeEnc))) { setCode_(cur, code); upsert_('accounts', cur); }
  });
  if (acc.oneTime) {
    // الكود المؤقت يفتح مرة واحدة فقط: أول دخول يستهلكه ويُصدر جلسة، وأي استخدام آخر للكود مرفوض
    return withLock_(() => {
      delete cache_.accounts;
      const cur = findById_('accounts', acc.id);
      if (!cur || cur.usedAt) return { _used: true };
      cur.usedAt = new Date().toISOString(); cur.session = 'S-' + newCode_(24);
      upsert_('accounts', cur);
      audit_(cur, 'دخول بحساب مؤقت', 'accounts', cur.id, cur.name, 'استُهلك الكود المؤقت');
      cur._session = cur.session;
      return cur;
    });
  }
  return acc;
}
// ---- تشفير الأكواد ----
function codeSalt_() {
  const pr = PropertiesService.getScriptProperties();
  let salt = pr.getProperty('CODE_SALT');
  if (!salt) { salt = Utilities.getUuid() + Utilities.getUuid(); pr.setProperty('CODE_SALT', salt); }
  return salt;
}
function sha_(v) { return Utilities.base64Encode(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(v), Utilities.Charset.UTF_8)); }
function hashCode_(code) { return 'H1:' + sha_(codeSalt_() + '|' + String(code).trim().toUpperCase()); }
function isHashed_(v) { return String(v || '').indexOf('H1:') === 0; }
// يحفظ الكود: تجزئة للتحقق + نسخة مشفّرة قابلة للاسترجاع لعرضها للإدارة
function setCode_(acc, plain) { plain = String(plain).trim().toUpperCase(); acc.code = hashCode_(plain); acc.codeEnc = encCode_(plain); return acc; }
// تشفير متماثل: تدفق مفاتيح من HMAC-SHA256(CODE_KEY, nonce:i) — يكفي لأكواد قصيرة، والمفتاح خارج Google Sheet
function codeKey_() {
  const pr = PropertiesService.getScriptProperties();
  let k = pr.getProperty('CODE_KEY');
  if (!k) { k = Utilities.getUuid() + Utilities.getUuid(); pr.setProperty('CODE_KEY', k); }
  return k;
}
function keyStream_(nonce, n) {
  const out = [], key = codeKey_();
  for (let i = 0; out.length < n; i++) Utilities.computeHmacSha256Signature(nonce + ':' + i, key).forEach(b => out.push(b & 255));
  return out.slice(0, n);
}
function encCode_(plain) {
  const c = String(plain), nonce = Utilities.getUuid().replace(/-/g, '').slice(0, 16), k = keyStream_(nonce, c.length);
  const bytes = []; for (let i = 0; i < c.length; i++) { const v = (c.charCodeAt(i) ^ k[i]) & 255; bytes.push(v > 127 ? v - 256 : v); }
  return 'E1:' + nonce + ':' + Utilities.base64Encode(bytes);
}
// الكود المعروض للإدارة: يُعرض فقط إذا طابق تجزئة الحساب الفعلية (لا يُعرض كود قديم أو تالف)
function codeOf_(a) {
  if (a.code && !isHashed_(a.code)) return String(a.code).toUpperCase();   // حساب لم يُرقَّ بعد
  const p = decCode_(a.codeEnc);
  return p && hashCode_(p) === a.code ? p : '';
}
function decCode_(v) {
  const m = /^E1:([0-9a-f]+):(.+)$/.exec(String(v || '')); if (!m) return '';
  try { const b = Utilities.base64Decode(m[2]), k = keyStream_(m[1], b.length); let s = ''; for (let i = 0; i < b.length; i++) s += String.fromCharCode((b[i] & 255) ^ k[i]); return /^[A-Z0-9-]{4,24}$/.test(s) ? s : ''; }
  catch (e) { return ''; }
}
// يشفّر أي كود محفوظ كنص صريح، ويعيد قائمة بالأكواد التي شُفّرت الآن (تُطبع في سجل setup لآخر مرة)
function migrateCodes_() {
  const out = [], short = c => String(c).length < 6 ? ' — قصير: أنشئ كوداً جديداً' : '';
  const s = readSettings_();
  if (s.adminCode && !isHashed_(s.adminCode)) { out.push('مسؤول النظام: ' + s.adminCode + short(s.adminCode)); s.adminCode = hashCode_(s.adminCode); writeSettings_(s); }
  readTable_('accounts').forEach(a => {
    if (!a.code || isHashed_(a.code)) return;
    out.push(a.name + ' (' + roleName_(a.role) + '): ' + a.code + short(a.code));
    setCode_(a, a.code); upsert_('accounts', a);
  });
  return out;
}
// ---- الجلسات (Script Properties؛ يُحفظ تجزئة الرمز لا الرمز نفسه) ----
function newSession_(id, remember) {
  const tok = 'T-' + (Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '').toUpperCase();
  const pr = PropertiesService.getScriptProperties(), now = Date.now(), all = pr.getProperties();
  Object.keys(all).forEach(k => { if (k.indexOf('ses_') !== 0) return; let v = null; try { v = JSON.parse(all[k]); } catch (e) {} if (!v || !(v.exp > now)) pr.deleteProperty(k); });
  pr.setProperty('ses_' + sha_(tok), JSON.stringify({ id: id, exp: now + (remember ? REMEMBER_DAYS * 24 : SESSION_HOURS) * 3600e3 }));
  return tok;
}
function sessionWho_(tok) {
  const raw = PropertiesService.getScriptProperties().getProperty('ses_' + sha_(tok));
  let v = null; try { v = raw ? JSON.parse(raw) : null; } catch (e) {}
  if (!v) return null;
  if (!(v.exp > Date.now())) { endSession_(tok); return null; }
  if (v.id === 'system') return SYSTEM_WHO_;
  const acc = findById_('accounts', v.id);
  return acc && acc.active && !acc.oneTime ? acc : null;
}
function endSession_(tok) { PropertiesService.getScriptProperties().deleteProperty('ses_' + sha_(tok)); }
function revokeSessions_(id) {
  const pr = PropertiesService.getScriptProperties(), all = pr.getProperties();
  Object.keys(all).forEach(k => { if (k.indexOf('ses_') !== 0) return; try { if (JSON.parse(all[k]).id === id) pr.deleteProperty(k); } catch (e) { pr.deleteProperty(k); } });
}
function fourEyes_() { return String(readSettings_().fourEyes) !== '0'; }
function requireAdmin_(who) { if (who.role !== 'admin') throw new Error('هذه العملية للإدارة العليا فقط'); }
// التحقق من كود دخول جديد: 6–20 حرفاً إنجليزياً/رقماً/شرطة، وغير مستخدم لأي حساب آخر
function checkCode_(code, selfId) {
  const c = String(code || '').trim().toUpperCase();
  if (!/^[A-Z0-9-]{6,20}$/.test(c)) throw new Error('الكود يجب أن يكون من 6 إلى 20 خانة: حروف إنجليزية أو أرقام أو شرطة (-) فقط');
  if (/^[ST]-/.test(c)) throw new Error('الكود لا يبدأ بـ S- أو T- (محجوزة للجلسات)');
  if (!/[A-Z]/.test(c) || !/[0-9]/.test(c)) throw new Error('الكود يجب أن يجمع بين حروف وأرقام');
  if (/^(.)\1+$/.test(c) || ['123456', '1234567', '12345678', 'ABCDEF', 'QWERTY', 'ABC123', 'A12345', 'ADMIN1'].indexOf(c) >= 0) throw new Error('الكود سهل التخمين — اختر كوداً أقوى');
  const s = readSettings_(), h = hashCode_(c), same = v => v === h || (!isHashed_(v) && String(v || '').toUpperCase() === c);
  if (selfId !== 'system' && same(s.adminCode)) throw new Error('هذا الكود مستخدم — اختر كوداً آخر');
  if (readTable_('accounts').some(a => a.id !== selfId && same(a.code))) throw new Error('هذا الكود مستخدم — اختر كوداً آخر');
  return c;
}
function roleName_(r) { return r === 'admin' ? 'إدارة عليا' : r === 'viewer' ? 'مشاهد' : 'مدير/مسؤول'; }

function buildData_(who) {
  const s = readSettings_();
  const settings = { yearLabel: s.yearLabel, yearStart: s.yearStart, yearEnd: s.yearEnd, schoolName: s.schoolName, systemName: s.systemName,
    fourEyes: String(s.fourEyes) !== '0', contributionMargin: s.contributionMargin === undefined ? '' : s.contributionMargin,
    attributionShare: s.attributionShare === undefined || s.attributionShare === '' ? '100' : s.attributionShare };
  const isAll = who.role === 'admin' || who.role === 'viewer';
  let accounts = readTable_('accounts');
  if (!isAll) accounts = accounts.filter(a => a.id === who.id);
  // أصحاب البطاقات: مديرو المراحل، وأي حساب إدارة عليا مكلّف بمؤشرات (المدير التنفيذي، مدير التعليم…)
  const allAsg = readTable_('assign'), holder = a => a.role === 'member' || (a.role === 'admin' && allAsg.some(x => x.accountId === a.id));
  if (who.role === 'viewer') accounts = accounts.filter(holder);
  accounts = accounts.map(a => { const c = Object.assign({}, a); delete c.session; delete c.code; delete c.codeEnc;
    if (who.id === 'system') c.codePlain = codeOf_(a);   // الأكواد يراها مسؤول النظام وحده
    if (who.role !== 'admin') delete c.usedAt; return c; });
  const ids = {}; accounts.filter(holder).forEach(a => ids[a.id] = true);
  const records = {};
  RECORD_TABLES.forEach(t => { records[t] = readTable_(t).filter(r => ids[r.accountId]).map(parseJsonCols_.bind(null, t)); });
  return {
    me: { role: who.role, id: who.id, name: who.name, title: who.title || '', unit: who.unit || '', oneTime: !!who.oneTime },
    settings: settings,
    kpis: readTable_('kpis').filter(k => who.role === 'admin' || k.active).map(parseJsonCols_.bind(null, 'kpis')),
    accounts: accounts,
    assigns: readTable_('assign').filter(a => ids[a.accountId]),
    records: records,
    snapshots: readTable_('snapshots').filter(r => ids[r.accountId]),
    serverTime: stamp_()
  };
}
function parseJsonCols_(t, r) {
  SCHEMA[t].cols.forEach(([k, , kind]) => { if (kind === 'json') { try { r[k] = r[k] ? JSON.parse(r[k]) : {}; } catch (e) { r[k] = {}; } } });
  return r;
}

// ===================== التحقق =====================
function sanitize_(table, src) {
  const rec = {};
  SCHEMA[table].cols.forEach(([k, , kind]) => {
    if (['accountId', 'updatedAt', 'updatedBy', 'approval', 'reviewNote', 'reviewedBy', 'reviewedAt', 'createdBy'].indexOf(k) >= 0) return;
    let v = src[k];
    if (v === undefined || v === null) v = '';
    if (kind === 'num') rec[k] = v === '' ? '' : Number(v);
    else if (kind === 'json') rec[k] = typeof v === 'object' ? v : (function () { try { return v ? JSON.parse(v) : {}; } catch (e) { return {}; } })();
    else rec[k] = clip_(v, ['notes', 'strengths', 'improvements', 'actionTaken'].indexOf(k) >= 0 ? 800 : 300);
  });
  return rec;
}
function validate_(table, r, kpi) {
  const cfg = kpi ? (typeof kpi.config === 'string' ? safeJson_(kpi.config) : kpi.config || {}) : {};
  const isDate = v => /^\d{4}-\d{2}-\d{2}$/.test(v);
  const nonNeg = keys => keys.forEach(k => {
    if (r[k] === '') r[k] = 0;
    if (!isFinite(r[k]) || r[k] < 0 || r[k] > 1e9) throw new Error('قيمة غير صالحة في الحقل: ' + k);
  });
  const cleanMap = (obj, allowed, max) => {
    const o = {}; let sum = 0;
    Object.keys(obj || {}).forEach(k => {
      if (allowed && allowed.indexOf(k) < 0) return;
      const v = Number(obj[k]); if (!isFinite(v) || v < 0 || (max != null && v > max)) throw new Error('قيمة غير صالحة: ' + k);
      if (obj[k] === '' || obj[k] === null) return;
      o[k] = Math.round(v * 10) / 10; sum += o[k];
    });
    return { o: o, sum: sum };
  };
  if (table === 'activities') {
    if (!r.title) throw new Error('الاسم مطلوب');
    if (!isDate(r.date)) throw new Error('التاريخ مطلوب');
    if (['منفذة', 'مخطط لها'].indexOf(r.status) < 0) r.status = 'منفذة';
    nonNeg(['beneficiaries', 'leads', 'applications', 'registrations', 'budget', 'cost']);
  } else if (table === 'events') {
    if (!/^\d{4}-\d{2}$/.test(r.month)) throw new Error('الشهر مطلوب');
    nonNeg(['count', 'newEnrolled', 'retained']);
    const m = cleanMap(r.reasons, cfg.reasons, null);
    if (m.sum > r.count) throw new Error('مجموع الأسباب أكبر من العدد');
    r.reasons = JSON.stringify(m.o);
    if (readTable_('events').some(x => x.accountId === r.accountId && x.kpiId === r.kpiId && x.month === r.month && x.id !== r.id))
      throw new Error('يوجد سجل لهذا الشهر مسبقاً — عدّله بدلاً من إضافة سجل جديد');
  } else if (table === 'surveys') {
    if (!isDate(r.date)) throw new Error('تاريخ القياس مطلوب');
    nonNeg(['promoters', 'passives', 'detractors', 'population']);
    const n = r.promoters + r.passives + r.detractors;
    if (n === 0) throw new Error('أدخل أعداد المستجيبين');
    if (r.population && n > r.population) throw new Error('عدد المستجيبين أكبر من إجمالي المستهدفين');
    r.reasons = JSON.stringify(cleanMap(r.reasons, cfg.reasons, null).o);
  } else if (table === 'assessments') {
    if (!isDate(r.date)) throw new Error('التاريخ مطلوب');
    const kinds = cfg.kinds || ['تقويم ذاتي', 'تقييم تجريبي', 'النتيجة الرسمية'];
    if (kinds.indexOf(r.kind) < 0) r.kind = kinds[0];
    const m = cleanMap(r.domains, cfg.domains, 100);
    r.domains = JSON.stringify(m.o);
    if (r.overall === '') {
      const vals = Object.keys(m.o).map(k => m.o[k]);
      if (!vals.length) throw new Error('أدخل النتيجة الكلية أو نتائج المجالات');
      r.overall = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10;
    } else if (!isFinite(r.overall) || r.overall < 0 || r.overall > 100) throw new Error('النتيجة الكلية بين 0 و 100');
  } else if (table === 'readings') {
    if (!isDate(r.date)) throw new Error('التاريخ مطلوب');
    if (r.value === '' || !isFinite(r.value)) throw new Error('القيمة مطلوبة');
  } else if (table === 'finance') {
    if (!/^\d{4}-\d{2}$/.test(r.month)) throw new Error('الشهر مطلوب');
    const rv = cleanMap(r.revItems, cfg.revItems, 1e10), ex = cleanMap(r.expItems, cfg.expItems, 1e10);
    if (Object.keys(rv.o).length) r.revenue = rv.sum;
    if (Object.keys(ex.o).length) r.expenses = ex.sum;
    r.revItems = JSON.stringify(rv.o); r.expItems = JSON.stringify(ex.o);
    ['revenue', 'expenses'].forEach(k => { if (r[k] === '') r[k] = 0; if (!isFinite(r[k]) || r[k] < 0 || r[k] > 1e11) throw new Error('قيمة غير صالحة في الإيرادات/المصروفات'); });
    if (!r.revenue && !r.expenses) throw new Error('أدخل الإيرادات أو المصروفات');
    if (readTable_('finance').some(x => x.accountId === r.accountId && x.kpiId === r.kpiId && x.month === r.month && x.id !== r.id))
      throw new Error('يوجد سجل لهذا الشهر مسبقاً — عدّله بدلاً من إضافة سجل جديد');
  } else if (table === 'ratios') {
    if (!isDate(r.date)) throw new Error('التاريخ مطلوب');
    ['num', 'den'].forEach(k => { if (r[k] === '') r[k] = 0; if (!isFinite(r[k]) || r[k] < 0 || r[k] > 1e11) throw new Error('قيمة غير صالحة'); });
    if (!(r.den > 0)) throw new Error('أدخل المقام (الإجمالي)');
    if (r.num > r.den) throw new Error('البسط أكبر من المقام');
    const m = cleanMap(r.reasons, cfg.reasons, 1e11);
    if (m.sum > r.den - r.num + 0.5) throw new Error('مجموع توزيع الفجوة أكبر من الفرق بين المقام والبسط');
    r.reasons = JSON.stringify(m.o);
  } else if (table === 'actions') {
    if (!r.title) throw new Error('وصف الإجراء مطلوب');
    if (!isDate(r.due)) throw new Error('تاريخ الاستحقاق مطلوب');
    if (ACTION_STATUS.indexOf(r.status) < 0) r.status = ACTION_STATUS[0];
    if (r.progress === '') r.progress = r.status === 'مكتمل' ? 100 : 0;
    if (!isFinite(r.progress) || r.progress < 0 || r.progress > 100) throw new Error('نسبة الإنجاز بين 0 و 100');
    if (r.status === 'مكتمل') r.progress = 100;
  }
}
// المبادرات والبيانات الشهرية تُحسب ضمن العام الدراسي الحالي فقط؛ لا يُقبل سجل جديد (أو تغيير تاريخه) خارجه
function checkYear_(table, rec, old) {
  if (table !== 'activities' && table !== 'events' && table !== 'finance') return;
  const s = readSettings_();
  if (!s.yearStart || !s.yearEnd) return;
  const isM = table !== 'activities', key = isM ? rec.month : rec.date;
  if (old && (isM ? old.month : old.date) === key) return;
  const lo = isM ? s.yearStart.slice(0, 7) : s.yearStart, hi = isM ? s.yearEnd.slice(0, 7) : s.yearEnd;
  if (key < lo || key > hi) throw new Error((isM ? 'الشهر' : 'التاريخ') + ' خارج العام الدراسي الحالي ' + (s.yearLabel || '') + ' (' + lo + ' ← ' + hi + ')');
}
function summary_(t, r) {
  if (t === 'activities') return (r.title || '') + ' — ' + (r.date || '');
  if (t === 'events') return (r.month || '') + ' : ' + r.count;
  if (t === 'surveys') return (r.round || '') + ' ' + (r.date || '');
  if (t === 'assessments') return (r.kind || '') + ' ' + (r.date || '') + ' = ' + r.overall + '%';
  if (t === 'readings') return (r.date || '') + ' = ' + r.value;
  if (t === 'actions') return (r.title || '') + ' (' + (r.status || '') + ')';
  if (t === 'finance') return (r.month || '') + ' : ' + r.revenue + ' − ' + r.expenses;
  if (t === 'ratios') return (r.period || r.date || '') + ' : ' + r.num + ' / ' + r.den;
  return '';
}
function audit_(who, action, table, recordId, accountName, detail) {
  upsert_('audit', { id: newId_(), time: stamp_(), actor: who.name, role: roleName_(who.role), action: action,
    table: TABLE_NAMES[table] || table, recordId: recordId || '', account: accountName || '', detail: clip_(detail, 300) });
}

// ===================== طبقة الأوراق =====================
function ensureSheet_(type) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const def = SCHEMA[type];
  let sh = ss.getSheetByName(def.sheet);
  if (!sh) {
    sh = ss.insertSheet(def.sheet);
    sh.getRange(1, 1, 1, def.cols.length).setValues([def.cols.map(c => c[1])]).setFontWeight('bold').setBackground('#e8f5ef');
    sh.setFrozenRows(1);
    sh.setRightToLeft(true);
  } else if (!ensured_[type]) {
    // أعمدة أُضيفت في إصدار أحدث: تُكتب عناوينها في نهاية الورقة دون المساس بالبيانات
    const have = sh.getLastColumn();
    if (have < def.cols.length) {
      if (sh.getMaxColumns() < def.cols.length) sh.insertColumnsAfter(sh.getMaxColumns(), def.cols.length - sh.getMaxColumns());
      sh.getRange(1, have + 1, 1, def.cols.length - have).setValues([def.cols.slice(have).map(c => c[1])]).setFontWeight('bold').setBackground('#e8f5ef');
    }
  }
  ensured_[type] = true;
  return sh;
}
const cache_ = {};
const ensured_ = {};
function readTable_(type) {
  if (cache_[type]) return cache_[type].map(o => Object.assign({}, o));
  const sh = ensureSheet_(type);
  const n = sh.getLastRow();
  const cols = SCHEMA[type].cols;
  if (n < 2) { cache_[type] = []; return []; }
  const vals = sh.getRange(2, 1, n - 1, cols.length).getValues();
  const tz = Session.getScriptTimeZone();
  const out = vals.filter(r => r[0] !== '' && r[0] !== null).map(row => {
    const o = {};
    cols.forEach(([k, , kind], i) => {
      let v = row[i];
      if (v instanceof Date) v = Utilities.formatDate(v, tz, kind === 'month' ? 'yyyy-MM' : 'yyyy-MM-dd');
      if (kind === 'num') v = (v === '' || v === null) ? '' : Number(v);
      else if (kind === 'bool') v = v === true || String(v).toUpperCase() === 'TRUE' || v === 'نعم';
      else v = v === null ? '' : String(v);
      o[k] = v;
    });
    return o;
  });
  cache_[type] = out;
  return out.map(o => Object.assign({}, o));
}
function toCell_(v, kind) {
  if (v === undefined || v === null) return '';
  if (kind === 'num') return v === '' ? '' : Number(v);
  if (kind === 'bool') return !!v;
  let s = (kind === 'json' && typeof v === 'object') ? JSON.stringify(v) : String(v);
  if (kind === 'date' || kind === 'month' || /^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}
function upsert_(type, rec) {
  const sh = ensureSheet_(type);
  const cols = SCHEMA[type].cols;
  const row = cols.map(([k, , kind]) => toCell_(rec[k], kind));
  const r = findRow_(sh, rec.id);
  if (r) sh.getRange(r, 1, 1, cols.length).setValues([row]);
  else sh.appendRow(row);
  delete cache_[type];
}
function appendRows_(type, recs) {
  if (!recs.length) return;
  const sh = ensureSheet_(type), cols = SCHEMA[type].cols;
  sh.getRange(sh.getLastRow() + 1, 1, recs.length, cols.length).setValues(recs.map(rec => cols.map(([k, , kind]) => toCell_(rec[k], kind))));
  delete cache_[type];
}
function deleteRow_(type, id) {
  const sh = ensureSheet_(type);
  const r = findRow_(sh, id);
  if (r) sh.deleteRow(r);
  delete cache_[type];
}
function findRow_(sh, id) {
  const n = sh.getLastRow();
  if (n < 2 || !id) return 0;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}
function findById_(type, id) { return id ? (readTable_(type).filter(a => a.id === id)[0] || null) : null; }

function readSettings_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SETTINGS_SHEET);
  const s = {};
  if (!sh || sh.getLastRow() < 2) return s;
  const tz = Session.getScriptTimeZone();
  sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues().forEach(([k, v]) => {
    if (!k) return;
    s[k] = v instanceof Date ? Utilities.formatDate(v, tz, 'yyyy-MM-dd') : String(v);
  });
  return s;
}
function writeSettings_(s) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SETTINGS_SHEET);
  if (!sh) { sh = ss.insertSheet(SETTINGS_SHEET); sh.setRightToLeft(true); }
  sh.clearContents();
  const rows = [['المفتاح', 'القيمة']].concat(Object.keys(s).map(k => [k, "'" + s[k]]));
  sh.getRange(1, 1, rows.length, 2).setValues(rows);
}

// ===================== أدوات =====================
let LOCK_DEPTH_ = 0;
function withLock_(fn) {
  if (LOCK_DEPTH_) return fn();
  const lock = LockService.getScriptLock();
  lock.waitLock(25000);
  LOCK_DEPTH_++;
  try { return fn(); } finally { LOCK_DEPTH_--; lock.releaseLock(); }
}
function safeJson_(s) { try { return s ? JSON.parse(s) : {}; } catch (e) { return {}; } }
function newId_() { return Utilities.getUuid().slice(0, 8) + Date.now().toString(36).slice(-4); }
function newCode_(len) {   // عشوائية من Utilities.getUuid (أقوى من Math.random) — 32 رمزاً بلا أحرف ملتبسة
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '', pool = '';
  while (c.length < len) {
    if (pool.length < 2) pool = Utilities.getUuid().replace(/-/g, '');
    c += A.charAt(parseInt(pool.slice(0, 2), 16) % A.length); pool = pool.slice(2);
  }
  if (len >= 6 && (!/[A-Z]/.test(c) || !/[0-9]/.test(c))) return newCode_(len);   // حروف وأرقام معاً
  return c;
}
function clip_(v, n) { return String(v === undefined || v === null ? '' : v).trim().slice(0, n); }
function stamp_() { return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm"); }
