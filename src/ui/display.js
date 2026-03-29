/**
 * Metrics display — renders session state and connection status to the DOM.
 */

/**
 * Format seconds as MM:SS.
 * @param {number} totalSecs
 * @returns {string}
 */
function formatTime(totalSecs) {
  const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSecs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Update all metric displays from session state.
 *
 * @param {import('../session/session.js').SessionState} state
 * @param {import('../workout/workout.js')} workout - current workout instance or null
 */
export function updateDisplay(state, workout) {
  document.getElementById('metric-power').textContent =
    state.currentWatts > 0 ? String(state.currentWatts) : '--';

  document.getElementById('metric-cadence').textContent =
    state.currentCadence > 0 ? String(state.currentCadence) : '--';

  document.getElementById('metric-time').textContent =
    formatTime(state.elapsedSecs);

  document.getElementById('metric-distance').textContent =
    (state.distanceMeters / 1000).toFixed(2);

  // Interval section
  const section = document.getElementById('section-interval');
  if (workout && !workout.isDone()) {
    const interval = workout.currentInterval();
    section.hidden = false;

    const typeEl = document.getElementById('interval-type');
    typeEl.textContent = interval.type.toUpperCase();
    typeEl.className = `interval-type ${interval.type}`;

    document.getElementById('interval-target').textContent =
      `${interval.targetWatts} W`;

    document.getElementById('interval-countdown').textContent =
      formatTime(workout.remainingSecs());
  } else {
    section.hidden = true;
  }

  // Session control button visibility
  updateSessionButtons(state.status);
}

/**
 * Update Start/Pause/Resume/Stop button visibility based on session status.
 * @param {'idle'|'active'|'paused'|'completed'} status
 */
export function updateSessionButtons(status) {
  const btnStart  = document.getElementById('btn-start');
  const btnPause  = document.getElementById('btn-pause');
  const btnResume = document.getElementById('btn-resume');
  const btnStop   = document.getElementById('btn-stop');

  btnStart.hidden  = status !== 'idle';
  btnPause.hidden  = status !== 'active';
  btnResume.hidden = status !== 'paused';
  btnStop.hidden   = status === 'idle' || status === 'completed';

  const ftpInput = document.getElementById('ftp-input');
  if (ftpInput) ftpInput.disabled = status === 'active' || status === 'paused';
}

/**
 * Update the connection status indicator.
 * @param {'disconnected'|'connecting'|'connected'} status
 */
export function updateConnectionStatus(status) {
  const el = document.getElementById('connection-status');
  const label = document.getElementById('status-label');

  el.className = `connection-status ${status}`;
  label.textContent = status.charAt(0).toUpperCase() + status.slice(1);

  const btnConnect    = document.getElementById('btn-connect');
  const btnDisconnect = document.getElementById('btn-disconnect');
  const btnStart      = document.getElementById('btn-start');

  btnConnect.hidden    = status !== 'disconnected';
  btnDisconnect.hidden = status === 'disconnected';
  btnStart.disabled    = status !== 'connected';
}

/**
 * Show an error message to the user.
 * Replaces any existing error; clears after 6 seconds.
 * @param {string} message
 */
export function showError(message) {
  let el = document.getElementById('error-banner');
  if (!el) {
    el = document.createElement('div');
    el.id = 'error-banner';
    el.style.cssText =
      'position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);' +
      'background:#e94560;color:#fff;padding:0.75rem 1.25rem;border-radius:8px;' +
      'font-size:0.9rem;z-index:100;max-width:90vw;text-align:center;';
    document.body.appendChild(el);
  }
  el.textContent = message;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.remove(), 6000);
}
