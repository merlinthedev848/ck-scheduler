<div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="fw-bold mb-0">Appointments</h2>
</div>

<div class="card glass-card border-0 shadow-sm">
    <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
            <thead class="bg-light bg-opacity-50 text-muted" style="font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;">
                <tr>
                    <th class="ps-4 py-3 border-0">Date & Time</th>
                    <th class="py-3 border-0">Customer</th>
                    <th class="py-3 border-0">Service</th>
                    <th class="py-3 border-0">Provider</th>
                    <th class="py-3 border-0">Status</th>
                    <th class="pe-4 py-3 border-0 text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if(empty($appointments)): ?>
                <tr>
                    <td colspan="6" class="text-center py-5 text-muted">
                        <i class="bi bi-calendar-x fs-1 d-block mb-3 opacity-50"></i>
                        No appointments booked yet.
                    </td>
                </tr>
                <?php endif; ?>
                <?php foreach($appointments as $a): ?>
                <tr>
                    <td class="ps-4 py-3 fw-semibold">
                        <div class="text-dark"><?= date('M j, Y', strtotime($a['start_datetime'])) ?></div>
                        <div class="text-muted small"><?= date('g:i A', strtotime($a['start_datetime'])) ?> - <?= date('g:i A', strtotime($a['end_datetime'])) ?></div>
                    </td>
                    <td class="py-3 fw-semibold">
                        <?= htmlspecialchars($a['c_first'] . ' ' . $a['c_last']) ?>
                    </td>
                    <td class="py-3">
                        <span class="badge bg-secondary"><?= htmlspecialchars($a['service_name']) ?></span>
                    </td>
                    <td class="py-3 text-muted">
                        <?= htmlspecialchars($a['p_first'] . ' ' . $a['p_last']) ?>
                    </td>
                    <td class="py-3">
                        <?php if($a['status'] === 'confirmed'): ?>
                            <span class="badge bg-success bg-opacity-10 text-success border border-success">Confirmed</span>
                        <?php elseif($a['status'] === 'pending'): ?>
                            <span class="badge bg-warning bg-opacity-10 text-warning border border-warning">Pending</span>
                        <?php else: ?>
                            <span class="badge bg-light text-dark border"><?= ucfirst($a['status']) ?></span>
                        <?php endif; ?>
                    </td>
                    <td class="pe-4 py-3 text-end">
                        <form method="POST" action="/admin/appointments" class="d-inline" onsubmit="return confirm('Cancel this appointment?');">
                            <input type="hidden" name="_method" value="DELETE">
                            <input type="hidden" name="id" value="<?= $a['id'] ?>">
                            <button type="submit" class="btn btn-light btn-sm text-danger border"><i class="bi bi-x-circle"></i></button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>
