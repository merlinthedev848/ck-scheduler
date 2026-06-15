const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class UserModel {
  static table = 'users';

  static async findById(id) {
    return db(this.table).where({ id }).first();
  }

  static async findByEmail(email) {
    return db(this.table).where({ email }).first();
  }

  static async findByToken(reset_token) {
    return db(this.table).where({ reset_token }).first();
  }

  static async findByRole(role) {
    return db(this.table).where({ role, is_active: true }).orderBy('last_name');
  }

  static async getAll() {
    return db(this.table).orderBy('last_name');
  }

  static async create(data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    data.api_token = uuidv4().replace(/-/g, '');
    const [id] = await db(this.table).insert(data);
    return this.findById(id);
  }

  static async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    }
    data.updated_at = db.fn.now();
    await db(this.table).where({ id }).update(data);
    return this.findById(id);
  }

  static async delete(id) {
    return db(this.table).where({ id }).delete();
  }

  static async verifyPassword(user, plainPassword) {
    return bcrypt.compare(plainPassword, user.password);
  }

  static async regenerateApiToken(id) {
    const api_token = uuidv4().replace(/-/g, '');
    await db(this.table).where({ id }).update({ api_token });
    return api_token;
  }

  // Provider service assignments
  static async getProviderServices(providerId) {
    return db('provider_services')
      .join('services', 'services.id', 'provider_services.service_id')
      .where('provider_services.provider_id', providerId)
      .select('services.*');
  }

  static async setProviderServices(providerId, serviceIds) {
    await db('provider_services').where({ provider_id: providerId }).delete();
    if (serviceIds && serviceIds.length > 0) {
      const rows = serviceIds.map(sid => ({ provider_id: providerId, service_id: parseInt(sid) }));
      await db('provider_services').insert(rows);
    }
  }

  static safe(user) {
    if (!user) return null;
    const { password, reset_token, ...safe } = user;
    return safe;
  }
}

module.exports = UserModel;
