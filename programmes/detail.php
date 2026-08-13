<?php
/**
 * programmes/detail.php — reusable programme detail template
 * (/programmes/{slug}). Mirrors about/faculty-profile.php's structure.
 */
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/models/Programme.php';

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';
$programme = $slug !== '' ? stc_get_programme_by_slug($slug) : null;

if (!$programme) {
    http_response_code(404);
}

$stc_page_title = $programme
    ? $programme['programme_name'] . ' — Sherubtse College'
    : 'Programme Not Found — Sherubtse College';
$stc_page_description = $programme
    ? ($programme['seo_description'] ?: mb_substr((string) ($programme['short_description'] ?? ''), 0, 300))
    : 'This programme could not be found.';

$stc_scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$stc_host = $_SERVER['HTTP_HOST'] ?? 'sherubtse.edu.bt';
$stc_canonical = $stc_scheme . $stc_host . BASE_URL . 'programmes/' . rawurlencode($slug);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($programme['seo_title'] ?? $stc_page_title, ENT_QUOTES, 'UTF-8'); ?></title>
  <meta name="description" content="<?php echo htmlspecialchars($stc_page_description, ENT_QUOTES, 'UTF-8'); ?>">
  <link rel="canonical" href="<?php echo htmlspecialchars($stc_canonical, ENT_QUOTES, 'UTF-8'); ?>">
  <meta name="theme-color" content="#7A1B2B">
  <link rel="icon" href="<?php echo htmlspecialchars($stc_brand['favicon'], ENT_QUOTES, 'UTF-8'); ?>">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Sherubtse College">
  <meta property="og:title" content="<?php echo htmlspecialchars($stc_page_title, ENT_QUOTES, 'UTF-8'); ?>">
  <meta property="og:description" content="<?php echo htmlspecialchars($stc_page_description, ENT_QUOTES, 'UTF-8'); ?>">
  <meta property="og:url" content="<?php echo htmlspecialchars($stc_canonical, ENT_QUOTES, 'UTF-8'); ?>">

  <script>
    (function () {
      try {
        var stored = window.localStorage.getItem('stc-theme');
        var wantsDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (wantsDark) document.documentElement.setAttribute('data-theme', 'dark');
      } catch (e) { /* private mode / storage blocked */ }
    })();
  </script>
</head>
<body>

  <?php include __DIR__ . '/../includes/header.php'; ?>
  <?php include __DIR__ . '/../includes/theme.php'; ?>

  <main id="main-content">
    <?php if ($programme): ?>
      <?php include __DIR__ . '/../includes/pages/programme-detail.php'; ?>
    <?php else: ?>
      <section class="stc-faculty-notfound">
        <div class="stc-faculty-notfound__inner">
          <h1>Programme Not Found</h1>
          <p>We couldn't find a programme at this address. It may have been removed, or the link may be incorrect.</p>
          <a href="<?php echo htmlspecialchars(BASE_URL . 'programmes', ENT_QUOTES, 'UTF-8'); ?>" class="stc-faculty-notfound__btn">Back to Programmes</a>
        </div>
      </section>
    <?php endif; ?>
  </main>

  <?php include __DIR__ . '/../includes/footer.php'; ?>

</body>
</html>
