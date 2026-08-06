<?php
/**
 * about/faculty-profile.php — individual faculty profile page.
 * Reached via /about/faculty/{slug} through the root .htaccess rewrite
 * (RewriteRule ^about/faculty/([^/]+)/?$ about/faculty-profile.php?slug=$1).
 */
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/models/Faculty.php';

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';
$faculty = $slug !== '' ? stc_get_faculty_by_slug($slug) : null;

if (!$faculty) {
    http_response_code(404);
}

$stc_page_title = $faculty
    ? $faculty['full_name'] . ' — Faculty Profile — Sherubtse College'
    : 'Faculty Member Not Found — Sherubtse College';
$stc_page_description = $faculty
    ? mb_substr((string) $faculty['short_biography'], 0, 300)
    : 'This faculty profile could not be found.';

$stc_scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$stc_host = $_SERVER['HTTP_HOST'] ?? 'sherubtse.edu.bt';
$stc_canonical = $stc_scheme . $stc_host . BASE_URL . 'about/faculty/' . rawurlencode($slug);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($stc_page_title, ENT_QUOTES, 'UTF-8'); ?></title>
  <meta name="description" content="<?php echo htmlspecialchars($stc_page_description, ENT_QUOTES, 'UTF-8'); ?>">
  <link rel="canonical" href="<?php echo htmlspecialchars($stc_canonical, ENT_QUOTES, 'UTF-8'); ?>">
  <meta name="theme-color" content="#7A1B2B">
  <link rel="icon" href="<?php echo htmlspecialchars($stc_brand['favicon'], ENT_QUOTES, 'UTF-8'); ?>">

  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="Sherubtse College">
  <meta property="og:title" content="<?php echo htmlspecialchars($stc_page_title, ENT_QUOTES, 'UTF-8'); ?>">
  <meta property="og:description" content="<?php echo htmlspecialchars($stc_page_description, ENT_QUOTES, 'UTF-8'); ?>">
  <meta property="og:url" content="<?php echo htmlspecialchars($stc_canonical, ENT_QUOTES, 'UTF-8'); ?>">
  <?php if ($faculty && $faculty['profile_picture_url']): ?>
  <meta property="og:image" content="<?php echo htmlspecialchars($faculty['profile_picture_url'], ENT_QUOTES, 'UTF-8'); ?>">
  <?php endif; ?>

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
    <?php if ($faculty): ?>
      <?php include __DIR__ . '/../includes/pages/faculty-profile.php'; ?>
    <?php else: ?>
      <section class="stc-faculty-notfound">
        <div class="stc-faculty-notfound__inner">
          <h1>Faculty Member Not Found</h1>
          <p>We couldn't find a faculty profile at this address. They may have been removed, or the link may be incorrect.</p>
          <a href="<?php echo htmlspecialchars(BASE_URL . 'about/faculty', ENT_QUOTES, 'UTF-8'); ?>" class="stc-faculty-notfound__btn">Back to Faculty Directory</a>
        </div>
      </section>
    <?php endif; ?>
  </main>

  <?php include __DIR__ . '/../includes/footer.php'; ?>

</body>
</html>
