import { getNurse, getShift, makeReason } from "./common";
import { isNightShift } from "../timeUtils";

export function checkSkillMissing(roster, nurseId, shiftId) {
  const nurse = getNurse(roster, nurseId);
  const shift = getShift(roster, shiftId);

  if (!nurse || !shift) {
    return null;
  }

  const isIcuNight =
    shift.ward === "ICU" &&
    isNightShift(shift);

  if (!isIcuNight) {
    return null;
  }

  const hasIcuCertification =
    Array.isArray(nurse.certs) &&
    nurse.certs.includes("ICU");

  if (!hasIcuCertification) {
    return makeReason({
      code: "SKILL_MISSING",
      severity: "BLOCK",
      nurseId,
      shiftId,
      message: `${nurseId} does not have ICU certification for an ICU night shift.`
    });
  }

  return null;
}