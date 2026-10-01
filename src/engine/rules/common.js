import { getNightDate, isNightShift, shiftHours, shiftTimes, hoursBetween, parseReferenceNow } from '../timeUtils';

export function getNurse(roster, id) { return roster.nurses.find(n => n.id === id); }
export function getShift(roster, id) { return roster.shifts.find(s => s.id === id); }
export function affectedNurses(request, roster) {
  if (request.type === 'GIVE') return [request.shiftId && getShift(roster, request.shiftId)?.nurseId, request.toNurseId].filter(Boolean);
  const a = getShift(roster, request.shiftA);
  const b = getShift(roster, request.shiftB);
  return [a?.nurseId, b?.nurseId].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i);
}

export function simulateRoster(roster, request) {
  const next = structuredClone(roster);
  if (request.type === 'SWAP') {
    const a = getShift(next, request.shiftA);
    const b = getShift(next, request.shiftB);
    if (a && b) [a.nurseId, b.nurseId] = [b.nurseId, a.nurseId];
  } else if (request.type === 'GIVE') {
    const s = getShift(next, request.shiftId);
    if (s) s.nurseId = request.toNurseId;
  }
  return next;
}

export function shiftsForNurse(roster, nurseId) {
  return roster.shifts.filter(s => s.nurseId === nurseId).sort((a, b) => shiftTimes(a).start - shiftTimes(b).start);
}

export function evaluateRest(roster, nurseId, config) {
  const shifts = shiftsForNurse(roster, nurseId);
  const reasons = [];
  for (let i = 0; i < shifts.length - 1; i++) {
    const current = shiftTimes(shifts[i]);
    const next = shiftTimes(shifts[i + 1]);
    if (!current.start || !next.start) continue;
    const rest = hoursBetween(current.end, next.start);
    if (rest < config.restHours) {
      reasons.push({ code: 'REST_GAP', severity: 'BLOCK', nurseId, message: `${Number(rest.toFixed(2))}h rest, needs ${config.restHours}h.` });
    }
  }
  return reasons;
}

export function evaluateConsecutiveNights(roster, nurseId, config) {
  const nights = shiftsForNurse(roster, nurseId).filter(isNightShift).map(getNightDate).filter(Boolean).sort();
  const unique = [...new Set(nights)];
  const reasons = [];
  let run = 0;
  let previous = null;
  for (const date of unique) {
    const d = new Date(`${date}T00:00:00`);
    if (previous) {
      const p = new Date(`${previous}T00:00:00`);
      const diff = (d - p) / 86400000;
      run = diff === 1 ? run + 1 : 1;
    } else run = 1;
    if (run > config.maxNights) {
      reasons.push({ code: 'CONSECUTIVE_NIGHTS', severity: 'BLOCK', nurseId, message: `${run} consecutive night shifts, max ${config.maxNights}.` });
      break;
    }
    previous = date;
  }
  return reasons;
}

export function evaluateWeekCap(roster, nurseId, config) {
  const shifts = shiftsForNurse(roster, nurseId);
  const reasons = [];
  for (const anchor of shifts) {
    const anchorStart = shiftTimes(anchor).start;
    const windowStart = new Date(anchorStart.getTime() - 168 * 36e5);
    const hours = shifts.reduce((sum, s) => {
      const { start, end } = shiftTimes(s);
      if (!start || !end || end <= windowStart || start >= anchorStart) return sum;
      const clippedStart = start < windowStart ? windowStart : start;
      const clippedEnd = end > anchorStart ? anchorStart : end;
      return sum + Math.max(0, (clippedEnd - clippedStart) / 36e5);
    }, 0);
    const candidate = hours + shiftHours(anchor);
    if (candidate > config.weekCap) {
      reasons.push({ code: 'WEEK_CAP', severity: 'BLOCK', nurseId, message: `${Number(candidate.toFixed(2))}h in a rolling 168h window, cap ${config.weekCap}h.` });
      break;
    }
  }
  return reasons;
}

export function evaluateLockWindow(roster, request, config) {
  const now = parseReferenceNow(config.now);
  const shiftIds = request.type === 'GIVE' ? [request.shiftId] : [request.shiftA, request.shiftB];
  const reasons = [];
  for (const id of shiftIds) {
    const shift = getShift(roster, id);
    const start = shift && shiftTimes(shift).start;
    if (start && now) {
      const hours = hoursBetween(now, start);
      if (hours >= 0 && hours < config.lockHours) {
        reasons.push({ code: 'LOCK_WINDOW', severity: 'WARN', nurseId: shift.nurseId, message: `${Number(hours.toFixed(2))}h until ${shift.id} starts, lock window is ${config.lockHours}h.` });
      }
    }
  }
  return reasons;
}
