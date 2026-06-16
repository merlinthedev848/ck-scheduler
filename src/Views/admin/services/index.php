<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold mb-0">Services</h2>
    <button class="btn btn-gradient rounded-3 px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#newServiceModal">
        <i class="bi bi-plus-lg me-2"></i>Add Service
    </button>
</div>

<div class="card glass-card border-0 shadow-sm">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="bg-light bg-opacity-50 text-muted" style="font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;">
                <tr>
                    <th class="ps-4 py-3 border-0">Service Name</th>
                    <th class="py-3 border-0">Duration</th>
                    <th class="py-3 border-0">Price</th>
                    <th class="py-3 border-0">Payment</th>
                    <th class="pe-4 py-3 border-0 text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if(empty($services)): ?>
                <tr>
                    <td colspan="5" class="text-center py-5 text-muted">
                        <i class="bi bi-box fs-1 d-block mb-3 opacity-50"></i>
                        No services found. Click "Add Service" to create one.
                    </td>
                </tr>
                <?php endif; ?>
                <?php foreach($services as $s): ?>
                <tr>
                    <td class="ps-4 py-3 fw-semibold">
                        <?= htmlspecialchars($s['name']) ?>
                        <?php if($s['category_name']): ?>
                            <span class="badge bg-secondary ms-2"><?= htmlspecialchars($s['category_name']) ?></span>
                        <?php endif; ?>
                    </td>
                    <td class="py-3 text-muted"><?= (int)$s['duration'] ?> mins</td>
                    <td class="py-3 fw-bold">$<?= number_format((float)$s['price'], 2) ?></td>
                    <td class="py-3">
                        <?php if($s['requires_payment']): ?>
                            <span class="badge bg-success bg-opacity-10 text-success border border-success">Required</span>
                        <?php else: ?>
                            <span class="badge bg-light text-dark border">Optional</span>
                        <?php endif; ?>
                    </td>
                    <td class="pe-4 py-3 text-end">
                        <form method="POST" action="/admin/services" class="d-inline" onsubmit="return confirm('Delete this service?');">
                            <input type="hidden" name="_method" value="DELETE">
                            <input type="hidden" name="id" value="<?= $s['id'] ?>">
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
<div class="modal fade" id="newServiceModal" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content glass-card border-0 shadow">
      <div class="modal-header border-bottom-0 pb-0">
        <h5 class="modal-title fw-bold">Add New Service</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <form method="POST" action="/admin/services">
          <div class="modal-body pb-0 pt-4">
              <div class="mb-3">
                  <label class="form-label text-muted small fw-bold">Service Name</label>
                  <input type="text" name="name" class="form-control bg-light" required>
              </div>
              <div class="row mb-3">
                  <div class="col-6">
                      <label class="form-label text-muted small fw-bold">Duration (mins)</label>
                      <input type="number" name="duration" class="form-control bg-light" value="30" required>
                  </div>
                  <div class="col-6">
                      <label class="form-label text-muted small fw-bold">Price ($)</label>
                      <input type="number" step="0.01" name="price" class="form-control bg-light" value="0.00" required>
                  </div>
              </div>
              <div class="mb-3 form-check form-switch mt-4">
                  <input class="form-check-input" type="checkbox" name="requires_payment" id="reqPay" value="1">
                  <label class="form-check-label fw-bold" for="reqPay">Require payment during booking</label>
                  <div class="form-text">Customer must pay before appointment is confirmed.</div>
              </div>
          </div>
          <div class="modal-footer border-top-0 pt-4">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-gradient px-4">Save Service</button>
          </div>
      </form>
    </div>
  </div>
</div>
