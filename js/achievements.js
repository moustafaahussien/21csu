/* ==========================================================================
   محرك صفحات أقسام الإنجازات (المسابقات - المشاريع - المعارض - الفعاليات - إنجازات الطلاب)
   ---------------------------------------------------------------------
   كل صفحة قسم تحدّد فقط:  data-cat  و  DRIVE_FOLDER_ID  و  DRIVE_SCRIPT_URL
   والمحرك يبني الصفحة كلها ويجلب الإنجازات من جوجل درايف في كل مرة تُفتح.

   بنية فولدرات درايف لكل قسم:
     <فولدر القسم>              ← الـID هذا يوضع في DRIVE_FOLDER_ID
       └── <فولدر الإنجاز>       ← اسم الفولدر = اسم الإنجاز
             ├── صور وفيديوهات الإنجاز
             └── نبذة.txt        ← النص المرتبط بالإنجاز (UTF-8)

   قواعد التسمية (كلها اختيارية):
     • اسم عربي وإنجليزي:   المركز الأول في الروبوت | First place in robotics
     • ترتيب الإنجازات:     ابدأ الاسم برقم →  01 - ...  ،  02 - ...   (الرقم لا يظهر في الموقع)
                            بدون أرقام: الأحدث إنشاءً يظهر أولًا
     • نص إنجليزي:          ملف نصي ثانٍ اسمه  en.txt   (وإلا يظهر النص العربي في اللغتين)
     • ترتيب الصور:         بأسماء الملفات (1.jpg ثم 2.jpg ...)
     • وصف صورة معيّنة:     من خانة "الوصف" في تفاصيل الملف على درايف

   للفحص: أضف ?debug=1 لرابط الصفحة ليظهر سبب أي مشكلة في الجلب.
   ========================================================================== */
