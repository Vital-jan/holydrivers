const MONTH_NAMES = [
  "Січень",
  "Лютий",
  "Березень",
  "Квітень",
  "Травень",
  "Червень",
  "Липень",
  "Серпень",
  "Вересень",
  "Жовтень",
  "Листопад",
  "Грудень",
];

function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  const LAST_UPDATED_CELL = "A1";
  const now = new Date();
  const currentIdx = now.getMonth();
  const nextIdx = (currentIdx + 1) % 12;

  if (
    sheet.getName() == MONTH_NAMES[currentIdx] ||
    sheet.getName() == MONTH_NAMES[nextIdx]
  ) {
    const refreshTime = Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      "yyyy-MM-dd HH:mm:ss"
    );
    sheet.getRange(LAST_UPDATED_CELL).setValue(refreshTime);
  }
}

function doGet(e) {
  e = e || {};
  var params = e.parameter || {};
  var USER_ID = String(
    params.user || params.user_id || params.USER || params.USER_ID || ""
  ).trim();

  // mode == "getdata" або null - повертаємо дані таблиці;
  // mode == "getlastupdate" - повертаємо час останнього редагування таблиці
  var mode = (params.mode || "getdata").toLowerCase();

  const now = new Date();
  const currentIdx = now.getMonth();
  const currentYear = now.getFullYear();
  const nextIdx = (currentIdx + 1) % 12;
  const nextYear = currentIdx === 11 ? currentYear + 1 : currentYear;

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ---- ШВИДКИЙ РЕЖИМ: тільки lastUpdate ----
  if (mode === "getlastupdate") {
    const LAST_UPDATED_CELL = "A1";
    let values = [];

    const curSheet = ss.getSheetByName(MONTH_NAMES[currentIdx]);
    if (curSheet) {
      const v = curSheet.getRange(LAST_UPDATED_CELL).getValue();
      if (v) values.push(v);
    }

    const nextSheet = ss.getSheetByName(MONTH_NAMES[nextIdx]);
    if (nextSheet) {
      const v = nextSheet.getRange(LAST_UPDATED_CELL).getValue();
      if (v) values.push(v);
    }

    let maxDate = null;
    if (values.length > 0) {
      const dates = values
        .map(function (val) {
          if (val instanceof Date) return val;
          const d = new Date(val);
          return isNaN(d) ? null : d;
        })
        .filter(function (d) {
          return d !== null;
        });

      if (dates.length > 0) {
        maxDate = dates.reduce(function (a, b) {
          return a > b ? a : b; // найсвіжіша
        });
      }
    }

    const payload = {
      lastUpdate: maxDate
        ? Utilities.formatDate(
            maxDate,
            Session.getScriptTimeZone(),
            "yyyy-MM-dd HH:mm:ss"
          )
        : null,
    };

    return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
      ContentService.MimeType.JSON
    );
  }

  // ---- Далі – звичайний режим getdata ----

  function fmt(val) {
    if (val instanceof Date) {
      const d = String(val.getDate()).padStart(2, "0");
      const m = String(val.getMonth() + 1).padStart(2, "0");
      return `${d}.${m}`;
    }
    return val;
  }

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/_/g, "");
  }

  // 🚀 Оптимізований пошук ПІБ по "Група" з кешем
  function findFullNameByUserId(userId) {
    if (!userId) return "";

    const cache = CacheService.getScriptCache();
    const cacheKey = "user_fullname_" + userId.toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached) {
      return cached; // миттєво, без доступу до таблиці
    }

    const sh = ss.getSheetByName("Група");
    if (!sh) return "";

    const lastRow = sh.getLastRow();
    const lastCol = sh.getLastColumn();
    if (lastRow < 1 || lastCol < 1) return "";

    const values = sh.getRange(1, 1, lastRow, lastCol).getValues();
    if (!values.length) return "";

    const header = values[0].map(norm);

    let idxName = header.indexOf("зарезервовано");
    let idxId = header.indexOf("user_id");
    if (idxName === -1) idxName = 0;
    if (idxId === -1) idxId = 2;

    for (let r = 1; r < values.length; r++) {
      const row = values[r];
      const idCell = row[idxId] != null ? String(row[idxId]).trim() : "";
      if (idCell && idCell.toLowerCase() === userId.toLowerCase()) {
        const nameCell =
          row[idxName] != null ? String(row[idxName]).trim() : "";
        const fullName = nameCell.replace(/\s+/g, " ").trim();
        if (fullName) {
          cache.put(cacheKey, fullName, 300); // кешуємо на 5 хвилин
        }
        return fullName;
      }
    }
    return "";
  }

  function buildMonthPayload(sheetName, year, userFullName) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return null;

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow === 0 || lastCol === 0) return null;

    // беремо тільки заповнений діапазон, а не весь лист
    const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();

    const leftCol = values.map((row) => fmt(row[0]));

    const rightCols = values.map((row, rowIndex) => {
      return row.slice(1).map((cell) => {
        const valRaw = fmt(cell);
        const text = valRaw != null ? String(valRaw).trim() : "";

        if (rowIndex < 2) {
          return valRaw;
        }

        if (text === "") {
          return "";
        }

        if (text === "вільно" || text === "Вільно") {
          return "&#128994;"; // 🟢
        }

        if (text === "іспит" || text === "Іспит") {
          return "&#127891;"; // 🎓
        }

        if (text === "звіт" || text === "Звіт") {
          return "&#9940;"; // ⛔
        }

        if (text === "зарезервовано" || text === "Зарезервовано") {
          return "&#9728;&#65039;"; // ☀️
        }

        if (userFullName && text === userFullName) {
          return text;
        }

        return "&#9940;"; // ⛔
      });
    });

    return {
      month: sheetName,
      year,
      user_id: USER_ID,
      user_fullname: userFullName,
      leftCol,
      rightCols,
    };
  }

  const userFullName = findFullNameByUserId(USER_ID);
  const currentData = buildMonthPayload(
    MONTH_NAMES[currentIdx],
    currentYear,
    userFullName
  );
  const nextData = buildMonthPayload(
    MONTH_NAMES[nextIdx],
    nextYear,
    userFullName
  );

  const out = {
    user_id: USER_ID,
    user_fullname: userFullName,
    current: currentData,
    next: nextData,
  };

  if (String(params.debug || "") === "1") {
    out.receivedParams = params;
  }

  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(
    ContentService.MimeType.JSON
  );
}
