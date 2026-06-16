<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($title) ? htmlspecialchars($title) . ' - CK Scheduler' : 'CK Scheduler' ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --primary-dark: #4f46e5;
            --secondary: #8b5cf6;
            --bg-body: #f8fafc;
            --sidebar-bg: #ffffff;
            --sidebar-hover: #f1f5f9;
        }
        body {
            background-color: var(--bg-body);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            overflow-x: hidden;
        }
        .sidebar {
            width: 260px;
            background: var(--sidebar-bg);
            border-right: 1px solid #e2e8f0;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            z-index: 100;
        }
        .main-content {
            margin-left: 260px;
            min-height: 100vh;
            padding: 2rem;
        }
        .nav-link {
            color: #475569;
            font-weight: 500;
            padding: 0.75rem 1.25rem;
            border-radius: 0.5rem;
            margin-bottom: 0.25rem;
            transition: all 0.2s ease;
        }
        .nav-link:hover, .nav-link.active {
            background-color: var(--sidebar-hover);
            color: var(--primary);
        }
        .nav-link i { margin-right: 0.75rem; font-size: 1.1rem; }
        .text-gradient {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .btn-gradient {
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            border: none;
            box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.4);
        }
        .btn-gradient:hover {
            background: linear-gradient(135deg, var(--primary-dark), #7c3aed);
            color: white;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }
    </style>
</head>
<body>

<?php if (isset($_SESSION['user_id'])): ?>
    <div class="sidebar d-flex flex-column p-3">
        <a href="/admin" class="d-flex align-items-center mb-4 text-decoration-none px-3 mt-2">
            <h4 class="fw-bold text-gradient m-0">CK Scheduler</h4>
        </a>
        <hr class="text-muted">
        <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item">
                <a href="/admin" class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/admin') === 0 && $_SERVER['REQUEST_URI'] == '/admin' ? 'active' : '' ?>">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </a>
            </li>
            <li>
                <a href="/admin/calendar" class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/admin/calendar') === 0 ? 'active' : '' ?>">
                    <i class="bi bi-calendar3"></i> Calendar
                </a>
            </li>
            <li>
                <a href="/admin/appointments" class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/admin/appointments') === 0 ? 'active' : '' ?>">
                    <i class="bi bi-card-list"></i> Appointments
                </a>
            </li>
            <?php if ($_SESSION['user_role'] === 'admin'): ?>
            <li>
                <a href="/admin/services" class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/admin/services') === 0 ? 'active' : '' ?>">
                    <i class="bi bi-box"></i> Services
                </a>
            </li>
            <li>
                <a href="/admin/providers" class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/admin/providers') === 0 ? 'active' : '' ?>">
                    <i class="bi bi-person-badge"></i> Providers
                </a>
            </li>
            <li>
                <a href="/admin/customers" class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/admin/customers') === 0 ? 'active' : '' ?>">
                    <i class="bi bi-people"></i> Customers
                </a>
            </li>
            <li class="mt-4 mb-2 px-3 text-uppercase text-muted" style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em;">System</li>
            <li>
                <a href="/admin/settings" class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/admin/settings') === 0 ? 'active' : '' ?>">
                    <i class="bi bi-gear"></i> Settings
                </a>
            </li>
            <li>
                <a href="/admin/marketplace" class="nav-link <?= strpos($_SERVER['REQUEST_URI'], '/admin/marketplace') === 0 ? 'active' : '' ?>">
                    <i class="bi bi-shop"></i> Add-on Marketplace
                </a>
            </li>
            <?php endif; ?>
        </ul>
        <hr class="text-muted">
        <div class="dropdown px-3 mb-2">
            <a href="#" class="d-flex align-items-center text-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
                <div class="bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center text-white me-2" style="width:32px;height:32px;">
                    <i class="bi bi-person"></i>
                </div>
                <strong><?= htmlspecialchars($_SESSION['user_name'] ?? 'User') ?></strong>
            </a>
            <ul class="dropdown-menu shadow">
                <li><a class="dropdown-item" href="/admin/profile">Profile</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" href="/logout">Sign out</a></li>
            </ul>
        </div>
    </div>
<?php endif; ?>

<div class="<?= isset($_SESSION['user_id']) ? 'main-content' : '' ?>">
    <div class="container-fluid">
        <?php if (isset($_SESSION['flash_success'])): ?>
            <div class="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
                <?= htmlspecialchars($_SESSION['flash_success']) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
            <?php unset($_SESSION['flash_success']); ?>
        <?php endif; ?>
        
        <?php if (isset($_SESSION['flash_error'])): ?>
            <div class="alert alert-danger alert-dismissible fade show shadow-sm" role="alert">
                <?= htmlspecialchars($_SESSION['flash_error']) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
            <?php unset($_SESSION['flash_error']); ?>
        <?php endif; ?>

        <?php require $contentView; ?>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
