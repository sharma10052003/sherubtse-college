<?php
/**
 * admin/ajax/hero-save.php — AJAX save endpoint for the Hero Section.
 * POST + multipart/form-data only. Auth + CSRF required. All writes use
 * prepared statements; uploads are validated by real MIME sniffing
 * (never trusted by extension/original filename) before being moved
 * into assets/uploads/hero/ under a random generated name.
 */
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../../includes/models/Hero.php';

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

/* ---- Validate scalar fields --------------------------------------------- */
$title    = trim((string) ($_POST['title'] ?? ''));
$subtitle = trim((string) ($_POST['subtitle'] ?? ''));
$cta1Text = trim((string) ($_POST['cta1_text'] ?? ''));
$cta1Url  = trim((string) ($_POST['cta1_url'] ?? ''));
$cta2Text = trim((string) ($_POST['cta2_text'] ?? ''));
$cta2Url  = trim((string) ($_POST['cta2_url'] ?? ''));
$bgType   = (string) ($_POST['background_type'] ?? 'gradient');
$overlayStyle = (string) ($_POST['overlay_style'] ?? 'maroon');
$overlayOpacity = (int) ($_POST['overlay_opacity'] ?? 55);

if ($title === '' || mb_strlen($title) > 200) stc_json_fail('Title is required (max 200 characters).');
if ($subtitle === '' || mb_strlen($subtitle) > 400) stc_json_fail('Subtitle is required (max 400 characters).');
if ($cta1Text === '' || $cta1Url === '') stc_json_fail('Primary button text and link are required.');
if ($cta2Text === '' || $cta2Url === '') stc_json_fail('Secondary button text and link are required.');
if (!in_array($bgType, ['gradient', 'image', 'video'], true)) stc_json_fail('Invalid background type.');
if (!in_array($overlayStyle, ['maroon', 'dark', 'light'], true)) stc_json_fail('Invalid overlay style.');
$overlayOpacity = max(0, min(90, $overlayOpacity));

/* ---- Media upload (only relevant for image/video backgrounds) ---------- */
$uploadDir = realpath(__DIR__ . '/../../assets/uploads/hero');
if ($uploadDir === false) {
    stc_json_fail('Upload directory is missing on the server.', 500);
}

$current = stc_get_hero_content();
$mediaPath = $current['media_path'] ?? null;

if ($bgType === 'gradient') {
    $mediaPath = null;
} elseif (isset($_FILES['media']) && $_FILES['media']['error'] !== UPLOAD_ERR_NO_FILE) {
    $file = $_FILES['media'];

    if ($file['error'] !== UPLOAD_ERR_OK) {
        stc_json_fail('File upload failed (error code ' . (int) $file['error'] . ').');
    }

    $maxSize = $bgType === 'video' ? 50 * 1024 * 1024 : 15 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        stc_json_fail('File is too large (max ' . ($bgType === 'video' ? '50MB for video' : '15MB for images') . ').');
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($file['tmp_name']);

    $allowed = $bgType === 'video'
        ? ['video/mp4' => 'mp4']
        : ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

    if (!isset($allowed[$mime])) {
        stc_json_fail('Unsupported file type (' . htmlspecialchars((string) $mime, ENT_QUOTES, 'UTF-8') . '). ' .
            ($bgType === 'video' ? 'Only MP4 video is allowed.' : 'Only JPG, PNG or WebP images are allowed.'));
    }

    $newFilename = 'hero_' . bin2hex(random_bytes(12)) . '.' . $allowed[$mime];
    $destination = $uploadDir . DIRECTORY_SEPARATOR . $newFilename;

    if (!move_uploaded_file($file['tmp_name'], $destination)) {
        stc_json_fail('Could not save the uploaded file.', 500);
    }

    if (!empty($current['media_path'])) {
        $old = $uploadDir . DIRECTORY_SEPARATOR . basename($current['media_path']);
        if (is_file($old)) { @unlink($old); }
    }

    $mediaPath = $newFilename;
} elseif (empty($mediaPath)) {
    stc_json_fail('Please upload a ' . ($bgType === 'video' ? 'video' : 'image') . ' for this background type.');
}

