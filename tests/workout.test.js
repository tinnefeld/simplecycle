import { createWorkout } from '../src/workout/workout.js';

const PLAN = {
  name: 'Test',
  intervals: [
    { type: 'warmup', durationSecs: 3, targetWatts: 100 },
    { type: 'work',   durationSecs: 2, targetWatts: 250 },
  ],
};

describe('createWorkout', () => {
  test('starts on the first interval', () => {
    const w = createWorkout(PLAN);
    expect(w.currentInterval().type).toBe('warmup');
    expect(w.intervalIndex).toBe(0);
  });

  test('remainingSecs returns full duration at start', () => {
    const w = createWorkout(PLAN);
    expect(w.remainingSecs()).toBe(3);
  });

  test('tick decrements remainingSecs', () => {
    const w = createWorkout(PLAN);
    w.tick();
    expect(w.remainingSecs()).toBe(2);
  });

  test('tick returns false while within an interval', () => {
    const w = createWorkout(PLAN);
    expect(w.tick()).toBe(false);
  });

  test('tick returns true when interval completes and advances to next', () => {
    const w = createWorkout(PLAN);
    w.tick(); w.tick();
    const advanced = w.tick(); // 3rd tick = end of warmup (durationSecs: 3)
    expect(advanced).toBe(true);
    expect(w.currentInterval().type).toBe('work');
    expect(w.intervalIndex).toBe(1);
  });

  test('isDone() is false before last interval completes', () => {
    const w = createWorkout(PLAN);
    expect(w.isDone()).toBe(false);
  });

  test('isDone() is true after all intervals complete', () => {
    const w = createWorkout(PLAN);
    // warmup: 3 ticks, work: 2 ticks
    for (let i = 0; i < 5; i++) w.tick();
    expect(w.isDone()).toBe(true);
  });

  test('currentInterval() returns null when done', () => {
    const w = createWorkout(PLAN);
    for (let i = 0; i < 5; i++) w.tick();
    expect(w.currentInterval()).toBeNull();
  });

  test('remainingSecs() returns 0 when done', () => {
    const w = createWorkout(PLAN);
    for (let i = 0; i < 5; i++) w.tick();
    expect(w.remainingSecs()).toBe(0);
  });

  test('tick() returns false and is a no-op when done', () => {
    const w = createWorkout(PLAN);
    for (let i = 0; i < 5; i++) w.tick();
    expect(w.tick()).toBe(false);
    expect(w.isDone()).toBe(true);
  });
});
