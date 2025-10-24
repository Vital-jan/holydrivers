function transformAndSortSchedule() {
  const TURBOSMS_TOKEN = ""; // заміни своїм
  const TURBOSMS_SENDER = "Holydrivers"; // підключений відправник у TurboSMS
  const TESTMODE = false; // true = всі SMS йдуть тільки на myPhone
  const myPhone = "+380632209770"; // тестовий номер для відладки
  const myEmail = "vitaljan@gmail.com"; // куди відправляти звіт

  // Отримання даних, трансформаця та надсилання sms

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const SHEET_NAME_SOURCE = getTomorrowMonthName();
  const SHEET_NAME_GROUP = "Група";
  const sourceSheet = spreadsheet.getSheetByName(SHEET_NAME_SOURCE);
  const groupSheet = spreadsheet.getSheetByName(SHEET_NAME_GROUP);

  if (!sourceSheet) {
    console.log(`Аркуш з назвою '${SHEET_NAME_SOURCE}' не знайдено`);
    sendErrorByEmail(`Аркуш з назвою '${SHEET_NAME_SOURCE}' не знайдено`);
  }

  if (!groupSheet) {
    console.log(`Аркуш з назвою '${SHEET_NAME_GROUP}' не знайдено`);
    sendErrorByEmail(`Аркуш з назвою '${SHEET_NAME_GROUP}' не знайдено`);
  }

  // Завтра
  const now = new Date(); // сьогоднішня дата та час
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1); // додаємо 1 день
  tomorrow.setHours(0, 0, 0, 0); // скидаємо час на 00:00:00

  const groupData = groupSheet.getDataRange().getValues();

  const phoneMap = groupData
    .slice(1) // пропускаємо заголовок
    .filter((row) => row[1]) // ігноруємо рядки без телефону
    .reduce((acc, row) => {
      const nameText = String(row[0]).trim();

      // Нормалізація телефону: залишаємо тільки цифри
      let phone = String(row[1]).replace(/\D/g, "");

      // Якщо починається з 0 -> додаємо 38
      if (phone.startsWith("0")) {
        phone = "38" + phone;
      }
      // Якщо ще не починається з 38 -> додаємо
      else if (!phone.startsWith("38")) {
        phone = "38" + phone;
      }

      // Перевірка довжини (12 символів)
      if (phone.length === 12) {
        acc[nameText] = phone;
      } else {
        console.log(`Невірний номер для '${name}': ${row[1]}`);
      }

      return acc;
    }, {});

  const data = sourceSheet.getDataRange().getValues();
  if (data.length < 3) {
    console.log("Недостатньо рядків у таблиці.");
    sendErrorByEmail(`Недостатньо рядків у таблиці`);
  }

  const dates = data[1].slice(1);

  function isSameDate(d1, d2) {
    // Перетворюємо на об'єкти Date, якщо потрібно
    const date1 =
      d1 instanceof Date
        ? new Date(d1.getFullYear(), d1.getMonth(), d1.getDate())
        : new Date(d1);
    const date2 =
      d2 instanceof Date
        ? new Date(d2.getFullYear(), d2.getMonth(), d2.getDate())
        : new Date(d2);

    // Порівнюємо тільки рік, місяць, день
    return date1.toDateString() === date2.toDateString();
  }

  const uniqueRecords = {};

  for (let i = 2; i < data.length; i++) {
    const time = data[i][0];
    if (!time) continue;

    for (let j = 1; j < data[i].length; j++) {
      const name = String(data[i][j]).trim();
      if (!name || /немає запису/i.test(name)) continue;

      let dateObjFromSheet = dates[j - 1];
      let dateObj;

      if (dateObjFromSheet instanceof Date) {
        dateObj = new Date(dateObjFromSheet);
      } else {
        const parts = String(dateObjFromSheet).split(".");
        if (parts.length !== 2) continue; // некоректна дата
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = new Date().getFullYear(); // поточний рік
        dateObj = new Date(year, month, day);
      }

      // Обробка часу
      const timePart = String(time).split("-")[0].trim();
      const [hour, minute] = timePart.split(":").map(Number);
      dateObj.setHours(hour || 0, minute || 0, 0, 0);

      if (!isSameDate(dateObj, tomorrow)) continue;

      const phone = phoneMap[name] || "";

      if (!phone || !/^38\d{10}$/.test(phone)) continue; // пропускаємо без валідного телефону

      const formattedDate = Utilities.formatDate(
        dateObj,
        Session.getScriptTimeZone(),
        "dd.MM"
      );

      if (!uniqueRecords[name] || dateObj < uniqueRecords[name].dateObj) {
        uniqueRecords[name] = {
          name,
          phone,
          formattedDate,
          time: timePart,
          dateObj,
        };
      }
    }
  }

  const result = [["Ім'я", "Телефон", "Дата", "Час", "ДатаЧас"]];
  for (const key in uniqueRecords) {
    const rec = uniqueRecords[key];
    result.push([
      rec.name,
      rec.phone,
      rec.formattedDate,
      rec.time,
      rec.dateObj,
    ]);
  }

  if (result.length < 2) {
    sendErrorByEmail("SMS не надіслані", "Заняття не заплановані");
    return;
  }

  let reportData = [["ПІБ", "Дата", "Час", "Телефон", "Статус"]];

  if (result.length > 1) {
    for (let i = 1; i < result.length; i++) {
      const phone = TESTMODE ? myPhone : result[i][1]; // Телефон у другій колонці
      const nameText = result[i][0].trim().split(/\s+/)[1]; // Ім'я
      const dateText = result[i][2]; // Дата (третя колонка)
      const timeText = result[i][3]; // Час (четверта колонка)

      if (!phone) continue; // Пропускаємо якщо телефону немає

      const messageText = `Вітаю, ${nameText}! Нагадую: урок водіння на завтра, ${dateText} о ${timeText}`;

      const payload = {
        recipients: [phone],
        sms: {
          sender: TURBOSMS_SENDER,
          text: messageText,
        },
      };

      const options = {
        method: "post",
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + TURBOSMS_TOKEN,
        },
        payload: JSON.stringify(payload),
      };

      try {
        const response = UrlFetchApp.fetch(
          "https://api.turbosms.ua/message/send.json",
          options
        );
        const code = JSON.parse(response.getContentText()).response_code;
        const status =
          code == "800.0"
            ? "Ok"
            : JSON.parse(response.getContentText()).response_status;

        Logger.log(JSON.parse(response.getContentText()));
        console.log(response.getContentText());
        reportData.push([
          result[i][0],
          dateText,
          timeText,
          result[i][1],
          status,
        ]);
      } catch (e) {
        Logger.log(`Помилка при відправці SMS на ${phone}: ${e}`);
        reportData.push([
          result[i][0],
          dateText,
          timeText,
          result[i][1],
          "Збій надсилання",
        ]);
      }
    }
  }

  sendReportByEmail(reportData);

  return;

  //=============================================

  /**
   * Звіт на email
   */
  function sendErrorByEmail(errorMessage, subjectText) {
    try {
      MailApp.sendEmail({
        to: myEmail,
        subject: subjectText ? subjectText : "Помилка надсилання SMS",
        htmlBody: `<p>${errorMessage}</p>`,
      });
    } catch (err) {
      console.log("Помилка надсилання емейл" + err);
    }
  }

  function sendReportByEmail(reportData) {
    let html = `<h3>Звіт про надсилання SMS</h3>`;
    html += `<table border="1" cellspacing="0" cellpadding="5" style="border-collapse:collapse;">`;

    reportData.forEach((row) => {
      const [name, phone, time, text, status, color] = row;
      html += `<tr>
              <td>${name}</td>
              <td>${phone}</td>
              <td>${time}</td>
              <td>${text}</td>
              <td style="color:${color}">${status}</td>
            </tr>`;
    });

    html += `</table>`;

    MailApp.sendEmail({
      to: myEmail,
      subject: "Звіт про надсилання SMS",
      htmlBody: html,
    });
  }

  /**
   * Визначення назви наступного місяця
   */
  function getTomorrowMonthName() {
    const now = new Date();
    now.setDate(now.getDate() + 1);

    const monthNames = [
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
    return monthNames[now.getMonth()];
  }
}
