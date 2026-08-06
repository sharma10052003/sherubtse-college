<?php
/**
 * ajax/faculty-list.php — AJAX search + filter endpoint for the Faculty
 * directory (assets/js/faculty/faculty-list.js). Search and "filter" are
 * the same underlying query shape with different params, so this is one
 * endpoint rather than separate /faculty/search + /faculty/filter files.
 *
 * The browser never talks to Strapi directly or holds the API token —
 * this proxies through stc_get_faculty_list(), same security model as
 * the rest of the site.
 */
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/models/Faculty.php';

header('Content-Type: application/json; charset=utf-8');

$args = [
    'q'             => isset($_GET['q']) ? trim((string) $_GET['q']) : '',
    'department'    => isset($_GET['department']) ? trim((string) $_GET['department']) : '',
    'position'      => isset($_GET['position']) ? trim((string) $_GET['position']) : '',
    'qualification' => isset($_GET['qualification']) ? trim((string) $_GET['qualification']) : '',
    'research_area' => isset($_GET['research_area']) ? trim((string) $_GET['research_area']) : '',
];

$faculty = stc_get_faculty_list($args);

echo json_encode([
    'data'  => $faculty,
    'count' => count($faculty),
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
