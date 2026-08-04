<?php
/**
 * csrf.php — CSRF token helpers shared by every admin form and AJAX
 * endpoint. Requires auth.php (session already started) to run first.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

function stc_csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function stc_csrf_field(): string
{
    return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars(stc_csrf_token(), ENT_QUOTES, 'UTF-8') . '">';
}

function stc_csrf_verify(?string $token): bool
{
    return is_string($token) && $token !== '' && !empty($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}
