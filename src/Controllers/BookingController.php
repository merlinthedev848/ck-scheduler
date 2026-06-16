<?php
namespace App\Controllers;

use App\Models\DB;

class BookingController {
    public function index() {
        // Fetch data for the booking form
        $services = DB::fetchAll("SELECT * FROM services ORDER BY name ASC");
        $providers = DB::fetchAll("SELECT id, first_name, last_name FROM users WHERE role IN ('admin', 'provider') ORDER BY first_name ASC");
        
        $title = "Book an Appointment";
        require __DIR__ . '/../Views/booking/index.php';
    }

    public function process() {
        $service_id = (int)$_POST['service_id'];
        $provider_id = (int)$_POST['provider_id'];
        $date = $_POST['date'];
        $time = $_POST['time']; // e.g. 10:00
        
        // Customer details
        $first_name = $_POST['first_name'];
        $last_name = $_POST['last_name'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];
        
        // Find or create customer
        $customer = DB::fetch("SELECT id FROM customers WHERE email = ?", [$email]);
        if (!$customer) {
            DB::query("INSERT INTO customers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)", [$first_name, $last_name, $email, $phone]);
            $customer_id = DB::getConnection()->lastInsertId();
        } else {
            $customer_id = $customer['id'];
        }
        
        $service = DB::fetch("SELECT * FROM services WHERE id = ?", [$service_id]);
        $start_datetime = $date . ' ' . $time . ':00';
        $end_time_ts = strtotime($start_datetime) + ($service['duration'] * 60);
        $end_datetime = date('Y-m-d H:i:s', $end_time_ts);
        
        $hash = bin2hex(random_bytes(16));
        
        DB::query("INSERT INTO appointments (hash, customer_id, provider_id, service_id, start_datetime, end_datetime, status) VALUES (?, ?, ?, ?, ?, ?, 'confirmed')", 
            [$hash, $customer_id, $provider_id, $service_id, $start_datetime, $end_datetime]
        );
        
        // If requires payment, redirect to payment intent logic here (Phase 4)
        if ($service['requires_payment']) {
            // Setup pending payment logic here
        }
        
        header("Location: /booking/success?hash=" . $hash);
        exit;
    }
    
    public function success() {
        $hash = $_GET['hash'] ?? '';
        $appointment = DB::fetch("SELECT * FROM appointments WHERE hash = ?", [$hash]);
        if (!$appointment) die("Appointment not found.");
        
        $title = "Booking Confirmed";
        require __DIR__ . '/../Views/booking/success.php';
    }
}
