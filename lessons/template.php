<!doctype html>
<html lang="uk">
  <?php include "../lessons.php"; $lessonUrl = $_GET["lesson"] ?? "";
  $currentLesson = null;

  <!-- foreach ($lessons as $lesson) {
    if ($lesson["url"] === $lessonUrl) {
        $currentLesson = $lesson;
        break;
    }
}

if (!$currentLesson) {
    http_response_code(404);
    exit("Матеріал не знайдено");
} -->

  <?php foreach ($lessons as $lesson): ?> <?php if ($lesson["url"] ===
  $lessonUrl): ?> <?php $currentLesson = $lesson; ?> <?php break; ?> <?php
  endif; ?> <?php endforeach; ?> <?php if (!$currentLesson): ?> <?php
  http_response_code(404); ?> <?php exit("Матеріал не знайдено"); ?> <?php
  endif; ?> $page = "lessons"; $title = $currentLesson["title"] . " |
  HolyDrivers"; $description = $currentLesson["description"]; $canonical =
  "https://holydrivers.com.ua/lessons/" . $currentLesson["url"] . "/"; $robots =
  "index,follow"; include "../../head.php"; ?>

  <body>
    <?php $h1 = $currentLesson["title"]; ?> <?php include "../../header.php"; ?>

    <section class="section"></section>

    <?php include "../../footer.php"; ?>
  </body>
</html>
