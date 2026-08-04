<?php
/**
 * homepage/gallery.php — Campus Gallery section (Homepage Module 3).
 * Requires config.php + db.php already included. Renders nothing if
 * there are no uploaded photos yet — see includes/models/Gallery.php.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../models/Gallery.php';

$galleryImages = stc_get_gallery_images();
if (empty($galleryImages)) {
    return;
}

$galleryContent = stc_get_gallery_content();
$categories = stc_gallery_categories();

// Only show filter tabs for categories that actually have photos.
$presentCategories = array_unique(array_column($galleryImages, 'category'));
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/homepage/gallery.css">

<section class="stc-gallery" aria-labelledby="stcGalleryTitle" id="gallery">
  <div class="stc-gallery__inner">
    <div class="stc-gallery__header">
      <p class="stc-gallery__eyebrow"><i class="bi bi-camera-fill" aria-hidden="true"></i> Campus Gallery</p>
      <h2 id="stcGalleryTitle" data-reveal><?php echo htmlspecialchars($galleryContent['title'], ENT_QUOTES, 'UTF-8'); ?></h2>
      <p class="stc-gallery__subtitle"><?php echo htmlspecialchars($galleryContent['subtitle'], ENT_QUOTES, 'UTF-8'); ?></p>
    </div>

    <?php if (count($presentCategories) > 1): ?>
    <div class="stc-gallery__filters" role="tablist" aria-label="Filter photos by category">
      <button type="button" class="is-active" data-filter="all" role="tab" aria-selected="true">All</button>
      <?php foreach ($categories as $key => $label): ?>
        <?php if (in_array($key, $presentCategories, true)): ?>
          <button type="button" data-filter="<?php echo htmlspecialchars($key, ENT_QUOTES, 'UTF-8'); ?>" role="tab" aria-selected="false">
            <?php echo htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?>
          </button>
        <?php endif; ?>
      <?php endforeach; ?>
    </div>
    <?php endif; ?>

    <div class="stc-gallery__masonry">
      <?php foreach ($galleryImages as $i => $image): ?>
        <?php $imgUrl = $image['image_path']; /* already a full Strapi media URL */ ?>
        <button type="button" class="stc-gallery__item" data-category="<?php echo htmlspecialchars($image['category'], ENT_QUOTES, 'UTF-8'); ?>" data-index="<?php echo $i; ?>" style="--i:<?php echo $i % 6; ?>">
          <img src="<?php echo htmlspecialchars($imgUrl, ENT_QUOTES, 'UTF-8'); ?>"
               alt="<?php echo htmlspecialchars((string) $image['caption'], ENT_QUOTES, 'UTF-8'); ?>"
               loading="lazy">
          <?php if (!empty($image['caption'])): ?>
            <span class="stc-gallery__item-caption"><?php echo htmlspecialchars($image['caption'], ENT_QUOTES, 'UTF-8'); ?></span>
          <?php endif; ?>
        </button>
      <?php endforeach; ?>
    </div>
  </div>

  <div class="stc-gallery__lightbox" id="stcLightbox" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
    <button type="button" class="stc-gallery__lightbox-close" id="stcLightboxClose" aria-label="Close photo viewer"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
    <button type="button" class="stc-gallery__lightbox-nav stc-gallery__lightbox-nav--prev" id="stcLightboxPrev" aria-label="Previous photo"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
    <figure class="stc-gallery__lightbox-figure">
      <img src="" alt="" id="stcLightboxImage">
      <figcaption id="stcLightboxCaption"></figcaption>
    </figure>
    <button type="button" class="stc-gallery__lightbox-nav stc-gallery__lightbox-nav--next" id="stcLightboxNext" aria-label="Next photo"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
  </div>
</section>

<script>
  window.STC_GALLERY_IMAGES = <?php echo json_encode(array_map(static function ($img) {
      return [
          'src' => $img['image_path'], // already a full Strapi media URL
          'caption' => (string) $img['caption'],
          'category' => $img['category'],
      ];
  }, $galleryImages), JSON_UNESCAPED_SLASHES); ?>;
</script>
<script src="<?php echo BASE_URL; ?>assets/js/homepage/gallery.js" defer></script>
