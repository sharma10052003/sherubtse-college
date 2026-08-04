<?php
/**
 * admin/login.php — single-admin sign-in.
 */
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/csrf.php';

if (stc_admin_logged_in()) {
    header('Location: ' . BASE_URL . 'admin/index.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!stc_csrf_verify($_POST['csrf_token'] ?? null)) {
        $error = 'Your session expired. Please try again.';
    } else {
        $_SESSION['login_attempts'] = $_SESSION['login_attempts'] ?? 0;
        $_SESSION['login_last_attempt'] = $_SESSION['login_last_attempt'] ?? 0;

        if ($_SESSION['login_attempts'] >= 5 && (time() - $_SESSION['login_last_attempt']) < 60) {
            $error = 'Too many failed attempts. Please wait a minute and try again.';
        } else {
            $username = trim($_POST['username'] ?? '');
            $password = (string) ($_POST['password'] ?? '');
            $user = null;

            try {
                $stmt = stc_db()->prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ? LIMIT 1');
                $stmt->execute([$username]);
                $user = $stmt->fetch();
            } catch (Throwable $e) {
                $error = 'The database is unreachable. Confirm schema.sql has been imported.';
            }

            if (!$error) {
                if ($user && password_verify($password, $user['password_hash'])) {
                    session_regenerate_id(true);
                    $_SESSION['admin_id'] = (int) $user['id'];
                    $_SESSION['admin_username'] = $user['username'];
                    unset($_SESSION['login_attempts'], $_SESSION['login_last_attempt']);

                    try {
                        $upd = stc_db()->prepare('UPDATE admin_users SET last_login = NOW() WHERE id = ?');
                        $upd->execute([$user['id']]);
                    } catch (Throwable $e) { /* non-critical */ }

                    header('Location: ' . BASE_URL . 'admin/index.php');
                    exit;
                }

                $_SESSION['login_attempts']++;
                $_SESSION['login_last_attempt'] = time();
                $error = 'Incorrect username or password.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Sign In — Sherubtse College</title>
  <meta name="robots" content="noindex, nofollow">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="<?php echo BASE_URL; ?>assets/css/variables.css">
  <link rel="stylesheet" href="<?php echo BASE_URL; ?>admin/assets/css/admin.css">
</head>
<body class="stc-admin-auth">
  <main class="stc-admin-auth__panel">
    <div class="stc-admin-auth__brand">
      <img src="<?php echo htmlspecialchars($stc_brand['logo'], ENT_QUOTES, 'UTF-8'); ?>" alt="" width="44" height="44">
      <span>Sherubtse College<br>Admin Panel</span>
    </div>
    <h1>Sign in</h1>

    <?php if ($error): ?>
      <p class="stc-admin-alert" role="alert"><i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i> <?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?></p>
    <?php endif; ?>

    <form method="post" novalidate>
      <?php echo stc_csrf_field(); ?>
      <label for="username">Username</label>
      <input type="text" id="username" name="username" autocomplete="username" required autofocus>

      <label for="password">Password</label>
      <input type="password" id="password" name="password" autocomplete="current-password" required>

      <button type="submit" class="stc-admin-btn stc-admin-btn--primary stc-admin-btn--block">Sign in</button>
    </form>

    <p class="stc-admin-auth__hint">Default account: <code>admin</code> / <code>Sherubtse@2026</code> — change this after first login.</p>
  </main>
</body>
</html>
