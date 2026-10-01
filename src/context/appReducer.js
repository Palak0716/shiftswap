export function appReducer(state, action) {
  switch (action.type) {
    case 'SELECT_SHIFT': return { ...state, ui: { ...state.ui, selectedShiftId: action.payload } };
    case 'SELECT_SECOND_SHIFT': return { ...state, ui: { ...state.ui, secondShiftId: action.payload } };
    case 'SELECT_GIVE_NURSE': return { ...state, ui: { ...state.ui, selectedNurseId: action.payload } };
    case 'SET_BUILDER_MODE': return { ...state, ui: { ...state.ui, builderMode: action.payload } };
    case 'CLEAR_BUILDER': return { ...state, ui: { ...state.ui, selectedShiftId: null, secondShiftId: null, selectedNurseId: null, builderMode: null, liveEvaluation: null } };
    case 'SET_LIVE_EVALUATION': return { ...state, ui: { ...state.ui, liveEvaluation: action.payload } };
    case 'SET_FILTERS': return { ...state, ui: { ...state.ui, ...action.payload } };
    case 'SET_CONFIG': return { ...state, config: { ...state.config, ...action.payload } };
    case 'ADD_REQUEST': return { ...state, requests: [...state.requests, action.payload] };
    case 'UPDATE_REQUEST': return { ...state, requests: state.requests.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r) };
    case 'REPLACE_ROSTER': return { ...state, roster: action.payload, cleaningReport: action.report, requests: [], undoStack: action.keepUndo ? state.undoStack : [] };
    case 'APPLY_ROSTER': return { ...state, roster: action.payload, cleaningReport: action.report ?? state.cleaningReport, requests: action.requests ?? state.requests, undoStack: action.undoStack ?? state.undoStack };
    case 'PUSH_UNDO': return { ...state, undoStack: [action.snapshot, ...state.undoStack].slice(0, 5) };
    case 'UNDO': return action.snapshot ? { ...state, roster: action.snapshot.roster, requests: action.snapshot.requests, undoStack: state.undoStack.slice(1) } : state;
    case 'SET_THEME': return { ...state, theme: action.payload };
    case 'SET_IMPORT_ERROR': return { ...state, importError: action.payload };
    case 'RESET_ALL': return action.payload;
    default: return state;
  }
}
