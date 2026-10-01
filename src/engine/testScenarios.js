import { evaluateRequest } from "./evaluateRequest";
import { DEFAULT_CONFIG } from "../config/rules";
import seed from "../seed";

function findShift(shiftId) {
  return seed.shifts.find(
    (shift) => shift.id === shiftId
  );
}

function testGiveAway(name, shiftId, nurseId) {
  const result = evaluateRequest(
    seed,
    {
      type: "GIVE",
      shiftId,
      nurseId
    },
    DEFAULT_CONFIG
  );

  console.log(`\n========== ${name} ==========`);
  console.log(
    `Request: ${shiftId} → ${nurseId}`
  );
  console.log("Status:", result.status);

  console.table(result.reasons);
}

function testSwap(name, shiftAId, shiftBId) {
  const shiftA = findShift(shiftAId);
  const shiftB = findShift(shiftBId);

  if (!shiftA || !shiftB) {
    console.error(
      `${name}: One or both shifts were not found.`
    );
    return;
  }

  console.log(`\n========== ${name} ==========`);

  console.log(
    `${shiftAId} (${shiftA.nurseId}) ↔ ${shiftBId} (${shiftB.nurseId})`
  );

  // Nurse holding A receives B.
  const resultA = evaluateRequest(
    seed,
    {
      type: "SWAP",
      shiftId: shiftBId,
      nurseId: shiftA.nurseId
    },
    DEFAULT_CONFIG
  );

  // Nurse holding B receives A.
  const resultB = evaluateRequest(
    seed,
    {
      type: "SWAP",
      shiftId: shiftAId,
      nurseId: shiftB.nurseId
    },
    DEFAULT_CONFIG
  );

  console.log(
    `\n${shiftBId} → ${shiftA.nurseId}`
  );
  console.log("Status:", resultA.status);
  console.table(resultA.reasons);

  console.log(
    `\n${shiftAId} → ${shiftB.nurseId}`
  );
  console.log("Status:", resultB.status);
  console.table(resultB.reasons);
}


// T1
testSwap(
  "T1 — Swap S06 with S10",
  "S06",
  "S10"
);

// T2
testSwap(
  "T2 — Swap S02 with S04",
  "S02",
  "S04"
);

// T3
testSwap(
  "T3 — Swap S05 with S09",
  "S05",
  "S09"
);

// T4
testSwap(
  "T4 — Swap S03 with S12",
  "S03",
  "S12"
);

// T5
testGiveAway(
  "T5 — Give S15 to N02",
  "S15",
  "N02"
);