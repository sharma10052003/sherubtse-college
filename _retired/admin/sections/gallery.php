<?php
/**
 * admin/sections/gallery.php — Campus Gallery editor.
 * Reuses includes/models/Gallery.php, the same data-access layer the
 * public homepage reads from.
 */
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../../includes/models/Gallery.php';

$galleryContent = stc_get_gallery_content();
$galleryImages = stc_get_gallery_images();
$categories = stc_gallery_categories();

$pageTitle = 'Campus Gallery';
$activeSection = 'gallery';
require __DIR__ . '/../includes/layout-head.php';
?>

<form id="stcGalleryForm" class="stc-admin-layout" enctype="multipart/form-data" novalidate>
  <?php echo stc_csrf_field(); ?>
  <div>
    <div class="stc-admin-panel">
      <h2>Section Heading</h2>
      <div class="stc-admin-field">
        <label for="galTitle">Title</label>
        <input type="text" id="galTitle" name="title" maxlength="200" required value="<?php echo htmlspecialchars($galleryContent['title'], ENT_QUOTES, 'UTF-8'); ?>">
      </div>
      <div class="stc-admin-field">
        <label for="galSubtitle">Subtitle</label>
        <textarea id="galSubtitle" name="subtitle" maxlength="400" rows="2" required><?php echo htmlspecialchars($galleryContent['subtitle'], ENT_QUOTES, 'UTF-8'); ?></textarea>
      </div>
      <p class="stc-admin-hint">This section is hidden from the homepage entirely until at least one photo is added below.</p>
    </div>

    <div class="stc-admin-panel">
      <h2>Photos</h2>
      <p class="stc-admin-hint" style="margin-bottom:1rem;">JPG, PNG or WebP, max 15MB each.</p>
      <div id="imagesRepeater">
        <?php foreach ($galleryImages as $image): ?>
          <?php $thumbUrl = BASE_URL . 'assets/uploads/gallery/' . rawurlencode($image['image_path']); ?>
          <div class="stc-admin-repeater__row stc-admin-repeater__row--stacked" data-row>
            <input type="hidden" name="images_id[]" value="<?php echo (int) $image['id']; ?>">
            <input type="hidden" name="images_existing[]" value="<?php echo htmlspecialchars($image['image_path'], ENT_QUOTES, 'UTF-8'); ?>">
            <img class="stc-gallery-editor__thumb" src="<?php echo htmlspecialchars($thumbUrl, ENT_QUOTES, 'UTF-8'); ?>" alt="" data-thumb>
            <div class="stc-admin-grid-2">
              <div class="stc-admin-field">
                <label>Replace photo (optional)</label>
                <input type="file" name="images_file[]" accept="image/jpeg,image/png,image/webp" data-file-input>
              </div>
              <div class="stc-admin-field">
                <label>Category</label>
                <select name="images_category[]">
                  <?php foreach ($categories as $key => $label): ?>
                    <option value="<?php echo $key; ?>" <?php echo $image['category'] === $key ? 'selected' : ''; ?>><?php echo htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?></option>
                  <?php endforeach; ?>
                </select>
              </div>
            </div>
            <div class="stc-admin-field">
              <label>Caption (optional)</label>
              <input type="text" name="images_caption[]" maxlength="200" value="<?php echo htmlspecialchars((string) $image['caption'], ENT_QUOTES, 'UTF-8'); ?>">
            </div>
            <button type="button" class="stc-admin-repeater__remove" aria-label="Remove photo"><i class="bi bi-trash3" aria-hidden="true"></i></button>
          </div>
        <?php endforeach; ?>
      </div>
      <button type="button" class="stc-admin-btn stc-admin-btn--ghost" id="addImage"><i class="bi bi-plus-lg" aria-hidden="true"></i> Add photo</button>
    </div>

    <div class="stc-admin-form-actions">
      <button type="submit" class="stc-admin-btn stc-admin-btn--primary"><i class="bi bi-save" aria-hidden="true"></i> Save changes</button>
      <span class="stc-admin-hint">Changes go live on the homepage immediately after saving.</span>
    </div>
  </div>

  <aside class="stc-admin-preview">
    <p class="stc-admin-preview__label">Live preview (approximate)</p>
    <div class="stc-gallery-editor__preview" id="galPreviewGrid"></div>
  </aside>
</form>

<template id="imageRowTemplate">
  <div class="stc-admin-repeater__row stc-admin-repeater__row--stacked" data-row>
    <input type="hidden" name="images_id[]" value="0">
    <input type="hidden" name="images_existing[]" value="">
    <img class="stc-gallery-editor__thumb" src="" alt="" data-thumb hidden>
    <div class="stc-admin-grid-2">
      <div class="stc-admin-field">
        <label>Photo</label>
        <input type="file" name="images_file[]" accept="image/jpeg,image/png,image/webp" data-file-input>
      </div>
      <div class="stc-admin-field">
        <label>Category</label>
        <select name="images_category[]">
          <?php foreach ($categories as $key => $label): ?>
            <option value="<?php echo $key; ?>"><?php echo htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?></option>
          <?php endforeach; ?>
        </select>
      </div>
    </div>
    <div class="stc-admin-field"><label>Caption (optional)</label><input type="text" name="images_caption[]" maxlength="200"></div>
    <button type="button" class="stc-admin-repeater__remove" aria-label="Remove photo"><i class="bi bi-trash3" aria-hidden="true"></i></button>
  </div>
</template>

<link rel="stylesheet" href="<?php echo BASE_URL; ?>admin/assets/css/gallery-editor.css">
<script>window.STC_GALLERY_SAVE_URL = <?php echo json_encode(BASE_URL . 'admin/ajax/gallery-save.php'); ?>;</script>
<script src="<?php echo BASE_URL; ?>admin/assets/js/gallery-editor.js" defer></script>

<?php require __DIR__ . '/../includes/layout-foot.php'; ?>
