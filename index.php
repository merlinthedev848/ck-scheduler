<?php
/**
 * CK Scheduler - Vanilla PHP Front Controller
 * This file routes all incoming requests to the appropriate Controller.
 */

session_start();

// Basic autoloader for src directory
spl_autoload_register(function ($class) {
    $prefix = 'App\\';
    $base_dir = __DIR__ . '/src/';
    $len = strlen($prefix);
    
    if (strncmp($prefix, $class, $len) !== 0) { return; }
    
    $relative_class = substr($class, $len);
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';
    if (file_exists($file)) { require $file; }
});

// Simple Router implementation
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove subdirectories if installed in a subfolder
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName !== '/' && strpos($requestUri, $scriptName) === 0) {
    $requestUri = substr($requestUri, strlen($scriptName));
}

// Default route
if ($requestUri === '' || $requestUri === '/') {
    $requestUri = '/booking';
}

// Route mapping
try {
    if (strpos($requestUri, '/setup') === 0) {
        $controller = new \App\Controllers\SetupController();
        if ($method === 'POST') $controller->install();
        else $controller->index();
        exit;
    }

    // Ensure system is installed
    if (!file_exists(__DIR__ . '/config.php')) {
        header("Location: " . rtrim($scriptName, '/') . "/setup");
        exit;
    }
    
    require __DIR__ . '/config.php';
    
    // Additional routes here...
    if (strpos($requestUri, '/booking') === 0) {
        echo "Booking UI (Coming soon)";
    } elseif (strpos($requestUri, '/admin') === 0) {
        echo "Admin Portal (Coming soon)";
    } else {
        http_response_code(404);
        echo "404 Not Found";
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo "<h1>Internal Server Error</h1>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
}
