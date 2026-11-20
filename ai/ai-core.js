/* =====================================================================
   منصة المعلم الذكي — المحرك المشترك (اللغة • الاتصال بالخادم • أدوات مساعدة)
   ===================================================================== */
(function () {
'use strict';
const D = window.AI_DATA;

/* ------------------------- نصوص الواجهة ------------------------- */
const I18N = {
ar: {
  brand:"المعلم الذكي", brandSub:"الذكاء الاصطناعي لمعلمي دار الذكر", school:"مدارس دار الذكر",
  nav:{ guide:"الدليل", agents:"الوكلاء", training:"التدريب", prompts:"البرومبتات", lab:"المختبر", learn:"المعرفة", products:"المعرض", add:"أضف منتجك", back:"منصة مهارات القرن 21", home:"الرئيسية", favs:"مفضلتي", admin:"لوحة الإدارة" },
  price:{ free:"مجاني", freemium:"مجاني بحدود", edu:"مجاني بحساب Google للتعليم", paid:"مدفوع" },
  arLvl:{ good:"عربي ممتاز", ok:"عربي جيد", low:"الأفضل بالإنجليزية" },
  common:{ open:"فتح", copy:"نسخ", copied:"تم النسخ ✓", close:"إغلاق", all:"الكل", search:"ابحث…", loading:"جارٍ التحميل…",
    retry:"إعادة المحاولة", none:"لا توجد نتائج", save:"حفظ", cancel:"إلغاء", next:"التالي", prev:"السابق", minutes:"دقيقة",
    views:"مشاهدة", likes:"إعجاب", by:"إعداد", edit:"تعديل", del:"حذف", yes:"نعم", no:"لا", required:"مطلوب", optional:"اختياري",
    netErr:"تعذّر الاتصال بالخادم — تأكد من الإنترنت", timeout:"انتهت مهلة الاتصال، حاول مرة أخرى",
    notConfigured:"لم يتم ربط المنصة بالخادم بعد — يعمل الدليل والتدريب والبرومبتات، ومعرض المنتجات يعمل بعد الربط.",
    demo:"وضع تجريبي ببيانات افتراضية للعرض فقط — ما تضيفه هنا يُحفظ في متصفحك فقط", demoOpen:"افتح الوضع التجريبي",
    lastReview:"معلومات الأدوات والأسعار تتغير باستمرار — راجع موقع الأداة. آخر مراجعة: نوفمبر 2026" },
  footer:{ by:"إعداد وإشراف: مصطفى أحمد حسين — مشرف مهارات القرن 21", unit:"وحدة مهارات القرن 21 — مدارس دار الذكر" }
},
en: {
  brand:"Smart Teacher", brandSub:"AI for Dar Al-Thikr teachers", school:"Dar Al-Thikr Schools",
  nav:{ guide:"Guide", agents:"Agents", training:"Training", prompts:"Prompts", lab:"Lab", learn:"Knowledge", products:"Showcase", add:"Add your product", back:"21st Century Skills platform", home:"Home", favs:"My favorites", admin:"Admin dashboard" },
  price:{ free:"Free", freemium:"Free tier", edu:"Free with Google for Education", paid:"Paid" },
  arLvl:{ good:"Great Arabic", ok:"Good Arabic", low:"Best in English" },
  common:{ open:"Open", copy:"Copy", copied:"Copied ✓", close:"Close", all:"All", search:"Search…", loading:"Loading…",
    retry:"Retry", none:"No results", save:"Save", cancel:"Cancel", next:"Next", prev:"Back", minutes:"min",
    views:"views", likes:"likes", by:"By", edit:"Edit", del:"Delete", yes:"Yes", no:"No", required:"required", optional:"optional",
    netErr:"Couldn't reach the server — check your connection", timeout:"Connection timed out, try again",
    notConfigured:"The platform isn't connected to its server yet — the guide, training and prompts work; the showcase works once connected.",
    demo:"Demo mode with sample data — anything you add is saved in your browser only", demoOpen:"Open demo mode",
    lastReview:"Tool details and pricing change often — check the tool's site. Last reviewed: November 2026" },
  footer:{ by:"Prepared and supervised by: Moustafa Ahmed Hussein — 21st Century Skills Supervisor", unit:"21st Century Skills Unit — Dar Al-Thikr Schools" }
}};

/* ------------------------- اللغة ------------------------- */
const LS = {
  get(k){ try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v){ try { localStorage.setItem(k, v); } catch (e) {} },
  del(k){ try { localStorage.removeItem(k); } catch (e) {} }
};
const SS = {
  get(k){ try { return sessionStorage.getItem(k); } catch (e) { return null; } },
  set(k, v){ try { sessionStorage.setItem(k, v); } catch (e) {} },
  del(k){ try { sessionStorage.removeItem(k); } catch (e) {} }
};
const qs = new URLSearchParams(location.search);
let LANG = [qs.get('lang'), LS.get('lang')].find(v => v === 'ar' || v === 'en') || 'ar';
const listeners = [];
function T(path, extra) {
  const v = path.split('.').reduce((o, k) => (o == null ? o : o[k]), extra && extra[LANG] || I18N[LANG]);
  if (v != null) return v;
  return path.split('.').reduce((o, k) => (o == null ? o : o[k]), I18N[LANG]);
}
function L(o) { if (o == null) return ''; if (typeof o === 'string') return o; return o[LANG] != null ? o[LANG] : (o.ar != null ? o.ar : ''); }
function applyLang(lang) {
  if (lang) LANG = lang;
  LS.set('lang', LANG);
  const de = document.documentElement;
  de.lang = LANG; de.dir = LANG === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-t]').forEach(el => { const v = AI.T(el.dataset.t); if (typeof v === 'string') el.textContent = v; });
  document.querySelectorAll('[data-t-ph]').forEach(el => { const v = AI.T(el.dataset.tPh); if (typeof v === 'string') el.placeholder = v; });
  document.querySelectorAll('[data-t-aria]').forEach(el => { const v = AI.T(el.dataset.tAria); if (typeof v === 'string') el.setAttribute('aria-label', v); });
  listeners.forEach(fn => { try { fn(LANG); } catch (e) { console.error(e); } });
}

/* ------------------------- أدوات مساعدة ------------------------- */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const byId = (arr) => { const m = {}; arr.forEach(x => { m[x.id] = x; }); return m; };
const MAP = { tools: byId(D.tools), tasks: byId(D.tasks), subjects: byId(D.subjects), stages: byId(D.stages), types: byId(D.types) };
const safeUrl = u => /^https?:\/\//i.test(String(u || '')) ? String(u) : '#';
const img = (id, w) => id ? (String(id).indexOf('data:') === 0 ? id : 'https://drive.google.com/thumbnail?id=' + encodeURIComponent(id) + '&sz=w' + (w || 800)) : '';
const nl2br = s => esc(s).replace(/\n/g, '<br>');
const fmtNum = n => new Intl.NumberFormat(LANG === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US').format(Number(n) || 0);
const fmtDate = s => { const d = new Date(s); return isNaN(d) ? '' : d.toLocaleDateString(LANG === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { year:'numeric', month:'short', day:'numeric' }); };
function subjectName(p) { if (p.subject === 'other' && p.subjectOther) return p.subjectOther; const s = MAP.subjects[p.subject]; return s ? s[LANG] : (p.subject || ''); }
function stageName(id) { const s = MAP.stages[id]; return s ? s[LANG] : (id || ''); }
function typeOf(id) { return MAP.types[id] || { icon:'📦', ar:id, en:id }; }
function toolName(id) { const t = MAP.tools[id]; return t ? t.name : id; }
function ytId(u) { const m = String(u || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/); return m ? m[1] : ''; }

let toastT;
function toast(msg, bad) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.className = 'show' + (bad ? ' bad' : '');
  clearTimeout(toastT); toastT = setTimeout(() => { t.className = ''; }, bad ? 5200 : 2600);
}
async function copy(text, btn) {
  let ok = false;
  try { await navigator.clipboard.writeText(text); ok = true; }
  catch (e) {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { ok = document.execCommand('copy'); } catch (e2) {} ta.remove();
  }
  if (ok) {
    toast(T('common.copied'));
    if (btn) { const o = btn.innerHTML; btn.classList.add('done'); btn.textContent = T('common.copied'); setTimeout(() => { btn.innerHTML = o; btn.classList.remove('done'); }, 1600); }
  }
}

/* ------------------------- النوافذ المنبثقة ------------------------- */
function modal(html, opts) {
  opts = opts || {};
  const wrap = document.createElement('div');
  wrap.className = 'modal-back' + (opts.wide ? ' wide' : '') + (opts.full ? ' full' : '');
  wrap.innerHTML = '<div class="modal" role="dialog" aria-modal="true"><button class="m-x" type="button" aria-label="' + esc(T('common.close')) + '">✕</button><div class="m-body">' + html + '</div></div>';
  const prevFocus = document.activeElement;
  function close() {
    if (opts.onClose && opts.onClose() === false) return;
    wrap.classList.remove('in'); document.removeEventListener('keydown', onKey);
    setTimeout(() => { wrap.remove(); if (!$('.modal-back')) document.body.classList.remove('locked'); }, 200);
    if (prevFocus && prevFocus.focus) prevFocus.focus();
  }
  function onKey(e) { if (e.key === 'Escape' && wrap === $$('.modal-back').pop()) close(); }
  wrap.addEventListener('mousedown', e => { if (e.target === wrap && !opts.sticky) close(); });
  wrap.querySelector('.m-x').onclick = close;
  document.addEventListener('keydown', onKey);
  document.body.appendChild(wrap); document.body.classList.add('locked');
  requestAnimationFrame(() => wrap.classList.add('in'));
  setTimeout(() => { const f = wrap.querySelector('[autofocus]') || wrap.querySelector('.m-x'); if (f) f.focus(); }, 60);
  return { el: wrap.querySelector('.m-body'), close, root: wrap };
}

/* ------------------------- الاتصال بالخادم ------------------------- */
const API = String(window.AI_API || '').trim();
const DEMO = qs.get('demo') === '1';
const CONFIGURED = !!API && /^https:\/\/script\.google\.com\//.test(API);
let cbN = 0;
function jsonp(action, params) {
  return new Promise((resolve, reject) => {
    const cb = '__ai_cb' + (++cbN) + '_' + Date.now();
    const sc = document.createElement('script');
    const timer = setTimeout(() => { cleanup(); reject(new Error(T('common.timeout'))); }, 30000);
    function cleanup() { clearTimeout(timer); try { delete window[cb]; } catch (e) { window[cb] = undefined; } sc.remove(); }
    window[cb] = d => { cleanup(); resolve(d); };
    sc.onerror = () => { cleanup(); reject(new Error(T('common.netErr'))); };
    const q = { action, p: JSON.stringify(params || {}), callback: cb, _: Date.now() };
    sc.src = API + '?' + Object.keys(q).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(q[k])).join('&');
    document.body.appendChild(sc);
  });
}
function post(action, params, timeoutMs) {
  const ctl = window.AbortController ? new AbortController() : null;
  const timer = setTimeout(() => ctl && ctl.abort(), timeoutMs || 120000);
  return fetch(API, { method:'POST', body: JSON.stringify({ action, p: params || {} }), redirect:'follow', signal: ctl && ctl.signal })
    .then(r => r.json())
    .catch(e => { throw new Error(e && e.name === 'AbortError' ? T('common.timeout') : T('common.netErr')); })
    .finally(() => clearTimeout(timer));
}
const GET_ACTIONS = ['ping', 'list', 'get', 'app', 'view', 'like'];
/* call: يعيد النتيجة أو يرمي خطأ برسالة واضحة */
async function call(action, params, opt) {
  opt = opt || {};
  let r;
  if (DEMO) r = await window.AI_DEMO.handle(action, JSON.parse(JSON.stringify(params || {})));
  else {
    if (!CONFIGURED) throw new Error(T('common.notConfigured'));
    r = GET_ACTIONS.indexOf(action) >= 0 ? await jsonp(action, params) : await post(action, params, opt.timeout);
  }
  if (!r || !r.ok) { const e = new Error((r && r.error) || 'Error'); e.data = r; throw e; }
  return r;
}

