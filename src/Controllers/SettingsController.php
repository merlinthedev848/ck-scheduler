<?php
namespace App\Controllers;

use App\Models\DB;

class SettingsController {
    public function index() {
        AuthController::requireAdmin();
        $settings_raw = DB::fetchAll("SELECT * FROM settings");
        $settings = [];
        foreach($settings_raw as $s) {
            $settings[$s['key_name']] = $s['key_value'];
        }
        
        $title = "System Settings";
        $contentView = __DIR__ . '/../Views/admin/settings/index.php';
        require __DIR__ . '/../Views/layout.php';
    }

    public function save() {
        AuthController::requireAdmin();
        
        $keys = ['company_name', 'company_email', 'stripe_secret', 'stripe_public', 'smtp_host', 'smtp_user', 'smtp_pass'];
        foreach($keys as $key) {
            if (isset($_POST[$key])) {
                $val = $_POST[$key];
                DB::query("INSERT INTO settings (key_name, key_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE key_value = ?", [$key, $val, $val]);
            }
        }
        
        $_SESSION['flash_success'] = "Settings saved successfully.";
        header("Location: /admin/settings");
        exit;
    }
}
