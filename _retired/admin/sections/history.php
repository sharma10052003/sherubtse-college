<?php
/**
 * admin/sections/history.php — History & Heritage page editor.
 * Covers every section of the page except the open-ended Heritage
 * Gallery, which has its own screen (history-gallery.php) reusing
 * gallery.php's repeater pattern.
 */
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../../includes/models/History.php';

$history = stc_get_history_content();
$timeline = stc_get_history_timeline();
$legacyItems = stc_get_history_legacy_items();
$traditionItems = stc_get_history_tradition_items();

$pageTitle = 'History & Heritage';
$activeSection = 'history';
require __DIR__ . '/../includes/layout-head.php';
?>

<div class="stc-admin-lede-row">
  <a href="<?php echo BASE_URL; ?>admin/sections/history-gallery.php" class="stc-admin-btn stc-admin-btn--ghost">
    <i class="bi bi-images" aria-hidden="true"></i> Manage Heritage Gallery
  </a>
  <a href="<?php echo BASE_URL; ?>about/history" target="_blank" rel="noopener" class="stc-admin-btn stc-admin-btn--ghost">
    <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i> View Page
  </a>
</div>

<form id="stcHistoryForm" class="stc-admin-layout" enctype="multipart/form-data" novalidate>
  <?php echo stc_csrf_field(); ?>
  <div>

    <div class="stc-admin-panel">
      <h2>1. Hero</h2>
      <div class="stc-admin-field">
        <label for="histHeroTitle">Title</label>
        <input type="text" id="histHeroTitle" name="hero_title" maxlength="200" required value="<?php echo htmlspecialchars($history['hero_title'], ENT_QUOTES, 'UTF-8'); ?>">
      </div>
      <div class="stc-admin-field">
        <label for="histHeroSubtitle">Subtitle</label>
        <input type="text" id="histHeroSubtitle" name="hero_subtitle" maxlength="300" required value="<?php echo htmlspecialchars($history['hero_subtitle'], ENT_QUOTES, 'UTF-8'); ?>">
      </div>
      <div class="stc-admin-field">
        <label for="histHeroIntro">Introduction</label>
        <textarea id="histHeroIntro" name="hero_intro" maxlength="500" rows="3" required><?php echo htmlspecialchars($history['hero_intro'], ENT_QUOTES, 'UTF-8'); ?></textarea>
      </div>
      <div class="stc-admin-field">
        <label for="histHeroImage">Background image (optional)</label>
        <input type="file" id="histHeroImage" name="hero_image" accept="image/jpeg,image/png,image/webp">
        <span class="stc-admin-hint">JPG/PNG/WebP, max 15MB.<?php if (!empty($history['hero_image_path'])): ?> Current: <code><?php echo htmlspecialchars($history['hero_image_path'], ENT_QUOTES, 'UTF-8'); ?></code><?php endif; ?></span>
      </div>
      <div class="stc-admin-field">
        <label for="histHeroImagePosition">Image focal point</label>
        <select id="histHeroImagePosition" name="hero_image_position">
          <?php foreach (['top' => 'Top (keep faces/heads in frame)', 'center' => 'Center', 'bottom' => 'Bottom'] as $val => $label): ?>
            <option value="<?php echo $val; ?>" <?php echo ($history['hero_image_position'] ?? 'top') === $val ? 'selected' : ''; ?>><?php echo htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?></option>
          <?php endforeach; ?>
        </select>
        <span class="stc-admin-hint">If the photo looks cropped (e.g. heads cut off), try "Top".</span>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>2. Founding Story</h2>
      <div class="stc-admin-field">
        <label for="histFounding">Story</label>
        <textarea id="histFounding" name="founding_story" maxlength="4000" rows="6" required><?php echo htmlspecialchars($history['founding_story'], ENT_QUOTES, 'UTF-8'); ?></textarea>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>3. Historical Timeline</h2>
      <div id="timelineRepeater">
        <?php foreach ($timeline as $item): ?>
          <div class="stc-admin-repeater__row" data-row>
            <div class="stc-admin-field"><label>Year</label><input type="text" name="timeline_year[]" maxlength="20" value="<?php echo htmlspecialchars($item['year'], ENT_QUOTES, 'UTF-8'); ?>"></div>
            <div class="stc-admin-field"><label>Event</label><input type="text" name="timeline_event[]" maxlength="200" value="<?php echo htmlspecialchars($item['event'], ENT_QUOTES, 'UTF-8'); ?>"></div>
            <div class="stc-admin-field"><label>Description (optional)</label><input type="text" name="timeline_description[]" maxlength="400" value="<?php echo htmlspecialchars((string) $item['description'], ENT_QUOTES, 'UTF-8'); ?>"></div>
            <button type="button" class="stc-admin-repeater__remove" aria-label="Remove entry"><i class="bi bi-trash3" aria-hidden="true"></i></button>
          </div>
        <?php endforeach; ?>
      </div>
      <button type="button" class="stc-admin-btn stc-admin-btn--ghost" id="addTimeline"><i class="bi bi-plus-lg" aria-hidden="true"></i> Add timeline entry</button>
    </div>

    <div class="stc-admin-panel">
      <h2>4. Vision of the Third King</h2>
      <div class="stc-admin-field">
        <label for="histVision">Text</label>
        <textarea id="histVision" name="vision_king_text" maxlength="2000" rows="5" required><?php echo htmlspecialchars($history['vision_king_text'], ENT_QUOTES, 'UTF-8'); ?></textarea>
      </div>
      <div class="stc-admin-field">
        <label for="histKingPhoto">His Majesty's photo (optional)</label>
        <input type="file" id="histKingPhoto" name="king_photo" accept="image/jpeg,image/png,image/webp">
        <span class="stc-admin-hint">Official portrait only, JPG/PNG/WebP, max 10MB.<?php if (!empty($history['king_photo_path'])): ?> Current: <code><?php echo htmlspecialchars($history['king_photo_path'], ENT_QUOTES, 'UTF-8'); ?></code><?php endif; ?></span>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>5. Father Mackey</h2>
      <div class="stc-admin-field">
        <label for="histMackeyName">Name</label>
        <input type="text" id="histMackeyName" name="mackey_name" maxlength="150" required value="<?php echo htmlspecialchars($history['mackey_name'], ENT_QUOTES, 'UTF-8'); ?>">
      </div>
      <div class="stc-admin-field">
        <label for="histMackeyBio">Biography</label>
        <textarea id="histMackeyBio" name="mackey_bio" maxlength="2000" rows="5" required><?php echo htmlspecialchars($history['mackey_bio'], ENT_QUOTES, 'UTF-8'); ?></textarea>
      </div>
      <div class="stc-admin-field">
        <label for="histMackeyPhoto">Photo (optional)</label>
        <input type="file" id="histMackeyPhoto" name="mackey_photo" accept="image/jpeg,image/png,image/webp">
        <span class="stc-admin-hint">JPG/PNG/WebP, max 10MB.<?php if (!empty($history['mackey_photo_path'])): ?> Current: <code><?php echo htmlspecialchars($history['mackey_photo_path'], ENT_QUOTES, 'UTF-8'); ?></code><?php endif; ?></span>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>6. College Motto & Identity</h2>
      <div class="stc-admin-field">
        <label for="histMotto">Motto</label>
        <input type="text" id="histMotto" name="motto" maxlength="150" required value="<?php echo htmlspecialchars($history['motto'], ENT_QUOTES, 'UTF-8'); ?>">
      </div>
      <div class="stc-admin-field">
        <label for="histMottoMeaning">Motto meaning (optional)</label>
        <textarea id="histMottoMeaning" name="motto_meaning" maxlength="1000" rows="2"><?php echo htmlspecialchars((string) $history['motto_meaning'], ENT_QUOTES, 'UTF-8'); ?></textarea>
      </div>
      <div class="stc-admin-field">
        <label for="histEmblemMeaning">Emblem meaning (optional)</label>
        <textarea id="histEmblemMeaning" name="emblem_meaning" maxlength="1000" rows="2"><?php echo htmlspecialchars((string) $history['emblem_meaning'], ENT_QUOTES, 'UTF-8'); ?></textarea>
      </div>
      <div class="stc-admin-field">
        <label for="histValues">Institutional values (optional)</label>
        <textarea id="histValues" name="values_text" maxlength="1000" rows="2"><?php echo htmlspecialchars((string) $history['values_text'], ENT_QUOTES, 'UTF-8'); ?></textarea>
      </div>
    </div>

    <div class="stc-admin-panel">
      <h2>7. Legacy & Achievements</h2>
      <div id="legacyRepeater">
        <?php foreach ($legacyItems as $item): ?>
          <div class="stc-admin-repeater__row" data-row>
            <div class="stc-admin-field"><label>Icon class</label><input type="text" name="legacy_icon[]" value="<?php echo htmlspecialchars($item['icon'], ENT_QUOTES, 'UTF-8'); ?>" placeholder="bi-trophy-fill"></div>
            <div class="stc-admin-field"><label>Text</label><input type="text" name="legacy_text[]" maxlength="300" value="<?php echo htmlspecialchars($item['text'], ENT_QUOTES, 'UTF-8'); ?>"></div>
            <button type="button" class="stc-admin-repeater__remove" aria-label="Remove item"><i class="bi bi-trash3" aria-hidden="true"></i></button>
          </div>
        <?php endforeach; ?>
      </div>
      <button type="button" class="stc-admin-btn stc-admin-btn--ghost" id="addLegacy"><i class="bi bi-plus-lg" aria-hidden="true"></i> Add legacy item</button>
    </div>

    <div class="stc-admin-panel">
      <h2>8. Traditions & Culture</h2>
      <div id="traditionsRepeater">
        <?php foreach ($traditionItems as $item): ?>
          <div class="stc-admin-repeater__row" data-row>
            <div class="stc-admin-field"><label>Icon class</label><input type="text" name="tradition_icon[]" value="<?php echo htmlspecialchars($item['icon'], ENT_QUOTES, 'UTF-8'); ?>" placeholder="bi-stars"></div>
            <div class="stc-admin-field"><label>Title</label><input type="text" name="tradition_title[]" maxlength="150" value="<?php echo htmlspecialchars($item['title'], ENT_QUOTES, 'UTF-8'); ?>"></div>
            <div class="stc-admin-field"><label>Description (optional)</label><input type="text" name="tradition_description[]" maxlength="300" value="<?php echo htmlspecialchars((string) $item['description'], ENT_QUOTES, 'UTF-8'); ?>"></div>
            <button type="button" class="stc-admin-repeater__remove" aria-label="Remove item"><i class="bi bi-trash3" aria-hidden="true"></i></button>
          </div>
        <?php endforeach; ?>
      </div>
      <button type="button" class="stc-admin-btn stc-admin-btn--ghost" id="addTradition"><i class="bi bi-plus-lg" aria-hidden="true"></i> Add tradition</button>
    </div>

    <div class="stc-admin-panel">
      <h2>9. Interactive Features</h2>
      <div class="stc-admin-field">
        <label for="histVideoUrl">Documentary video URL (optional)</label>
        <input type="text" id="histVideoUrl" name="video_url" maxlength="255" value="<?php echo htmlspecialchars((string) $history['video_url'], ENT_QUOTES, 'UTF-8'); ?>" placeholder="YouTube/Vimeo embed URL or a direct .mp4 link">
      </div>
      <div class="stc-admin-grid-2">
        <div class="stc-admin-field">
          <label for="histThenImage">"Then" photo (optional)</label>
          <input type="file" id="histThenImage" name="then_image" accept="image/jpeg,image/png,image/webp">
          <span class="stc-admin-hint">Both Then + Now photos are required to show the comparison slider.</span>
        </div>
        <div class="stc-admin-field">
          <label for="histNowImage">"Now" photo (optional)</label>
          <input type="file" id="histNowImage" name="now_image" accept="image/jpeg,image/png,image/webp">
        </div>
      </div>
      <div class="stc-admin-field">
        <label for="histBrochure">Downloadable brochure (optional, PDF)</label>
        <input type="file" id="histBrochure" name="brochure" accept="application/pdf">
        <span class="stc-admin-hint">PDF, max 20MB.<?php if (!empty($history['brochure_path'])): ?> Current: <code><?php echo htmlspecialchars($history['brochure_path'], ENT_QUOTES, 'UTF-8'); ?></code><?php endif; ?></span>
      </div>
    </div>

    <div class="stc-admin-form-actions">
      <button type="submit" class="stc-admin-btn stc-admin-btn--primary"><i class="bi bi-save" aria-hidden="true"></i> Save changes</button>
      <span class="stc-admin-hint">Changes go live on the page immediately after saving.</span>
    </div>
  </div>

  <aside class="stc-admin-preview">
    <p class="stc-admin-preview__label">Live preview (approximate)</p>
    <div class="stc-history-preview" id="historyPreview">
      <h3 id="histPreviewTitle"><?php echo htmlspecialchars($history['hero_title'], ENT_QUOTES, 'UTF-8'); ?></h3>
      <p id="histPreviewSubtitle"><?php echo htmlspecialchars($history['hero_subtitle'], ENT_QUOTES, 'UTF-8'); ?></p>
      <p id="histPreviewIntro"><?php echo htmlspecialchars($history['hero_intro'], ENT_QUOTES, 'UTF-8'); ?></p>
      <p class="stc-history-preview__motto" id="histPreviewMotto">&ldquo;<?php echo htmlspecialchars($history['motto'], ENT_QUOTES, 'UTF-8'); ?>&rdquo;</p>
    </div>
  </aside>
