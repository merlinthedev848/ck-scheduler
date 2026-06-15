const db = require('./config/db');

(async () => {
  try {
    const plans = await db('working_plans').select('*');
    console.log('Working Plans:', plans);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
