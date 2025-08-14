const express = require("express");
const app = express();

// Парсинг JSON
app.use(express.json());

// Основний маршрут API
app.get("api", (req, res) => {
  res.json({ message: "Привіт! API на Express працює на порту 3000" });
});

// Додатковий маршрут
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello world!" });
});

// Слухаємо порт 3000 (більше 1024, root не потрібен)
app.listen(3000, "127.0.0.1", () => {
  console.log("Backend running on http://127.0.0.1:3000");
});
