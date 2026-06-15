const express = require('express');
const router = express.Router();
const { requireApiKey } = require('../../middleware/auth');
const AppointmentModel = require('../../models/Appointment');
const ServiceModel = require('../../models/Service');
const CustomerModel = require('../../models/Customer');
const UserModel = require('../../models/User');

// All API routes require an API key
router.use(requireApiKey);

// ── Appointments ─────────────────────────────────────────────────────────────
router.get('/appointments', async (req, res) => {
  try {
    const { limit = 50, offset = 0, status } = req.query;
    const appointments = await AppointmentModel.getAll({ limit: parseInt(limit), offset: parseInt(offset), status });
    res.json({ data: appointments, limit, offset });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/appointments/:id', async (req, res) => {
  try {
    const appt = await AppointmentModel.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Not found' });
    res.json(appt);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/appointments', async (req, res) => {
  try {
    const appt = await AppointmentModel.create(req.body);
    res.status(201).json(appt);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.put('/appointments/:id', async (req, res) => {
  try {
    const appt = await AppointmentModel.update(req.params.id, req.body);
    res.json(appt);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.delete('/appointments/:id', async (req, res) => {
  try {
    await AppointmentModel.delete(req.params.id);
    res.json({ message: 'Appointment deleted.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Services ──────────────────────────────────────────────────────────────────
router.get('/services', async (req, res) => {
  try { res.json(await ServiceModel.getAll()); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/services/:id', async (req, res) => {
  try {
    const svc = await ServiceModel.findById(req.params.id);
    if (!svc) return res.status(404).json({ error: 'Not found' });
    res.json(svc);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/services', async (req, res) => {
  try { res.status(201).json(await ServiceModel.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});

router.put('/services/:id', async (req, res) => {
  try { res.json(await ServiceModel.update(req.params.id, req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});

router.delete('/services/:id', async (req, res) => {
  try { await ServiceModel.delete(req.params.id); res.json({ message: 'Deleted.' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Providers ─────────────────────────────────────────────────────────────────
router.get('/providers', async (req, res) => {
  try { res.json(await UserModel.findByRole('provider')); } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/providers/:id', async (req, res) => {
  try {
    const p = await UserModel.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(UserModel.safe(p));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Customers ─────────────────────────────────────────────────────────────────
router.get('/customers', async (req, res) => {
  try {
    const { search, limit = 50, offset = 0 } = req.query;
    const customers = await CustomerModel.getAll({ search, limit: parseInt(limit), offset: parseInt(offset) });
    res.json({ data: customers });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/customers/:id', async (req, res) => {
  try {
    const c = await CustomerModel.findById(req.params.id);
    if (!c) return res.status(404).json({ error: 'Not found' });
    res.json(c);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/customers', async (req, res) => {
  try { res.status(201).json(await CustomerModel.create(req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});

router.put('/customers/:id', async (req, res) => {
  try { res.json(await CustomerModel.update(req.params.id, req.body)); } catch (e) { res.status(400).json({ error: e.message }); }
});

router.delete('/customers/:id', async (req, res) => {
  try { await CustomerModel.delete(req.params.id); res.json({ message: 'Deleted.' }); } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
