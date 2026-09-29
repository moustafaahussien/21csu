/* ==========================================================================
   عارض معرض جوجل درايف — يجلب الصور والفيديوهات تلقائيًا من فولدر درايف
   عبر سكريبت جوجل آبس (Google Apps Script) بدل Google Cloud ومفتاح API.
   ---------------------------------------------------------------------
   لا يفعل أي شيء إن لم يكن الفولدر ورابط السكريبت معرَّفين في الصفحة، أو
   إن كان الفولدر فارغًا أو الجلب فشل — فتبقى بطاقات "قريبًا" كما كانت.

   الإعداد الكامل (مرة واحدة فقط) موجود في: tools/drive-gallery-script.gs

   الاستخدام (مضاف بالفعل في كل صفحة):
     <script src="js/drive-gallery.js"></script>        من الصفحة الرئيسية
     <script src="../js/drive-gallery.js"></script>      من صفحات البرامج
   ثم من داخل buildBento() الخاصة بكل صفحة:
     if (DRIVE_FOLDER_ID && DRIVE_SCRIPT_URL)
       DriveGallery.tryRender(el, DRIVE_FOLDER_ID, DRIVE_SCRIPT_URL, SPANS, COLORS);

   بنية فولدرات درايف المتوقعة:
     <فولدر الصفحة>  (DRIVE_FOLDER_ID يشير هنا)
       └── <فولدر فعالية 1>
             ├── photo1.jpg
             └── video1.mp4
       └── <فولدر فعالية 2>
             └── ...
   التسمية التوضيحية لكل صورة/فيديو: تُؤخذ من حقل "الوصف" (Description) في
   تفاصيل الملف على درايف إن وُجد، وإلا يُستخدم اسم فولدر الفعالية.

   ملاحظة: فولدر كل صفحة لازم يكون مشاركًا كـ"Anyone with the link" حتى
   تظهر الصور والفيديوهات فعليًا في المتصفح (تفاصيل ذلك في ملف الـ.gs).
   ========================================================================== */
window.DriveGallery = (function () {
  "use strict";

  function esc(v){ return String(v == null ? "" : v).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"); }
  function thumbUrl(id, size){ return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`; }

  async function loadItems(pageFolderId, scriptUrl){
    const sep = scriptUrl.indexOf("?") >= 0 ? "&" : "?";
    const url = scriptUrl + sep + "folderId=" + encodeURIComponent(pageFolderId);
    const res = await fetch(url);
    if (!res.ok) throw new Error("Apps Script HTTP " + res.status);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return (data.files || []).map(f => ({
      id: f.id,
      type: f.type === "video" ? "video" : "photo",
      thumb: thumbUrl(f.id, 800),
      full: thumbUrl(f.id, 1600),
      caption: f.caption || ""
    }));
  }

  function ensureLightbox(){
    let box = document.getElementById("dgLightbox");
    if (box) return box;
    box = document.createElement("div");
    box.id = "dgLightbox";
    box.className = "lightbox";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML = '<button class="x" type="button" aria-label="Close">×</button><figure id="dgFig"></figure>';
    document.body.appendChild(box);
    const fig = box.querySelector("#dgFig"), xBtn = box.querySelector(".x");
    function close(){ box.hidden = true; fig.innerHTML = ""; }
    box.addEventListener("click", e=>{ if (e.target === box || e.target === xBtn) close(); });
    document.addEventListener("keydown", e=>{ if (e.key === "Escape" && !box.hidden) close(); });
    box._open = (item)=>{
      fig.innerHTML = item.type === "video"
        ? `<iframe src="https://drive.google.com/file/d/${item.id}/preview" allow="autoplay" style="width:min(1100px,92vw);height:min(70vh,620px);border:0;border-radius:22px;box-shadow:0 30px 70px -30px rgba(20,23,58,.6)"></iframe>`
        : `<img src="${item.full}" alt="">`;
      const cap = document.createElement("figcaption"); cap.textContent = item.caption || "";
      fig.appendChild(cap);
      box.hidden = false; xBtn.focus();
    };
    return box;
  }

  const ICONS = {
    photo:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M21 16l-5-5-8 8"/>',
    video:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5z"/>'
  };

  /* يحاول جلب وعرض محتوى فولدر درايف داخل containerEl عبر سكريبت جوجل آبس.
     يُرجع true لو نجح وعرض عناصر حقيقية (والاستدعاء الأصلي لا يحتاج يفعل شيء آخر)،
     أو false لو الإعدادات ناقصة أو الفولدر فارغ أو حدث خطأ (فتبقى بطاقات "قريبًا"). */
  async function tryRender(containerEl, folderId, scriptUrl, spans, colors){
    if (!containerEl || !folderId || !scriptUrl) return false;
    let items;
    try { items = await loadItems(folderId, scriptUrl); } catch(e){ return false; }
    if (!items.length) return false;

    const SPANS = (spans && spans.length) ? spans : [6,6,3,6,3];
    const COLORS = (colors && colors.length) ? colors : ["#6D4BFF","#FF4D8D","#16B8E0","#FF9A1F","#10C38B"];
    ensureLightbox();

    containerEl.innerHTML = items.map((it,i)=>{
      const span = SPANS[i % SPANS.length], c = COLORS[i % COLORS.length];
      return `
        <button class="b-tile" type="button" data-i="${i}" style="--span:${span};--c:${c}">
          ${it.thumb ? `<img src="${esc(it.thumb)}" alt="" loading="lazy">` : `<span class="gorb" style="--sz:64px"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[it.type]}</svg></span>`}
          ${it.type === "video" ? `<span class="play"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONS.video}</svg></span>` : ""}
          ${it.caption ? `<span class="cap">${esc(it.caption)}</span>` : ""}
        </button>`;
    }).join("");

    const box = document.getElementById("dgLightbox");
    containerEl.querySelectorAll("button.b-tile").forEach(b=>{
      b.addEventListener("click", ()=> box._open(items[+b.dataset.i]));
    });
    return true;
  }

  return { tryRender };
})();
