// Lightweight global state store — no external dependencies.
// Berry balance and profile photo live here so they're shared across screens
// and persist while the user navigates around the app.
//
// (State is in-memory only — refreshing the page resets everything,
// same as the rest of the prototype.)

import { useState, useEffect } from 'react';

const INITIAL_STATE = {
  berries: 1240,
  profilePhoto: null,
  // Track redeemed rewards so we can show a redemption history later if wanted
  redemptions: [],
};

let state = { ...INITIAL_STATE };
const listeners = new Set();

function notify() {
  listeners.forEach((fn) => fn(state));
}

export const userStore = {
  get: () => state,

  // Returns true if the deduction succeeded, false if the user doesn't have enough
  spendBerries: (amount, label) => {
    if (state.berries < amount) return false;
    state = {
      ...state,
      berries: state.berries - amount,
      redemptions: [
        { id: `r-${Date.now()}`, amount, label, at: new Date().toISOString() },
        ...state.redemptions,
      ].slice(0, 20),
    };
    notify();
    return true;
  },

  addBerries: (amount) => {
    state = { ...state, berries: state.berries + amount };
    notify();
  },

  setProfilePhoto: (uri) => {
    state = { ...state, profilePhoto: uri };
    notify();
  },

  reset: () => {
    state = { ...INITIAL_STATE };
    notify();
  },

  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

// React hook — subscribes the component to store updates
export function useUserStore() {
  const [snapshot, setSnapshot] = useState(state);
  useEffect(() => userStore.subscribe(setSnapshot), []);
  return snapshot;
}
