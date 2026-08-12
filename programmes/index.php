<?php
/**
 * programmes/index.php — Programmes catalogue (/programmes).
 * Mirrors about/faculty.php's thin-wrapper structure.
 */
require_once __DIR__ . '/../includes/config.php';

$stc_page_title = 'Programmes — Sherubtse College';
$stc_page_description = 'Browse undergraduate and postgraduate programmes offered at Sherubtse College, Royal University of Bhutan.';
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
    <?php include __DIR__ . '/../includes/pages/programmes.php'; ?>
  </main>

  <?php include __DIR__ . '/../includes/footer.php'; ?>

</body>
</html>
