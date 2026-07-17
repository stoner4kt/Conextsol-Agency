import { AppState } from './types';

// System date anchored at July 15, 2026
export const CURRENT_DATE_STR = '2026-07-15';

export function getInitialState(): AppState {
  return {
    clients: [],
    projects: [],
    retainers: [],
    documents: [],
    alertsLog: [],
    isAdmin: false,
    userEmail: null,
  };
}

export function saveState(state: AppState) {
  // Production-ready: no local caching of raw database rows
}
