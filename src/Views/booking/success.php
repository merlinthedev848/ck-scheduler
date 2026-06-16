<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body { background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .glass-card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body class="py-5 d-flex align-items-center min-vh-100">
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-6 text-center">
            <div class="card glass-card p-5">
                <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
                <h2 class="fw-bold mt-4 mb-3">Booking Confirmed!</h2>
                <p class="text-muted mb-4">Your appointment has been successfully scheduled. We have sent a confirmation email with the details.</p>
                <div class="bg-light rounded p-3 mb-4 d-inline-block text-start">
                    <p class="mb-1 text-muted small fw-bold">Booking Reference</p>
                    <code class="fs-5 text-dark"><?= htmlspecialchars($appointment['hash']) ?></code>
                </div>
                <div>
                    <a href="/" class="btn btn-primary px-4 rounded-3">Return to Home</a>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
