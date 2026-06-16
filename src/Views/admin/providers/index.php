<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold mb-0">Staff & Providers</h2>
    <button class="btn btn-gradient rounded-3 px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#newProviderModal">
        <i class="bi bi-person-plus me-2"></i>Add Provider
    </button>
</div>

<div class="card glass-card border-0 shadow-sm">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="bg-light bg-opacity-50 text-muted" style="font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;">
                <tr>
                    <th class="ps-4 py-3 border-0">Name</th>
                    <th class="py-3 border-0">Email</th>
                    <th class="py-3 border-0">Role</th>
                    <th class="pe-4 py-3 border-0 text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($providers as $p): ?>
                <tr>
                    <td class="ps-4 py-3 fw-semibold">
                        <div class="d-flex align-items-center">
                            <div class="bg-gradient-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width:40px;height:40px;">
                                <?= strtoupper(substr($p['first_name'], 0, 1) . substr($p['last_name'], 0, 1)) ?>
                            </div>
                            <?= htmlspecialchars($p['first_name'] . ' ' . $p['last_name']) ?>
                        </div>
                    </td>
                    <td class="py-3 text-muted"><?= htmlspecialchars($p['email']) ?></td>
                    <td class="py-3">
                        <?php if($p['role'] === 'admin'): ?>
                            <span class="badge bg-primary bg-opacity-10 text-primary border border-primary">Administrator</span>
                        <?php else: ?>
                            <span class="badge bg-info bg-opacity-10 text-info border border-info">Provider</span>
                        <?php endif; ?>
                    </td>
                    <td class="pe-4 py-3 text-end">
                        <form method="POST" action="/admin/providers" class="d-inline" onsubmit="return confirm('Delete this provider?');">
                            <input type="hidden" name="_method" value="DELETE">
                            <input type="hidden" name="id" value="<?= $p['id'] ?>">
                            <button type="submit" class="btn btn-light btn-sm text-danger border" <?= $p['id'] === $_SESSION['user_id'] ? 'disabled' : '' ?>><i class="bi bi-trash"></i></button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="newProviderModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content glass-card border-0 shadow">
      <div class="modal-header border-bottom-0 pb-0">
        <h5 class="modal-title fw-bold">Add New Provider</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form method="POST" action="/admin/providers">
          <div class="modal-body pb-0 pt-4">
              <div class="row mb-3">
                  <div class="col-6">
                      <label class="form-label text-muted small fw-bold">First Name</label>
                      <input type="text" name="first_name" class="form-control bg-light" required>
                  </div>
                  <div class="col-6">
                      <label class="form-label text-muted small fw-bold">Last Name</label>
                      <input type="text" name="last_name" class="form-control bg-light" required>
                  </div>
              </div>
              <div class="mb-3">
                  <label class="form-label text-muted small fw-bold">Email</label>
                  <input type="email" name="email" class="form-control bg-light" required>
              </div>
              <div class="mb-3">
                  <label class="form-label text-muted small fw-bold">Password</label>
                  <input type="password" name="password" class="form-control bg-light" required>
              </div>
          </div>
          <div class="modal-footer border-top-0 pt-4">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-gradient px-4">Save Provider</button>
          </div>
      </form>
    </div>
  </div>
</div>
