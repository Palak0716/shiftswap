
function sameShift(a, b) {
  const aIds = a.type === 'GIVE' ? [a.shiftId] : [a.shiftA, a.shiftB];
  const bIds = b.type === 'GIVE' ? [b.shiftId] : [b.shiftA, b.shiftB];
  return aIds.some(id => bIds.includes(id));
}

function seniority(roster, request) {
  const nurse = roster.nurses.find(n => n.id === request.requestedBy);
  return nurse?.seniorityYears ?? 0;
}

function createdAt(request) { return new Date(request.createdAt).getTime(); }

export function resolveQueue(roster, pendingRequests) {
  const active = pendingRequests.map(r => ({ ...r, state: r.state ?? 'PENDING_CHARGE' }));
  const superseded = [];
  const winners = [];
  const seen = new Set();
  for (const request of active) {
    if (seen.has(request.id)) continue;
    const competitors = active.filter(other => other.id !== request.id && sameShift(request, other) && !superseded.some(x => x.id === other.id));
    let winner = request;
    for (const other of competitors) {
      const diff = Math.abs(createdAt(request) - createdAt(other));
      if (diff <= 30 * 60 * 1000) {
        const sA = seniority(roster, winner);
        const sB = seniority(roster, other);
        if (sB > sA || (sB === sA && createdAt(other) < createdAt(winner))) winner = other;
      } else if (createdAt(other) < createdAt(winner)) winner = other;
    }
    winners.push(winner);
    for (const other of competitors) {
      if (other.id !== winner.id) superseded.push({ ...other, state: 'SUPERSEDED', supersededBy: winner.id, reason: `Conflicts with ${winner.id}.` });
    }
    seen.add(request.id);
    competitors.forEach(c => seen.add(c.id));
  }
  return { winners: winners.filter((v, i, a) => a.findIndex(x => x.id === v.id) === i), superseded };
}
