<!doctype html>
<html lang="uk">
  <?php $page = "lessons"; $title = "Навчальні матеріали, поради та відео для
  водіїв | HolyDrivers"; $description = "Уроки водіння, відео та статті для
  початківців і досвідчених водіїв. Підготовка до практичного іспиту МВС,
  паркування, кругові перехрестя, безпечна дистанція та інші корисні
  матеріали."; $canonical = "https://holydrivers.com.ua/lessons/";
  $robots="index,follow"; include "../head.php"?>

  <body>
    <?php $page="lessons"; $h1="Навчальні матеріали для водіїв"; include
    "../header.php"; ?>
    <section class="section lessons-list">
      <h2 class="section-title">Навчальні матеріали та відеоуроки</h2>

      <article class="lesson-card lesson-card--article">
        <a href="/lessons/kruhovyy-rukh/" class="lesson-card__link">
          <div class="lesson-card__thumb">
            <img src="/img/lessons/kruhovyy-rukh.jpg" alt="Круговий рух" />
          </div>

          <div class="lesson-card__content">
            <div class="lesson-card__type">📖 Стаття</div>
            <h2 class="lesson-card__title">
              Круговий рух: як проїжджати правильно
            </h2>
            <p class="lesson-card__desc">
              Просте пояснення для початківців: вибір смуги, покажчики повороту,
              пріоритет і типові помилки на кільці.
            </p>
          </div>
        </a>
      </article>

      <article class="lesson-card lesson-card--video">
        <a href="/lessons/bezpechna-dystantsiya/" class="lesson-card__link">
          <div class="lesson-card__thumb">
            <img src="/img/lessons/dystantsiya.jpg" alt="Безпечна дистанція" />
            <span class="lesson-card__play">▶</span>
          </div>

          <div class="lesson-card__content">
            <div class="lesson-card__type">🎬 Відеоурок</div>
            <h2 class="lesson-card__title">Безпечна дистанція за 30 секунд</h2>
            <p class="lesson-card__desc">
              Коротке відео про те, як тримати дистанцію в місті та не їхати
              “впритул” до іншого авто.
            </p>
          </div>
        </a>
      </article>
    </section>
    <?php include "../footer.php"; ?>
  </body>
</html>
