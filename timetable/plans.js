/* منصة الإشراف التربوي — خطة التطوير الآلية بعد استمارة التقييم + الجلسات الفردية التقويمية
 * يعتمد على دوال الصفحة الرئيسية (esc, prefs, evList, savePrefs …) ويُفعَّل بـ initPlans() بعد تحميلها.
 */
/* ===================== خطة التطوير ===================== */
const DP = () => window.DEVPLAN || { nat: [], dasc: [], fam: {}, stg: {}, famEn: {} };
const DASC_DOM_SIZES = () => DASC_DOMAINS.map(d => d[1].length);
function dpDomOf(ev, i) {
  if (!isDasc(ev)) return Math.floor(i / 4);
  let k = 0; const s = DASC_DOM_SIZES(); for (let d = 0; d < s.length; d++) { if (i < k + s[d]) return d; k += s[d]; } return 0;
}
// مستوى البند: ضعيف (1–2) يحتاج خطة للوصول إلى «متقدم»، متقدم (3–4 في العادية / 3 في DASC) يحتاج خطة للوصول إلى «متميز»
function dpLevel(ev, v) { if (!(v >= 1)) return ""; if (v <= 2) return "w"; return v < evMax(ev) ? "a" : ""; }
function dpFam(subj) {
  const s = String(subj || "");
  if (/عربي|لغتي|لغة عربية|اللغة العربية|كفايات لغوية|^arabic/i.test(s)) return "arabic";
  if (/قرآن|قران|إسلامية|اسلامية|تفسير|توحيد|فقه|حديث|islamic|quran/i.test(s)) return "islamic";
  if (/اجتماعيات|تاريخ|جغرافيا|هوية|وطنية|دراسات أدبية|social|history/i.test(s)) return "social";
  if (/رياضيات|إحصاء|احصاء|قدرات كمي|math|statistic|calculus|algebra/i.test(s)) return "math";
  if (/علوم|فيزياء|كيمياء|أحياء|احياء|علم أرض|صحية|جسم|science|physics|chemistry|biology/i.test(s)) return "science";
  if (/إنجليزي|انجليزي|english/i.test(s)) return "english";
  if (/حاسب|تقنية|رقمي|سيبراني|ذكاء اصطناعي|برمجة|computer|\bict\b|tech|robot/i.test(s)) return "tech";
  return "general";
}
function dpStage(ev) {
  const st = String(ev.stage || ""), c = String(ev.cls || "");
  if (/الأولية/.test(st) || (/ابتدائي/.test(st) && /الصف (الأول|الثاني|الثالث)(?! (المتوسط|الثانوي))/.test(c))) return "early";
  if (/ابتدائي/.test(st)) return "primary";
  if (/متوسط/.test(st)) return "mid";
  if (/ثانوي/.test(st)) return "sec";
  return "primary";
}
function planItems(ev) {
  const D = DP(), dasc = isDasc(ev), bank = dasc ? D.dasc : D.nat, items = evItemsOf(ev), out = [];
  const fam = dpFam(ev.subj), st = dpStage(ev);
  (ev.scores || []).forEach((v, i) => {
    const lvl = dpLevel(ev, v); if (!lvl || !bank[i] || !items[i]) return;
    const b = bank[i], dom = dpDomOf(ev, i), acts = (lvl === "w" ? b.w : b.a).slice();
    if (dasc) { const fe = (D.famEn[fam] || D.famEn.general || [])[dom]; if (fe) acts.push("Subject idea: " + fe + "."); }
    else {
      const f = D.fam[fam] || D.fam.general, s = D.stg[st];
      if (f && f.d[dom]) acts.push("مثال في " + f.n + ": " + f.d[dom]);
      if (s && s.d[dom]) acts.push("مراعاة المرحلة (" + s.n + "): " + s.d[dom]);
    }
    out.push({ i, sc: v, lvl, on: true, goal: b.g, acts: acts.join("\n"), res: b.r,
      dur: dasc ? (lvl === "w" ? "3 weeks" : "4 weeks") : (lvl === "w" ? "3 أسابيع" : "4 أسابيع"),
      ind: lvl === "w" ? b.k : b.ka });
  });
  // الأضعف أولًا
  return out.sort((a, b) => a.sc - b.sc || a.i - b.i);
}
function addDays(ds, n) { const d = parseYmd(ds); d.setDate(d.getDate() + n); return ymd(d); }
function newPlan(ev) {
  const start = ymd(new Date()) > ev.date ? ymd(new Date()) : ev.date;
  return { v: 1, created: Date.now(), updated: Date.now(), start, follow: addDays(start, 21), remind: true, notes: "", items: planItems(ev) };
}
const lvlName = (ev, l) => isDasc(ev) ? (l === "w" ? "Priority (to reach Evident)" : "Enhancement (to reach Very Evident)") : (l === "w" ? "أولوية: من «ضعيف» إلى «متقدم»" : "تجويد: من «متقدم» إلى «متميز»");
let PLAN_EV = null;
function openPlan(evId, auto) {
  const ev0 = evList().find(x => x.id === evId); if (!ev0) return;
  const ev = JSON.parse(JSON.stringify(ev0)); if (!ev.plan) ev.plan = newPlan(ev);
  PLAN_EV = ev; const p = ev.plan, en = isDasc(ev), L = en ? (a, b) => b : (a, b) => a;
  const b = document.getElementById("wBody");
  const items = evItemsOf(ev);
  const card = (it, n) => `<div class="pit ${it.lvl}" data-pi="${n}">
    <div class="pith"><label style="display:flex;gap:6px;align-items:flex-start;flex:1"><input type="checkbox" data-f="on" ${it.on ? "checked" : ""}> <span data-raw><b>${it.i + 1}.</b> ${esc(items[it.i] ? items[it.i].t : "")}</span></label><span class="chip ${it.lvl === "w" ? "lw" : "la"}">${L("الدرجة", "Score")} ${it.sc}/${evMax(ev)}</span></div>
    <div class="pgrid" data-raw>
      <label>🎯 ${L("الهدف", "Goal")}<input data-f="goal" value="${esc(it.goal)}"></label>
      <label class="wide">✅ ${L("الإجراءات (سطر لكل إجراء)", "Actions (one per line)")}<textarea data-f="acts" rows="4">${esc(it.acts)}</textarea></label>
      <label>🧰 ${L("الأداة / المصدر", "Tool / resource")}<input data-f="res" value="${esc(it.res)}"></label>
      <label>⏱️ ${L("المدة", "Duration")}<input data-f="dur" value="${esc(it.dur)}"></label>
      <label class="wide">📏 ${L("مؤشر النجاح", "Success indicator")}<input data-f="ind" value="${esc(it.ind)}"></label>
    </div></div>`;
  const grp = l => { const L2 = p.items.map((x, n) => [x, n]).filter(([x]) => x.lvl === l); return L2.length ? `<h4 class="pgh ${l}">${l === "w" ? "🔴" : "🟡"} ${esc(lvlName(ev, l))} <span class="sync">(${L2.length})</span></h4>${L2.map(([x, n]) => card(x, n)).join("")}` : ""; };
  b.innerHTML = `
  <div class="evh"><h3>📋 ${L("خطة التطوير المهني", "Professional Development Plan")}</h3><button class="btn sm" id="plX" style="background:transparent;color:#fff;border-color:#ffffff88">✕</button></div>
  <div class="evb" ${en ? 'dir="ltr" style="text-align:left"' : ""}>
    ${auto ? `<div class="notice info" style="margin-bottom:10px">${L("تم حفظ التقييم ✓ — هذه خطة تطوير جاهزة بناءً على الدرجات. راجعها وعدّل ما تريد ثم احفظها وأرسلها للمعلم.", "Evaluation saved ✓ — here is a ready development plan based on the scores. Review, edit, save and send it to the teacher.")}</div>` : ""}
    <div class="evinfo">
      <label>${L("المعلم", "Teacher")}<div class="ro">${esc(ev.teacher)}</div></label>
      <label>${L("المادة", "Subject")}<div class="ro">${escL(ev.subj)}</div></label>
      <label>${L("الفصل", "Class")}<div class="ro">${escL(ev.cls)}</div></label>
      <label>${L("الزيارة", "Visit")}<div class="ro">${esc(ev.date)} · ${L("رقم", "No.")} ${esc(ev.visitNo || "")}</div></label>
      <label>${L("بداية الخطة", "Plan start")}<input type="date" id="plStart" value="${esc(p.start)}"></label>
      <label>${L("موعد المتابعة", "Follow-up date")}<input type="date" id="plFollow" value="${esc(p.follow)}"></label>
    </div>
    <label style="display:flex;gap:6px;align-items:center;margin:4px 0 8px;font-size:13.5px"><input type="checkbox" id="plRemind" ${p.remind ? "checked" : ""}> ${L("ذكّرني على الجوال يوم المتابعة", "Remind me on my phone on the follow-up date")}</label>
    ${p.items.length ? grp("w") + grp("a") : `<div class="notice">${L("لا توجد بنود تحتاج خطة تطوير — كل البنود في مستوى «متميز». 🌟", "No items need a plan — all items are at the top level. 🌟")}</div>`}
    <label class="pnotes">${L("ملاحظات المشرف للمعلم", "Supervisor's notes to the teacher")}<textarea id="plNotes" rows="3" data-raw>${esc(p.notes || "")}</textarea></label>
  </div>
  <div class="evfoot"><button class="btn pri" id="plSave">💾 ${L("حفظ الخطة", "Save plan")}</button><button class="btn" id="plCopy">📋 ${L("نسخ للإرسال", "Copy to send")}</button><button class="btn" id="plPrint">🖨️ ${L("طباعة / PDF", "Print / PDF")}</button><button class="btn" id="plSes">🗣️ ${L("تسجيل جلسة فردية", "Log a 1:1 session")}</button><span id="plMsg" class="sync"></span><span style="flex:1"></span><button class="btn" id="plRegen" title="${L("إعادة بناء الخطة من درجات التقييم", "Rebuild from evaluation scores")}">🔄 ${L("إعادة التوليد", "Regenerate")}</button></div>`;
  const d = document.getElementById("wDlg"); d.showModal(); d.scrollTop = 0;
  let dirty = false;
  b.querySelectorAll("input,textarea").forEach(x => x.addEventListener("input", () => dirty = true));
  b.querySelectorAll("input[type=checkbox]").forEach(x => x.addEventListener("change", () => dirty = true));
  const read = () => {
    p.start = b.querySelector("#plStart").value || p.start; p.follow = b.querySelector("#plFollow").value || "";
    p.remind = b.querySelector("#plRemind").checked; p.notes = b.querySelector("#plNotes").value.trim();
    b.querySelectorAll("[data-pi]").forEach(c => { const it = p.items[+c.dataset.pi]; c.querySelectorAll("[data-f]").forEach(f => { it[f.dataset.f] = f.type === "checkbox" ? f.checked : f.value.trim(); }); });
  };
  const save = () => { read(); p.updated = Date.now(); const L0 = evList(), k = L0.findIndex(x => x.id === ev.id); if (k < 0) return false;
    L0[k].plan = JSON.parse(JSON.stringify(p)); if (typeof EVCUR !== "undefined" && EVCUR && EVCUR.id === ev.id) EVCUR.plan = JSON.parse(JSON.stringify(p));
    savePrefs(); dirty = false; renderEvals(); updSesCount(); b.querySelector("#plMsg").textContent = L("تم حفظ الخطة ✓", "Plan saved ✓"); return true; };
  b.querySelector("#plSave").onclick = () => { if (save()) toast(L("تم حفظ الخطة ✓", "Plan saved ✓")); };
  b.querySelector("#plCopy").onclick = () => { save(); copyText(planText(ev)); };
  b.querySelector("#plPrint").onclick = () => { save(); printPlan(ev); };
  b.querySelector("#plSes").onclick = () => { save(); d.close(); openSession(null, { teacher: ev.teacher, subj: ev.subj, evId: ev.id, title: L("مناقشة خطة التطوير بعد زيارة ", "Discussing the development plan after the visit of ") + ev.date }); };
  b.querySelector("#plRegen").onclick = async () => { d.close(); const ok = await confirmDlg(L("إعادة توليد الخطة؟", "Regenerate the plan?"), L("ستُستبدل بنود الخطة الحالية ببنود جديدة من درجات التقييم الحالية، وتضيع التعديلات التي كتبتها على البنود.", "Current plan items will be replaced from the current scores; your edits to items will be lost."), L("إعادة التوليد", "Regenerate"), true);
    if (ok) { const L0 = evList(), k = L0.findIndex(x => x.id === ev.id); if (k >= 0) { const np = newPlan(L0[k]); np.notes = p.notes; np.start = p.start; np.follow = p.follow; L0[k].plan = np; if (typeof EVCUR !== "undefined" && EVCUR && EVCUR.id === ev.id) EVCUR.plan = JSON.parse(JSON.stringify(np)); savePrefs(); } }
    openPlan(ev.id); };
  const close = async () => { if (dirty) { d.close(); const ok = await confirmDlg(L("إغلاق بدون حفظ؟", "Close without saving?"), L("لديك تعديلات على الخطة لم تُحفظ.", "You have unsaved changes to the plan."), L("إغلاق بدون حفظ", "Close without saving"), true); if (!ok) d.showModal(); return; } d.close(); };
  b.querySelector("#plX").onclick = close;
  d.oncancel = e => { e.preventDefault(); close(); };
}
function planText(ev) {
  const p = ev.plan, en = isDasc(ev), L = en ? (a, b) => b : (a, b) => a, items = evItemsOf(ev), on = p.items.filter(x => x.on);
  const lines = [];
  lines.push("📋 " + L("خطة تطوير مهني", "Professional Development Plan"));
  lines.push(L("المعلم", "Teacher") + ": " + ev.teacher + " · " + L("المادة", "Subject") + ": " + ev.subj + " · " + L("الفصل", "Class") + ": " + ev.cls);
  lines.push(L("بناءً على زيارة صفية بتاريخ ", "Based on the classroom visit on ") + ev.date + (ev.visitNo ? L(" (الزيارة رقم ", " (visit no. ") + ev.visitNo + ")" : ""));
  lines.push(L("مدة الخطة: من ", "Plan period: from ") + p.start + (p.follow ? L(" · موعد المتابعة: ", " · Follow-up: ") + p.follow : ""));
  ["w", "a"].forEach(l => { const g = on.filter(x => x.lvl === l); if (!g.length) return;
    lines.push(""); lines.push((l === "w" ? "🔴 " : "🟡 ") + lvlName(ev, l));
    g.forEach((x, n) => { lines.push(""); lines.push((n + 1) + ") " + (items[x.i] ? items[x.i].t : "") + " (" + L("الدرجة", "score") + " " + x.sc + "/" + evMax(ev) + ")");
      lines.push("🎯 " + L("الهدف", "Goal") + ": " + x.goal); lines.push("✅ " + L("الإجراءات", "Actions") + ":");
      String(x.acts || "").split("\n").map(s => s.trim()).filter(Boolean).forEach(s => lines.push("• " + s));
      if (x.res) lines.push("🧰 " + L("الأداة", "Tool") + ": " + x.res); if (x.dur) lines.push("⏱️ " + L("المدة", "Duration") + ": " + x.dur); if (x.ind) lines.push("📏 " + L("مؤشر النجاح", "Success indicator") + ": " + x.ind); }); });
  if (!on.length) { lines.push(""); lines.push(L("لا توجد بنود تحتاج خطة تطوير — أداء متميز. 🌟", "No items need development — excellent performance. 🌟")); }
  if (p.notes) { lines.push(""); lines.push(L("ملاحظات المشرف: ", "Supervisor's notes: ") + p.notes); }
  lines.push(""); lines.push(L("المشرف: ", "Supervisor: ") + (ev.evaluator || (WHO && WHO.name) || ""));
  return lines.join("\n");
}
function printDoc(title, bodyHtml, ltr) {
  const html = `<!doctype html><html lang="${ltr ? "en" : "ar"}" dir="${ltr ? "ltr" : "rtl"}"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>@page{size:A4;margin:12mm}body{font-family:"IBM Plex Sans Arabic",Tahoma,sans-serif;font-size:12.5px;color:#000;margin:0}
.top{display:flex;justify-content:space-between;align-items:center}.top div{font-weight:700;line-height:1.6}.top img{height:64px}
h2{text-align:center;margin:8px 0;font-size:17px}table{width:100%;border-collapse:collapse;margin-bottom:8px}td,th{border:1px solid #8aaed6;padding:5px 6px;vertical-align:top;text-align:start}
th{background:#eef4fb}.g{font-weight:700;margin:10px 0 4px;padding:4px 8px;border-radius:6px}.g.w{background:#fde8e8}.g.a{background:#fff4d6}
ul{margin:2px 0;padding-inline-start:18px}.sig{display:flex;justify-content:space-between;margin-top:26px}.sig div{width:45%;border-top:1px solid #000;padding-top:4px;text-align:center}.brk{page-break-inside:avoid}</style></head><body>
<div class="top"><div>${ltr ? "Ministry of Education<br>Jeddah Education Administration<br>Private Education Office" : "وزارة التعليم<br>الإدارة العامة للتعليم بمحافظة جدة<br>مكتب التعليم الخاص"}</div><img src="${PAGE_URL}school-logo.png" alt=""><div>${ltr ? "Dar Al-Thikr Private Schools<br>Educational Supervision & Development" : "مدارس دار الذكر الأهلية<br>مكتب الإشراف والتطوير التربوي"}</div></div>
${bodyHtml}<script>window.onload=()=>setTimeout(()=>window.print(),400)<\/script></body></html>`;
  const w = window.open("", "_blank"); if (!w) { toast("اسمح بالنوافذ المنبثقة لهذه الصفحة للطباعة"); return; }
  w.document.open(); w.document.write(html); w.document.close();
}
function printPlan(ev) {
  const p = ev.plan, en = isDasc(ev), L = en ? (a, b) => b : (a, b) => a, items = evItemsOf(ev), on = p.items.filter(x => x.on);
  const nl = s => esc(s || "").replace(/\n/g, "<br>");
  let h = `<h2>${L("خطة تطوير مهني للمعلم", "Teacher Professional Development Plan")}</h2>
  <table><tr><th>${L("المعلم", "Teacher")}</th><th>${L("المادة", "Subject")}</th><th>${L("الفصل", "Class")}</th><th>${L("تاريخ الزيارة", "Visit date")}</th><th>${L("بداية الخطة", "Start")}</th><th>${L("موعد المتابعة", "Follow-up")}</th></tr>
  <tr><td>${esc(ev.teacher)}</td><td>${esc(ev.subj)}</td><td>${esc(ev.cls)}</td><td>${esc(ev.date)}</td><td>${esc(p.start)}</td><td>${esc(p.follow || "")}</td></tr></table>`;
  ["w", "a"].forEach(l => { const g = on.filter(x => x.lvl === l); if (!g.length) return;
    h += `<div class="g ${l}">${l === "w" ? "🔴" : "🟡"} ${esc(lvlName(ev, l))}</div><table><tr><th style="width:24%">${L("البند والدرجة", "Item & score")}</th><th style="width:16%">${L("الهدف", "Goal")}</th><th>${L("الإجراءات", "Actions")}</th><th style="width:14%">${L("الأداة", "Tool")}</th><th style="width:8%">${L("المدة", "Duration")}</th><th style="width:16%">${L("مؤشر النجاح", "Indicator")}</th></tr>
    ${g.map(x => `<tr class="brk"><td>${x.i + 1}. ${esc(items[x.i] ? items[x.i].t : "")}<br><b>${L("الدرجة", "Score")} ${x.sc}/${evMax(ev)}</b></td><td>${esc(x.goal)}</td><td><ul>${String(x.acts || "").split("\n").map(s => s.trim()).filter(Boolean).map(s => `<li>${esc(s)}</li>`).join("")}</ul></td><td>${esc(x.res)}</td><td>${esc(x.dur)}</td><td>${esc(x.ind)}</td></tr>`).join("")}</table>`; });
  if (!on.length) h += `<p>${L("لا توجد بنود تحتاج خطة تطوير — أداء متميز.", "No items need development — excellent performance.")}</p>`;
  if (p.notes) h += `<table><tr><th>${L("ملاحظات المشرف", "Supervisor's notes")}</th></tr><tr><td>${nl(p.notes)}</td></tr></table>`;
  h += `<div class="sig"><div>${L("المعلم", "Teacher")}: ${esc(ev.teacher)}</div><div>${L("المشرف", "Supervisor")}: ${esc(ev.evaluator || "")}</div></div>`;
  printDoc(L("خطة تطوير – ", "Development plan – ") + ev.teacher, h, en);
}
// بعد حفظ تقييم مكتمل: تظهر الخطة آليًا
function maybeAutoPlan(ev) {
  if (!ev || ev.plan || !evComplete(ev)) return;
  if (!planItems(ev).length) { toast(isDasc(ev) ? "All items at the top level — no plan needed 🌟" : "كل البنود «متميز» — لا حاجة لخطة تطوير 🌟"); return; }
  setTimeout(() => openPlan(ev.id, true), 250);
}
// في الزيارة التالية لنفس المعلم: إبراز بنود الخطة السابقة ودرجاتها
function planBanner(ev) {
  const prev = evList().filter(x => x.id !== ev.id && x.teacher === ev.teacher && !!isDasc(x) === !!isDasc(ev) && x.plan && x.plan.items && x.plan.items.some(i => i.on) && String(x.date) <= String(ev.date))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))[0];
  if (!prev) return;
  const its = prev.plan.items.filter(i => i.on), en = isDasc(ev);
  const box = document.querySelector("#evBody .evb"); if (!box) return;
  const div = document.createElement("div"); div.className = "notice"; div.style.marginBottom = "10px";
  div.innerHTML = en ? `📌 Previous development plan (visit of ${esc(prev.date)}): items ${its.map(i => i.i + 1).join(", ")} — marked with 📌 below with their previous score. Check whether they improved.`
    : `📌 خطة تطوير سابقة (زيارة ${esc(prev.date)}): البنود ${its.map(i => i.i + 1).join("، ")} — مُعلَّمة بـ📌 بالأسفل مع درجتها السابقة؛ راجع مدى تحسنها.`;
  box.prepend(div);
  its.forEach(i => { const q = document.querySelector(`#evBody .evit[data-i="${i.i}"] .q`); if (q) q.insertAdjacentHTML("beforeend", ` <span class="pfu">📌 ${en ? "was" : "كانت"} ${i.sc}</span>`); });
}

