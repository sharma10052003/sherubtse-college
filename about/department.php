<?php
/**
 * about/department.php — legacy URL, kept only for back-compat.
 * /departments/{slug} is now the canonical department page (see
 * departments/detail.php); this just 301-redirects old links/bookmarks
 * there so nothing shipped under the old URL breaks or duplicates
 * content for SEO.
 */
require_once __DIR__ . '/../includes/config.php';

$slug = isset($_GET['slug']) ? trim((string) $_GET['slug']) : '';
header('Location: ' . BASE_URL . 'departments/' . rawurlencode($slug), true, 301);
exit;
