const db = require('../../config/db');

class CouponModel {
  static table = 'coupons';

  static async getAll() {
    return db(this.table).orderBy('created_at', 'desc');
  }

  static async findById(id) {
    return db(this.table).where({ id }).first();
  }

  static async findByCode(code) {
    return db(this.table).whereRaw('LOWER(code) = ?', [code.toLowerCase()]).first();
  }

  static async isValid(code) {
    const coupon = await this.findByCode(code);
    if (!coupon || !coupon.is_active) return { valid: false, error: 'Invalid or inactive promo code.' };
    
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { valid: false, error: 'This promo code has reached its usage limit.' };
    }
    
    if (coupon.expires_at && new Date() > new Date(coupon.expires_at)) {
      return { valid: false, error: 'This promo code has expired.' };
    }
    
    return { valid: true, coupon };
  }

  static async incrementUsage(id) {
    return db(this.table).where({ id }).increment('used_count', 1);
  }

  static async create(data) {
    const [id] = await db(this.table).insert(data);
    return this.findById(id);
  }

  static async update(id, data) {
    data.updated_at = db.fn.now();
    await db(this.table).where({ id }).update(data);
    return this.findById(id);
  }

  static async delete(id) {
    return db(this.table).where({ id }).delete();
  }
}

module.exports = CouponModel;
