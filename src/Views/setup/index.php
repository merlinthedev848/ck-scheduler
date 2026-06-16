<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CK Scheduler - Setup Wizard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        .wizard-card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        .bg-gradient-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
        .text-gradient { background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .btn-gradient { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; }
        .btn-gradient:hover { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; }
    </style>
</head>
<body class="d-flex align-items-center min-vh-100 py-5">
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
            <div class="text-center mb-4">
                <h1 class="fw-bold text-gradient">CK Scheduler</h1>
                <p class="text-muted">Prestige Appointment Management</p>
            </div>

            <div class="card wizard-card">
                <div class="card-header bg-gradient-primary text-white text-center py-3" style="border-radius: 12px 12px 0 0;">
                    <h4 class="mb-0 fw-semibold">Installation Wizard</h4>
                </div>
                <div class="card-body p-4 p-md-5">
                    <?php if (isset($error)): ?>
                        <div class="alert alert-danger shadow-sm rounded-3"><?= htmlspecialchars($error) ?></div>
                    <?php endif; ?>

                    <form method="POST" action="/setup">
                        
                        <h5 class="fw-bold mb-3 border-bottom pb-2">1. MySQL Database</h5>
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-bold">Database Host</label>
                            <input type="text" class="form-control form-control-lg bg-light" name="db_host" value="localhost" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-bold">Database Name</label>
                            <input type="text" class="form-control form-control-lg bg-light" name="db_name" required>
                        </div>
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <label class="form-label text-muted small fw-bold">Username</label>
                                <input type="text" class="form-control form-control-lg bg-light" name="db_user" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted small fw-bold">Password</label>
                                <input type="password" class="form-control form-control-lg bg-light" name="db_pass">
                            </div>
                        </div>

                        <h5 class="fw-bold mb-3 border-bottom pb-2 mt-5">2. Master Administrator</h5>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label class="form-label text-muted small fw-bold">First Name</label>
                                <input type="text" class="form-control form-control-lg bg-light" name="admin_first_name" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted small fw-bold">Last Name</label>
                                <input type="text" class="form-control form-control-lg bg-light" name="admin_last_name" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted small fw-bold">Email Address</label>
                            <input type="email" class="form-control form-control-lg bg-light" name="admin_email" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label text-muted small fw-bold">Secure Password</label>
                            <input type="password" class="form-control form-control-lg bg-light" name="admin_password" required>
                        </div>

                        <h5 class="fw-bold mb-3 border-bottom pb-2 mt-5">3. Business Details</h5>
                        <div class="mb-4">
                            <label class="form-label text-muted small fw-bold">Company / Business Name</label>
                            <input type="text" class="form-control form-control-lg bg-light" name="company_name" required>
                        </div>

                        <div class="d-grid mt-5">
                            <button type="submit" class="btn btn-gradient btn-lg fw-bold rounded-3 shadow-sm py-3">
                                Install CK Scheduler
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
        </div>
    </div>
</div>
</body>
</html>
