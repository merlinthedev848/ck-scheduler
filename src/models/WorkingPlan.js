const db = require('../../config/db');
const { defaultWorkingPlan } = require('../../config/app');

class WorkingPlanModel {
  static table = 'working_plans';

  static async getByProvider(providerId) {
    const row = await db(this.table).where({ provider_id: providerId }).first();
    if (!row) return null;
    return { ...row, plan: typeof row.plan === 'string' ? JSON.parse(row.plan) : row.plan };
  }

  static async upsert(providerId, plan) {
    const existing = await db(this.table).where({ provider_id: providerId }).first();
    const planJson = JSON.stringify(plan);
    if (existing) {
      return db(this.table).where({ provider_id: providerId }).update({ plan: planJson, updated_at: db.fn.now() });
    }
    return db(this.table).insert({ provider_id: providerId, plan: planJson });
  }

  static async createDefault(providerId) {
    return this.upsert(providerId, defaultWorkingPlan);
  }
}

class WorkingPlanExceptionModel {
  static table = 'working_plan_exceptions';

  static async getByProvider(providerId) {
    const rows = await db(this.table).where({ provider_id: providerId }).orderBy('date');
    return rows.map(r => ({ ...r, plan: r.plan ? (typeof r.plan === 'string' ? JSON.parse(r.plan) : r.plan) : null }));
  }

  static async upsert(providerId, date, plan) {
    const existing = await db(this.table).where({ provider_id: providerId, date }).first();
    const planJson = plan ? JSON.stringify(plan) : null;
    if (existing) {
      return db(this.table).where({ provider_id: providerId, date }).update({ plan: planJson });
    }
    return db(this.table).insert({ provider_id: providerId, date, plan: planJson });
  }

  static async delete(providerId, date) {
    return db(this.table).where({ provider_id: providerId, date }).delete();
  }
}

module.exports = { WorkingPlanModel, WorkingPlanExceptionModel };