/* ------------------------- الصور والملفات (المتصفح) ------------------------- */
function readAsDataURL(file) {
  return new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => rej(fr.error); fr.readAsDataURL(file); });
}
/* تصغير الصورة وضغطها قبل الرفع */
function shrinkImage(file, max, quality) {
  max = max || 1400; quality = quality || 0.85;
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => {
      let w = im.naturalWidth, h = im.naturalHeight;
      const s = Math.min(1, max / Math.max(w, h)); w = Math.round(w * s); h = Math.round(h * s);
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); g.drawImage(im, 0, 0, w, h);
      URL.revokeObjectURL(url);
      res(c.toDataURL('image/jpeg', quality));
    };
    im.onerror = () => { URL.revokeObjectURL(url); rej(new Error('bad image')); };
    im.src = url;
  });
}

/* تجهيز ملف HTML ليعمل داخل إطار معزول: بديل للتخزين المحلي حتى لا يتعطل التطبيق */
const SANDBOX_SHIM = '<script>(function(){function M(){var d={};return{getItem:function(k){return Object.prototype.hasOwnProperty.call(d,k)?d[k]:null},setItem:function(k,v){d[k]=String(v)},removeItem:function(k){delete d[k]},clear:function(){d={}},key:function(i){return Object.keys(d)[i]||null},get length(){return Object.keys(d).length}}}["localStorage","sessionStorage"].forEach(function(n){try{window[n].getItem("x")}catch(e){try{Object.defineProperty(window,n,{value:M(),configurable:true})}catch(e2){}}});})();<\/script>';
function sandboxDoc(html) {
  html = String(html || '');
  if (/<head[^>]*>/i.test(html)) return html.replace(/<head[^>]*>/i, m => m + SANDBOX_SHIM);
  if (/<html[^>]*>/i.test(html)) return html.replace(/<html[^>]*>/i, m => m + '<head>' + SANDBOX_SHIM + '</head>');
  return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + SANDBOX_SHIM + '</head><body>' + html + '</body></html>';
}
const SANDBOX_ATTR = 'allow-scripts allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-downloads';

