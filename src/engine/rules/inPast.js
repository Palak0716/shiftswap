import { getShift } from './common';
import { parseReferenceNow, shiftTimes } from '../timeUtils';

export function checkInPast(roster, request, config) {
  const now = parseReferenceNow(config.now);
  if (!now) return [];
  const ids = request.type === 'GIVE' ? [request.shiftId] : [request.shiftA, request.shiftB];
  const reasons = [];
  for (const id of ids) {
    const shift = getShift(roster, id);
    const start = shift && shiftTimes(shift).start;
    if (shift && start && start <= now) {
      reasons.push({ code: 'IN_PAST', severity: 'BLOCK', nurseId: shift.nurseId, message: `${shift.id} started at or before NOW (${config.now}).` });
    }
  }
  return reasons;
}
