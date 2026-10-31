<section class="section">
    <h2 class="section-title">
            🎬 Відео про найпоширеніші помилки на іспиті
    </h2>





<?php if (!empty($currentLesson['video'])): ?>
  <?php
    $videoId = $currentLesson['video'];
    $youtubeUrl = 'https://www.youtube.com/watch?v='
        . rawurlencode($videoId);
  ?>

  <div class="video-card">
    <iframe
      src="https://www.youtube-nocookie.com/embed/<?= rawurlencode($videoId) ?>"
      title="<?= htmlspecialchars($currentLesson['title'], ENT_QUOTES, 'UTF-8') ?>"
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>

  <p>
    <a
      href="<?= htmlspecialchars($youtubeUrl, ENT_QUOTES, 'UTF-8') ?>"
      class="button"
      target="_blank"
      rel="noopener noreferrer"
    >
      ▶ Дивитись на YouTube
    </a>
  </p>
<?php endif; ?>


</section>