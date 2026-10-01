import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import seed from '../seed';
import { DEFAULT_CONFIG } from '../config/rules';
import { importData } from '../engine/importData';
import { loadStoredState, saveStoredState } from '../utils/storage';
import { readFilters, writeFilters } from '../utils/urlFilters';
import { appReducer } from './appReducer';

const AppContext = createContext(null);

function initialState() {
  const cleaned = importData(seed);
  const stored = loadStoredState();
  const filters = readFilters();
  if (stored.state) return { ...stored.state, ui: { ...stored.state.ui, ...filters } };
  return {
    roster: cleaned.roster,
    cleaningReport: cleaned.report,
    requests: [],
    config: DEFAULT_CONFIG,
    undoStack: [],
    theme: 'system',
    importError: null,
    ui: { selectedShiftId: null, secondShiftId: null, selectedNurseId: null, builderMode: null, liveEvaluation: null, ...filters }
  };
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, initialState);
  const [storageError, setStorageError] = useState(() => loadStoredState().error);

  useEffect(() => {
    if (!state?.roster) return;
    const ok = saveStoredState(state);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!ok) setStorageError('Could not save browser state.');
  }, [state]);

  useEffect(() => writeFilters(state.ui), [state.ui.ward, state.ui.nightOnly, state.ui.search, state.ui]);

  useEffect(() => {
    const root = document.documentElement;
    const desired = state.theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : state.theme;
    root.classList.toggle('dark', desired === 'dark');
  }, [state.theme]);

  const value = useMemo(() => ({ state, dispatch, storageError, setStorageError }), [state, storageError]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() { return useContext(AppContext); }