(function () {
"use strict";

const CAT = document.body.getAttribute("data-cat");
const FOLDER = typeof DRIVE_FOLDER_ID !== "undefined" ? DRIVE_FOLDER_ID : "";
const SCRIPT = typeof DRIVE_SCRIPT_URL !== "undefined" ? DRIVE_SCRIPT_URL : "";
const DEBUG = /[?&]debug=1/.test(location.search);

/* اسم المُعِدّ في التذييل (عدّله هنا مرة واحدة) */
const FOOTER_BY = { ar: "إعداد و برمجة وإشراف: مصطفى أحمد حسين", en: "Prepared and supervised by: Unit Lead Name" };

const ORDER = ["competitions", "projects", "exhibitions", "events", "students"];
const CATS = {
  competitions: { color: "#FF9A1F",
    icon: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v2a3 3 0 0 0 4 3M16 6h4v2a3 3 0 0 1-4 3M12 13v4M8 21h8M10 17h4"/>',
    ar: { name: "المسابقات", sub: "Competitions", lead: "مسابقات يشارك فيها طلابنا بمشروعاتهم ومهاراتهم، وقصص إصرار وفوز نفتخر بها." },
    en: { name: "Competitions", sub: "المسابقات", lead: "Competitions where our students take part with their projects and skills — stories of persistence and winning we are proud of." } },
  projects: { color: "#16B8E0",
    icon: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12L4 7.5M12 12v9"/>',
    ar: { name: "المشاريع", sub: "Projects", lead: "مشروعات صنعها الطلاب بأيديهم، من الفكرة الأولى حتى التنفيذ والعرض." },
    en: { name: "Projects", sub: "المشاريع", lead: "Projects students made with their own hands, from the first idea to building and presenting." } },
  exhibitions: { color: "#FF4D8D",
    icon: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 21l4-5 4 5"/>',
    ar: { name: "المعارض", sub: "Exhibitions", lead: "معارض تعرض فيها الوحدة أعمال طلابها أمام المجتمع المدرسي وأولياء الأمور." },
    en: { name: "Exhibitions", sub: "المعارض", lead: "Exhibitions where the unit showcases its students' work to the school community and parents." } },
  events: { color: "#7B5CFF",
    icon: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    ar: { name: "الفعاليات", sub: "Events", lead: "فعاليات ومهرجانات ولحظات لا تُنسى من قلب الوحدة." },
    en: { name: "Events", sub: "الفعاليات", lead: "Events, festivals, and unforgettable moments from the heart of the unit." } },
  students: { color: "#10C38B",
    icon: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    ar: { name: "إنجازات الطلاب", sub: "Student Achievements", lead: "قصص نجاح وإنجازات فردية لطلاب تميّزوا بمهاراتهم وأثرهم." },
    en: { name: "Student Achievements", sub: "إنجازات الطلاب", lead: "Success stories and individual achievements of students who stood out with their skills and impact." } }
};
const app = document.getElementById("app");
const meta = CATS[CAT];
if (!meta) { app.innerHTML = '<p class="fatal">Unknown category</p>'; return; }
document.documentElement.style.setProperty("--c", meta.color);

const UI = {
  ar: { unit: "وحدة مهارات القرن 21",
    nav: { home: "الرئيسية", about: "عن الوحدة", programs: "البرامج", journey: "الرحلة", achievements: "الإنجازات", gallery: "المعرض" },
    crumb: "الإنجازات", browse: "استعرض الإنجازات", back: "كل أقسام الإنجازات", listTitle: "كل الإنجازات",
    open: "اعرض التفاصيل", media: "الصور والفيديوهات", close: "إغلاق", others: "أقسام أخرى من الإنجازات",
    soon: "قريبًا", phTitle: "قريبًا", phText: "ستظهر هنا الإنجازات فور إضافتها.", noMedia: "لا توجد صور أو فيديوهات لهذا الإنجاز بعد.",
    backTo: "العودة للإنجازات", footerName: "وحدة مهارات القرن 21", footerBy: FOOTER_BY.ar },
  en: { unit: "21st Century Skills Unit",
    nav: { home: "Home", about: "About", programs: "Programs", journey: "Journey", achievements: "Achievements", gallery: "Gallery" },
    crumb: "Achievements", browse: "Browse Achievements", back: "All Achievement Categories", listTitle: "All Achievements",
    open: "View Details", media: "Photos & Videos", close: "Close", others: "Other achievement categories",
    soon: "Soon", phTitle: "Coming Soon", phText: "Achievements will appear here as soon as they are added.", noMedia: "No photos or videos for this achievement yet.",
    backTo: "Back to Achievements", footerName: "21st Century Skills Unit", footerBy: FOOTER_BY.en }
};

/* ---------- أدوات ---------- */
const $ = (s, r) => (r || document).querySelector(s);
const esc = v => String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const sleep = ms => new Promise(r => setTimeout(r, ms));
const LS = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
let LANG = "ar";
const thumb = (id, size) => "https://drive.google.com/thumbnail?id=" + encodeURIComponent(id) + "&sz=w" + size;
const I = {
  photo: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 16l-5-5-8 8"/>',
  video: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>',
  chev: '<path d="M15 6l-6 6 6 6"/>',
  down: '<path d="M6 9l6 6 6-6"/>'
};
const svg = (p, cls) => '<svg viewBox="0 0 24 24" aria-hidden="true"' + (cls ? ' class="' + cls + '"' : "") + ">" + p + "</svg>";

function T(path) {
  const parts = path.split("."), root = parts.shift();
  let o = root === "ui" ? UI[LANG] : root === "cat" ? meta[LANG] : root === "cats" ? (CATS[parts.shift()] || {})[LANG] : null;
  for (const k of parts) { if (o == null) return null; o = o[k]; }
  return o;
}
function plural(n, lang, kind) {
  if (lang === "en") return n + " " + (kind === "a" ? "achievement" : kind === "p" ? "photo" : "video") + (n === 1 ? "" : "s");
  if (kind === "a") return n === 1 ? "إنجاز واحد" : n === 2 ? "إنجازان" : n <= 10 ? n + " إنجازات" : n + " إنجازًا";
  if (kind === "p") return n === 1 ? "صورة واحدة" : n === 2 ? "صورتان" : n <= 10 ? n + " صور" : n + " صورة";
  return n === 1 ? "فيديو واحد" : n === 2 ? "فيديوهان" : n <= 10 ? n + " فيديوهات" : n + " فيديو";
}

/* ---------- جلب البيانات (JSONP لتجاوز CORS) + محاولات متكررة ---------- */
function jsonp(url, ms) {
  return new Promise((resolve, reject) => {
    const cb = "__ach" + Math.random().toString(36).slice(2);
    const el = document.createElement("script");
    let done = false;
    const clean = () => { delete window[cb]; el.remove(); };
    window[cb] = d => { done = true; clean(); resolve(d); };
    el.onerror = () => { if (!done) { done = true; clean(); reject(new Error("تعذّر تحميل رابط السكريبت (تحقق من DRIVE_SCRIPT_URL ومن نشر السكريبت)")); } };
    el.src = url + "&callback=" + cb + "&_=" + Date.now();
    document.body.appendChild(el);
    setTimeout(() => { if (!done) { done = true; clean(); reject(new Error("انتهت مهلة الاتصال بالسكريبت")); } }, ms);
  });
}
async function fetchItems() {
  const url = SCRIPT + (SCRIPT.indexOf("?") >= 0 ? "&" : "?") + "mode=achievements&folderId=" + encodeURIComponent(FOLDER);
  let last;
  for (let a = 1; a <= 3; a++) {
    try {
      const d = await jsonp(url, 20000);
      if (d.error) throw new Error(d.error);
      return d.items || [];
    } catch (e) { last = e; if (a < 3) await sleep(1200 * a); }
  }
  throw last;
}

/* ---------- تجهيز البيانات ---------- */
const PREFIX = /^\s*(\d+)\s*[-_.)–—]\s*/;
const natural = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true });
const isEn = n => /^en(glish)?([._\-\s]|$)/i.test(String(n).replace(/\.[^.]+$/, ""));
const clean = t => String(t || "").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").trim();

