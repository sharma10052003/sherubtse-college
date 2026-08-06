<?php
/**
 * about/faculty.php — Faculty directory landing page.
 * Same three-part integration as about/history.php: config -> header ->
 * content -> footer. Reachable as /about/faculty via the root .htaccess.
 */
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/models/Faculty.php';

$stc_page_title = 'Faculty Profiles — Sherubtse College';
$stc_page_description = 'Meet the faculty of Sherubtse College — academics, researchers and mentors across our departments, from the Eastern Himalayas to the world.';

$stc_scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$stc_host = $_SERVER['HTTP_HOST'] ?? 'sherubtse.edu.bt';
$stc_canonical = $stc_scheme . $stc_host . BASE_URL . 'about/faculty';
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
    <?php include __DIR__ . '/../includes/pages/faculty.php'; ?>
  </main>

  <?php include __DIR__ . '/../includes/footer.php'; ?>

</body>
</html>
