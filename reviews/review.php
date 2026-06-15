<div class="review-card">
  <div class="review-card__header">
    <div class="review-card__avatar">
      <?php echo mb_substr($review['name'], 0, 1); ?>
    </div>

    <div>
      <div class="review-card__name"><?php echo $review['name']; ?></div>
      <div class="review-card__stars">★★★★★</div>
    </div>
  </div>

  <blockquote class="review-card__text">
    <?php echo $review['text']; ?>...
  </blockquote>

  <div class="review-card__footer">
    <a href="<?php echo $review['link']?>" target="_blank" rel="noopener">
      Читати повністю
    </a>
  </div>
</div>
