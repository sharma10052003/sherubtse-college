<?php
/**
 * pages/contact.php — /contact page content. A flat contact directory
 * grid — who's in it is entirely admin-defined via
 * includes/models/Contact.php, no office/person is hardcoded here.
 * Cards reveal contact details on click/tap (not hover-only) so the
 * page works the same on touch devices.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../models/Contact.php';

$page = stc_get_contact_page_content();
$people = stc_get_contact_people();
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/pages/contact.css">

<article class="stc-contact">

  <!-- Hero -->
  <section class="stc-contact__hero">
    <div class="stc-contact__hero-inner">
      <p class="stc-contact__eyebrow" data-reveal><i class="bi bi-envelope-heart-fill" aria-hidden="true"></i> <?php echo htmlspecialchars($page['hero_eyebrow'], ENT_QUOTES, 'UTF-8'); ?></p>
      <h1 data-reveal><?php echo htmlspecialchars($page['hero_title'], ENT_QUOTES, 'UTF-8'); ?></h1>
      <?php if (!empty($page['hero_subtitle'])): ?>
        <p class="stc-contact__hero-subtitle" data-reveal><?php echo htmlspecialchars($page['hero_subtitle'], ENT_QUOTES, 'UTF-8'); ?></p>
      <?php endif; ?>

      <?php if (!empty($page['general_email']) || !empty($page['general_phone']) || !empty($page['office_hours']) || !empty($page['map_url'])): ?>
        <ul class="stc-contact__quickbar" data-reveal>
          <?php if (!empty($page['general_email'])): ?>
            <li><a href="mailto:<?php echo htmlspecialchars($page['general_email'], ENT_QUOTES, 'UTF-8'); ?>"><i class="bi bi-envelope-fill" aria-hidden="true"></i><?php echo htmlspecialchars($page['general_email'], ENT_QUOTES, 'UTF-8'); ?></a></li>
          <?php endif; ?>
          <?php if (!empty($page['general_phone'])): ?>
            <li><a href="tel:<?php echo htmlspecialchars(preg_replace('/\s+/', '', $page['general_phone']), ENT_QUOTES, 'UTF-8'); ?>"><i class="bi bi-telephone-fill" aria-hidden="true"></i><?php echo htmlspecialchars($page['general_phone'], ENT_QUOTES, 'UTF-8'); ?></a></li>
          <?php endif; ?>
          <?php if (!empty($page['office_hours'])): ?>
            <li><span><i class="bi bi-clock-fill" aria-hidden="true"></i><?php echo htmlspecialchars($page['office_hours'], ENT_QUOTES, 'UTF-8'); ?></span></li>
          <?php endif; ?>
          <?php if (!empty($page['map_url'])): ?>
            <li><a href="<?php echo htmlspecialchars($page['map_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener noreferrer"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i>View on map</a></li>
          <?php endif; ?>
        </ul>
      <?php endif; ?>
    </div>
  </section>

  <!-- Directory -->
  <section class="stc-contact__directory" aria-label="Contact directory">
    <?php if ($people): ?>
      <div class="stc-contact__grid">
        <?php foreach ($people as $person): ?>
          <div class="stc-contact__card" tabindex="0" role="button"
               aria-pressed="false"
               aria-label="<?php echo htmlspecialchars('Show contact details for ' . $person['full_name'], ENT_QUOTES, 'UTF-8'); ?>">
            <div class="stc-contact__card-inner">

              <div class="stc-contact__card-face stc-contact__card-face--front">
                <div class="stc-contact__photo">
                  <?php if (!empty($person['photo_url'])): ?>
                    <img src="<?php echo htmlspecialchars($person['photo_url'], ENT_QUOTES, 'UTF-8'); ?>" alt="" loading="lazy">
                  <?php else: ?>
                    <i class="bi bi-person-fill" aria-hidden="true"></i>
                  <?php endif; ?>
                </div>
                <p class="stc-contact__name"><?php echo htmlspecialchars($person['full_name'], ENT_QUOTES, 'UTF-8'); ?></p>
                <p class="stc-contact__role"><?php echo htmlspecialchars($person['role_title'], ENT_QUOTES, 'UTF-8'); ?></p>
                <span class="stc-contact__hint"><i class="bi bi-hand-index-thumb" aria-hidden="true"></i> Tap for contact details</span>
              </div>

              <div class="stc-contact__card-face stc-contact__card-face--back">
                <p class="stc-contact__name stc-contact__name--back"><?php echo htmlspecialchars($person['full_name'], ENT_QUOTES, 'UTF-8'); ?></p>
                <p class="stc-contact__role"><?php echo htmlspecialchars($person['role_title'], ENT_QUOTES, 'UTF-8'); ?></p>

                <ul class="stc-contact__details">
                  <?php if (!empty($person['email'])): ?>
                    <li><a href="mailto:<?php echo htmlspecialchars($person['email'], ENT_QUOTES, 'UTF-8'); ?>"><i class="bi bi-envelope-fill" aria-hidden="true"></i><?php echo htmlspecialchars($person['email'], ENT_QUOTES, 'UTF-8'); ?></a></li>
                  <?php endif; ?>
                  <?php if (!empty($person['phone'])): ?>
                    <li><a href="tel:<?php echo htmlspecialchars(preg_replace('/\s+/', '', $person['phone']), ENT_QUOTES, 'UTF-8'); ?>"><i class="bi bi-telephone-fill" aria-hidden="true"></i><?php echo htmlspecialchars($person['phone'], ENT_QUOTES, 'UTF-8'); ?></a></li>
                  <?php endif; ?>
                  <?php if (!empty($person['office_location'])): ?>
                    <li><span><i class="bi bi-geo-alt-fill" aria-hidden="true"></i><?php echo htmlspecialchars($person['office_location'], ENT_QUOTES, 'UTF-8'); ?></span></li>
                  <?php endif; ?>
                </ul>

                <?php if (!empty($person['bio'])): ?>
                  <p class="stc-contact__bio"><?php echo htmlspecialchars($person['bio'], ENT_QUOTES, 'UTF-8'); ?></p>
                <?php endif; ?>

                <span class="stc-contact__hint"><i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i> Tap to close</span>
              </div>

            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php else: ?>
      <p class="stc-contact__empty">The contact directory will appear here once added from the admin panel.</p>
    <?php endif; ?>
  </section>

</article>

<script src="<?php echo BASE_URL; ?>assets/js/pages/contact.js" defer></script>
