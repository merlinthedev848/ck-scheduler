<?php
namespace App\Controllers;

use App\Models\DB;

class AuthController {
    public function loginView() {
        if (isset($_SESSION['user_id'])) {
            header("Location: /admin");
            exit;
        }
        $title = "Login";
        $contentView = __DIR__ . '/../Views/auth/login.php';
        require __DIR__ . '/../Views/layout.php';
    }

    public function loginAction() {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        $user = DB::fetch("SELECT * FROM users WHERE email = ?", [$email]);
        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_role'] = $user['role'];
            $_SESSION['user_name'] = $user['first_name'] . ' ' . $user['last_name'];
            header("Location: /admin");
            exit;
        } else {
            $_SESSION['flash_error'] = "Invalid email or password.";
            header("Location: /login");
            exit;
        }
    }

    public function logout() {
        session_destroy();
        header("Location: /login");
        exit;
    }

    public static function requireAuth() {
        if (!isset($_SESSION['user_id'])) {
            header("Location: /login");
            exit;
        }
    }

    public static function requireAdmin() {
        self::requireAuth();
        if ($_SESSION['user_role'] !== 'admin') {
            http_response_code(403);
            die("403 Forbidden - Administrators only.");
        }
    }
}
