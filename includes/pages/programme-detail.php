<?php
/**
 * pages/programme-detail.php — reusable programme detail content.
 * Included by programmes/detail.php, which already fetched $programme
 * (see stc_get_programme_by_slug() in models/Programme.php) and confirmed
 * it's non-null before including this file. Curriculum and FAQ sections
 * use native <details>/<summary> accordions — no JS needed, works with
 * reduced motion and without JS by default (browser-native disclosure).
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../models/Programme.php';

$p = $programme;
$related = stc_get_related_programmes($p['department_slug'], $p['slug'], 3);

function stc_programme_prose(?string $text): string
{
    return $text ? '<p class="stc-faculty-prose">' . nl2br(htmlspecialchars($text, ENT_QUOTES, 'UTF-8')) . '</p>' : '';
}
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/tailwind.css">
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/faculty.css">

<article class="stc-faculty">

  <!-- Breadcrumb -->
  <nav class="stc-faculty__breadcrumb" aria-label="Breadcrumb">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8 py-3 text-sm flex items-center gap-2 text-ink-soft">
      <a href="<?php echo htmlspecialchars(BASE_URL, ENT_QUOTES, 'UTF-8'); ?>" class="hover:text-gold transition-colors">Home</a>
      <span aria-hidden="true">/</span>
      <a href="<?php echo htmlspecialchars(BASE_URL . 'programmes', ENT_QUOTES, 'UTF-8'); ?>" class="hover:text-gold transition-colors">Programmes</a>
      <span aria-hidden="true">/</span>
      <span class="text-ink font-medium"><?php echo htmlspecialchars($p['programme_name'], ENT_QUOTES, 'UTF-8'); ?></span>
    </div>
  </nav>

  <!-- Hero -->
  <section class="relative overflow-hidden bg-maroon text-white">
    <?php if (!empty($p['hero_image_url'])): ?>
      <img src="<?php echo htmlspecialchars($p['hero_image_url'], ENT_QUOTES, 'UTF-8'); ?>" alt="" aria-hidden="true" class="absolute inset-0 w-full h-full object-cover opacity-30">
    <?php endif; ?>
    <div class="relative max-w-(--container-page) mx-auto px-4 md:px-8 py-14 md:py-20">
      <?php if (!empty($p['level'])): ?>
        <p class="uppercase tracking-wide text-sm font-semibold text-gold-light mb-3"><?php echo htmlspecialchars(ucfirst($p['level']), ENT_QUOTES, 'UTF-8'); ?><?php echo $p['degree_type'] ? ' · ' . htmlspecialchars($p['degree_type'], ENT_QUOTES, 'UTF-8') : ''; ?></p>
      <?php endif; ?>
      <h1 class="font-(family-name:--font-display) text-3xl md:text-5xl leading-tight" data-reveal><?php echo htmlspecialchars($p['programme_name'], ENT_QUOTES, 'UTF-8'); ?></h1>
      <?php if (!empty($p['short_description'])): ?>
        <p class="mt-4 text-white/85 max-w-2xl text-base md:text-lg"><?php echo htmlspecialchars($p['short_description'], ENT_QUOTES, 'UTF-8'); ?></p>
      <?php endif; ?>
      <div class="flex flex-wrap gap-4 mt-8">
        <?php if (!empty($p['department_name'])): ?>
          <a href="<?php echo htmlspecialchars(BASE_URL . 'departments/' . rawurlencode($p['department_slug']), ENT_QUOTES, 'UTF-8'); ?>" class="stc-dept-hero__meta-item"><i class="bi bi-building" aria-hidden="true"></i> <?php echo htmlspecialchars($p['department_name'], ENT_QUOTES, 'UTF-8'); ?></a>
        <?php endif; ?>
        <?php if (!empty($p['duration'])): ?>
          <span class="stc-dept-hero__meta-item"><i class="bi bi-clock-history" aria-hidden="true"></i> <?php echo htmlspecialchars($p['duration'], ENT_QUOTES, 'UTF-8'); ?></span>
        <?php endif; ?>
      </div>
    </div>
  </section>

  <div class="max-w-(--container-page) mx-auto px-4 md:px-8 py-12 md:py-16 grid gap-14 lg:grid-cols-[1fr_320px]">
    <div class="min-w-0">

      <?php if (!empty($p['overview']) || !empty($p['about'])): ?>
      <section class="mb-12" data-reveal>
        <?php if (!empty($p['overview'])): ?>
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-info-circle-fill" aria-hidden="true"></i> Overview</p>
          <?php echo stc_programme_prose($p['overview']); ?>
        <?php endif; ?>
        <?php if (!empty($p['about'])): ?>
          <?php echo stc_programme_prose($p['about']); ?>
        <?php endif; ?>
      </section>
      <?php endif; ?>

      <?php if (!empty($p['objectives'])): ?>
      <section class="mb-12" data-reveal>
        <p class="stc-faculty-section-eyebrow"><i class="bi bi-bullseye" aria-hidden="true"></i> Objectives</p>
        <?php echo stc_programme_prose($p['objectives']); ?>
      </section>
      <?php endif; ?>

      <?php if (!empty($p['learning_outcomes'])): ?>
      <section class="mb-12" data-reveal>
        <p class="stc-faculty-section-eyebrow"><i class="bi bi-check2-circle" aria-hidden="true"></i> Learning Outcomes</p>
        <?php echo stc_programme_prose($p['learning_outcomes']); ?>
      </section>
      <?php endif; ?>

      <?php if (!empty($p['curriculum'])): ?>
      <section class="mb-12" data-reveal>
        <p class="stc-faculty-section-eyebrow"><i class="bi bi-journal-bookmark-fill" aria-hidden="true"></i> Curriculum</p>
        <div class="mt-4 space-y-3">
          <?php foreach ($p['curriculum'] as $block): ?>
            <details class="border border-line rounded-(--radius-md) group">
              <summary class="cursor-pointer list-none flex items-center justify-between px-5 py-4 font-medium text-ink">
                <span><?php echo htmlspecialchars($block['label'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
                <i class="bi bi-chevron-down transition-transform group-open:rotate-180" aria-hidden="true"></i>
              </summary>
              <div class="px-5 pb-4 stc-faculty-prose"><?php echo nl2br(htmlspecialchars($block['courses'] ?? '', ENT_QUOTES, 'UTF-8')); ?></div>
            </details>
          <?php endforeach; ?>
        </div>
      </section>
      <?php endif; ?>

      <?php if (!empty($p['admission_requirements'])): ?>
      <section class="mb-12" data-reveal>
        <p class="stc-faculty-section-eyebrow"><i class="bi bi-clipboard-check-fill" aria-hidden="true"></i> Admission Requirements</p>
        <?php echo stc_programme_prose($p['admission_requirements']); ?>
      </section>
      <?php endif; ?>

      <?php if (!empty($p['career_opportunities'])): ?>
      <section class="mb-12" data-reveal>
        <p class="stc-faculty-section-eyebrow"><i class="bi bi-briefcase-fill" aria-hidden="true"></i> Career Opportunities</p>
        <?php echo stc_programme_prose($p['career_opportunities']); ?>
      </section>
      <?php endif; ?>

      <?php if (!empty($p['further_study'])): ?>
      <section class="mb-12" data-reveal>
        <p class="stc-faculty-section-eyebrow"><i class="bi bi-arrow-up-right-circle-fill" aria-hidden="true"></i> Further Study</p>
        <?php echo stc_programme_prose($p['further_study']); ?>
      </section>
      <?php endif; ?>

      <?php if (!empty($p['faqs'])): ?>
      <section class="mb-4" data-reveal>
        <p class="stc-faculty-section-eyebrow"><i class="bi bi-question-circle-fill" aria-hidden="true"></i> Frequently Asked Questions</p>
        <div class="mt-4 space-y-3">
          <?php foreach ($p['faqs'] as $faq): ?>
            <details class="border border-line rounded-(--radius-md) group">
              <summary class="cursor-pointer list-none flex items-center justify-between px-5 py-4 font-medium text-ink">
                <span><?php echo htmlspecialchars($faq['question'] ?? '', ENT_QUOTES, 'UTF-8'); ?></span>
                <i class="bi bi-chevron-down transition-transform group-open:rotate-180" aria-hidden="true"></i>
              </summary>
              <div class="px-5 pb-4 stc-faculty-prose"><?php echo nl2br(htmlspecialchars($faq['answer'] ?? '', ENT_QUOTES, 'UTF-8')); ?></div>
            </details>
          <?php endforeach; ?>
        </div>
      </section>
      <?php endif; ?>

    </div>

    <!-- Related programmes -->
    <?php if ($related): ?>
    <aside class="lg:pl-4">
      <p class="stc-faculty-section-eyebrow"><i class="bi bi-collection-fill" aria-hidden="true"></i> Related Programmes</p>
      <div class="mt-4 space-y-4">
        <?php foreach ($related as $rp): ?>
          <a href="<?php echo htmlspecialchars(BASE_URL . 'programmes/' . rawurlencode($rp['slug']), ENT_QUOTES, 'UTF-8'); ?>" class="block rounded-(--radius-md) border border-line p-4 hover:shadow-md transition-shadow">
            <h3 class="font-(family-name:--font-display) text-base text-ink"><?php echo htmlspecialchars($rp['programme_name'], ENT_QUOTES, 'UTF-8'); ?></h3>
            <?php if ($rp['duration']): ?><p class="text-xs text-ink-soft mt-1"><?php echo htmlspecialchars($rp['duration'], ENT_QUOTES, 'UTF-8'); ?></p><?php endif; ?>
          </a>
        <?php endforeach; ?>
      </div>
    </aside>
    <?php endif; ?>
  </div>

</article>
