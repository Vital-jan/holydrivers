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

function getTotalHoursByUser(userFullName) {
  // підрахунок загальної кількості годин
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName("Заняття");
  if (!sh) throw new Error('Аркуш "Заняття" не знайдено');

  const COL_NAME = 1; // A: ПІБ
  const COL_HOURS = 3; // C: Годин
  const HEADER_ROWS = 1;

  // останній заповнений рядок саме по колонці ПІБ
  const lastRow = sh
    .getRange(sh.getMaxRows(), COL_NAME)
    .getNextDataCell(SpreadsheetApp.Direction.UP)
    .getRow();

  if (lastRow <= HEADER_ROWS) return 0;

  const numRows = lastRow - HEADER_ROWS;
  const data = sh
    .getRange(HEADER_ROWS + 1, 1, numRows, Math.max(COL_NAME, COL_HOURS))
    .getValues();

  let sum = 0;
  for (const row of data) {
    const name = String(row[COL_NAME - 1] || "").trim();
    if (name === userFullName) {
      const hours = row[COL_HOURS - 1];
      const val =
        typeof hours === "number"
          ? hours
          : parseFloat(String(hours).replace(",", ".")); // на випадок "2,00" як текст
      if (!isNaN(val)) sum += val;
    }
  }
  return sum;
}

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
      "yyyy-MM-dd HH:mm:ss",
    );
    sheet.getRange(LAST_UPDATED_CELL).setValue(refreshTime);
  }
}

function doGet(e) {
  e = e || {};
  var params = e.parameter || {};
  var USER_ID = String(
    params.user || params.user_id || params.USER || params.USER_ID || "",
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
            "yyyy-MM-dd HH:mm:ss",
          )
        : null,
    };

    return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
      ContentService.MimeType.JSON,
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

  // 🚀 Оптимізований пошук ПІБ + maxHours по "Група" з кешем
  // 🚀 Пошук ПІБ + maxHours по "Група" з кешем
  function findUserMetaByUserId(userId) {
    if (!userId)
      return { fullName: "", maxHours: 0, start: null, finish: null };

    const cache = CacheService.getScriptCache();
    const cacheKey = "user_meta_" + String(userId).toLowerCase();
    const cached = cache.get(cacheKey);
    if (cached) {
      const obj = JSON.parse(cached);
      obj.start = obj.start ? new Date(obj.start) : null;
      obj.finish = obj.finish ? new Date(obj.finish) : null;
      return obj;
    }

    const sh = ss.getSheetByName("Група");
    if (!sh) return { fullName: "", maxHours: 0, start: null, finish: null };

    const lastRow = sh.getLastRow();
    if (lastRow < 2)
      return { fullName: "", maxHours: 0, start: null, finish: null };

    // беремо тільки потрібні колонки A:J
    const values = sh.getRange(1, 1, lastRow, 10).getValues(); // A..J
    const header = values[0].map((v) =>
      String(v || "")
        .trim()
        .toLowerCase(),
    );

    const idxUserId = header.indexOf("user_id"); // має бути 2
    const idxMax = header.indexOf("maxhours"); // має бути 9
    const idxStart = header.indexOf("початок");

    const IDX_NAME = 0; // A = ПІБ

    for (let r = 1; r < values.length; r++) {
      const row = values[r];

      const idCell =
        row[idxUserId] != null
          ? String(row[idxUserId]).trim().toLowerCase()
          : "";
      if (idCell && idCell === String(userId).trim().toLowerCase()) {
        const fullName =
          row[IDX_NAME] != null
            ? String(row[IDX_NAME]).replace(/\s+/g, " ").trim()
            : "";

        const rawMax = idxMax !== -1 ? row[idxMax] : 0;
        const maxHours =
          Number(String(rawMax).replace(",", ".").replace(/\s/g, "")) || 0;

        let start = null;

        if (idxStart !== -1) {
          const rawStart = row[idxStart];

          if (rawStart instanceof Date) {
            start = rawStart;
          } else if (rawStart != null && String(rawStart).trim() !== "") {
            const d = new Date(rawStart);
            start = isNaN(d) ? null : d;
          }
        }

        let finish = null;

        if (start) {
          finish = new Date(start.getTime());

          const day = finish.getDate();
          finish.setMonth(finish.getMonth() + 6);

          // захист від 31 → короткий місяць (лютий, квітень тощо)
          if (finish.getDate() < day) {
            finish.setDate(0); // останній день попереднього місяця
          }
        }

        const result = { fullName, maxHours, start, finish };
        cache.put(cacheKey, JSON.stringify(result), 300); // 5 хв

        return result;
      }
    }

    return { fullName: "", maxHours: 0, start: null, finish: null };
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

        if (text === "ТО") {
          return "&#128736;&#65039;"; // 🛠️
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

  const userMeta = findUserMetaByUserId(USER_ID);
  const userFullName = userMeta.fullName;
  const userMaxHours = userMeta.maxHours;
  const currentData = buildMonthPayload(
    MONTH_NAMES[currentIdx],
    currentYear,
    userFullName,
  );
  const nextData = buildMonthPayload(
    MONTH_NAMES[nextIdx],
    nextYear,
    userFullName,
  );
  const totalHoursByUser = getTotalHoursByUser(userFullName);
  const startDate = userMeta.start;
  const finishDate = userMeta.finish;

  const tz = Session.getScriptTimeZone();

  const start = startDate
    ? Utilities.formatDate(startDate, tz, "yyyy-MM-dd")
    : null;

  const finish = finishDate
    ? Utilities.formatDate(finishDate, tz, "yyyy-MM-dd")
    : null;

  const out = {
    user_id: USER_ID,
    user_fullname: userFullName,
    user_maxhours: userMaxHours,
    total_hours: totalHoursByUser,
    current: currentData,
    next: nextData,
    startDate: start,
    finishDate: finish,
  };

  if (String(params.debug || "") === "1") {
    out.receivedParams = params;
  }

  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
