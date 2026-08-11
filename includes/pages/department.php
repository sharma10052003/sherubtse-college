<?php
/**
 * pages/department.php — cinematic department landing page content.
 * Included by about/department.php, which already fetched $department
 * (see stc_get_department_by_slug() in models/Department.php) and
 * confirmed it's non-null before including this file.
 *
 * The hero itself (background image/video/canvas/overlay layers) is
 * config-driven from Strapi per department — see department-hero.css
 * and assets/js/faculty/department-hero.js for how animation_type
 * picks a canvas motif (network-data / particles-math / flowing-
 * gradient / none). Nothing about the layout here is hardcoded to any
 * one department.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../models/Faculty.php';

$d = $department;
$grouped = stc_get_faculty_grouped(['department' => $d['slug']]);
$members = array_merge($grouped['heads'], $grouped['groups'][0]['members'] ?? []);

$heroStyle = '--stc-dept-overlay-opacity:' . (max(0, min(100, (int) $d['overlay_opacity'])) / 100) . ';';
if (!empty($d['theme_color'])) {
    $heroStyle .= '--stc-dept-accent:' . preg_replace('/[^#a-zA-Z0-9]/', '', $d['theme_color']) . ';';
}
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/tailwind.css">
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/faculty.css">
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/department-hero.css">

<article class="stc-dept">

  <!-- Breadcrumb -->
  <nav class="stc-faculty__breadcrumb" aria-label="Breadcrumb">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8 py-3 text-sm flex items-center gap-2 text-ink-soft">
      <a href="<?php echo htmlspecialchars(BASE_URL, ENT_QUOTES, 'UTF-8'); ?>" class="hover:text-gold transition-colors">Home</a>
      <span aria-hidden="true">/</span>
      <a href="<?php echo htmlspecialchars(BASE_URL . 'about/faculty', ENT_QUOTES, 'UTF-8'); ?>" class="hover:text-gold transition-colors">Faculty</a>
      <span aria-hidden="true">/</span>
      <span class="text-ink font-medium"><?php echo htmlspecialchars($d['department_name'], ENT_QUOTES, 'UTF-8'); ?></span>
    </div>
  </nav>

  <!-- Cinematic hero -->
  <section
    class="stc-dept-hero<?php echo $d['mobile_background_url'] ? ' has-mobile-bg' : ''; ?>"
    id="stcDeptHero"
    aria-labelledby="stcDeptHeroTitle"
    style="<?php echo htmlspecialchars($heroStyle, ENT_QUOTES, 'UTF-8'); ?>"
    data-animation-type="<?php echo $d['animation_enabled'] ? htmlspecialchars($d['animation_type'], ENT_QUOTES, 'UTF-8') : 'none'; ?>"
    data-animation-intensity="<?php echo htmlspecialchars($d['animation_intensity'], ENT_QUOTES, 'UTF-8'); ?>"
    data-animation-speed="<?php echo htmlspecialchars($d['animation_speed'], ENT_QUOTES, 'UTF-8'); ?>"
  >
    <!-- Layer 1: static background image — always present as the base/fallback -->
    <?php if ($d['banner_image_url']): ?>
      <img class="stc-dept-hero__bg-img" src="<?php echo htmlspecialchars($d['banner_image_url'], ENT_QUOTES, 'UTF-8'); ?>" alt="" aria-hidden="true">
    <?php endif; ?>
    <?php if ($d['mobile_background_url']): ?>
      <img class="stc-dept-hero__bg-img stc-dept-hero__bg-img--mobile" src="<?php echo htmlspecialchars($d['mobile_background_url'], ENT_QUOTES, 'UTF-8'); ?>" alt="" aria-hidden="true">
    <?php endif; ?>

    <!-- Layer 2: video — optional, lazy (JS only starts loading it once visible) -->
    <?php if ($d['hero_video_url']): ?>
      <video class="stc-dept-hero__bg-video" id="stcDeptHeroVideo" muted loop playsinline preload="none" data-src="<?php echo htmlspecialchars($d['hero_video_url'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></video>
    <?php endif; ?>

    <!-- Layer 3: canvas motif, driven by assets/js/faculty/department-hero.js -->
    <canvas class="stc-dept-hero__canvas" id="stcDeptHeroCanvas" aria-hidden="true"></canvas>

    <!-- Layer 4: gradient/dark overlay -->
    <div class="stc-dept-hero__overlay" aria-hidden="true"></div>

    <!-- Layer 5: content -->
    <div class="stc-dept-hero__content max-w-(--container-page) mx-auto px-4 md:px-8">
      <p class="stc-dept-hero__eyebrow">Sherubtse College &middot; Royal University of Bhutan</p>
      <h1 id="stcDeptHeroTitle" class="stc-dept-hero__title"><?php echo htmlspecialchars($d['department_name'], ENT_QUOTES, 'UTF-8'); ?></h1>
      <?php if (!empty($d['description'])): ?>
        <p class="stc-dept-hero__desc"><?php echo htmlspecialchars($d['description'], ENT_QUOTES, 'UTF-8'); ?></p>
      <?php endif; ?>

      <div class="stc-dept-hero__meta">
        <span class="stc-dept-hero__meta-item"><i class="bi bi-people-fill" aria-hidden="true"></i> <?php echo count($members); ?> faculty member<?php echo count($members) === 1 ? '' : 's'; ?></span>
        <?php if (!empty($d['head_of_department_name'])): ?>
          <span class="stc-dept-hero__meta-item"><i class="bi bi-award-fill" aria-hidden="true"></i> Head: <?php echo htmlspecialchars($d['head_of_department_name'], ENT_QUOTES, 'UTF-8'); ?></span>
        <?php endif; ?>
      </div>
    </div>
  </section>

  <!-- Vision / Mission (only if the admin filled them in) -->
  <?php if (!empty($d['vision']) || !empty($d['mission'])): ?>
  <section class="stc-dept-vismis py-14 md:py-16">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8 grid gap-8 md:grid-cols-2">
      <?php if (!empty($d['vision'])): ?>
        <div>
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-eye-fill" aria-hidden="true"></i> Vision</p>
          <p class="stc-faculty-prose"><?php echo nl2br(htmlspecialchars($d['vision'], ENT_QUOTES, 'UTF-8')); ?></p>
        </div>
      <?php endif; ?>
      <?php if (!empty($d['mission'])): ?>
        <div>
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-bullseye" aria-hidden="true"></i> Mission</p>
          <p class="stc-faculty-prose"><?php echo nl2br(htmlspecialchars($d['mission'], ENT_QUOTES, 'UTF-8')); ?></p>
        </div>
      <?php endif; ?>
    </div>
  </section>
  <?php endif; ?>

  <!-- Department members -->
  <section class="stc-faculty-grid-section py-14 md:py-20 bg-cream-alt/40" aria-labelledby="stcDeptMembersTitle">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8">
      <p class="stc-faculty-section-eyebrow"><i class="bi bi-people-fill" aria-hidden="true"></i> Faculty</p>
      <h2 id="stcDeptMembersTitle" class="font-(family-name:--font-display) text-2xl md:text-3xl text-ink mb-8" data-reveal><?php echo htmlspecialchars($d['department_name'], ENT_QUOTES, 'UTF-8'); ?> Faculty</h2>

      <?php if ($members): ?>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <?php foreach ($members as $f): ?>
            <?php include __DIR__ . '/../partials/faculty-card.php'; ?>
          <?php endforeach; ?>
        </div>
      <?php else: ?>
        <p class="text-center text-ink-soft py-12">Faculty for this department will appear here once added from the admin panel.</p>
      <?php endif; ?>
    </div>
  </section>

</article>

<script>
  window.STC_DEPT_HERO_ANIMATIONS_ENABLED = <?php echo $d['animation_enabled'] ? 'true' : 'false'; ?>;
</script>
<script src="<?php echo BASE_URL; ?>assets/js/faculty/department-hero.js" defer></script>
