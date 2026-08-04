<?php
/**
 * db.php — single PDO connection factory for the whole site.
 * -----------------------------------------------------------------------
 * require_once this AFTER config.php on any page (public or /admin) that
 * needs the database. Local XAMPP defaults (root / no password) — change
 * the constants below before deploying anywhere else.
 * -----------------------------------------------------------------------
 */
if (!defined('SHERUBTSE_INIT')) {
    http_response_code(403);
    exit('Forbidden');
}

if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', 'sherubtse_college');
if (!defined('DB_USER')) define('DB_USER', 'root');
if (!defined('DB_PASS')) define('DB_PASS', '');

/**
 * Returns a shared PDO instance. Throws PDOException on connection
 * failure — callers that must never hard-fail (public homepage
 * sections) should wrap their queries in try/catch and fall back to
 * default content rather than catching the connection itself.
 */
function stc_db(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }

    return $pdo;
}
