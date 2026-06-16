<?php
namespace App\Controllers;

use App\Models\DB;

class ServicesController {
    public function index() {
        AuthController::requireAdmin();
        $services = DB::fetchAll("
            SELECT s.*, c.name as category_name 
            FROM services s 
            LEFT JOIN service_categories c ON s.category_id = c.id 
            ORDER BY s.name ASC
        ");
        $title = "Services Management";
        $contentView = __DIR__ . '/../Views/admin/services/index.php';
        require __DIR__ . '/../Views/layout.php';
    }

    public function store() {
        AuthController::requireAdmin();
        $name = $_POST['name'] ?? '';
        $duration = (int)($_POST['duration'] ?? 30);
        $price = (float)($_POST['price'] ?? 0);
        $requires_payment = isset($_POST['requires_payment']) ? 1 : 0;
        
        DB::query("INSERT INTO services (name, duration, price, requires_payment) VALUES (?, ?, ?, ?)", 
            [$name, $duration, $price, $requires_payment]
        );
        
        $_SESSION['flash_success'] = "Service created successfully.";
        header("Location: /admin/services");
        exit;
    }

    public function delete() {
        AuthController::requireAdmin();
        $id = (int)($_POST['id'] ?? 0);
        DB::query("DELETE FROM services WHERE id = ?", [$id]);
        $_SESSION['flash_success'] = "Service deleted.";
        header("Location: /admin/services");
        exit;
    }
}
