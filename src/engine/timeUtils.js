export function pad(n) { return String(n).padStart(2, '0'); }

export function parseDateOnly(value) {
  const s = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split('/').map(Number);
    return new Date(y, m - 1, d);
  }
  return null;
}

export function dateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function normalizeDate(value) {
  const d = parseDateOnly(value);
  return d ? dateKey(d) : null;
}

export function parseClock(value) {
  const m = String(value).trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

export function toDateTime(date, time) {
  const d = parseDateOnly(date);
  const t = parseClock(time);
  if (!d || !t) return null;
  const result = new Date(d.getFullYear(), d.getMonth(), d.getDate(), t.hour, t.minute, 0, 0);
  return result;
}

export function shiftTimes(shift) {
  const start = toDateTime(shift.date, shift.start);
  const endBase = toDateTime(shift.date, shift.end);
  if (!start || !endBase) return { start: null, end: null };
  const end = new Date(endBase);
  if (end < start) end.setDate(end.getDate() + 1);
  return { start, end };
}

export function shiftHours(shift) {
  const { start, end } = shiftTimes(shift);
  if (!start || !end || end <= start) return 0;
  return (end - start) / 36e5;
}

export function isNightShift(shift) {
  const t = parseClock(shift.start);
  if (!t) return false;
  const mins = t.hour * 60 + t.minute;
  return mins >= 20 * 60 || mins < 4 * 60;
}

export function getNightDate(shift) {
  const d = parseDateOnly(shift.date);
  const t = parseClock(shift.start);
  if (!d || !t) return null;
  if (t.hour < 4) d.setDate(d.getDate() - 1);
  return dateKey(d);
}

export function hoursBetween(a, b) { return (b - a) / 36e5; }

export function parseReferenceNow(value) {
  const m = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!m) return null;
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4]), Number(m[5]));
}

export function formatDateShort(dateKeyValue) {
  const d = parseDateOnly(dateKeyValue);
  return d ? d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }) : dateKeyValue;
}

export function formatDateTime(value) {
  return value.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
}