/* ---- Repeatable stats / badges ------------------------------------------ */
$statsIcon   = $_POST['stats_icon'] ?? [];
$statsValue  = $_POST['stats_value'] ?? [];
$statsSuffix = $_POST['stats_suffix'] ?? [];
$statsLabel  = $_POST['stats_label'] ?? [];

$badgesIcon  = $_POST['badges_icon'] ?? [];
$badgesLabel = $_POST['badges_label'] ?? [];

$statRows = [];
foreach ($statsLabel as $i => $label) {
    $label = trim((string) $label);
    if ($label === '') continue;
    $statRows[] = [
        'icon'   => trim((string) ($statsIcon[$i] ?? '')) ?: 'bi-star-fill',
        'value'  => (string) (int) ($statsValue[$i] ?? 0),
        'suffix' => mb_substr(trim((string) ($statsSuffix[$i] ?? '')), 0, 10),
        'label'  => mb_substr($label, 0, 120),
    ];
}

$badgeRows = [];
foreach ($badgesLabel as $i => $label) {
    $label = trim((string) $label);
    if ($label === '') continue;
    $badgeRows[] = [
        'icon'  => trim((string) ($badgesIcon[$i] ?? '')) ?: 'bi-award-fill',
        'label' => mb_substr($label, 0, 120),
    ];
}

/* ---- Persist -------------------------------------------------------------- */
try {
    $pdo = stc_db();
    $pdo->beginTransaction();

    $stmt = $pdo->prepare(
        'INSERT INTO hero_content (id, title, subtitle, cta1_text, cta1_url, cta2_text, cta2_url, background_type, media_path, overlay_style, overlay_opacity)
         VALUES (1, :title, :subtitle, :cta1_text, :cta1_url, :cta2_text, :cta2_url, :background_type, :media_path, :overlay_style, :overlay_opacity)
         ON DUPLICATE KEY UPDATE
            title = VALUES(title), subtitle = VALUES(subtitle),
            cta1_text = VALUES(cta1_text), cta1_url = VALUES(cta1_url),
            cta2_text = VALUES(cta2_text), cta2_url = VALUES(cta2_url),
            background_type = VALUES(background_type), media_path = VALUES(media_path),
            overlay_style = VALUES(overlay_style), overlay_opacity = VALUES(overlay_opacity)'
    );
    $stmt->execute([
        ':title' => $title, ':subtitle' => $subtitle,
        ':cta1_text' => $cta1Text, ':cta1_url' => $cta1Url,
        ':cta2_text' => $cta2Text, ':cta2_url' => $cta2Url,
        ':background_type' => $bgType, ':media_path' => $mediaPath,
        ':overlay_style' => $overlayStyle, ':overlay_opacity' => $overlayOpacity,
    ]);

    $pdo->prepare("DELETE FROM hero_items WHERE item_type = 'stat'")->execute();
    $insStat = $pdo->prepare('INSERT INTO hero_items (item_type, icon, value, suffix, label, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
    foreach ($statRows as $order => $row) {
        $insStat->execute(['stat', $row['icon'], $row['value'], $row['suffix'], $row['label'], $order]);
    }

    $pdo->prepare("DELETE FROM hero_items WHERE item_type = 'badge'")->execute();
    $insBadge = $pdo->prepare('INSERT INTO hero_items (item_type, icon, value, suffix, label, sort_order) VALUES (?, ?, NULL, NULL, ?, ?)');
    foreach ($badgeRows as $order => $row) {
        $insBadge->execute(['badge', $row['icon'], $row['label'], $order]);
    }

    $pdo->commit();
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    stc_json_fail('Database error while saving. Please try again.', 500);
}

echo json_encode(['ok' => true, 'message' => 'Hero section updated — changes are live on the homepage.']);