function normalize(raw) {
  const items = (raw || []).map(r => {
    const pm = String(r.name || "").match(PREFIX);
    const name = String(r.name || "").replace(PREFIX, "").trim();
    const parts = name.split("|").map(s => s.trim()).filter(Boolean);
    const media = (r.media || []).slice().sort((a, b) => natural(a.name, b.name));
    const texts = r.texts || [];
    return {
      id: r.id, order: pm ? +pm[1] : Infinity, created: r.created || 0,
      titleAr: parts[0] || name, titleEn: parts[1] || parts[0] || name,
      textAr: clean((texts.filter(t => !isEn(t.name))[0] || texts.filter(t => isEn(t.name))[0] || {}).text),
      textEn: clean((texts.filter(t => isEn(t.name))[0] || texts.filter(t => !isEn(t.name))[0] || {}).text),
      media
    };
  });
  items.sort((a, b) => (a.order === b.order ? b.created - a.created : a.order - b.order));
  return items;
}
const title = it => (LANG === "en" ? it.titleEn : it.titleAr);
const text = it => (LANG === "en" ? it.textEn : it.textAr);
const count = (it, k) => it.media.filter(m => m.type === k).length;

/* ---------- الحالة ---------- */
const state = { status: "loading", items: [], err: null, openId: null, byClick: false, lastFocus: null, lb: { list: [], i: 0 } };

