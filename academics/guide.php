<?php
/**
 * academics/guide.php — Academic Guide. Reachable as /academics/guide
 * via the root .htaccess generic rewrite rule. Self-contained page, same
 * pattern as academics/calendar.php.
 */
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/models/AcademicResources.php';

$guide = stc_get_academic_guide();

$stc_page_title = ($guide['title'] ?? 'Academic Guide') . ' — Sherubtse College';
$stc_page_description = 'Academic guide and student handbook for Sherubtse College, Royal University of Bhutan.';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($stc_page_title, ENT_QUOTES, 'UTF-8'); ?></title>
  <meta name="description" content="<?php echo htmlspecialchars($stc_page_description, ENT_QUOTES, 'UTF-8'); ?>">
  <meta name="theme-color" content="#7A1B2B">
  <link rel="icon" href="<?php echo htmlspecialchars($stc_brand['favicon'], ENT_QUOTES, 'UTF-8'); ?>">
</head>
<body>

  <?php include __DIR__ . '/../includes/header.php'; ?>
  <?php include __DIR__ . '/../includes/theme.php'; ?>

  <main id="main-content">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/tailwind.css">
    <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/faculty.css">

    <article class="stc-faculty">
      <nav class="stc-faculty__breadcrumb" aria-label="Breadcrumb">
        <div class="max-w-(--container-page) mx-auto px-4 md:px-8 py-3 text-sm flex items-center gap-2 text-ink-soft">
          <a href="<?php echo htmlspecialchars(BASE_URL, ENT_QUOTES, 'UTF-8'); ?>" class="hover:text-gold transition-colors">Home</a>
          <span aria-hidden="true">/</span>
          <span class="text-ink font-medium">Academic Guide</span>
        </div>
      </nav>

      <section class="py-12 md:py-16">
        <div class="max-w-(--container-page) mx-auto px-4 md:px-8 max-w-3xl">
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-book" aria-hidden="true"></i> Sherubtse College</p>
          <h1 class="font-(family-name:--font-display) text-3xl md:text-4xl text-ink mb-8" data-reveal><?php echo htmlspecialchars($guide['title'] ?? 'Academic Guide', ENT_QUOTES, 'UTF-8'); ?></h1>

          <?php if ($guide): ?>
            <?php if (!empty($guide['description'])): ?>
              <p class="stc-faculty-prose mb-8"><?php echo nl2br(htmlspecialchars($guide['description'], ENT_QUOTES, 'UTF-8')); ?></p>
            <?php endif; ?>
            <?php if (!empty($guide['guide_pdf_url'])): ?>
              <a href="<?php echo htmlspecialchars($guide['guide_pdf_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener" class="stc-faculty-card__btn inline-flex">
                <i class="bi bi-file-earmark-pdf-fill" aria-hidden="true"></i> Download Academic Guide
              </a>
            <?php endif; ?>
          <?php else: ?>
            <p class="text-center text-ink-soft py-12">The academic guide will appear here once added from the admin panel.</p>
          <?php endif; ?>
        </div>
      </section>
    </article>
  </main>

  <?php include __DIR__ . '/../includes/footer.php'; ?>

</body>
</html>
