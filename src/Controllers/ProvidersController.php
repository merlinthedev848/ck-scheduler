<?php
namespace App\Controllers;

use App\Models\DB;

class ProvidersController {
    public function index() {
        AuthController::requireAdmin();
        $providers = DB::fetchAll("SELECT * FROM users WHERE role IN ('admin', 'provider') ORDER BY first_name ASC");
        
        $title = "Providers Management";
        $contentView = __DIR__ . '/../Views/admin/providers/index.php';
        require __DIR__ . '/../Views/layout.php';
    }

    public function store() {
        AuthController::requireAdmin();
        $first_name = $_POST['first_name'] ?? '';
        $last_name = $_POST['last_name'] ?? '';
        $email = $_POST['email'] ?? '';
        $password = password_hash($_POST['password'] ?? 'password', PASSWORD_DEFAULT);
        
        DB::query("INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, 'provider')", 
            [$first_name, $last_name, $email, $password]
        );
        
        $_SESSION['flash_success'] = "Provider created.";
        header("Location: /admin/providers");
        exit;
    }

    public function delete() {
        AuthController::requireAdmin();
        $id = (int)($_POST['id'] ?? 0);
        // Prevent deleting oneself
        if ($id === $_SESSION['user_id']) {
            $_SESSION['flash_error'] = "You cannot delete yourself.";
        } else {
            DB::query("DELETE FROM users WHERE id = ?", [$id]);
            $_SESSION['flash_success'] = "Provider deleted.";
        }
        header("Location: /admin/providers");
        exit;
    }
}
