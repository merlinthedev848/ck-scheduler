<?php
namespace App\Controllers;

use App\Models\DB;

class CustomersController {
    public function index() {
        AuthController::requireAdmin();
        $customers = DB::fetchAll("SELECT * FROM customers ORDER BY created_at DESC");
        
        $title = "Customers";
        $contentView = __DIR__ . '/../Views/admin/customers/index.php';
        require __DIR__ . '/../Views/layout.php';
    }

    public function store() {
        AuthController::requireAdmin();
        $first_name = $_POST['first_name'] ?? '';
        $last_name = $_POST['last_name'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';
        
        DB::query("INSERT INTO customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)", 
            [$first_name, $last_name, $email, $phone]
        );
        
        $_SESSION['flash_success'] = "Customer created.";
        header("Location: /admin/customers");
        exit;
    }

    public function delete() {
        AuthController::requireAdmin();
        $id = (int)($_POST['id'] ?? 0);
        DB::query("DELETE FROM customers WHERE id = ?", [$id]);
        $_SESSION['flash_success'] = "Customer deleted.";
        header("Location: /admin/customers");
        exit;
    }
}
