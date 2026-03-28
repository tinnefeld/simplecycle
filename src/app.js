// Entry point — wires Bluetooth → session → workout → UI.

import { createTrainer } from './bluetooth/bluetooth.js';
import { createSession } from './session/session.js';
import { createWorkout } from './workout/workout.js';
import { initControls } from './ui/controls.js';
import { updateDisplay, updateConnectionStatus, showError } from './ui/display.js';

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch((err) => {
    console.error('Service worker registration failed:', err);
  });
}

// Check for Web Bluetooth support
if (!navigator.bluetooth) {
  showError('Web Bluetooth is not supported. Please open SimpleCycle in Chrome.');
}

// --- Module instances ---
const trainer = createTrainer();
let workout = null;

const session = createSession({
  onTick(state) {
    if (workout) {
      // Advance the workout interval on each real 1 Hz tick.
      const intervalChanged = workout.tick();
      if (intervalChanged && !workout.isDone()) {
        const next = workout.currentInterval();
        trainer.setTargetPower(next.targetWatts).catch(() => {});
      }
      if (workout.isDone()) {
        session.stop();
        updateDisplay(session.state, workout);
        return;
      }
    }
    updateDisplay(state, workout);
  },
});

// --- Bluetooth event callbacks ---
trainer.onPower = (watts) => {
  session.updatePower(watts);
};

trainer.onCadence = (rpm) => {
  session.updateCadence(rpm);
};

trainer.onDisconnect = () => {
  updateConnectionStatus('disconnected');
  if (session.state.status === 'active') {
    session.pause();
    showError('Trainer disconnected. Session paused.');
  }
};

// Proxy trainer.connect/disconnect to update UI status
const originalConnect = trainer.connect.bind(trainer);
trainer.connect = async () => {
  updateConnectionStatus('connecting');
  await originalConnect();
  updateConnectionStatus('connected');
  // Send initial resistance if workout already loaded
  if (workout && !workout.isDone()) {
    trainer.setTargetPower(workout.currentInterval().targetWatts).catch(() => {});
  }
};

// --- Controls ---
initControls({
  trainer,
  session,
  onWorkoutLoaded(plan) {
    workout = plan ? createWorkout(plan) : null;
  },
  onError: showError,
  onAction() {
    if (session.state.status === 'idle') workout = null;
    updateDisplay(session.state, workout);
  },
});

// Initial UI state
updateConnectionStatus('disconnected');
updateDisplay(session.state, workout);
