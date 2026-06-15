const db = require('../../config/db');

class PaymentModel {
  static table = 'payments';

  static async findById(id) {
    return db(this.table).where({ id }).first();
  }

  static async findByAppointment(appointmentId) {
    return db(this.table).where({ appointment_id: appointmentId }).first();
  }

  static async findBySessionId(stripeSessionId) {
    return db(this.table).where({ stripe_session_id: stripeSessionId }).first();
  }

  static async getAll({ limit = 50, offset = 0 } = {}) {
    return db(this.table)
      .join('appointments', 'appointments.id', 'payments.appointment_id')
      .join('customers', 'customers.id', 'appointments.customer_id')
      .join('services', 'services.id', 'appointments.service_id')
      .select(
        'payments.*',
        'customers.first_name', 'customers.last_name', 'customers.email',
        'services.name as service_name',
        'appointments.start_datetime'
      )
      .orderBy('payments.created_at', 'desc')
      .limit(limit).offset(offset);
  }

  static async create(data) {
    const [id] = await db(this.table).insert(data);
    return this.findById(id);
  }

  static async updateStatus(id, status, extra = {}) {
    return db(this.table).where({ id }).update({ status, ...extra, updated_at: db.fn.now() });
  }

  static async updateBySessionId(sessionId, data) {
    return db(this.table).where({ stripe_session_id: sessionId }).update({ ...data, updated_at: db.fn.now() });
  }

  static async totalRevenue() {
    const [{ total }] = await db(this.table).where({ status: 'paid' }).sum('amount as total');
    return parseFloat(total || 0);
  }
}

module.exports = PaymentModel;