/* ------------------------- الهيكل المشترك (الشريط العلوي والتذييل) ------------------------- */
function shell(page) {
  const inHub = page === 'hub';
  const h = inHub ? '' : 'index.html';
  const links = [['guide','#guide'],['agents','#agents'],['training','#training'],['prompts','#prompts'],['lab','#lab'],['learn','#learn'],['products','#products']];
  const nav = document.createElement('header');
  nav.className = 'nav';
  nav.innerHTML =
    '<a class="brand" href="' + (inHub ? '#top' : 'index.html') + '">' +
      '<span class="logo"><img src="../assets/school-logo.png" alt="" onerror="this.parentNode.classList.add(\'missing\')"></span>' +
      '<span class="mark" aria-hidden="true"><i></i></span>' +
      '<span class="bt"><b data-t="brand"></b><small data-t="brandSub"></small></span></a>' +
    '<nav class="links" aria-label="Main">' + (page === 'admin' ? '' : links.map(l => '<a href="' + h + l[1] + '" data-t="nav.' + l[0] + '"></a>').join('')) + '</nav>' +
    '<div class="nav-act">' +
      (page === 'admin' ? '' : '<button class="favbtn" type="button" data-favs data-t-aria="nav.favs" title="♥"><span>♥</span><i id="favCount"></i></button>') +
      (page === 'admin' ? '' : '<a class="admbtn" href="admin.html' + (DEMO ? '?demo=1' : '') + '" data-t-aria="nav.admin" title="لوحة الإدارة / Admin">🔐</a>') +
      (page === 'admin' ? '' : '<button class="btn sm grad" type="button" data-add><span>＋</span> <span data-t="nav.add"></span></button>') +
      '<button class="lang" id="langBtn" type="button" aria-label="Change language / تغيير اللغة"><span data-l="ar">AR</span><span data-l="en">EN</span></button>' +
      (page === 'admin' ? '' : '<button class="burger" id="burger" type="button" aria-expanded="false" aria-label="Menu"><i></i><i></i><i></i></button>') +
    '</div>';
  document.body.prepend(nav);
  const aur = document.createElement('div'); aur.className = 'aurora'; aur.setAttribute('aria-hidden', 'true'); document.body.prepend(aur);
  if (page !== 'admin') {
    const menu = document.createElement('nav');
    menu.className = 'menu'; menu.id = 'menu'; menu.hidden = true;
    menu.innerHTML = links.map(l => '<a href="' + h + l[1] + '" data-t="nav.' + l[0] + '"></a>').join('') + '<a href="admin.html' + (DEMO ? '?demo=1' : '') + '">🔐 <span data-t="nav.admin"></span></a><a href="../index.html" data-t="nav.back"></a>';
    nav.after(menu);
    const b = $('#burger');
    b.onclick = () => { const o = menu.hidden; menu.hidden = !o; b.setAttribute('aria-expanded', String(o)); b.classList.toggle('x', o); };
    menu.addEventListener('click', e => { if (e.target.tagName === 'A') { menu.hidden = true; b.classList.remove('x'); b.setAttribute('aria-expanded', 'false'); } });
  }
  $('#langBtn').onclick = () => applyLang(LANG === 'ar' ? 'en' : 'ar');
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-add]');
    if (a) { e.preventDefault(); if (window.AI_FORM) window.AI_FORM.open(); }
  });
  const f = document.createElement('footer');
  f.className = 'foot';
  f.innerHTML = '<div class="wrap"><div><b data-t="brand"></b> · <span data-t="footer.unit"></span></div><div class="by" data-t="footer.by"></div>' +
    '<div style="display:flex;gap:18px;flex-wrap:wrap;justify-content:center">' + (page === 'admin' ? '' : '<a href="admin.html' + (DEMO ? '?demo=1' : '') + '">🔐 <span data-t="nav.admin"></span></a>') + '<a href="../index.html">← <span data-t="nav.back"></span></a></div></div>';
  document.body.appendChild(f);
  fav.badge();
  if (DEMO) { const d = document.createElement('div'); d.className = 'demo-band'; d.setAttribute('data-t', 'common.demo'); nav.before(d); document.body.classList.add('has-demo'); }
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive:true });
}

