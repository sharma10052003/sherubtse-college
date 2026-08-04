<?php
/**
 * admin/ajax/layout-save.php — AJAX save endpoint for the Homepage
 * Layout manager. Updates only ordering/visibility metadata on
 * homepage_sections; never touches any section's own content tables.
 */
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';

header('Content-Type: application/json');

function stc_json_fail(string $message, int $code = 400): void
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    stc_json_fail('Method not allowed.', 405);
}
if (!stc_admin_logged_in()) {
    stc_json_fail('Your session has expired. Please log in again.', 401);
}
if (!stc_csrf_verify($_POST['csrf_token'] ?? null)) {
    stc_json_fail('Your session expired. Please refresh the page and try again.', 419);
}

$order = $_POST['order'] ?? [];
if (!is_array($order) || empty($order)) {
    stc_json_fail('No sections received.');
}

/** 'YYYY-MM-DDTHH:MM' (datetime-local) -> 'YYYY-MM-DD HH:MM:SS', or null if blank/invalid. */
function stc_parse_datetime_local(string $value): ?string
{
    $value = trim($value);
    if ($value === '') return null;
    $ts = strtotime($value);
    return $ts !== false ? date('Y-m-d H:i:s', $ts) : null;
}

try {
    $pdo = stc_db();
    $pdo->beginTransaction();

    $stmt = $pdo->prepare(
        'UPDATE homepage_sections SET sort_order = ?, is_enabled = ?, publish_at = ?, unpublish_at = ? WHERE id = ?'
    );

    foreach ($order as $index => $rawId) {
        $id = (int) $rawId;
        if ($id <= 0) continue;

        $isEnabled = isset($_POST['enabled_' . $id]) ? 1 : 0;
        $publishAt = stc_parse_datetime_local((string) ($_POST['publish_' . $id] ?? ''));
        $unpublishAt = stc_parse_datetime_local((string) ($_POST['unpublish_' . $id] ?? ''));

        $stmt->execute([$index, $isEnabled, $publishAt, $unpublishAt, $id]);
    }

    $pdo->commit();
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    stc_json_fail('Database error while saving. Please try again.', 500);
}

echo json_encode(['ok' => true, 'message' => 'Homepage layout updated — changes are live immediately.']);
