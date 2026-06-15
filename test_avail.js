const AvailabilityService = require('./src/services/AvailabilityService');

(async () => {
  try {
    const dates = await AvailabilityService.getAvailableDates(2, 60, 2026, 6);
    console.log('Dates:', dates);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
