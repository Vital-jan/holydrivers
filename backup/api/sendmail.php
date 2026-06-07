<?php
session_start();
header('Content-Type: application/json');

// Ліміт часу між запитами (в секундах)
$time_limit = 30;

// Перевірка методу
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["status" => 405, "message" => "Метод не дозволений"]);
    exit;
}

// Honeypot
if (!empty($_POST['website'])) {
    http_response_code(400);
    echo json_encode(["status" => 400, "message" => "Виявлено спам-бота."]);
    exit;
}

// Обмеження по часу
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (isset($_SESSION['last_submit_time'][$ip])) {
    $elapsed = time() - $_SESSION['last_submit_time'][$ip];
    if ($elapsed < $time_limit) {
        http_response_code(429); // Too Many Requests
        echo json_encode([
            "status" => 429,
            "message" => "Занадто часті запити. Спробуйте через " . ($time_limit - $elapsed) . " сек."
        ]);
        exit;
    }
}
$_SESSION['last_submit_time'][$ip] = time();

// Дані
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');

// Валідація імені
if (!preg_match("/^[А-Яа-яA-Za-zЇїІіЄєҐґ'’\- ]{2,50}$/u", $name)) {
    http_response_code(400);
    echo json_encode(["status" => 400, "message" => "Некоректне ім'я."]);
    exit;
}

// Валідація телефону
if (!preg_match("/^(?=(?:.*\d){10,})[0-9\s\-\(\)\+]+$/", $phone)) {
    http_response_code(400);
    echo json_encode(["status" => 400, "message" => "Некоректний телефон."]);
    exit;
}

// Лист
$to = "vitaljan@gmail.com";
$subject = "Новий клієнт Holydrivers";
$message = "Ім'я: $name\nТелефон: $phone";
$headers = "From: admin@holydrivers.com.ua\r\nReply-To: admin@holydrivers.com.ua\r\n";

// Відправка
if (mail($to, $subject, $message, $headers)) {
    http_response_code(200);
    echo json_encode(["status" => 200, "message" => "Чудово! Інструктор зв'яжеться з Вами
          найближчим часом!"]);
} else {
    http_response_code(500);
    echo json_encode(["status" => 500, "message" => "Не вдалося надіслати повідомлення."]);
}
