<?php
/**
 * admin/sections/hero.php — Hero Section editor.
 * Reuses includes/models/Hero.php (the same data-access layer the
 * public homepage reads from) so the form is always pre-filled with
 * exactly what's currently live.
 */
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../../includes/models/Hero.php';

$hero = stc_get_hero_content();
$stats = stc_get_hero_items('stat');
$badges = stc_get_hero_items('badge');

$pageTitle = 'Hero Section';
$activeSection = 'hero';
require __DIR__ . '/../includes/layout-head.php';
?>

<form id="stcHeroForm" class="stc-admin-layout" enctype="multipart/form-data" novalidate>
  <?php echo stc_csrf_field(); ?>
  <div>
    <div class="stc-admin-panel">
      <h2>Headline & Call to Action</h2>

      <div class="stc-admin-field">
        <label for="heroTitle">Title</label>
        <input type="text" id="heroTitle" name="title" maxlength="200" required value="<?php echo htmlspecialchars($hero['title'], ENT_QUOTES, 'UTF-8'); ?>">
      </div>

      <div class="stc-admin-field">
        <label for="heroSubtitle">Subtitle</label>
        <textarea id="heroSubtitle" name="subtitle" maxlength="400" rows="3" required><?php echo htmlspecialchars($hero['subtitle'], ENT_QUOTES, 'UTF-8'); ?></textarea>
      </div>

      <div class="stc-admin-grid-2">
        <div class="stc-admin-field">
          <label for="cta1Text">Primary button text</label>
          <input type="text" id="cta1Text" name="cta1_text" maxlength="60" required value="<?php echo htmlspecialchars($hero['cta1_text'], ENT_QUOTES, 'UTF-8'); ?>">
        </div>
        <div class="stc-admin-field">
          <label for="cta1Url">Primary button link</label>
          <input type="text" id="cta1Url" name="cta1_url" maxlength="255" required value="<?php echo htmlspecialchars($hero['cta1_url'], ENT_QUOTES, 'UTF-8'); ?>">
        </div>
      </div>

      <div class="stc-admin-grid-2">
        <div class="stc-admin-field">
          <label for="cta2Text">Secondary button text</label>
          <input type="text" id="cta2Text" name="cta2_text" maxlength="60" required value="<?php echo htmlspecialchars($hero['cta2_text'], ENT_QUOTES, 'UTF-8'); ?>">
        </div>
        <div class="stc-admin-field">
          <label for="cta2Url">Secondary button link</label>
          <input type="text" id="cta2Url" name="cta2_url" maxlength="255" required value="<?php echo htmlspecialchars($hero['cta2_url'], ENT_QUOTES, 'UTF-8'); ?>">
        </div>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>Background & Style</h2>

      <div class="stc-admin-grid-2">
        <div class="stc-admin-field">
          <label for="bgType">Background type</label>
          <select id="bgType" name="background_type">
            <option value="gradient" <?php echo $hero['background_type'] === 'gradient' ? 'selected' : ''; ?>>Gradient + motif (default)</option>
            <option value="image" <?php echo $hero['background_type'] === 'image' ? 'selected' : ''; ?>>Image</option>
            <option value="video" <?php echo $hero['background_type'] === 'video' ? 'selected' : ''; ?>>Video</option>
          </select>
        </div>
        <div class="stc-admin-field">
          <label for="overlayStyle">Overlay style</label>
          <select id="overlayStyle" name="overlay_style">
            <option value="maroon" <?php echo $hero['overlay_style'] === 'maroon' ? 'selected' : ''; ?>>Maroon (brand)</option>
            <option value="dark" <?php echo $hero['overlay_style'] === 'dark' ? 'selected' : ''; ?>>Dark neutral</option>
            <option value="light" <?php echo $hero['overlay_style'] === 'light' ? 'selected' : ''; ?>>Light</option>
          </select>
        </div>
      </div>

      <div class="stc-admin-field" id="mediaField" hidden>
        <label for="heroMedia">Upload media</label>
        <input type="file" id="heroMedia" name="media">
        <span class="stc-admin-hint">
          Images: JPG/PNG/WebP, max 15MB. Video: MP4, max 50MB.
          <?php if (!empty($hero['media_path'])): ?>Current file: <code><?php echo htmlspecialchars($hero['media_path'], ENT_QUOTES, 'UTF-8'); ?></code><?php endif; ?>
        </span>
      </div>

      <div class="stc-admin-field">
        <label for="overlayOpacity">Overlay opacity — <span id="overlayOpacityValue"><?php echo (int) $hero['overlay_opacity']; ?></span>%</label>
        <input type="range" id="overlayOpacity" name="overlay_opacity" min="0" max="90" value="<?php echo (int) $hero['overlay_opacity']; ?>">
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>Animated Statistics</h2>
      <div id="statsRepeater">
        <?php foreach ($stats as $stat): ?>
          <div class="stc-admin-repeater__row" data-row>
            <div class="stc-admin-field">
              <label>Icon class</label>
              <input type="text" name="stats_icon[]" value="<?php echo htmlspecialchars($stat['icon'], ENT_QUOTES, 'UTF-8'); ?>" placeholder="bi-mortarboard">
            </div>
            <div class="stc-admin-field">
              <label>Value</label>
              <input type="number" name="stats_value[]" value="<?php echo htmlspecialchars((string) $stat['value'], ENT_QUOTES, 'UTF-8'); ?>">
            </div>
            <div class="stc-admin-field">
              <label>Suffix</label>
              <input type="text" name="stats_suffix[]" maxlength="10" value="<?php echo htmlspecialchars((string) $stat['suffix'], ENT_QUOTES, 'UTF-8'); ?>" placeholder="+">
            </div>
            <div class="stc-admin-field">
              <label>Label</label>
              <input type="text" name="stats_label[]" maxlength="120" value="<?php echo htmlspecialchars($stat['label'], ENT_QUOTES, 'UTF-8'); ?>">
            </div>
            <button type="button" class="stc-admin-repeater__remove" aria-label="Remove stat"><i class="bi bi-trash3" aria-hidden="true"></i></button>
          </div>
        <?php endforeach; ?>
      </div>
      <button type="button" class="stc-admin-btn stc-admin-btn--ghost" id="addStat"><i class="bi bi-plus-lg" aria-hidden="true"></i> Add statistic</button>
    </div>

    <div class="stc-admin-panel">
      <h2>Floating Badges</h2>
      <div id="badgesRepeater">
        <?php foreach ($badges as $badge): ?>
          <div class="stc-admin-repeater__row" data-row>
            <div class="stc-admin-field">
              <label>Icon class</label>
              <input type="text" name="badges_icon[]" value="<?php echo htmlspecialchars($badge['icon'], ENT_QUOTES, 'UTF-8'); ?>" placeholder="bi-award-fill">
            </div>
            <div class="stc-admin-field">
              <label>Label</label>
              <input type="text" name="badges_label[]" maxlength="120" value="<?php echo htmlspecialchars($badge['label'], ENT_QUOTES, 'UTF-8'); ?>">
            </div>
            <button type="button" class="stc-admin-repeater__remove" aria-label="Remove badge"><i class="bi bi-trash3" aria-hidden="true"></i></button>
          </div>
        <?php endforeach; ?>
      </div>
      <button type="button" class="stc-admin-btn stc-admin-btn--ghost" id="addBadge"><i class="bi bi-plus-lg" aria-hidden="true"></i> Add badge</button>
    </div>

    <div class="stc-admin-form-actions">
      <button type="submit" class="stc-admin-btn stc-admin-btn--primary"><i class="bi bi-save" aria-hidden="true"></i> Save changes</button>
      <span class="stc-admin-hint">Changes go live on the homepage immediately after saving.</span>
    </div>
  </div>

  <aside class="stc-admin-preview">
    <p class="stc-admin-preview__label">Live preview (approximate)</p>
    <div id="heroPreview" class="stc-hero-preview">
      <div class="stc-hero-preview__bg" id="previewBg"></div>
      <div class="stc-hero-preview__overlay" id="previewOverlay"></div>
      <div class="stc-hero-preview__content">
        <p class="stc-hero-preview__eyebrow">Royal University of Bhutan</p>
        <h3 id="previewTitle"><?php echo htmlspecialchars($hero['title'], ENT_QUOTES, 'UTF-8'); ?></h3>
        <p id="previewSubtitle"><?php echo htmlspecialchars($hero['subtitle'], ENT_QUOTES, 'UTF-8'); ?></p>
        <div class="stc-hero-preview__ctas">
          <span class="stc-hero-preview__btn stc-hero-preview__btn--primary" id="previewCta1"><?php echo htmlspecialchars($hero['cta1_text'], ENT_QUOTES, 'UTF-8'); ?></span>
          <span class="stc-hero-preview__btn" id="previewCta2"><?php echo htmlspecialchars($hero['cta2_text'], ENT_QUOTES, 'UTF-8'); ?></span>
        </div>
        <div class="stc-hero-preview__badges" id="previewBadges"></div>
      </div>
      <div class="stc-hero-preview__stats" id="previewStats"></div>
    </div>
  </aside>
