/* =====================================================================
   منصة المعلم الذكي — خادم تجريبي داخل المتصفح (يعمل فقط مع ?demo=1)
   يحاكي ai-script.gs بالكامل لتجربة المنصة قبل الربط بـ Google Apps Script.
   كود المدير التجريبي: demo  |  كود تعديل المنتجات التجريبية: DEMO01
   ===================================================================== */
(function () {
'use strict';
if (new URLSearchParams(location.search).get('demo') !== '1') return;
const KEY = 'ai_demo_db_v3';
const RW = { content:25, pedagogy:25, design:20, ease:15, reuse:15 };
const DEMO_APP = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>تحدي الكسور</title>
<style>body{font-family:Tahoma,sans-serif;background:linear-gradient(135deg,#eef2ff,#ecfeff);margin:0;min-height:100vh;display:grid;place-items:center}
.c{background:#fff;border-radius:22px;padding:28px;width:min(520px,92vw);box-shadow:0 20px 50px -20px #4f46e580;text-align:center}
h1{color:#4f46e5;margin:0 0 6px}.q{font-size:28px;margin:18px 0;font-weight:700}.o{display:grid;grid-template-columns:1fr 1fr;gap:10px}
button{font:inherit;font-size:20px;padding:14px;border:2px solid #e0e7ff;border-radius:14px;background:#f8faff;cursor:pointer}
button:hover{border-color:#6d4bff}.ok{background:#d1fae5!important;border-color:#10b981!important}.no{background:#fee2e2!important;border-color:#ef4444!important}
.s{margin-top:14px;color:#64748b}</style></head><body><div class="c"><h1>⚡ تحدي الكسور</h1><div class="s" id="s">السؤال 1 من 5 — النقاط: 0</div>
<div class="q" id="q"></div><div class="o" id="o"></div></div><script>
var Q=[["½ + ¼ =",["¾","⅔","²⁄₆","1"],0],["⅓ + ⅓ =",["⅔","²⁄₆","1","⅓"],0],["1 − ¼ =",["¾","½","⅓","⅛"],0],["½ × 2 =",["1","¼","2","½"],0],["⅖ + ⅕ =",["⅗","³⁄₁₀","⅘","1"],0]],i=0,sc=0;
function sh(a){return a.map(function(x,j){return[x,j]}).sort(function(){return Math.random()-.5})}
function r(){if(i>=Q.length){document.querySelector('.c').innerHTML='<h1>🎉 أحسنت!</h1><div class="q">'+sc+' / 5</div><button onclick="location.reload()">إعادة المحاولة</button>';return}
document.getElementById('s').textContent='السؤال '+(i+1)+' من 5 — النقاط: '+sc;document.getElementById('q').textContent=Q[i][0];var o=document.getElementById('o');o.innerHTML='';
sh(Q[i][1]).forEach(function(p){var b=document.createElement('button');b.textContent=p[0];b.onclick=function(){var ok=p[1]===Q[i][2];b.className=ok?'ok':'no';if(ok)sc++;setTimeout(function(){i++;r()},650)};o.appendChild(b)})}r();
<\/script></body></html>`;

function seed() {
  const now = Date.now(), day = 864e5;
  const base = { status:'approved', featured:'', email:'', grades:'', subjectOther:'', idea:'', url:'', appFileId:'', appFileName:'', fileId:'', fileName:'', fileMime:'',
    prompt:'', video:'', coverId:'', imageIds:[], buildSteps:[], useSteps:[], tips:'', adminNote:'', draft:null, editCode:'DEMO01', views:0, likes:0 };
  return { files: { 'demo-app': DEMO_APP }, items: [
    Object.assign({}, base, { id:'demo-1', featured:'yes', createdAt:new Date(now - 2 * day).toISOString(), teacher:'معلم تجريبي (مثال)', subject:'math', stage:'upper', grades:'الخامس',
      title:'تحدي الكسور — لعبة تفاعلية (مثال)', type:'html', tasks:['interactive','quiz'], tools:['claude'], appFileId:'demo-app', appFileName:'fractions.html',
      summary:'لعبة سريعة من 5 أسئلة على جمع الكسور بتغذية راجعة فورية — منتج تجريبي لعرض طريقة عمل المعرض.',
      idea:'مثال توضيحي: طلاب يخطئون في جمع الكسور مختلفة المقامات.', goal:'يجمع الطالب كسرين مختلفي المقام', skill:'جمع الكسور', level:'b', duration:'5 دقائق', impact:'مثال: ارتفاع الإجابات الصحيحة في بطاقة الخروج', verified:'yes', ratings:{ s:{ content:9, pedagogy:9, design:8, ease:10, reuse:9 }, n:2 },
      buildSteps:['فتحت Claude وكتبت برومبت «تطبيق تفاعلي في ملف HTML واحد» من مكتبة البرومبتات.','طلبت تكبير الخط وخلط ترتيب البدائل.','نزّلت الملف ورفعته من «أضف منتجك».'],
      useSteps:['في بداية الحصة كتهيئة لمدة 5 دقائق.','يلعب الطلاب في ثنائيات على الآيباد.','نناقش السؤال الأكثر خطأً.'],
      prompt:'ابنِ لي تطبيقاً تعليمياً تفاعلياً في ملف HTML واحد… (مثال)', views:42, likes:9 }),
    Object.assign({}, base, { id:'demo-2', createdAt:new Date(now - 5 * day).toISOString(), teacher:'معلمة تجريبية (مثال)', subject:'science', stage:'middle',
      title:'مساعد مراجعة العلوم — وكيل Gem (مثال)', type:'agent', tasks:['differentiation','research'], tools:['gemini'], url:'https://gemini.google.com',
      summary:'وكيل يساعد الطلاب على مراجعة وحدة الخلية بأسئلة متدرجة دون إعطاء الإجابات مباشرة — مثال توضيحي.',
      buildSteps:['أنشأت Gem جديداً في Gemini.','نسخت قالب تعليمات الوكيل من المنصة وعدّلته.','رفعت ملف الوحدة.'], useSteps:['يُستخدم واجباً منزلياً للمراجعة قبل الاختبار.'], views:18, likes:4 }),
    Object.assign({}, base, { id:'demo-3', createdAt:new Date(now - 9 * day).toISOString(), teacher:'معلم تجريبي (مثال)', subject:'arabic', stage:'lower',
      title:'برومبت قصة تعليمية بالقيم (مثال)', type:'prompt', tasks:['worksheet','media'], tools:['chatgpt','elevenlabs'],
      summary:'برومبت يكتب قصة قصيرة لطلاب الأولية حول قيمة محددة مع أسئلة فهم — مثال توضيحي.',
      prompt:'اكتب قصة قصيرة (150 كلمة) لطلاب الصف [الصف] عن قيمة [القيمة]، بلغة عربية فصيحة بسيطة، أبطالها أطفال من السعودية، ثم 3 أسئلة فهم و سؤال رأي.',
      useSteps:['أقرأ القصة بصوت مسجل من ElevenLabs.','يجيب الطلاب على الأسئلة في مجموعات.'], views:27, likes:6 }),
    Object.assign({}, base, { id:'demo-4', status:'pending', createdAt:new Date(now - 1 * day).toISOString(), teacher:'معلم تجريبي (مثال)', subject:'english', stage:'american',
      title:'Vocabulary Bingo generator (example)', type:'link', tasks:['interactive'], tools:['gemini'], url:'https://example.com',
      summary:'منتج بانتظار المراجعة — يظهر في لوحة الإدارة فقط (مثال).', views:0, likes:0 })
  ], star: { cur: { teacher:'معلم تجريبي (مثال)', role:'معلم الرياضيات — المرحلة العليا', month:'نوفمبر 2026', productId:'demo-1', title:'',
      reason:'حوّل درس جمع الكسور من تمارين ورقية إلى لعبة تفاعلية قصيرة بتغذية راجعة فورية، فارتفعت مشاركة الطلاب وانخفضت أخطاء توحيد المقامات بوضوح في بطاقة الخروج. هذا نص تجريبي يوضح شكل القسم.',
      points:['منتج أصيل يعالج مشكلة تعلم حقيقية','استُخدم فعلياً مع ثلاثة فصول','شارك طريقة بنائه خطوة بخطوة ليستفيد زملاؤه'], quote:'الذكاء الاصطناعي لم يعلّم طلابي… لكنه منحني وقتاً لأعلّمهم أفضل.' }, hist: [] } };
}
function db() { try { const x = JSON.parse(localStorage.getItem(KEY) || 'null'); if (x && x.items) return x; } catch (e) {} const s = seed(); save(s); return s; }
function save(x) { try { localStorage.setItem(KEY, JSON.stringify(x)); } catch (e) { /* مساحة المتصفح ممتلئة */ } }
const PUB = ['id','featured','createdAt','updatedAt','teacher','subject','subjectOther','stage','grades','title','type','tasks','tools','summary','idea','url',
  'appFileName','fileId','fileName','fileMime','prompt','video','coverId','imageIds','buildSteps','useSteps','tips','views','likes','goal','skill','level','duration','impact','notes','verified'];
function rinfo(r) { const R = r.ratings, n = R && R.n || 0, o = { ratingCount:n, ratingAvg:0, ratingBy:{} }; if (!n) return o; let t = 0;
  Object.keys(RW).forEach(k => { const a = (R.s[k] || 0) / n; o.ratingBy[k] = Math.round(a * 10) / 10; t += RW[k] * a / 5; }); o.ratingAvg = Math.round(t * 10) / 10; return o; }
const pick = (r, f) => { const o = {}; f.forEach(k => { o[k] = r[k]; }); o.hasApp = !!r.appFileId; return Object.assign(o, rinfo(r)); };
const wait = ms => new Promise(r => setTimeout(r, ms));
function starPub(x) {
  const st = x.star || { cur:null, hist:[] };
  const pub = s => { if (!s) return null; const o = Object.assign({}, s); delete o.productId; const r = s.productId && x.items.find(i => i.id === s.productId && i.status === 'approved');
    if (r) Object.assign(o, { productId:r.id, title:o.title || r.title, subject:r.subject, subjectOther:r.subjectOther, stage:r.stage, type:r.type, coverId:r.coverId }); return o; };
  return { cur: pub(st.cur), hist: (st.hist || []).slice(0, 12).map(pub) };
}
const find = (x, id) => { const r = x.items.find(i => i.id === id); if (!r) throw new Error('المنتج غير موجود'); return r; };
const code = () => Array.from({ length:6 }, () => 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 31)]).join('');
function files(x, f, type, base) {
  f = f || {}; const o = Object.assign({ appFileId:'', appFileName:'', fileId:'', fileName:'', fileMime:'', coverId:'', imageIds:[] }, base || {});
  if (f.app && f.app.b64) { const id = 'f' + Date.now() + Math.random().toString(36).slice(2, 5);
    const b = f.app.b64.split(',')[1] || ''; x.files[id] = decodeURIComponent(escape(atob(b))); o.appFileId = id; o.appFileName = f.app.name; }
  if (f.file && f.file.b64) { o.fileId = 'local-file'; o.fileName = f.file.name; o.fileMime = f.file.mime; }
  if (f.cover && f.cover.b64) o.coverId = f.cover.b64; else if (f.removeCover) o.coverId = '';
  if (Array.isArray(f.images)) o.imageIds = f.images.map(im => im.keep || im.b64).filter(Boolean).slice(0, 4);
  if (type === 'html' && !o.appFileId) throw new Error('ارفع ملف التطبيق (.html)');
  if (type === 'file' && !o.fileId) throw new Error('ارفع الملف');
  return o;
}
const FK = ['appFileId','appFileName','fileId','fileName','fileMime','coverId','imageIds'];
const fset = r => { const o = {}; FK.forEach(k => { o[k] = r[k]; }); return o; };

async function handle(action, p) {
  await wait(action === 'submit' || /Update/.test(action) ? 700 : 180);
  const x = db();
  const admin = () => { if (p.adminCode !== 'demo') throw new Error('كود المدير غير صحيح (في الوضع التجريبي: demo)'); };
  const teacher = r => { if (String(p.code || '').toUpperCase() !== r.editCode) throw new Error('كود التعديل غير صحيح (المنتجات التجريبية: DEMO01)'); };
  switch (action) {
    case 'ping': return { ok:true };
    case 'list': return { ok:true, items: x.items.filter(r => r.status === 'approved').map(r => Object.assign(pick(r, ['id','featured','createdAt','teacher','subject','subjectOther','stage','grades','title','type','tasks','tools','summary','url','coverId','views','likes','skill','level','verified']), { hasPrompt: !!r.prompt, prompt: r.type === 'prompt' ? r.prompt : '' })), star: starPub(x) };
    case 'get': { const r = find(x, p.id); if (r.status !== 'approved') return { ok:false, notPublic:true, status:r.status, error:'هذا المنتج غير منشور حالياً' }; return { ok:true, item: pick(r, PUB) }; }
    case 'app': case 'teacherApp': case 'adminApp': {
      const r = find(x, p.id);
      if (action === 'app' && r.status !== 'approved') throw new Error('هذا المنتج غير منشور حالياً');
      if (action === 'teacherApp') teacher(r); if (action === 'adminApp') admin();
      const fid = (p.draft && r.draft && r.draft.appFileId) || r.appFileId;
      return { ok:true, html: x.files[fid] || '<p>—</p>' };
    }
    case 'view': case 'like': { const r = find(x, p.id); const k = action === 'view' ? 'views' : 'likes'; r[k] = Math.max(0, (r[k] || 0) + (Number(p.delta) < 0 ? -1 : 1)); save(x); return { ok:true, value:r[k] }; }
    case 'submit': {
      const d = p.data; const id = 'demo-' + Date.now().toString(36), c = code(), now = new Date().toISOString();
      x.items.unshift(Object.assign({ id, status:'pending', featured:'', createdAt:now, updatedAt:now, views:0, likes:0, adminNote:'', draft:null, editCode:c }, d, files(x, p.files, d.type)));
      save(x); return { ok:true, id, code:c };
    }
    case 'teacherGet': { const r = find(x, p.id); teacher(r); const it = Object.assign(pick(r, PUB.concat(['status','email','adminNote'])), r.draft || {}); delete it.appFileId; return { ok:true, item: it, hasDraft: !!r.draft }; }
    case 'teacherUpdate': {
      const r = find(x, p.id); teacher(r); const d = p.data;
      if (r.status === 'approved') { r.draft = Object.assign({}, d, files(x, p.files, d.type, r.draft ? fset(r.draft) : fset(r))); save(x); return { ok:true, draft:true }; }
      Object.assign(r, d, files(x, p.files, d.type, fset(r)), { status:'pending', draft:null }); save(x); return { ok:true, draft:false };
    }
    case 'adminLogin': admin(); return { ok:true };
    case 'adminList': admin(); return { ok:true, items: x.items.map(r => Object.assign(pick(r, PUB.concat(['status','email','adminNote'])), { draft: r.draft ? Object.assign({}, r.draft, { hasApp: !!r.draft.appFileId }) : null })),
      settings:{ notifyEmail:'demo@example.com', siteUrl: location.href.replace(/[^/]*$/, ''), folderUrl:'' }, star: x.star || { cur:null, hist:[] } };
    case 'adminStar': { admin(); const st = x.star || (x.star = { cur:null, hist:[] });
      if (p.mode === 'set') { const s = p.star || {}; const n = { teacher:String(s.teacher || '').trim(), role:String(s.role || '').trim(), month:String(s.month || '').trim(), productId:String(s.productId || ''),
          title:String(s.title || '').trim(), reason:String(s.reason || '').trim(), quote:String(s.quote || '').trim(), points:(Array.isArray(s.points) ? s.points : String(s.points || '').split('\n')).map(v => String(v).trim()).filter(Boolean).slice(0, 8), at:new Date().toISOString() };
        if (!n.teacher) throw new Error('اكتب اسم المعلم'); if (!n.month) throw new Error('اكتب الشهر'); if (!n.reason) throw new Error('اكتب شرح المشروع وسبب الاختيار');
        if (n.productId) find(x, n.productId);
        if (st.cur && st.cur.month !== n.month) st.hist.unshift(st.cur); st.cur = n; }
      else if (p.mode === 'archive') { if (st.cur) st.hist.unshift(st.cur); st.cur = null; }
      else if (p.mode === 'delHist') { st.hist.splice(Number(p.index), 1); }
      save(x); return { ok:true, star: st }; }
    case 'adminSet': { admin(); const r = find(x, p.id); if (p.status === 'approved' && r.draft) { Object.assign(r, r.draft); r.draft = null; } r.status = p.status; r.adminNote = p.note || ''; save(x); return { ok:true }; }
    case 'rate': { const r = find(x, p.id); const sc = p.scores || {}; if (Object.keys(RW).some(k => !(sc[k] >= 1 && sc[k] <= 5))) throw new Error('قيّم كل المعايير من 1 إلى 5');
      r.ratings = r.ratings || { s:{}, n:0 }; Object.keys(RW).forEach(k => { r.ratings.s[k] = (r.ratings.s[k] || 0) + sc[k]; }); r.ratings.n++; save(x); return Object.assign({ ok:true }, rinfo(r)); }
    case 'adminVerify': { admin(); find(x, p.id).verified = p.verified ? 'yes' : ''; save(x); return { ok:true }; }
    case 'adminFeature': { admin(); find(x, p.id).featured = p.featured ? 'yes' : ''; save(x); return { ok:true }; }
    case 'adminDelete': { admin(); x.items = x.items.filter(r => r.id !== p.id); save(x); return { ok:true }; }
    case 'adminDraft': { admin(); const r = find(x, p.id); if (r.draft && p.apply) Object.assign(r, r.draft); r.draft = null; save(x); return { ok:true }; }
    case 'adminUpdate': { admin(); const r = find(x, p.id); Object.assign(r, p.data, files(x, p.files, p.data.type, fset(r))); save(x); return { ok:true }; }
    case 'adminResetCode': { admin(); const r = find(x, p.id); r.editCode = code(); save(x); return { ok:true, code:r.editCode }; }
    case 'adminSettings': admin(); return { ok:true, settings:{ notifyEmail:p.notifyEmail || '', siteUrl:'', folderUrl:'' } };
    default: return { ok:false, error:'unknown action' };
  }
}
window.AI_DEMO = { handle, reset(){ localStorage.removeItem(KEY); } };
})();
