<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold mb-0">Dashboard Overview</h2>
    <a href="/admin/appointments/new" class="btn btn-gradient rounded-3 px-4 shadow-sm"><i class="bi bi-plus-lg me-2"></i>New Booking</a>
</div>

<div class="row g-4 mb-4">
    <div class="col-md-3">
        <div class="card glass-card border-0 p-4 h-100 shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-muted fw-bold mb-0 text-uppercase" style="letter-spacing: 0.05em;">Appointments</h6>
                <div class="bg-primary bg-opacity-10 text-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-calendar-check fs-5"></i>
                </div>
            </div>
            <h3 class="fw-bold mb-0"><?= number_format($stats['total_appointments']) ?></h3>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card glass-card border-0 p-4 h-100 shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-muted fw-bold mb-0 text-uppercase" style="letter-spacing: 0.05em;">Customers</h6>
                <div class="bg-success bg-opacity-10 text-success rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-people fs-5"></i>
                </div>
            </div>
            <h3 class="fw-bold mb-0"><?= number_format($stats['total_customers']) ?></h3>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card glass-card border-0 p-4 h-100 shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-muted fw-bold mb-0 text-uppercase" style="letter-spacing: 0.05em;">Services</h6>
                <div class="bg-warning bg-opacity-10 text-warning rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-box fs-5"></i>
                </div>
            </div>
            <h3 class="fw-bold mb-0"><?= number_format($stats['total_services']) ?></h3>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card glass-card border-0 p-4 h-100 shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="text-muted fw-bold mb-0 text-uppercase" style="letter-spacing: 0.05em;">Pending Rev</h6>
                <div class="bg-danger bg-opacity-10 text-danger rounded-circle p-2 d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                    <i class="bi bi-currency-dollar fs-5"></i>
                </div>
            </div>
            <h3 class="fw-bold mb-0">$<?= number_format((float)$stats['pending_revenue'], 2) ?></h3>
        </div>
    </div>
</div>

<div class="card glass-card border-0 shadow-sm">
    <div class="card-header bg-transparent border-0 pt-4 pb-0 px-4">
        <h5 class="fw-bold mb-0">Recent Activity</h5>
    </div>
    <div class="card-body p-4">
        <div class="text-center text-muted py-5">
            <i class="bi bi-inbox fs-1 d-block mb-3 opacity-50"></i>
            <p class="mb-0">No recent activity to display.</p>
        </div>
    </div>
</div>
