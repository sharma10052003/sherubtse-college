<?php
/**
 * pages/programmes.php — Programmes catalogue content (hero, search &
 * filters, grid). Included by programmes/index.php after header.php/
 * theme.php. Data from includes/models/Programme.php; live filtering
 * happens via ajax/programmes-list.php + assets/js/programmes/
 * programmes-list.js — this initial render is the no-JS/SEO baseline.
 * Directly modeled on pages/faculty.php.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../models/Programme.php';

$filterOptions = stc_get_programme_filter_options();
$programmes = stc_get_programme_list();
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/tailwind.css">
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/faculty.css">

<article class="stc-faculty" id="stcProgrammesArticle">

  <!-- Breadcrumb -->
  <nav class="stc-faculty__breadcrumb" aria-label="Breadcrumb">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8 py-3 text-sm flex items-center gap-2 text-ink-soft">
      <a href="<?php echo htmlspecialchars(BASE_URL, ENT_QUOTES, 'UTF-8'); ?>" class="hover:text-gold transition-colors">Home</a>
      <span aria-hidden="true">/</span>
      <span class="text-ink font-medium">Programmes</span>
    </div>
  </nav>

  <section class="py-10 md:py-14">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8">
      <p class="stc-faculty-section-eyebrow"><i class="bi bi-mortarboard-fill" aria-hidden="true"></i> Sherubtse College</p>
      <h1 class="font-(family-name:--font-display) text-3xl md:text-4xl text-ink mb-4" data-reveal>Programmes</h1>
      <p class="text-ink-soft max-w-2xl" data-reveal>Undergraduate and postgraduate programmes across our three departments — search or filter to find the right one.</p>
    </div>
  </section>

  <!-- Search & Filters -->
  <section class="stc-faculty-filters" aria-label="Search and filter programmes">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8 relative z-10">
      <div class="bg-white rounded-(--radius-lg) shadow-lg border border-line p-4 md:p-6 flex flex-col md:flex-row flex-wrap gap-3 md:items-center" id="stcProgrammeFilterBar">
        <div class="relative flex-1 min-w-[200px]">
          <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden="true"></i>
          <label for="stcProgrammeSearch" class="sr-only">Search programmes</label>
          <input type="search" id="stcProgrammeSearch" placeholder="Search by programme or degree&hellip;"
                 class="w-full pl-11 pr-4 py-3 rounded-(--radius-md) border border-line bg-cream-alt/60 focus:outline-none focus:ring-2 focus:ring-gold text-ink">
        </div>

        <select id="stcProgrammeDepartment" class="stc-faculty-filters__select" aria-label="Filter by department">
          <option value="">All Departments</option>
          <?php foreach ($filterOptions['departments'] as $dept): ?>
            <option value="<?php echo htmlspecialchars($dept['slug'] ?? '', ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($dept['department_name'], ENT_QUOTES, 'UTF-8'); ?></option>
          <?php endforeach; ?>
        </select>

        <select id="stcProgrammeLevel" class="stc-faculty-filters__select" aria-label="Filter by level">
          <option value="">All Levels</option>
          <?php foreach ($filterOptions['levels'] as $value => $label): ?>
            <option value="<?php echo htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?></option>
          <?php endforeach; ?>
        </select>
      </div>
    </div>
  </section>

  <!-- Results -->
  <section class="py-10 md:py-14">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8">
      <p class="text-sm text-ink-soft mb-6" id="stcProgrammeResultsCount"><?php echo count($programmes); ?> programme<?php echo count($programmes) === 1 ? '' : 's'; ?> found</p>

      <div id="stcProgrammeSkeleton" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" hidden>
        <?php for ($i = 0; $i < 6; $i++): ?><div class="h-48 rounded-(--radius-lg) bg-cream-alt animate-pulse"></div><?php endfor; ?>
      </div>

      <div id="stcProgrammeGrid" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <?php foreach ($programmes as $p): ?>
          <?php include __DIR__ . '/../partials/programme-card.php'; ?>
        <?php endforeach; ?>
      </div>

      <div id="stcProgrammeEmptyState" class="text-center text-ink-soft py-16" <?php echo $programmes ? 'hidden' : ''; ?>>
        <i class="bi bi-search text-3xl mb-3 block" aria-hidden="true"></i>
        No programmes match your search. Try a different keyword or filter.
      </div>
    </div>
  </section>

</article>

<script>
  window.STC_PROGRAMMES_AJAX_URL = <?php echo json_encode(BASE_URL . 'ajax/programmes-list.php'); ?>;
  window.STC_PROGRAMME_DETAIL_BASE = <?php echo json_encode(BASE_URL . 'programmes/'); ?>;
</script>
<script src="<?php echo BASE_URL; ?>assets/js/programmes/programmes-list.js" defer></script>
