<?php
/**
 * pages/faculty.php — Faculty directory content (hero, stats, search &
 * filters, grid, featured section). Included by about/faculty.php after
 * header.php/theme.php. Data comes from includes/models/Faculty.php;
 * live filtering happens via ajax/faculty-list.php + assets/js/faculty/
 * faculty-list.js — this initial render is the no-JS/SEO baseline.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

require_once __DIR__ . '/../models/Faculty.php';

$settings = stc_get_faculty_setting();
$stats = stc_get_faculty_stats();
$filterOptions = stc_get_faculty_filter_options();
$grouped = stc_get_faculty_grouped();

$heroBgUrl = $settings['hero_background'] ?? '';
$cardsPerRow = max(2, min(4, (int) $settings['cards_per_row']));
$gridColsClass = ['2' => 'sm:grid-cols-2', '3' => 'sm:grid-cols-2 lg:grid-cols-3', '4' => 'sm:grid-cols-2 lg:grid-cols-4'][(string) $cardsPerRow] ?? 'sm:grid-cols-2 lg:grid-cols-3';
?>
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/tailwind.css">
<link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/faculty/faculty.css">

<article class="stc-faculty" id="stcFacultyArticle">

  <!-- Dynamic department-themed background effects (assets/js/faculty/faculty-list.js
       toggles which layer is active based on the department filter). Sits
       behind all content (see the z-index rules in faculty.css) — bold on
       purpose, it only shows through the page's empty space since every
       card has an opaque background. -->
  <div class="stc-faculty-bgfx" aria-hidden="true">
    <div class="stc-faculty-bgfx__layer stc-faculty-bgfx__layer--default is-active">
      <span class="stc-faculty-bgfx__blob"></span><span class="stc-faculty-bgfx__blob"></span><span class="stc-faculty-bgfx__blob"></span>
    </div>
    <div class="stc-faculty-bgfx__layer stc-faculty-bgfx__layer--natural">
      <span class="stc-faculty-bgfx__blob"></span><span class="stc-faculty-bgfx__blob"></span>
      <?php for ($i = 0; $i < 22; $i++): ?><span class="stc-faculty-bgfx__particle" style="--i:<?php echo $i; ?>"></span><?php endfor; ?>
    </div>
    <div class="stc-faculty-bgfx__layer stc-faculty-bgfx__layer--mds">
      <?php for ($i = 0; $i < 16; $i++): ?><span class="stc-faculty-bgfx__tri" style="--i:<?php echo $i; ?>"></span><?php endfor; ?>
      <?php for ($i = 0; $i < 8; $i++): ?><span class="stc-faculty-bgfx__node" style="--i:<?php echo $i; ?>"></span><?php endfor; ?>
    </div>
    <div class="stc-faculty-bgfx__layer stc-faculty-bgfx__layer--humanities">
      <span class="stc-faculty-bgfx__blob"></span><span class="stc-faculty-bgfx__blob"></span><span class="stc-faculty-bgfx__blob"></span>
    </div>
    <div class="stc-faculty-bgfx__layer stc-faculty-bgfx__layer--other">
      <span class="stc-faculty-bgfx__blob"></span><span class="stc-faculty-bgfx__blob"></span>
      <?php for ($i = 0; $i < 6; $i++): ?><span class="stc-faculty-bgfx__node" style="--i:<?php echo $i; ?>"></span><?php endfor; ?>
    </div>
  </div>

  <!-- Breadcrumb -->
  <nav class="stc-faculty__breadcrumb" aria-label="Breadcrumb">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8 py-3 text-sm flex items-center gap-2 text-ink-soft">
      <a href="<?php echo htmlspecialchars(BASE_URL, ENT_QUOTES, 'UTF-8'); ?>" class="hover:text-gold transition-colors">Home</a>
      <span aria-hidden="true">/</span>
      <a href="<?php echo htmlspecialchars(BASE_URL . 'about', ENT_QUOTES, 'UTF-8'); ?>" class="hover:text-gold transition-colors">About</a>
      <span aria-hidden="true">/</span>
      <span class="text-ink font-medium">Faculty</span>
    </div>
  </nav>

  <!-- Hero -->
  <section class="stc-faculty-hero" aria-labelledby="stcFacultyHeroTitle"<?php echo $heroBgUrl ? ' style="--stc-faculty-hero-bg:url(\'' . htmlspecialchars($heroBgUrl, ENT_QUOTES, 'UTF-8') . '\')"' : ''; ?>>
    <div class="stc-faculty-hero__pattern-border" aria-hidden="true"></div>
    <div class="stc-faculty-hero__mountains" aria-hidden="true">
      <svg viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" focusable="false">
        <path d="M0,300 L0,180 L180,90 L360,190 L560,60 L760,180 L960,80 L1160,190 L1320,120 L1440,170 L1440,300 Z" opacity="0.18"></path>
        <path d="M0,300 L0,230 L220,180 L440,240 L680,160 L900,220 L1120,150 L1440,210 L1440,300 Z" opacity="0.28"></path>
      </svg>
    </div>

    <div class="stc-faculty-hero__inner max-w-(--container-page) mx-auto px-4 md:px-8 grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
      <div class="stc-faculty-hero__content" data-reveal>
        <p class="stc-faculty-hero__eyebrow"><i class="bi bi-mortarboard-fill" aria-hidden="true"></i> Sherubtse College</p>
        <h1 id="stcFacultyHeroTitle" class="font-(family-name:--font-display) text-3xl md:text-5xl text-white leading-tight">Our Faculty</h1>
        <p class="mt-4 text-white/85 text-base md:text-lg max-w-xl">Meet the scholars, mentors and researchers shaping Bhutan's oldest seat of higher learning — across every department, from the humanities to the sciences.</p>

        <?php if ($settings['show_statistics']): ?>
        <div class="stc-faculty-hero__stats grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8" id="stcFacultyStats">
          <div class="stc-faculty-hero__stat">
            <span class="stc-counter" data-target="<?php echo (int) $stats['faculty_count']; ?>">0</span><span class="stc-faculty-hero__stat-suffix">+</span>
            <p>Faculty Members</p>
          </div>
          <div class="stc-faculty-hero__stat">
            <span class="stc-counter" data-target="<?php echo (int) $stats['department_count']; ?>">0</span>
            <p>Departments</p>
          </div>
          <div class="stc-faculty-hero__stat">
            <span class="stc-counter" data-target="<?php echo (int) $stats['student_count']; ?>">0</span><span class="stc-faculty-hero__stat-suffix">+</span>
            <p>Students</p>
          </div>
          <div class="stc-faculty-hero__stat">
            <span class="stc-counter" data-target="<?php echo (int) $stats['research_count']; ?>">0</span><span class="stc-faculty-hero__stat-suffix">+</span>
            <p>Research Papers</p>
          </div>
        </div>
        <?php endif; ?>
      </div>

      <div class="stc-faculty-hero__art" aria-hidden="true" data-reveal-variant="right">
        <div class="stc-faculty-hero__emblem">
          <span class="stc-faculty-hero__emblem-ring"></span>
          <i class="bi bi-mortarboard-fill"></i>
        </div>
      </div>
    </div>
  </section>

  <!-- Search & Filters -->
  <section class="stc-faculty-filters" aria-label="Search and filter faculty">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8 -mt-8 md:-mt-10 relative z-10">
      <div class="bg-white rounded-(--radius-lg) shadow-lg border border-line p-4 md:p-6 flex flex-col md:flex-row flex-wrap gap-3 md:items-center" id="stcFacultyFilterBar">
        <div class="relative flex-1 min-w-[200px]">
          <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden="true"></i>
          <label for="stcFacultySearch" class="sr-only">Search faculty</label>
          <input type="search" id="stcFacultySearch" placeholder="Search by name, position or research area&hellip;"
                 class="w-full pl-11 pr-4 py-3 rounded-(--radius-md) border border-line bg-cream-alt/60 focus:outline-none focus:ring-2 focus:ring-gold text-ink">
        </div>

        <select id="stcFacultyDepartment" class="stc-faculty-filters__select" aria-label="Filter by department">
          <option value="">All Departments</option>
          <?php foreach ($filterOptions['departments'] as $dept): ?>
            <option value="<?php echo htmlspecialchars($dept['slug'] ?? '', ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($dept['department_name'], ENT_QUOTES, 'UTF-8'); ?></option>
          <?php endforeach; ?>
        </select>

        <select id="stcFacultyPosition" class="stc-faculty-filters__select" aria-label="Filter by position">
          <option value="">All Positions</option>
          <?php foreach ($filterOptions['positions'] as $pos): ?>
            <option value="<?php echo htmlspecialchars($pos, ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($pos, ENT_QUOTES, 'UTF-8'); ?></option>
          <?php endforeach; ?>
        </select>

        <select id="stcFacultyQualification" class="stc-faculty-filters__select" aria-label="Filter by qualification">
          <option value="">All Qualifications</option>
          <?php foreach ($filterOptions['qualifications'] as $q): ?>
            <option value="<?php echo htmlspecialchars($q, ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($q, ENT_QUOTES, 'UTF-8'); ?></option>
          <?php endforeach; ?>
        </select>

        <select id="stcFacultyResearchArea" class="stc-faculty-filters__select" aria-label="Filter by research area">
          <option value="">All Research Areas</option>
          <?php foreach ($filterOptions['research_areas'] as $ra): ?>
            <option value="<?php echo htmlspecialchars($ra, ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($ra, ENT_QUOTES, 'UTF-8'); ?></option>
          <?php endforeach; ?>
        </select>
      </div>
    </div>
  </section>

  <!-- Department Heads -->
  <section class="stc-faculty-grid-section stc-faculty-heads-section py-10 md:py-14" aria-labelledby="stcFacultyHeadsTitle" id="stcFacultyHeadsSection"<?php echo $grouped['heads'] ? '' : ' hidden'; ?>>
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8">
      <p class="stc-faculty-section-eyebrow"><i class="bi bi-award-fill" aria-hidden="true"></i> Leadership</p>
      <h2 id="stcFacultyHeadsTitle" class="font-(family-name:--font-display) text-2xl md:text-3xl text-ink mb-8" data-reveal>Department Heads</h2>
      <div id="stcFacultyHeadsGrid" class="grid gap-6 <?php echo htmlspecialchars($gridColsClass, ENT_QUOTES, 'UTF-8'); ?>">
        <?php foreach ($grouped['heads'] as $f): ?>
          <?php include __DIR__ . '/../partials/faculty-card.php'; ?>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <!-- Faculty Grid, grouped department-wise -->
  <section class="stc-faculty-grid-section py-14 md:py-20 bg-cream-alt/40" aria-labelledby="stcFacultyGridTitle">
    <div class="max-w-(--container-page) mx-auto px-4 md:px-8">
      <p class="stc-faculty-section-eyebrow"><i class="bi bi-people-fill" aria-hidden="true"></i> Directory</p>
      <h2 id="stcFacultyGridTitle" class="font-(family-name:--font-display) text-2xl md:text-3xl text-ink mb-8" data-reveal>All Faculty Members</h2>

      <div id="stcFacultyResultsCount" class="text-sm text-ink-soft mb-4" aria-live="polite"><?php echo (int) $grouped['total']; ?> faculty member<?php echo $grouped['total'] === 1 ? '' : 's'; ?> found</div>

      <div id="stcFacultySkeleton" class="grid gap-6 <?php echo htmlspecialchars($gridColsClass, ENT_QUOTES, 'UTF-8'); ?>" hidden aria-hidden="true">
        <?php for ($i = 0; $i < 6; $i++): ?>
          <div class="stc-faculty-card-skeleton"></div>
        <?php endfor; ?>
      </div>

      <div id="stcFacultyGroups" data-cols="<?php echo htmlspecialchars($gridColsClass, ENT_QUOTES, 'UTF-8'); ?>">
        <?php if ($grouped['groups']): ?>
          <?php foreach ($grouped['groups'] as $group): ?>
            <div class="stc-faculty-dept-group">
              <h3 class="stc-faculty-dept-heading">
                <i class="bi bi-building" aria-hidden="true"></i>
                <?php if (!empty($group['slug'])): ?>
                  <a href="<?php echo htmlspecialchars(BASE_URL . 'about/faculty/department/' . rawurlencode($group['slug']), ENT_QUOTES, 'UTF-8'); ?>"><?php echo htmlspecialchars($group['name'], ENT_QUOTES, 'UTF-8'); ?></a>
                <?php else: ?>
                  <?php echo htmlspecialchars($group['name'], ENT_QUOTES, 'UTF-8'); ?>
                <?php endif; ?>
              </h3>
              <div class="grid gap-6 <?php echo htmlspecialchars($gridColsClass, ENT_QUOTES, 'UTF-8'); ?>">
                <?php foreach ($group['members'] as $f): ?>
                  <?php include __DIR__ . '/../partials/faculty-card.php'; ?>
                <?php endforeach; ?>
              </div>
            </div>
          <?php endforeach; ?>
        <?php else: ?>
          <p class="col-span-full text-center text-ink-soft py-12">Faculty profiles will appear here once added from the admin panel.</p>
        <?php endif; ?>
      </div>

      <p id="stcFacultyEmptyState" class="text-center text-ink-soft py-12" hidden>No faculty members match your search. Try different filters.</p>
    </div>
  </section>

</article>

<script>
  window.STC_FACULTY_AJAX_URL = <?php echo json_encode(BASE_URL . 'ajax/faculty-list.php'); ?>;
  window.STC_FACULTY_PROFILE_BASE = <?php echo json_encode(BASE_URL . 'about/faculty/'); ?>;
</script>
<script src="<?php echo BASE_URL; ?>assets/js/faculty/faculty-list.js" defer></script>
