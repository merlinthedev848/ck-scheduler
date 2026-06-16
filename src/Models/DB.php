<?php
namespace App\Models;

use PDO;
use PDOException;

class DB {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        if (!file_exists(__DIR__ . '/../../config.php')) {
            throw new \Exception("Database configuration not found. Please run the setup wizard.");
        }
        
        require __DIR__ . '/../../config.php';
        
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        try {
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            throw new \Exception("Database connection failed: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public static function getConnection() {
        return self::getInstance()->pdo;
    }

    /**
     * Helper to run queries easily
     * Example: DB::query("SELECT * FROM users WHERE id = ?", [$id]);
     */
    public static function query($sql, $params = []) {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public static function fetchAll($sql, $params = []) {
        return self::query($sql, $params)->fetchAll();
    }

    public static function fetch($sql, $params = []) {
        return self::query($sql, $params)->fetch();
    }
}