/* ---------- هيكل الصفحة ---------- */
const idx = ORDER.indexOf(CAT);
const others = ORDER.filter(k => k !== CAT);
app.innerHTML = `
<div class="aurora" aria-hidden="true"></div>
<header class="nav">
  <a class="logos" href="../index.html">
    <span class="logo"><img src="../assets/school-logo.png" alt="School logo" onerror="this.parentNode.classList.add('missing')"><span class="ph">School<br>Logo</span></span>
    <span class="sep" aria-hidden="true"></span>
    <span class="logo"><img src="../assets/unit-logo.png" alt="Unit logo" onerror="this.parentNode.classList.add('missing')"><span class="ph">Unit<br>Logo</span></span>
  </a>
  <div class="nav-right">
    <nav class="nav-links" aria-label="Main">
      <a href="../index.html" data-t="ui.nav.home"></a>
      <a href="../index.html#about" data-t="ui.nav.about"></a>
      <a href="../index.html#programs" data-t="ui.nav.programs"></a>
      <a href="../index.html#journey" data-t="ui.nav.journey"></a>
      <a href="../index.html#achievements" class="cur" data-t="ui.nav.achievements"></a>
      <a href="../index.html#gallery" data-t="ui.nav.gallery"></a>
    </nav>
    <button class="lang" id="langBtn" type="button" aria-label="Change language / تغيير اللغة"><span data-l="ar">AR</span><span data-l="en">EN</span></button>
    <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menu"><i></i><i></i><i></i></button>
  </div>
</header>
<nav class="menu" id="menu" aria-label="Menu" hidden>
  <a href="../index.html" data-t="ui.nav.home"></a>
  <a href="../index.html#about" data-t="ui.nav.about"></a>
  <a href="../index.html#programs" data-t="ui.nav.programs"></a>
  <a href="../index.html#journey" data-t="ui.nav.journey"></a>
  <a href="../index.html#achievements" data-t="ui.nav.achievements"></a>
  <a href="../index.html#gallery" data-t="ui.nav.gallery"></a>
</nav>
<main>
<section class="hero" id="top">
  <canvas id="fx" aria-hidden="true"></canvas>
  <div class="wrap hero-grid">
    <div class="hero-text">
      <div class="crumbs"><a href="../index.html" data-t="ui.nav.home"></a><i>/</i><a href="../index.html#achievements" data-t="ui.crumb"></a><i>/</i><b data-t="cat.name"></b></div>
      <h1 data-t="cat.name"></h1>
      <p class="hero-sub" data-t="cat.sub"></p>
      <p class="lead" data-t="cat.lead"></p>
      <div class="hero-count" id="heroCount"></div>
      <div class="btns">
        <a class="btn primary" href="#list"><span data-t="ui.browse"></span>${svg(I.down)}</a>
        <a class="btn ghost" href="../index.html#achievements"><span data-t="ui.back"></span></a>
      </div>
    </div>
    <div class="hero-orb" aria-hidden="true">
      <span class="ring"></span><span class="ring r2"></span>
      <div class="big">${svg(meta.icon)}</div>
      <span class="pnum">0${idx + 1}</span>
    </div>
  </div>
</section>
<section id="list">
  <div class="wrap">
    <div class="sec-head">
      <span class="gorb">${svg(meta.icon)}</span>
      <div><div class="en" data-t="cat.sub"></div><h2 class="sec-title" data-t="ui.listTitle"></h2></div>
    </div>
    <div class="ach-grid" id="grid" aria-live="polite"></div>
    <p class="note" id="note" hidden></p>
  </div>
</section>
<section class="others">
  <div class="wrap">
    <h2 class="sec-title" data-t="ui.others"></h2>
    <div class="chips">${others.map(k => `
      <a class="chip" href="${k}.html" style="--c:${CATS[k].color}"><span class="gorb">${svg(CATS[k].icon)}</span><span data-t="cats.${k}.name"></span></a>`).join("")}
    </div>
  </div>
</section>
<section class="back-section"><div class="wrap">
  <a class="btn ghost" href="../index.html#achievements">${svg('<path d="M19 12H5M12 19l-7-7 7-7"/>', "flip")}<span data-t="ui.backTo"></span></a>
</div></section>
</main>
<footer><div class="wrap"><div><b data-t="ui.footerName"></b></div><div data-t="ui.footerBy"></div></div></footer>

<div class="ad" id="ad" role="dialog" aria-modal="true" aria-hidden="true">
  <button class="ad-close" id="adClose" type="button">×</button>
  <div class="ad-inner" id="adInner"></div>
</div>
<div class="lb" id="lb" role="dialog" aria-modal="true" hidden>
  <button class="lb-x" id="lbX" type="button">×</button>
  <button class="lb-nav lb-prev" id="lbPrev" type="button">${svg('<path d="M15 6l-6 6 6 6"/>')}</button>
  <figure id="lbFig"></figure>
  <button class="lb-nav lb-next" id="lbNext" type="button">${svg('<path d="M15 6l-6 6 6 6"/>')}</button>
</div>`;

