const db = require('../../config/db');

class BlockedPeriodModel {
  static table = 'blocked_periods';

  static async getByProvider(providerId) {
    return db(this.table).where({ provider_id: providerId }).orderBy('start_datetime');
  }

  static async getInRange(providerId, start, end) {
    return db(this.table)
      .where({ provider_id: providerId })
      .where('start_datetime', '<', end)
      .where('end_datetime', '>', start);
  }

  static async findById(id) {
    return db(this.table).where({ id }).first();
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

module.exports = BlockedPeriodModel;
