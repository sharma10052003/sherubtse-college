<?php
/**
 * admin/ajax/history-save.php — AJAX save endpoint for the History &
 * Heritage page editor. Handles the main content fields plus three
 * repeaters (timeline, legacy, traditions) and up to five optional
 * uploads (hero image, Mackey photo, then/now photos, PDF brochure).
 * The Heritage Gallery itself is saved separately by
 * admin/ajax/history-gallery-save.php.
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

function stc_req(string $key, int $max, string $label): string
{
    $v = trim((string) ($_POST[$key] ?? ''));
    if ($v === '' || mb_strlen($v) > $max) {
        stc_json_fail("$label is required (max $max characters).");
    }
    return $v;
}
function stc_opt(string $key, int $max): ?string
{
    $v = trim((string) ($_POST[$key] ?? ''));
    if ($v === '') return null;
    return mb_substr($v, 0, $max);
}

$heroTitle = stc_req('hero_title', 200, 'Hero title');
$heroSubtitle = stc_req('hero_subtitle', 300, 'Hero subtitle');
$heroIntro = stc_req('hero_intro', 500, 'Hero introduction');
$heroImagePosition = (string) ($_POST['hero_image_position'] ?? 'top');
if (!in_array($heroImagePosition, ['top', 'center', 'bottom'], true)) {
    $heroImagePosition = 'top';
}
$foundingStory = stc_req('founding_story', 4000, 'Founding story');
$visionKingText = stc_req('vision_king_text', 2000, 'Vision of the Third King text');
$mackeyName = stc_req('mackey_name', 150, 'Father Mackey\'s name');
$mackeyBio = stc_req('mackey_bio', 2000, 'Father Mackey biography');
$motto = stc_req('motto', 150, 'Motto');
$mottoMeaning = stc_opt('motto_meaning', 1000);
$emblemMeaning = stc_opt('emblem_meaning', 1000);
$valuesText = stc_opt('values_text', 1000);
$videoUrl = stc_opt('video_url', 255);

$uploadDir = realpath(__DIR__ . '/../../assets/uploads/history');
if ($uploadDir === false) {
    stc_json_fail('Upload directory is missing on the server.', 500);
}

$current = stc_get_history_content();

/** Validates + stores an optional image upload; keeps $existing if no new file. */
function stc_history_optional_image(string $field, ?string $existing, string $uploadDir, int $maxMB, array &$toDelete): ?string
{
    if (!isset($_FILES[$field]) || $_FILES[$field]['error'] === UPLOAD_ERR_NO_FILE) {
        return $existing;
    }
    if ($_FILES[$field]['error'] !== UPLOAD_ERR_OK) {
        stc_json_fail('Upload failed for ' . $field . ' (error code ' . (int) $_FILES[$field]['error'] . ').');
    }
    if ($_FILES[$field]['size'] > $maxMB * 1024 * 1024) {
        stc_json_fail(ucfirst(str_replace('_', ' ', $field)) . " is too large (max {$maxMB}MB).");
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($_FILES[$field]['tmp_name']);
    $allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    if (!isset($allowed[$mime])) {
        stc_json_fail('Unsupported file type for ' . $field . '. Only JPG, PNG or WebP are allowed.');
    }
    $newFilename = 'hist_' . bin2hex(random_bytes(12)) . '.' . $allowed[$mime];
    if (!move_uploaded_file($_FILES[$field]['tmp_name'], $uploadDir . DIRECTORY_SEPARATOR . $newFilename)) {
        stc_json_fail('Could not save the uploaded ' . $field . '.', 500);
    }
    if (!empty($existing)) {
        $toDelete[] = $uploadDir . DIRECTORY_SEPARATOR . basename($existing);
    }
    return $newFilename;
}

$filesToDelete = [];
$heroImagePath = stc_history_optional_image('hero_image', $current['hero_image_path'] ?? null, $uploadDir, 15, $filesToDelete);
$kingPhotoPath = stc_history_optional_image('king_photo', $current['king_photo_path'] ?? null, $uploadDir, 10, $filesToDelete);
$mackeyPhotoPath = stc_history_optional_image('mackey_photo', $current['mackey_photo_path'] ?? null, $uploadDir, 10, $filesToDelete);
$thenImagePath = stc_history_optional_image('then_image', $current['then_image_path'] ?? null, $uploadDir, 15, $filesToDelete);
$nowImagePath = stc_history_optional_image('now_image', $current['now_image_path'] ?? null, $uploadDir, 15, $filesToDelete);

// Brochure: PDF only, validated separately from the image helper above.
$brochurePath = $current['brochure_path'] ?? null;
if (isset($_FILES['brochure']) && $_FILES['brochure']['error'] !== UPLOAD_ERR_NO_FILE) {
    if ($_FILES['brochure']['error'] !== UPLOAD_ERR_OK) {
        stc_json_fail('Brochure upload failed (error code ' . (int) $_FILES['brochure']['error'] . ').');
    }
    if ($_FILES['brochure']['size'] > 20 * 1024 * 1024) {
        stc_json_fail('Brochure is too large (max 20MB).');
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($_FILES['brochure']['tmp_name']);
    if ($mime !== 'application/pdf') {
        stc_json_fail('The brochure must be a PDF file.');
    }
    $newBrochure = 'hist_' . bin2hex(random_bytes(12)) . '.pdf';
    if (!move_uploaded_file($_FILES['brochure']['tmp_name'], $uploadDir . DIRECTORY_SEPARATOR . $newBrochure)) {
        stc_json_fail('Could not save the brochure.', 500);
    }
    if (!empty($brochurePath)) {
        $filesToDelete[] = $uploadDir . DIRECTORY_SEPARATOR . basename($brochurePath);
    }
    $brochurePath = $newBrochure;
}

// ---- Repeaters --------------------------------------------------------------
$timelineRows = [];
$years = $_POST['timeline_year'] ?? [];
$events = $_POST['timeline_event'] ?? [];
$descs = $_POST['timeline_description'] ?? [];
foreach ($events as $i => $event) {
    $event = trim((string) $event);
    if ($event === '') continue;
    $timelineRows[] = [
        'year' => mb_substr(trim((string) ($years[$i] ?? '')), 0, 20) ?: '—',
        'event' => mb_substr($event, 0, 200),
        'description' => (($d = trim((string) ($descs[$i] ?? ''))) !== '') ? mb_substr($d, 0, 400) : null,
    ];
}

$legacyRows = [];
$legacyIcons = $_POST['legacy_icon'] ?? [];
$legacyTexts = $_POST['legacy_text'] ?? [];
foreach ($legacyTexts as $i => $text) {
    $text = trim((string) $text);
    if ($text === '') continue;
    $legacyRows[] = ['icon' => trim((string) ($legacyIcons[$i] ?? '')) ?: 'bi-star-fill', 'text' => mb_substr($text, 0, 300)];
}

$traditionRows = [];
$tIcons = $_POST['tradition_icon'] ?? [];
$tTitles = $_POST['tradition_title'] ?? [];
$tDescs = $_POST['tradition_description'] ?? [];
foreach ($tTitles as $i => $title) {
    $title = trim((string) $title);
    if ($title === '') continue;
    $traditionRows[] = [
        'icon' => trim((string) ($tIcons[$i] ?? '')) ?: 'bi-stars',
        'title' => mb_substr($title, 0, 150),
        'description' => (($d = trim((string) ($tDescs[$i] ?? ''))) !== '') ? mb_substr($d, 0, 300) : null,
    ];
}

try {
    $pdo = stc_db();
    $pdo->beginTransaction();

    $stmt = $pdo->prepare(
        'INSERT INTO history_content (
            id, hero_title, hero_subtitle, hero_intro, hero_image_path, hero_image_position, founding_story,
            vision_king_text, king_photo_path, mackey_name, mackey_photo_path, mackey_bio, motto,
            motto_meaning, emblem_meaning, values_text, video_url, brochure_path,
            then_image_path, now_image_path
         ) VALUES (
            1, :hero_title, :hero_subtitle, :hero_intro, :hero_image_path, :hero_image_position, :founding_story,
            :vision_king_text, :king_photo_path, :mackey_name, :mackey_photo_path, :mackey_bio, :motto,
            :motto_meaning, :emblem_meaning, :values_text, :video_url, :brochure_path,
            :then_image_path, :now_image_path
         )
         ON DUPLICATE KEY UPDATE
            hero_title = VALUES(hero_title), hero_subtitle = VALUES(hero_subtitle),
            hero_intro = VALUES(hero_intro), hero_image_path = VALUES(hero_image_path),
            hero_image_position = VALUES(hero_image_position),
            founding_story = VALUES(founding_story), vision_king_text = VALUES(vision_king_text),
            king_photo_path = VALUES(king_photo_path),
            mackey_name = VALUES(mackey_name), mackey_photo_path = VALUES(mackey_photo_path),
            mackey_bio = VALUES(mackey_bio), motto = VALUES(motto),
            motto_meaning = VALUES(motto_meaning), emblem_meaning = VALUES(emblem_meaning),
            values_text = VALUES(values_text), video_url = VALUES(video_url),
            brochure_path = VALUES(brochure_path), then_image_path = VALUES(then_image_path),
            now_image_path = VALUES(now_image_path)'
    );
    $stmt->execute([
        ':hero_title' => $heroTitle, ':hero_subtitle' => $heroSubtitle, ':hero_intro' => $heroIntro,
        ':hero_image_path' => $heroImagePath, ':hero_image_position' => $heroImagePosition, ':founding_story' => $foundingStory,
        ':vision_king_text' => $visionKingText, ':king_photo_path' => $kingPhotoPath, ':mackey_name' => $mackeyName,
        ':mackey_photo_path' => $mackeyPhotoPath, ':mackey_bio' => $mackeyBio, ':motto' => $motto,
        ':motto_meaning' => $mottoMeaning, ':emblem_meaning' => $emblemMeaning,
        ':values_text' => $valuesText, ':video_url' => $videoUrl, ':brochure_path' => $brochurePath,
        ':then_image_path' => $thenImagePath, ':now_image_path' => $nowImagePath,
    ]);

    $pdo->exec('DELETE FROM history_timeline_items');
    $insTimeline = $pdo->prepare('INSERT INTO history_timeline_items (year, event, description, sort_order) VALUES (?, ?, ?, ?)');
    foreach ($timelineRows as $order => $row) {
        $insTimeline->execute([$row['year'], $row['event'], $row['description'], $order]);
    }

    $pdo->exec('DELETE FROM history_legacy_items');
    $insLegacy = $pdo->prepare('INSERT INTO history_legacy_items (icon, text, sort_order) VALUES (?, ?, ?)');
    foreach ($legacyRows as $order => $row) {
        $insLegacy->execute([$row['icon'], $row['text'], $order]);
    }

    $pdo->exec('DELETE FROM history_tradition_items');
    $insTradition = $pdo->prepare('INSERT INTO history_tradition_items (icon, title, description, sort_order) VALUES (?, ?, ?, ?)');
    foreach ($traditionRows as $order => $row) {
        $insTradition->execute([$row['icon'], $row['title'], $row['description'], $order]);
    }

    $pdo->commit();
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    stc_json_fail('Database error while saving. Please try again.', 500);
}

foreach ($filesToDelete as $oldFile) {
    if (is_file($oldFile)) { @unlink($oldFile); }
}

echo json_encode(['ok' => true, 'message' => 'History & Heritage updated — changes are live on the page.']);
