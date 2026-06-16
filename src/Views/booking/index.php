<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title) ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
        .wizard-card {
            border: none;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
        }
        .btn-gradient { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; }
        .btn-gradient:hover { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; }
    </style>
</head>
<body class="py-5">
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
            <div class="text-center mb-4">
                <h2 class="fw-bold text-dark">Book an Appointment</h2>
                <p class="text-muted">Select a service and provider to get started</p>
            </div>

            <div class="card wizard-card">
                <div class="card-body p-4 p-md-5">
                    <form method="POST" action="/booking">
                        
                        <h5 class="fw-bold mb-3">1. Service Selection</h5>
                        <div class="mb-4">
                            <select name="service_id" class="form-select form-select-lg bg-light" required>
                                <option value="" disabled selected>Choose a Service</option>
                                <?php foreach($services as $s): ?>
                                    <option value="<?= $s['id'] ?>"><?= htmlspecialchars($s['name']) ?> ($<?= number_format((float)$s['price'], 2) ?> - <?= $s['duration'] ?> min)</option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="mb-5">
                            <select name="provider_id" class="form-select form-select-lg bg-light" required>
                                <option value="" disabled selected>Choose a Provider</option>
                                <?php foreach($providers as $p): ?>
                                    <option value="<?= $p['id'] ?>"><?= htmlspecialchars($p['first_name'] . ' ' . $p['last_name']) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>

                        <h5 class="fw-bold mb-3 border-top pt-4">2. Date & Time</h5>
                        <div class="row mb-5">
                            <div class="col-6">
                                <input type="date" name="date" class="form-control form-control-lg bg-light" required min="<?= date('Y-m-d') ?>">
                            </div>
                            <div class="col-6">
                                <select name="time" class="form-select form-select-lg bg-light" required>
                                    <option value="" disabled selected>Time</option>
                                    <option value="09:00">09:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="13:00">01:00 PM</option>
                                    <option value="14:00">02:00 PM</option>
                                    <option value="15:00">03:00 PM</option>
                                </select>
                            </div>
                        </div>

                        <h5 class="fw-bold mb-3 border-top pt-4">3. Your Details</h5>
                        <div class="row mb-3">
                            <div class="col-6">
                                <input type="text" name="first_name" class="form-control bg-light" placeholder="First Name" required>
                            </div>
                            <div class="col-6">
                                <input type="text" name="last_name" class="form-control bg-light" placeholder="Last Name" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <input type="email" name="email" class="form-control bg-light" placeholder="Email Address" required>
                        </div>
                        <div class="mb-4">
                            <input type="text" name="phone" class="form-control bg-light" placeholder="Phone Number" required>
                        </div>

                        <div class="d-grid mt-4">
                            <button type="submit" class="btn btn-gradient btn-lg fw-bold rounded-3 py-3">
                                Confirm Booking
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