</form>

<template id="timelineRowTemplate">
  <div class="stc-admin-repeater__row" data-row>
    <div class="stc-admin-field"><label>Year</label><input type="text" name="timeline_year[]" maxlength="20"></div>
    <div class="stc-admin-field"><label>Event</label><input type="text" name="timeline_event[]" maxlength="200"></div>
    <div class="stc-admin-field"><label>Description (optional)</label><input type="text" name="timeline_description[]" maxlength="400"></div>
    <button type="button" class="stc-admin-repeater__remove" aria-label="Remove entry"><i class="bi bi-trash3" aria-hidden="true"></i></button>
  </div>
</template>
<template id="legacyRowTemplate">
  <div class="stc-admin-repeater__row" data-row>
    <div class="stc-admin-field"><label>Icon class</label><input type="text" name="legacy_icon[]" placeholder="bi-trophy-fill"></div>
    <div class="stc-admin-field"><label>Text</label><input type="text" name="legacy_text[]" maxlength="300"></div>
    <button type="button" class="stc-admin-repeater__remove" aria-label="Remove item"><i class="bi bi-trash3" aria-hidden="true"></i></button>
  </div>
</template>
<template id="traditionRowTemplate">
  <div class="stc-admin-repeater__row" data-row>
    <div class="stc-admin-field"><label>Icon class</label><input type="text" name="tradition_icon[]" placeholder="bi-stars"></div>
    <div class="stc-admin-field"><label>Title</label><input type="text" name="tradition_title[]" maxlength="150"></div>
    <div class="stc-admin-field"><label>Description (optional)</label><input type="text" name="tradition_description[]" maxlength="300"></div>
    <button type="button" class="stc-admin-repeater__remove" aria-label="Remove item"><i class="bi bi-trash3" aria-hidden="true"></i></button>
  </div>
</template>

<link rel="stylesheet" href="<?php echo BASE_URL; ?>admin/assets/css/history-editor.css">
<script>window.STC_HISTORY_SAVE_URL = <?php echo json_encode(BASE_URL . 'admin/ajax/history-save.php'); ?>;</script>
<script src="<?php echo BASE_URL; ?>admin/assets/js/history-editor.js" defer></script>

<?php require __DIR__ . '/../includes/layout-foot.php'; ?>