</form>

<template id="statRowTemplate">
  <div class="stc-admin-repeater__row" data-row>
    <div class="stc-admin-field"><label>Icon class</label><input type="text" name="stats_icon[]" placeholder="bi-star"></div>
    <div class="stc-admin-field"><label>Value</label><input type="number" name="stats_value[]" value="0"></div>
    <div class="stc-admin-field"><label>Suffix</label><input type="text" name="stats_suffix[]" maxlength="10" placeholder="+"></div>
    <div class="stc-admin-field"><label>Label</label><input type="text" name="stats_label[]" maxlength="120"></div>
    <button type="button" class="stc-admin-repeater__remove" aria-label="Remove stat"><i class="bi bi-trash3" aria-hidden="true"></i></button>
  </div>
</template>

<template id="badgeRowTemplate">
  <div class="stc-admin-repeater__row" data-row>
    <div class="stc-admin-field"><label>Icon class</label><input type="text" name="badges_icon[]" placeholder="bi-award-fill"></div>
    <div class="stc-admin-field"><label>Label</label><input type="text" name="badges_label[]" maxlength="120"></div>
    <button type="button" class="stc-admin-repeater__remove" aria-label="Remove badge"><i class="bi bi-trash3" aria-hidden="true"></i></button>
  </div>
</template>

<link rel="stylesheet" href="<?php echo BASE_URL; ?>admin/assets/css/hero-editor.css">
<script>window.STC_HERO_SAVE_URL = <?php echo json_encode(BASE_URL . 'admin/ajax/hero-save.php'); ?>;</script>
<script src="<?php echo BASE_URL; ?>admin/assets/js/hero-editor.js" defer></script>

<?php require __DIR__ . '/../includes/layout-foot.php'; ?>
