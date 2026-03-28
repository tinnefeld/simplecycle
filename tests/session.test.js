import { createSession } from '../src/session/session.js';

function makeSession(overrides = {}) {
  const ticks = [];
  const session = createSession({
    distanceFn: () => 10, // 10 m/s for predictable distance
    onTick: (s) => ticks.push({ ...s }),
    timerFn: (fn, _ms) => { fn(); return 1; }, // fires immediately once
    clearTimerFn: () => {},
    ...overrides,
  });
  return { session, ticks };
}

describe('Session state machine', () => {
  test('starts in idle state', () => {
    const { session } = makeSession();
    expect(session.state.status).toBe('idle');
  });

  test('transitions idle → active on start()', () => {
    const { session } = makeSession();
    session.start();
    expect(session.state.status).toBe('active');
  });

  test('transitions active → paused on pause()', () => {
    const { session } = makeSession({ timerFn: () => 1, clearTimerFn: () => {} });
    session.start();
    session.pause();
    expect(session.state.status).toBe('paused');
  });

  test('transitions paused → active on resume()', () => {
    const { session } = makeSession({ timerFn: () => 1, clearTimerFn: () => {} });
    session.start();
    session.pause();
    session.resume();
    expect(session.state.status).toBe('active');
  });

  test('transitions active → completed on stop()', () => {
    const { session } = makeSession({ timerFn: () => 1, clearTimerFn: () => {} });
    session.start();
    session.stop();
    expect(session.state.status).toBe('completed');
  });

  test('ignores start() when already active', () => {
    const { session } = makeSession({ timerFn: () => 1, clearTimerFn: () => {} });
    session.start();
    session.start(); // should be a no-op
    expect(session.state.status).toBe('active');
  });

  test('ignores pause() when idle', () => {
    const { session } = makeSession();
    session.pause();
    expect(session.state.status).toBe('idle');
  });

  test('ignores stop() when already completed', () => {
    const { session } = makeSession({ timerFn: () => 1, clearTimerFn: () => {} });
    session.start();
    session.stop();
    session.stop(); // no-op
    expect(session.state.status).toBe('completed');
  });
});

describe('Session tick', () => {
  test('increments elapsedSecs each tick', () => {
    let tickCount = 0;
    let tickFn;
    const session = createSession({
      distanceFn: () => 0,
      timerFn: (fn) => { tickFn = fn; return 1; },
      clearTimerFn: () => {},
    });
    session.start();
    tickFn(); tickFn();
    expect(session.state.elapsedSecs).toBe(2);
  });

  test('accumulates distance each tick', () => {
    let tickFn;
    const session = createSession({
      distanceFn: () => 5,
      timerFn: (fn) => { tickFn = fn; return 1; },
      clearTimerFn: () => {},
    });
    session.start();
    tickFn(); tickFn(); tickFn();
    expect(session.state.distanceMeters).toBe(15);
  });
});

describe('Session updatePower / updateCadence', () => {
  test('stores latest power reading', () => {
    const { session } = makeSession({ timerFn: () => 1 });
    session.start();
    session.updatePower(220);
    expect(session.state.currentWatts).toBe(220);
  });

  test('stores latest cadence reading', () => {
    const { session } = makeSession({ timerFn: () => 1 });
    session.start();
    session.updateCadence(90);
    expect(session.state.currentCadence).toBe(90);
  });
});
