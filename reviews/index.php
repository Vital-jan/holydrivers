<!doctype html>
<html lang="uk">
  <?php $page = "reviews"; $title = " Відгуки учнів про автоінструктора |
  HolyDrivers"; $description = "Відгуки про автоінструктора Київ (Теремки,
  Голосіїв) — уроки водіння АКПП"; $canonical =
  "https://holydrivers.com.ua/reviews/"; $robots="index,follow"; include
  "../head.php"?>

  <body>
    <div class="overlay" id="overlay"></div>
    <!-- header -->
    <?php $page="reviews"; $h1="Відгуки учнів про автоінструктора"; include
    "../header.php";?>
    <!-- header -->

    <section class="section" id="reviews">
      <h2 class="section-title">⭐ 5.0 · Відгуки у Google Maps:</h2>
      <div class="review-actions">
        <a
          href="https://maps.app.goo.gl/TfcniZ7A4mXYm5MZA"
          target="_blank"
          rel="noopener"
        >
          ⭐ Усі відгуки Google
        </a>

        <a
          href="https://search.google.com/local/writereview?placeid=ChIJ22WzFvn36mcR8NWjQlNQaJI"
          target="_blank"
          rel="noopener"
        >
          ✍️ Написати відгук
        </a>
      </div>
      <?php include "reviews.php";?>
    </section>
    <?php include "../footer.php";?>
  </body>
</html>
