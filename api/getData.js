function doGet(e) {
  var params = e && e.parameter ? e.parameter : {};
  var USER_ID = String(
    params.user || params.user_id || params.USER || params.USER_ID || ""
  ).trim();

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

  const now = new Date();
  const currentIdx = now.getMonth();
  const currentYear = now.getFullYear();
  const nextIdx = (currentIdx + 1) % 12;
  const nextYear = currentIdx === 11 ? currentYear + 1 : currentYear;

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  function fmt(val) {
    if (val instanceof Date) {
      const d = String(val.getDate()).padStart(2, "0");
      const m = String(val.getMonth() + 1).padStart(2, "0");
      return `${d}.${m}`;
    }
    return val;
  }

  // нормалізація заголовків
  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/_/g, "");
  }

  // шукаємо ПІБ у "Група" (A="Зарезервовано", B="User_ID")
  function findFullNameByUserId(userId) {
    if (!userId) return "";
    const sh = ss.getSheetByName("Група");
    if (!sh) return "";

    const values = sh.getDataRange().getValues();
    if (!values.length) return "";

    const header = values[0].map(norm);
    // шукаємо індекси колонок за заголовками
    let idxName = header.indexOf("зарезервовано");
    let idxId = header.indexOf("user_id");

    // fallback, якщо заголовків нема/інші
    if (idxName === -1) idxName = 0; // A
    if (idxId === -1) idxId = 1; // B

    // припускаємо, що перший рядок — заголовки; якщо їх нема — просто теж почнемо з 1, це безпечно
    for (let r = 1; r < values.length; r++) {
      const row = values[r];
      const idCell = row[idxId] != null ? String(row[idxId]).trim() : "";
      if (idCell && idCell.toLowerCase() === userId.toLowerCase()) {
        const nameCell =
          row[idxName] != null ? String(row[idxName]).trim() : "";
        // приберемо подвійні/кінцеві пробіли всередині ПІБ
        return nameCell.replace(/\s+/g, " ").trim();
      }
    }
    return "";
  }

  function buildMonthPayload(sheetName, year, userFullName) {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return null;

    const values = sheet.getDataRange().getValues();
    const leftCol = values.map((row) => fmt(row[0]));

    const rightCols = values.map((row, rowIndex) =>
      row.slice(1).map((cell) => {
        const val = fmt(cell);
        if (rowIndex < 2) return val; // перші 2 рядки як є (дні тижня/дати)
        const allow = ["вільно", "іспит", "звіт"];
        if (userFullName) allow.push(userFullName);
        const v =
          val != null
            ? String(val).replace(/\s+/g, " ").trim().toLowerCase()
            : "";
        return allow.some((a) => v === String(a).toLowerCase()) ? val : "";
      })
    );

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

  // діагностика за запитом ?debug=1
  if (String(params.debug || "") === "1") {
    out.receivedParams = params;
  }

  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(
    ContentService.MimeType.JSON
  );
}