/* ===================== الجلسات الفردية التقويمية ===================== */
function sesList() { if (!Array.isArray(prefs.sessions)) prefs.sessions = []; return prefs.sessions; }
function sesTeachers() {
  const m = new Map();
  (ENTRIES || []).forEach(e => { if (e.kind === "class" && e.teacher && !m.has(e.teacher)) m.set(e.teacher, subjectOf(e)); });
  evList().forEach(x => { if (x.teacher && !m.has(x.teacher)) m.set(x.teacher, x.subj || ""); });
  return m;
}
function sesDue(s, today) { return s.follow && !s.followDone && s.follow <= today; }
function updSesCount() {
  const c = document.getElementById("sesCount"); if (!c) return;
  const today = ymd(new Date()); const due = sesList().filter(s => sesDue(s, today)).length + evList().filter(x => x.plan && x.plan.follow && !x.plan.followDone && x.plan.follow <= today).length;
  c.innerHTML = due ? `<span class="tbadge">${due}</span>` : (sesList().length ? "(" + sesList().length + ")" : "");
}
function openSession(id, pre) {
  const ex = id ? sesList().find(s => s.id === id) : null;
  const s = ex ? JSON.parse(JSON.stringify(ex)) : Object.assign({ id: "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), date: ymd(new Date()), teacher: "", subj: "", title: "", questions: "", recs: "", commits: "", follow: addDays(ymd(new Date()), 14), remind: true, followDone: false, evId: "", ack: false, ackDate: "", created: Date.now(), isNew: true }, pre || {});
  const T = sesTeachers(), b = document.getElementById("wBody");
  const evOpts = t => evList().filter(x => x.teacher === t).sort((a, c) => String(c.date).localeCompare(String(a.date))).map(x => `<option value="${esc(x.id)}" ${s.evId === x.id ? "selected" : ""}>${esc(x.date)} — ${esc(evScoreTxt(x))}${x.plan ? " · 📋 خطة" : ""}</option>`).join("");
  const ta = (k, label) => `<div class="nb"><div class="nbh"><span>${label}</span>${tplBtn(k)}</div>${tplBox(k)}<textarea id="ev-${k}" rows="4" data-raw>${esc(s[k === "sq" ? "questions" : k === "srec" ? "recs" : "commits"] || "")}</textarea></div>`;
  b.innerHTML = `
  <div class="evh"><h3>🗣️ ${ex ? "جلسة فردية تقويمية" : "جلسة فردية تقويمية جديدة"}</h3><button class="btn sm" id="ssX" style="background:transparent;color:#fff;border-color:#ffffff88">✕</button></div>
  <div class="evb">
    <div class="evinfo">
      <label>التاريخ<input type="date" id="ssDate" value="${esc(s.date)}"></label>
      <label>المعلم<input id="ssTeacher" list="ssTList" value="${esc(s.teacher)}" placeholder="اختر أو اكتب اسم المعلم" data-raw></label>
      <label>المادة<input id="ssSubj" value="${esc(s.subj)}" data-raw></label>
      <label>مرتبطة بتقييم / خطة<select id="ssEv"><option value="">— بدون —</option>${evOpts(s.teacher)}</select></label>
    </div>
    <datalist id="ssTList">${[...T.keys()].sort((a, c) => a.localeCompare(c, "ar")).map(t => `<option value="${esc(t)}">`).join("")}</datalist>
    <label style="display:block;margin:6px 0">عنوان الجلسة<input id="ssTitle" value="${esc(s.title)}" placeholder="مثال: مناقشة زيارة الحصة الثالثة" style="width:100%;padding:8px;border:1px solid var(--line);border-radius:9px;font:inherit" data-raw></label>
    <div class="evnotes">${ta("sq", "❓ أسئلة المناقشة")}${ta("srec", "💡 التوصيات")}</div>
    <div style="margin-top:10px">${ta("scom", "🤝 التزامات المعلم")}</div>
    <div class="evinfo" style="margin-top:10px">
      <label>📅 موعد المتابعة<input type="date" id="ssFollow" value="${esc(s.follow || "")}"></label>
      <label style="flex-direction:row;align-items:center;gap:6px;color:var(--ink)"><input type="checkbox" id="ssRemind" ${s.remind ? "checked" : ""}> ذكّرني على الجوال يوم المتابعة</label>
      <label style="flex-direction:row;align-items:center;gap:6px;color:var(--ink)"><input type="checkbox" id="ssDone" ${s.followDone ? "checked" : ""}> تمت المتابعة</label>
    </div>
    <div class="nb" style="margin-top:10px;border:1px solid var(--line);border-radius:12px;padding:8px"><label style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" id="ssAck" ${s.ack ? "checked" : ""}> <span><b>تأكيد المعلم:</b> اطّلع المعلم على محضر الجلسة والتوصيات والالتزامات ووافق عليها${s.ackDate ? ` <span class="sync">(${esc(s.ackDate)})</span>` : ""}.</span></label></div>
  </div>
  <div class="evfoot"><button class="btn pri" id="ssSave">💾 حفظ الجلسة</button><button class="btn" id="ssCopy">📋 نسخ للإرسال</button><button class="btn" id="ssPrint">🖨️ طباعة / PDF</button><span id="ssMsg" class="sync"></span><span style="flex:1"></span>${ex ? '<button class="btn danger" id="ssDel">حذف</button>' : ""}</div>`;
  const d = document.getElementById("wDlg"); d.showModal(); d.scrollTop = 0;
  let dirty = !ex && !!pre;
  b.querySelectorAll("input,textarea,select").forEach(x => { x.addEventListener("input", () => dirty = true); x.addEventListener("change", () => dirty = true); });
  b.querySelectorAll("[data-tplopen]").forEach(x => x.onclick = () => toggleTpl(x.dataset.tplopen));
  const tIn = b.querySelector("#ssTeacher");
  tIn.addEventListener("change", () => { const t = tIn.value.trim(); if (T.has(t) && !b.querySelector("#ssSubj").value) b.querySelector("#ssSubj").value = T.get(t) || ""; b.querySelector("#ssEv").innerHTML = `<option value="">— بدون —</option>` + evOpts(t); });
  const read = () => {
    s.date = b.querySelector("#ssDate").value || s.date; s.teacher = tIn.value.trim(); s.subj = b.querySelector("#ssSubj").value.trim(); s.evId = b.querySelector("#ssEv").value;
    s.title = b.querySelector("#ssTitle").value.trim(); s.questions = b.querySelector("#ev-sq").value.trim(); s.recs = b.querySelector("#ev-srec").value.trim(); s.commits = b.querySelector("#ev-scom").value.trim();
    s.follow = b.querySelector("#ssFollow").value; s.remind = b.querySelector("#ssRemind").checked; s.followDone = b.querySelector("#ssDone").checked;
    const ack = b.querySelector("#ssAck").checked; if (ack && !s.ack) s.ackDate = ymd(new Date()); if (!ack) s.ackDate = ""; s.ack = ack;
  };
  const save = () => { read(); const m = b.querySelector("#ssMsg");
    if (!s.teacher) { m.textContent = "⚠️ اكتب اسم المعلم"; return false; } if (!s.title) { m.textContent = "⚠️ اكتب عنوان الجلسة"; return false; }
    delete s.isNew; s.updated = Date.now(); const L = sesList(), k = L.findIndex(x => x.id === s.id); if (k >= 0) L[k] = JSON.parse(JSON.stringify(s)); else L.push(JSON.parse(JSON.stringify(s)));
    savePrefs(); dirty = false; renderSessions(); updSesCount(); m.textContent = "تم الحفظ ✓"; return true; };
  b.querySelector("#ssSave").onclick = () => { if (save()) { toast("تم حفظ الجلسة ✓"); d.close(); } };
  b.querySelector("#ssCopy").onclick = () => { if (save()) copyText(sesText(s)); };
  b.querySelector("#ssPrint").onclick = () => { if (save()) printSession(s); };
  if (ex) b.querySelector("#ssDel").onclick = async () => { d.close(); if (await confirmDlg("حذف الجلسة؟", `سيُحذف محضر جلسة <b>${esc(s.teacher)}</b> بتاريخ ${esc(s.date)} نهائيًا.`, "حذف", true)) { prefs.sessions = sesList().filter(x => x.id !== s.id); savePrefs(); renderSessions(); updSesCount(); toast("تم حذف الجلسة"); } else d.showModal(); };
  const close = async () => { if (dirty) { d.close(); const ok = await confirmDlg("إغلاق بدون حفظ؟", "لديك تعديلات على الجلسة لم تُحفظ.", "إغلاق بدون حفظ", true); if (!ok) d.showModal(); return; } d.close(); };
  b.querySelector("#ssX").onclick = close; d.oncancel = e => { e.preventDefault(); close(); };
}
function sesText(s) {
  const L = [], li = t => String(t || "").split("\n").map(x => x.trim()).filter(Boolean).map(x => "• " + x.replace(/^[•\-–]\s*/, ""));
  L.push("🗣️ محضر جلسة فردية تقويمية"); L.push("المعلم: " + s.teacher + (s.subj ? " · المادة: " + s.subj : "")); L.push("التاريخ: " + s.date); L.push("العنوان: " + s.title);
  if (s.questions) { L.push(""); L.push("❓ أسئلة المناقشة:"); L.push(...li(s.questions)); }
  if (s.recs) { L.push(""); L.push("💡 التوصيات:"); L.push(...li(s.recs)); }
  if (s.commits) { L.push(""); L.push("🤝 التزامات المعلم:"); L.push(...li(s.commits)); }
  if (s.follow) { L.push(""); L.push("📅 موعد المتابعة: " + s.follow); }
  L.push(""); L.push("المشرف: " + ((WHO && WHO.name) || ""));
  return L.join("\n");
}
function printSession(s) {
  const ul = t => `<ul>${String(t || "").split("\n").map(x => x.trim()).filter(Boolean).map(x => `<li>${esc(x.replace(/^[•\-–]\s*/, ""))}</li>`).join("")}</ul>`;
  const ev = s.evId ? evList().find(x => x.id === s.evId) : null;
  const h = `<h2>محضر جلسة فردية تقويمية</h2>
  <table><tr><th>المعلم</th><th>المادة</th><th>التاريخ</th><th>عنوان الجلسة</th><th>مرتبطة بزيارة</th><th>موعد المتابعة</th></tr>
  <tr><td>${esc(s.teacher)}</td><td>${esc(s.subj)}</td><td>${esc(s.date)}</td><td>${esc(s.title)}</td><td>${ev ? esc(ev.date) + " (" + esc(evScoreTxt(ev)) + ")" : "—"}</td><td>${esc(s.follow || "—")}</td></tr></table>
  <table class="brk"><tr><th>❓ أسئلة المناقشة</th></tr><tr><td>${ul(s.questions) || "—"}</td></tr></table>
  <table class="brk"><tr><th>💡 التوصيات</th></tr><tr><td>${ul(s.recs) || "—"}</td></tr></table>
  <table class="brk"><tr><th>🤝 التزامات المعلم</th></tr><tr><td>${ul(s.commits) || "—"}</td></tr></table>
  <p>${s.ack ? "☑" : "☐"} اطّلع المعلم على محضر الجلسة والتوصيات والالتزامات ووافق عليها${s.ackDate ? " بتاريخ " + esc(s.ackDate) : ""}.</p>
  <div class="sig"><div>توقيع المعلم: ${esc(s.teacher)}</div><div>توقيع المشرف: ${esc((WHO && WHO.name) || "")}</div></div>`;
  printDoc("محضر جلسة – " + s.teacher, h, false);
}
function renderSessions() {
  const box = document.getElementById("sesList"); if (!box) return;
  const q = (document.getElementById("sesQ").value || "").trim(), today = ymd(new Date());
  const L = sesList().filter(s => !q || (s.teacher + " " + s.title + " " + (s.subj || "")).includes(q)).sort((a, b) => String(b.date).localeCompare(String(a.date)) || (b.updated || 0) - (a.updated || 0));
  // المتابعات المستحقة: من الجلسات + من خطط التطوير
  const dueS = sesList().filter(s => sesDue(s, today)), dueP = evList().filter(x => x.plan && x.plan.follow && !x.plan.followDone && x.plan.follow <= today);
  const upS = sesList().filter(s => s.follow && !s.followDone && s.follow > today).length + evList().filter(x => x.plan && x.plan.follow && !x.plan.followDone && x.plan.follow > today).length;
  document.getElementById("sesStats").innerHTML = `
    <div class="stat"><div class="k">عدد الجلسات</div><div class="v">${sesList().length}</div><div class="k">${new Set(sesList().map(s => s.teacher)).size} معلم</div></div>
    <div class="stat ${dueS.length + dueP.length ? "next" : ""}"><div class="k">متابعات مستحقة</div><div class="v">${dueS.length + dueP.length}</div><div class="k">جلسات وخطط تطوير</div></div>
    <div class="stat"><div class="k">متابعات قادمة</div><div class="v">${upS}</div></div>
    <div class="stat"><div class="k">خطط تطوير محفوظة</div><div class="v">${evList().filter(x => x.plan).length}</div></div>`;
  const dueHtml = (dueS.length || dueP.length) ? `<div class="card sec" style="border-color:#f3d39a;background:#fffaf0;margin-bottom:12px"><h3 style="margin:0 0 6px">📌 متابعات مستحقة</h3>
    ${dueS.map(s => `<div class="evrow" data-raw><div class="who"><b>${esc(s.teacher)}</b> · جلسة: ${esc(s.title)}<div class="sync">موعد المتابعة ${esc(s.follow)}</div></div><div class="bar" style="margin:0"><button class="btn sm" data-sopen="${esc(s.id)}">فتح</button><button class="btn sm pri" data-sdone="${esc(s.id)}">✓ تمت المتابعة</button></div></div>`).join("")}
    ${dueP.map(x => `<div class="evrow" data-raw><div class="who"><b>${esc(x.teacher)}</b> · خطة تطوير بعد زيارة ${esc(x.date)}<div class="sync">موعد المتابعة ${esc(x.plan.follow)}</div></div><div class="bar" style="margin:0"><button class="btn sm" data-popen="${esc(x.id)}">فتح الخطة</button><button class="btn sm pri" data-pdone="${esc(x.id)}">✓ تمت المتابعة</button></div></div>`).join("")}</div>` : "";
  box.innerHTML = dueHtml + (L.length ? L.map(s => { const st = s.followDone ? '<span class="chip">✓ تمت المتابعة</span>' : s.follow ? (s.follow <= today ? '<span class="chip lw">متابعة مستحقة</span>' : `<span class="chip">متابعة ${esc(s.follow)}</span>`) : "";
      return `<div class="evrow"><div class="who"><b data-raw>${esc(s.teacher)}</b> ${s.subj ? `<span class="chip" data-raw>${escL(s.subj)}</span>` : ""} ${st} ${s.ack ? '<span class="chip">☑ أكّد المعلم</span>' : ""}<div class="m sync"><span data-raw>${esc(s.title)}</span> · ${esc(fmtDate(parseYmd(s.date)))}</div></div>
      <div class="bar" style="margin:0"><button class="btn sm pri" data-sopen="${esc(s.id)}">فتح</button><button class="btn sm" data-scopy="${esc(s.id)}">📋 نسخ</button><button class="btn sm" data-sprint="${esc(s.id)}">🖨️ طباعة</button></div></div>`; }).join("")
    : `<div class="card empty" style="line-height:2">لا توجد جلسات${q ? " مطابقة" : " بعد"}.<br>اضغط <b>«➕ جلسة جديدة»</b> لتسجيل جلسة فردية تقويمية مع معلم.</div>`);
}
function followupPushes(now, horizon) {
  const out = [], at7 = ds => { const d = parseYmd(ds); d.setHours(7, 0, 0, 0); return d.getTime(); };
  sesList().forEach(s => { if (!s.follow || !s.remind || s.followDone) return; const ms = at7(s.follow); if (ms < now - 60000 || ms > horizon) return;
    out.push({ id: "ses-" + s.id, at: ms, title: TR("📌 موعد متابعة جلسة: " + s.teacher), body: s.title, date: s.follow }); });
  evList().forEach(x => { const p = x.plan; if (!p || !p.follow || !p.remind || p.followDone) return; const ms = at7(p.follow); if (ms < now - 60000 || ms > horizon) return;
    out.push({ id: "plan-" + x.id, at: ms, title: TR("📌 موعد متابعة خطة تطوير: " + x.teacher), body: (isDasc(x) ? "DASC · " : "") + x.subj + " · " + x.date, date: p.follow }); });
  return out;
}
function exportSessions() {
  const L = sesList(); if (!L.length) return toast("لا توجد جلسات للتصدير");
  loadXLSX().then(() => {
    const head = ["التاريخ", "المعلم", "المادة", "عنوان الجلسة", "أسئلة المناقشة", "التوصيات", "التزامات المعلم", "موعد المتابعة", "تمت المتابعة", "تأكيد المعلم", "مرتبطة بزيارة"];
    const rows = L.slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).map(s => { const ev = s.evId ? evList().find(x => x.id === s.evId) : null;
      return [s.date, s.teacher, s.subj, s.title, s.questions, s.recs, s.commits, s.follow || "", s.followDone ? "نعم" : "", s.ack ? "نعم " + (s.ackDate || "") : "", ev ? ev.date : ""]; });
    const ws = XLSX.utils.aoa_to_sheet([head, ...rows]); ws["!cols"] = head.map((h, i) => ({ wch: [12, 20, 14, 30, 40, 40, 40, 12, 10, 14, 12][i] }));
    const wb = XLSX.utils.book_new(); wb.Workbook = { Views: [{ RTL: true }] }; XLSX.utils.book_append_sheet(wb, ws, "الجلسات الفردية");
    XLSX.writeFile(wb, "الجلسات-الفردية-" + ymd(new Date()) + ".xlsx");
  }).catch(() => toast("تعذّر تحميل أداة Excel"));
}
function initPlans() {
  document.getElementById("sesNew").onclick = () => openSession(null);
  document.getElementById("sesExport").onclick = exportSessions;
  document.getElementById("sesQ").addEventListener("input", renderSessions);
  document.getElementById("sesList").addEventListener("click", ev => {
    const g = a => { const el = ev.target.closest("[" + a + "]"); return el ? el.getAttribute(a) : null; };
    let id;
    if ((id = g("data-sopen"))) return openSession(id);
    if ((id = g("data-popen"))) return openPlan(id);
    if ((id = g("data-scopy"))) { const s = sesList().find(x => x.id === id); if (s) copyText(sesText(s)); return; }
    if ((id = g("data-sprint"))) { const s = sesList().find(x => x.id === id); if (s) printSession(s); return; }
    if ((id = g("data-sdone"))) { const s = sesList().find(x => x.id === id); if (s) { s.followDone = true; s.updated = Date.now(); savePrefs(); renderSessions(); updSesCount(); toast("تم ✓"); } return; }
    if ((id = g("data-pdone"))) { const x = evList().find(y => y.id === id); if (x && x.plan) { x.plan.followDone = true; x.plan.updated = Date.now(); savePrefs(); renderSessions(); updSesCount(); toast("تم ✓"); } return; }
  });
}
