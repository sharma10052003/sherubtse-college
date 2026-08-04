<?php
/**
 * pages/history.php — History & Heritage page content (all 10
 * sections). Included by about/history.php after header.php/theme.php.
 * Every section reads from includes/models/History.php; sections tied
 * to optional media (Heritage Gallery, Then vs Now, video, brochure)
 * render nothing when that media hasn't been uploaded yet.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../models/History.php';

$history = stc_get_history_content();
$timeline = stc_get_history_timeline();
$legacyItems = stc_get_history_legacy_items();
$traditionItems = stc_get_history_tradition_items();
$galleryImages = stc_get_history_gallery_images();
$galleryCategories = stc_history_gallery_categories();

// history/*_path fields are already full Strapi media URLs.
$heroImageUrl = $history['hero_image_path'] ?? '';
$heroImagePosition = in_array($history['hero_image_position'] ?? 'top', ['top', 'center', 'bottom'], true) ? $history['hero_image_position'] : 'top';
$kingPhotoUrl = $history['king_photo_path'] ?? '';
$mackeyPhotoUrl = $history['mackey_photo_path'] ?? '';
$thenUrl = $history['then_image_path'] ?? '';
$nowUrl = $history['now_image_path'] ?? '';
$brochureUrl = $history['brochure_path'] ?? '';

$presentCategories = array_unique(array_column($galleryImages, 'category'));
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/pages/history.css">

<article class="stc-history">

  <!-- 1. Hero -->
  <section class="stc-history__hero" <?php echo $heroImageUrl ? 'style="background-image:url(\'' . htmlspecialchars($heroImageUrl, ENT_QUOTES, 'UTF-8') . '\');background-position:center ' . htmlspecialchars($heroImagePosition, ENT_QUOTES, 'UTF-8') . '"' : ''; ?>>
    <?php if (!$heroImageUrl): ?><div class="stc-history__hero-gradient"></div><?php endif; ?>
    <div class="stc-history__hero-overlay"></div>
    <div class="stc-history__hero-inner">
      <h1><?php echo htmlspecialchars($history['hero_title'], ENT_QUOTES, 'UTF-8'); ?></h1>
      <p class="stc-history__hero-subtitle"><?php echo htmlspecialchars($history['hero_subtitle'], ENT_QUOTES, 'UTF-8'); ?></p>
      <p class="stc-history__hero-intro"><?php echo htmlspecialchars($history['hero_intro'], ENT_QUOTES, 'UTF-8'); ?></p>
    </div>
  </section>

  <!-- 2. Founding Story -->
  <section class="stc-history__section stc-history__founding">
    <div class="stc-history__inner stc-history__inner--narrow" data-reveal>
      <p class="stc-history__eyebrow"><i class="bi bi-flag-fill" aria-hidden="true"></i> Founding Story</p>
      <h2>How It Began</h2>
      <p class="stc-history__prose"><?php echo nl2br(htmlspecialchars($history['founding_story'], ENT_QUOTES, 'UTF-8')); ?></p>
    </div>
  </section>

  <!-- 3. Historical Timeline -->
  <?php if ($timeline): ?>
  <section class="stc-history__section stc-history__timeline-section">
    <div class="stc-history__inner">
      <p class="stc-history__eyebrow"><i class="bi bi-hourglass-split" aria-hidden="true"></i> Historical Timeline</p>
      <h2 data-reveal>Milestones</h2>
      <div class="stc-history__timeline" id="stcHistoryTimeline">
        <span class="stc-history__timeline-progress" id="stcTimelineProgress" aria-hidden="true"></span>
        <?php foreach ($timeline as $i => $item): ?>
          <?php $side = $i % 2 === 0 ? 'left' : 'right'; ?>
          <div class="stc-history__timeline-item stc-history__timeline-item--<?php echo $side; ?>" data-reveal-variant="<?php echo $side; ?>" style="--i:<?php echo $i; ?>">
            <span class="stc-history__timeline-dot" aria-hidden="true"></span>
            <div class="stc-history__timeline-card">
              <span class="stc-history__timeline-year-badge"><?php echo htmlspecialchars($item['year'], ENT_QUOTES, 'UTF-8'); ?></span>
              <h3><?php echo htmlspecialchars($item['event'], ENT_QUOTES, 'UTF-8'); ?></h3>
              <?php if (!empty($item['description'])): ?><p><?php echo htmlspecialchars($item['description'], ENT_QUOTES, 'UTF-8'); ?></p><?php endif; ?>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>
  <?php endif; ?>

  <!-- 4. Vision of the Third King -->
  <section class="stc-history__section stc-history__vision">
    <div class="stc-history__inner">
      <div class="stc-history__portrait-card stc-history__portrait-card--reverse" data-reveal>
        <div class="stc-history__portrait-photo">
          <?php if ($kingPhotoUrl): ?>
            <img src="<?php echo htmlspecialchars($kingPhotoUrl, ENT_QUOTES, 'UTF-8'); ?>" alt="His Majesty Jigme Dorji Wangchuck, the Third Druk Gyalpo" loading="lazy">
          <?php else: ?>
            <div class="stc-history__portrait-placeholder"><i class="bi bi-person-fill" aria-hidden="true"></i></div>
          <?php endif; ?>
        </div>
        <div>
          <p class="stc-history__eyebrow"><i class="bi bi-award-fill" aria-hidden="true"></i> Vision of the Third King</p>
          <h2>His Majesty Jigme Dorji Wangchuck</h2>
          <p class="stc-history__prose"><?php echo nl2br(htmlspecialchars($history['vision_king_text'], ENT_QUOTES, 'UTF-8')); ?></p>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. Father Mackey card -->
  <section class="stc-history__section stc-history__mackey">
    <div class="stc-history__inner">
      <div class="stc-history__portrait-card" data-reveal>
        <div class="stc-history__portrait-photo">
          <?php if ($mackeyPhotoUrl): ?>
            <img src="<?php echo htmlspecialchars($mackeyPhotoUrl, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars($history['mackey_name'], ENT_QUOTES, 'UTF-8'); ?>" loading="lazy">
          <?php else: ?>
            <div class="stc-history__portrait-placeholder"><i class="bi bi-person-fill" aria-hidden="true"></i></div>
          <?php endif; ?>
        </div>
        <div>
          <p class="stc-history__eyebrow"><i class="bi bi-mortarboard-fill" aria-hidden="true"></i> Founding Principal</p>
          <h2><?php echo htmlspecialchars($history['mackey_name'], ENT_QUOTES, 'UTF-8'); ?></h2>
          <p class="stc-history__prose"><?php echo nl2br(htmlspecialchars($history['mackey_bio'], ENT_QUOTES, 'UTF-8')); ?></p>
        </div>
      </div>
    </div>
  </section>

  <!-- 6. Heritage Gallery -->
  <?php if ($galleryImages): ?>
  <section class="stc-history__section stc-history__gallery" id="heritage-gallery">
    <div class="stc-history__inner">
      <p class="stc-history__eyebrow"><i class="bi bi-images" aria-hidden="true"></i> Heritage Gallery</p>
      <h2 data-reveal>Moments from Our History</h2>

      <?php if (count($presentCategories) > 1): ?>
      <div class="stc-history__gallery-filters" role="tablist" aria-label="Filter photos by category">
        <button type="button" class="is-active" data-filter="all" role="tab" aria-selected="true">All</button>
        <?php foreach ($galleryCategories as $key => $label): ?>
          <?php if (in_array($key, $presentCategories, true)): ?>
            <button type="button" data-filter="<?php echo htmlspecialchars($key, ENT_QUOTES, 'UTF-8'); ?>" role="tab" aria-selected="false">
              <?php echo htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?>
            </button>
          <?php endif; ?>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>

      <div class="stc-history__gallery-grid">
        <?php foreach ($galleryImages as $i => $image): ?>
          <?php $imgUrl = $image['image_path']; /* already a full Strapi media URL */ ?>
          <button type="button" class="stc-history__gallery-item" data-category="<?php echo htmlspecialchars($image['category'], ENT_QUOTES, 'UTF-8'); ?>" data-index="<?php echo $i; ?>" style="--i:<?php echo $i % 6; ?>">
            <img src="<?php echo htmlspecialchars($imgUrl, ENT_QUOTES, 'UTF-8'); ?>" alt="<?php echo htmlspecialchars((string) $image['caption'], ENT_QUOTES, 'UTF-8'); ?>" loading="lazy">
            <?php if (!empty($image['caption'])): ?><span class="stc-history__gallery-caption"><?php echo htmlspecialchars($image['caption'], ENT_QUOTES, 'UTF-8'); ?></span><?php endif; ?>
          </button>
        <?php endforeach; ?>
      </div>
    </div>

    <div class="stc-history__lightbox" id="stcHistoryLightbox" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
      <button type="button" class="stc-history__lightbox-close" id="stcHistoryLightboxClose" aria-label="Close photo viewer"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
      <button type="button" class="stc-history__lightbox-nav stc-history__lightbox-nav--prev" id="stcHistoryLightboxPrev" aria-label="Previous photo"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
      <figure class="stc-history__lightbox-figure">
        <img src="" alt="" id="stcHistoryLightboxImage">
        <figcaption id="stcHistoryLightboxCaption"></figcaption>
      </figure>
      <button type="button" class="stc-history__lightbox-nav stc-history__lightbox-nav--next" id="stcHistoryLightboxNext" aria-label="Next photo"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
    </div>
  </section>
  <script>
    window.STC_HISTORY_GALLERY_IMAGES = <?php echo json_encode(array_map(static function ($img) {
        return [
            'src' => $img['image_path'], // already a full Strapi media URL
            'caption' => (string) $img['caption'],
            'category' => $img['category'],
        ];
    }, $galleryImages), JSON_UNESCAPED_SLASHES); ?>;
  </script>
  <?php endif; ?>

  <!-- 7. College Motto and Identity -->
  <section class="stc-history__section stc-history__identity">
    <div class="stc-history__inner stc-history__inner--narrow" data-reveal>
      <p class="stc-history__eyebrow"><i class="bi bi-shield-fill-check" aria-hidden="true"></i> Motto & Identity</p>
      <h2 class="stc-history__motto">&ldquo;<?php echo htmlspecialchars($history['motto'], ENT_QUOTES, 'UTF-8'); ?>&rdquo;</h2>
      <?php if (!empty($history['motto_meaning'])): ?>
        <p class="stc-history__prose"><?php echo nl2br(htmlspecialchars($history['motto_meaning'], ENT_QUOTES, 'UTF-8')); ?></p>
      <?php endif; ?>
      <?php if (!empty($history['emblem_meaning'])): ?>
        <h3>The Emblem</h3>
        <p class="stc-history__prose"><?php echo nl2br(htmlspecialchars($history['emblem_meaning'], ENT_QUOTES, 'UTF-8')); ?></p>
      <?php endif; ?>
      <?php if (!empty($history['values_text'])): ?>
        <h3>Our Values</h3>
        <p class="stc-history__prose"><?php echo nl2br(htmlspecialchars($history['values_text'], ENT_QUOTES, 'UTF-8')); ?></p>
      <?php endif; ?>
    </div>
  </section>

  <!-- 8. Legacy and Achievements -->
  <?php if ($legacyItems): ?>
  <section class="stc-history__section stc-history__legacy">
    <div class="stc-history__inner">
      <p class="stc-history__eyebrow"><i class="bi bi-trophy-fill" aria-hidden="true"></i> Legacy & Achievements</p>
      <h2 data-reveal>Our Legacy</h2>
      <div class="stc-history__card-grid">
        <?php foreach ($legacyItems as $i => $item): ?>
          <div class="stc-history__card" data-reveal style="--i:<?php echo $i; ?>">
            <i class="bi <?php echo htmlspecialchars($item['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
            <p><?php echo htmlspecialchars($item['text'], ENT_QUOTES, 'UTF-8'); ?></p>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>
  <?php endif; ?>

  <!-- 9. Traditions and Culture -->
  <?php if ($traditionItems): ?>
  <section class="stc-history__section stc-history__traditions">
    <div class="stc-history__inner">
      <p class="stc-history__eyebrow"><i class="bi bi-stars" aria-hidden="true"></i> Traditions & Culture</p>
      <h2 data-reveal>Living Traditions</h2>
      <div class="stc-history__card-grid">
        <?php foreach ($traditionItems as $i => $item): ?>
          <div class="stc-history__card" data-reveal style="--i:<?php echo $i; ?>">
            <i class="bi <?php echo htmlspecialchars($item['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
            <h3><?php echo htmlspecialchars($item['title'], ENT_QUOTES, 'UTF-8'); ?></h3>
            <?php if (!empty($item['description'])): ?><p><?php echo htmlspecialchars($item['description'], ENT_QUOTES, 'UTF-8'); ?></p><?php endif; ?>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>
  <?php endif; ?>

  <!-- 10. Interactive Features -->
  <?php if ($thenUrl && $nowUrl): ?>
  <section class="stc-history__section stc-history__thennow">
    <div class="stc-history__inner stc-history__inner--narrow">
      <p class="stc-history__eyebrow"><i class="bi bi-arrow-left-right" aria-hidden="true"></i> Then vs Now</p>
      <h2 data-reveal>Decades of Growth</h2>
      <div class="stc-history__slider" id="stcThenNowSlider">
        <img class="stc-history__slider-now" src="<?php echo htmlspecialchars($nowUrl, ENT_QUOTES, 'UTF-8'); ?>" alt="Sherubtse College today">
        <div class="stc-history__slider-then-wrap">
          <img class="stc-history__slider-then" src="<?php echo htmlspecialchars($thenUrl, ENT_QUOTES, 'UTF-8'); ?>" alt="Sherubtse College in its early years">
        </div>
        <div class="stc-history__slider-handle" aria-hidden="true"><i class="bi bi-arrows"></i></div>
        <label class="visually-hidden" for="stcThenNowRange">Drag to compare then and now</label>
        <input type="range" id="stcThenNowRange" min="0" max="100" value="50">
        <span class="stc-history__slider-label stc-history__slider-label--then">Then</span>
        <span class="stc-history__slider-label stc-history__slider-label--now">Now</span>
      </div>
    </div>
  </section>
  <?php endif; ?>

  <?php if (!empty($history['video_url'])): ?>
  <section class="stc-history__section stc-history__video">
    <div class="stc-history__inner stc-history__inner--narrow" data-reveal>
      <p class="stc-history__eyebrow"><i class="bi bi-play-circle-fill" aria-hidden="true"></i> Documentary</p>
      <h2>Watch Our Story</h2>
      <div class="stc-history__video-frame">
        <?php if (preg_match('/\.mp4($|\?)/i', $history['video_url'])): ?>
          <video controls src="<?php echo htmlspecialchars($history['video_url'], ENT_QUOTES, 'UTF-8'); ?>"></video>
        <?php else: ?>
          <iframe src="<?php echo htmlspecialchars($history['video_url'], ENT_QUOTES, 'UTF-8'); ?>" title="Sherubtse College documentary" allowfullscreen loading="lazy"></iframe>
        <?php endif; ?>
      </div>
    </div>
  </section>
  <?php endif; ?>

  <?php if ($brochureUrl): ?>
  <section class="stc-history__section stc-history__brochure">
    <div class="stc-history__inner stc-history__inner--narrow stc-history__brochure-inner" data-reveal>
      <div>
        <h2>Download the Heritage Brochure</h2>
        <p class="stc-history__prose">A printable keepsake of Sherubtse College's history, milestones and legacy.</p>
      </div>
      <a class="stc-history__btn" href="<?php echo htmlspecialchars($brochureUrl, ENT_QUOTES, 'UTF-8'); ?>" download>
        <i class="bi bi-download" aria-hidden="true"></i> Download Brochure
      </a>
    </div>
  </section>
  <?php endif; ?>

</article>

<script src="<?php echo BASE_URL; ?>assets/js/pages/history.js" defer></script>