/* ------------------------- المفضلة (على الجهاز) ------------------------- */
const FAV_KEY = 'ai_favs';
const fav = {
  all(){ try { return JSON.parse(LS.get(FAV_KEY) || '[]'); } catch (e) { return []; } },
  has(k){ return fav.all().indexOf(k) >= 0; },
  toggle(k){ const a = fav.all(), i = a.indexOf(k); if (i >= 0) a.splice(i, 1); else a.unshift(k); LS.set(FAV_KEY, JSON.stringify(a.slice(0, 300))); fav.badge(); return i < 0; },
  badge(){ const b = document.getElementById('favCount'); if (b) { const n = fav.all().length; b.textContent = n ? n : ''; } },
  btn(k){ const on = fav.has(k); return '<button class="heart' + (on ? ' on' : '') + '" type="button" data-fav="' + esc(k) + '" aria-pressed="' + on + '" title="♥">♥</button>'; }
};
document.addEventListener('click', e => {
  const b = e.target.closest('[data-fav]'); if (!b) return;
  e.preventDefault(); e.stopPropagation();
  const on = fav.toggle(b.dataset.fav);
  document.querySelectorAll('[data-fav="' + CSS.escape(b.dataset.fav) + '"]').forEach(x => { x.classList.toggle('on', on); x.setAttribute('aria-pressed', String(on)); });
  toast(on ? (LANG === 'ar' ? 'أُضيف إلى مفضلتي ♥' : 'Added to favorites ♥') : (LANG === 'ar' ? 'أُزيل من المفضلة' : 'Removed from favorites'));
});

