<?php
/**
 * admin/ajax/theme-save.php — AJAX save endpoint for Design & Theme.
 * Validates every key against a strict whitelist/type before writing,
 * since these values are echoed unescaped-ish into a <style> block by
 * includes/theme.php (htmlspecialchars is still applied there, but
 * defence in depth means never trusting a hex/enum value from POST).
 */
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/db.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/csrf.php';
require_once __DIR__ . '/../../includes/models/Settings.php';

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

function stc_valid_hex(string $v): bool
{
    return (bool) preg_match('/^#[0-9A-Fa-f]{6}$/', $v);
}

$colorKeys = [
    'color_primary', 'color_secondary', 'color_accent', 'color_accent_light', 'color_hover',
    'color_background', 'color_background_alt', 'color_card', 'color_border',
    'color_text', 'color_text_soft', 'color_button_text',
    'gradient_start', 'gradient_end', 'hero_overlay_color',
    'dark_background', 'dark_background_alt', 'dark_card', 'dark_text', 'dark_text_soft',
];

$fontChoices = ['Fraunces', 'Playfair Display', 'Merriweather', 'Georgia', 'Public Sans', 'Inter', 'Source Sans 3', 'Arial'];

$toSave = [];

foreach ($colorKeys as $key) {
    $v = (string) ($_POST[$key] ?? '');
    if (!stc_valid_hex($v)) {
        stc_json_fail('Invalid color value for "' . $key . '". Expected a hex color like #7A1B2B.');
    }
    $toSave[$key] = strtoupper($v);
}

$overlayOpacity = max(0, min(90, (int) ($_POST['hero_overlay_opacity'] ?? 55)));
$toSave['hero_overlay_opacity'] = (string) $overlayOpacity;

foreach (['font_heading', 'font_body'] as $key) {
    $v = (string) ($_POST[$key] ?? '');
    if (!in_array($v, $fontChoices, true)) {
        stc_json_fail('Invalid font choice.');
    }
    $toSave[$key] = $v;
}

$radiusCard = max(0, min(40, (int) ($_POST['radius_card'] ?? 18)));
$radiusButton = max(0, min(40, (int) ($_POST['radius_button'] ?? 10)));
$toSave['radius_card'] = (string) $radiusCard;
$toSave['radius_button'] = (string) $radiusButton;

// Checkboxes are only present in $_POST when checked.
$toSave['animations_enabled'] = isset($_POST['animations_enabled']) ? '1' : '0';

$shadowStyle = (string) ($_POST['shadow_style'] ?? 'soft');
if (!in_array($shadowStyle, ['soft', 'medium', 'hard'], true)) stc_json_fail('Invalid shadow style.');
$toSave['shadow_style'] = $shadowStyle;

$animationSpeed = (string) ($_POST['animation_speed'] ?? 'normal');
if (!in_array($animationSpeed, ['slow', 'normal', 'fast'], true)) stc_json_fail('Invalid animation speed.');
$toSave['animation_speed'] = $animationSpeed;

$containerWidth = max(960, min(1920, (int) ($_POST['container_width'] ?? 1240)));
$toSave['container_width'] = (string) $containerWidth;

$spacingScale = (string) ($_POST['spacing_scale'] ?? 'comfortable');
if (!in_array($spacingScale, ['compact', 'comfortable', 'spacious'], true)) stc_json_fail('Invalid spacing scale.');
$toSave['spacing_scale'] = $spacingScale;

try {
    $pdo = stc_db();
    $stmt = $pdo->prepare(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (:key, :value)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)'
    );
    $pdo->beginTransaction();
    foreach ($toSave as $key => $value) {
        $stmt->execute([':key' => $key, ':value' => $value]);
    }
    $pdo->commit();
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    stc_json_fail('Database error while saving. Please try again.', 500);
}

echo json_encode(['ok' => true, 'message' => 'Theme updated — the homepage is now using your new design tokens.']);
