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
    <?php $page="reviews"; $h1="Відгуки учнів про автоінструктора";
    $h2="Відгуки у Google Maps"; $intro="<p>Відгуки учнів про наші заняття</p>";
    include "../header.php";?>
    <!-- header -->

    <section class="section" id="reviews">
      <div class="review-actions">
        <a
          href="https://maps.app.goo.gl/TfcniZ7A4mXYm5MZA"
          target="_blank"
          rel="noopener"
        >
          ⭐ Усі відгуки Google
        </a>

      </div>
      <?php include "reviews.php";?>
      <div class="review-actions">
        <a
          href="https://g.page/r/CfDVo0JTUGiSEAE/review"
          target="_blank"
          rel="noopener"
        >
          ⭐ Залишити відгук
        </a>

      </div>
    </section>
    <?php include "../footer.php";?>
  </body>
</html>
