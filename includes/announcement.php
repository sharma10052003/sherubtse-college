<?php
/**
 * announcement.php — site-wide dismissible announcement banner.
 * Guarded include: must be reached via header.php (or another file that
 * has already required config.php), never requested directly.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

if (!empty($stc_announcement['active'])):
?>
<div class="stc-announcement" id="stcAnnouncement" role="region" aria-label="Site announcement">
  <div class="stc-announcement__inner">
    <i class="bi bi-megaphone stc-announcement__icon" aria-hidden="true"></i>
    <p class="stc-announcement__text">
      <?php echo htmlspecialchars($stc_announcement['message'], ENT_QUOTES, 'UTF-8'); ?>
      <?php if (!empty($stc_announcement['link'])): ?>
        <a href="<?php echo htmlspecialchars($stc_announcement['link']['url'], ENT_QUOTES, 'UTF-8'); ?>" class="stc-announcement__link">
          <?php echo htmlspecialchars($stc_announcement['link']['label'], ENT_QUOTES, 'UTF-8'); ?> &rarr;
        </a>
      <?php endif; ?>
    </p>
    <?php if (!empty($stc_announcement['dismissible'])): ?>
      <button type="button" class="stc-announcement__close" id="stcAnnouncementClose" aria-label="Dismiss announcement">
        <i class="bi bi-x-lg" aria-hidden="true"></i>
      </button>
    <?php endif; ?>
  </div>
</div>
<?php endif; ?>
