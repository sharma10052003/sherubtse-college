<?php
/**
 * academics/reassessment-timetable.php — Reassessment Timetable, with a
 * simple server-rendered filter (programme, semester). No AJAX needed —
 * the dataset is small, same reasoning as academics/timetable.php.
 */
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/models/AcademicResources.php';

function stc_reassessment_selected(string $current, string $option): string
{
    return $current === $option ? ' selected' : '';
}

$selectedProgramme = isset($_GET['programme']) ? trim((string) $_GET['programme']) : '';
$selectedSemester = isset($_GET['semester']) ? trim((string) $_GET['semester']) : '';

$programmeOptions = stc_get_programme_options();

$semesterOptions = [];
foreach (stc_get_reassessment_timetable() as $row) {
    if (!empty($row['semester'])) {
        $semesterOptions[$row['semester']] = true;
    }
}
$semesterOptions = array_keys($semesterOptions);
sort($semesterOptions);

$results = stc_get_reassessment_timetable([
    'programme' => $selectedProgramme,
    'semester'  => $selectedSemester,
]);

$stc_page_title = 'Reassessment Timetable — Sherubtse College';
$stc_page_description = 'Reassessment examination timetable for Sherubtse College, Royal University of Bhutan.';
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
          <span class="text-ink font-medium">Reassessment Timetable</span>
        </div>
      </nav>

      <section class="py-12 md:py-16">
        <div class="max-w-(--container-page) mx-auto px-4 md:px-8 max-w-3xl">
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-clipboard-check" aria-hidden="true"></i> Sherubtse College</p>
          <h1 class="font-(family-name:--font-display) text-3xl md:text-4xl text-ink mb-8" data-reveal>Reassessment Timetable</h1>

          <form method="get" class="bg-white rounded-(--radius-lg) shadow-lg border border-line p-4 md:p-6 flex flex-col md:flex-row flex-wrap gap-3 md:items-center mb-10" id="stcReassessmentForm">
            <select name="programme" class="stc-faculty-filters__select" aria-label="Filter by programme" onchange="this.form.submit()">
              <option value="">All Programmes</option>
              <?php foreach ($programmeOptions as $prog): ?>
                <option value="<?php echo htmlspecialchars($prog['slug'] ?? '', ENT_QUOTES, 'UTF-8'); ?>"<?php echo stc_reassessment_selected($selectedProgramme, $prog['slug'] ?? ''); ?>><?php echo htmlspecialchars($prog['programme_name'] ?? '', ENT_QUOTES, 'UTF-8'); ?></option>
              <?php endforeach; ?>
            </select>

            <select name="semester" class="stc-faculty-filters__select" aria-label="Filter by semester" onchange="this.form.submit()">
              <option value="">All Semesters</option>
              <?php foreach ($semesterOptions as $sem): ?>
                <option value="<?php echo htmlspecialchars($sem, ENT_QUOTES, 'UTF-8'); ?>"<?php echo stc_reassessment_selected($selectedSemester, $sem); ?>><?php echo htmlspecialchars($sem, ENT_QUOTES, 'UTF-8'); ?></option>
              <?php endforeach; ?>
            </select>

            <noscript><button type="submit" class="stc-faculty-card__btn">Filter</button></noscript>
          </form>

          <?php if (!$results): ?>
            <p class="text-center text-ink-soft py-12">No reassessment timetable entries match your filter yet.</p>
          <?php else: ?>
            <ul class="space-y-3">
              <?php foreach ($results as $row): ?>
                <li class="flex items-center justify-between gap-4 border border-line rounded-(--radius-md) px-5 py-4">
                  <div>
                    <p class="font-medium text-ink"><?php echo htmlspecialchars($row['title'] ?? '', ENT_QUOTES, 'UTF-8'); ?></p>
                    <p class="text-sm text-ink-soft"><?php echo htmlspecialchars(trim(($row['programme_name'] ?? '') . (!empty($row['programme_name']) && !empty($row['semester']) ? ' · ' : '') . ($row['semester'] ?? '')), ENT_QUOTES, 'UTF-8'); ?></p>
                  </div>
                  <?php if (!empty($row['document_url'])): ?>
                    <a href="<?php echo htmlspecialchars($row['document_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener" class="stc-faculty-card__btn shrink-0"><i class="bi bi-file-earmark-pdf-fill" aria-hidden="true"></i> View</a>
                  <?php endif; ?>
                </li>
              <?php endforeach; ?>
            </ul>
          <?php endif; ?>
        </div>
      </section>
    </article>
  </main>

  <?php include __DIR__ . '/../includes/footer.php'; ?>

</body>
</html>
