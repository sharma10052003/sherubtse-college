<?php
/**
 * partials/programme-card.php — one programme catalogue card.
 * Expects $p in scope (see stc_map_programme_card() in models/Programme.php).
 * Reuses the .stc-faculty-card component styles from faculty.css. Mirrored
 * in assets/js/programmes/programmes-list.js (renderCard()) for
 * AJAX-updated results — keep both in sync if this markup changes.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

$programmeUrl = BASE_URL . 'programmes/' . rawurlencode($p['slug']);
?>
<article class="stc-faculty-card" data-reveal>
  <a href="<?php echo htmlspecialchars($programmeUrl, ENT_QUOTES, 'UTF-8'); ?>" class="stc-faculty-card__media">
    <?php if (!empty($p['hero_image_url'])): ?>
      <img src="<?php echo htmlspecialchars($p['hero_image_url'], ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($p['programme_name'], ENT_QUOTES, 'UTF-8'); ?>" loading="lazy">
    <?php else: ?>
      <div class="stc-faculty-card__placeholder"><i class="bi bi-mortarboard-fill" aria-hidden="true"></i></div>
    <?php endif; ?>
  </a>

  <div class="stc-faculty-card__body">
    <?php if (!empty($p['level'])): ?>
      <span class="inline-block text-xs font-semibold uppercase tracking-wide text-gold mb-1"><?php echo htmlspecialchars(ucfirst($p['level']), ENT_QUOTES, 'UTF-8'); ?></span>
    <?php endif; ?>
    <h3 class="stc-faculty-card__name">
      <a href="<?php echo htmlspecialchars($programmeUrl, ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($p['programme_name'], ENT_QUOTES, 'UTF-8'); ?></a>
    </h3>
    <?php if ($p['department']): ?><p class="stc-faculty-card__department"><i class="bi bi-building" aria-hidden="true"></i> <?php echo htmlspecialchars($p['department'], ENT_QUOTES, 'UTF-8'); ?></p><?php endif; ?>
    <?php if ($p['duration']): ?><p class="stc-faculty-card__qualification"><i class="bi bi-clock-history" aria-hidden="true"></i> <?php echo htmlspecialchars($p['duration'], ENT_QUOTES, 'UTF-8'); ?></p><?php endif; ?>
    <?php if ($p['short_description']): ?><p class="text-ink-soft text-sm mt-2 line-clamp-2"><?php echo htmlspecialchars($p['short_description'], ENT_QUOTES, 'UTF-8'); ?></p><?php endif; ?>

    <div class="stc-faculty-card__footer">
      <a href="<?php echo htmlspecialchars($programmeUrl, ENT_QUOTES, 'UTF-8'); ?>" class="stc-faculty-card__btn">View Programme <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
    </div>
  </div>
</article>