/* ---------- الرسم ---------- */
function renderCount() {
  const el = $("#heroCount");
  el.textContent = state.status === "ok" ? plural(state.items.length, LANG, "a") : "";
}
function cardHTML(it, i) {
  const p = count(it, "photo"), v = count(it, "video");
  const first = it.media[0];
  const ex = text(it).replace(/\s+/g, " ").slice(0, 170);
  return `<a class="ach-card" href="#a=${encodeURIComponent(it.id)}" data-id="${esc(it.id)}" style="--i:${i}">
    <span class="ac-cover"><span class="gorb ac-ico">${svg(meta.icon)}</span>
      ${first ? `<img src="${thumb(first.id, 700)}" alt="" loading="lazy">` : ""}
      <span class="ac-badges">${p ? `<span class="ac-badge">${svg(I.photo)}${p}</span>` : ""}${v ? `<span class="ac-badge">${svg(I.video)}${v}</span>` : ""}</span>
    </span>
    <span class="ac-body"><h3>${esc(title(it))}</h3>${ex ? `<p>${esc(ex)}</p>` : ""}
      <span class="ac-cta"><span>${esc(UI[LANG].open)}</span>${svg(I.chev)}</span></span>
  </a>`;
}
function renderGrid(animate) {
  const grid = $("#grid"), note = $("#note"), u = UI[LANG];
  note.hidden = true;
  if (state.status === "loading") {
    grid.innerHTML = [0, 1, 2].map(() => `<div class="ach-card sk"><span class="ac-cover"></span><span class="ac-body"><span class="sk-line" style="width:70%"></span><span class="sk-line"></span><span class="sk-line" style="width:85%"></span></span></div>`).join("");
    return;
  }
  if (state.status !== "ok") {
    grid.innerHTML = [0, 1, 2].map(() => `<div class="ach-card ph"><span class="gorb" style="--sz:64px">${svg(meta.icon)}</span><b>${esc(u.phTitle)}</b><p>${esc(u.phText)}</p><span class="soon">${esc(u.soon)}</span></div>`).join("");
    if (DEBUG) {
      note.hidden = false;
      note.textContent = state.status === "unconfigured"
        ? "DEBUG: DRIVE_FOLDER_ID or DRIVE_SCRIPT_URL is empty in this page."
        : state.status === "empty" ? "DEBUG: the script replied OK but the category folder has no sub-folders (achievements)."
        : "DEBUG: " + (state.err && state.err.message);
    }
    return;
  }
  grid.innerHTML = state.items.map(cardHTML).join("");
  if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const cards = [].slice.call(grid.querySelectorAll(".ach-card"));
    cards.forEach(c => c.classList.add("pre"));
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove("pre"); e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    cards.forEach(c => io.observe(c));
  }
}
function detailHTML(it) {
  const p = count(it, "photo"), v = count(it, "video"), u = UI[LANG], tx = text(it);
  const tiles = it.media.map((m, k) => m.type === "video"
    ? `<button class="dm vid" type="button" data-k="${k}"><img src="${thumb(m.id, 800)}" alt="" loading="lazy"><span class="play">${svg(I.video)}</span>${m.caption ? `<span class="cap">${esc(m.caption)}</span>` : ""}</button>`
    : `<button class="dm" type="button" data-k="${k}"><img src="${thumb(m.id, 800)}" alt="" loading="lazy">${m.caption ? `<span class="cap">${esc(m.caption)}</span>` : ""}</button>`).join("");
  return `
    <button class="ad-back" id="adBack" type="button">${svg(I.chev)}<span>${esc(u.backTo)}</span></button>
    <div class="ad-kicker">${esc(meta[LANG].name)}</div>
    <h2 class="ad-title">${esc(title(it))}</h2>
    <div class="ad-meta">${p ? `<span class="ad-chip">${svg(I.photo)}${esc(plural(p, LANG, "p"))}</span>` : ""}${v ? `<span class="ad-chip">${svg(I.video)}${esc(plural(v, LANG, "v"))}</span>` : ""}</div>
    ${tx ? `<div class="ad-text">${esc(tx)}</div>` : ""}
    <h3 class="ad-sub">${esc(u.media)}</h3>
    ${it.media.length ? `<div class="ad-media" id="adMedia">${tiles}</div>` : `<p class="ad-empty">${esc(u.noMedia)}</p>`}`;
}

