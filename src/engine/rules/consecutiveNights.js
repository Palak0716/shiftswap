import { affectedNurses, simulateRoster, evaluateConsecutiveNights } from './common';

export function checkConsecutiveNights(roster, request, config) {
  const next = simulateRoster(roster, request);
  return affectedNurses(request, roster).flatMap(id => evaluateConsecutiveNights(next, id, config));
}
