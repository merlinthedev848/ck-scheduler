const db = require('../../config/db');

class SettingModel {
  static async get(name) {
    const row = await db('settings').where({ name }).first();
    return row ? row.value : null;
  }

  static async getAll() {
    const rows = await db('settings').select('name', 'value');
    return rows.reduce((acc, r) => { acc[r.name] = r.value; return acc; }, {});
  }

  static async set(name, value) {
    const exists = await db('settings').where({ name }).first();
    if (exists) {
      return db('settings').where({ name }).update({ value, updated_at: db.fn.now() });
    }
    return db('settings').insert({ name, value });
  }

  static async setMany(obj) {
    return Promise.all(Object.entries(obj).map(([k, v]) => this.set(k, v)));
  }
}

module.exports = SettingModel;
