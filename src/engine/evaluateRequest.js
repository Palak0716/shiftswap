import { checkWardMismatch } from "./rules/wardMismatch";
import { checkSkillMissing } from "./rules/skillMissing";
import { checkRestGap } from "./rules/restGap";
import { checkConsecutiveNights } from "./rules/consecutiveNights";
import { checkWeekCap } from "./rules/weekCap";
import { checkLockWindow } from "./rules/lockWindow";
import { checkInPast } from "./rules/inPast";

export function evaluateRequest(roster, request, config) {
  const reasons = [];

  /*
    A request should look like:

    {
      type: "GIVE",
      shiftId: "S15",
      nurseId: "N02"
    }

    or:

    {
      type: "SWAP",
      shiftId: "S06",
      nurseId: "N10"
    }

    The nurseId represents the nurse who will receive
    the proposed shift.
  */

  const { shiftId, nurseId } = request;

  if (!shiftId || !nurseId) {
    return {
      status: "REJECTED",
      reasons: [
        {
          code: "INVALID_REQUEST",
          severity: "BLOCK",
          nurseId: nurseId || "UNKNOWN",
          shiftId: shiftId || "UNKNOWN",
          message: "A nurse and shift are required."
        }
      ]
    };
  }

  // Run all seven rules.
  const ruleResults = [
    checkWardMismatch(roster, nurseId, shiftId),
    checkSkillMissing(roster, nurseId, shiftId),
    checkRestGap(roster, nurseId, shiftId, config),
    checkConsecutiveNights(
      roster,
      nurseId,
      shiftId,
      config
    ),
    checkWeekCap(
      roster,
      nurseId,
      shiftId,
      config
    ),
    checkLockWindow(
      roster,
      nurseId,
      shiftId,
      config
    ),
    checkInPast(
      roster,
      nurseId,
      shiftId,
      config
    )
  ];

  // Remove null results.
  ruleResults.forEach((result) => {
    if (result) {
      reasons.push(result);
    }
  });

  // Remove duplicate reasons.
  const uniqueReasons = reasons.filter(
    (reason, index, array) =>
      index ===
      array.findIndex(
        (item) =>
          item.code === reason.code &&
          item.nurseId === reason.nurseId &&
          item.shiftId === reason.shiftId
      )
  );

  // BLOCK reasons first, then WARN reasons.
  // Within the same severity, sort by nurse ID.
  uniqueReasons.sort((a, b) => {
    if (a.severity !== b.severity) {
      return a.severity === "BLOCK" ? -1 : 1;
    }

    return String(a.nurseId).localeCompare(
      String(b.nurseId)
    );
  });

  // Determine final request status.
  let status = "APPROVED";

  if (
    uniqueReasons.some(
      (reason) => reason.severity === "BLOCK"
    )
  ) {
    status = "REJECTED";
  } else if (
    uniqueReasons.some(
      (reason) => reason.severity === "WARN"
    )
  ) {
    status = "PENDING_CHARGE";
  }

  return {
    status,
    reasons: uniqueReasons
  };
}