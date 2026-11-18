/* بيانات افتراضية للوضع التجريبي فقط — ليست بيانات حقيقية */
(function (root) {
  function seedDemo(gs) {
    gs.setup();
    // إعدادات توضيحية للوضع التجريبي: موعد قياس، حد غير مقبول، ميزانية شهرية
    const cfgK = (id, f) => { const k = gs.readTable_('kpis').filter(x => x.id === id)[0]; if (!k) return; const c = typeof k.config === 'string' ? JSON.parse(k.config || '{}') : (k.config || {}); f(c); k.config = JSON.stringify(c); gs.upsert_('kpis', k); };
    cfgK('nps', c => { c.dueFrom = '2026-10'; });
    cfgK('wd', c => { c.failLimit = 14; });
    cfgK('x_profit', c => { c.budget = { '2026-08': -200000, '2026-09': 1300000, '2026-10': 1150000, '2026-11': 900000, '2026-12': 850000, '2027-01': 1100000, '2027-02': 900000, '2027-03': 850000, '2027-04': 1000000, '2027-05': 900000, '2027-06': 1477244 }; });
    const s = gs.readSettings_();
    s.adminCode = 'DEMO-SYSTEM';
    gs.writeSettings_(s);
    const accs = gs.readTable_('accounts');
    const members = accs.filter(a => a.role === 'member' && a.branch !== 'support');
    const admins = accs.filter(a => a.role === 'admin');
    const mCodes = ['DEMO-RAMI', 'DEMO-ABEER', 'DEMO-KHALID', 'DEMO-SULTAN'];
    const fees = [24000, 24000, 28000, 32000];
    members.forEach((a, i) => { a.code = mCodes[i]; a.avgFee = fees[i]; gs.upsert_('accounts', a); });
    admins[0].code = 'DEMO-EDU'; gs.upsert_('accounts', admins[0]);
    admins[1].code = 'DEMO-CEO'; gs.upsert_('accounts', admins[1]);
    const baselines = [420, 265, 310, 285];
    gs.readTable_('assign').forEach(a => {
      const i = members.findIndex(m => m.id === a.accountId);
      if (a.kpiId === 'wd' && i >= 0) { a.baseline = baselines[i]; gs.upsert_('assign', a); }
    });
    const ok = { approval: 'معتمد', reviewNote: '', reviewedBy: 'مدير التعليم', reviewedAt: '2026-11-10T10:00' };
    const pend = { approval: 'مدخل', reviewNote: '', reviewedBy: '', reviewedAt: '' };
    const ret = (n) => ({ approval: 'معاد للتعديل', reviewNote: n, reviewedBy: 'مدير التعليم', reviewedAt: '2026-11-12T09:00' });
    const add = (t, i, rec, ap) => gs.upsert_(t, Object.assign({ id: gs.newId_(), accountId: members[i].id, updatedAt: rec.date && rec.date < '2026-11-14' ? rec.date + 'T09:00' : '2026-11-10T09:00', updatedBy: members[i].name }, ap || ok, rec));

    [
      [0, '2026-09-24', 'يوم مفتوح لأسر الطلاب الجدد', 'يوم مفتوح', 'أسر الحي والمنطقة', 'منفذة', 180, 46, 20, 12, 6000, 5200, ok],
      [0, '2026-10-29', 'ورشة «ابني والقراءة» لأولياء الأمور', 'ورشة لأولياء الأمور', 'أسر رياض الأطفال', 'منفذة', 75, 22, 9, 5, 2000, 1800, pend],
      [0, '2026-12-10', 'معرض مشاريع الطلاب المفتوح', 'معرض/مسابقة مفتوحة', 'المجتمع', 'مخطط لها', 0, 0, 0, 0, 8000, 0, pend],
      [1, '2026-10-15', 'زيارة روضات الحي', 'زيارة/شراكة', 'روضات الحي', 'منفذة', 60, 18, 7, 4, 1500, 1200, ok],
      [2, '2026-09-30', 'حملة تعريفية رقمية بالمرحلة', 'حملة رقمية', 'أسر الصف السادس', 'منفذة', 0, 64, 22, 9, 5000, 4800, ok],
      [2, '2026-10-20', 'لقاء انتقال الصف السادس للمتوسط', 'لقاء تعريفي', 'طلاب السادس وأسرهم', 'منفذة', 140, 38, 20, 15, 3000, 2600, ok],
      [2, '2026-11-05', 'مسابقة الروبوت المفتوحة', 'معرض/مسابقة مفتوحة', 'طلاب المدارس المجاورة', 'منفذة', 95, 21, 6, 3, 7000, 7600, ret('أرفق رابط الصور وكشف الحضور')],
      [3, '2026-11-12', 'لقاء توجيه المسارات', 'لقاء تعريفي', 'أسر الثالث المتوسط', 'منفذة', 110, 30, 12, 7, 2500, 2100, pend]
    ].forEach(r => add('activities', r[0], { kpiId: 'init', date: r[1], title: r[2], kind: r[3], audience: r[4], status: r[5], beneficiaries: r[6], leads: r[7],
      applications: r[8], registrations: r[9], budget: r[10], cost: r[11], evidence: 'https://drive.google.com/', notes: '' }, r[12]));

    const R = ['انتقال سكن/سفر', 'الرسوم', 'أكاديمي', 'عدم الرضا عن الخدمة', 'أخرى'];
    const rs = arr => { const o = {}; arr.forEach((v, i) => { if (v) o[R[i]] = v; }); return JSON.stringify(o); };
    [
      [0, [['2026-08', 2, 6, 1, [1, 1, 0, 0, 0]], ['2026-09', 3, 4, 2, [2, 0, 1, 0, 0]], ['2026-10', 2, 1, 1, [1, 1, 0, 0, 0]]]],
      [1, [['2026-08', 1, 3, 0, [1, 0, 0, 0, 0]], ['2026-09', 2, 2, 1, [0, 1, 0, 1, 0]], ['2026-10', 1, 0, 0, [1, 0, 0, 0, 0]]]],
      [2, [['2026-08', 4, 2, 0, [2, 1, 0, 1, 0]], ['2026-09', 6, 1, 1, [1, 2, 1, 2, 0]], ['2026-10', 5, 0, 2, [1, 2, 0, 2, 0]]]],
      [3, [['2026-08', 1, 2, 0, [1, 0, 0, 0, 0]], ['2026-09', 2, 0, 1, [0, 1, 1, 0, 0]], ['2026-10', 3, 1, 0, [1, 0, 2, 0, 0]]]]
    ].forEach(([i, rows]) => rows.forEach(([m, c, ne, rt, r], j) => add('events', i, { kpiId: 'wd', month: m, count: c, newEnrolled: ne, retained: rt, reasons: rs(r), notes: '', updatedAt: m + '-28T09:00' }, j === 2 && i === 3 ? pend : ok)));

    const PR = ['جودة التعليم والتحصيل', 'التواصل مع الأسرة', 'الرسوم والقيمة', 'الانضباط والسلوك', 'المرافق والنقل', 'أخرى'];
    const SR = ['عبء العمل', 'التقدير والحوافز', 'القيادة والتواصل', 'بيئة العمل', 'النمو المهني', 'أخرى'];
    const rmap = (names, arr) => { const o = {}; arr.forEach((v, i) => { if (v) o[names[i]] = v; }); return JSON.stringify(o); };
    [
      [0, 'nps', '2026-06-10', 'قياس نهاية العام السابق', 120, 80, 50, 400, [20, 15, 18, 5, 8, 2]],
      [0, 'nps', '2026-10-25', 'قياس الفصل الأول', 150, 70, 40, 400, [12, 18, 10, 3, 6, 1]],
      [1, 'nps', '2026-10-27', 'قياس الفصل الأول', 118, 40, 22, 250, [5, 8, 6, 1, 3, 0]],
      [2, 'nps', '2026-06-12', 'قياس نهاية العام السابق', 90, 60, 45, 300, [15, 10, 12, 8, 5, 1]],
      [2, 'nps', '2026-10-26', 'قياس الفصل الأول', 70, 60, 55, 300, [22, 9, 15, 12, 4, 2]],
      [0, 'enps', '2026-10-15', 'قياس الفصل الأول', 26, 8, 4, 42, [3, 4, 1, 0, 2, 0]],
      [1, 'enps', '2026-10-18', 'قياس الفصل الأول', 20, 6, 2, 30, [1, 2, 0, 0, 1, 0]],
      [2, 'enps', '2026-10-16', 'قياس الفصل الأول', 15, 10, 9, 36, [6, 5, 4, 2, 3, 0]],
      [3, 'enps', '2026-10-20', 'قياس الفصل الأول', 22, 7, 3, 34, [2, 3, 1, 1, 1, 0]]
    ].forEach(r => add('surveys', r[0], { kpiId: r[1], date: r[2], round: r[3], promoters: r[4], passives: r[5], detractors: r[6], population: r[7],
      reasons: rmap(r[1] === 'nps' ? PR : SR, r[8]), actionTaken: r[1] === 'nps' && r[0] === 2 ? 'لقاء مفتوح مع أولياء الأمور لمناقشة الانضباط والتحصيل' : '',
      evidence: '', notes: '' }, ok));

    const D = ['الإدارة المدرسية', 'التعليم والتعلم', 'نواتج التعلم', 'البيئة المدرسية'];
    [
      [0, '2026-09-15', 82, 80, 74, 88], [0, '2026-10-30', 86, 82, 78, 90],
      [1, '2026-10-30', 88, 85, 84, 87],
      [2, '2026-09-20', 80, 78, 72, 80], [2, '2026-10-30', 84, 80, 76, 82],
      [3, '2026-11-08', 90, 86, 85, 91]
    ].forEach(r => { const d = {}; D.forEach((n, i) => d[n] = r[2 + i]);
      add('assessments', r[0], { kpiId: 'etec', date: r[1], kind: 'تقويم ذاتي', domains: JSON.stringify(d), overall: Math.round((r[2] + r[3] + r[4] + r[5]) / 4 * 10) / 10,
        strengths: 'البيئة المدرسية والانضباط الإداري', improvements: 'تحسين نواتج التعلم في الاختبارات الوطنية', evidence: '', notes: '' }, r[0] === 3 ? pend : ok); });

    const act = (i, kpi, title, owner, due, status, prog, by, note) => gs.upsert_('actions', { id: gs.newId_(), accountId: members[i].id, kpiId: kpi, title, owner, due, status,
      progress: prog, notes: '', evidence: '', reviewNote: note || '', createdBy: by, updatedAt: '2026-11-10T09:00', updatedBy: by });
    act(2, 'wd', 'مقابلة كل أسرة تطلب الانسحاب قبل اعتماد الطلب', 'وكيل شؤون الطلاب', '2026-11-01', 'جارٍ', 60, 'مدير المرحلة المتوسطة');
    act(2, 'nps', 'خطة لمعالجة ملاحظات الانضباط والسلوك', 'مدير المرحلة المتوسطة', '2026-12-15', 'لم يبدأ', 0, 'مدير التعليم', 'أولوية قصوى قبل قياس الفصل الثاني');
    act(0, 'enps', 'برنامج تقدير شهري للمعلمين المتميزين', 'رائد النشاط', '2026-12-01', 'جارٍ', 40, 'مدير المرحلة الابتدائية');
    act(3, 'nps', 'تنفيذ أول استبانة رضا لأولياء أمور المرحلة', 'مدير المرحلة الثانوية', '2026-11-10', 'لم يبدأ', 0, 'مدير التعليم', 'لا يوجد قياس للمؤشر حتى الآن');

    // بطاقة المدير التنفيذي (بيانات افتراضية)
    const ex = admins[1], exAdd = (t, rec) => gs.upsert_(t, Object.assign({ id: gs.newId_(), accountId: ex.id, updatedAt: '2026-11-08T09:00', updatedBy: ex.name }, ok, rec));
    [['2026-08', [2450000, 310000, 90000, 40000, 20000], [1500000, 260000, 170000, 120000, 90000, 110000, 60000]],
     ['2026-09', [2900000, 120000, 180000, 110000, 30000], [1540000, 260000, 190000, 150000, 60000, 120000, 60000]],
     ['2026-10', [2900000, 40000, 180000, 150000, 30000], [1560000, 260000, 200000, 130000, 70000, 125000, 60000]]].forEach(([m, rv, exv]) => {
      const RI = ['الرسوم الدراسية', 'رسوم التسجيل والقبول', 'النقل المدرسي', 'الأنشطة والبرامج الإضافية', 'إيرادات أخرى'];
      const EI = ['الرواتب والأجور والمزايا', 'الإيجارات', 'التشغيل والصيانة والمرافق', 'المستلزمات والمواد التعليمية', 'التسويق والاستقطاب', 'مصروفات إدارية وعمومية', 'الإهلاك وتكاليف التمويل'];
      exAdd('finance', { kpiId: 'x_profit', month: m, revenue: rv.reduce((a, b) => a + b, 0), expenses: exv.reduce((a, b) => a + b, 0), revItems: rmap(RI, rv), expItems: rmap(EI, exv), evidence: '', notes: '' }); });
    exAdd('ratios', { kpiId: 'x_collect', date: '2026-11-05', period: 'دفعة بداية العام', num: 13150000, den: 15000000,
      reasons: rmap(['تعثر مالي للأسرة', 'خطة سداد مجدولة', 'اعتراض على الرسوم أو الخدمة', 'انسحاب الطالب', 'أخرى'], [620000, 780000, 150000, 240000, 60000]), evidence: '', notes: '' });
    const XD = ['التراخيص والاعتمادات', 'الأمن والسلامة', 'الموارد البشرية وأنظمة العمل', 'الالتزامات المالية والزكوية والضريبية', 'السياسات والحوكمة', 'الأنظمة التقنية وحماية البيانات'];
    exAdd('assessments', { kpiId: 'x_comply', date: '2026-10-28', kind: 'مراجعة داخلية ربعية', domains: rmap(XD, [100, 92, 88, 95, 84, 78]), overall: 89.5,
      strengths: 'التراخيص سارية والالتزامات المالية مستوفاة', improvements: 'استكمال سياسات حماية البيانات وتحديث لائحة الحوكمة', evidence: '', notes: '' });

    // فرع الإشراف والمسارات + حساب مؤقت (بيانات افتراضية)
    const sup = gs.readTable_('accounts').filter(a => a.branch === 'support');
    const off = sup.filter(a => /مكتب الإشراف/.test(a.title))[0], dip = sup.filter(a => /الدبلوما/.test(a.title))[0];
    off.code = 'DEMO-OFFICE'; gs.upsert_('accounts', off); dip.code = 'DEMO-DIPLOMA'; gs.upsert_('accounts', dip);
    const sAdd = (acc, t, rec, st) => gs.upsert_(t, Object.assign({ id: gs.newId_(), accountId: acc.id, updatedAt: '2026-11-10T10:00', updatedBy: acc.name }, st || ok, rec));
    sAdd(off, 'ratios', { kpiId: 's_accred', date: '2026-10-30', period: 'ملف هيئة التقويم — الربع الأول', num: 41, den: 48, reasons: rmap(['تأخر من مالك الملف', 'نقص بيانات من المدارس', 'ضيق الوقت', 'تغيّر في المتطلبات', 'أخرى'], [3, 3, 1, 0, 0]), evidence: '', notes: '' });
    sAdd(off, 'ratios', { kpiId: 's_quality', date: '2026-10-31', period: 'أكتوبر', num: 96, den: 120, reasons: rmap(['غياب المعلم أو المشرف', 'تعارض الجدول', 'اختبارات وفعاليات', 'نقص المشرفين', 'أخرى'], [6, 8, 7, 3, 0]), evidence: '', notes: '' });
    sAdd(off, 'ratios', { kpiId: 's_pd', date: '2026-11-02', period: 'الفصل الأول', num: 22, den: 30, reasons: rmap(['لم تبدأ', 'منفذة دون قياس أثر', 'اعتذار المعلم', 'نقص الموارد التدريبية', 'أخرى'], [3, 4, 1, 0, 0]), evidence: '', notes: '' }, pend);
    // خطوط الأساس والمستهدفات: سطر لكل فئة في كل اختبار (المعتمد يُقفل خط الأساس والمستهدف)
    const yl = gs.readSettings_().yearLabel || '';
    const tAdd = (kpiId, domain, grp, baseline, target, current, date, st) => sAdd(off, 'targets', { kpiId, year: yl, domain, grp, baseline, target, current: current == null ? '' : current, date: date || '', locked: !st || st === ok, evidence: '', notes: '' }, st);
    tAdd('s_tests', 'نافس', 'الصف السادس — رياضيات', 62, 70, 66, '2026-10-20');
    tAdd('s_tests', 'نافس', 'الصف السادس — علوم', 58, 66, 61, '2026-10-20');
    tAdd('s_tests', 'نافس', 'الصف الثالث المتوسط — قراءة', 71, 76, null, '');
    tAdd('s_tests', 'MAP', 'الصف الرابع — رياضيات (RIT)', 205, 212, 208, '2026-10-05');
    tAdd('s_tests', 'MAP', 'الصف الخامس — قراءة (RIT)', 208, 214, 213, '2026-10-05');
    tAdd('s_tests', 'القدرات', 'الصف الثالث الثانوي', 74, 78, 75, '2026-11-01', pend);
    tAdd('s_tests', 'التحصيلي', 'الصف الثالث الثانوي', 70, 75, null, '');
    tAdd('s_curric', 'تغطية الخطط الدراسية', 'جميع المراحل', 88, 95, 94, '2026-10-25');
    tAdd('s_curric', 'جودة أدوات التقويم', 'جميع المراحل', 80, 90, 86, '2026-10-25');
    tAdd('s_curric', 'تحليل نتائج التقويم', 'جميع المراحل', 75, 85, 82, '2026-10-25');
    tAdd('s_curric', 'معالجة فجوات المهارات الأساسية', 'المرحلة الابتدائية', 65, 80, 74, '2026-10-25');
    sAdd(dip, 'readings', { kpiId: 'd_visits', date: '2026-09-10', value: 71.5, evidence: '', notes: 'القياس القبلي' });
    sAdd(dip, 'readings', { kpiId: 'd_visits', date: '2026-11-05', value: 75.2, evidence: '', notes: '' });
    sAdd(dip, 'readings', { kpiId: 'd_achieve', date: '2026-11-01', value: 81.9, evidence: '', notes: 'نتائج الفترة الأولى' });
    sAdd(dip, 'readings', { kpiId: 'd_students', date: '2026-09-15', value: 186, evidence: '', notes: '' });
    sAdd(dip, 'surveys', { kpiId: 'd_nps', date: '2026-10-20', round: 'الفصل الأول', promoters: 52, passives: 28, detractors: 10, population: 150, reasons: rmap(['جودة التدريس', 'متابعة تقدم الطالب', 'التواصل مع الأسرة', 'الواجبات والتقويم', 'أخرى'], [3, 4, 2, 1, 0]), action: '', evidence: '', notes: '' });
    gs.upsert_('accounts', { id: gs.newId_(), role: 'viewer', name: 'زائر مؤقت', empNo: '', title: 'زائر', unit: 'حساب مؤقت', manager: '', code: 'DEMO-GUEST', active: true, avgFee: '', updatedAt: '2026-11-16T10:00', oneTime: true, usedAt: '', session: '' });

    return { admins: [{ n: 'مدير التعليم', c: 'DEMO-EDU' }, { n: 'المدير التنفيذي', c: 'DEMO-CEO' }, { n: 'مدير مكتب الإشراف', c: 'DEMO-OFFICE' }, { n: 'مشرف الدبلوما', c: 'DEMO-DIPLOMA' }, { n: 'زائر مؤقت (مرة واحدة)', c: 'DEMO-GUEST' }],
      principals: members.map((a, i) => ({ name: a.name, title: a.title, code: mCodes[i] })) };
  }
  root.seedDemo = seedDemo;
})(this);
