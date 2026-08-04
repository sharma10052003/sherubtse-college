<?php
/**
 * layout-head.php — shared <head> + shell/sidebar chrome for every
 * protected admin page. Expects $pageTitle and $activeSection to be set
 * by the including page before this file is required.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

stc_require_login();

$pageTitle = $pageTitle ?? 'Dashboard';
$activeSection = $activeSection ?? '';

$stc_admin_nav = [
    'sections' => [
        ['key' => 'hero',           'label' => 'Hero Section',              'icon' => 'bi-easel3',        'href' => 'sections/hero.php',    'live' => true],
        ['key' => 'president',      'label' => "President's Welcome",       'icon' => 'bi-person-badge',  'href' => 'sections/president.php', 'live' => true],
        ['key' => 'vision_mission', 'label' => 'Vision & Mission',          'icon' => 'bi-bullseye',      'href' => '#', 'live' => false],
        ['key' => 'highlights',     'label' => 'College Highlights',        'icon' => 'bi-stars',         'href' => '#', 'live' => false],
        ['key' => 'events',         'label' => 'Upcoming Events',           'icon' => 'bi-calendar3',     'href' => '#', 'live' => false],
        ['key' => 'news',           'label' => 'Latest News',               'icon' => 'bi-newspaper',     'href' => '#', 'live' => false],
        ['key' => 'academics',      'label' => 'Academic Excellence',       'icon' => 'bi-mortarboard',   'href' => '#', 'live' => false],
        ['key' => 'statistics',     'label' => 'College Statistics',        'icon' => 'bi-bar-chart',     'href' => '#', 'live' => false],
        ['key' => 'campus_life',    'label' => 'Campus Life',               'icon' => 'bi-people',        'href' => '#', 'live' => false],
        ['key' => 'research',       'label' => 'Research & Innovation',     'icon' => 'bi-flask',         'href' => '#', 'live' => false],
        ['key' => 'gallery',        'label' => 'Image Gallery',             'icon' => 'bi-images',        'href' => 'sections/gallery.php', 'live' => true],
        ['key' => 'partners',       'label' => 'International Partnerships','icon' => 'bi-diagram-3',     'href' => '#', 'live' => false],
        ['key' => 'testimonials',   'label' => 'Testimonials',              'icon' => 'bi-chat-quote',    'href' => '#', 'live' => false],
        ['key' => 'cta',            'label' => 'Call To Action',            'icon' => 'bi-cursor',        'href' => '#', 'live' => false],
    ],
    'pages' => [
        ['key' => 'history', 'label' => 'History & Heritage', 'icon' => 'bi-book-half', 'href' => 'sections/history.php', 'live' => true],
    ],
    'settings' => [
        ['key' => 'layout', 'label' => 'Homepage Layout', 'icon' => 'bi-layout-text-window', 'href' => 'sections/layout.php', 'live' => true],
        ['key' => 'theme',  'label' => 'Design & Theme',  'icon' => 'bi-palette',            'href' => 'sections/theme.php',  'live' => true],
    ],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?> — Admin — Sherubtse College</title>
  <meta name="robots" content="noindex, nofollow">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/variables.css">
  <link rel="stylesheet" href="<?php echo BASE_URL; ?>admin/assets/css/admin.css">
</head>
<body class="stc-admin">
<div class="stc-admin-shell">

  <button type="button" class="stc-admin-sidebar-toggle" id="stcSidebarToggle" aria-expanded="false" aria-controls="stcAdminSidebar" aria-label="Toggle navigation">
    <i class="bi bi-list" aria-hidden="true"></i>
  </button>

  <nav class="stc-admin-sidebar" id="stcAdminSidebar">
    <a class="stc-admin-sidebar__brand" href="<?php echo BASE_URL; ?>admin/index.php">
      <img src="<?php echo htmlspecialchars($stc_brand['logo'], ENT_QUOTES, 'UTF-8'); ?>" alt="" width="32" height="32">
      <span>Sherubtse Admin</span>
    </a>

    <p class="stc-admin-sidebar__heading">Homepage Sections</p>
    <ul class="stc-admin-sidebar__nav">
      <?php foreach ($stc_admin_nav['sections'] as $item): ?>
        <li>
          <a href="<?php echo $item['live'] ? htmlspecialchars(BASE_URL . 'admin/' . $item['href'], ENT_QUOTES, 'UTF-8') : '#'; ?>"
             class="<?php echo $activeSection === $item['key'] ? 'is-active' : ''; ?> <?php echo !$item['live'] ? 'is-disabled' : ''; ?>"
             <?php echo !$item['live'] ? 'aria-disabled="true" tabindex="-1"' : ''; ?>>
            <i class="bi <?php echo htmlspecialchars($item['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
            <span><?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?></span>
            <?php if (!$item['live']): ?><em class="stc-admin-badge">Soon</em><?php endif; ?>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>

    <p class="stc-admin-sidebar__heading">Pages</p>
    <ul class="stc-admin-sidebar__nav">
      <?php foreach ($stc_admin_nav['pages'] as $item): ?>
        <li>
          <a href="<?php echo $item['live'] ? htmlspecialchars(BASE_URL . 'admin/' . $item['href'], ENT_QUOTES, 'UTF-8') : '#'; ?>"
             class="<?php echo $activeSection === $item['key'] ? 'is-active' : ''; ?> <?php echo !$item['live'] ? 'is-disabled' : ''; ?>"
             <?php echo !$item['live'] ? 'aria-disabled="true" tabindex="-1"' : ''; ?>>
            <i class="bi <?php echo htmlspecialchars($item['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
            <span><?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?></span>
            <?php if (!$item['live']): ?><em class="stc-admin-badge">Soon</em><?php endif; ?>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>

    <p class="stc-admin-sidebar__heading">Settings</p>
    <ul class="stc-admin-sidebar__nav">
      <?php foreach ($stc_admin_nav['settings'] as $item): ?>
        <li>
          <a href="<?php echo htmlspecialchars(BASE_URL . 'admin/' . $item['href'], ENT_QUOTES, 'UTF-8'); ?>" class="<?php echo $activeSection === $item['key'] ? 'is-active' : ''; ?>">
            <i class="bi <?php echo htmlspecialchars($item['icon'], ENT_QUOTES, 'UTF-8'); ?>" aria-hidden="true"></i>
            <span><?php echo htmlspecialchars($item['label'], ENT_QUOTES, 'UTF-8'); ?></span>
          </a>
        </li>
      <?php endforeach; ?>
    </ul>
  </nav>

  <div class="stc-admin-main">
    <header class="stc-admin-topbar">
      <h1><?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?></h1>
      <div class="stc-admin-topbar__actions">
        <a href="<?php echo BASE_URL; ?>" target="_blank" rel="noopener" class="stc-admin-btn stc-admin-btn--ghost">
          <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i> View Homepage
        </a>
        <span class="stc-admin-topbar__user"><i class="bi bi-person-circle" aria-hidden="true"></i> <?php echo htmlspecialchars($_SESSION['admin_username'] ?? 'Admin', ENT_QUOTES, 'UTF-8'); ?></span>
        <a href="<?php echo BASE_URL; ?>admin/logout.php" class="stc-admin-btn stc-admin-btn--ghost"><i class="bi bi-box-arrow-right" aria-hidden="true"></i> Log out</a>
      </div>
    </header>

    <div class="stc-admin-content">
