<?php
/**
 * homepage/hero.php — cinematic hero banner (Homepage Module 1).
 * -----------------------------------------------------------------------
 * Requires config.php + db.php already included. Renders entirely from
 * hero_content / hero_items (via includes/models/Hero.php), which fall
 * back to realistic defaults if the database has no rows yet.
 * -----------------------------------------------------------------------
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../models/Hero.php';

$hero  = stc_get_hero_content();
$stats = stc_get_hero_items('stat');
$badges = stc_get_hero_items('badge');

$bgType = $hero['background_type'] ?? 'gradient';
$mediaUrl = $hero['media_path'] ?? ''; // already a full Strapi media URL
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/homepage/hero.css">

<section class="stc-hero stc-hero--overlay-<?php echo htmlspecialchars($hero['overlay_style'], ENT_QUOTES, 'UTF-8'); ?>" aria-labelledby="stcHeroTitle">
  <div class="stc-hero__bg" aria-hidden="true">
    <?php if ($bgType === 'image' && $mediaUrl): ?>
      <img class="stc-hero__bg-media" src="<?php echo htmlspecialchars($mediaUrl, ENT_QUOTES, 'UTF-8'); ?>" alt="">
    <?php elseif ($bgType === 'video' && $mediaUrl): ?>
      <video class="stc-hero__bg-media" autoplay muted loop playsinline>
        <source src="<?php echo htmlspecialchars($mediaUrl, ENT_QUOTES, 'UTF-8'); ?>" type="video/mp4">
      </video>
    <?php else: ?>
      <div class="stc-hero__bg-gradient"></div>
      <svg class="stc-hero__bg-motif" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" focusable="false">
        <path d="M0,400 L0,220 L160,150 L320,240 L480,110 L640,210 L800,90 L960,200 L1120,120 L1280,220 L1440,140 L1440,400 Z" opacity="0.14"></path>
        <path d="M0,400 L0,280 L200,230 L400,300 L600,200 L800,270 L1000,190 L1200,260 L1440,210 L1440,400 Z" opacity="0.22"></path>
      </svg>
    <?php endif; ?>
    <div class="stc-hero__overlay"></div>
  </div>

  <div class="stc-hero__inner">
    <div class="stc-hero__content">
      <p class="stc-hero__eyebrow"><i class="bi bi-shield-check" aria-hidden="true"></i> Royal University of Bhutan</p>
      <h1 class="stc-hero__title" id="stcHeroTitle" data-reveal><?php echo htmlspecialchars($hero['title'], ENT_QUOTES, 'UTF-8'); ?></h1>
      <p class="stc-hero__subtitle"><?php echo htmlspecialchars($hero['subtitle'], ENT_QUOTES, 'UTF-8'); ?></p>

      <div class="stc-hero__ctas">
        <a class="stc-hero__btn stc-hero__btn--primary" href="<?php echo htmlspecialchars($hero['cta1_url'], ENT_QUOTES, 'UTF-8'); ?>">
          <?php echo htmlspecialchars($hero['cta1_text'], ENT_QUOTES, 'UTF-8'); ?>
          <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </a>
        <a class="stc-hero__btn stc-hero__btn--ghost" href="<?php echo htmlspecialchars($hero['cta2_url'], ENT_QUOTES, 'UTF-8'); ?>">
          <?php echo htmlspecialchars($hero['cta2_text'], ENT_QUOTES, 'UTF-8'); ?>
        </a>
      </div>
    </div>

    <?php if ($badges): ?>
    <div class="stc-hero__badges">
      <?php foreach ($badges as $i => $badge): ?>
        <div class="stc-hero__badge" style="--i:<?php echo $i; ?>">
          <i class="bi <?php echo htmlspecialchars($badge['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
          <span><?php echo htmlspecialchars($badge['label'], ENT_QUOTES, 'UTF-8'); ?></span>
        </div>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>
  </div>

  <?php if ($stats): ?>
  <div class="stc-hero__stats">
    <div class="stc-hero__stats-inner">
      <?php foreach ($stats as $stat): ?>
        <div class="stc-hero__stat">
          <i class="bi <?php echo htmlspecialchars($stat['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
          <span class="stc-hero__stat-value">
            <span class="stc-counter" data-target="<?php echo (int) $stat['value']; ?>">0</span><?php echo htmlspecialchars((string) $stat['suffix'], ENT_QUOTES, 'UTF-8'); ?>
          </span>
          <span class="stc-hero__stat-label"><?php echo htmlspecialchars($stat['label'], ENT_QUOTES, 'UTF-8'); ?></span>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
  <?php endif; ?>

  <button type="button" class="stc-hero__scroll" id="stcHeroScroll" aria-label="Scroll to page content">
    <span class="stc-hero__scroll-track"><span class="stc-hero__scroll-dot"></span></span>
    <i class="bi bi-chevron-down" aria-hidden="true"></i>
  </button>
</section>

<script src="<?php echo BASE_URL; ?>assets/js/homepage/hero.js" defer></script>
