/* بيانات افتراضية للوضع التجريبي فقط — ليست بيانات حقيقية */
(function (root) {
  function seedDemo(gs) {
    gs.setup();
    const s = gs.readSettings_();
    s.adminCode = 'DEMO-SYSTEM';
    gs.writeSettings_(s);
    const accs = gs.readTable_('accounts');
    const members = accs.filter(a => a.role === 'member');
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
    const ok = { approval: 'معتمد', reviewNote: '', reviewedBy: 'د. مصطفى خلف', reviewedAt: '2026-11-10T10:00' };
    const pend = { approval: 'مدخل', reviewNote: '', reviewedBy: '', reviewedAt: '' };
    const ret = (n) => ({ approval: 'معاد للتعديل', reviewNote: n, reviewedBy: 'د. مصطفى خلف', reviewedAt: '2026-11-12T09:00' });
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
    act(2, 'wd', 'مقابلة كل أسرة تطلب الانسحاب قبل اعتماد الطلب', 'وكيل شؤون الطلاب', '2026-11-01', 'جارٍ', 60, 'خالد بخيت');
    act(2, 'nps', 'خطة لمعالجة ملاحظات الانضباط والسلوك', 'خالد بخيت', '2026-12-15', 'لم يبدأ', 0, 'د. مصطفى خلف', 'أولوية قصوى قبل قياس الفصل الثاني');
    act(0, 'enps', 'برنامج تقدير شهري للمعلمين المتميزين', 'رائد النشاط', '2026-12-01', 'جارٍ', 40, 'رامي الشهراني');
    act(3, 'nps', 'تنفيذ أول استبانة رضا لأولياء أمور المرحلة', 'سلطان الشهابي', '2026-11-10', 'لم يبدأ', 0, 'د. مصطفى خلف', 'لا يوجد قياس للمؤشر حتى الآن');

    return { admins: [{ n: 'مدير التعليم', c: 'DEMO-EDU' }, { n: 'المدير التنفيذي', c: 'DEMO-CEO' }],
      principals: members.map((a, i) => ({ name: a.name, title: a.title, code: mCodes[i] })) };
  }
  root.seedDemo = seedDemo;
})(this);
