<?php
/**
 * index.php — Sherubtse College homepage.
 * -----------------------------------------------------------------------
 * Wires the existing reusable header/footer (untouched) together with
 * the database-backed homepage sections. Which sections render, and in
 * what order, is driven entirely by the homepage_sections registry
 * (see includes/models/HomepageSections.php + Admin -> Homepage
 * Layout) rather than a hardcoded list here — a section "switches on"
 * the moment its includes/homepage/{key}.php file exists, so the
 * registry can list sections that aren't built yet without breaking
 * the page.
 * -----------------------------------------------------------------------
 */
require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/models/HomepageSections.php';

$stc_page_title = 'Sherubtse College — Royal University of Bhutan';
$stc_page_description = "Sherubtse College, Kanglung, founded in 1968 — the oldest constituent college of the Royal University of Bhutan. Explore admissions, academics, research and campus life at Bhutan's founding seat of higher learning.";

$stc_scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https://' : 'http://';
$stc_host = $_SERVER['HTTP_HOST'] ?? 'sherubtse.edu.bt';
$stc_canonical = $stc_scheme . $stc_host . BASE_URL;
$stc_og_image = $stc_scheme . $stc_host . $stc_brand['logo'];

$stc_schema = [
    '@context' => 'https://schema.org',
    '@type'    => 'CollegeOrUniversity',
    'name'     => 'Sherubtse College',
    'alternateName' => 'A Constituent College of the Royal University of Bhutan',
    'url'      => $stc_canonical,
    'logo'     => $stc_og_image,
    'sameAs'   => array_column($stc_social_links, 'url'),
    'address'  => [
        '@type'           => 'PostalAddress',
        'streetAddress'   => 'Kanglung',
        'addressRegion'   => 'Trashigang',
        'postalCode'      => '42003',
        'addressCountry'  => 'BT',
    ],
    'telephone' => $stc_footer['contact']['phone'],
    'email'     => $stc_footer['contact']['email'],
];
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

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Sherubtse College">
  <meta property="og:title" content="<?php echo htmlspecialchars($stc_page_title, ENT_QUOTES, 'UTF-8'); ?>">
  <meta property="og:description" content="<?php echo htmlspecialchars($stc_page_description, ENT_QUOTES, 'UTF-8'); ?>">
  <meta property="og:url" content="<?php echo htmlspecialchars($stc_canonical, ENT_QUOTES, 'UTF-8'); ?>">
  <meta property="og:image" content="<?php echo htmlspecialchars($stc_og_image, ENT_QUOTES, 'UTF-8'); ?>">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="<?php echo htmlspecialchars($stc_page_title, ENT_QUOTES, 'UTF-8'); ?>">
  <meta name="twitter:description" content="<?php echo htmlspecialchars($stc_page_description, ENT_QUOTES, 'UTF-8'); ?>">
  <meta name="twitter:image" content="<?php echo htmlspecialchars($stc_og_image, ENT_QUOTES, 'UTF-8'); ?>">

  <script type="application/ld+json"><?php echo json_encode($stc_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?></script>

  <script>
    /* Applies the saved/preferred theme before first paint, so the dark
       mode toggle in includes/theme.php never causes a flash of the
       wrong palette. Does not touch header/footer markup or CSS. */
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
    <?php foreach (stc_get_enabled_sections() as $stc_section_key): ?>
      <?php $stc_section_file = __DIR__ . '/includes/homepage/' . basename($stc_section_key) . '.php'; ?>
      <?php if (is_file($stc_section_file)): ?>
        <?php include $stc_section_file; ?>
      <?php endif; ?>
    <?php endforeach; ?>
  </main>

  <?php include __DIR__ . '/includes/footer.php'; ?>

</body>
</html>
