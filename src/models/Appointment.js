const db = require('../../config/db');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

class AppointmentModel {
  static table = 'appointments';

  static baseQuery() {
    return db(this.table)
      .join('services', 'services.id', 'appointments.service_id')
      .join('users as providers', 'providers.id', 'appointments.provider_id')
      .join('customers', 'customers.id', 'appointments.customer_id')
      .leftJoin('payments', 'payments.appointment_id', 'appointments.id')
      .select(
        'appointments.*',
        'services.name as service_name',
        'services.duration as service_duration',
        'services.price as service_price',
        'providers.first_name as provider_first_name',
        'providers.last_name as provider_last_name',
        'providers.email as provider_email',
        'customers.first_name as customer_first_name',
        'customers.last_name as customer_last_name',
        'customers.email as customer_email',
        'customers.phone as customer_phone',
        'payments.status as payment_status',
        'payments.amount as payment_amount'
      );
  }

  static async findById(id) {
    return this.baseQuery().where('appointments.id', id).first();
  }

  static async findByHash(hash) {
    return this.baseQuery().where('appointments.hash', hash).first();
  }

  static async getForCalendar({ start, end, providerId } = {}) {
    let q = this.baseQuery()
      .where('appointments.start_datetime', '>=', start)
      .where('appointments.end_datetime', '<=', end);
    if (providerId) q = q.where('appointments.provider_id', providerId);
    return q.orderBy('appointments.start_datetime');
  }

  static async getAll({ limit = 50, offset = 0, search = '', status = '' } = {}) {
    let q = this.baseQuery();
    if (status) q = q.where('appointments.status', status);
    if (search) {
      q = q.where(function() {
        this.where('customers.first_name', 'like', `%${search}%`)
          .orWhere('customers.last_name', 'like', `%${search}%`)
          .orWhere('customers.email', 'like', `%${search}%`)
          .orWhere('services.name', 'like', `%${search}%`);
      });
    }
    return q.orderBy('appointments.start_datetime', 'desc').limit(limit).offset(offset);
  }

  static async create(data) {
    data.hash = crypto.randomBytes(32).toString('hex');
    data.book_datetime = new Date();
    const [id] = await db(this.table).insert(data);
    return this.findById(id);
  }

  static async update(id, data) {
    data.updated_at = db.fn.now();
    await db(this.table).where({ id }).update(data);
    return this.findById(id);
  }

  static async updateStatus(id, status) {
    return db(this.table).where({ id }).update({ status, updated_at: db.fn.now() });
  }

  static async delete(id) {
    return db(this.table).where({ id }).delete();
  }

  static async checkConflict(providerId, startDatetime, endDatetime, excludeId = null) {
    let q = db(this.table)
      .where('provider_id', providerId)
      .whereNotIn('status', ['cancelled'])
      .where(function() {
        this.where(function() {
          this.where('start_datetime', '<', endDatetime)
              .where('end_datetime', '>', startDatetime);
        });
      });
    if (excludeId) q = q.whereNot('id', excludeId);
    return q.first();
  }
}

module.exports = AppointmentModel;
