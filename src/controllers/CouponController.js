const CouponModel = require('../models/Coupon');

class CouponController {
  static async index(req, res) {
    try {
      const coupons = await CouponModel.getAll();
      res.render('settings/coupons/index', { title: 'Promo Codes & Discounts', coupons, path: '/settings/coupons' });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/settings/general');
    }
  }

  static async create(req, res) {
    res.render('settings/coupons/form', { title: 'Create Promo Code', coupon: {}, path: '/settings/coupons' });
  }

  static async store(req, res) {
    try {
      let { code, type, discount, usage_limit, expires_at, is_active } = req.body;
      await CouponModel.create({
        code: code.trim().toUpperCase(),
        type,
        discount: parseFloat(discount),
        usage_limit: usage_limit ? parseInt(usage_limit) : null,
        expires_at: expires_at || null,
        is_active: is_active === '1'
      });
      req.flash('success', 'Promo code created.');
      res.redirect('/settings/coupons');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/settings/coupons/create');
    }
  }

  static async edit(req, res) {
    try {
      const coupon = await CouponModel.findById(req.params.id);
      if (!coupon) return res.status(404).render('errors/404');
      
      res.render('settings/coupons/form', { title: 'Edit Promo Code', coupon, path: '/settings/coupons' });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/settings/coupons');
    }
  }

  static async update(req, res) {
    try {
      let { code, type, discount, usage_limit, expires_at, is_active } = req.body;
      await CouponModel.update(req.params.id, {
        code: code.trim().toUpperCase(),
        type,
        discount: parseFloat(discount),
        usage_limit: usage_limit ? parseInt(usage_limit) : null,
        expires_at: expires_at || null,
        is_active: is_active === '1'
      });
      req.flash('success', 'Promo code updated.');
      res.redirect('/settings/coupons');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect(`/settings/coupons/${req.params.id}/edit`);
    }
  }

  static async delete(req, res) {
    try {
      await CouponModel.delete(req.params.id);
      req.flash('success', 'Promo code deleted.');
      res.redirect('/settings/coupons');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/settings/coupons');
    }
  }

  // API endpoint for checkout validation
  static async validate(req, res) {
    try {
      const { code } = req.body;
      const result = await CouponModel.isValid(code);
      if (!result.valid) return res.status(400).json({ error: result.error });
      res.json(result.coupon);
    } catch (e) {
      res.status(500).json({ error: 'Server error validating coupon.' });
    }
  }
}

module.exports = CouponController;
