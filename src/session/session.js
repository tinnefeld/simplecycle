/**
 * Workout session state machine.
 *
 * States: idle → active ↔ paused → completed
 *
 * Usage:
 *   const session = createSession({ distanceFn, intervalFn, onTick, setInterval, clearInterval });
 *   session.start();
 *   session.pause();
 *   session.resume();
 *   session.stop();
 *   session.updatePower(watts);
 *   session.updateCadence(rpm);
 */

import { metersPerSecondFromWatts } from './distance.js';

/**
 * @typedef {Object} SessionState
 * @property {'idle'|'active'|'paused'|'completed'} status
 * @property {number} elapsedSecs
 * @property {number} currentWatts
 * @property {number} currentCadence
 * @property {number} distanceMeters
 */

/**
 * @typedef {Object} SessionOptions
 * @property {(watts: number) => number} [distanceFn] - Injectable for testing
 * @property {(state: SessionState) => void} [onTick] - Called each second on the timer tick
 * @property {typeof setInterval} [timerFn] - Injectable for testing
 * @property {typeof clearInterval} [clearTimerFn] - Injectable for testing
 */

/**
 * Create a new session.
 * @param {SessionOptions} [options]
 */
export function createSession(options = {}) {
  const {
    distanceFn = metersPerSecondFromWatts,
    onTick = null,
    timerFn = setInterval,
    clearTimerFn = clearInterval,
  } = options;

  /** @type {SessionState} */
  const state = {
    status: 'idle',
    elapsedSecs: 0,
    currentWatts: 0,
    currentCadence: 0,
    distanceMeters: 0,
  };

  let tickHandle = null;

  function tick() {
    state.elapsedSecs += 1;
    state.distanceMeters += distanceFn(state.currentWatts);
    if (onTick) onTick({ ...state });
  }

  const session = {
    /** Read-only snapshot of current state. */
    get state() {
      return { ...state };
    },

    start() {
      if (state.status !== 'idle') return;
      state.status = 'active';
      tickHandle = timerFn(tick, 1000);
    },

    pause() {
      if (state.status !== 'active') return;
      state.status = 'paused';
      clearTimerFn(tickHandle);
      tickHandle = null;
    },

    resume() {
      if (state.status !== 'paused') return;
      state.status = 'active';
      tickHandle = timerFn(tick, 1000);
    },

    stop() {
      if (state.status === 'idle' || state.status === 'completed') return;
      clearTimerFn(tickHandle);
      tickHandle = null;
      state.status = 'completed';
    },

    /** Reset to idle so a new session can be started. */
    reset() {
      if (state.status !== 'completed') return;
      state.status = 'idle';
      state.elapsedSecs = 0;
      state.currentWatts = 0;
      state.currentCadence = 0;
      state.distanceMeters = 0;
    },

    /** Called by the Bluetooth trainer on each power reading. */
    updatePower(watts) {
      state.currentWatts = watts;
    },

    /** Called by the Bluetooth trainer on each cadence reading. */
    updateCadence(rpm) {
      state.currentCadence = rpm;
    },
  };

  return session;
}
