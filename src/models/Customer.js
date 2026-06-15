const db = require('../../config/db');

class CustomerModel {
  static table = 'customers';

  static async findById(id) {
    return db(this.table).where({ id }).first();
  }

  static async findByEmail(email) {
    return db(this.table).where({ email }).first();
  }

  static async getAll({ search, limit = 50, offset = 0 } = {}) {
    let q = db(this.table).orderBy('last_name');
    if (search) {
      q = q.where(function() {
        this.where('first_name', 'like', `%${search}%`)
          .orWhere('last_name', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('phone', 'like', `%${search}%`);
      });
    }
    return q.limit(limit).offset(offset);
  }

  static async count(search = '') {
    let q = db(this.table);
    if (search) {
      q = q.where(function() {
        this.where('first_name', 'like', `%${search}%`)
          .orWhere('last_name', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`);
      });
    }
    const [{ count }] = await q.count('id as count');
    return parseInt(count);
  }

  static async findOrCreate(data) {
    let customer = await this.findByEmail(data.email);
    if (!customer) {
      const [id] = await db(this.table).insert(data);
      customer = await this.findById(id);
    }
    return customer;
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

  static async getAppointments(customerId) {
    return db('appointments')
      .join('services', 'services.id', 'appointments.service_id')
      .join('users as providers', 'providers.id', 'appointments.provider_id')
      .where('appointments.customer_id', customerId)
      .select(
        'appointments.*',
        'services.name as service_name',
        'providers.first_name as provider_first_name',
        'providers.last_name as provider_last_name'
      )
      .orderBy('appointments.start_datetime', 'desc');
  }
}

module.exports = CustomerModel;
