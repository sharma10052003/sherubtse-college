<?php
/**
 * ajax/programmes-list.php — AJAX search + filter endpoint for the
 * Programmes catalogue (assets/js/programmes/programmes-list.js).
 * Same proxy-through-PHP security model as ajax/faculty-list.php — the
 * browser never talks to Strapi directly or holds the API token.
 */
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/models/Programme.php';

header('Content-Type: application/json; charset=utf-8');

$args = [
    'q'          => isset($_GET['q']) ? trim((string) $_GET['q']) : '',
    'department' => isset($_GET['department']) ? trim((string) $_GET['department']) : '',
    'level'      => isset($_GET['level']) ? trim((string) $_GET['level']) : '',
];

$programmes = stc_get_programme_list($args);

echo json_encode(['programmes' => $programmes, 'total' => count($programmes)], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
