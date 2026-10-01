import { getNurse, getShift } from './common';

export function checkWardMismatch(roster, request) {
  const reasons = [];
  if (request.type === 'SWAP') {
    const a = getShift(roster, request.shiftA);
    const b = getShift(roster, request.shiftB);
    const na = a && getNurse(roster, a.nurseId);
    const nb = b && getNurse(roster, b.nurseId);
    if (!a || !b || !na || !nb) return reasons;
    const bothFloat = na.certs.includes('FLOAT') && nb.certs.includes('FLOAT');
    if (!bothFloat) {
      if (na.ward !== b.ward) reasons.push({ code: 'WARD_MISMATCH', severity: 'BLOCK', nurseId: na.id, message: `${na.ward} nurse cannot take ${b.ward} shift without both nurses holding FLOAT.` });
      if (nb.ward !== a.ward) reasons.push({ code: 'WARD_MISMATCH', severity: 'BLOCK', nurseId: nb.id, message: `${nb.ward} nurse cannot take ${a.ward} shift without both nurses holding FLOAT.` });
    }
  } else {
    const shift = getShift(roster, request.shiftId);
    const receiver = getNurse(roster, request.toNurseId);
    if (shift && receiver && receiver.ward !== shift.ward && !receiver.certs.includes('FLOAT')) {
      reasons.push({ code: 'WARD_MISMATCH', severity: 'BLOCK', nurseId: receiver.id, message: `${receiver.ward} nurse cannot take ${shift.ward} shift without FLOAT.` });
    }
  }
  return reasons;
}
