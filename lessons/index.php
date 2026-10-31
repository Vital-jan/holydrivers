<!doctype html>
<html lang="uk">
  <?php $page = "lessons"; $title = "Навчальні матеріали, поради та відео для
  водіїв | HolyDrivers"; $description = "Уроки водіння, відео та статті для
  початківців і досвідчених водіїв. Підготовка до практичного іспиту МВС,
  паркування, кругові перехрестя, безпечна дистанція та інші корисні
  матеріали."; $canonical = "https://holydrivers.com.ua/lessons/"; $robots =
  "index,follow"; include "../head.php"; ?>

  <body>
    <?php $h1 = "Уроки водіння онлайн";
    $h2="Навчальні матеріали для водіїв";
    $intro="<p>Статті та відео як для
  початківців, так і для досвідчених водіїв.</p>";
  include "../header.php";
    include "lessons.php"; ?>

    <section class="section lessons-list">
      <?php foreach ($lessons as $lesson): ?> <?php include "lesson-card.php";
      ?> <?php endforeach; ?>
    </section>

    <?php include "../footer.php"; ?>
  </body>
</html>
