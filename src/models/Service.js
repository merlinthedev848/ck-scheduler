const db = require('../../config/db');

class ServiceModel {
  static table = 'services';

  static async getAll() {
    return db(this.table)
      .leftJoin('service_categories', 'service_categories.id', 'services.category_id')
      .select('services.*', 'service_categories.name as category_name')
      .orderBy('services.name');
  }

  static async findById(id) {
    return db(this.table)
      .leftJoin('service_categories', 'service_categories.id', 'services.category_id')
      .where('services.id', id)
      .select('services.*', 'service_categories.name as category_name')
      .first();
  }

  static async getForProvider(providerId) {
    return db(this.table)
      .join('provider_services', 'provider_services.service_id', 'services.id')
      .leftJoin('service_categories', 'service_categories.id', 'services.category_id')
      .where('provider_services.provider_id', providerId)
      .select('services.*', 'service_categories.name as category_name')
      .orderBy('services.name');
  }

  static async getProvidersForService(serviceId) {
    return db('users')
      .join('provider_services', 'provider_services.provider_id', 'users.id')
      .where('provider_services.service_id', serviceId)
      .where('users.is_active', true)
      .select('users.id', 'users.first_name', 'users.last_name', 'users.email', 'users.phone', 'users.notes');
  }

  static async create(data) {
    data.requires_payment = data.requires_payment ? 1 : 0;
    const [id] = await db(this.table).insert(data);
    return this.findById(id);
  }

  static async update(id, data) {
    data.requires_payment = data.requires_payment ? 1 : 0;
    data.updated_at = db.fn.now();
    await db(this.table).where({ id }).update(data);
    return this.findById(id);
  }

  static async delete(id) {
    return db(this.table).where({ id }).delete();
  }
}

module.exports = ServiceModel;
