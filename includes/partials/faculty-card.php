<?php
/**
 * partials/faculty-card.php — one faculty directory card.
 * Expects $f in scope (see stc_map_faculty_card() in models/Faculty.php).
 * Mirrored in assets/js/faculty/faculty-list.js (renderCard()) for
 * AJAX-updated results — keep both in sync if this markup changes.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

$profileUrl = BASE_URL . 'about/faculty/' . rawurlencode($f['slug']);
?>
<article class="stc-faculty-card" data-reveal>
  <a href="<?php echo htmlspecialchars($profileUrl, ENT_QUOTES, 'UTF-8'); ?>" class="stc-faculty-card__media">
    <?php if ($f['profile_picture_url']): ?>
      <img src="<?php echo htmlspecialchars($f['profile_picture_url'], ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($f['full_name'], ENT_QUOTES, 'UTF-8'); ?>" loading="lazy">
    <?php else: ?>
      <div class="stc-faculty-card__placeholder"><i class="bi bi-person-fill" aria-hidden="true"></i></div>
    <?php endif; ?>
    <?php if ($f['is_featured']): ?>
      <span class="stc-faculty-card__badge"><i class="bi bi-star-fill" aria-hidden="true"></i> Featured</span>
    <?php endif; ?>
  </a>

  <div class="stc-faculty-card__body">
    <h3 class="stc-faculty-card__name">
      <a href="<?php echo htmlspecialchars($profileUrl, ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($f['full_name'], ENT_QUOTES, 'UTF-8'); ?></a>
    </h3>
    <p class="stc-faculty-card__position"><?php echo htmlspecialchars($f['position'], ENT_QUOTES, 'UTF-8'); ?></p>
    <?php if ($f['department']): ?><p class="stc-faculty-card__department"><i class="bi bi-building" aria-hidden="true"></i> <?php echo htmlspecialchars($f['department'], ENT_QUOTES, 'UTF-8'); ?></p><?php endif; ?>
    <?php if ($f['highest_qualification']): ?><p class="stc-faculty-card__qualification"><i class="bi bi-mortarboard" aria-hidden="true"></i> <?php echo htmlspecialchars($f['highest_qualification'], ENT_QUOTES, 'UTF-8'); ?></p><?php endif; ?>

    <?php if ($f['research_areas']): ?>
    <div class="stc-faculty-card__tags">
      <?php foreach (array_slice($f['research_areas'], 0, 3) as $tag): ?>
        <span class="stc-faculty-card__tag"><?php echo htmlspecialchars($tag, ENT_QUOTES, 'UTF-8'); ?></span>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <div class="stc-faculty-card__footer">
      <div class="stc-faculty-card__social">
        <?php if ($f['college_email']): ?><a href="mailto:<?php echo htmlspecialchars($f['college_email'], ENT_QUOTES, 'UTF-8'); ?>" aria-label="Email <?php echo htmlspecialchars($f['full_name'], ENT_QUOTES, 'UTF-8'); ?>"><i class="bi bi-envelope-fill" aria-hidden="true"></i></a><?php endif; ?>
        <?php if ($f['linkedin_url']): ?><a href="<?php echo htmlspecialchars($f['linkedin_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="bi bi-linkedin" aria-hidden="true"></i></a><?php endif; ?>
        <?php if ($f['google_scholar_url']): ?><a href="<?php echo htmlspecialchars($f['google_scholar_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener" aria-label="Google Scholar"><i class="bi bi-mortarboard-fill" aria-hidden="true"></i></a><?php endif; ?>
      </div>
      <a href="<?php echo htmlspecialchars($profileUrl, ENT_QUOTES, 'UTF-8'); ?>" class="stc-faculty-card__btn">View Profile <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
    </div>
  </div>
</article>
