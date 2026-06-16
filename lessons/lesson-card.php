<article class="lesson-card lesson-card--<?= $lesson['type'] ?>">
  <a
    href="<?= $lesson['url'] ?>/?lesson=<?= $lesson['url'] ?>"
    class="lesson-card__link"
  >
    <div class="lesson-card__thumb">
      <img
        src="/lessons/<?= $lesson['url'] ?>/img.jpg"
        alt="<?= htmlspecialchars($lesson['title']) ?>"
      />

      <?php if (!empty ($lesson['video'])): ?>
      <span class="lesson-card__play">▶</span>
      <?php endif; ?>
    </div>

    <div class="lesson-card__content">
      <div class="lesson-card__type">
        <?= !empty($lesson['video']) ? '🎬 Відеоурок' : '📖 Стаття' ?>
      </div>

      <h2 class="lesson-card__title"><?= $lesson['title'] ?></h2>

      <p class="lesson-card__desc"><?= $lesson['description'] ?></p>
    </div>
  </a>
</article>
