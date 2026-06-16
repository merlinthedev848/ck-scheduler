<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold mb-0">System Settings</h2>
</div>

<form method="POST" action="/admin/settings">
    <div class="row g-4">
        <div class="col-md-6">
            <div class="card glass-card border-0 shadow-sm h-100">
                <div class="card-header bg-transparent border-0 pt-4 pb-0 px-4">
                    <h5 class="fw-bold mb-0"><i class="bi bi-building me-2 text-primary"></i>Business Profile</h5>
                </div>
                <div class="card-body p-4">
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-bold">Company Name</label>
                        <input type="text" name="company_name" class="form-control bg-light" value="<?= htmlspecialchars($settings['company_name'] ?? '') ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-bold">Company Email</label>
                        <input type="email" name="company_email" class="form-control bg-light" value="<?= htmlspecialchars($settings['company_email'] ?? '') ?>">
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card glass-card border-0 shadow-sm h-100">
                <div class="card-header bg-transparent border-0 pt-4 pb-0 px-4">
                    <h5 class="fw-bold mb-0"><i class="bi bi-credit-card me-2 text-primary"></i>Payment Gateways</h5>
                </div>
                <div class="card-body p-4">
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-bold">Stripe Public Key</label>
                        <input type="text" name="stripe_public" class="form-control bg-light" value="<?= htmlspecialchars($settings['stripe_public'] ?? '') ?>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-bold">Stripe Secret Key</label>
                        <input type="password" name="stripe_secret" class="form-control bg-light" value="<?= htmlspecialchars($settings['stripe_secret'] ?? '') ?>">
                    </div>
                </div>
            </div>
        </div>

        <div class="col-md-6">
            <div class="card glass-card border-0 shadow-sm h-100">
                <div class="card-header bg-transparent border-0 pt-4 pb-0 px-4">
                    <h5 class="fw-bold mb-0"><i class="bi bi-envelope me-2 text-primary"></i>SMTP Configuration</h5>
                </div>
                <div class="card-body p-4">
                    <div class="mb-3">
                        <label class="form-label text-muted small fw-bold">SMTP Host</label>
                        <input type="text" name="smtp_host" class="form-control bg-light" value="<?= htmlspecialchars($settings['smtp_host'] ?? '') ?>">
                    </div>
                    <div class="row">
                        <div class="col-6 mb-3">
                            <label class="form-label text-muted small fw-bold">SMTP User</label>
                            <input type="text" name="smtp_user" class="form-control bg-light" value="<?= htmlspecialchars($settings['smtp_user'] ?? '') ?>">
                        </div>
                        <div class="col-6 mb-3">
                            <label class="form-label text-muted small fw-bold">SMTP Password</label>
                            <input type="password" name="smtp_pass" class="form-control bg-light" value="<?= htmlspecialchars($settings['smtp_pass'] ?? '') ?>">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-12 mt-4 text-end">
            <button type="submit" class="btn btn-gradient rounded-3 px-5 py-2 shadow-sm fw-bold">Save All Settings</button>
        </div>
    </div>
</form>
