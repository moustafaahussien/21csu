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
    Sheet.prototype.setRightToLeft = function () { };

    const ss = {
      getSheetByName: n => sheets[n] || null,
      insertSheet: n => (sheets[n] = new Sheet(n))
    };
    const pad = n => String(n).padStart(2, '0');
    const env = {
      SpreadsheetApp: { getActiveSpreadsheet: () => ss },
      Session: { getScriptTimeZone: () => 'Asia/Riyadh' },
      Utilities: {
        getUuid: () => 'xxxxxxxx-xxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16)),
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
      _sheets: sheets
    };
    return env;
  }

  function loadScript(codeText) {
    const env = makeEnv();
    const names = ['SpreadsheetApp', 'Session', 'Utilities', 'LockService', 'ContentService', 'Logger'];
    const fn = new Function(names.join(','), codeText + '\nreturn { doGet: doGet, setup: setup, route_: route_, readTable_: readTable_, upsert_: upsert_, readSettings_: readSettings_, writeSettings_: writeSettings_ };');
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
