
<?php

// Отримуємо список навчальних матеріалів
require_once __DIR__ . "/lessons.php";

// Назву папки передає index.php конкретного матеріалу
$lessonUrl = $lessonUrl ?? "";

// Шукаємо відповідний матеріал
$currentLesson = null;

foreach ($lessons as $lesson) {
    if ($lesson["url"] === $lessonUrl) {
        $currentLesson = $lesson;
        break;
    }
}

// Якщо матеріал не знайдено — 404
if ($currentLesson === null) {
    http_response_code(404);
    exit("Матеріал не знайдено");
}

// SEO
$page = "lessons";
$title = $currentLesson["title"] . " | HolyDrivers";
$description = $currentLesson["description"];

$canonical = "https://holydrivers.com.ua/lessons/"
           . rawurlencode($lessonUrl) . "/";

$robots = "index,follow";

// Підключаємо загальний head сайту
include __DIR__ . "/../head.php";
?>
