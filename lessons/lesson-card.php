
<article class="lesson-card">
  <a
    href="/lessons/<?= rawurlencode($lesson['url']) ?>/"
    class="lesson-card__link"
  >
    <div class="lesson-card__thumb">

      <?php if (empty($lesson['video'])): ?>
        <img
          src="/lessons/<?= rawurlencode($lesson['url']) ?>/<?= rawurlencode($lesson['image']) ?>"
          alt="<?= htmlspecialchars($lesson['title'], ENT_QUOTES, 'UTF-8') ?>"
          loading="lazy"
          decoding="async"
        />
      <?php else: ?>
        <span class="lesson-card__play">▶</span>
      <?php endif; ?>

    </div>

    <div class="lesson-card__content">
      <div class="lesson-card__type">
        <?= !empty($lesson['video']) ? '🎬 Відеоурок' : '📖 Стаття' ?>
      </div>

      <h2 class="lesson-card__title">
        <?= htmlspecialchars($lesson['title'], ENT_QUOTES, 'UTF-8') ?>
      </h2>

      <p class="lesson-card__desc">
        <?= htmlspecialchars($lesson['description'], ENT_QUOTES, 'UTF-8') ?>
      </p>
    </div>
  </a>
</article>
