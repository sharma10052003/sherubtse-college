<?php
/**
 * homepage/president.php — President's Welcome section (Module 2 of
 * the homepage content brief). Requires config.php + db.php already
 * included. Falls back to generic placeholder copy — never a
 * fabricated name/photo — via includes/models/President.php.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../models/President.php';

$president = stc_get_president_content();
$photoUrl = $president['photo_path'] ?? ''; // already a full Strapi media URL
$signatureUrl = $president['signature_path'] ?? '';
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/homepage/president.css">

<section class="stc-president" aria-labelledby="stcPresidentTitle">
  <div class="stc-president__accent" aria-hidden="true"></div>
  <h2 id="stcPresidentTitle" class="visually-hidden">President's Welcome</h2>

  <div class="stc-president__inner">
    <div class="stc-president__media" data-reveal-variant="left">
      <div class="stc-president__frame">
        <?php if ($photoUrl): ?>
          <img src="<?php echo htmlspecialchars($photoUrl, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($president['name'] ?: 'The President', ENT_QUOTES, 'UTF-8'); ?>" loading="lazy">
        <?php else: ?>
          <div class="stc-president__placeholder"><i class="bi bi-person-fill" aria-hidden="true"></i></div>
        <?php endif; ?>
      </div>
    </div>

    <div class="stc-president__content" data-reveal-variant="right">
      <p class="stc-president__eyebrow"><i class="bi bi-quote" aria-hidden="true"></i> A Message from the President</p>
      <p class="stc-president__message"><?php echo nl2br(htmlspecialchars($president['message'], ENT_QUOTES, 'UTF-8')); ?></p>

      <div class="stc-president__signoff">
        <?php if ($signatureUrl): ?>
          <img class="stc-president__signature" src="<?php echo htmlspecialchars($signatureUrl, ENT_QUOTES, 'UTF-8'); ?>" alt="Signature">
        <?php endif; ?>
        <div class="stc-president__signoff-text">
          <?php if (!empty($president['name'])): ?>
            <p class="stc-president__name"><?php echo htmlspecialchars($president['name'], ENT_QUOTES, 'UTF-8'); ?></p>
          <?php endif; ?>
          <p class="stc-president__position"><?php echo htmlspecialchars($president['position'], ENT_QUOTES, 'UTF-8'); ?></p>
        </div>
      </div>

      <a href="<?php echo htmlspecialchars($president['button_url'], ENT_QUOTES, 'UTF-8'); ?>" class="stc-president__btn">
        <?php echo htmlspecialchars($president['button_text'], ENT_QUOTES, 'UTF-8'); ?>
        <i class="bi bi-arrow-right" aria-hidden="true"></i>
      </a>
    </div>
  </div>
</section>

<script src="<?php echo BASE_URL; ?>assets/js/homepage/president.js" defer></script>
