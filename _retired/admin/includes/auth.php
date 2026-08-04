<?php
/**
 * auth.php — session bootstrap + login guard for the admin panel.
 * require_once this at the very top of every protected admin page,
 * right after config.php.
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => BASE_URL,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function stc_admin_logged_in(): bool
{
    return !empty($_SESSION['admin_id']);
}

/** Call at the top of any page that must not be viewed while logged out. */
function stc_require_login(): void
{
    if (!stc_admin_logged_in()) {
        header('Location: ' . BASE_URL . 'admin/login.php');
        exit;
    }
}
