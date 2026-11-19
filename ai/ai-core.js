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
  nav:{ guide:"الدليل", agents:"الوكلاء", training:"التدريب", prompts:"البرومبتات", products:"منتجات المعلمين", add:"أضف منتجك", back:"منصة مهارات القرن 21", home:"الرئيسية" },
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
  nav:{ guide:"Guide", agents:"Agents", training:"Training", prompts:"Prompts", products:"Teachers' Products", add:"Add your product", back:"21st Century Skills platform", home:"Home" },
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
  const links = [['guide','#guide'],['agents','#agents'],['training','#training'],['prompts','#prompts'],['products','#products']];
  const nav = document.createElement('header');
  nav.className = 'nav';
  nav.innerHTML =
    '<a class="brand" href="' + (inHub ? '#top' : 'index.html') + '">' +
      '<span class="logo"><img src="../assets/school-logo.png" alt="" onerror="this.parentNode.classList.add(\'missing\')"></span>' +
      '<span class="mark" aria-hidden="true"><i></i></span>' +
      '<span class="bt"><b data-t="brand"></b><small data-t="brandSub"></small></span></a>' +
    '<nav class="links" aria-label="Main">' + (page === 'admin' ? '' : links.map(l => '<a href="' + h + l[1] + '" data-t="nav.' + l[0] + '"></a>').join('')) + '</nav>' +
    '<div class="nav-act">' +
      (page === 'admin' ? '' : '<button class="btn sm grad" type="button" data-add><span>＋</span> <span data-t="nav.add"></span></button>') +
      '<button class="lang" id="langBtn" type="button" aria-label="Change language / تغيير اللغة"><span data-l="ar">AR</span><span data-l="en">EN</span></button>' +
      (page === 'admin' ? '' : '<button class="burger" id="burger" type="button" aria-expanded="false" aria-label="Menu"><i></i><i></i><i></i></button>') +
    '</div>';
  document.body.prepend(nav);
  const aur = document.createElement('div'); aur.className = 'aurora'; aur.setAttribute('aria-hidden', 'true'); document.body.prepend(aur);
  if (page !== 'admin') {
    const menu = document.createElement('nav');
    menu.className = 'menu'; menu.id = 'menu'; menu.hidden = true;
    menu.innerHTML = links.map(l => '<a href="' + h + l[1] + '" data-t="nav.' + l[0] + '"></a>').join('') + '<a href="../index.html" data-t="nav.back"></a>';
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
    '<div><a href="../index.html">← <span data-t="nav.back"></span></a></div></div>';
  document.body.appendChild(f);
  if (DEMO) { const d = document.createElement('div'); d.className = 'demo-band'; d.setAttribute('data-t', 'common.demo'); nav.before(d); document.body.classList.add('has-demo'); }
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 10), { passive:true });
}

window.AI = { D, I18N, T, L, LANG: () => LANG, applyLang, onLang: fn => listeners.push(fn), $, $$, esc, MAP, safeUrl, img, nl2br,
  fmtNum, fmtDate, subjectName, stageName, typeOf, toolName, ytId, toast, copy, modal, call, DEMO, CONFIGURED, API, LS, SS, qs,
  readAsDataURL, shrinkImage, sandboxDoc, SANDBOX_ATTR, shell };
})();
