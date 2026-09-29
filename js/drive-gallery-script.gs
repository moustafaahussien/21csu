/* ==========================================================================
   سكريبت جوجل آبس (Google Apps Script) — يخدم موقع وحدة مهارات القرن 21
   ---------------------------------------------------------------------
   يعمل بوضعين، حسب الرابط الذي يطلبه الموقع:

   1) وضع "المعرض" (الافتراضي):  ?folderId=ID
      فولدر صفحة  ←  فولدرات فعاليات  ←  صور/فيديوهات

   2) وضع "الإنجازات":  ?mode=achievements&folderId=ID
      فولدر قسم (مثل المسابقات)  ←  فولدر لكل إنجاز (اسمه = اسم الإنجاز)
        ← صور وفيديوهات الإنجاز + ملف نصي .txt فيه نبذة عنه

   لا يحتاج أي مفتاح API أو مشروع Google Cloud.

   طريقة التركيب / التحديث:
   1) افتح https://script.google.com ← مشروعك الحالي.
   2) امسح كل الكود القديم، والصق هذا الكود كاملاً.
   3) Deploy ← Manage deployments ← ✏️ (تعديل النشر الحالي)
      ← Version: New version ← Deploy.
      (بهذه الطريقة يبقى رابط /exec نفسه ولا تغيّره في أي صفحة).
   4) عند أول تشغيل قد يطلب أذونات — وافق (هذا سكريبتك أنت).

   ملاحظة: فولدرات الصور لازم تكون مشاركة "Anyone with the link" (Viewer)
   حتى تظهر الصور في المتصفح. أما الملفات النصية فيقرؤها السكريبت بصلاحياتك.
   ========================================================================== */

function doGet(e) {
  var callback = e.parameter.callback;   // موجود = المتصفح بيطلب JSONP (تجاوز مشكلة CORS)
  var folderId = e.parameter.folderId;
  var mode = e.parameter.mode;

  if (!folderId) {
    return output({ error: "missing folderId" }, callback);
  }
  try {
    if (mode === "achievements") {
      return output({ items: listAchievements(folderId) }, callback);
    }
    return output({ files: listGallery(folderId) }, callback);
  } catch (err) {
    return output({ error: String(err) }, callback);
  }
}

/* ---------- وضع المعرض: فولدر صفحة ← فولدرات فعاليات ← وسائط ---------- */
function listGallery(folderId) {
  var pageFolder = DriveApp.getFolderById(folderId);
  var items = [];
  var eventFolders = pageFolder.getFolders();

  while (eventFolders.hasNext()) {
    var eventFolder = eventFolders.next();
    var files = eventFolder.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      var mime = file.getMimeType();
      var isImage = mime.indexOf("image/") === 0;
      var isVideo = mime.indexOf("video/") === 0;
      if (!isImage && !isVideo) continue;

      items.push({
        id: file.getId(),
        type: isVideo ? "video" : "photo",
        caption: (file.getDescription() || "").trim() || eventFolder.getName(),
        created: file.getDateCreated().getTime()
      });
    }
  }
  items.sort(function (a, b) { return a.created - b.created; });
  return items;
}

/* ---------- وضع الإنجازات: فولدر قسم ← فولدر لكل إنجاز ---------- */
function listAchievements(folderId) {
  var catFolder = DriveApp.getFolderById(folderId);
  var out = [];
  var folders = catFolder.getFolders();

  while (folders.hasNext()) {
    var f = folders.next();
    var media = [];
    var texts = [];
    var files = f.getFiles();

    while (files.hasNext()) {
      var file = files.next();
      var mime = file.getMimeType();
      var name = file.getName();

      if (mime.indexOf("image/") === 0 || mime.indexOf("video/") === 0) {
        media.push({
          id: file.getId(),
          name: name,
          type: mime.indexOf("video/") === 0 ? "video" : "photo",
          caption: (file.getDescription() || "").trim()
        });
      } else if (mime.indexOf("text/") === 0 || /\.txt$/i.test(name)) {
        var body = "";
        try { body = file.getBlob().getDataAsString("UTF-8"); } catch (err) { body = ""; }
        texts.push({ name: name, text: body.substring(0, 20000) });
      }
    }

    out.push({
      id: f.getId(),
      name: f.getName(),
      created: f.getDateCreated().getTime(),
      media: media,
      texts: texts
    });
  }
  return out;   // الترتيب والتنسيق يتمّان في الموقع
}

/* لو الطلب فيه callback (من كود الموقع عبر JSONP) يرجّع JavaScript قابل للتنفيذ
   مباشرة، وهذا يتجاوز قيود CORS. فتح الرابط يدويًا في المتصفح (بدون callback)
   يرجّع JSON عادي مقروء، وهذا مفيد أثناء الفحص اليدوي. */
function output(obj, callback) {
  var json = JSON.stringify(obj);
  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
