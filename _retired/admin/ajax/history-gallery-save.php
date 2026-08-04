<?php
/**
 * admin/ajax/history-gallery-save.php — AJAX save endpoint for the
 * Heritage Gallery (History & Heritage page). Near-identical to
 * admin/ajax/gallery-save.php: photos are replaced wholesale
 * (delete-all, reinsert in submitted order), each row carries its
 * existing filename so unedited rows keep their photo, and rows with
 * neither an existing nor a new photo are silently dropped.
 */
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../../includes/models/History.php';

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

$validCategories = array_keys(stc_history_gallery_categories());

$existing = $_POST['images_existing'] ?? [];
$categories = $_POST['images_category'] ?? [];
$captions = $_POST['images_caption'] ?? [];

$uploadDir = realpath(__DIR__ . '/../../assets/uploads/history');
if ($uploadDir === false) {
    stc_json_fail('Upload directory is missing on the server.', 500);
}

$rows = [];
$filesToDeleteOnSuccess = [];
$rowCount = count($existing);

for ($i = 0; $i < $rowCount; $i++) {
    $category = (string) ($categories[$i] ?? '');
    if (!in_array($category, $validCategories, true)) {
        $category = 'campus';
    }
    $caption = trim((string) ($captions[$i] ?? ''));
    $imagePath = trim((string) ($existing[$i] ?? ''));
    $hasNewFile = isset($_FILES['images_file']['error'][$i]) && $_FILES['images_file']['error'][$i] !== UPLOAD_ERR_NO_FILE;

    if (!$hasNewFile && $imagePath === '') {
        continue; // no photo for this row at all — drop it silently
    }

    if ($hasNewFile) {
        $err = $_FILES['images_file']['error'][$i];
        if ($err !== UPLOAD_ERR_OK) {
            stc_json_fail('Photo upload failed for row ' . ($i + 1) . ' (error code ' . (int) $err . ').');
        }

        $tmpName = $_FILES['images_file']['tmp_name'][$i];
        $size = $_FILES['images_file']['size'][$i];

        if ($size > 15 * 1024 * 1024) {
            stc_json_fail('Photo in row ' . ($i + 1) . ' is too large (max 15MB).');
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($tmpName);
        $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

        if (!isset($allowed[$mime])) {
            stc_json_fail('Unsupported file type in row ' . ($i + 1) . '. Only JPG, PNG or WebP are allowed.');
        }

        $newFilename = 'histgal_' . bin2hex(random_bytes(12)) . '.' . $allowed[$mime];
        $destination = $uploadDir . DIRECTORY_SEPARATOR . $newFilename;

        if (!move_uploaded_file($tmpName, $destination)) {
            stc_json_fail('Could not save the photo in row ' . ($i + 1) . '.', 500);
        }

        if ($imagePath !== '') {
            $filesToDeleteOnSuccess[] = $uploadDir . DIRECTORY_SEPARATOR . basename($imagePath);
        }
        $imagePath = $newFilename;
    }

    $rows[] = [
        'image_path' => $imagePath,
        'caption' => $caption !== '' ? mb_substr($caption, 0, 200) : null,
        'category' => $category,
    ];
}

try {
    $pdo = stc_db();
    $pdo->beginTransaction();

    $pdo->exec('DELETE FROM history_gallery_images');
    $insert = $pdo->prepare(
        'INSERT INTO history_gallery_images (image_path, caption, category, sort_order) VALUES (?, ?, ?, ?)'
    );
    foreach ($rows as $order => $row) {
        $insert->execute([$row['image_path'], $row['caption'], $row['category'], $order]);
    }

    $pdo->commit();
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    stc_json_fail('Database error while saving. Please try again.', 500);
}

foreach ($filesToDeleteOnSuccess as $oldFile) {
    if (is_file($oldFile)) { @unlink($oldFile); }
}

echo json_encode(['ok' => true, 'message' => 'Heritage Gallery updated — changes are live on the page.']);
