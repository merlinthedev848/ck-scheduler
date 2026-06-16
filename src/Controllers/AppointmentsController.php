<?php
namespace App\Controllers;

use App\Models\DB;

class AppointmentsController {
    public function index() {
        AuthController::requireAuth();
        
        $sql = "
            SELECT a.*, 
                   s.name as service_name, 
                   c.first_name as c_first, c.last_name as c_last,
                   p.first_name as p_first, p.last_name as p_last
            FROM appointments a
            JOIN services s ON a.service_id = s.id
            JOIN customers c ON a.customer_id = c.id
            JOIN users p ON a.provider_id = p.id
            ORDER BY a.start_datetime DESC
        ";
        $appointments = DB::fetchAll($sql);
        
        $title = "Appointments";
        $contentView = __DIR__ . '/../Views/admin/appointments/index.php';
        require __DIR__ . '/../Views/layout.php';
    }

    public function delete() {
        AuthController::requireAuth();
        $id = (int)($_POST['id'] ?? 0);
        DB::query("DELETE FROM appointments WHERE id = ?", [$id]);
        $_SESSION['flash_success'] = "Appointment cancelled.";
        header("Location: /admin/appointments");
        exit;
    }
}