/* ---------- صفحة التفاصيل ---------- */
const ad = $("#ad"), adInner = $("#adInner");
function openDetail(it, fromHash) {
  state.openId = it.id;
  adInner.innerHTML = detailHTML(it);
  ad.classList.add("open"); ad.setAttribute("aria-hidden", "false");
  document.body.classList.add("locked");
  ad.scrollTop = 0;
  $("#adClose").focus({ preventScroll: true });
  document.title = title(it) + " | " + meta[LANG].name;
}
function closeDetail() {
  if (!state.openId) return;
  state.openId = null;
  ad.classList.remove("open"); ad.setAttribute("aria-hidden", "true");
  document.body.classList.remove("locked");
  closeLb();
  document.title = meta[LANG].name + " | " + UI[LANG].unit;
  if (state.lastFocus) { try { state.lastFocus.focus({ preventScroll: true }); } catch (e) {} }
}
/* الفتح/الإغلاق يعتمدان على history.pushState/popstate صراحة (لا تخمين):
   - فتح من بطاقة  → ندفع نحن أنفسنا حالة تاريخ مُعلَّمة، فنعرف بيقين أن الرجوع آمن.
   - رابط مباشر بهاش (مشاركة/فتح جديد) → لا ندفع شيئًا، فالإغلاق يستبدل الهاش بدل الرجوع
     خارج الصفحة بالغلط. */
