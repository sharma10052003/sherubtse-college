<?php
/**
 * academics/timetable.php — Programme-wise Timetable, with cascading
 * Programme -> Year -> Semester selectors. Implemented as progressive
 * enhancement: a plain GET form whose selects auto-submit on change
 * (JS) but that also works with a manual "Filter" click (no JS) — each
 * select's options narrow to what's actually valid for the previous
 * choice, computed server-side from stc_get_programme_timetable(), so
 * no separate AJAX endpoint is needed for a filter this small.
 */
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/models/AcademicResources.php';

function stc_selected(string $current, string $option): string
{
    return $current === $option ? ' selected' : '';
}

$selectedProgramme = isset($_GET['programme']) ? trim((string) $_GET['programme']) : '';
$selectedYear = isset($_GET['year']) ? trim((string) $_GET['year']) : '';
$selectedSemester = isset($_GET['semester']) ? trim((string) $_GET['semester']) : '';

$programmeOptions = stc_get_programme_options();

$yearOptions = [];
if ($selectedProgramme !== '') {
    foreach (stc_get_programme_timetable(['programme' => $selectedProgramme]) as $row) {
        if (!empty($row['year'])) {
            $yearOptions[$row['year']] = true;
        }
    }
    $yearOptions = array_keys($yearOptions);
    sort($yearOptions);
}

$semesterOptions = [];
if ($selectedProgramme !== '' && $selectedYear !== '') {
    foreach (stc_get_programme_timetable(['programme' => $selectedProgramme, 'year' => $selectedYear]) as $row) {
        if (!empty($row['semester'])) {
            $semesterOptions[$row['semester']] = true;
        }
    }
    $semesterOptions = array_keys($semesterOptions);
    sort($semesterOptions);
}

$results = $selectedProgramme !== '' ? stc_get_programme_timetable([
    'programme' => $selectedProgramme,
    'year'      => $selectedYear,
    'semester'  => $selectedSemester,
]) : [];

$stc_page_title = 'Programme Timetable — Sherubtse College';
$stc_page_description = 'Find your class timetable by programme, year and semester at Sherubtse College, Royal University of Bhutan.';
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
          <span class="text-ink font-medium">Programme Timetable</span>
        </div>
      </nav>

      <section class="py-12 md:py-16">
        <div class="max-w-(--container-page) mx-auto px-4 md:px-8 max-w-3xl">
          <p class="stc-faculty-section-eyebrow"><i class="bi bi-calendar-week" aria-hidden="true"></i> Sherubtse College</p>
          <h1 class="font-(family-name:--font-display) text-3xl md:text-4xl text-ink mb-8" data-reveal>Programme Timetable</h1>

          <form method="get" class="bg-white rounded-(--radius-lg) shadow-lg border border-line p-4 md:p-6 flex flex-col md:flex-row flex-wrap gap-3 md:items-center mb-10" id="stcTimetableForm">
            <select name="programme" class="stc-faculty-filters__select" aria-label="Select programme" onchange="this.form.submit()">
              <option value="">Select Programme&hellip;</option>
              <?php foreach ($programmeOptions as $prog): ?>
                <option value="<?php echo htmlspecialchars($prog['slug'] ?? '', ENT_QUOTES, 'UTF-8'); ?>"<?php echo stc_selected($selectedProgramme, $prog['slug'] ?? ''); ?>><?php echo htmlspecialchars($prog['programme_name'] ?? '', ENT_QUOTES, 'UTF-8'); ?></option>
              <?php endforeach; ?>
            </select>

            <select name="year" class="stc-faculty-filters__select" aria-label="Select year" onchange="this.form.submit()" <?php echo $yearOptions ? '' : 'disabled'; ?>>
              <option value="">Select Year&hellip;</option>
              <?php foreach ($yearOptions as $year): ?>
                <option value="<?php echo htmlspecialchars($year, ENT_QUOTES, 'UTF-8'); ?>"<?php echo stc_selected($selectedYear, $year); ?>><?php echo htmlspecialchars($year, ENT_QUOTES, 'UTF-8'); ?></option>
              <?php endforeach; ?>
            </select>

            <select name="semester" class="stc-faculty-filters__select" aria-label="Select semester" onchange="this.form.submit()" <?php echo $semesterOptions ? '' : 'disabled'; ?>>
              <option value="">Select Semester&hellip;</option>
              <?php foreach ($semesterOptions as $sem): ?>
                <option value="<?php echo htmlspecialchars($sem, ENT_QUOTES, 'UTF-8'); ?>"<?php echo stc_selected($selectedSemester, $sem); ?>><?php echo htmlspecialchars($sem, ENT_QUOTES, 'UTF-8'); ?></option>
              <?php endforeach; ?>
            </select>

            <noscript><button type="submit" class="stc-faculty-card__btn">Filter</button></noscript>
          </form>

          <?php if ($selectedProgramme === ''): ?>
            <p class="text-center text-ink-soft py-12">Select a programme above to view its timetable.</p>
          <?php elseif (!$results): ?>
            <p class="text-center text-ink-soft py-12">No timetable found for the selected criteria yet.</p>
          <?php else: ?>
            <ul class="space-y-3">
              <?php foreach ($results as $row): ?>
                <li class="flex items-center justify-between gap-4 border border-line rounded-(--radius-md) px-5 py-4">
                  <div>
                    <p class="font-medium text-ink"><?php echo htmlspecialchars($row['programme_name'], ENT_QUOTES, 'UTF-8'); ?></p>
                    <p class="text-sm text-ink-soft"><?php echo htmlspecialchars($row['year'] . ' · ' . $row['semester'], ENT_QUOTES, 'UTF-8'); ?></p>
                  </div>
                  <?php if (!empty($row['timetable_file_url'])): ?>
                    <a href="<?php echo htmlspecialchars($row['timetable_file_url'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener" class="stc-faculty-card__btn shrink-0"><i class="bi bi-file-earmark-pdf-fill" aria-hidden="true"></i> View</a>
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
