import { normalizeDate, parseClock, shiftHours } from './timeUtils';

const VALID_WARDS = new Set(['ICU', 'GEN', 'ER']);
const VALID_CERTS = new Set(['ICU', 'FLOAT']);

function normalizeWard(value) {
  const ward = String(value ?? '').trim().toUpperCase();
  return VALID_WARDS.has(ward) ? ward : null;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function importData(rawJson) {
  let raw;
  const report = [];
  try {
    raw = typeof rawJson === 'string' ? JSON.parse(rawJson) : clone(rawJson);
  } catch {
    return { roster: { nurses: [], shifts: [] }, report: [{ type: 'REJECTED', record: 'INPUT', message: 'Invalid JSON.' }] };
  }

  if (!raw || !Array.isArray(raw.nurses) || !Array.isArray(raw.shifts)) {
    return { roster: { nurses: [], shifts: [] }, report: [{ type: 'REJECTED', record: 'INPUT', message: 'Expected nurses and shifts arrays.' }] };
  }

  const nurses = [];
  const nurseById = new Map();
  for (const nurse of raw.nurses) {
    const id = String(nurse?.id ?? '').trim();
    if (!id) {
      report.push({ type: 'REJECTED', record: 'nurse', message: 'Missing nurse id.' });
      continue;
    }
    const ward = normalizeWard(nurse.ward);
    if (!ward) {
      report.push({ type: 'REJECTED', record: id, message: `Unknown ward: ${nurse.ward}.` });
      continue;
    }
    const certs = Array.isArray(nurse.certs)
      ? [...new Set(nurse.certs.map(c => String(c).trim().toUpperCase()).filter(c => VALID_CERTS.has(c)))]
      : [];
    const seniorityYears = Number(nurse.seniorityYears);
    if (!Number.isFinite(seniorityYears)) {
      report.push({ type: 'REJECTED', record: id, message: 'Invalid seniorityYears.' });
      continue;
    }
    const normalized = { id, name: String(nurse.name ?? '').trim(), ward, certs, seniorityYears };
    if (nurse.ward !== ward || String(nurse.seniorityYears) !== String(seniorityYears)) {
      report.push({ type: 'FIXED', record: id, message: 'Normalized ward/certification/seniority values.' });
    }
    if (nurseById.has(id)) {
      const previous = JSON.stringify(nurseById.get(id));
      const current = JSON.stringify(normalized);
      if (previous === current) report.push({ type: 'FIXED', record: id, message: 'Duplicate identical nurse record removed.' });
      else report.push({ type: 'FIXED', record: id, message: 'Duplicate nurse id resolved by keeping the first normalized record.' });
      continue;
    }
    nurseById.set(id, normalized);
    nurses.push(normalized);
  }

  const shifts = [];
  const shiftById = new Map();
  for (const shift of raw.shifts) {
    const id = String(shift?.id ?? '').trim();
    if (!id) {
      report.push({ type: 'REJECTED', record: 'shift', message: 'Missing shift id.' });
      continue;
    }
    if (shiftById.has(id)) {
      const existing = shiftById.get(id);
      const candidate = { ...shift, id };
      if (JSON.stringify(existing.raw) === JSON.stringify(candidate)) {
        report.push({ type: 'FIXED', record: id, message: 'Duplicate identical shift record removed.' });
      } else {
        report.push({ type: 'REJECTED', record: id, message: 'Duplicate shift id with different content; kept the first record.' });
      }
      continue;
    }
    if (!nurseById.has(String(shift.nurseId).trim())) {
      report.push({ type: 'REJECTED', record: id, message: `Unknown nurse ${shift.nurseId}.` });
      continue;
    }
    const date = normalizeDate(shift.date);
    const start = parseClock(shift.start);
    const end = parseClock(shift.end);
    const ward = normalizeWard(shift.ward);
    if (!date) { report.push({ type: 'REJECTED', record: id, message: `Invalid date ${shift.date}.` }); continue; }
    if (!start || !end) { report.push({ type: 'REJECTED', record: id, message: 'Invalid start/end time.' }); continue; }
    if (!ward) { report.push({ type: 'REJECTED', record: id, message: `Unknown ward ${shift.ward}.` }); continue; }
    const normalized = { id, nurseId: String(shift.nurseId).trim(), ward, date, start: `${String(start.hour).padStart(2, '0')}:${String(start.minute).padStart(2, '0')}`, end: `${String(end.hour).padStart(2, '0')}:${String(end.minute).padStart(2, '0')}` };
    if (shift.end === shift.start) {
      report.push({ type: 'REJECTED', record: id, message: 'Zero-duration shift (start equals end).' });
      continue;
    }
    if (shift.date !== date || shift.ward !== ward) {
      report.push({ type: 'FIXED', record: id, message: `Normalized date/ward to ${date}/${ward}.` });
    }
    shiftById.set(id, { raw: { ...shift, id }, value: normalized });
    shifts.push(normalized);
  }

  // Attach a simple diagnostic for any shift whose duration is unusual.
  for (const s of shifts) {
    if (shiftHours(s) > 24) report.push({ type: 'REJECTED', record: s.id, message: 'Shift duration exceeds 24 hours.' });
  }

  return { roster: { nurses, shifts }, report };
}