function hashId() { const m = location.hash.match(/^#a=(.+)$/); if (!m) return null; try { return decodeURIComponent(m[1]); } catch (e) { return null; } }
function userClose() {
  if (!state.openId) return;
  if (history.state && history.state.ach === state.openId) history.back();
  else { try { history.replaceState(null, "", location.pathname + location.search); } catch (e) {} closeDetail(); }
}
window.addEventListener("popstate", () => {
  const id = hashId();
  const it = id && state.items.find(x => x.id === id);
  if (it) { if (state.openId !== it.id) openDetail(it); }
  else closeDetail();
});
$("#adClose").addEventListener("click", userClose);
ad.addEventListener("click", e => { if (e.target.closest("#adBack")) userClose(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#lb").hidden && state.openId) userClose(); });

$("#grid").addEventListener("click", e => {
  const a = e.target.closest("a.ach-card");
  if (!a) return;
  e.preventDefault();
  const it = state.items.find(x => x.id === a.dataset.id);
  if (!it) return;
  state.lastFocus = a;
  try { history.pushState({ ach: it.id }, "", "#a=" + encodeURIComponent(it.id)); } catch (err) {}
  openDetail(it);
});
["error"].forEach(t => {
  $("#grid").addEventListener(t, e => { if (e.target.tagName === "IMG") e.target.parentNode.classList.add("broken"); }, true);
  adInner.addEventListener(t, e => { if (e.target.tagName === "IMG") e.target.parentNode.classList.add("broken"); }, true);
});
/* ميلان ثلاثي الأبعاد + ضوء يتبع المؤشر (أجهزة الماوس فقط) */
if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
  const grid = $("#grid");
  grid.addEventListener("pointermove", e => {
    const c = e.target.closest(".ach-card:not(.sk):not(.ph)"); if (!c) return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.setProperty("--mx", (x * 100).toFixed(1) + "%"); c.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    c.style.setProperty("--rx", ((0.5 - y) * 6).toFixed(2) + "deg"); c.style.setProperty("--ry", ((x - 0.5) * 6).toFixed(2) + "deg");
  });
  grid.addEventListener("pointerout", e => { const c = e.target.closest && e.target.closest(".ach-card"); if (c && !c.contains(e.relatedTarget)) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); } });
}

/* ---------- عارض الصور والفيديو ---------- */
const lb = $("#lb"), lbFig = $("#lbFig");
function showLb() {
  const m = state.lb.list[state.lb.i];
  lbFig.innerHTML = m.type === "video"
    ? `<iframe src="https://drive.google.com/file/d/${encodeURIComponent(m.id)}/preview" allow="autoplay" allowfullscreen></iframe>`
    : `<img src="${thumb(m.id, 1600)}" alt="">`;
  if (m.caption) { const fc = document.createElement("figcaption"); fc.textContent = m.caption; lbFig.appendChild(fc); }
  const many = state.lb.list.length > 1;
  $("#lbPrev").hidden = !many; $("#lbNext").hidden = !many;
}
function openLb(k) {
  const it = state.items.find(x => x.id === state.openId); if (!it) return;
  state.lb = { list: it.media, i: k };
  showLb(); lb.hidden = false; $("#lbX").focus({ preventScroll: true });
}
function closeLb() { lb.hidden = true; lbFig.innerHTML = ""; }
function stepLb(d) { const n = state.lb.list.length; state.lb.i = (state.lb.i + d + n) % n; showLb(); }
adInner.addEventListener("click", e => { const b = e.target.closest(".dm"); if (b) openLb(+b.dataset.k); });
$("#lbX").addEventListener("click", closeLb);
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
$("#lbPrev").addEventListener("click", () => stepLb(-1));
$("#lbNext").addEventListener("click", () => stepLb(1));
document.addEventListener("keydown", e => {
  if (lb.hidden) return;
  const rtl = document.documentElement.dir === "rtl";
  if (e.key === "Escape") closeLb();
  else if (e.key === "ArrowRight") stepLb(rtl ? -1 : 1);
  else if (e.key === "ArrowLeft") stepLb(rtl ? 1 : -1);
});

/* ---------- اللغة + القائمة ---------- */
function applyLang(lang) {
  LANG = lang;
  const de = document.documentElement;
  de.lang = lang; de.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-t]").forEach(el => { const v = T(el.dataset.t); if (v != null) el.textContent = v; });
  $("#adClose").setAttribute("aria-label", UI[lang].close); $("#lbX").setAttribute("aria-label", UI[lang].close);
  document.title = meta[lang].name + " | " + UI[lang].unit;
  const md = document.querySelector('meta[name="description"]'); if (md) md.content = meta[lang].lead;
  renderCount(); renderGrid(false);
  const open = state.items.find(x => x.id === state.openId);
  if (open) { adInner.innerHTML = detailHTML(open); document.title = title(open) + " | " + meta[lang].name; }
  LS.set("lang", lang);
}
$("#langBtn").addEventListener("click", () => applyLang(LANG === "ar" ? "en" : "ar"));
(function () {
  const b = $("#burger"), m = $("#menu");
  const set = o => { m.hidden = !o; b.setAttribute("aria-expanded", String(o)); };
  b.addEventListener("click", () => set(m.hidden));
  m.querySelectorAll("a").forEach(a => a.addEventListener("click", () => set(false)));
  document.addEventListener("click", e => { if (!m.hidden && !m.contains(e.target) && !b.contains(e.target)) set(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 1080) set(false); });
})();

/* ---------- جزيئات الهيرو ---------- */
(function () {
  const cv = $("#fx"), hero = $("#top"), ctx = cv.getContext && cv.getContext("2d");
  if (!ctx) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cols = [meta.color, meta.color, "#6D4BFF", "#16B8E0", "#FF4D8D"];
  let W = 0, H = 0, pts = [], mouse = { x: -999, y: -999 }, visible = true;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = Array.from({ length: Math.round(Math.min(60, W * H / 16000)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: 1.6 + Math.random() * 2.6, c: cols[(Math.random() * cols.length) | 0] }));
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      if (!reduce) {
        p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 22500 && d2 > 1) { const d = Math.sqrt(d2), f = (150 - d) / 150 * 1.6; p.x += dx / d * f; p.y += dy / d * f; }
      }
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 130) { ctx.strokeStyle = "rgba(80,90,190," + (0.2 * (1 - d / 130)).toFixed(3) + ")"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    }
    for (const p of pts) { ctx.globalAlpha = .16; ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, 6.283); ctx.fill(); ctx.globalAlpha = .85; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  resize(); window.addEventListener("resize", resize);
  if (reduce) draw(); else { (function loop() { if (visible) draw(); requestAnimationFrame(loop); })(); new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(hero); }
  hero.addEventListener("pointermove", e => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; });
})();

/* ---------- تشغيل ---------- */
(async function start() {
  const q = new URLSearchParams(location.search).get("lang");
  applyLang([q, LS.get("lang")].find(v => v === "ar" || v === "en") || "ar");
  if (!FOLDER || !SCRIPT) { state.status = "unconfigured"; renderGrid(false); return; }
  state.status = "loading"; renderGrid(false);
  try {
    state.items = normalize(await fetchItems());
    state.status = state.items.length ? "ok" : "empty";
  } catch (e) { state.status = "error"; state.err = e; if (window.console) console.warn("[achievements]", e.message); }
  renderCount(); renderGrid(true);
  const initId = hashId();
  const initIt = initId && state.items.find(x => x.id === initId);
  if (initIt) openDetail(initIt);
})();
})();
