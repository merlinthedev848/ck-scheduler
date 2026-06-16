<?php
namespace App\Controllers;

use App\Models\DB;

class CalendarController {
    public function index() {
        AuthController::requireAuth();
        $title = "Calendar";
        $contentView = __DIR__ . '/../Views/admin/calendar/index.php';
        require __DIR__ . '/../Views/layout.php';
    }
}
