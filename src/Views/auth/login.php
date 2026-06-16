<div class="row justify-content-center align-items-center" style="min-height: 80vh;">
    <div class="col-md-5 col-lg-4">
        <div class="text-center mb-4">
            <h1 class="fw-bold text-gradient">CK Scheduler</h1>
            <p class="text-muted">Sign in to your account</p>
        </div>
        <div class="card glass-card p-4">
            <form method="POST" action="/login">
                <div class="mb-3">
                    <label class="form-label text-muted small fw-bold">Email Address</label>
                    <input type="email" name="email" class="form-control form-control-lg bg-light" required autofocus>
                </div>
                <div class="mb-4">
                    <div class="d-flex justify-content-between">
                        <label class="form-label text-muted small fw-bold">Password</label>
                        <a href="/recovery" class="small text-decoration-none" style="color: var(--primary);">Forgot password?</a>
                    </div>
                    <input type="password" name="password" class="form-control form-control-lg bg-light" required>
                </div>
                <button type="submit" class="btn btn-gradient btn-lg w-100 fw-bold rounded-3">Sign In</button>
            </form>
        </div>
    </div>
</div>
