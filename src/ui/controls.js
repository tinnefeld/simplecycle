/**
 * UI controls — button and file input event handlers.
 *
 * Wired to the DOM in app.js. Each handler receives the relevant
 * module instances so this file stays pure of global state.
 */

import { parseWorkout } from '../workout/parser.js';

/**
 * @param {Object} opts
 * @param {import('../bluetooth/bluetooth.js').Trainer} opts.trainer
 * @param {ReturnType<import('../session/session.js').createSession>} opts.session
 * @param {(plan: import('../workout/parser.js').WorkoutPlan | null) => void} opts.onWorkoutLoaded
 * @param {(err: string) => void} opts.onError
 */
export function initControls({ trainer, session, onWorkoutLoaded, onError, onAction }) {
  // Connect / disconnect
  document.getElementById('btn-connect').addEventListener('click', async () => {
    try {
      await trainer.connect();
    } catch (err) {
      onError(err.message);
    }
  });

  document.getElementById('btn-disconnect').addEventListener('click', async () => {
    await trainer.disconnect();
  });

  // Session controls
  document.getElementById('btn-start').addEventListener('click', () => { session.start(); if (onAction) onAction(); });
  document.getElementById('btn-pause').addEventListener('click', () => { session.pause(); if (onAction) onAction(); });
  document.getElementById('btn-resume').addEventListener('click', () => { session.resume(); if (onAction) onAction(); });
  document.getElementById('btn-stop').addEventListener('click', () => { session.stop(); session.reset(); if (onAction) onAction(); });

  // Workout file loader
  document.getElementById('workout-file').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const plan = parseWorkout(e.target.result);
        document.getElementById('workout-name').textContent = plan.name;
        onWorkoutLoaded(plan);
      } catch (err) {
        onError(`Could not load workout: ${err.message}`);
        onWorkoutLoaded(null);
      }
    };
    reader.readAsText(file);
  });
}
