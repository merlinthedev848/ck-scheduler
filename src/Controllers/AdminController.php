<?php
namespace App\Controllers;

use App\Models\DB;

class AdminController {
    public function index() {
        // Fetch stats for the dashboard
        $stats = [
            'total_appointments' => DB::fetch("SELECT COUNT(*) as c FROM appointments")['c'] ?? 0,
            'total_customers' => DB::fetch("SELECT COUNT(*) as c FROM customers")['c'] ?? 0,
            'total_services' => DB::fetch("SELECT COUNT(*) as c FROM services")['c'] ?? 0,
            'pending_revenue' => DB::fetch("SELECT SUM(amount) as s FROM payments WHERE status = 'pending'")['s'] ?? '0.00'
        ];

        $title = "Admin Dashboard";
        $contentView = __DIR__ . '/../Views/admin/dashboard.php';
        require __DIR__ . '/../Views/layout.php';
    }
}
