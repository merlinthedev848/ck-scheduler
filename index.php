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
    
    // Auth Routes
    if ($requestUri === '/login') {
        $controller = new \App\Controllers\AuthController();
        if ($method === 'POST') $controller->loginAction();
        else $controller->loginView();
        exit;
    }
    if ($requestUri === '/logout') {
        (new \App\Controllers\AuthController())->logout();
    }

    // Additional routes here...
    if (strpos($requestUri, '/booking') === 0) {
        $c = new \App\Controllers\BookingController();
        if ($requestUri === '/booking/success') {
            $c->success();
        } else {
            if ($method === 'POST') $c->process();
            else $c->index();
        }
    } elseif (strpos($requestUri, '/admin') === 0) {
        \App\Controllers\AuthController::requireAuth();
        
        if ($requestUri === '/admin') {
            (new \App\Controllers\AdminController())->index();
        } elseif ($requestUri === '/admin/services') {
            $c = new \App\Controllers\ServicesController();
            if ($method === 'POST') {
                if (isset($_POST['_method']) && $_POST['_method'] === 'DELETE') $c->delete();
                else $c->store();
            } else $c->index();
        } elseif ($requestUri === '/admin/providers') {
            $c = new \App\Controllers\ProvidersController();
            if ($method === 'POST') {
                if (isset($_POST['_method']) && $_POST['_method'] === 'DELETE') $c->delete();
                else $c->store();
            } else $c->index();
        } elseif ($requestUri === '/admin/customers') {
            $c = new \App\Controllers\CustomersController();
            if ($method === 'POST') {
                if (isset($_POST['_method']) && $_POST['_method'] === 'DELETE') $c->delete();
                else $c->store();
            } else $c->index();
        } elseif ($requestUri === '/admin/appointments') {
            $c = new \App\Controllers\AppointmentsController();
            if ($method === 'POST') {
                if (isset($_POST['_method']) && $_POST['_method'] === 'DELETE') $c->delete();
                else $c->store();
            } else $c->index();
        } elseif ($requestUri === '/admin/settings') {
            $c = new \App\Controllers\SettingsController();
            if ($method === 'POST') $c->save();
            else $c->index();
        } elseif ($requestUri === '/admin/calendar') {
            (new \App\Controllers\CalendarController())->index();
        } elseif ($requestUri === '/admin/marketplace') {
            echo "<div style='padding:50px;text-align:center;font-family:sans-serif;'><h2>Add-on Marketplace</h2><p>Coming Soon - Purchase premium extensions like Zoom integration, Advanced Invoicing, etc.</p></div>";
        } else {
            http_response_code(404);
            echo "404 Admin Page Not Found";
        }
    } else {
        http_response_code(404);
        echo "404 Not Found";
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo "<h1>Internal Server Error</h1>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
}
