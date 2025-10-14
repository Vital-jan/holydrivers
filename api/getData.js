function doGet(e) {
  const MONTH_SHEET = e.parameter.month || "";
  const USER = e.parameter.user || "";

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(MONTH_SHEET);
  if (!sheet) {
    return HtmlService.createHtmlOutput(`Аркуш '${MONTH_SHEET}' не знайдено`);
  }

  const values = sheet.getDataRange().getValues();

  function formatValue(val) {
    if (val instanceof Date) {
      const d = val.getDate().toString().padStart(2, "0");
      const m = (val.getMonth() + 1).toString().padStart(2, "0");
      return `${d}.${m}`;
    }
    return val;
  }

  // Перша колонка — години
  const leftCol = values.map((row) => formatValue(row[0]));

  // Інші колонки — фільтруємо значення
  const rightCols = values.map((row, rowIndex) => {
    return row.slice(1).map((cell) => {
      const val = formatValue(cell);
      // Перші два рядки — без змін
      if (rowIndex < 2) return val;
      // Дозволені значення
      const allowed = ["вільно", "іспит", USER];
      if (
        allowed.some(
          (a) => val && val.toString().toLowerCase() === a.toLowerCase()
        )
      ) {
        return val;
      }
      return ""; // решта — порожньо
    });
  });

  // Формуємо HTML
  let html = `
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        .container { display: flex; flex-direction: row; gap: 10px; }
        .left { min-width: 120px; }
        .right { overflow-x: auto; padding-left: 10px; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #ccc; padding: 4px; white-space: nowrap; }

        /*фіксована висота усіх рядків*/
        tr td{
          height: 25px;
          max-height: 25px;
          overflow: hidden;
        }
        /* центрування перших двох рядків */
        tr:nth-child(1) td, tr:nth-child(2) td {
         text-align: center;
        }
        /* фіксована висота рядків годин перерви */
        tr:nth-child(5) td, tr:nth-child(8) td,  tr:nth-child(11) td, tr:nth-child(14) td {
         height: 10px;
        }

      </style>
    </head>
    <body>
      <div class="container">
        <div class="left">
          <table>
            <tbody>
  `;

  // Ліва таблиця (години)
  for (let i = 0; i < leftCol.length; i++) {
    html += `<tr><td>${leftCol[i]}</td></tr>`;
  }

  html += `
            </tbody>
          </table>
        </div>
        <div class="right">
          <table>
            <tbody>
  `;

  // Права таблиця (інші колонки)
  for (let i = 0; i < rightCols.length; i++) {
    html += "<tr>";
    for (let j = 0; j < rightCols[i].length; j++) {
      html += `<td>${rightCols[i][j]}</td>`;
    }
    html += "</tr>";
  }

  html += `
            </tbody>
          </table>
        </div>
      </div>
    </body>
  </html>
  `;

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle("Розклад")
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
