<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold mb-0">Customers</h2>
    <button class="btn btn-gradient rounded-3 px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#newCustomerModal">
        <i class="bi bi-person-plus me-2"></i>Add Customer
    </button>
</div>

<div class="card glass-card border-0 shadow-sm">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="bg-light bg-opacity-50 text-muted" style="font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;">
                <tr>
                    <th class="ps-4 py-3 border-0">Name</th>
                    <th class="py-3 border-0">Email & Phone</th>
                    <th class="py-3 border-0">Registered</th>
                    <th class="pe-4 py-3 border-0 text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if(empty($customers)): ?>
                <tr>
                    <td colspan="4" class="text-center py-5 text-muted">
                        <i class="bi bi-people fs-1 d-block mb-3 opacity-50"></i>
                        No customers found.
                    </td>
                </tr>
                <?php endif; ?>
                <?php foreach($customers as $c): ?>
                <tr>
                    <td class="ps-4 py-3 fw-semibold">
                        <?= htmlspecialchars($c['first_name'] . ' ' . $c['last_name']) ?>
                    </td>
                    <td class="py-3">
                        <div class="text-dark"><?= htmlspecialchars($c['email']) ?></div>
                        <div class="text-muted small"><?= htmlspecialchars($c['phone']) ?></div>
                    </td>
                    <td class="py-3 text-muted">
                        <?= date('M j, Y', strtotime($c['created_at'])) ?>
                    </td>
                    <td class="pe-4 py-3 text-end">
                        <form method="POST" action="/admin/customers" class="d-inline" onsubmit="return confirm('Delete this customer and all their appointments?');">
                            <input type="hidden" name="_method" value="DELETE">
                            <input type="hidden" name="id" value="<?= $c['id'] ?>">
                            <button type="submit" class="btn btn-light btn-sm text-danger border"><i class="bi bi-trash"></i></button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="newCustomerModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content glass-card border-0 shadow">
      <div class="modal-header border-bottom-0 pb-0">
        <h5 class="modal-title fw-bold">Add New Customer</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form method="POST" action="/admin/customers">
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
                  <label class="form-label text-muted small fw-bold">Phone Number</label>
                  <input type="text" name="phone" class="form-control bg-light">
              </div>
          </div>
          <div class="modal-footer border-top-0 pt-4">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-gradient px-4">Save Customer</button>
          </div>
      </form>
    </div>
  </div>
</div>
