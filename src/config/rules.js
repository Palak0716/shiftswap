export const DEFAULT_CONFIG = {
  now: '2026-10-05T08:00',
  restHours: 11,
  maxNights: 3,
  weekCap: 40,
  lockHours: 4
};

export const CONFIG_LIMITS = {
  restHours: [0, 24],
  maxNights: [0, 14],
  weekCap: [1, 168],
  lockHours: [0, 48]
};