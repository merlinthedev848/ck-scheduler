const db = require('../../config/db');

class ServiceCategoryModel {
  static table = 'service_categories';

  static async getAll() {
    return db(this.table).orderBy('name');
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

module.exports = ServiceCategoryModel;
