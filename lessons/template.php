<!doctype html>
<html lang="uk">
  <?php $lessonUrl = basename(__DIR__); include "../lesson_head.php";?>
  <body>
    <?php $h1 = LESSONS_H1;
    $h2 = $currentLesson["title"]; ?> <?php include "../../header.php"; ?>

    <?php include "content.php";?>

    <?php include "../../footer.php"; ?>
  </body>
</html>
