<?php
/**
 * contact.php — Contact Us page. Same three-part integration as
 * index.php: config -> header -> content -> footer. Reachable as
 * /contact via the root .htaccess catch-all rewrite.
 */
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/models/Contact.php';

$contact = stc_get_contact_page_content();

$stc_page_title = $contact['hero_title'] . ' — Sherubtse College';
$stc_page_description = $contact['hero_subtitle'] !== ''
    ? mb_substr($contact['hero_subtitle'], 0, 300)
    : 'Get in touch with Sherubtse College — find the right office, department or contact person.';

$stc_scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$stc_host = $_SERVER['HTTP_HOST'] ?? 'sherubtse.edu.bt';
$stc_canonical = $stc_scheme . $stc_host . BASE_URL . 'contact';
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

  <?php include __DIR__ . '/includes/header.php'; ?>
  <?php include __DIR__ . '/includes/theme.php'; ?>

  <main id="main-content">
    <?php include __DIR__ . '/includes/pages/contact.php'; ?>
  </main>

  <?php include __DIR__ . '/includes/footer.php'; ?>

</body>
</html>
