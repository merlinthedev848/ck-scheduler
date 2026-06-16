<?php
namespace App\Controllers;

use PDO;
use Exception;

class SetupController {
    public function index() {
        if (file_exists(__DIR__ . '/../../config.php')) {
            die("Application is already installed.");
        }
        require __DIR__ . '/../Views/setup/index.php';
    }

    public function install() {
        if (file_exists(__DIR__ . '/../../config.php')) {
            die("Application is already installed.");
        }

        try {
            $dbHost = $_POST['db_host'] ?? '';
            $dbName = $_POST['db_name'] ?? '';
            $dbUser = $_POST['db_user'] ?? '';
            $dbPass = $_POST['db_pass'] ?? '';

            // Test connection
            $dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
            $pdo = new PDO($dsn, $dbUser, $dbPass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

            // Execute schema
            $sql = file_get_contents(__DIR__ . '/../Models/database.sql');
            $pdo->exec($sql);

            // Write config.php
            $configContent = "<?php\n"
                           . "define('DB_HOST', " . var_export($dbHost, true) . ");\n"
                           . "define('DB_NAME', " . var_export($dbName, true) . ");\n"
                           . "define('DB_USER', " . var_export($dbUser, true) . ");\n"
                           . "define('DB_PASS', " . var_export($dbPass, true) . ");\n";
            file_put_contents(__DIR__ . '/../../config.php', $configContent);

            // Seed Admin User
            $adminFirst = $_POST['admin_first_name'] ?? 'Admin';
            $adminLast = $_POST['admin_last_name'] ?? 'User';
            $adminEmail = $_POST['admin_email'] ?? '';
            $adminPass = password_hash($_POST['admin_password'] ?? '', PASSWORD_DEFAULT);
            $apiToken = bin2hex(random_bytes(16));

            $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, password_hash, role, api_token) VALUES (?, ?, ?, ?, 'admin', ?)");
            $stmt->execute([$adminFirst, $adminLast, $adminEmail, $adminPass, $apiToken]);

            // Seed Business Settings
            $companyName = $_POST['company_name'] ?? 'My Business';
            $stmt = $pdo->prepare("INSERT IGNORE INTO settings (key_name, key_value) VALUES ('company_name', ?), ('company_email', ?)");
            $stmt->execute([$companyName, $adminEmail]);

            header("Location: /admin");
            exit;

        } catch (Exception $e) {
            $error = $e->getMessage();
            require __DIR__ . '/../Views/setup/index.php';
        }
    }
}
