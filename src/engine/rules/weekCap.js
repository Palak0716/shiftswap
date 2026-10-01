import { affectedNurses, simulateRoster, evaluateWeekCap } from './common';

export function checkWeekCap(roster, request, config) {
  const next = simulateRoster(roster, request);
  return affectedNurses(request, roster).flatMap(id => evaluateWeekCap(next, id, config));
}
