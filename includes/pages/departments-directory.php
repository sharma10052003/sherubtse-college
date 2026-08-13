<?php
/**
 * pages/departments-directory.php — /departments grid content.
 * Data from stc_get_department_directory() (includes/models/Department.php).
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../models/Department.php';

$departments = stc_get_department_directory();
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/tailwind.css">
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/faculty.css">

<article class="stc-faculty">

  <!-- Breadcrumb -->
  <nav class="stc-faculty__breadcrumb" aria-label="Breadcrumb">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8 py-3 text-sm flex items-center gap-2 text-ink-soft">
      <a href="<?php echo htmlspecialchars(BASE_URL, ENT_QUOTES, 'UTF-8'); ?>" class="hover:text-gold transition-colors">Home</a>
      <span aria-hidden="true">/</span>
      <span class="text-ink font-medium">Departments</span>
    </div>
  </nav>

  <section class="py-12 md:py-16">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8">
      <p class="stc-faculty-section-eyebrow"><i class="bi bi-mortarboard-fill" aria-hidden="true"></i> Sherubtse College</p>
      <h1 class="font-(family-name:--font-display) text-3xl md:text-4xl text-ink mb-4" data-reveal>Our Departments</h1>
      <p class="text-ink-soft max-w-2xl mb-10" data-reveal>Three academic departments shaping Bhutan's oldest seat of higher learning — each with its own faculty, programmes and research focus.</p>

      <?php if ($departments): ?>
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <?php foreach ($departments as $dept): ?>
            <a href="<?php echo htmlspecialchars(BASE_URL . 'departments/' . rawurlencode($dept['slug'] ?? ''), ENT_QUOTES, 'UTF-8'); ?>"
               class="group block rounded-(--radius-lg) overflow-hidden border border-line bg-white shadow-sm hover:shadow-lg transition-shadow" data-reveal>
              <div class="aspect-16/9 bg-cream-alt overflow-hidden">
                <?php if (!empty($dept['banner_image_url'])): ?>
                  <img src="<?php echo htmlspecialchars($dept['banner_image_url'], ENT_QUOTES, 'UTF-8'); ?>" alt="" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <?php else: ?>
                  <div class="w-full h-full flex items-center justify-center text-ink-soft"><i class="bi bi-building text-4xl" aria-hidden="true"></i></div>
                <?php endif; ?>
              </div>
              <div class="p-6">
                <h2 class="font-(family-name:--font-display) text-xl text-ink mb-2 group-hover:text-gold transition-colors"><?php echo htmlspecialchars($dept['department_name'] ?? '', ENT_QUOTES, 'UTF-8'); ?></h2>
                <?php if (!empty($dept['short_description'])): ?>
                  <p class="text-ink-soft text-sm line-clamp-3"><?php echo htmlspecialchars($dept['short_description'], ENT_QUOTES, 'UTF-8'); ?></p>
                <?php endif; ?>
                <span class="inline-flex items-center gap-1.5 text-gold text-sm font-medium mt-4">Explore Department <i class="bi bi-arrow-right" aria-hidden="true"></i></span>
              </div>
            </a>
          <?php endforeach; ?>
        </div>
      <?php else: ?>
        <p class="text-center text-ink-soft py-12">Departments will appear here once added from the admin panel.</p>
      <?php endif; ?>
    </div>
  </section>

</article>
