/* محاكي خفيف لبيئة Google Apps Script — يُستخدم في «الوضع التجريبي» وفي الاختبارات فقط.
   يشغّل نفس ملف kpi-script.gs الحقيقي بدون إنترنت وبدون Google Sheet. */
(function (root) {
  function makeEnv() {
    const sheets = {};
    function Sheet(name) {
      this.name = name; this.data = [];
    }
    Sheet.prototype.getLastRow = function () {
      let n = this.data.length;
      while (n > 0 && this.data[n - 1].every(v => v === '' || v === null || v === undefined)) n--;
      return n;
    };
    Sheet.prototype.getRange = function (r, c, nr, nc) {
      const sh = this; nr = nr || 1; nc = nc || 1;
      const rng = {
        setValues(vals) {
          for (let i = 0; i < nr; i++) {
            if (!sh.data[r - 1 + i]) sh.data[r - 1 + i] = [];
            for (let j = 0; j < nc; j++) {
              let v = vals[i][j];
              if (typeof v === 'string' && v.charAt(0) === "'") v = v.slice(1);
              sh.data[r - 1 + i][c - 1 + j] = v;
            }
          }
          return rng;
        },
        getValues() {
          const out = [];
          for (let i = 0; i < nr; i++) {
            const row = sh.data[r - 1 + i] || [];
            const o = [];
            for (let j = 0; j < nc; j++) { const v = row[c - 1 + j]; o.push(v === undefined || v === null ? '' : v); }
            out.push(o);
          }
          return out;
        },
        setFontWeight() { return rng; }, setBackground() { return rng; }, setNumberFormat() { return rng; }
      };
      return rng;
    };
    Sheet.prototype.appendRow = function (row) {
      const n = this.getLastRow();
      this.data.length = n;
      this.data.push(row.map(v => (typeof v === 'string' && v.charAt(0) === "'") ? v.slice(1) : v));
    };
    Sheet.prototype.deleteRow = function (r) { this.data.splice(r - 1, 1); };
    Sheet.prototype.clearContents = function () { this.data = []; };
    Sheet.prototype.setFrozenRows = function () { };
    Sheet.prototype.getMaxColumns = function () { return 60; };
    Sheet.prototype.insertColumnsAfter = function () {};
    Sheet.prototype.getLastColumn = function () { return this.data.reduce((m, r) => Math.max(m, r.length), 0); };
    Sheet.prototype.setName = function (n) { delete sheets[this.name]; this.name = n; sheets[n] = this; return this; };
    Sheet.prototype.setRightToLeft = function () { };

    const ss = {
      getSheetByName: n => sheets[n] || null,
      insertSheet: n => (sheets[n] = new Sheet(n)),
      getSheets: () => Object.keys(sheets).map(k => sheets[k]),
      deleteSheet: sh => { delete sheets[sh.name]; }
    };
    const pad = n => String(n).padStart(2, '0');
    const propStore = {}, cacheStore = {};
    const props = { getProperty: k => (propStore[k] === undefined ? null : propStore[k]), setProperty: (k, v) => { propStore[k] = String(v); return props; },
      deleteProperty: k => { delete propStore[k]; return props; }, getProperties: () => Object.assign({}, propStore) };
    const env = {
      SpreadsheetApp: { getActiveSpreadsheet: () => ss },
      Session: { getScriptTimeZone: () => 'Asia/Riyadh' },
      Utilities: {
        getUuid: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, () => (Math.random() * 16 | 0).toString(16)),
        // تجزئة تجريبية فقط (ليست SHA-256 حقيقية) — تكفي لتشغيل منطق الأكواد المشفّرة في الوضع التجريبي
        DigestAlgorithm: { SHA_256: 'SHA_256' }, Charset: { UTF_8: 'UTF_8' },
        computeDigest: (alg, str) => { let h1 = 0x811c9dc5, h2 = 0x01000193; for (let i = 0; i < str.length; i++) { h1 = Math.imul(h1 ^ str.charCodeAt(i), 16777619); h2 = Math.imul(h2 + str.charCodeAt(i), 2246822507); } return [h1 >>> 0, h2 >>> 0, str.length]; },
        base64Encode: v => (Array.isArray(v) ? v.map(n => n.toString(36)).join('.') : String(v)),
        sleep: () => {},
        formatDate: (d, tz, f) => {
          const s = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
          if (f === 'yyyy-MM') return s.slice(0, 7);
          if (f === 'yyyy-MM-dd') return s;
          return s + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
        }
      },
      LockService: { getScriptLock: () => ({ waitLock() { }, releaseLock() { } }) },
      ContentService: {
        MimeType: { JAVASCRIPT: 'js', JSON: 'json' },
        createTextOutput: t => ({ text: t, setMimeType() { return this; }, getContent() { return t; } })
      },
      Logger: { log: () => { } },
      PropertiesService: { getScriptProperties: () => props },
      CacheService: { getScriptCache: () => ({ get: k => (cacheStore[k] === undefined ? null : cacheStore[k]), put: (k, v) => { cacheStore[k] = String(v); }, remove: k => { delete cacheStore[k]; } }) },
      _sheets: sheets
    };
    return env;
  }

  function loadScript(codeText, env) {
    env = env || makeEnv();
    const names = ['SpreadsheetApp', 'Session', 'Utilities', 'LockService', 'ContentService', 'Logger', 'PropertiesService', 'CacheService'];
    const fn = new Function(names.join(','), codeText + '\nreturn { doGet: doGet, setup: setup, route_: route_, readTable_: readTable_, upsert_: upsert_, readSettings_: readSettings_, writeSettings_: writeSettings_, newId_: newId_ };');
    const api = fn.apply(null, names.map(n => env[n]));
    api._env = env;
    // استدعاء يحاكي طلب JSONP
    api.call = function (params) {
      const out = api.doGet({ parameter: params });
      return JSON.parse(out.getContent());
    };
    return api;
  }

  const lib = { loadScript };
  if (typeof module !== 'undefined' && module.exports) module.exports = lib;
  else root.GasMock = lib;
})(this);
