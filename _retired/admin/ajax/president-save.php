<?php
/**
 * admin/ajax/president-save.php — AJAX save endpoint for President's
 * Welcome. Photo and signature are both optional uploads; if omitted,
 * the existing file (if any) is kept untouched.
 */
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../../includes/models/President.php';

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

$name = trim((string) ($_POST['name'] ?? ''));
$position = trim((string) ($_POST['position'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$buttonText = trim((string) ($_POST['button_text'] ?? ''));
$buttonUrl = trim((string) ($_POST['button_url'] ?? ''));

if (mb_strlen($name) > 150) stc_json_fail('Name is too long (max 150 characters).');
if ($position === '' || mb_strlen($position) > 150) stc_json_fail('Position is required (max 150 characters).');
if ($message === '' || mb_strlen($message) > 2000) stc_json_fail('Message is required (max 2000 characters).');
if ($buttonText === '' || mb_strlen($buttonText) > 60) stc_json_fail('Button text is required (max 60 characters).');
if ($buttonUrl === '' || mb_strlen($buttonUrl) > 255) stc_json_fail('Button link is required.');

$uploadDir = realpath(__DIR__ . '/../../assets/uploads/president');
if ($uploadDir === false) {
    stc_json_fail('Upload directory is missing on the server.', 500);
}

$current = stc_get_president_content();
$filesToDelete = [];

/**
 * Validates and stores an optional image upload for the given $_FILES
 * field, returning the new stored filename, or the existing filename
 * if no new file was submitted.
 */
function stc_handle_optional_image(string $field, ?string $existing, string $uploadDir, array &$filesToDelete): ?string
{
    if (!isset($_FILES[$field]) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) {
        return $existing;
    }
    if ($_FILES[$field]['error'] !== UPLOAD_ERR_OK) {
        stc_json_fail('Upload failed for ' . $field . ' (error code ' . (int) $_FILES[$field]['error'] . ').');
    }
    if ($_FILES[$field]['size'] > 10 * 1024 * 1024) {
        stc_json_fail(ucfirst($field) . ' is too large (max 10MB).');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($_FILES[$field]['tmp_name']);
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

    if (!isset($allowed[$mime])) {
        stc_json_fail('Unsupported file type for ' . $field . '. Only JPG, PNG or WebP are allowed.');
    }

    $newFilename = 'pres_' . bin2hex(random_bytes(12)) . '.' . $allowed[$mime];
    $destination = $uploadDir . DIRECTORY_SEPARATOR . $newFilename;

    if (!move_uploaded_file($_FILES[$field]['tmp_name'], $destination)) {
        stc_json_fail('Could not save the uploaded ' . $field . '.', 500);
    }

    if (!empty($existing)) {
        $filesToDelete[] = $uploadDir . DIRECTORY_SEPARATOR . basename($existing);
    }

    return $newFilename;
}

$photoPath = stc_handle_optional_image('photo', $current['photo_path'] ?? null, $uploadDir, $filesToDelete);
$signaturePath = stc_handle_optional_image('signature', $current['signature_path'] ?? null, $uploadDir, $filesToDelete);

try {
    $pdo = stc_db();
    $stmt = $pdo->prepare(
        'INSERT INTO president_content (id, name, position, message, photo_path, signature_path, button_text, button_url)
         VALUES (1, :name, :position, :message, :photo_path, :signature_path, :button_text, :button_url)
         ON DUPLICATE KEY UPDATE
            name = VALUES(name), position = VALUES(position), message = VALUES(message),
            photo_path = VALUES(photo_path), signature_path = VALUES(signature_path),
            button_text = VALUES(button_text), button_url = VALUES(button_url)'
    );
    $stmt->execute([
        ':name' => $name,
        ':position' => $position,
        ':message' => $message,
        ':photo_path' => $photoPath,
        ':signature_path' => $signaturePath,
        ':button_text' => $buttonText,
        ':button_url' => $buttonUrl,
    ]);
} catch (Throwable $e) {
    stc_json_fail('Database error while saving. Please try again.', 500);
}

foreach ($filesToDelete as $oldFile) {
    if (is_file($oldFile)) { @unlink($oldFile); }
}

echo json_encode(['ok' => true, 'message' => "President's Welcome updated — changes are live on the homepage."]);