/* ------------------------- 🎖️ شهادة نجم الشهر (تتولد تلقائياً) ------------------------- */
function starCert(st, opts) {
  opts = opts || {};
  const sample = !!opts.sample;
  const name = sample ? 'اسم المعلم / المعلمة' : String(st.teacher || '');
  const month = sample ? 'الشهر والسنة' : String(st.month || '');
  const proj = sample ? 'عنوان المشروع الفائز' : String(st.title || '');
  const role = sample ? '' : String(st.role || '');
  let h = 2166136261; const k = name + '|' + month + '|' + proj;
  for (let i = 0; i < k.length; i++) { h ^= k.charCodeAt(i); h = Math.imul(h, 16777619); }
  const ref = 'DTS-STAR-' + ('00000000' + (h >>> 0).toString(16).toUpperCase()).slice(-8);
  const base = location.href.replace(/ai\/[^/]*$/, '');
  const w = window.open('', '_blank');
  if (!w) { toast(LANG === 'ar' ? 'اسمح بالنوافذ المنبثقة لعرض الشهادة' : 'Allow pop-ups to view the certificate', true); return; }
  const stars = Array.from({ length: 18 }, (_, i) => '<i style="left:' + ((i * 53) % 100) + '%;top:' + ((i * 29) % 100) + '%;font-size:' + (7 + (i * 7) % 11) + 'pt">✦</i>').join('');
  w.document.write('<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>شهادة نجم الشهر — ' + esc(name) + '</title>' +
    '<link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;800;900&family=Sora:wght@600;800&display=swap" rel="stylesheet">' +
    '<style>@page{size:A4 landscape;margin:0}*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}body{margin:0;font-family:"Noto Kufi Arabic",Tahoma,sans-serif;background:#2a1458}' +
    '.c{width:297mm;height:210mm;margin:auto;position:relative;overflow:hidden;padding:7mm;background:linear-gradient(135deg,#FFD54A,#FF8A3D 30%,#FF3D9A 55%,#B44BFF 78%,#3DD6FF)}' +
    '.in{position:relative;height:100%;border-radius:8mm;overflow:hidden;color:#fff;text-align:center;padding:9mm 16mm;' +
    'background:radial-gradient(120% 140% at 85% -10%,rgba(255,61,154,.45),transparent 55%),radial-gradient(90% 120% at 0% 110%,rgba(61,214,255,.35),transparent 55%),linear-gradient(135deg,#1b0f4d,#2a0f5e 45%,#130b3a)}' +
    '.in:before{content:"";position:absolute;inset:5mm;border:1.2px solid rgba(255,226,122,.75);border-radius:5mm;pointer-events:none}' +
    '.sp i{position:absolute;font-style:normal;color:#FFE27A;opacity:.75;text-shadow:0 0 6px #FFD54A}' +
    '.top{position:relative;display:flex;justify-content:space-between;align-items:center}.top img{height:19mm;background:#fff;border-radius:4mm;padding:2mm 3mm}' +
    '.crown{font-size:34pt;line-height:1;filter:drop-shadow(0 2mm 4mm rgba(255,190,40,.8))}' +
    'h1{position:relative;margin:2mm 0 0;font-size:36pt;font-weight:900;background:linear-gradient(90deg,#FFF6C8,#FFD54A,#FF9A3D,#FF5FAE,#FFE27A);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    'h2{position:relative;margin:0;font-family:Sora,sans-serif;font-size:12pt;letter-spacing:.3em;color:#7CF5D3}' +
    '.mo{position:relative;display:inline-block;margin-top:3mm;padding:1.5mm 8mm;border-radius:20mm;background:linear-gradient(90deg,#FFE27A,#FFB938);color:#4a2400;font-weight:800;font-size:13pt}' +
    '.t{position:relative;font-size:13.5pt;color:#E9E4FF;line-height:1.9;margin-top:7mm}' +
    '.nm{position:relative;font-size:34pt;font-weight:900;line-height:1.5;margin:2mm 0 1mm;color:#FFE27A;text-shadow:0 0 8mm rgba(255,214,74,.55)}' +
    '.rl{position:relative;font-size:11.5pt;color:#D9D2FF}' +
    '.pj{position:relative;display:inline-block;margin-top:4mm;padding:2.5mm 9mm;border-radius:4mm;border:1px solid rgba(255,226,122,.6);background:rgba(255,255,255,.08);font-size:15pt;font-weight:800}' +
    '.ft{position:absolute;bottom:11mm;left:18mm;right:18mm;display:flex;justify-content:space-between;align-items:flex-end;font-size:10pt;color:#D9D2FF}' +
    '.ft b{color:#fff}.sg{text-align:center;min-width:62mm}.sg .ln{border-top:1px solid rgba(255,255,255,.6);margin-bottom:1.5mm;height:9mm}' +
    '.bar{position:fixed;top:10px;left:10px;z-index:9;display:flex;gap:8px}.bar button{font:inherit;padding:8px 18px;border-radius:10px;border:0;background:#FFB938;color:#3d1e00;font-weight:800;cursor:pointer}' +
    '.smp{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-18deg);font-size:70pt;font-weight:900;color:rgba(255,255,255,.09);white-space:nowrap;pointer-events:none}' +
    '@media screen{body{padding:14px 0}.c{box-shadow:0 20px 60px rgba(0,0,0,.5)}}@media print{.bar{display:none}body{background:none;padding:0}}</style></head><body>' +
    '<div class="bar"><button onclick="print()">🖨️ طباعة / حفظ PDF</button></div>' +
    '<div class="c"><div class="in"><div class="sp">' + stars + '</div>' + (sample ? '<div class="smp">نموذج</div>' : '') +
    '<div class="top"><img src="' + base + 'assets/school-logo.png" onerror="this.style.visibility=\'hidden\'"><div class="crown">👑</div><div style="width:19mm"></div></div>' +
    '<h1>شهادة نجم الشهر</h1><h2>STAR OF THE MONTH</h2><div class="mo">⭐ ' + esc(month) + '</div>' +
    '<div class="t">تتشرّف مدارس دار الذكر بمنح هذه الشهادة إلى</div>' +
    '<div class="nm">' + esc(name) + '</div>' + (role ? '<div class="rl">' + esc(role) + '</div>' : '') +
    '<div class="t" style="margin-top:6mm">تقديراً لتميّزه في توظيف الذكاء الاصطناعي في التعليم من خلال مشروع</div>' +
    '<div class="pj">«' + esc(proj || 'مشروع متميز') + '»</div>' +
    '<div class="t" style="font-size:12pt;margin-top:6mm">واختياره نجماً لمنصة «المعلم الذكي» — مع خالص الشكر والتمنيات بدوام التميّز والعطاء.</div>' +
    '<div class="ft"><div class="sg"><div class="ln"></div>مدير التعليم<br><b>مصطفى خلف</b></div>' +
    '<div style="text-align:center">منصة المعلم الذكي<br><span dir="ltr">Ref: <b>' + ref + '</b></span></div>' +
    '<div class="sg"><div class="ln"></div>الرئيس التنفيذي<br><b>بسام غراب</b></div></div>' +
    '</div></div></body></html>');
  w.document.close();
}

window.AI = { starCert, fav, D, I18N, T, L, LANG: () => LANG, applyLang, onLang: fn => listeners.push(fn), $, $$, esc, MAP, safeUrl, img, nl2br,
  fmtNum, fmtDate, subjectName, stageName, typeOf, toolName, ytId, toast, copy, modal, call, DEMO, CONFIGURED, API, LS, SS, qs,
  readAsDataURL, shrinkImage, sandboxDoc, SANDBOX_ATTR, shell };
})();
