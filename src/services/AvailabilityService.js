const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const isBetween = require('dayjs/plugin/isBetween');
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

const { WorkingPlanModel, WorkingPlanExceptionModel } = require('../models/WorkingPlan');
const BlockedPeriodModel = require('../models/BlockedPeriod');
const AppointmentModel = require('../models/Appointment');

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

class AvailabilityService {
  /**
   * Get available time slots for a provider+service on a given date.
   * @param {number} providerId
   * @param {number} serviceDuration - in minutes
   * @param {string} date - YYYY-MM-DD
   * @returns {string[]} Array of available time slot strings ("HH:mm")
   */
  static async getAvailableSlots(providerId, serviceDuration, date) {
    const dayName = DAYS[dayjs(date).day()];

    // 1. Get working plan (check for exception first)
    let dayPlan = null;
    const exceptions = await WorkingPlanExceptionModel.getByProvider(providerId);
    const exception = exceptions.find(e => e.date === date);
    if (exception) {
      dayPlan = exception.plan;
    } else {
      const workingPlan = await WorkingPlanModel.getByProvider(providerId);
      dayPlan = workingPlan ? workingPlan.plan[dayName] : null;
    }

    if (!dayPlan) return []; // Day off

    // 2. Build all possible slots for the working day
    const workStart = dayjs(`${date} ${dayPlan.start}`, 'YYYY-MM-DD HH:mm');
    const workEnd   = dayjs(`${date} ${dayPlan.end}`,   'YYYY-MM-DD HH:mm');
    const breaks    = (dayPlan.breaks || []).map(b => ({
      start: dayjs(`${date} ${b.start}`, 'YYYY-MM-DD HH:mm'),
      end:   dayjs(`${date} ${b.end}`,   'YYYY-MM-DD HH:mm')
    }));

    // 3. Get existing appointments for this provider on this date
    const dayStart = dayjs(date).startOf('day').toDate();
    const dayEnd   = dayjs(date).endOf('day').toDate();
    const existingAppts = await AppointmentModel.getForCalendar({
      start: dayStart,
      end:   dayEnd,
      providerId
    });

    // 4. Get blocked periods
    const blocked = await BlockedPeriodModel.getInRange(providerId, dayStart, dayEnd);

    // 5. Generate slots
    const slots = [];
    let current = workStart.clone();

    while (current.add(serviceDuration, 'minute').isSame(workEnd) || current.add(serviceDuration, 'minute').isBefore(workEnd)) {
      const slotEnd = current.add(serviceDuration, 'minute');

      // Check if slot overlaps any break
      const duringBreak = breaks.some(b =>
        current.isBefore(b.end) && slotEnd.isAfter(b.start)
      );

      // Check if slot overlaps any appointment
      const duringAppt = existingAppts.some(a => {
        const aStart = dayjs(a.start_datetime);
        const aEnd   = dayjs(a.end_datetime);
        return current.isBefore(aEnd) && slotEnd.isAfter(aStart);
      });

      // Check if slot overlaps any blocked period
      const duringBlocked = blocked.some(b => {
        const bStart = dayjs(b.start_datetime);
        const bEnd   = dayjs(b.end_datetime);
        return current.isBefore(bEnd) && slotEnd.isAfter(bStart);
      });

      // Skip past slots (add 5 min buffer)
      const isPast = current.isBefore(dayjs().add(5, 'minute'));

      if (!duringBreak && !duringAppt && !duringBlocked && !isPast) {
        slots.push(current.format('HH:mm'));
      }

      current = current.add(serviceDuration, 'minute');
    }

    return slots;
  }

  /**
   * Get available dates (days with at least one slot) in a given month.
   */
  static async getAvailableDates(providerId, serviceDuration, year, month) {
    const startDate = dayjs(`${year}-${String(month).padStart(2, '0')}-01`);
    const endDate   = startDate.endOf('month');
    const available = [];

    let d = startDate;
    while (d.isSame(endDate) || d.isBefore(endDate)) {
      const slots = await this.getAvailableSlots(providerId, serviceDuration, d.format('YYYY-MM-DD'));
      if (slots.length > 0) available.push(d.format('YYYY-MM-DD'));
      d = d.add(1, 'day');
    }

    return available;
  }
}

module.exports = AvailabilityService;
