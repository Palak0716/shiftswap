const KEY = 'shiftswap-state';
export const SCHEMA_VERSION = 1;

export function loadStoredState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { state: null, error: null };
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== SCHEMA_VERSION) return { state: null, error: `Stored schema version ${parsed.schemaVersion ?? 'unknown'} is not supported.` };
    return { state: parsed.state, error: null };
  } catch {
    return { state: null, error: 'Stored ShiftSwap data is corrupt.' };
  }
}

export function saveStoredState(state) {
  try { localStorage.setItem(KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, state })); return true; } catch { return false; }
}
export function clearStoredState() { localStorage.removeItem(KEY); }
