import { affectedNurses, simulateRoster, evaluateRest } from './common';

export function checkRestGap(roster, request, config) {
  const next = simulateRoster(roster, request);
  return affectedNurses(request, roster).flatMap(id => evaluateRest(next, id, config));
}
